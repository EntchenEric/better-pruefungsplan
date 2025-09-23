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
            className="p-7 text-center italic text-black-muted text-base"
            role="row"
          >
            Keine Einträge gefunden.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {entries.map((entry, idx) => (
        <tr
          key={idx}
          tabIndex={0}
          aria-rowindex={idx + 1}
          className={`${idx % 2 === 0 ? "bg-secondary-100" : "bg-secondary-200"
            } cursor-default transition-colors hover:bg-primary-100 focus:outline-none focus:bg-primary-200 color-black`}
        >
          {TABLE_HEADERS.map(({ key }) =>
            hiddenCols[key] ? null : (
              <td
                key={`${idx}-${key}`}
                data-label={key}
                className="p-2 text-sm text-black-primary whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  width: colWidths[key],
                  minWidth: MIN_COLUMN_WIDTH,
                  maxWidth: 500,
                  boxSizing: "border-box",
                }}
                title={entry[key]}
              >
                {entry[key] || ""}
              </td>
            )
          )}
        </tr>
      ))}
    </tbody>
  );
};