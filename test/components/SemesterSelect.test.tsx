/** @jest-environment jsdom */
/*
  This file is AI generated. However tests are checked closely.
  Test stack: Jest + @testing-library/react (jsdom). No @testing-library/jest-dom used.
  Scope: Focused on SemesterSelect behavior from the PR diff.
*/
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SemesterSelect } from "@/components/SemesterSelect";

// Keep config alias consistent with repo usage
jest.mock("@//config/tableConfig", () => {
  const SEMESTERS = [
    { key: "1", label: "1" },
    { key: "2", label: "2" },
    { key: "WP", label: "Wahlpflicht" },
  ];
  return { __esModule: true, SEMESTERS };
});

// Import mocked array so we can adjust it in edge-case tests
import { SEMESTERS } from "@//config/tableConfig";

const DEFAULT_SEMESTERS = SEMESTERS.map(s => ({ ...s }));

describe("SemesterSelect", () => {
  let setSelectedSemester: jest.Mock;

  beforeEach(() => {
    setSelectedSemester = jest.fn();
    // Reset SEMESTERS contents before each test
    SEMESTERS.splice(0, SEMESTERS.length, ...DEFAULT_SEMESTERS);
  });

  test("renders select with default 'Alle Semester' and configured options", () => {
    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);

    const selectEl = screen.getByRole("combobox");
    expect(!!selectEl).toBe(true);
    expect(selectEl).toHaveProperty("value", ""); // empty string when undefined

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(1 + SEMESTERS.length);
    expect(options[0].textContent).toBe("Alle Semester");
    expect(options[0]).toHaveProperty("value", "");

    SEMESTERS.forEach((s, i) => {
      const opt = options[i + 1];
      expect(opt).toBeTruthy();
      expect(opt.textContent).toBe(s.label);
      expect(opt).toHaveProperty("value", s.key);
    });
  });

  test("uses selectedSemester prop as current value", () => {
    render(<SemesterSelect selectedSemester="2" setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");
    expect(selectEl).toHaveProperty("value", "2");
  });

  test("change to a semester calls setter with that value (happy path)", () => {
    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");

    fireEvent.change(selectEl, { target: { value: "1" } });
    expect(setSelectedSemester).toHaveBeenCalledTimes(1);
    expect(setSelectedSemester).toHaveBeenCalledWith("1");
  });

  test('change to "" (Alle Semester) calls setter with undefined', () => {
    render(<SemesterSelect selectedSemester={"1"} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");

    fireEvent.change(selectEl, { target: { value: "" } });
    expect(setSelectedSemester).toHaveBeenCalledTimes(1);
    expect(setSelectedSemester).toHaveBeenCalledWith(undefined);
  });

  test("multiple sequential changes propagate correct values", () => {
    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");

    fireEvent.change(selectEl, { target: { value: "1" } });
    fireEvent.change(selectEl, { target: { value: "2" } });
    fireEvent.change(selectEl, { target: { value: "" } });

    expect(setSelectedSemester).toHaveBeenNthCalledWith(1, "1");
    expect(setSelectedSemester).toHaveBeenNthCalledWith(2, "2");
    expect(setSelectedSemester).toHaveBeenNthCalledWith(3, undefined);
    expect(setSelectedSemester).toHaveBeenCalledTimes(3);
  });

  test("handles invalid selectedSemester values gracefully (value shown as-is)", () => {
    render(<SemesterSelect selectedSemester={"unknown"} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");
    expect(selectEl).toHaveProperty("value", "unknown");
  });

  test("treats null selectedSemester like undefined (empty)", () => {
    render(<SemesterSelect selectedSemester={null as any} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");
    expect(selectEl).toHaveProperty("value", "");
  });

  test("renders correctly when SEMESTERS is empty (only default option remains)", () => {
    SEMESTERS.splice(0, SEMESTERS.length);

    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(1);
    expect(options[0].textContent).toBe("Alle Semester");
    expect(options[0]).toHaveProperty("value", "");
  });

  test("supports labels with special characters", () => {
    SEMESTERS.splice(0, SEMESTERS.length,
      { key: "sp1", label: "WS 2023/24 (βeta & QA)" },
      { key: "sp2", label: "SS 2024 <Alpha>" }
    );

    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    expect(screen.getByRole("option", { name: "WS 2023/24 (βeta & QA)" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "SS 2024 <Alpha>" })).toBeTruthy();
  });

  test("applies key styling classes to the select element", () => {
    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");
    const classes = String((selectEl as HTMLSelectElement).className);
    ["px-4", "py-2", "rounded-lg", "border-2", "border-primary", "bg-secondary", "text-secondary-text"]
      .forEach(cls => expect(classes.includes(cls)).toBe(true));
  });

  // Regression guard based on the diff: onChange should directly receive the event and call setSelectedSemester.
  test("[regression] onChange handler receives event and updates via setSelectedSemester", () => {
    render(<SemesterSelect selectedSemester={undefined} setSelectedSemester={setSelectedSemester} />);
    const selectEl = screen.getByRole("combobox");
    fireEvent.change(selectEl, { target: { value: "WP" } });
    expect(setSelectedSemester).toHaveBeenCalledWith("WP");
  });
});