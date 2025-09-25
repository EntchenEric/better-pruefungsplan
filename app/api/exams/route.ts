export const runtime = "nodejs";

import { ExamEntry } from "@/types/exam";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isSemester } from "@/utils/urlUtils";

type Item = { text: string; x: number; y: number };

const HEADERS = 28;

/**
 * Reads the contents of the cells from each Table of the PDF.
 *
 * @param buffer The Buffer of the PDF.
 * @returns The Items of the PDF as a 2d Array.
 */
async function readPdfItems(buffer: Buffer): Promise<Item[][]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await import("pdfreader"); // CJS module
  const { PdfReader } = mod;
  if (!PdfReader) {
    throw new Error('Failed to load PdfReader from "pdfreader" (CJS interop)');
  }
  return new Promise((resolve, reject) => {
    const pages: Item[][] = [];
    let curr: Item[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new PdfReader().parseBuffer(buffer, (err: any, item: any): void => {
      if (err) return reject(err);
      if (!item) {
        if (curr.length) pages.push(curr);
        return resolve(pages);
      }
      if (item.page) {
        if (curr.length) pages.push(curr);
        curr = [];
      } else if (item.text != null) {
        curr.push({ text: item.text, x: item.x, y: item.y });
      }
    });
  });
}

/**
 * Groups Items that have simmilar Y-Coordinates.
 * Items with nearly the same Y-Coordinate are in one
 * Row in the Table. They might not have the exact same
 * Y-Coordinates because of compression.
 *
 * @param items The Items to group.
 * @param tolerance
 * @returns The Items grouped by their Y-Corrdinates.
 */
function groupByY(items: Item[], tolerance = 0.1): Item[][] {
  const rows: Item[][] = [];
  const sorted = [...items].sort((a, b) => a.y - b.y);

  let currentRowY = null;
  let currentRowItems: Item[] = [];

  for (const item of sorted) {
    if (currentRowY === null || Math.abs(item.y - currentRowY) <= tolerance) {
      currentRowItems.push(item);
      if (currentRowY === null) currentRowY = item.y;
    } else {
      rows.push(currentRowItems);
      currentRowItems = [item];
      currentRowY = item.y;
    }
  }
  if (currentRowItems.length) rows.push(currentRowItems);

  return rows;
}

/**
 * Rather a String is a Date in Format yyyy-mm-dd.
 * @param s The string to check.
 * @returns true if the string is a Date in format yyyy-mm-dd, false else.
 */
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

/**
 * Rather a String is a time in format hh:mm.
 * @param s The string to check.
 * @returns true if the string is a time in format hh:mm, false else.
 */
const isTime = (s: string) => /^\d{2}:\d{2}$/.test(s);

/**
 * Checks if the string is a Number in a given set of numbers.
 * @param s the string to check.
 * @param set the set the string should be in.
 * @returns true if the string is in the set of numbers, false else.
 */
const isNumberInSet = (s: string, set: number[]) =>
  !isNaN(Number(s)) && set.includes(Number(s));

/**
 * checks if a string is two chars long or equals "Sprachenzentrum".
 * @param s The string to check.
 * @returns true if the string is two chars long or equals "Sprachenzentrum", false else.
 */
const isTwoCharsOrSprachenzentrum = (s: string) =>
  s.length === 2 || s === "Sprachenzentrum";

/**
 * Validates if a value can be in a specified Field.
 * @param fieldName The field the data should be validated against.
 * @param value The data to validate.
 * @returns If the value can be in the field or not.
 */
function validateField(fieldName: string, value: string): boolean {
  switch (fieldName) {
    case "mid":
      return value.length > 0;
    case "kuerzel":
      return value.length <= 4 && isNaN(Number(value));
    case "po":
      return ["2016", "2023"].includes(value);
    case "lp":
      return isNumberInSet(value, [5, 6, 7]);
    case "datum":
      return isDate(value);
    case "zeit":
      return isTime(value);
    case "pruefungsform":
      return value.length >= 5 && isNaN(Number(value));
    case "pruefungsdauer":
      return !isNaN(Number(value));
    case "modul":
      return value.length > 3 && isNaN(Number(value));
    case "pruefer":
      return isTwoCharsOrSprachenzentrum(value) && isNaN(Number(value));
    case "pruefer_name":
      return value.includes(" ") && value.length >= 5;
    case "zweitpruefer":
      return isTwoCharsOrSprachenzentrum(value) && isNaN(Number(value));
    case "b_m":
      return value === "B" || value === "M";
    case "raeume":
      return value.length >= 4 && value.includes(".") && isNaN(Number(value));
    case "beisitzer":
      return value.length > 3 && isNaN(Number(value));
    case "pi_ba":
    case "ti_ba":
    case "mi_ba":
    case "wi_ba":
    case "pi_ba_dual":
    case "ti_ba_dual":
    case "mi_ba_dual":
    case "wi_ba_dual":
    case "pi_ma":
    case "ti_ma":
    case "mi_ma":
    case "wi_ma":
    case "is_ma":
      return isSemester(value);
    default:
      return true;
  }
}

/**
 * Fields that are aligned center in the PDF.
 */
const centerAlignedFields = new Set(["lp", "pruefungsdauer"]);

