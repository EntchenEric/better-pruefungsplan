import { ColumnFilters, ColumnVisibility } from "@/types/exam";
import { TABLE_HEADERS, DEFAULT_HIDDEN_COLUMNS } from "@/config/tableConfig";

export const encodeColumnFilters = (filters: ColumnFilters): string => {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value.trim() !== "");
  if (activeFilters.length === 0) return "";
  
  return btoa(JSON.stringify(Object.fromEntries(activeFilters)));
};

export const decodeColumnFilters = (encodedFilters: string): ColumnFilters => {
  const defaultFilters = TABLE_HEADERS.reduce((acc, h) => {
    acc[h.key] = "";
    return acc;
  }, {} as ColumnFilters);

  if (!encodedFilters) return defaultFilters;

  try {
    const decoded = JSON.parse(atob(encodedFilters));
    return { ...defaultFilters, ...decoded };
  } catch (error) {
    console.warn("Failed to decode column filters from URL:", error);
    return defaultFilters;
  }
};

export const encodeColumnVisibility = (visibility: ColumnVisibility): string => {
  const defaultVisibility = TABLE_HEADERS.reduce((acc, h) => {
    acc[h.key] = DEFAULT_HIDDEN_COLUMNS.includes(h.key);
    return acc;
  }, {} as ColumnVisibility);

  // Only include columns that differ from default
  const changedVisibility = Object.entries(visibility).filter(
    ([key, value]) => value !== defaultVisibility[key]
  );

  if (changedVisibility.length === 0) return "";
  
  return btoa(JSON.stringify(Object.fromEntries(changedVisibility)));
};

export const decodeColumnVisibility = (encodedVisibility: string): ColumnVisibility => {
  const defaultVisibility = TABLE_HEADERS.reduce((acc, h) => {
    acc[h.key] = DEFAULT_HIDDEN_COLUMNS.includes(h.key);
    return acc;
  }, {} as ColumnVisibility);

  if (!encodedVisibility) return defaultVisibility;

  try {
    const decoded = JSON.parse(atob(encodedVisibility));
    return { ...defaultVisibility, ...decoded };
  } catch (error) {
    console.warn("Failed to decode column visibility from URL:", error);
    return defaultVisibility;
  }
};

export const createSearchParams = (
  globalSearch: string,
  columnFilters: ColumnFilters,
  hiddenCols: ColumnVisibility
): URLSearchParams => {
  const params = new URLSearchParams();

  if (globalSearch.trim()) {
    params.set("search", globalSearch.trim());
  }

  const encodedFilters = encodeColumnFilters(columnFilters);
  if (encodedFilters) {
    params.set("filters", encodedFilters);
  }

  const encodedVisibility = encodeColumnVisibility(hiddenCols);
  if (encodedVisibility) {
    params.set("cols", encodedVisibility);
  }

  return params;
};
