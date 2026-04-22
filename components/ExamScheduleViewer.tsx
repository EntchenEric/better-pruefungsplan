"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ExamEntry, ColumnWidths } from "@/types/exam";
import { DEFAULT_COLUMN_WIDTHS, MIN_COLUMN_WIDTH } from "@/config/tableConfig";
import { useExamFiltering } from "@/hooks/useExamFiltering";
import { useUrlSync } from "@/hooks/useUrlSync";
import { parsePDFClientSide } from "@/utils/pdfParser";
import { StickyHeader } from "./StickyHeader";
import { ExamTableHeader } from "./ExamTableHeader";
import { ExamTableBody } from "./ExamTableBody";

const WHS_PDF_URL = "https://www.w-hs.de/fileadmin/Oeffentlich/Fachbereich-3/informatik/info-center/bekanntmachungen/pp_2026_ib.pdf";

type SortDirection = "asc" | "desc" | null;
type SortConfig = { key: keyof ExamEntry; direction: SortDirection };

const ExamScheduleViewer = () => {
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ key: "datum", direction: "asc" });

  const {
    globalSearch,
    columnFilters,
    hiddenCols,
    studiengang,
    degree,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
    handleStudiengangChange,
    handleDegreeChange,
  } = useUrlSync();

  // Auto-show studiengang column when a specific studiengang is selected
  const effectiveHiddenCols = useMemo(() => {
    const cols = { ...hiddenCols };
    if (studiengang !== "all") {
      cols[studiengang] = false;
    }
    return cols;
  }, [hiddenCols, studiengang]);

  const fetchAndParseData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (forceRefresh) {
        // Try client-side PDF fetch first to avoid server IP blocks
        try {
          const pdfResponse = await fetch(WHS_PDF_URL, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });
          if (pdfResponse.ok) {
            const arrayBuffer = await pdfResponse.arrayBuffer();
            const data = await parsePDFClientSide(arrayBuffer);
            if (data.length > 0) {
              setEntries(data);
              // Update server cache so other users benefit
              try {
                await fetch("/api/pruefungsplan", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ data }),
                });
              } catch {
                // Silently ignore cache update failures
              }
              setLoading(false);
              return;
            }
          }
        } catch (clientError) {
          console.warn("Client-side PDF fetch failed, falling back to server:", clientError);
        }
      }

      const response = await fetch(`/api/pruefungsplan${forceRefresh ? "?refresh=1" : ""}`);
      const result = await response.json();
      if (result.success) {
        setEntries(result.data);
      } else {
        setError(result.error || "Unbekannter Fehler beim Laden");
      }
    } catch {
      setError("Netzwerkfehler — Prüfungsplan konnte nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = useCallback((key: keyof ExamEntry) => {
    setSort((prev) => {
      if (prev.key === key) {
        const next: SortDirection = prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc";
        return { key, direction: next };
      }
      return { key, direction: "asc" };
    });
  }, []);

  // Column widths state with localStorage persistence
  const [colWidths, setColWidths] = useState<ColumnWidths>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("exam-column-widths");
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_COLUMN_WIDTHS, ...parsed };
        }
      } catch {
        // ignore invalid stored data
      }
    }
    return DEFAULT_COLUMN_WIDTHS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("exam-column-widths", JSON.stringify(colWidths));
    }
  }, [colWidths]);

  // Column resize handlers
  const [resizing, setResizing] = useState<{ colKey: string; startX: number; startWidth: number } | null>(null);

  const handleResizeStart = useCallback((colKey: string, startX: number, startWidth: number) => {
    setResizing({ colKey, startX, startWidth });
  }, []);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, resizing.startWidth + delta);
      setColWidths((prev) => ({ ...prev, [resizing.colKey]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  useEffect(() => {
    fetchAndParseData();
  }, [fetchAndParseData]);

  const filteredEntries = useExamFiltering(entries, globalSearch, columnFilters, studiengang, degree);

  const sortedEntries = React.useMemo(() => {
    if (!sort.direction) return filteredEntries;
    return [...filteredEntries].sort((a, b) => {
      const aVal = a[sort.key] || "";
      const bVal = b[sort.key] || "";
      const cmp = aVal.localeCompare(bVal, "de", { numeric: true });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredEntries, sort]);

  return (
    <>
      <div>
        <StickyHeader
          hiddenCols={hiddenCols}
          onToggleColumn={handleToggleColumnVisibility}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
          studiengang={studiengang}
          onStudiengangChange={handleStudiengangChange}
          degree={degree}
          onDegreeChange={handleDegreeChange}
        />
      </div>

      <div className="p-4 max-w-6xl mx-auto font-sans box-border mt-4">
        {error && (
          <div className="mb-4 p-4 rounded-lg border border-error/30 bg-error/10 text-error flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="font-medium">Fehler beim Laden</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-error/70 hover:text-error"
              aria-label="Fehlermeldung schließen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow-md border border-theme bg-theme">
          {loading ? (
            <div className="p-8 space-y-3">
              <div className="h-10 bg-secondary-200/60 rounded animate-pulse" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-secondary-100/60 rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <table
                className="w-full min-w-[900px] border-collapse table-fixed"
                role="grid"
                aria-label="Prüfungsplan Tabelle"
              >
                <thead className="sticky top-0 z-20 bg-theme-sticky shadow-sm">
                  <ExamTableHeader
                    hiddenCols={effectiveHiddenCols}
                    colWidths={colWidths}
                    columnFilters={columnFilters}
                    onColumnFilterChange={handleColumnFilterChange}
                    sort={sort}
                    onSort={handleSort}
                    onResizeStart={handleResizeStart}
                  />
                </thead>
                <tbody>
                  <ExamTableBody
                  entries={sortedEntries}
                  hiddenCols={effectiveHiddenCols}
                  colWidths={colWidths}
                />
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && (
          <div className="mt-5 text-center text-theme-secondary italic text-base select-none">
            Gefundene Einträge: {filteredEntries.length} / {entries.length}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => fetchAndParseData(true)}
            disabled={loading}
            className="text-sm bg-primary-600 hover:bg-primary-700 hover:text-primary-100 px-4 py-1.5 rounded
                      transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Neu laden
          </button>
        </div>
      </div>
    </>
  );
};

export default ExamScheduleViewer;