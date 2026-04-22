"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ColumnFilters, ColumnVisibility } from "@/types/exam";
import { StudiengangFilter, DegreeFilter } from "@/hooks/useExamFiltering";
import {
  decodeColumnFilters,
  decodeColumnVisibility,
  createSearchParams,
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

  const [studiengang, setStudiengang] = useState<StudiengangFilter>(() => {
    return (searchParams.get("studiengang") as StudiengangFilter) || "all";
  });

  const [degree, setDegree] = useState<DegreeFilter>(() => {
    return (searchParams.get("degree") as DegreeFilter) || "all";
  });

  const updateUrl = useCallback(
    (
      newGlobalSearch: string,
      newColumnFilters: ColumnFilters,
      newHiddenCols: ColumnVisibility,
      newStudiengang: StudiengangFilter,
      newDegree: DegreeFilter,
    ) => {
      const params = createSearchParams(
        newGlobalSearch,
        newColumnFilters,
        newHiddenCols,
      );

      if (newStudiengang !== "all") params.set("studiengang", newStudiengang);
      if (newDegree !== "all") params.set("degree", newDegree);

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrl(globalSearch, columnFilters, hiddenCols, studiengang, degree);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [globalSearch, columnFilters, hiddenCols, studiengang, degree, updateUrl]);

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

  const handleStudiengangChange = useCallback((value: StudiengangFilter) => {
    setStudiengang(value);
  }, []);

  const handleDegreeChange = useCallback((value: DegreeFilter) => {
    setDegree(value);
  }, []);

  return {
    globalSearch,
    columnFilters,
    hiddenCols,
    studiengang,
    degree,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
    handleStudiengangChange,
    handleDegreeChange,
  };
};