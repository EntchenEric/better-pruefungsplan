/** @jest-environment jsdom */

/**
 * Testing stack
 * - Framework: Jest (ts-jest preset, see jest.config.js)
 * - Library: @testing-library/react (per package.json)
 *
 * Notes:
 * - Uses only core Jest matchers to avoid relying on @testing-library/jest-dom.
 * - Course data is provided via a shared fixture so tests can manipulate it safely.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

type CourseFixture = { key: string; label: string };

const coursesFixture: CourseFixture[] = [
  { key: "cs", label: "Computer Science" },
  { key: "ee", label: "Electrical Engineering" },
  { key: "me", label: "Mechanical Engineering" },
  { key: "bio", label: "Biology" },
];

jest.mock("@//config/tableConfig", () => ({
  COURSES: coursesFixture,
}));

import { CourseFilter } from "../../src/components/CourseFilter";

const getSelect = () => screen.getByRole("combobox") as HTMLSelectElement;

describe("CourseFilter", () => {
  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof CourseFilter>>,
  ) => {
    const setSelectedCourse = jest.fn();
    render(
      <CourseFilter
        selectedCourse={undefined}
        setSelectedCourse={setSelectedCourse}
        {...props}
      />,
    );
    return { selectEl: getSelect(), setSelectedCourse };
  };

  describe("rendering", () => {
    it('renders with default option "Alle Studiengänge anzeigen" and mapped courses', () => {
      const { selectEl } = renderComponent();

      expect(selectEl).toBeTruthy();

      const defaultOption = screen.getByRole("option", {
        name: "Alle Studiengänge anzeigen",
      }) as HTMLOptionElement;
      expect(defaultOption).toBeTruthy();
      expect(defaultOption.value).toBe("");

      const options = screen.getAllByRole("option") as HTMLOptionElement[];
      expect(options.length).toBe(5);

      const csOption = screen.getByRole("option", {
        name: "Computer Science",
      }) as HTMLOptionElement;
      const eeOption = screen.getByRole("option", {
        name: "Electrical Engineering",
      }) as HTMLOptionElement;

      expect(csOption.value).toBe("cs");
      expect(eeOption.value).toBe("ee");
    });

    it("applies the expected tailwind utility classes", () => {
      const { selectEl } = renderComponent();
      const className = selectEl.className || "";

      expect(className.includes("px-4")).toBe(true);
      expect(className.includes("py-2")).toBe(true);
      expect(className.includes("border-2")).toBe(true);
      expect(className.includes("cursor-pointer")).toBe(true);
    });
  });

  describe("controlled value behaviour", () => {
    it("shows empty value when selectedCourse is undefined", () => {
      const { selectEl } = renderComponent({ selectedCourse: undefined });
      expect(selectEl.value).toBe("");
    });

    it("treats null as empty at runtime (defensive case)", () => {
      const { selectEl } = renderComponent({
        selectedCourse: null as unknown as string,
      });
      expect(selectEl.value).toBe("");
    });

    it("reflects a provided course key", () => {
      const { selectEl } = renderComponent({ selectedCourse: "cs" });
      expect(selectEl.value).toBe("cs");
    });

    it("allows empty string as selectedCourse", () => {
      const { selectEl } = renderComponent({ selectedCourse: "" });
      expect(selectEl.value).toBe("");
      const defaultOption = screen.getByRole("option", {
        name: "Alle Studiengänge anzeigen",
      });
      expect(defaultOption).toBeTruthy();
    });
  });

  describe("interactions", () => {
    it("invokes setSelectedCourse with the selected key", () => {
      const { selectEl, setSelectedCourse } = renderComponent();
      fireEvent.change(selectEl, { target: { value: "cs" } });
      expect(setSelectedCourse).toHaveBeenCalledTimes(1);
      expect(setSelectedCourse).toHaveBeenCalledWith("cs");
    });

    it("invokes setSelectedCourse(undefined) for the default option", () => {
      const { selectEl, setSelectedCourse } = renderComponent({
        selectedCourse: "cs",
      });
      fireEvent.change(selectEl, { target: { value: "" } });
      expect(setSelectedCourse).toHaveBeenCalledTimes(1);
      expect(setSelectedCourse).toHaveBeenCalledWith(undefined);
    });

    it("handles rapid consecutive changes", () => {
      const { selectEl, setSelectedCourse } = renderComponent();
      fireEvent.change(selectEl, { target: { value: "cs" } });
      fireEvent.change(selectEl, { target: { value: "ee" } });
      fireEvent.change(selectEl, { target: { value: "" } });
      fireEvent.change(selectEl, { target: { value: "bio" } });

      expect(setSelectedCourse).toHaveBeenCalledTimes(4);
      expect(setSelectedCourse).toHaveBeenNthCalledWith(1, "cs");
      expect(setSelectedCourse).toHaveBeenNthCalledWith(2, "ee");
      expect(setSelectedCourse).toHaveBeenNthCalledWith(3, undefined);
      expect(setSelectedCourse).toHaveBeenNthCalledWith(4, "bio");
    });
  });

  describe("edge cases", () => {
    it("tolerates unknown course keys without throwing", () => {
      const { selectEl } = renderComponent({
        selectedCourse: "not-a-real-course",
      });
      expect(selectEl.value).toBe("not-a-real-course");
    });

    it("supports special characters in selection values", () => {
      const { selectEl, setSelectedCourse } = renderComponent();
      const specialKey = "course-with-special-chars-123\!@#";
      fireEvent.change(selectEl, { target: { value: specialKey } });
      expect(setSelectedCourse).toHaveBeenCalledWith(specialKey);
    });

    it("continues to render when the COURSES array is emptied at runtime", () => {
      const original = coursesFixture.slice();
      coursesFixture.splice(0, coursesFixture.length);

      try {
        const { selectEl } = renderComponent();
        expect(selectEl).toBeTruthy();

        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.length).toBe(1);

        const defaultOption = options[0];
        expect(defaultOption.textContent).toBe("Alle Studiengänge anzeigen");
        expect(defaultOption.value).toBe("");
      } finally {
        coursesFixture.splice(0, coursesFixture.length, ...original);
      }
    });
  });

  describe("accessibility basics", () => {
    it("remains focused after keyboard interaction", () => {
      const { selectEl } = renderComponent();
      selectEl.focus();
      expect(document.activeElement).toBe(selectEl);

      fireEvent.keyDown(selectEl, { key: "ArrowDown" });
      expect(document.activeElement).toBe(selectEl);
    });
  });
});