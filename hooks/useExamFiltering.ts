import { useMemo } from "react";
import { ExamEntry, ColumnFilters } from "@/types/exam";
import { TABLE_HEADERS } from "@/config/tableConfig";

export const useExamFiltering = (
  entries: ExamEntry[],
  globalSearch: string,
  columnFilters: ColumnFilters
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
    
    return filtered;
  }, [entries, globalSearch, columnFilters]);

  return filteredEntries;
};