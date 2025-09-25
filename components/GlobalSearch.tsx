import React from "react";

/**
 * Represents the Props of the Global Search.
 */
interface GlobalSearchProps {
  /**
   * The current Value of the global search.
   */
  globalSearch: string;
  /**
   * The callback that is called when the Global Search is changed.
   * @param value The new value of the global change.
   * @returns void
   */
  onGlobalSearchChange: (value: string) => void;
}

/**
 * The global search component.
 * @param params the Parameters of the Global search component.
 * @returns the GlobalSearch as a React Component.
 */
export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  globalSearch,
  onGlobalSearchChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="relative flex-grow min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-secondary-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => onGlobalSearchChange(e.target.value)}
          placeholder="Durchsuche alle Spalten..."
          aria-label="Globale Suche"
          spellCheck={false}
          autoComplete="off"
          className="w-full pl-9 pr-4 py-2 text-sm border border-secondary-text rounded-lg backdrop-blur-sm text-secondary-text placeholder-secondary-text transition-all duration-200 focus:outline-none focus:border-secondary-text focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        />
      </div>
      {globalSearch && (
        <button
          type="button"
          onClick={() => onGlobalSearchChange("")}
          aria-label="Globale Suche löschen"
          className="hover:bg-red-500/80 border border-white/30 hover:border-red-500 text-white font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-1 text-sm"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
};
