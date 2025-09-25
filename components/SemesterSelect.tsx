import { COURSES, SEMESTERS } from "@/config/tableConfig"

export const SemesterSelect = ({
    selectedSemester,
    setSelectedSemester
}: {
  selectedSemester: string | undefined
  setSelectedSemester: (value: string | undefined) => void
}) => {
  return (
    <div>
      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="
          px-4 py-2 rounded-lg border-2 border-primary 
          bg-secondary text-secondary-text 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 
          transition-colors duration-300 ease-in-out cursor-pointer
          "
      >
        <option>Alle Semester</option>
        {SEMESTERS.map((semester) => (
          <option key={semester.key} value={semester.key}>
            {semester.label}
          </option>
        ))}
      </select>
    </div>
  )
}