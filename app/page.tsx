import { Suspense } from "react";
import ExamScheduleViewer from "@/components/ExamScheduleViewer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-theme-alt">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
        <ExamScheduleViewer />
      </Suspense>

      <div className="mt-12 px-6 py-8 text-center max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-lg font-medium text-gray-800 mb-4">
            Nicht der aktuelle Prüfungsplan?
          </p>

          <p className="text-base text-gray-700 mb-6 leading-relaxed">
            Bitte schreibe{" "}
            <span
              className="text-blue-600 hover:text-blue-700 font-semibold 
                        underline underline-offset-2 hover:underline-offset-4
                        transition-all duration-200 cursor-pointer"
            >
              @entcheneric
            </span>
            {" "}auf Discord und ich werde ihn so schnell wie möglich aktualisieren!
          </p>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 leading-relaxed">
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
