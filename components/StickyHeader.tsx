"use client";

import React from "react";
import { ColumnToggle } from "./ColumnToggle";
import { GlobalSearch } from "./GlobalSearch";
import { ShareUrlButton } from "./ShareUrlButton";
import { ColumnVisibility } from "@/types/exam";

interface StickyHeaderProps {
  hiddenCols: ColumnVisibility;
  onToggleColumn: (key: string) => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  hiddenCols,
  onToggleColumn,
  globalSearch,
  onGlobalSearchChange,
}) => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header role="banner" className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary-600 to-primary shadow-lg border-b-2 border-primary-700">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="text-center mb-4">
          <h1 id="app-title" className="text-3xl font-bold text-white mb-2 tracking-wide">
            Better Prüfungsplan
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary-300 to-primary-200 mx-auto rounded-full" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">👁️</span>
              Spalten verwalten
            </h3>
            <ColumnToggle
              hiddenCols={hiddenCols}
              onToggleColumn={onToggleColumn}
            />
          </div>

          <div className="backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">🔍</span>
              Globale Suche
            </h3>
            <div className="flex flex-col gap-3">
              <GlobalSearch
                globalSearch={globalSearch}
                onGlobalSearchChange={onGlobalSearchChange}
              />
              <div className="flex items-center gap-2">
                <ShareUrlButton />
                <button
                  onClick={toggleTheme}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
                >
                  {isDark ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {isDark ? "Hell" : "Dunkel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};