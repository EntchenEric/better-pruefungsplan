import { useMemo } from "react";
import { ExamEntry, ColumnFilters, STUDIENGAENGE } from "@/types/exam";
import { TABLE_HEADERS } from "@/config/tableConfig";

export type StudiengangFilter = keyof ExamEntry | "all";
export type DegreeFilter = "all" | "ba" | "ma";

export const useExamFiltering = (
  entries: ExamEntry[],
  globalSearch: string,
  columnFilters: ColumnFilters,
  studiengang: StudiengangFilter,
  degree: DegreeFilter,
) => {
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Studiengang filter: show only exams relevant to the selected studiengang
    if (studiengang !== "all") {
      filtered = filtered.filter((entry) => {
        const val = entry[studiengang];
        return val && val.trim() !== "" && val.trim() !== "-";
      });
    }

    // Degree filter: Bachelor (B) or Master (M)
    if (degree !== "all") {
      filtered = filtered.filter((entry) => {
        if (degree === "ba") return entry.b_m === "B";
        if (degree === "ma") return entry.b_m === "M";
        return true;
      });
    }

    // Global search
    if (globalSearch.trim()) {
      const lowerGlobal = globalSearch.toLowerCase();
      filtered = filtered.filter((entry) =>
        Object.values(entry).some((v) => v?.toLowerCase().includes(lowerGlobal))
      );
    }

    // Per-column filters
    filtered = filtered.filter((entry) =>
      TABLE_HEADERS.every(({ key }) => {
        const filterVal = columnFilters[key]?.trim().toLowerCase();
        if (!filterVal) return true;
        const entryVal = (entry[key] || "").toLowerCase();
        return entryVal.includes(filterVal);
      })
    );

    return filtered;
  }, [entries, globalSearch, columnFilters, studiengang, degree]);

  return filteredEntries;
};