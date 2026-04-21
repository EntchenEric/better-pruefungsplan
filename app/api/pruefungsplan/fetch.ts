import { NextResponse } from "next/server";
import { ExamEntry } from "@/types/exam";
import { normalizeRow, mapRowToEntry } from "@/utils/pdfParser";
import { DEFAULT_HIDDEN_COLUMNS } from "@/config/tableConfig";

const WHS_URL = "https://www.w-hs.de/downloads/sdl-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDAyNjExMzMsImV4cCI6MTc3MjgxMTEzMywiYXV0aCI6eyJhdXRoZW50aWNhdGlvbk1ldGhvZCI6IlNlY3JldCIsImF1dGhvclVSTDNcIjoiKGFsbG93ZWQpfX0.eKw5w1Q3yG7xY8F2jL9kM3nP4oR6sT7uV8wX9yA0bC1d/PP_2026_IB_-_Aushang.pdf";

export async function POST() {
  try {
    const response = await fetch(WHS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfDoc = new (await import("pdf-tables-parser")).PdfDocument({
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

    return NextResponse.json({
      timestamp: Date.now(),
      success: true,
      count: allEntries.length,
      data: allEntries,
      hiddenColumns: DEFAULT_HIDDEN_COLUMNS,
      headers: ["mid", "kuerzel", "po", "lp", "datum", "zeit", "pruefungsform", "pruefungsdauer", "modul", "pruefer"],
    });
  } catch (error) {
    console.error("Error fetching and parsing PDF:", error);
    return NextResponse.json(
      { success: false, error: "Prüfungsplan konnte nicht geladen werden" },
      { status: 500 }
    );
  }
}