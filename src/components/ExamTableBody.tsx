import React from "react";
import {
  ExamEntry,
  ColumnWidths,
  ColumnVisibility,
  FavoriteRows,
} from "@//types/exam";
import { TABLE_HEADERS, MIN_COLUMN_WIDTH } from "@//config/tableConfig";
import { FaRegStar, FaStar } from "react-icons/fa";
import moment from "moment";
moment.locale("de");

/**
 * Represents the props of the ExamTableBody.
 */
interface ExamTableBodyProps {
  /**
   * The Entries from the Exam Schedule Table.
   */
  entries: ExamEntry[];
  /**
   * The Columns that are hidden from the Exam Schedule Table.
   */
  hiddenCols: ColumnVisibility;
  /**
   * The widths of the Columns in the Exam Schedule Table.
   */
  colWidths: ColumnWidths;

  favoritedRows: FavoriteRows;

  toggleFavorite: (row: string) => void;
}

/**
 * Formats the date of a exam so its better to read.
 *
 * @param date the date of the exam to format.
 * @returns relative date of the exam including the abolute date.
 */
const formatDate = (date?: string) => {
  if (!date) return "";

  const m =
    moment(date).format("DD.MMMM YYYY") + " (" + moment(date).fromNow() + ")";
  return m;
};

/**
 * Formats the time of a exam so its better to read.
 *
 * @param time the time of the exam.
 * @param entry the ExamEntry.
 * @returns
 */
const formatTime = (time?: string, entry?: ExamEntry) => {
  if (!time || !entry) return "";

  if (
    new Date(entry["datum"]).setHours(0, 0, 0, 0) !==
    new Date().setHours(0, 0, 0, 0)
  )
    return time;

  const t = moment(time || "", "HH:mm");
  const now = moment();
  const dauer = parseInt(entry["pruefungsdauer"] || "");
  const diff = t.diff(now) / 1000 / 60;
  if (dauer > diff && diff > 0) {
    return diff == 1
      ? "noch " + diff.toFixed(0) + " minuten"
      : "noch " + diff.toFixed(0) + " minute";
  }
  return time;
};

/**
 * Represents the Exam Table Body
 * @returns the ExamTableBody as a React Component.
 */
export const ExamTableBody: React.FC<ExamTableBodyProps> = ({
  entries,
  hiddenCols,
  colWidths,
  favoritedRows,
  toggleFavorite,
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
            className="p-7 text-center italic text-secondary-text text-base"
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
          key={entry.mid}
          tabIndex={0}
          aria-rowindex={idx + 1}
          className={`${
            idx % 2 === 0 ? "bg-secondary" : "bg-secondary-200"
          } cursor-default transition-colors hover:bg-primary-100 focus:outline-none focus:bg-primary-200`}
        >
          <td
            key={`${entry.mid}-favorite`}
            data-label={"favorite"}
            className="p-2 text-sm text-secondary-text whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              width: colWidths["favorite"],
              minWidth: MIN_COLUMN_WIDTH,
              boxSizing: "border-box",
            }}
            title={"Favorisieren"}
          >
            {favoritedRows[entry["mid"]] ? (
              <FaStar
                className="w-5 cursor-pointer text-yellow-500"
                onClick={() => {
                  toggleFavorite(entry["mid"]);
                }}
              />
            ) : (
              <FaRegStar
                className="w-5 cursor-pointer"
                onClick={() => {
                  toggleFavorite(entry["mid"]);
                }}
              />
            )}
          </td>
          {TABLE_HEADERS.map(({ key }) =>
            hiddenCols[key] ? null : (
              <td
                key={`${entry.mid}-${key}`}
                data-label={key}
                className="p-2 text-sm text-secondary-text whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  width: colWidths[key],
                  minWidth: MIN_COLUMN_WIDTH,
                  boxSizing: "border-box",
                }}
                title={entry[key]}
              >
                {key == "datum"
                  ? formatDate(entry[key])
                  : key == "zeit"
                    ? formatTime(entry[key], entry)
                    : entry[key] || ""}
              </td>
            ),
          )}
        </tr>
      ))}
    </tbody>
  );
};
