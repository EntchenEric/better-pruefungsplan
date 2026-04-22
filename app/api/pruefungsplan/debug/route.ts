import { NextResponse } from "next/server";
import { Buffer } from "buffer";

const WHS_PDF_URL = process.env.WHS_PDF_URL || "https://www.w-hs.de/fileadmin/Oeffentlich/Fachbereich-3/informatik/info-center/bekanntmachungen/pp_2026_ib.pdf";

export async function GET() {
  try {
    const response = await fetch(WHS_PDF_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: 502 });
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

    const debugData: unknown[] = [];

    for (let p = 0; p < Math.min(pdfDoc.pages.length, 2); p++) {
      const page = pdfDoc.pages[p];
      for (let t = 0; t < page.tables.length; t++) {
        const table = page.tables[t];
        for (let r = 0; r < Math.min(table.data.length, 15); r++) {
          const row = table.data[r];
          debugData.push({
            pageIndex: p,
            tableIndex: t,
            rowIndex: r,
            rawType: Array.isArray(row) ? "array" : typeof row,
            rawLength: Array.isArray(row) ? row.length : "N/A",
            cells: Array.isArray(row)
              ? row.map((cell, ci) => ({
                  ci,
                  cellType: Array.isArray(cell) ? "array" : typeof cell,
                  cellValue: Array.isArray(cell) ? cell.flat().join(" | ") : String(cell),
                }))
              : String(row),
          });
        }
      }
    }

    return NextResponse.json({ pages: pdfDoc.pages.length, debugData });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}