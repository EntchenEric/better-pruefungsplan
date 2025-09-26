"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ColumnFilters, ColumnWidths, ColumnVisibility } from "@//types/exam";
import { TABLE_HEADERS, MIN_COLUMN_WIDTH } from "@//config/tableConfig";

/**
 * Represents the props of the Exam Tabe Header.
 */
interface ExamTableHeaderProps {
  /**
   * The Columns that are hidden from the Table-
   */
  hiddenCols: ColumnVisibility;
  /**
   * The widths of the Columns.
   */
  colWidths: ColumnWidths;
  /**
   * The callback that is called when the width of a Column is changed.
   * @param key The key of the column to change.
   * @param value The new width of the coulm.
   * @returns void
   */
  setColWidths: (key: string, value: number) => void;
  /**
   * The active filters to filter the columns.
   */
  columnFilters: ColumnFilters;
  /**
   * The callback that is called when a Filter should be changed.
   * @param key The key of the column whose filter should be changed.
   * @param value The value of the Filter.
   * @returns void
   */
  onColumnFilterChange: (key: string, value: string) => void;
}

/**
 * The Exam Table Header component-
 * @param params the Parameters from the Exam Table Header-
 * @returns The Exam Table HEader as a React Component.
 */
export const ExamTableHeader: React.FC<ExamTableHeaderProps> = ({
  hiddenCols,
  colWidths,
  setColWidths,
  columnFilters,
  onColumnFilterChange,
}) => {
  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingCol.current) return;

      e.preventDefault();

      const deltaX = e.clientX - startX.current;
      let newWidth = startWidth.current + deltaX;

      if (newWidth < MIN_COLUMN_WIDTH) newWidth = MIN_COLUMN_WIDTH;

      setColWidths(resizingCol.current, newWidth);
    },
    [setColWidths],
  );

  const onMouseUp = useCallback(() => {
    resizingCol.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [onMouseMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [onMouseMove, onMouseUp]);

  /**
   * Resizes the column.
   * @param key The column to resize.
   * @returns void
   */
  const onMouseDownResizer =
    (key: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      resizingCol.current = key;
      startX.current = e.clientX;

      let currentWidthPx: number;
      if (typeof colWidths[key] === "number") {
        currentWidthPx = colWidths[key];
      } else if (
        typeof colWidths[key] === "string" &&
        typeof (colWidths[key] as string).endsWith === "function" &&
        (colWidths[key] as string).endsWith("px")
      ) {
        currentWidthPx = parseInt(colWidths[key] as string);
      } else {
        currentWidthPx = MIN_COLUMN_WIDTH;
      }

      startWidth.current = currentWidthPx;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

  return (
    <thead>
      <tr
        className="bg-primary text-primary-text text-sm select-none sticky top-0
               z-10 shadow-sm border-b border-primary"
      >
        {TABLE_HEADERS.map(({ key, label }, index) =>
          hiddenCols[key] ? null : (
            <th
              key={`header-${key}`}
              scope="col"
              aria-colindex={index + 1}
              className="z-20 group
                   bg-primary
                   border-r border-border-light last:border-r-0
                   font-semibold text-left whitespace-nowrap overflow-hidden
                   h-12
                   transition-all duration-200 ease-in-out hover:shadow-lg
                   text-sm tracking-wide uppercase letter-spacing-wide"
              style={{
                width: colWidths[key],
                minWidth: MIN_COLUMN_WIDTH,
                boxSizing: "border-box",
              }}
            >
              <div className="relative flex items-center h-full">
                <span
                  className="flex-grow pointer-events-none select-none truncate
                px-4 py-3
                          text-primary-text opacity-90 group-hover:opacity-100
                          font-medium tracking-wider
                          transition-colors duration-200"
                >
                  {label}
                </span>

                <div
                  className="absolute top-0 right-0 w-[6px] h-full cursor-col-resize z-30 touch-none"
                  onMouseDown={onMouseDownResizer(key)}
                />

                <div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white
                         transform scale-x-0 group-hover:scale-x-100
                         transition-transform duration-300 ease-out"
                />
              </div>
            </th>
          ),
        )}
      </tr>

      <tr className="z-10 select-none text-xs font-medium shadow-sm sticky top-12 bg-secondary">
        {TABLE_HEADERS.map(({ key, label }) => {

          /**
           * Handles changing the column filter.
           */
          const handleColumnFilterChange = useCallback((
            e: React.ChangeEvent<HTMLInputElement>,
          ) => {
            onColumnFilterChange(key, e.target.value);
          }, [onColumnFilterChange])

          /**
           * Handles clearing the column filter.
           */
          const handleColumnFilterClear = useCallback(() => {
            onColumnFilterChange(key, "");
          }, [onColumnFilterChange])

          return hiddenCols[key] ? null : (
            <th
              key={`filter-${key}`}
              className="border-b-2 border-border text-left whitespace-nowrap p-2"
              style={{
                width: colWidths[key],
                minWidth: MIN_COLUMN_WIDTH,
                boxSizing: "border-box",
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg
                    className="h-3 w-3 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={columnFilters[key]}
                  onChange={handleColumnFilterChange}
                  aria-label={`Filter für ${label}`}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-border rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border-light"
                />
                {columnFilters[key] && (
                  <button
                    onClick={handleColumnFilterClear}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-text-muted hover:text-red-500 transition-colors"
                    aria-label={`Clear filter for ${label}`}
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
