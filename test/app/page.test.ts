/** @jest-environment jsdom */
/**
 * Framework: Jest (ts-jest) + @testing-library/react
 * Notes:
 * - Default jest env is "node"; we override to "jsdom" at file-level (matches existing tests).
 * - No dependency on @testing-library/jest-dom; use standard assertions and attribute checks.
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// SUT import (project structure is src/*)
import Home from "../../src/app/page";

// Mock ExamScheduleViewer using both alias and direct path to handle "@//" import in SUT
jest.mock(
  "@//components/ExamScheduleViewer",
  () => () =>
    React.createElement(
      "div",
      { "data-testid": "exam-schedule-viewer" },
      "Mocked ExamScheduleViewer",
    ),
);
jest.mock(
  "../../src/components/ExamScheduleViewer",
  () => () =>
    React.createElement(
      "div",
      { "data-testid": "exam-schedule-viewer" },
      "Mocked ExamScheduleViewer",
    ),
);

// Stabilize react-icons rendering
jest.mock("react-icons/bs", () => ({
  BsBug: () => React.createElement("svg", { "data-testid": "bug-icon" }),
  BsGithub: () => React.createElement("svg", { "data-testid": "github-icon" }),
  BsLightbulb: () =>
    React.createElement("svg", { "data-testid": "lightbulb-icon" }),
}));
jest.mock("react-icons/io5", () => ({
  IoWarning: () =>
    React.createElement("svg", { "data-testid": "warning-icon" }),
}));

describe("Home page", () => {
  it("renders page wrapper with expected base classes", () => {
    const { container } = render(React.createElement(Home));
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    const cls = (root as HTMLElement).className;
    expect(cls).toContain("font-sans");
    expect(cls).toContain("min-h-screen");
    expect(cls).toContain("bg-secondary");
    expect(cls).toContain("text-primary");
  });

  it("renders ExamScheduleViewer within Suspense (fallback not shown)", () => {
    render(React.createElement(Home));
    expect(screen.getByTestId("exam-schedule-viewer")).toBeTruthy();
    // Fallback text should not be present when child renders immediately
    expect(screen.queryByText("Loading...")).toBeNull();
  });

  it("renders the three info cards (headings present)", () => {
    const { container } = render(React.createElement(Home));
    expect(screen.getByText("Nicht der aktuelle Prüfungsplan?")).toBeTruthy();
    expect(screen.getByText("Quellcode")).toBeTruthy();
    expect(screen.getByText("Achtung")).toBeTruthy();

    const cardContainers = container.querySelectorAll(
      "div.px-6.py-8.text-center.max-w-xl.mx-auto.w-full",
    );
    expect(cardContainers.length).toBe(3);
  });

  it("renders GitHub repository link with correct attributes and icon", () => {
    render(React.createElement(Home));
    const repoLink = screen.getByText(
      "https://github.com/EntchenEric/better-pruefungsplan",
    ) as HTMLAnchorElement;
    expect(repoLink).toBeTruthy();
    expect(repoLink.tagName.toLowerCase()).toBe("a");
    expect(repoLink.getAttribute("href")).toBe(
      "https://github.com/EntchenEric/better-pruefungsplan",
    );
    expect(repoLink.getAttribute("target")).toBe("_blank");
    expect(repoLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(repoLink.getAttribute("title")).toBe("Zum Repository");
    expect(screen.getByTestId("github-icon")).toBeTruthy();
  });

  it("renders issue and feedback links with attributes and icons", () => {
    render(React.createElement(Home));
    const bugLink = screen.getByRole("link", {
      name: /bug melden/i,
    }) as HTMLAnchorElement;
    expect(bugLink.getAttribute("href")).toBe(
      "https://github.com/EntchenEric/better-pruefungsplan/issues/new",
    );
    expect(bugLink.getAttribute("target")).toBe("_blank");
    expect(bugLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(bugLink.getAttribute("title")).toBe("Bug melden");
    expect(screen.getByTestId("bug-icon")).toBeTruthy();

    const feedbackLink = screen.getByRole("link", {
      name: /feedback & ideen teilen/i,
    }) as HTMLAnchorElement;
    expect(feedbackLink.getAttribute("href")).toBe(
      "https://github.com/EntchenEric/better-pruefungsplan/discussions",
    );
    expect(feedbackLink.getAttribute("target")).toBe("_blank");
    expect(feedbackLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(feedbackLink.getAttribute("title")).toBe(
      "Feedback oder Ideen einreichen",
    );
    expect(screen.getByTestId("lightbulb-icon")).toBeTruthy();
  });

  it("renders the warning block and explanatory text", () => {
    render(React.createElement(Home));
    expect(screen.getByText("Achtung")).toBeTruthy();
    expect(screen.getByTestId("warning-icon")).toBeTruthy();
    expect(
      screen.getByText(/Die Informationen auf dieser Seite können falsch sein/),
    ).toBeTruthy();
    expect(screen.getByText(/keine API für den Prüfungsplan/)).toBeTruthy();
    expect(screen.getByText(/PDFs schmutz sind/)).toBeTruthy();
  });

  it("applies consistent card wrapper styling", () => {
    const { container } = render(React.createElement(Home));
    const wrappers = container.querySelectorAll('div[class*="bg-primary/80"]');
    expect(wrappers.length).toBeGreaterThanOrEqual(3);
    wrappers.forEach((w) => {
      const cls = (w as HTMLElement).className;
      expect(cls).toContain("border");
      expect(cls).toContain("border-theme");
      expect(cls).toContain("p-8");
    });
  });

  it("has the responsive flex container with alignment classes", () => {
    const { container } = render(React.createElement(Home));
    const flex = container.querySelector(
      'div.flex.flex-col[class*="md:flex-row"]',
    ) as HTMLElement | null;
    expect(flex).not.toBeNull();
    const cls = (flex as HTMLElement).className;
    expect(cls).toContain("justify-center");
    expect(cls).toContain("items-start");
  });

  it("includes disclaimer and contact text", () => {
    render(React.createElement(Home));
    expect(screen.getByText(/Bitte schreibe/)).toBeTruthy();
    expect(screen.getByText("@entcheneric")).toBeTruthy();
    expect(screen.getByText(/Westfälischen Hochschule/)).toBeTruthy();
  });
});
