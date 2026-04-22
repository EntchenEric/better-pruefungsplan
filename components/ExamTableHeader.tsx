import React from "react";
import { ColumnFilters, ColumnWidths, ColumnVisibility, ExamEntry } from "@/types/exam";
import { TABLE_HEADERS, MIN_COLUMN_WIDTH } from "@/config/tableConfig";

type SortDirection = "asc" | "desc" | null;
type SortConfig = { key: keyof ExamEntry; direction: SortDirection };

interface ExamTableHeaderProps {
  hiddenCols: ColumnVisibility;
  colWidths: ColumnWidths;
  columnFilters: ColumnFilters;
  onColumnFilterChange: (key: string, value: string) => void;
  sort: SortConfig;
  onSort: (key: keyof ExamEntry) => void;
  onResizeStart: (colKey: string, startX: number, startWidth: number) => void;
}

function SortIcon({ direction }: { direction: SortDirection }) {
  if (!direction) {
    return (
      <svg className="w-3 h-3 text-theme-muted/40 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  if (direction === "asc") {
    return (
      <svg className="w-3 h-3 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5z" />
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

export const ExamTableHeader: React.FC<ExamTableHeaderProps> = ({
  hiddenCols,
  colWidths,
  columnFilters,
  onColumnFilterChange,
  sort,
  onSort,
  onResizeStart,
}) => {
  return (
    <>
      <tr className="bg-primary text-white text-sm select-none
               border-b border-accent-light/20">
        {TABLE_HEADERS.map(({ key, label }) =>
          hiddenCols[key] ? null : (
            <th
              key={`header-${key}`}
              scope="col"
              aria-colindex={TABLE_HEADERS.findIndex((h) => h.key === key) + 1}
              aria-sort={sort.key === key ? (sort.direction === "asc" ? "ascending" : sort.direction === "desc" ? "descending" : "none") : undefined}
              className="group
                   border-r border-white/10 last:border-r-0
                   font-semibold text-left whitespace-nowrap overflow-hidden
                   h-12 px-4 py-3
                   transition-colors duration-150
                   hover:bg-white/10 cursor-pointer
                   text-sm tracking-wide uppercase relative"
              style={{
                width: colWidths[key],
                minWidth: MIN_COLUMN_WIDTH,
                maxWidth: 500,
                boxSizing: "border-box",
              }}
              onClick={() => onSort(key)}
            >
              <div className="relative flex items-center h-full">
                <span className="flex-grow pointer-events-none select-none truncate font-medium tracking-wider">
                  {label}
                </span>
                <SortIcon direction={sort.key === key ? sort.direction : null} />
              </div>
              <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/30 active:bg-white/50 transition-colors z-10"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                  if (rect) {
                    onResizeStart(key, e.clientX, rect.width);
                  }
                }}
                title="Spaltenbreite anpassen"
              />
            </th>
          )
        )}
      </tr>

      <tr className="z-10 select-none text-xs font-medium shadow-sm bg-theme border-b-2 border-secondary-400">
        {TABLE_HEADERS.map(({ key, label }) =>
          hiddenCols[key] ? null : (
            <th
              key={`filter-${key}`}
              className="text-left whitespace-nowrap p-2"
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
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-secondary-400 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-secondary-500 bg-theme text-theme-primary"
                />
                {columnFilters[key] && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onColumnFilterChange(key, ""); }}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-theme-muted hover:text-error transition-colors"
                    aria-label={`Filter für ${label} löschen`}
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
    </>
  );
};