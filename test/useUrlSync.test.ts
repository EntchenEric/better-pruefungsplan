/** @jest-environment jsdom */

/*
    This file is AI generated. However tests are checked closely.
*/

import { renderHook, act } from "@testing-library/react";

jest.useFakeTimers();

// Router.replace spy
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@//utils/urlUtils", () => ({
  __esModule: true,
  decodeColumnFilters: jest.fn(),
  decodeColumnVisibility: jest.fn(),
  decodeColumnWidths: jest.fn(),
  createSearchParams: jest.fn(),
  isCourse: jest.fn(),
  isSemester: jest.fn(),
}));

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  decodeColumnFilters,
  decodeColumnVisibility,
  decodeColumnWidths,
  createSearchParams,
  isCourse,
  isSemester,
} from "@//utils/urlUtils";

import { useUrlSync } from "@/hooks/useUrlSync";

const mockUseSearchParams = useSearchParams as unknown as jest.Mock;
const mockUseRouter = useRouter as unknown as jest.Mock;
const mockUsePathname = usePathname as unknown as jest.Mock;

const mockDecodeColumnFilters = decodeColumnFilters as unknown as jest.Mock;
const mockDecodeColumnVisibility =
  decodeColumnVisibility as unknown as jest.Mock;
const mockDecodeColumnWidths = decodeColumnWidths as unknown as jest.Mock;
const mockCreateSearchParams = createSearchParams as unknown as jest.Mock;
const mockIsCourse = isCourse as unknown as jest.Mock;
const mockIsSemester = isSemester as unknown as jest.Mock;

function setSearchParams(params: Record<string, string | undefined>) {
  // Use a simple object with .get for compatibility
  // (ReadonlyURLSearchParams exposes .get similarly)
  const obj = {
    get: (key: string) => (key in params ? (params[key] ?? null) : null),
    // minimal surface that hook needs; no other API usage
  };
  mockUseSearchParams.mockReturnValue(obj);
}

beforeEach(() => {
  jest.clearAllMocks();

  mockUseRouter.mockReturnValue({ replace: replaceMock });
  mockUsePathname.mockReturnValue("/exam");

  // Default URL decoders return empty objects
  mockDecodeColumnFilters.mockReturnValue({});
  mockDecodeColumnVisibility.mockReturnValue({});
  mockDecodeColumnWidths.mockReturnValue({});

  // Default validators
  mockIsCourse.mockImplementation((v: string) => ["AI", "SE"].includes(v));
  mockIsSemester.mockImplementation((v: string) =>
    ["WS23", "SS24"].includes(v),
  );

  // Default createSearchParams echoes only search (trimmed) to keep expectations simple
  mockCreateSearchParams.mockImplementation((search: string) => {
    const usp = new URLSearchParams();
    if (typeof search === "string" && search.trim()) {
      usp.set("search", search.trim());
    }
    return usp;
  });
});

describe("useUrlSync - initialization from URL", () => {
  test("initializes all states from search params and decoders; valid course/semester stay selected", () => {
    setSearchParams({
      search: "hello",
      filters: "encF",
      cols: "encV",
      widths: "encW",
      course: "AI",
      semester: "WS23",
    });

    const decodedFilters = { po: "2016" };
    const decodedVis = { po: true, mid: false };
    const decodedWidths = { mid: 123 };

    mockDecodeColumnFilters.mockReturnValueOnce(decodedFilters);
    mockDecodeColumnVisibility.mockReturnValueOnce(decodedVis);
    mockDecodeColumnWidths.mockReturnValueOnce(decodedWidths);

    const { result } = renderHook(() => useUrlSync());

    expect(result.current.globalSearch).toBe("hello");
    expect(result.current.columnFilters).toEqual(decodedFilters);
    expect(result.current.hiddenCols).toEqual(decodedVis);
    expect(result.current.colWidths).toEqual(decodedWidths);
    expect(result.current.selectedCourse).toBe("AI");
    expect(result.current.selectedSemester).toBe("WS23");

    expect(mockDecodeColumnFilters).toHaveBeenCalledWith("encF");
    expect(mockDecodeColumnVisibility).toHaveBeenCalledWith("encV");
    expect(mockDecodeColumnWidths).toHaveBeenCalledWith("encW");
    expect(mockIsCourse).toHaveBeenCalledWith("AI");
    expect(mockIsSemester).toHaveBeenCalledWith("WS23");
  });

  test("invalid course/semester -> undefined selections", () => {
    setSearchParams({
      course: "INVALID",
      semester: "BAD",
    });
    mockIsCourse.mockReturnValue(false);
    mockIsSemester.mockReturnValue(false);

    const { result } = renderHook(() => useUrlSync());
    expect(result.current.selectedCourse).toBeUndefined();
    expect(result.current.selectedSemester).toBeUndefined();
  });

  test("missing params -> defaults (empty/undefined)", () => {
    setSearchParams({}); // everything absent

    const { result } = renderHook(() => useUrlSync());
    expect(result.current.globalSearch).toBe("");
    expect(result.current.selectedCourse).toBeUndefined();
    expect(result.current.selectedSemester).toBeUndefined();
    expect(result.current.columnFilters).toEqual({});
    expect(result.current.hiddenCols).toEqual({});
    expect(result.current.colWidths).toEqual({});
  });
});

