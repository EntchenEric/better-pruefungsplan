import { NextRequest, NextResponse } from "next/server";
import { ExamEntry } from "@/types/exam";
import { normalizeRow, mapRowToEntry } from "@/utils/pdfParser";

const LOCAL_PDF_URL = "https://www.w-hs.de/downloads/sdl-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDAyNjExMzMsImV4cCI6MTc3MjgxMTEzMywiYXV0aCI6eyJhdXRoZW50aWNhdGlvbk1ldGhvZCI6IlNlY3JldCIsImF1dGhvclVSTDNcIjoiKGFsbG93ZWQpfX0.eKw5w1Q3yG7xY8F2jL9kM3nP4oR6sT7uV8wX9yA0bC1d/PP_2026_IB_-_Aushang.pdf";

let cachedData: ExamEntry[] | null = null;
let cachedAt: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return cachedData !== null && (Date.now() - cachedAt) < CACHE_TTL;
}

async function fetchAndParsePdf(url: string): Promise<ExamEntry[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { PdfDocument } = await import("pdf-tables-parser");
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

    const data = await fetchAndParsePdf(LOCAL_PDF_URL);
    cachedData = data;
    cachedAt = Date.now();

    return NextResponse.json({
      success: true,
      data,
      cached: false,
    });
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

    const data = await fetchAndParsePdf(url);
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