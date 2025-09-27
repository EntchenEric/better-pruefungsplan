/** @jest-environment jsdom */
/*
    This file is AI generated. However tests are checked closely.
*/

import { renderHook } from "@testing-library/react";
import { useExamFiltering } from "@/hooks/useExamFiltering";

jest.mock("@//config/tableConfig", () => {
  const TABLE_HEADERS = [
    { key: "modul" },
    { key: "pruefer" },
    { key: "po" },
    { key: "datum" },
  ];
  const COURSES = [{ key: "AI" }, { key: "SE" }];
  const SEMESTERS = [{ key: "WS23" }, { key: "SS24" }];
  return {
    __esModule: true,
    TABLE_HEADERS,
    COURSES,
    SEMESTERS,
  };
});

type Entry = {
  [k: string]: string;
};

const ENTRIES: Entry[] = [
  {
    modul: "Mathematics",
    pruefer: "Dr. Alice",
    po: "2016",
    datum: "2024-02-01",
    AI: "WS23",
    SE: "",
  },
  {
    modul: "Software Engineering",
    pruefer: "Dr. Bob",
    po: "2020",
    datum: "2024-02-02",
    AI: "",
    SE: "SS24",
  },
  {
    modul: "algorithms",
    pruefer: "Charlie",
    po: "2016",
    datum: "2024-02-03",
    AI: "SS24",
    SE: "WS23",
  },
  {
    modul: "Philosophy",
    pruefer: "Dr. Eve",
    po: "2016",
    datum: "2024-02-04",
    AI: "",
    SE: "",
  },
];

describe("useExamFiltering", () => {
  test("no filters => returns all entries", () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, undefined, undefined),
    );
    expect(result.current).toHaveLength(ENTRIES.length);
  });

  test("global search matches any field, case-insensitive; does not trim the search string for matching", () => {
    // With surrounding spaces, the hook does NOT trim for matching -> no result
    const { result, rerender } = renderHook(
      ({ search }) =>
        useExamFiltering(ENTRIES as any, search, {}, undefined, undefined),
      { initialProps: { search: "  soft  " } },
    );
    expect(result.current.map((e) => e.modul)).toEqual([]);

    // Without spaces, it should match "Software Engineering"
    rerender({ search: "soft" });
    expect(result.current.map((e) => e.modul)).toEqual([
      "Software Engineering",
    ]);

    // Uppercase still matches (case-insensitive)
    rerender({ search: "DR." });
    expect(result.current.map((e) => e.pruefer)).toEqual([
      "Dr. Alice",
      "Dr. Bob",
      "Dr. Eve",
    ]);
  });

  test("columnFilters: single key, includes, case-insensitive, trims", () => {
    const filters = { modul: "  math " };
    const { result } = renderHook(() =>
      useExamFiltering(
        ENTRIES as any,
        "",
        filters as any,
        undefined,
        undefined,
      ),
    );
    expect(result.current.map((e) => e.modul)).toEqual(["Mathematics"]);
  });

  test("columnFilters: multiple keys must all match", () => {
    const filters = { modul: "algo", pruefer: "char" };
    const { result } = renderHook(() =>
      useExamFiltering(
        ENTRIES as any,
        "",
        filters as any,
        undefined,
        undefined,
      ),
    );
    expect(result.current.map((e) => e.modul)).toEqual(["algorithms"]);
  });

  test("columnFilters: whitespace-only values are ignored", () => {
    const filters = { modul: "   " };
    const { result } = renderHook(() =>
      useExamFiltering(
        ENTRIES as any,
        "",
        filters as any,
        undefined,
        undefined,
      ),
    );
    expect(result.current).toHaveLength(ENTRIES.length);
  });

  test("selectedCourse only: filters to entries with non-empty value in that course column", () => {
    // AI selected => entries whose modul are Mathematics and algorithms
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, "AI", undefined),
    );
    expect(result.current.map((e) => e.modul)).toEqual([
      "Mathematics",
      "algorithms",
    ]);
  });

  test("selectedCourse invalid => ignored", () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, "INVALID", undefined),
    );
    expect(result.current).toHaveLength(ENTRIES.length);
  });

  test("selectedSemester only (no course): entries where any course column equals the semester", () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, undefined, "WS23"),
    );
    expect(result.current.map((e) => e.modul)).toEqual([
      "Mathematics",
      "algorithms",
    ]);
  });

  test("selectedSemester invalid => ignored", () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, undefined, "BAD"),
    );
    expect(result.current).toHaveLength(ENTRIES.length);
  });

  test("selectedCourse + selectedSemester: exact equality on the course column", () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, "AI", "SS24"),
    );
    expect(result.current.map((e) => e.modul)).toEqual(["algorithms"]);
  });

  test('selectedSemester valid + course invalid behaves like "no course" case', () => {
    const { result } = renderHook(() =>
      useExamFiltering(ENTRIES as any, "", {}, "CS", "WS23"),
    );
    expect(result.current.map((e) => e.modul)).toEqual([
      "Mathematics",
      "algorithms",
    ]);
  });

  test("combination: global + columnFilters + course + semester", () => {
    const { result } = renderHook(() =>
      useExamFiltering(
        ENTRIES as any,
        "char",
        { modul: "algo" } as any,
        "AI",
        "SS24",
      ),
    );
    expect(result.current.map((e) => e.modul)).toEqual(["algorithms"]);
  });

  test("rerender: responds to prop changes (memo dependencies)", () => {
    const { result, rerender } = renderHook(
      ({ search, filters, course, semester }) =>
        useExamFiltering(
          ENTRIES as any,
          search,
          filters as any,
          course,
          semester,
        ),
      {
        initialProps: {
          search: "",
          filters: {},
          course: undefined as string | undefined,
          semester: undefined as string | undefined,
        },
      },
    );

    expect(result.current).toHaveLength(ENTRIES.length);

    rerender({
      search: "bob",
      filters: {},
      course: undefined,
      semester: undefined,
    });
    expect(result.current.map((e) => e.pruefer)).toEqual(["Dr. Bob"]);

    rerender({
      search: "",
      filters: { po: "2016" },
      course: undefined,
      semester: undefined,
    });
    expect(result.current.map((e) => e.po)).toEqual(["2016", "2016", "2016"]);

    rerender({ search: "", filters: {}, course: "SE", semester: undefined });
    expect(result.current.map((e) => e.modul)).toEqual([
      "Software Engineering",
      "algorithms",
    ]);

    rerender({ search: "", filters: {}, course: undefined, semester: "SS24" });
    expect(result.current.map((e) => e.modul)).toEqual([
      "Software Engineering",
      "algorithms",
    ]);

    rerender({ search: "", filters: {}, course: "SE", semester: "SS24" });
    expect(result.current.map((e) => e.modul)).toEqual([
      "Software Engineering",
    ]);
  });
});
