"use client";

import React from "react";
import { ColumnToggle } from "./ColumnToggle";
import { GlobalSearch } from "./GlobalSearch";
import { ShareUrlButton } from "./ShareUrlButton";
import { ColumnVisibility } from "@/types/exam";
import { CourseFilter } from "./CourseFilter";
import { SemesterSelect } from "./SemesterSelect";

/**
 * The props of the Stcky header component.
 */
interface StickyHeaderProps {
  /**
   * The Columns that are hidden.
   */
  hiddenCols: ColumnVisibility;
  /**
   * The callback that is called when the visibility of a Column should be toggled.
   * @param key the key of the coulmn to toggle the visibility of.
   * @returns void.
   */
  onToggleColumn: (key: string) => void;
  /**
   * The content of the globalSearch.
   */
  globalSearch: string;
  /**
   * The callback that is called when the Global Search should be changed.
   * @param value the new value of the global search.
   * @returns void.
   */
  onGlobalSearchChange: (value: string) => void;
  /**
   * The currently selected course.
   */
  selectedCourse: string | undefined;
  /**
   * The callback that is called when the currently selected course should be changed.
   * @param value The id of the newly selected course.
   * @returns void.
   */
  setSelectedCourse: (value: string | undefined) => void;
  /**
   * The currently selected semester.
   */
  selectedSemester: string | undefined;
  /**
   * The callback that is called when the currently selected semester should be changed.
   * @param value The id of the newly selected semester.
   * @returns void.
   */
  setSelectedSemester: (value: string | undefined) => void;
}

const Filters: React.FC<StickyHeaderProps> = ({
  hiddenCols,
  onToggleColumn,
  globalSearch,
  onGlobalSearchChange,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div className="backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
          <span className="mr-2">👁️</span>
          Spalten verwalten
        </h3>
        <ColumnToggle hiddenCols={hiddenCols} onToggleColumn={onToggleColumn} />
      </div>

      <div className="backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
          <span className="mr-2">🔍</span>
          Globale Suche
        </h3>
        <div className="flex flex-col gap-3">
          <GlobalSearch
            globalSearch={globalSearch}
            onGlobalSearchChange={onGlobalSearchChange}
          />
          <ShareUrlButton />
          <CourseFilter
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
          <SemesterSelect
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />
        </div>
      </div>
    </div>
  );
};

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  hiddenCols,
  onToggleColumn,
  globalSearch,
  onGlobalSearchChange,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg border-b-2 border-primary">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
            📅 Better Prüfungsplan - Stand September/Oktober 2025
          </h1>
          <div className="h-1 w-32 bg-white/30 mx-auto rounded-full" />
        </div>
        <Filters
          hiddenCols={hiddenCols}
          onToggleColumn={onToggleColumn}
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
        />
      </div>
    </header>
  );
};
