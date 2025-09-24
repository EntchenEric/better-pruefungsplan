export const runtime = "nodejs";

import { ExamEntry } from "@/types/exam";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type Item = { text: string; x: number; y: number };

async function readPdfItems(buffer: Buffer): Promise<Item[][]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import("pdfreader"); // CJS module
    const { PdfReader } = mod.PdfReader ?? mod.default?.PdfReader;
    if (!PdfReader) {
        throw new Error('Failed to load PdfReader from "pdfreader" (CJS interop)');
    }
    return new Promise((resolve, reject) => {
        const pages: Item[][] = [];
        let curr: Item[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
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

const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isTime = (s: string) => /^\d{2}:\d{2}$/.test(s);
const isNumberInSet = (s: string, set: number[]) =>
    !isNaN(Number(s)) && set.includes(Number(s));
const isTwoCharsOrSprachenzentrum = (s: string) =>
    s.length === 2 || s === "Sprachenzentrum";

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
        default:
            return true;
    }
}

const parsePdf = (pages: Item[][]): ExamEntry[] => {
    const entries: ExamEntry[] = []

    const headerRows = groupByY(pages[0].slice(0, 10));
    const headerXPositionsSet = new Set<number>();
    for (const row of headerRows) {
        for (const item of row) {
            headerXPositionsSet.add(item.x);
        }
    }
    const headerXPositions = Array.from(headerXPositionsSet).sort((a, b) => a - b);

    const headers: string[] = [];

    for (const xPos of headerXPositions) {
        const combinedTextParts: string[] = [];

        for (const row of headerRows) {
            const textsAtX = row.filter(i => Math.abs(i.x - xPos) < 0.7).map(i => i.text.trim());

            if (textsAtX.length > 0) {
                combinedTextParts.push(textsAtX.join(" "));
            }
        }

        headers.push(combinedTextParts.join(" ").trim());
    }


    const lastHeaderY = headerRows[headerRows.length - 1]?.[0]?.y ?? -Infinity;

    const dataLines: Item[][] = [];

    for (const page of pages) {
        const pageDataItems = page.filter(i => i.y > lastHeaderY + 0.01);
        dataLines.push(...groupByY(pageDataItems, 0.5));
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
        headers.forEach(h => (entry[h] = ""));

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
                .sort(
                    (a, b) =>
                        Math.abs(item.x - (boundaries[a].left + colWidths[a] / 2)) -
                        Math.abs(item.x - (boundaries[b].left + colWidths[b] / 2))
                );

            let assignedIndex: number | null = null;
            const triedFields: string[] = [];

            for (const cIdx of allColsSortedByDistance) {
                const fieldName = headers[cIdx];
                triedFields.push(fieldName);

                if (!occupiedSlots.has(cIdx) && validateField(fieldName, item.text.trim())) {
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
}

export async function GET() {
    const buffer = await fs.readFile(path.join(process.cwd(), "public", "pruefungsplan.pdf"));
    const pages = await readPdfItems(buffer);
    const parsed = parsePdf(pages.splice(0, 3));
    return NextResponse.json({ entries: parsed });
}