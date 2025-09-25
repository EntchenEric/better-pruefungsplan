"use client";

import { useEffect } from "react";

/**
 * Represents the Props of the Theme Provider.
 */
interface ThemeProviderProps {
  /**
   * The children of the Theme Provoder. In most cases, the main content of the Page.
   */
  children: React.ReactNode;
}

/**
 * The component of the Theme Provider.
 * @param params The Params of the Theme Provider.
 * @returns The Theme Provider as a React Component.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (savedTheme === "light" || savedTheme === "dark") {
      root.setAttribute("data-theme", savedTheme);
    } else {
      root.removeAttribute("data-theme");
    }
  }, []);

  return children;
}
