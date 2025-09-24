"use client";

import React, { useEffect, useState } from "react";
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
    colWidths,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
    handleColumnWidthChange
  } = useUrlSync();


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

  const filteredEntries = useExamFiltering(entries, globalSearch, columnFilters);

  return (
    <>
      <div>
        <StickyHeader
          hiddenCols={hiddenCols}
          onToggleColumn={handleToggleColumnVisibility}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
        />
      </div>
      
      <div className="p-4 max-w-6xl mx-auto font-sans box-border mt-4">
        <div className="overflow-x-auto rounded-lg shadow-md border border-secondary-text max-h-[480px] overflow-y-auto">
        <table
          className="w-full border-collapse table-fixed user-select-none select-none"
          role="grid"
          aria-label="Prüfungsplan Tabelle"
        >
          <ExamTableHeader
            hiddenCols={hiddenCols}
            colWidths={colWidths}
            setColWidths={handleColumnWidthChange}
            columnFilters={columnFilters}
            onColumnFilterChange={handleColumnFilterChange}
          />
          <ExamTableBody
            entries={filteredEntries}
            hiddenCols={hiddenCols}
            colWidths={colWidths}
          />
        </table>
        </div>

        <div className="mt-5 text-center text-secondary-text italic text-base select-none">
          Gefundene Einträge: {filteredEntries.length} / {entries.length}
        </div>
      </div>
    </>
  );
};

export default ExamScheduleViewer;