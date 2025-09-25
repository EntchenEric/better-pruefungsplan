import { COURSES } from "@/config/tableConfig";

export const CourseFilter = ({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: string | undefined;
  setSelectedCourse: (value: string | undefined) => void;
}) => {
  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCourse(e.target.value || undefined);
  }

  return (
    <div>
      <select
        value={selectedCourse ?? ""}
        onChange={handleSelectChange}
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
  );
};
