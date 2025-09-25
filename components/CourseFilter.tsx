import { COURSES } from "@/config/tableConfig";

interface CourseFilterProps {
    /**
     * The course that is currently selected.
     */
  selectedCourse: string | undefined
  /**
   * The callback that is called when a new course should be selected.
   * @param value The key of the newly selected course
   * @returns void
   */
  setSelectedCourse: (value: string | undefined) => void
}

/**
 * Represents the filter of the courses.
 * @param params The parameters of the Course Filter.
 * @returns The CourseFilter Component as a React Component.
 */
export const CourseFilter = ({
  selectedCourse,
  setSelectedCourse,
}: CourseFilterProps) => {
  return (
    <div>
      <select
        value={selectedCourse ?? ""}
        onChange={(e) => setSelectedCourse(e.target.value || undefined)}
        className="
          px-4 py-2 rounded-lg border-2 border-primary 
          bg-secondary text-secondary-text 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 
          transition-colors duration-300 ease-in-out cursor-pointer
          "
      >
        <option value="">Alle Studiengänge anzeigen</option>
        {COURSES.map((course) => (
          <option key={course.key} value={course.key}>
            {course.label}
          </option>
        ))}
      </select>
    </div>
  )
}