import { NextResponse } from "next/server";
import { ExamEntry } from "@/types/exam";
import { normalizeRow, mapRowToEntry } from "@/utils/pdfParser";
import { DEFAULT_HIDDEN_COLUMNS } from "@/config/tableConfig";
import { Buffer } from "buffer";

const WHS_PDF_URL = process.env.WHS_PDF_URL || "https://www.w-hs.de/fileadmin/Oeffentlich/Fachbereich-3/informatik/info-center/bekanntmachungen/pp_2026_ib.pdf";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = body.url || WHS_PDF_URL;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `PDF konnte nicht geladen werden (${response.status} ${response.statusText})` },
        { status: 502 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const { PdfDocument } = await import("pdf-tables-parser");
    const pdfDoc = new PdfDocument({
      hasTitles: true,
      threshold: 1.5,
      maxStrLength: 100,
      ignoreTexts: [],
    });

    await pdfDoc.load(uint8 as unknown as Buffer);

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
    });
  } catch (error) {
    console.error("Error fetching and parsing PDF:", error);
    return NextResponse.json(
      { success: false, error: "Prüfungsplan konnte nicht geladen werden" },
      { status: 500 }
    );
  }
}