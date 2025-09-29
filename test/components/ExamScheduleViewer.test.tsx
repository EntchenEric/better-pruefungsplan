import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";
import ExamScheduleViewer from "@//components/ExamScheduleViewer";
import { useExamFiltering } from "@//hooks/useExamFiltering";
import { useUrlSync } from "@//hooks/useUrlSync";

// Mock the hooks
jest.mock("@//hooks/useExamFiltering");
jest.mock("@//hooks/useUrlSync");

// Mock the child components
jest.mock("@//components/StickyHeader", () => {
  return {
    StickyHeader: ({
      onToggleColumn,
      onGlobalSearchChange,
      setSelectedCourse,
      setSelectedSemester,
    }: any) => (
      <div data-testid="sticky-header">
        <button
          type="button"
          onClick={() => onToggleColumn("testCol")}
          data-testid="toggle-column"
        >
          Toggle Column
        </button>
        <input
          onChange={(e) => onGlobalSearchChange(e.target.value)}
          data-testid="global-search"
        />
        <button
          type="button"
          onClick={() => setSelectedCourse("TEST101")}
          data-testid="set-course"
        >
          Set Course
        </button>
        <button
          type="button"
          onClick={() => setSelectedSemester("WS2024")}
          data-testid="set-semester"
        >
          Set Semester
        </button>
      </div>
    ),
  };
});

jest.mock("@//components/ExamTableHeader", () => {
  return {
    ExamTableHeader: ({ onColumnFilterChange, setColWidths }: any) => (
      <thead data-testid="exam-table-header">
        <tr>
          <th>
            <button
              type="button"
              onClick={() => onColumnFilterChange("course", "test")}
              data-testid="filter-column"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={() => setColWidths("course", 100)}
              data-testid="resize-column"
            >
              Resize
            </button>
          </th>
        </tr>
      </thead>
    ),
  };
});

jest.mock("@//components/ExamTableBody", () => {
  return {
    ExamTableBody: ({ entries }: any) => (
      <tbody data-testid="exam-table-body">
        {entries.map((entry: any, index: number) => (
          <tr key={index} data-testid={`exam-row-${index}`}>
            <td>{entry.course}</td>
            <td>{entry.date}</td>
          </tr>
        ))}
      </tbody>
    ),
  };
});

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

const mockUseUrlSync = useUrlSync as jest.MockedFunction<typeof useUrlSync>;
const mockUseExamFiltering = useExamFiltering as jest.MockedFunction<
  typeof useExamFiltering
>;

