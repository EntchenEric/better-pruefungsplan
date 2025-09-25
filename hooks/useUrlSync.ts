"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ColumnFilters, ColumnVisibility, ColumnWidths } from "@/types/exam";
import {
  decodeColumnFilters,
  decodeColumnVisibility,
  createSearchParams,
  decodeColumnWidths,
  isCourse,
  isSemester,
} from "@/utils/urlUtils";

export const useUrlSync = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [globalSearch, setGlobalSearch] = useState(() => {
    return searchParams.get("search") || "";
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFilters>(() => {
    const encodedFilters = searchParams.get("filters");
    return decodeColumnFilters(encodedFilters || "");
  });

  const [hiddenCols, setHiddenCols] = useState<ColumnVisibility>(() => {
    const encodedVisibility = searchParams.get("cols");
    return decodeColumnVisibility(encodedVisibility || "");
  });

  const [colWidths, setColWidths] = useState<ColumnWidths>(() => {
    const encodedWidths = searchParams.get("widths");
    return decodeColumnWidths(encodedWidths || "");
  })

  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(() => {
    const course = searchParams.get("course") || undefined;
    return course && isCourse(course) ? course : undefined;

  })

  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(() => {
    const semester = searchParams.get("semester") || undefined;
    return semester && isSemester(semester) ? semester : undefined;

  })

  const updateUrl = useCallback(
    (
      newGlobalSearch: string,
      newColumnFilters: ColumnFilters,
      newHiddenCols: ColumnVisibility,
      newColumnWidths: ColumnWidths,
      selectedCourse: string | undefined,
      selectedSemester: string | undefined,
    ) => {
      const params = createSearchParams(
        newGlobalSearch,
        newColumnFilters,
        newHiddenCols,
        newColumnWidths,
        selectedCourse,
        selectedSemester
      );

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrl(globalSearch, columnFilters, hiddenCols, colWidths, selectedCourse, selectedSemester);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [globalSearch, columnFilters, hiddenCols, colWidths, selectedCourse, selectedSemester, updateUrl]);

  const handleGlobalSearchChange = useCallback((value: string) => {
    setGlobalSearch(value);
  }, []);

  const handleColumnFilterChange = useCallback((key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleColumnVisibility = useCallback((key: string) => {
    setHiddenCols((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleColumnWidthChange = useCallback((key: string, value: number) => {
    setColWidths((prev) => ({ ...prev, [key]: value }));
  }, [])

  return {
    globalSearch,
    columnFilters,
    hiddenCols,
    colWidths,
    selectedCourse,
    selectedSemester,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
    handleColumnWidthChange,
    setSelectedCourse,
    setSelectedSemester,
  };
};