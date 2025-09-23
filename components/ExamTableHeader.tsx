import React from "react";
import { ColumnFilters, ColumnWidths, ColumnVisibility } from "@/types/exam";
import { TABLE_HEADERS, MIN_COLUMN_WIDTH } from "@/config/tableConfig";

interface ExamTableHeaderProps {
  hiddenCols: ColumnVisibility;
  colWidths: ColumnWidths;
  columnFilters: ColumnFilters;
  onColumnFilterChange: (key: string, value: string) => void;
  stickyHeaderHeight: number;
}

export const ExamTableHeader: React.FC<ExamTableHeaderProps> = ({
  hiddenCols,
  colWidths,
  columnFilters,
  onColumnFilterChange,
  stickyHeaderHeight,
}) => {
  return (
    <thead>
      <tr className="bg-primary text-theme-inverse text-sm select-none sticky top-0 
               z-10 shadow-sm border-b border-accent-light/20">
        {TABLE_HEADERS.map(({ key, label }) =>
          hiddenCols[key] ? null : (
            <th
              key={`header-${key}`}
              scope="col"
              aria-colindex={TABLE_HEADERS.findIndex((h) => h.key === key) + 1}
              className="sticky z-20 group
                   bg-gradient-to-b from-white/5 to-transparent
                   border-r border-accent-light/10 last:border-r-0
                   font-semibold text-left whitespace-nowrap overflow-hidden
                   h-12 px-4 py-3
                   transition-all duration-200 ease-in-out
                   hover:bg-white/10 hover:shadow-lg
                   text-sm tracking-wide uppercase letter-spacing-wide"
              style={{
                width: colWidths[key],
                minWidth: MIN_COLUMN_WIDTH,
                maxWidth: 500,
                boxSizing: "border-box",
              }}
            >
              <div className="relative flex items-center h-full">
                <span className="flex-grow pointer-events-none select-none truncate
                          text-theme-inverse/90 group-hover:text-theme-inverse
                          font-medium tracking-wider
                          transition-colors duration-200">
                  {label}
                </span>

                <div className="absolute bottom-0 left-0 w-full h-0.5 
                         bg-gradient-to-r from-accent-light via-accent to-accent-light/50
                         transform scale-x-0 group-hover:scale-x-100
                         transition-transform duration-300 ease-out" />
              </div>
            </th>
          )
        )}
      </tr>

      <tr className="z-10 select-none text-xs font-medium shadow-sm sticky top-12 bg-white">
        {TABLE_HEADERS.map(({ key, label }) =>
          hiddenCols[key] ? null : (
            <th
              key={`filter-${key}`}
              className="border-b-2 border-secondary-400 text-left whitespace-nowrap p-2"
              style={{
                width: colWidths[key],
                minWidth: MIN_COLUMN_WIDTH,
                maxWidth: 500,
                boxSizing: "border-box",
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={columnFilters[key]}
                  onChange={(e) => onColumnFilterChange(key, e.target.value)}
                  aria-label={`Filter für ${label}`}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-secondary-400 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-secondary-500"
                />
                {columnFilters[key] && (
                  <button
                    onClick={() => onColumnFilterChange(key, "")}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-theme-muted hover:text-error transition-colors"
                    aria-label={`Clear filter for ${label}`}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </th>
          )
        )}
      </tr>
    </thead>
  );
};