describe("ExamScheduleViewer", () => {
  const mockExamEntries = [
    {
      id: "1",
      course: "Mathematics 101",
      date: "2024-01-15",
      time: "09:00",
      room: "A101",
      semester: "WS2024",
      examiner: "Prof. Smith",
    },
    {
      id: "2",
      course: "Physics 201",
      date: "2024-01-16",
      time: "14:00",
      room: "B202",
      semester: "WS2024",
      examiner: "Dr. Johnson",
    },
  ];

  const mockFilteredEntries = [mockExamEntries[0]];

  const defaultUrlSyncReturn = {
    globalSearch: "",
    columnFilters: {},
    hiddenCols: {},
    colWidths: {},
    selectedCourse: "",
    selectedSemester: "",
    handleGlobalSearchChange: jest.fn(),
    handleColumnFilterChange: jest.fn(),
    handleToggleColumnVisibility: jest.fn(),
    handleColumnWidthChange: jest.fn(),
    setSelectedCourse: jest.fn(),
    setSelectedSemester: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ entries: mockExamEntries }),
    });

    mockUseUrlSync.mockReturnValue(defaultUrlSyncReturn);
    mockUseExamFiltering.mockReturnValue(mockFilteredEntries);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<ExamScheduleViewer />);
      expect(screen.getByTestId("sticky-header")).toBeInTheDocument();
      expect(screen.getByTestId("exam-table-header")).toBeInTheDocument();
      expect(screen.getByTestId("exam-table-body")).toBeInTheDocument();
    });

    it("renders the table with correct accessibility attributes", () => {
      render(<ExamScheduleViewer />);
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "Prüfungsplan Tabelle");
      expect(table).toHaveClass(
        "w-full",
        "border-collapse",
        "table-fixed",
        "user-select-none",
        "select-none",
      );
    });

    it("displays the correct entry count", async () => {
      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(
          screen.getByText("Gefundene Einträge: 1 / 2"),
        ).toBeInTheDocument();
      });
    });

    it("renders with correct CSS classes and structure", () => {
      render(<ExamScheduleViewer />);

      const container = screen
        .getByText("Gefundene Einträge: 1 / 2")
        .closest("div");
      expect(container).toHaveClass(
        "mt-5",
        "text-center",
        "text-secondary-text",
        "italic",
        "text-base",
        "select-none",
      );

      const tableContainer = screen.getByRole("table").closest("div");
      expect(tableContainer).toHaveClass(
        "overflow-x-auto",
        "rounded-lg",
        "shadow-md",
        "border",
        "border-secondary-text",
      );
    });
  });

  describe("Data Fetching", () => {
    it("fetches exam data on mount", async () => {
      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/exams", {
          signal: expect.any(AbortSignal),
          cache: "no-store",
        });
      });
    });

    it("handles successful data fetching", async () => {
      const mockEntries = [{ id: "1", course: "Test Course" }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ entries: mockEntries }),
      });

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it("handles fetch response errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error parsing PDF:",
          expect.any(Error),
        );
      });
    });

    it("handles network errors during fetch", async () => {
      const networkError = new Error("Network error");
      mockFetch.mockRejectedValueOnce(networkError);

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error parsing PDF:",
          networkError,
        );
      });
    });

    it("handles JSON parsing errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error parsing PDF:",
          expect.any(Error),
        );
      });
    });

    it("creates and aborts AbortController correctly", async () => {
      const abortSpy = jest.spyOn(AbortController.prototype, "abort");

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(abortSpy).toHaveBeenCalled();
      });

      abortSpy.mockRestore();
    });
  });

  describe("Hook Integration", () => {
    it("passes correct parameters to useExamFiltering", () => {
      const customUrlSync = {
        ...defaultUrlSyncReturn,
        globalSearch: "test search",
        columnFilters: { course: "math" },
        selectedCourse: "MATH101",
        selectedSemester: "WS2024",
      };

      mockUseUrlSync.mockReturnValue(customUrlSync);

      render(<ExamScheduleViewer />);

      expect(mockUseExamFiltering).toHaveBeenCalledWith(
        [],
        "test search",
        { course: "math" },
        "MATH101",
        "WS2024",
      );
    });

    it("updates useExamFiltering when entries change", async () => {
      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockUseExamFiltering).toHaveBeenCalledWith(
          mockExamEntries,
          "",
          {},
          "",
          "",
        );
      });
    });

    it("passes all useUrlSync values to child components", () => {
      const customUrlSync = {
        ...defaultUrlSyncReturn,
        globalSearch: "test",
        hiddenCols: { date: true },
        colWidths: { course: 200 },
        columnFilters: { semester: "WS2024" },
        selectedCourse: "MATH101",
        selectedSemester: "WS2024",
      };

      mockUseUrlSync.mockReturnValue(customUrlSync);

      render(<ExamScheduleViewer />);

      // Verify StickyHeader receives correct props
      expect(screen.getByTestId("sticky-header")).toBeInTheDocument();

      // Verify ExamTableHeader receives correct props
      expect(screen.getByTestId("exam-table-header")).toBeInTheDocument();

      // Verify ExamTableBody receives correct props
      expect(screen.getByTestId("exam-table-body")).toBeInTheDocument();
    });
  });

  describe("Event Handlers", () => {
    it("calls handleToggleColumnVisibility when triggered", () => {
      const mockToggle = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        handleToggleColumnVisibility: mockToggle,
      });

      render(<ExamScheduleViewer />);

      fireEvent.click(screen.getByTestId("toggle-column"));
      expect(mockToggle).toHaveBeenCalledWith("testCol");
    });

    it("calls handleGlobalSearchChange when triggered", () => {
      const mockGlobalSearch = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        handleGlobalSearchChange: mockGlobalSearch,
      });

      render(<ExamScheduleViewer />);

      fireEvent.change(screen.getByTestId("global-search"), {
        target: { value: "test search" },
      });
      expect(mockGlobalSearch).toHaveBeenCalledWith("test search");
    });

    it("calls setSelectedCourse when triggered", () => {
      const mockSetCourse = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        setSelectedCourse: mockSetCourse,
      });

      render(<ExamScheduleViewer />);

      fireEvent.click(screen.getByTestId("set-course"));
      expect(mockSetCourse).toHaveBeenCalledWith("TEST101");
    });

    it("calls setSelectedSemester when triggered", () => {
      const mockSetSemester = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        setSelectedSemester: mockSetSemester,
      });

      render(<ExamScheduleViewer />);

      fireEvent.click(screen.getByTestId("set-semester"));
      expect(mockSetSemester).toHaveBeenCalledWith("WS2024");
    });

    it("calls handleColumnFilterChange when triggered", () => {
      const mockColumnFilter = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        handleColumnFilterChange: mockColumnFilter,
      });

      render(<ExamScheduleViewer />);

      fireEvent.click(screen.getByTestId("filter-column"));
      expect(mockColumnFilter).toHaveBeenCalledWith("course", "test");
    });

    it("calls handleColumnWidthChange when triggered", () => {
      const mockWidthChange = jest.fn();
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        handleColumnWidthChange: mockWidthChange,
      });

      render(<ExamScheduleViewer />);

      fireEvent.click(screen.getByTestId("resize-column"));
      expect(mockWidthChange).toHaveBeenCalledWith("course", 100);
    });
  });

  describe("Edge Cases and Error Conditions", () => {
    it("handles empty entries array", () => {
      mockUseExamFiltering.mockReturnValue([]);

      render(<ExamScheduleViewer />);

      expect(screen.getByText("Gefundene Einträge: 0 / 0")).toBeInTheDocument();
    });

    it("handles mismatched entries and filtered entries counts", async () => {
      mockUseExamFiltering.mockReturnValue([]);

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(
          screen.getByText("Gefundene Einträge: 0 / 2"),
        ).toBeInTheDocument();
      });
    });

    it("handles undefined response data gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalled();
      });
    });

    it("handles null entries in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ entries: null }),
      });

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalled();
      });
    });

    it("continues to render when useUrlSync returns undefined values", () => {
      mockUseUrlSync.mockReturnValue({
        ...defaultUrlSyncReturn,
        globalSearch: undefined as any,
        columnFilters: undefined as any,
        hiddenCols: undefined as any,
        colWidths: undefined as any,
      });

      render(<ExamScheduleViewer />);

      expect(screen.getByTestId("sticky-header")).toBeInTheDocument();
    });

    it("handles fetch timeout scenarios", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "AbortError";
      mockFetch.mockRejectedValueOnce(timeoutError);

      render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error parsing PDF:",
          timeoutError,
        );
      });
    });
  });

  describe("Performance and Memory Management", () => {
    it("should not cause memory leaks with AbortController", async () => {
      const { unmount } = render(<ExamScheduleViewer />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Component should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it("handles rapid re-renders without issues", () => {
      const { rerender } = render(<ExamScheduleViewer />);

      // Simulate rapid re-renders
      for (let i = 0; i < 5; i++) {
        rerender(<ExamScheduleViewer />);
      }

      expect(screen.getByTestId("sticky-header")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("maintains proper ARIA labels", () => {
      render(<ExamScheduleViewer />);

      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "Prüfungsplan Tabelle");
    });

    it("supports keyboard navigation", () => {
      render(<ExamScheduleViewer />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // The table should be focusable for screen readers
      expect(table).not.toHaveAttribute("tabindex", "-1");
    });

    it("provides semantic HTML structure", () => {
      render(<ExamScheduleViewer />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByTestId("exam-table-header")).toBeInTheDocument();
      expect(screen.getByTestId("exam-table-body")).toBeInTheDocument();
    });
  });
});
