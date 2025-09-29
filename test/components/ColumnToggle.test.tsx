import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColumnToggle } from "../../src/components/ColumnToggle";
import { ColumnVisibility } from "../../types/exam";
import { TABLE_HEADERS } from "../../config/tableConfig";

// Mock the react-icons/fa module
jest.mock("react-icons/fa", () => ({
  FaColumns: () => <div data-testid="fa-columns-icon">FaColumns</div>,
}));

// Mock TABLE_HEADERS for consistent testing
jest.mock("../../config/tableConfig", () => ({
  TABLE_HEADERS: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ],
}));

describe("ColumnToggle Component", () => {
  const mockOnToggleColumn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );
    });

    it("renders the title and icon correctly", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      expect(screen.getByTestId("fa-columns-icon")).toBeInTheDocument();
      expect(screen.getByText("Spalten anzeigen:")).toBeInTheDocument();
    });

    it("renders all column toggles from TABLE_HEADERS", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      TABLE_HEADERS.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it("renders checkboxes for each column", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(TABLE_HEADERS.length);
    });
  });

  describe("Checkbox States", () => {
    it("shows all columns as checked when no columns are hidden", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it("shows columns as unchecked when they are in hiddenCols", () => {
      const hiddenCols: ColumnVisibility = {
        name: true,
        email: true,
      };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).not.toBeChecked(); // name
      expect(checkboxes[1]).not.toBeChecked(); // email
      expect(checkboxes[2]).toBeChecked(); // status
      expect(checkboxes[3]).toBeChecked(); // date
    });

    it("handles mixed visibility states correctly", () => {
      const hiddenCols: ColumnVisibility = {
        name: false,
        email: true,
        status: false,
        date: true,
      };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked(); // name (false means visible)
      expect(checkboxes[1]).not.toBeChecked(); // email (true means hidden)
      expect(checkboxes[2]).toBeChecked(); // status (false means visible)
      expect(checkboxes[3]).not.toBeChecked(); // date (true means hidden)
    });

    it("handles all columns hidden", () => {
      const hiddenCols: ColumnVisibility = {
        name: true,
        email: true,
        status: true,
        date: true,
      };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe("Visual Indicators", () => {
    it("shows checkmark for visible columns", () => {
      const hiddenCols: ColumnVisibility = { name: false };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkmarks = screen.getAllByRole("img", { hidden: true });
      expect(checkmarks.length).toBeGreaterThan(0);
    });

    it("applies correct CSS classes for checked state", () => {
      const hiddenCols: ColumnVisibility = { name: false };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const labels = screen.getAllByRole("label");
      labels.forEach((label) => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        const customCheckbox = label.querySelector("div > div");

        if (checkbox?.checked) {
          expect(customCheckbox).toHaveClass("border-primary", "bg-primary");
        } else {
          expect(customCheckbox).toHaveClass("border-secondary-text");
          expect(customCheckbox).not.toHaveClass("bg-primary");
        }
      });
    });
  });

  describe("User Interactions", () => {
    it("calls onToggleColumn when a checkbox is clicked", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(firstCheckbox);

      expect(mockOnToggleColumn).toHaveBeenCalledTimes(1);
      expect(mockOnToggleColumn).toHaveBeenCalledWith("name");
    });

    it("calls onToggleColumn with correct key for each column", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox, index) => {
        fireEvent.click(checkbox);
        expect(mockOnToggleColumn).toHaveBeenCalledWith(
          TABLE_HEADERS[index].key,
        );
      });

      expect(mockOnToggleColumn).toHaveBeenCalledTimes(TABLE_HEADERS.length);
    });

    it("calls onToggleColumn when label is clicked", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstLabel = screen.getByText("Name").closest("label");
      fireEvent.click(firstLabel!);

      expect(mockOnToggleColumn).toHaveBeenCalledTimes(1);
      expect(mockOnToggleColumn).toHaveBeenCalledWith("name");
    });

    it("handles rapid successive clicks correctly", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstCheckbox = screen.getAllByRole("checkbox")[0];

      fireEvent.click(firstCheckbox);
      fireEvent.click(firstCheckbox);
      fireEvent.click(firstCheckbox);

      expect(mockOnToggleColumn).toHaveBeenCalledTimes(3);
      expect(mockOnToggleColumn).toHaveBeenNthCalledWith(1, "name");
      expect(mockOnToggleColumn).toHaveBeenNthCalledWith(2, "name");
      expect(mockOnToggleColumn).toHaveBeenNthCalledWith(3, "name");
    });
  });

  describe("Accessibility", () => {
    it("provides accessible labels for screen readers", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      TABLE_HEADERS.forEach(({ label }) => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      });
    });

    it("uses sr-only class for checkboxes to hide them from visual users", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveClass("sr-only");
      });
    });

    it("supports keyboard navigation", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      firstCheckbox.focus();

      expect(document.activeElement).toBe(firstCheckbox);

      fireEvent.keyDown(firstCheckbox, { key: " ", code: "Space" });
      expect(mockOnToggleColumn).toHaveBeenCalledWith("name");
    });
  });

  describe("Component Structure", () => {
    it("renders with correct CSS classes for layout", () => {
      const hiddenCols: ColumnVisibility = {};
      const { container } = render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        "mb-6",
        "flex",
        "flex-col",
        "items-center",
        "gap-4",
        "text-sm",
        "select-none",
      );
    });

    it("renders toggle container with correct classes", () => {
      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const toggleContainer = screen.getByText("Name").closest("div");
      expect(toggleContainer?.parentElement).toHaveClass(
        "flex",
        "flex-wrap",
        "justify-center",
        "gap-2",
      );
    });

    it("generates unique keys for each toggle element", () => {
      const hiddenCols: ColumnVisibility = {};
      const { container } = render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      TABLE_HEADERS.forEach(({ key }) => {
        const labelElement = container.querySelector(
          `label[key="toggle-${key}"]`,
        );
        expect(labelElement).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty TABLE_HEADERS gracefully", () => {
      // Temporarily mock empty headers
      const originalHeaders = jest.requireMock(
        "../../config/tableConfig",
      ).TABLE_HEADERS;
      jest.doMock("../../config/tableConfig", () => ({
        TABLE_HEADERS: [],
      }));

      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      expect(screen.getByText("Spalten anzeigen:")).toBeInTheDocument();
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);

      // Restore original headers
      jest.doMock("../../config/tableConfig", () => ({
        TABLE_HEADERS: originalHeaders,
      }));
    });

    it("handles undefined values in hiddenCols", () => {
      const hiddenCols: ColumnVisibility = {
        name: undefined,
        email: true,
      };
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked(); // undefined should be treated as falsy (visible)
      expect(checkboxes[1]).not.toBeChecked(); // true means hidden
    });

    it("handles null onToggleColumn callback gracefully", () => {
      const hiddenCols: ColumnVisibility = {};

      // This test ensures the component doesn't crash with null callback
      expect(() => {
        render(
          <ColumnToggle hiddenCols={hiddenCols} onToggleColumn={null as any} />,
        );
      }).not.toThrow();
    });

    it("handles very long column labels", () => {
      const longLabelHeaders = [
        {
          key: "veryLongKey",
          label:
            "This is a very long column label that might cause layout issues",
        },
      ];

      jest.doMock("../../config/tableConfig", () => ({
        TABLE_HEADERS: longLabelHeaders,
      }));

      const hiddenCols: ColumnVisibility = {};
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      expect(
        screen.getByText(
          "This is a very long column label that might cause layout issues",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Callback Behavior", () => {
    it("preserves onToggleColumn reference with useCallback", () => {
      const hiddenCols: ColumnVisibility = {};
      const { rerender } = render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(firstCheckbox);

      // Rerender with same callback
      rerender(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      fireEvent.click(firstCheckbox);
      expect(mockOnToggleColumn).toHaveBeenCalledTimes(2);
    });

    it("updates callback when onToggleColumn prop changes", () => {
      const newMockCallback = jest.fn();
      const hiddenCols: ColumnVisibility = {};

      const { rerender } = render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(firstCheckbox);
      expect(mockOnToggleColumn).toHaveBeenCalledTimes(1);

      // Rerender with new callback
      rerender(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={newMockCallback}
        />,
      );

      fireEvent.click(firstCheckbox);
      expect(newMockCallback).toHaveBeenCalledTimes(1);
      expect(mockOnToggleColumn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration Scenarios", () => {
    it("handles dynamic hiddenCols updates", () => {
      let hiddenCols: ColumnVisibility = { name: true };
      const { rerender } = render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      let firstCheckbox = screen.getAllByRole("checkbox")[0];
      expect(firstCheckbox).not.toBeChecked();

      // Update hiddenCols to show the column
      hiddenCols = { name: false };
      rerender(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );

      firstCheckbox = screen.getAllByRole("checkbox")[0];
      expect(firstCheckbox).toBeChecked();
    });
  });

  describe("Performance", () => {
    it("renders efficiently with large number of columns", () => {
      const manyHeaders = Array.from({ length: 50 }, (_, i) => ({
        key: `column${i}`,
        label: `Column ${i}`,
      }));

      jest.doMock("../../config/tableConfig", () => ({
        TABLE_HEADERS: manyHeaders,
      }));

      const hiddenCols: ColumnVisibility = {};

      const startTime = performance.now();
      render(
        <ColumnToggle
          hiddenCols={hiddenCols}
          onToggleColumn={mockOnToggleColumn}
        />,
      );
      const endTime = performance.now();

      // Should render in reasonable time (less than 100ms for 50 columns)
      expect(endTime - startTime).toBeLessThan(100);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(50);
    });
  });
});