describe("useUrlSync - debounced URL updates", () => {
  test("debounces updates and calls router.replace with query string when params not empty", () => {
    setSearchParams({});
    // Force createSearchParams to return a constant non-empty query
    mockCreateSearchParams.mockImplementation(
      () => new URLSearchParams("q=1&x=2"),
    );

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange("something");
    });

    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/exam?q=1&x=2", {
      scroll: false,
    });
  });

  test("when params are empty -> pathname only", () => {
    setSearchParams({});
    mockCreateSearchParams.mockImplementation(() => new URLSearchParams(""));

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange("   "); // mock decides empty anyway
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/exam", { scroll: false });
  });

  test("only last change within debounce window triggers one replace", () => {
    setSearchParams({});
    mockCreateSearchParams.mockImplementation(
      (s: string) =>
        new URLSearchParams(s ? `search=${encodeURIComponent(s)}` : ""),
    );

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange("a");
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      result.current.handleGlobalSearchChange("ab");
    });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/exam?search=ab", {
      scroll: false,
    });
  });

  test("passes all current states into createSearchParams in correct order", () => {
    setSearchParams({});

    const spy = mockCreateSearchParams.mockImplementation(
      () => new URLSearchParams("ok=1"),
    );

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange(" hello ");
      result.current.handleColumnFilterChange("po", "2016");
      result.current.handleToggleColumnVisibility("mid");
      result.current.handleColumnWidthChange("mid", 222);
      result.current.setSelectedCourse("AI");
      result.current.setSelectedSemester("SS24");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(spy).toHaveBeenCalledTimes(1);
    const [gs, filters, vis, widths, course, semester] = spy.mock.calls[0];

    expect(gs).toBe(" hello ");
    expect(filters).toEqual({ po: "2016" });
    expect(vis.mid).toBe(true); // toggled from undefined -> true
    expect(widths.mid).toBe(222);
    expect(course).toBe("AI");
    expect(semester).toBe("SS24");
  });
});

describe("useUrlSync - handlers update state", () => {
  test("state updates via handlers reflect immediately", () => {
    setSearchParams({
      filters: "encF",
      cols: "encV",
      widths: "encW",
      search: "init",
    });

    mockDecodeColumnFilters.mockReturnValueOnce({ po: "" });
    mockDecodeColumnVisibility.mockReturnValueOnce({ mid: false });
    mockDecodeColumnWidths.mockReturnValueOnce({ mid: 100 });

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange("find me");
    });
    expect(result.current.globalSearch).toBe("find me");

    act(() => {
      result.current.handleColumnFilterChange("po", "2016");
    });
    expect(result.current.columnFilters.po).toBe("2016");

    act(() => {
      result.current.handleToggleColumnVisibility("mid");
    });
    expect(result.current.hiddenCols.mid).toBe(true);

    act(() => {
      result.current.handleColumnWidthChange("mid", 250);
    });
    expect(result.current.colWidths.mid).toBe(250);

    act(() => {
      result.current.setSelectedCourse("AI");
      result.current.setSelectedSemester("WS23");
    });
    expect(result.current.selectedCourse).toBe("AI");
    expect(result.current.selectedSemester).toBe("WS23");
  });
});

describe("useUrlSync - pathname and router options", () => {
  test("uses current pathname and scroll:false", () => {
    mockUsePathname.mockReturnValue("/custom");
    setSearchParams({});
    mockCreateSearchParams.mockReturnValue(new URLSearchParams("a=1"));

    const { result } = renderHook(() => useUrlSync());

    act(() => {
      result.current.handleGlobalSearchChange("x");
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(replaceMock).toHaveBeenCalledWith("/custom?a=1", { scroll: false });
  });
});
