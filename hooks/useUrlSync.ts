"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ColumnFilters, ColumnVisibility } from "@/types/exam";
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

  const updateUrl = useCallback(
    (
      newGlobalSearch: string,
      newColumnFilters: ColumnFilters,
      newHiddenCols: ColumnVisibility
    ) => {
      const params = createSearchParams(
        newGlobalSearch,
        newColumnFilters,
        newHiddenCols
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
      updateUrl(globalSearch, columnFilters, hiddenCols);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [globalSearch, columnFilters, hiddenCols, updateUrl]);

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

  return {
    globalSearch,
    columnFilters,
    hiddenCols,
    handleGlobalSearchChange,
    handleColumnFilterChange,
    handleToggleColumnVisibility,
  };
};