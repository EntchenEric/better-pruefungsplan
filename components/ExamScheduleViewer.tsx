"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ExamEntry } from "@/types/exam";
import { DEFAULT_COLUMN_WIDTHS } from "@/config/tableConfig";
import { useExamFiltering } from "@/hooks/useExamFiltering";
import { useUrlSync } from "@/hooks/useUrlSync";
import { StickyHeader } from "./StickyHeader";
import { ExamTableHeader } from "./ExamTableHeader";
import { ExamTableBody } from "./ExamTableBody";

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

  const fetchAndParseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/pruefungsplan");
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

  const handleFetchWHS = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/pruefungsplan/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        setEntries(result.data);
      } else {
        setError(result.error || "Fehler beim Laden von der WHS");
      }
    } catch {
      setError("Netzwerkfehler — WHS-Daten konnten nicht geladen werden");
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
                    hiddenCols={hiddenCols}
                    colWidths={DEFAULT_COLUMN_WIDTHS}
                    columnFilters={columnFilters}
                    onColumnFilterChange={handleColumnFilterChange}
                    sort={sort}
                    onSort={handleSort}
                  />
                </thead>
                <tbody>
                  <ExamTableBody
                  entries={sortedEntries}
                  hiddenCols={hiddenCols}
                  colWidths={DEFAULT_COLUMN_WIDTHS}
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

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={fetchAndParseData}
            disabled={loading}
            className="text-sm bg-theme-alt hover:bg-primary-700 hover:text-primary-100 border border-primary-400 px-4 py-1.5 rounded
                      transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prüfungsplan laden
          </button>

          <button
            onClick={handleFetchWHS}
            disabled={loading}
            className="text-sm bg-primary-600 hover:bg-primary-700 hover:text-primary-100 px-4 py-1.5 rounded
                      transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Daten von WHS laden
          </button>
        </div>
      </div>
    </>
  );
};

export default ExamScheduleViewer;