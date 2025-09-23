import React from "react";

interface GlobalSearchProps {
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  globalSearch,
  onGlobalSearchChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="relative flex-grow min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
          className="w-full pl-9 pr-4 py-2 text-sm border border-theme/30 rounded-lg backdrop-blur-sm text-theme-inverse placeholder-theme-inverse/60 transition-all duration-200 focus:outline-none focus:border-theme/50"
        />
      </div>
      {globalSearch && (
        <button
          onClick={() => onGlobalSearchChange("")}
          aria-label="Clear global search"
          className="hover:bg-error/80 border border-theme/30 hover:border-error text-theme-inverse font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-1 text-sm"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
};
