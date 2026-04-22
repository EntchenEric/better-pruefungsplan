import { NextRequest, NextResponse } from "next/server";
import { ExamEntry } from "@/types/exam";
import { normalizeRow, mapRowToEntry } from "@/utils/pdfParser";
import { Buffer } from "buffer";

const WHS_PDF_URL = process.env.WHS_PDF_URL || "https://www.w-hs.de/fileadmin/Oeffentlich/Fachbereich-3/informatik/info-center/bekanntmachungen/pp_2026_ib.pdf";
const LOCAL_PDF_PATH = "/pruefungsplan.pdf";

let cachedData: ExamEntry[] | null = null;
let cachedAt: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return cachedData !== null && (Date.now() - cachedAt) < CACHE_TTL;
}

async function parsePdfFromUrl(url: string): Promise<ExamEntry[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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

  return allEntries;
}

export async function GET() {
  try {
    if (isCacheValid()) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Try remote WHS URL first
    try {
      const data = await parsePdfFromUrl(WHS_PDF_URL);
      cachedData = data;
      cachedAt = Date.now();
      return NextResponse.json({
        success: true,
        data,
        cached: false,
        source: "remote",
      });
    } catch (remoteError) {
      console.warn("Remote PDF fetch failed, trying local:", remoteError);
    }

    // Fallback to local PDF
    try {
      const data = await parsePdfFromUrl(LOCAL_PDF_PATH);
      cachedData = data;
      cachedAt = Date.now();
      return NextResponse.json({
        success: true,
        data,
        cached: false,
        source: "local",
      });
    } catch (localError) {
      console.error("Local PDF also failed:", localError);
      return NextResponse.json(
        { success: false, error: "Prüfungsplan konnte weder remote noch lokal geladen werden" },
        { status: 500 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in GET /api/pruefungsplan:", message);
    return NextResponse.json(
      { success: false, error: "Prüfungsplan konnte nicht geladen werden", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL ist erforderlich" },
        { status: 400 }
      );
    }

    const data = await parsePdfFromUrl(url);
    cachedData = data;
    cachedAt = Date.now();

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST /api/pruefungsplan:", message);
    return NextResponse.json(
      { success: false, error: "Prüfungsplan konnte nicht geladen werden", details: message },
      { status: 500 }
    );
  }
}