import { useMemo } from "react";
import { ExamEntry, ColumnFilters } from "@/types/exam";
import { COURSES, TABLE_HEADERS } from "@/config/tableConfig";

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
    ).filter((entry) => {
      switch (selectedCourse) {
        case "pi_ba":
        case "ti_ba":
        case "wi_ba":
        case "pi_ba_dual":
        case "ti_ba_dual":
        case "mi_ba_dual":
        case "wi_ba_dual":
        case "pi_ma":
        case "ti_ma":
        case "mi_ma":
        case "wi_ma":
        case "is_ma":
          return entry[selectedCourse] != "";
        case undefined:
          return true;
        default:
          return true;
      }
    }).filter((entry) => {
      switch (selectedSemester) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "WP":
        case "WP-I":
        case "WP-IN":
        case "WP-L":
        case "WP-LE":
          const isMatch = COURSES.some((course) => {
            switch (course.key) {
              case "pi_ba":
              case "ti_ba":
              case "wi_ba":
              case "pi_ba_dual":
              case "ti_ba_dual":
              case "mi_ba_dual":
              case "wi_ba_dual":
              case "pi_ma":
              case "ti_ma":
              case "mi_ma":
              case "wi_ma":
              case "is_ma":
                console.log(entry[course.key])
                return entry[course.key] === selectedSemester;
              default:
                return false;
            }
          });

          if (isMatch) {
            return true;
          } else {
            return false;
          }
        default:
          return true
      }
    });

    return filtered;
  }, [entries, globalSearch, columnFilters, selectedCourse, selectedSemester]);

  return filteredEntries;
};