import { useMemo } from "react";
import { ExamEntry, ColumnFilters } from "@/types/exam";
import { TABLE_HEADERS } from "@/config/tableConfig";

export const useExamFiltering = (
  entries: ExamEntry[],
  globalSearch: string,
  columnFilters: ColumnFilters,
  selectedCourse: string | undefined
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
    });
    
    return filtered;
  }, [entries, globalSearch, columnFilters, selectedCourse]);

  return filteredEntries;
};