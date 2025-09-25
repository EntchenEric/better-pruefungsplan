"use client";

import React from "react";
import { ColumnToggle } from "./ColumnToggle";
import { GlobalSearch } from "./GlobalSearch";
import { ShareUrlButton } from "./ShareUrlButton";
import { ColumnVisibility } from "@/types/exam";
import { CourseFilter } from "./CourseFilter";
import { SemesterSelect } from "./SemesterSelect";

interface StickyHeaderProps {
  hiddenCols: ColumnVisibility;
  onToggleColumn: (key: string) => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  selectedCourse: string | undefined;
  setSelectedCourse: (value: string | undefined) => void;
  selectedSemester: string | undefined;
  setSelectedSemester: (value: string | undefined) => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  hiddenCols,
  onToggleColumn,
  globalSearch,
  onGlobalSearchChange,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester
}) => {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg border-b-2 border-primary">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
            📅 Better Prüfungsplan - Stand September/Oktober 2025
          </h1>
          <div className="h-1 w-32 bg-white/30 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">👁️</span>
              Spalten verwalten
            </h3>
            <ColumnToggle
              hiddenCols={hiddenCols}
              onToggleColumn={onToggleColumn}
            />
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
      </div>
    </header>
  );
};