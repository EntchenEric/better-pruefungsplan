import { Suspense } from "react";
import ExamScheduleViewer from "@//components/ExamScheduleViewer";
import { BsBug, BsGithub, BsLightbulb } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";

async function InfoCards() {
  return (
    <>
      <div className="px-6 py-8 text-center max-w-xl mx-auto w-full">
        <div
          className="
            bg-primary/80
            backdrop-blur-lg rounded-xl shadow-xl border border-theme p-8 "
        >
          <div className="flex justify-center items-center mb-3 text-4xl">
            <BsGithub color="black" />
          </div>
          <h3 className="text-xl font-bold text-theme-primary mb-[10px] tracking-wide drop-shadow-sm">
            Quellcode
          </h3>
          <a
            href="https://github.com/EntchenEric/better-pruefungsplan"
            target="_blank"
            rel="noopener noreferrer"
            title="Zum Repository"
            className="
              inline-block bg-black/70 px-[14px] py-[7px] rounded-md font-mono text-base shadow-inner ring-inset ring-white/10 my-[6px]
              text-primary-text hover:bg-black/90 focus:bg-black/80 transition-all duration-200 select-all
              border border-gray-700 hover:border-primary"
          >
            https://github.com/EntchenEric/better-pruefungsplan
          </a>

          <p className="mt-[18px] text-base text-secondary-text leading-relaxed mb-[22px] px-[2vw] md:px-[16%] opacity-[92%]">
            Der Quellcode dieser Webseite ist öffentlich zugänglich! Wenn du ihn
            erkunden oder sogar mithelfen möchtest, findest du alles im
            Repository.
          </p>

          <div className="flex flex-col gap-y-px items-center justify-center mt-auto pt-4 border-t border-theme-light">
            <a
              href="https://github.com/EntchenEric/better-pruefungsplan/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              title="Bug melden"
              className="
                mt-[2px]
                inline-flex items-center gap-x-[7px]
                px-[13px] py-px rounded-md bg-red-900/30 hover:bg-red-900/50 active:bg-red-950
                font-medium text-sm text-red-200 shadow-sm transition-all duration-150 cursor-pointer my-px"
            >
              <BsBug /> Bug melden
            </a>

            <a
              href="https://github.com/EntchenEric/better-pruefungsplan/discussions"
              target="_blank"
              rel="noopener noreferrer"
              title="Feedback oder Ideen einreichen"
              className="
             mt-[7px]
             inline-flex items-center gap-x-[7px]
             px-[13px] py-px rounded-md bg-blue-900/30 hover:bg-blue-900/50 active:bg-blue-gray
             font-medium text-sm text-blue-100 shadow-sm transition-all duration-150 cursor-pointer my-px "
            >
              <BsLightbulb /> Feedback & Ideen teilen
            </a>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 text-center max-w-xl mx-auto w-full">
        <div
          className="
            bg-primary/80
            backdrop-blur-lg rounded-xl shadow-xl border border-theme p-8 "
        >
          <div className="flex justify-center items-center mb-3 text-red-700  text-4xl">
            <IoWarning />
            {/*Hier kommt später So Warnungs Icon wenn IconLibary installiert ist */}
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-[10px] tracking-wide drop-shadow-sm">
            Achtung
          </h3>

          <p className="mt-[18px] text-base text-secondary-text leading-relaxed mb-[22px] opacity-[92%]">
            Die Informationen auf dieser Seite können falsch sein. Es gibt
            leider keine API für den Prüfungsplan (Wann W-HS API?). Aus diesem
            Grund muss die Prüfungsplan PDF von dieser Webseite gelesen und
            geparsed werden. Da PDFs schmutz sind ist das leichter gesagt als
            getan. Aufgrund eines ziemlich komplexen Parsing vorgangs (welcher
            nicht wirklich eleganter möglich ist) können sich Fehler
            einschleichen. Es ist zwar bis jetzt nicht vorgekommen dass
            Informationen falsch sind, aber better safe than sorry. Falls du
            einen Fehler bemerkst melde diesen bitte umgehend.
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * The Homepage of the Page.
 * @returns The main Contents of the Page.
 */
export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-secondary text-primary">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-primary-text">Loading...</div>
          </div>
        }
      >
        <ExamScheduleViewer />
      </Suspense>

      <div className="flex flex-col md:flex-row justify-center items-start">
        <div className="px-6 py-8 text-center max-w-xl mx-auto w-full">
          <div className="bg-primary/80 backdrop-blur-md rounded-xl shadow-lg border border-theme p-8">
            <p className="text-xl font-semibold text-theme-primary mb-4 tracking-wide">
              Nicht der aktuelle Prüfungsplan?
            </p>
            <p className="text-base text-secondary-text mb-6 leading-relaxed">
              Bitte schreibe{" "}
              <span className="text-primary-text hover:text-primary-text font-semibold underline underline-offset-2 hover:underline-offset-[6px] transition-all duration-200 cursor-pointer">
                @entcheneric
              </span>{" "}
              auf Discord und ich werde ihn so schnell wie möglich
              aktualisieren!
            </p>
            <div className="border-t border-theme-light pt-4 mt-4">
              <p className="text-xs text-secondary-text leading-relaxed italic opacity-80">
                Diese Website ist <strong>nicht</strong> in Zusammenarbeit mit
                der Westfälischen Hochschule entstanden und steht in{" "}
                <strong>keinem</strong> offiziellen Zusammenhang mit der
                Hochschule.
              </p>
            </div>
          </div>
        </div>
        <InfoCards />
      </div>
    </div>
  );
}
