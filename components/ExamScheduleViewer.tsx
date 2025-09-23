"use client";

import React, { useEffect, useState, useRef } from "react";
import { ExamEntry } from "@/types/exam";
import { parseExamSchedulePDF } from "@/utils/pdfParser";
import { DEFAULT_COLUMN_WIDTHS } from "@/config/tableConfig";
import { useExamFiltering } from "@/hooks/useExamFiltering";
import { useUrlSync } from "@/hooks/useUrlSync";
import { StickyHeader } from "./StickyHeader";
import { ExamTableHeader } from "./ExamTableHeader";
import { ExamTableBody } from "./ExamTableBody";

const ExamScheduleViewer = () => {
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  
  const {
    globalSearch,
    columnFilters,
    hiddenCols,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
  } = useUrlSync();


  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const parsedEntries = await parseExamSchedulePDF();
        setEntries(parsedEntries);
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    };

    fetchAndParseData();
  }, []);

  useEffect(() => {
    const updateStickyHeaderHeight = () => {
      if (stickyHeaderRef.current) {
        setStickyHeaderHeight(stickyHeaderRef.current.offsetHeight);
      }
    };

    updateStickyHeaderHeight();
    window.addEventListener('resize', updateStickyHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateStickyHeaderHeight);
    };
  }, []);

  const filteredEntries = useExamFiltering(entries, globalSearch, columnFilters);


  return (
    <>
      <div ref={stickyHeaderRef}>
        <StickyHeader
          hiddenCols={hiddenCols}
          onToggleColumn={handleToggleColumnVisibility}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
        />
      </div>
      
      <div className="p-4 max-w-6xl mx-auto font-sans box-border mt-4">
        <div className="overflow-x-auto rounded-lg shadow-md border border-theme max-h-[480px] overflow-y-auto bg-theme">
        <table
          className="w-full min-w-[900px] border-collapse table-fixed user-select-none"
          role="grid"
          aria-label="Prüfungsplan Tabelle"
        >
          <ExamTableHeader
            hiddenCols={hiddenCols}
            colWidths={DEFAULT_COLUMN_WIDTHS}
            columnFilters={columnFilters}
            onColumnFilterChange={handleColumnFilterChange}
            stickyHeaderHeight={stickyHeaderHeight}
          />
          <ExamTableBody
            entries={filteredEntries}
            hiddenCols={hiddenCols}
            colWidths={DEFAULT_COLUMN_WIDTHS}
          />
        </table>
        </div>

        <div className="mt-5 text-center text-theme-secondary italic text-base select-none">
          Gefundene Einträge: {filteredEntries.length} / {entries.length}
        </div>
      </div>
    </>
  );
};

export default ExamScheduleViewer;