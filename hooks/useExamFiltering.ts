import { useMemo } from "react";
import { ExamEntry, ColumnFilters } from "@/types/exam";
import { COURSES, SEMESTERS, TABLE_HEADERS } from "@/config/tableConfig";

export const useExamFiltering = (
  entries: ExamEntry[],
  globalSearch: string,
  columnFilters: ColumnFilters,
  selectedCourse: string | undefined,
  selectedSemester: string | undefined,
) => {
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (globalSearch.trim()) {
      const lowerGlobal = globalSearch.toLowerCase();
      filtered = filtered.filter((entry) =>
        Object.values(entry).some((v) => v?.toLowerCase().includes(lowerGlobal))
      );
    }

    filtered = filtered.filter((entry) =>
      TABLE_HEADERS.every(({ key }) => {
        const filterVal = columnFilters[key]?.trim().toLowerCase();
        if (!filterVal) return true;
        const entryVal = (entry[key] || "").toLowerCase();
        return entryVal.includes(filterVal);
      })
    );

    if (selectedCourse && COURSES.some(c => c.key === selectedCourse)) {
      filtered = filtered.filter((entry) => {
        //@ts-expect-error Its too much work to parse the selectedCourse to a ExamEntry. To save overhead this is just ignored.
        const val = String(entry[selectedCourse] ?? "").trim();
        return val.length > 0;
      });
    }

    if (selectedSemester && SEMESTERS.some(s => s.key === selectedSemester)) {
      if (selectedCourse && COURSES.some(c => c.key === selectedCourse)) {
        filtered = filtered.filter(
          //@ts-expect-error Its too much work to parse the selectedCourse to a ExamEntry. To save overhead this is just ignored.
          (entry) => String(entry[selectedCourse] ?? "") === selectedSemester
        );
      } else {
        filtered = filtered.filter((entry) =>
          //@ts-expect-error Its too much work to parse the key to a ExamEntry. To save overhead this is just ignored.
          COURSES.some((c) => String(entry[c.key] ?? "") === selectedSemester)
        );
      }
    }

    return filtered;
  }, [entries, globalSearch, columnFilters, selectedCourse, selectedSemester]);

  return filteredEntries;
};