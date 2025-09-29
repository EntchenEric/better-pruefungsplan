/** @jest-environment jsdom */
/*
  This file is AI generated. However tests are checked closely.
  Testing stack: Jest 30 (jsdom) with @testing-library/react 16.
*/

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExamTableHeader } from "@/components/ExamTableHeader";

jest.mock("@//config/tableConfig", () => ({
  __esModule: true,
  TABLE_HEADERS: [
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "score", label: "Score" },
    { key: "status", label: "Status" },
  ],
  MIN_COLUMN_WIDTH: 100,
}));

type ColumnVisibility = Record<string, boolean>;
type ColumnWidths = Record<string, any>;
type ColumnFilters = Record<string, string>;

describe("ExamTableHeader", () => {
  const makeDefaultProps = () => ({
    hiddenCols: {} as ColumnVisibility,
    colWidths: {
      name: 200,
      date: 150,
      score: 100,
      status: 120,
    } as ColumnWidths,
    setColWidths: jest.fn(),
    columnFilters: {
      name: "",
      date: "",
      score: "",
      status: "",
    } as ColumnFilters,
    onColumnFilterChange: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });

  describe("rendering", () => {
    test("shows visible column headers", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      screen.getByText("Name");
      screen.getByText("Date");
      screen.getByText("Score");
      screen.getByText("Status");
    });

    test("respects hidden columns configuration", () => {
      const props = makeDefaultProps();
      props.hiddenCols = { name: true, score: true };
      render(<ExamTableHeader {...props} />);

      expect(screen.queryByText("Name")).toBeNull();
      expect(screen.queryByText("Score")).toBeNull();
      screen.getByText("Date");
      screen.getByText("Status");
    });

    test("applies numeric widths as inline style", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      const nameHeader = screen.getByText("Name").closest("th") as HTMLElement;
      const dateHeader = screen.getByText("Date").closest("th") as HTMLElement;

      expect(nameHeader.style.width).toBe("200px");
      expect(dateHeader.style.width).toBe("150px");
      expect(nameHeader.style.minWidth).toBe("100px");
    });

    test("renders filters with current values", () => {
      const props = makeDefaultProps();
      props.columnFilters = {
        name: "Alice",
        date: "2023",
        score: "95",
        status: "passed",
      };
      render(<ExamTableHeader {...props} />);

      screen.getByDisplayValue("Alice");
      screen.getByDisplayValue("2023");
      screen.getByDisplayValue("95");
      screen.getByDisplayValue("passed");
    });

    test("hides filter inputs for hidden columns", () => {
      const props = makeDefaultProps();
      props.hiddenCols = { name: true, date: true, score: true, status: true };
      render(<ExamTableHeader {...props} />);

      expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    });
  });

  describe("filter interactions", () => {
    test("invokes onColumnFilterChange when typing", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      fireEvent.change(screen.getByLabelText("Filter für Name"), {
        target: { value: "Bob" },
      });

      expect(props.onColumnFilterChange).toHaveBeenCalledWith("name", "Bob");
    });

    test("displays clear button when filter value exists and clears on click", () => {
      const props = makeDefaultProps();
      props.columnFilters.name = "Bob";
      render(<ExamTableHeader {...props} />);

      const clearButton = screen.getByLabelText("Clear filter for Name");
      expect(clearButton).not.toBeNull();

      fireEvent.click(clearButton);

      expect(props.onColumnFilterChange).toHaveBeenCalledWith("name", "");
    });

    test("supports rapid successive filter changes", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      const input = screen.getByLabelText("Filter für Name");
      fireEvent.change(input, { target: { value: "A" } });
      fireEvent.change(input, { target: { value: "Al" } });
      fireEvent.change(input, { target: { value: "Ali" } });

      expect(props.onColumnFilterChange).toHaveBeenCalledTimes(3);
      expect(props.onColumnFilterChange).toHaveBeenLastCalledWith(
        "name",
        "Ali",
      );
    });
  });

  describe("column resizing", () => {
    const beginResize = (headerLabel: string, startX = 200) => {
      const header = screen.getByText(headerLabel).closest("th");
      const resizer = header.querySelector(".cursor-col-resize") as HTMLElement;
      fireEvent.mouseDown(resizer, { clientX: startX });
      return resizer;
    };

    test("mouse down on resizer enables resize state and prevents default", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      const resizer = screen
        .getByText("Name")
        .closest("th")
        .querySelector(".cursor-col-resize") as HTMLElement;

      const mouseDown = new MouseEvent("mousedown", {
        clientX: 220,
        bubbles: true,
      });
      fireEvent(resizer, mouseDown);

      expect(mouseDown.defaultPrevented).toBe(true);
      expect(document.body.style.cursor).toBe("col-resize");
      expect(document.body.style.userSelect).toBe("none");
    });

    test("mouse move applies delta to setColWidths", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      beginResize("Name", 200);
      fireEvent(
        window,
        new MouseEvent("mousemove", { clientX: 250, bubbles: true }),
      );

      expect(props.setColWidths).toHaveBeenCalledWith("name", 250);
    });

    test("clamps width to MIN_COLUMN_WIDTH when shrinking below minimum", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      beginResize("Name", 200);
      fireEvent(
        window,
        new MouseEvent("mousemove", { clientX: 10, bubbles: true }),
      );

      expect(props.setColWidths).toHaveBeenCalledWith("name", 100);
    });

    test("mouseup removes resize state and restores body styles", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      beginResize("Name", 200);
      fireEvent(window, new MouseEvent("mouseup", { bubbles: true }));

      expect(document.body.style.cursor).toBe("");
      expect(document.body.style.userSelect).toBe("");
    });

    test("supports string widths that end with px", () => {
      const props = makeDefaultProps();
      props.colWidths = {
        name: "220px",
        date: "120px",
        score: "105px",
        status: "80px",
      } as ColumnWidths;
      render(<ExamTableHeader {...props} />);

      beginResize("Name", 220);
      fireEvent(
        window,
        new MouseEvent("mousemove", { clientX: 260, bubbles: true }),
      );

      expect(props.setColWidths).toHaveBeenCalledWith("name", 260);
    });

    test("falls back to minimum width when current value is not parseable", () => {
      const props = makeDefaultProps();
      props.colWidths = {
        name: "invalid",
        date: null,
        score: undefined,
        status: 140,
      } as ColumnWidths;
      render(<ExamTableHeader {...props} />);

      beginResize("Name", 200);
      fireEvent(
        window,
        new MouseEvent("mousemove", { clientX: 280, bubbles: true }),
      );

      expect(props.setColWidths).toHaveBeenCalledWith("name", 180);
    });

    test("missing colWidths entry for column starts at minimum width", () => {
      const props = makeDefaultProps();
      props.colWidths = { name: 200 } as ColumnWidths;
      render(<ExamTableHeader {...props} />);

      beginResize("Date", 200);
      fireEvent(
        window,
        new MouseEvent("mousemove", { clientX: 250, bubbles: true }),
      );

      expect(props.setColWidths).toHaveBeenCalledWith("date", 150);
    });
  });

  describe("cleanup", () => {
    test("removes global listeners on unmount", () => {
      const removeSpy = jest.spyOn(window, "removeEventListener");
      const props = makeDefaultProps();
      const { unmount } = render(<ExamTableHeader {...props} />);

      unmount();

      expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
      removeSpy.mockRestore();
    });

    test("resets body styles when unmounted", () => {
      const props = makeDefaultProps();
      const { unmount } = render(<ExamTableHeader {...props} />);

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      unmount();

      expect(document.body.style.cursor).toBe("");
      expect(document.body.style.userSelect).toBe("");
    });
  });

  describe("accessibility", () => {
    test("header cells expose expected semantics", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(8);

      headers.slice(0, 4).forEach((header, idx) => {
        expect(header.getAttribute("aria-colindex")).toBe(String(idx + 1));
        expect(header.getAttribute("scope")).toBe("col");
      });
    });

    test("filter inputs set expected attributes", () => {
      const props = makeDefaultProps();
      render(<ExamTableHeader {...props} />);

      const input = screen.getByLabelText(
        "Filter für Name",
      ) as HTMLInputElement;
      expect(input.getAttribute("type")).toBe("text");
      expect(input.getAttribute("spellcheck")).toBe("false");
      expect(input.getAttribute("autocomplete")).toBe("off");
    });
  });
});
