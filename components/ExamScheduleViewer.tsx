"use client";

import React, { useEffect, useState } from "react";
import { ExamEntry } from "@/types/exam";
import { useExamFiltering } from "@/hooks/useExamFiltering";
import { useUrlSync } from "@/hooks/useUrlSync";
import { StickyHeader } from "./StickyHeader";
import { ExamTableHeader } from "./ExamTableHeader";
import { ExamTableBody } from "./ExamTableBody";

/**
 * Represents the ExamScheduleViewer that is the main Component containing the Table and the Filters
 * used to display the Exam schedule.
 * @returns The ExamScheduleViewer as a React Component.
 */
const ExamScheduleViewer = () => {
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  
  const {
    globalSearch,
    columnFilters,
    hiddenCols,
    colWidths,
    selectedCourse,
    selectedSemester,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
    handleColumnWidthChange,
    setSelectedCourse,
    setSelectedSemester,
  } = useUrlSync();

  useEffect(() => {
    /**
     * Fetches exam data JSON from server and updates entries state.
     *
     * @async
     * @returns {Promise<void>} Resolves when fetching/parsing completes or errors out.
     */
    const fetchAndParseData = async () => {
      try {
        const ac = new AbortController();
        const response = await fetch("/api/exams", {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw Error("Error loading pdf.");
        }
        const data = await response.json();
        setEntries(data.entries);
        ac.abort();
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    };

    fetchAndParseData();
  }, []);

  /**
   * The entries filtered according to the filters.
   */
  const filteredEntries = useExamFiltering(entries, globalSearch, columnFilters, selectedCourse, selectedSemester);

  return (
    <>
      <div>
        <StickyHeader
          hiddenCols={hiddenCols}
          onToggleColumn={handleToggleColumnVisibility}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
        />
      </div>

      <div className="p-4 max-w-6xl mx-auto font-sans box-border mt-4">
        <div className="overflow-x-auto rounded-lg shadow-md border border-secondary-text max-h-[480px] overflow-y-auto">

        <table
          className="w-full border-collapse table-fixed user-select-none select-none"
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
