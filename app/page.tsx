import { Suspense } from "react";
import ExamScheduleViewer from "@/components/ExamScheduleViewer";

export default function Home() {
  return (

    <div className="font-sans min-h-screen bg-theme text-theme-primary">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-lg text-theme-primary">Loading...</div></div>}>
        <ExamScheduleViewer />
      </Suspense>

      <div className="mt-12 px-6 py-8 text-center max-w-2xl mx-auto">
        <div className="bg-theme-alt backdrop-blur-sm rounded-lg shadow-sm border border-theme p-6">
          <p className="text-lg font-medium text-theme-primary mb-4">
            Nicht der aktuelle Prüfungsplan?
          </p>

          <p className="text-base text-theme-secondary mb-6 leading-relaxed">
            Bitte schreibe{" "}
            <span
              className="text-primary-500 hover:text-primary-600 font-semibold 
                        underline underline-offset-2 hover:underline-offset-4
                        transition-all duration-200 cursor-pointer"
            >
              @entcheneric
            </span>
            {" "}auf Discord und ich werde ihn so schnell wie möglich aktualisieren!
          </p>

          <div className="border-t border-theme-light pt-4">
            <p className="text-sm text-theme-muted leading-relaxed">
              Diese Website ist
              <strong> nicht </strong>in Zusammenarbeit mit der Westfälischen Hochschule entstanden
              und steht in <strong>keinem</strong> offiziellen Zusammenhang mit der Hochschule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
