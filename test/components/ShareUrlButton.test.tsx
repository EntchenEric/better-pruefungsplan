/** @jest-environment jsdom */
/**
 * Tests for ShareUrlButton
 * Framework: Jest (jsdom) + React Testing Library
 */
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { ShareUrlButton } from "@/components/ShareUrlButton";

// Mock react-icons/fa to avoid SVG complexity
jest.mock("react-icons/fa", () => ({
  FaShare: () => <span data-testid="share-icon">Share Icon</span>,
}));

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe("ShareUrlButton", () => {
  const originalLocation = window.location;
  const originalClipboard = Object.getOwnPropertyDescriptor(
    navigator,
    "clipboard",
  );

  const restoreClipboard = () => {
    if (originalClipboard) {
      Object.defineProperty(navigator, "clipboard", originalClipboard);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.defineProperty(navigator as any, "clipboard", {
        value: undefined,
        configurable: true,
      });
    }
  };

  beforeEach(() => {
    // mock location.href for deterministic URL
    Object.defineProperty(window, "location", {
      value: { href: "https://example.com/test-page" },
      writable: true,
      configurable: true,
    });
    jest.clearAllTimers();
    restoreClipboard();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    restoreClipboard();
    jest.runOnlyPendingTimers();
  });

  it("renders button with icon, label and expected classes", () => {
    render(<ShareUrlButton />);

    const button = screen.getByRole("button", {
      name: /share current url with filters/i,
    });
    expect(button).toBeTruthy();
    expect(button.textContent).toContain("URL teilen");

    const icon = screen.getByTestId("share-icon");
    expect(icon).toBeTruthy();

    // spot-check a few critical classes without being too brittle
    const classList = button.getAttribute("class") || "";
    expect(classList.includes("bg-background-alt")).toBe(true);
    expect(classList.includes("hover:bg-background")).toBe(true);
    expect(classList.includes("rounded-lg")).toBe(true);
  });

  describe("Clipboard API - success path", () => {
    beforeEach(() => {
      // Provide a mock clipboard with a resolving writeText
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
      });
    });

    it("copies current URL using navigator.clipboard.writeText", () => {
      render(<ShareUrlButton />);
      const button = screen.getByRole("button", { name: /share current url/i });

      // Click via DOM API to avoid extra deps

      button.click();

      expect(navigator.clipboard!.writeText).toHaveBeenCalledWith(
        "https://example.com/test-page",
      );
    });

    it("shows and auto-hides toast after 2s on success", async () => {
      render(<ShareUrlButton />);
      const button = screen.getByRole("button", { name: /share current url/i });
      button.click();

      // Toast appears
      await waitFor(() => {
        const toast = screen.queryByText("URL in Zwischenablage kopiert!");
        expect(toast).toBeTruthy();
        if (toast) {
          expect(toast.getAttribute("role")).toBe("status");
          expect(toast.getAttribute("aria-live")).toBe("polite");
        }
      });

      // Advance 2 seconds to hide toast
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        const toast = screen.queryByText("URL in Zwischenablage kopiert!");
        expect(toast).toBeFalsy();
      });
    });
  });

  describe("Clipboard API - rejection triggers fallback", () => {
    const setupDomFallbackSpies = () => {
      const textArea: Partial<HTMLTextAreaElement> = {
        value: "",
        style: {} as CSSStyleDeclaration,
        focus: jest.fn(),
        select: jest.fn(),
      };

      // Keep original createElement to avoid recursion
      const origCreateElement = document.createElement.bind(document);
      const createElement = jest
        .spyOn(document, "createElement")
        .mockImplementation((tagName: string): any => {
          if (tagName.toLowerCase() === "textarea")
            return textArea as HTMLTextAreaElement;
          return origCreateElement(tagName as any);
        });

      const appendChild = jest
        .spyOn(document.body, "appendChild")
        // @ts-expect-error simplifying return (DOM not actually used)
        .mockImplementation(() => textArea);
      const removeChild = jest
        .spyOn(document.body, "removeChild")
        // @ts-expect-error simplifying return (DOM not actually used)
        .mockImplementation(() => textArea);

      // Ensure execCommand exists before spying
      if (!(document as any).execCommand) {
        Object.defineProperty(document, "execCommand", {
          value: () => false,
          configurable: true,
          writable: true,
        });
      }
      const execCommand = jest
        .spyOn(document, "execCommand")
        .mockImplementation(() => true);

      return { textArea, createElement, appendChild, removeChild, execCommand };
    };

    beforeEach(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) },
      });
    });

    it('falls back to document.execCommand("copy") on writeText failure', async () => {
      const { textArea, createElement, appendChild, removeChild, execCommand } =
        setupDomFallbackSpies();

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      await waitFor(() => {
        expect(createElement).toHaveBeenCalledWith("textarea");
        expect(textArea!.value).toBe("https://example.com/test-page");
        expect(textArea!.focus).toHaveBeenCalled();
        expect(textArea!.select).toHaveBeenCalled();
        expect(execCommand).toHaveBeenCalledWith("copy");
        expect(appendChild).toHaveBeenCalled();
        expect(removeChild).toHaveBeenCalled();
      });
    });

    it("shows toast when fallback succeeds", async () => {
      setupDomFallbackSpies();
      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      await waitFor(() => {
        expect(
          screen.queryByText("URL in Zwischenablage kopiert!"),
        ).toBeTruthy();
      });
    });

    it("logs error when execCommand throws", async () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const spies = setupDomFallbackSpies();
      spies.execCommand.mockImplementation(() => {
        throw new Error("execCommand failed");
      });

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe("No Clipboard API present (legacy browsers)", () => {
    beforeEach(() => {
      // Remove clipboard API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.defineProperty(navigator as any, "clipboard", {
        value: undefined,
        configurable: true,
      });
    });

    it("uses fallback path when navigator.clipboard is undefined", async () => {
      // Ensure execCommand exists before spy
      if (!(document as any).execCommand) {
        Object.defineProperty(document, "execCommand", {
          value: () => false,
          configurable: true,
          writable: true,
        });
      }
      const execSpy = jest
        .spyOn(document, "execCommand")
        .mockImplementation(() => true);
      const createSpy = jest.spyOn(document, "createElement");

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      await waitFor(() => {
        expect(createSpy).toHaveBeenCalledWith("textarea");
        expect(execSpy).toHaveBeenCalledWith("copy");
      });
    });
  });

  describe("URL variations and edge cases", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
      });
    });

    it("copies URL with query parameters", () => {
      Object.defineProperty(window, "location", {
        value: { href: "https://example.com/page?param1=a&param2=b" },
        writable: true,
        configurable: true,
      });

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      expect(navigator.clipboard!.writeText).toHaveBeenCalledWith(
        "https://example.com/page?param1=a&param2=b",
      );
    });

    it("copies URL with hash fragment", () => {
      Object.defineProperty(window, "location", {
        value: { href: "https://example.com/page#section1" },
        writable: true,
        configurable: true,
      });

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      expect(navigator.clipboard!.writeText).toHaveBeenCalledWith(
        "https://example.com/page#section1",
      );
    });

    it("handles empty URL string gracefully", () => {
      Object.defineProperty(window, "location", {
        value: { href: "" },
        writable: true,
        configurable: true,
      });

      render(<ShareUrlButton />);
      screen.getByRole("button").click();

      expect(navigator.clipboard!.writeText).toHaveBeenCalledWith("");
    });
  });

  describe("Multiple rapid clicks", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
      });
    });

    it("invokes clipboard writeText on each click and resets toast timer", async () => {
      render(<ShareUrlButton />);
      const button = screen.getByRole("button");

      button.click();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      button.click();

      expect(navigator.clipboard!.writeText).toHaveBeenCalledTimes(2);

      // After second click, toast should still be visible after only 1.5s more (total 2.5 from first, 1.5 from second)
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      expect(screen.queryByText("URL in Zwischenablage kopiert!")).toBeTruthy();

      // Complete remaining 0.5s of second timeout
      act(() => {
        jest.advanceTimersByTime(500);
      });
      await waitFor(() => {
        expect(
          screen.queryByText("URL in Zwischenablage kopiert!"),
        ).toBeFalsy();
      });
    });
  });
});
