import React from "react";
import { ExamEntry, ColumnWidths, ColumnVisibility } from "@/types/exam";
import { TABLE_HEADERS, MIN_COLUMN_WIDTH } from "@/config/tableConfig";

interface ExamTableBodyProps {
  entries: ExamEntry[];
  hiddenCols: ColumnVisibility;
  colWidths: ColumnWidths;
}

export const ExamTableBody: React.FC<ExamTableBodyProps> = ({
  entries,
  hiddenCols,
  colWidths,
}) => {
  if (entries.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={
              TABLE_HEADERS.length -
              Object.values(hiddenCols).filter(Boolean).length
            }
            className="p-8 text-center"
          >
            <div className="flex flex-col items-center gap-2 text-theme-muted">
              <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Keine Einträge gefunden</p>
              <p className="text-sm">Versuche andere Suchbegriffe oder Filter</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {entries.map((entry, idx) => (
        <tr
          key={`${entry.mid}-${entry.kuerzel}-${idx}`}
          tabIndex={0}
          aria-rowindex={idx + 1}
          className={`${idx % 2 === 0 ? "bg-secondary-100/50" : "bg-secondary-200/50"
            } transition-colors hover:bg-primary-100 focus:outline-none focus:bg-primary-200 text-theme-primary`}
        >
          {TABLE_HEADERS.map(({ key }) =>
            hiddenCols[key] ? null : (
              <td
                key={`${idx}-${key}`}
                data-label={key}
                className="p-2 text-sm text-theme-primary whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  width: colWidths[key],
                  minWidth: MIN_COLUMN_WIDTH,
                  maxWidth: 500,
                  boxSizing: "border-box",
                }}
                title={entry[key] || undefined}
              >
                {entry[key] || "—"}
              </td>
            )
          )}
        </tr>
      ))}
    </tbody>
  );
};