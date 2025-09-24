import { ColumnFilters, ColumnVisibility, ColumnWidths } from "@/types/exam";
import { TABLE_HEADERS, DEFAULT_HIDDEN_COLUMNS, DEFAULT_COLUMN_WIDTHS, MIN_COLUMN_WIDTH } from "@/config/tableConfig";

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

  const changedVisibility = Object.entries(visibility).filter(
    ([key, value]) => value !== defaultVisibility[key]
  );

  if (changedVisibility.length === 0) return "";

  return btoa(JSON.stringify(Object.fromEntries(changedVisibility)));
};

export const encodeColumnWidths = (columnWidths: ColumnWidths): string => {
  const changedColumnWidths = Object.entries(columnWidths).filter(
    ([key, value]) => value !== DEFAULT_COLUMN_WIDTHS[key]
  );

  if (changedColumnWidths.length === 0) return "";

  return btoa(JSON.stringify(Object.fromEntries(changedColumnWidths)));
}

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

export const decodeColumnWidths = (encodedWidths: string): ColumnWidths => {
  if (!encodedWidths) return DEFAULT_COLUMN_WIDTHS;

  try {
    const decoded = JSON.parse(atob(encodedWidths));
    const merged = { ...DEFAULT_COLUMN_WIDTHS, ...decoded };
    const allowed = new Set(TABLE_HEADERS.map(h => h.key));
    const sanitized = Object.fromEntries(
      Object.entries(merged)
        //@ts-ignore
        .filter(([k]) => allowed.has(k as string))
        .map(([k, v]) => {
          const n = Math.floor(Number(v));
          const clamped = Math.max(MIN_COLUMN_WIDTH, n);
          return [k, Number.isFinite(clamped) ? clamped : DEFAULT_COLUMN_WIDTHS[k]];
        })
    ) as ColumnWidths;
    return sanitized;
  } catch (error) {
    console.warn("Failed to decode column widths from URL:", error);
    return DEFAULT_COLUMN_WIDTHS
  }
}

export const createSearchParams = (
  globalSearch: string,
  columnFilters: ColumnFilters,
  hiddenCols: ColumnVisibility,
  newColumnWidths: ColumnWidths,
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

  const encodedWidths = encodeColumnWidths(newColumnWidths);
  if (encodedWidths) {
    params.set("widths", encodedWidths);
  }

  return params;
};
