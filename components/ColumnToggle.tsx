import React from "react";
import { ColumnVisibility } from "@/types/exam";
import { TABLE_HEADERS } from "@/config/tableConfig";

interface ColumnToggleProps {
  hiddenCols: ColumnVisibility;
  onToggleColumn: (key: string) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  hiddenCols,
  onToggleColumn,
}) => {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 text-sm select-none">
      <div className="flex items-center gap-2 text-primary-text font-medium">
        <svg className="h-5 w-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
        <span>Spalten anzeigen:</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {TABLE_HEADERS.map(({ key, label }) => (
          <label
            key={`toggle-${key}`}
            className={`flex items-center gap-2 cursor-pointer px-3 py-2 
              rounded-lg transition-all duration-200 font-medium 
              text-sm hover:shadow-sm text-secondary-text 
              bg-secondary hover:bg-secondary-200
            }`}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={!hiddenCols[key]}
                onChange={() => onToggleColumn(key)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${hiddenCols[key]
                ? "border-secondary-text"
                : "border-primary bg-primary"
                }`}>
                {!hiddenCols[key] && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};