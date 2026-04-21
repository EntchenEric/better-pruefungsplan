import { PdfDocument } from "pdf-tables-parser";
import { Buffer } from "buffer";
import { ExamEntry } from "@/types/exam";

export const mapRowToEntry = (row: string[]): ExamEntry | null => {
  if (row.length < 8) return null;
  return {
    mid: row[0]?.trim() || "",
    kuerzel: row[1]?.trim() || "",
    po: row[2]?.trim() || "",
    lp: row[3]?.trim() || "",
    datum: row[4]?.trim() || "",
    zeit: row[5]?.trim() || "",
    pruefungsform: row[6]?.trim() || "",
    pruefungsdauer: row[7]?.trim() || "",
    modul: row[8]?.trim() || "",
    pruefer: row[9]?.trim() || "",
  };
};

export const normalizeRow = (rowData: string[] | string): string[] => {
  if (Array.isArray(rowData)) {
    return rowData.join(" ").trim().split(/\s{2,}|\t+/);
  }
  return rowData.trim().split(/\s{2,}|\t+/);
};

export const parseExamSchedulePDF = async (): Promise<ExamEntry[]> => {
  const response = await fetch("/pruefungsplan.pdf");
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfDoc = new PdfDocument({
    hasTitles: true,
    threshold: 1.5,
    maxStrLength: 100,
    ignoreTexts: [],
  });

  await pdfDoc.load(buffer);

  const pages = pdfDoc.pages.slice(0, 3);
  const allEntries: ExamEntry[] = [];

  pages.forEach((page) => {
    page.tables.forEach((table) => {
      table.data.forEach((row) => {
        const cols = normalizeRow(row.flat());
        const entry = mapRowToEntry(cols);
        if (
          entry &&
          !["mid", "MID", "kuerzel", "Kürzel"].includes(entry.mid.toLowerCase())
        ) {
          allEntries.push(entry);
        }
      });
    });
  });

  return allEntries;
};

export const fetchExamSchedulePDF = async (url: string): Promise<ExamEntry[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfDoc = new PdfDocument({
    hasTitles: true,
    threshold: 1.5,
    maxStrLength: 100,
    ignoreTexts: [],
  });

  await pdfDoc.load(buffer);

  const allEntries: ExamEntry[] = [];
  pdfDoc.pages.forEach((page) => {
    page.tables.forEach((table) => {
      table.data.forEach((row) => {
        const cols = normalizeRow(row.flat());
        const entry = mapRowToEntry(cols);
        if (
          entry &&
          !["mid", "MID", "kuerzel", "Kürzel"].includes(entry.mid.toLowerCase())
        ) {
          allEntries.push(entry);
        }
      });
    });
  });

  return allEntries;
};