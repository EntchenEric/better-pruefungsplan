import React from "react";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";

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
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onGlobalSearchChange(e.target.value);
  }

  function handleSearchClear() {
    onGlobalSearchChange("");
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <div className="relative flex-grow min-w-[200px]">
        <input
          type="text"
          value={globalSearch}
          onChange={handleInputChange}
          placeholder="Durchsuche alle Spalten..."
          aria-label="Globale Suche"
          spellCheck={false}
          autoComplete="off"
          className="w-full pl-2 pr-4 py-2 text-sm border border-secondary-text rounded-lg backdrop-blur-sm text-secondary-text placeholder-secondary-text transition-all duration-200 focus:outline-none focus:border-secondary-text focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        />
      </div>
      {globalSearch && (
        <button
          type="button"
          onClick={handleSearchClear}
          aria-label="Globale Suche löschen"
          className="hover:bg-red-500/80 border border-white/30 hover:border-red-500 text-white font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-1 text-sm"
        >
          <FaX />
          Clear
        </button>
      )}
    </div>
  );
};