/**
 * Parses the contents of the PDF to ExamEntries.
 * @param pages the pages of the PDF.
 * @returns The ExamEntries that are found from the PDF.
 */
const parsePdf = (pages: Item[][]): ExamEntry[] => {
  const entries: ExamEntry[] = [];

  const headerRows = groupByY(pages[0].slice(0, HEADERS));
  const headerXPositionsSet = new Set<number>();
  for (const row of headerRows) {
    for (const item of row) {
      headerXPositionsSet.add(item.x);
    }
  }
  const headerXPositions = Array.from(headerXPositionsSet).sort(
    (a, b) => a - b,
  );

  const headers: string[] = [];

  for (const xPos of headerXPositions) {
    const combinedTextParts: string[] = [];

    for (const row of headerRows) {
      const textsAtX = row
        .filter((i) => Math.abs(i.x - xPos) < 0.7)
        .map((i) => i.text.trim());

      if (textsAtX.length > 0) {
        combinedTextParts.push(textsAtX.join(" "));
      }
    }

    headers.push(combinedTextParts.join(" ").trim());
  }

  const lastHeaderY = headerRows[headerRows.length - 1]?.[0]?.y ?? -Infinity;

  const dataLines: Item[][] = [];

  for (const page of pages) {
    const pageDataItems = page.filter((i) => i.y > lastHeaderY + 0.01);
    dataLines.push(...groupByY(pageDataItems, 0.02));
  }

  const colWidths: number[] = [];
  for (let i = 0; i < headerXPositions.length; i++) {
    if (i < headerXPositions.length - 1) {
      colWidths[i] = headerXPositions[i + 1] - headerXPositions[i];
    } else {
      colWidths[i] = 10;
    }
  }

  for (const line of dataLines) {
    line.sort((a, b) => a.x - b.x);

    const occupiedSlots = new Set<number>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entry: any = {};
    headers.forEach((h) => (entry[h] = ""));

    const colWidths: number[] = [];
    for (let i = 0; i < headerXPositions.length; i++) {
      if (i < headerXPositions.length - 1) {
        colWidths[i] = headerXPositions[i + 1] - headerXPositions[i];
      } else {
        colWidths[i] = 10;
      }
    }

    const boundaries = headers.map((_, i) => ({
      left: headerXPositions[i],
      right: headerXPositions[i] + colWidths[i],
    }));

    for (const item of line) {
      const allColsSortedByDistance = headers
        .map((_, i) => i)
        .sort((a, b) => {
          const fieldA = headers[a];
          const fieldB = headers[b];

          const refXA =
            boundaries[a].left +
            (centerAlignedFields.has(fieldA) ? colWidths[a] / 2 : 0);
          const refXB =
            boundaries[b].left +
            (centerAlignedFields.has(fieldB) ? colWidths[b] / 2 : 0);

          return Math.abs(item.x - refXA) - Math.abs(item.x - refXB);
        });

      let assignedIndex: number | null = null;
      const triedFields: string[] = [];

      for (const cIdx of allColsSortedByDistance) {
        const fieldName = headers[cIdx];
        triedFields.push(fieldName);

        if (
          !occupiedSlots.has(cIdx) &&
          validateField(fieldName, item.text.trim())
        ) {
          assignedIndex = cIdx;
          break;
        }
      }

      if (assignedIndex === null) {
        continue;
      }

      entry[headers[assignedIndex]] = item.text.trim();
      occupiedSlots.add(assignedIndex);
    }

    entries.push(entry as ExamEntry);
  }

  return entries;
};

/**
 * Merges pages if the Table is split up into multiple pages.
 * @param pages The pages of the PDF
 * @returns The Items of the PDF merged.
 */
const mergePages = (pages: Item[][]): Item[][] => {
  if (pages.length <= 5) {
    // No merging needed
    return pages;
  }

  const MAX_Y_DIFF = 0.01;

  const half = Math.floor(pages.length / 2);
  const firstHalf = pages.slice(0, half);

  const secondHalf = pages.slice(half).map((page) =>
    page.map((item) => ({
      ...item,
      x: item.x + 100,
    })),
  );

  const mergedPages: Item[][] = [];

  const maxPairs = Math.min(firstHalf.length, secondHalf.length);

  for (let i = 0; i < maxPairs; i++) {
    const mergedItems: Item[] = [];
    const combinedItems = [...firstHalf[i], ...secondHalf[i]].sort(
      (a, b) => a.y - b.y,
    );

    let currentGroupY = combinedItems[0]?.y ?? 0;
    let currentGroup: Item[] = [];

    for (const item of combinedItems) {
      if (Math.abs(item.y - currentGroupY) <= MAX_Y_DIFF) {
        currentGroup.push(item);
      } else {
        mergedItems.push(...currentGroup);

        currentGroupY = item.y;
        currentGroup = [item];
      }
    }

    mergedItems.push(...currentGroup);
    mergedPages.push(mergedItems);
  }

  return mergedPages;
};

export async function GET() {
  const buffer = await fs.readFile(
    path.join(process.cwd(), "public", "pruefungsplan.pdf"),
  );
  const pages = await readPdfItems(buffer);
  const mergedPages = mergePages(pages);
  console.log(mergedPages);
  const parsed = parsePdf(mergedPages);
  return NextResponse.json({ entries: parsed });
}
