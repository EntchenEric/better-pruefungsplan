import { SEMESTERS } from "@//config/tableConfig";
import { ChangeEvent, useCallback } from "react";

/**
 * Represents the Props of the Semester Select.
 */
interface SemesterSelectProps {
  /**
   * The currently selected semester.
   */
  selectedSemester: string | undefined;
  /**
   * The callback that is called when the Semester is changed.
   * @param value The id of the newly selected semester.
   * @returns void
   */
  setSelectedSemester: (value: string | undefined) => void;
}

/**
 * The component of the Semester Select.
 * @param params the Params of the Seester Select.
 * @returns The SemesterSelect as a React Component.
 */
export const SemesterSelect = ({
  selectedSemester,
  setSelectedSemester,
}: SemesterSelectProps) => {
  /**
   * Handles selecting a semester.
   */
  const handleSelect = useCallback(
    () => (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedSemester(e.target.value || undefined);
    },
    [setSelectedSemester],
  );

  return (
    <div>
      <select
        value={selectedSemester ?? ""}
        onChange={handleSelect}
        className="
          px-4 py-2 rounded-lg border-2 border-primary 
          bg-secondary text-secondary-text 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 
          transition-colors duration-300 ease-in-out cursor-pointer
          "
      >
        <option value="">Alle Semester</option>
        {SEMESTERS.map((semester) => (
          <option key={semester.key} value={semester.key}>
            {semester.label}
          </option>
        ))}
      </select>
    </div>
  );
};
