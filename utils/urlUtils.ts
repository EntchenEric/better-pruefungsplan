import { ColumnFilters, ColumnVisibility, ColumnWidths } from "@/types/exam";
import { TABLE_HEADERS, DEFAULT_HIDDEN_COLUMNS, DEFAULT_COLUMN_WIDTHS, MIN_COLUMN_WIDTH, COURSES, SEMESTERS } from "@/config/tableConfig";

/**
 * Encodes the Column Filters.
 * @param filters The current filters.
 * @returns The filters encoded to a String-
 */
export const encodeColumnFilters = (filters: ColumnFilters): string => {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value.trim() !== "");
  if (activeFilters.length === 0) return "";

  return btoa(JSON.stringify(Object.fromEntries(activeFilters)));
};

/**
 * Decodes the Column Filters.
 * @param encodedFilters The Column Filters as a encoded string.
 * @returns The decoded Column Filters.
 */
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

/**
 * Encodes the Column Visibilties.
 * @param visibility The Column Visibilities.
 * @returns The Column Visibilities as a String.
 */
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

/**
 * Encodes the Column Widths.
 * @param columnWidths The Column Widths.
 * @returns The Coulm Widths as a String.
 */
export const encodeColumnWidths = (columnWidths: ColumnWidths): string => {
  const changedColumnWidths = Object.entries(columnWidths).filter(
    ([key, value]) => value !== DEFAULT_COLUMN_WIDTHS[key]
  );

  if (changedColumnWidths.length === 0) return "";

  return btoa(JSON.stringify(Object.fromEntries(changedColumnWidths)));
}

/**
 * Decodes the column Visibilities.
 * @param encodedVisibility The Column Visitbilities as a String.
 * @returns The decoded Column Visibiities.
 */
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

/**
 * Decoes the Column Widths.
 * @param encodedWidths The encoded Column Widths as a String.
 * @returns The Decoded Coulmn Widths.
 */
export const decodeColumnWidths = (encodedWidths: string): ColumnWidths => {
  if (!encodedWidths) return DEFAULT_COLUMN_WIDTHS;

  try {
    const decoded = JSON.parse(atob(encodedWidths));
    const merged = { ...DEFAULT_COLUMN_WIDTHS, ...decoded };
    const allowed = new Set(TABLE_HEADERS.map(h => h.key));
    const sanitized = Object.fromEntries(
      Object.entries(merged)
        //@ts-expect-error Would be too much of a Workaround to type this correctly. For cleaner Code just expect ts error.
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

/**
 * Checks if a String is a Course.
 * @param s The string to check.
 * @returns true if the string is a course, fase else.
 */
export const isCourse = (s: string): boolean => {
  return COURSES.some(c => c.key === s);
}

/**
 * Checks if a String is a Semester.
 * @param v The string to check.
 * @returns true if the string is a semester, false else.
 */
export const isSemester = (v: string): boolean => {
  return SEMESTERS.some(s => s.key === v);
}

/**
 * Creates the Search Params.
 */
export const createSearchParams = (
  globalSearch: string,
  columnFilters: ColumnFilters,
  hiddenCols: ColumnVisibility,
  newColumnWidths: ColumnWidths,
  selectedCourse: string | undefined,
  selectedSemester: string | undefined,
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

  if (selectedCourse && isCourse(selectedCourse)) {
    params.set("course", selectedCourse);
  }

  if (selectedSemester && isSemester(selectedSemester)) {
    params.set("semester", selectedSemester);
  }

  return params;
};
