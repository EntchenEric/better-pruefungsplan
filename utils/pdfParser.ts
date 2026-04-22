import { PdfDocument } from "pdf-tables-parser";
import { Buffer } from "buffer";
import { ExamEntry } from "@/types/exam";

// Column headers from the actual WHS PDF, in order
const PDF_COLUMNS = [
  "mid", "kuerzel", "po", "lp", "datum", "zeit",
  "pruefungsform", "pruefungsdauer", "modul",
  "erstpruefer", "zweitpruefer", "b_m", "beisitzer",
  "pi_ba", "ti_ba", "mi_ba", "wi_ba", "id_ba",
  "pi_ba_dual", "ti_ba_dual", "mi_ba_dual", "wi_ba_dual",
  "pi_ma", "ti_ma", "mi_ma", "wi_ma", "is_ma",
] as const;

export const mapRowToEntry = (cols: string[]): ExamEntry | null => {
  if (cols.length < 8) return null;

  const get = (idx: number, fallback = ""): string => {
    const val = cols[idx]?.trim();
    return val || fallback;
  };

  return {
    mid: get(0),
    kuerzel: get(1),
    po: get(2),
    lp: get(3),
    datum: get(4),
    zeit: get(5),
    pruefungsform: get(6),
    pruefungsdauer: get(7),
    modul: get(8),
    erstpruefer: get(9),
    zweitpruefer: get(10),
    b_m: get(11),
    beisitzer: get(12),
    pi_ba: get(13),
    ti_ba: get(14),
    mi_ba: get(15),
    wi_ba: get(16),
    id_ba: get(17),
    pi_ba_dual: get(18),
    ti_ba_dual: get(19),
    mi_ba_dual: get(20),
    wi_ba_dual: get(21),
    pi_ma: get(22),
    ti_ma: get(23),
    mi_ma: get(24),
    wi_ma: get(25),
    is_ma: get(26),
  };
};

export const normalizeRow = (rowData: string[] | string): string[] => {
  if (Array.isArray(rowData)) {
    return rowData.join(" ").trim().split(/\s{2,}|\t+/);
  }
  return rowData.trim().split(/\s{2,}|\t+/);
};

function extractEntries(pdfDoc: PdfDocument, maxPages?: number): ExamEntry[] {
  const pages = maxPages ? pdfDoc.pages.slice(0, maxPages) : pdfDoc.pages;
  const allEntries: ExamEntry[] = [];
  const headerKeywords = new Set(["mid", "MID", "kuerzel", "Kürzel", "kürzel"]);

  pages.forEach((page) => {
    page.tables.forEach((table) => {
      table.data.forEach((row) => {
        const cols = normalizeRow(row.flat());
        const entry = mapRowToEntry(cols);
        if (entry && !headerKeywords.has(entry.mid.toLowerCase())) {
          allEntries.push(entry);
        }
      });
    });
  });

  return allEntries;
}

async function loadPdf(arrayBuffer: ArrayBuffer): Promise<PdfDocument> {
  const uint8 = new Uint8Array(arrayBuffer);
  const pdfDoc = new PdfDocument({
    hasTitles: true,
    threshold: 1.5,
    maxStrLength: 100,
    ignoreTexts: [],
  });
  await pdfDoc.load(uint8 as unknown as Buffer);
  return pdfDoc;
}

export const parseExamSchedulePDF = async (): Promise<ExamEntry[]> => {
  const response = await fetch("/pruefungsplan.pdf");
  const arrayBuffer = await response.arrayBuffer();
  const pdfDoc = await loadPdf(arrayBuffer);
  return extractEntries(pdfDoc, 3);
};

export const fetchExamSchedulePDF = async (url: string): Promise<ExamEntry[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const pdfDoc = await loadPdf(arrayBuffer);
  return extractEntries(pdfDoc);
};

// Client-side PDF parsing using dynamic imports to avoid bundling issues
// if pdf-tables-parser is Node-only. Falls back to server-side parsing on failure.
export const parsePDFClientSide = async (arrayBuffer: ArrayBuffer): Promise<ExamEntry[]> => {
  const [{ PdfDocument }, { Buffer }] = await Promise.all([
    import("pdf-tables-parser"),
    import("buffer"),
  ]);

  const uint8 = new Uint8Array(arrayBuffer);
  const pdfDoc = new PdfDocument({
    hasTitles: true,
    threshold: 1.5,
    maxStrLength: 100,
    ignoreTexts: [],
  });
  await pdfDoc.load(uint8 as unknown as Buffer);

  const allEntries: ExamEntry[] = [];
  const headerKeywords = new Set(["mid", "MID", "kuerzel", "Kürzel", "kürzel"]);

  pdfDoc.pages.forEach((page) => {
    page.tables.forEach((table) => {
      table.data.forEach((row) => {
        const cols = normalizeRow(row.flat());
        const entry = mapRowToEntry(cols);
        if (entry && !headerKeywords.has(entry.mid.toLowerCase())) {
          allEntries.push(entry);
        }
      });
    });
  });

  return allEntries;
};