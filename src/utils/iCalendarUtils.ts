import { ExamEntry } from "@/types/exam";
import moment from "moment";

/**
 * AI-Generated.
 * A simple, non-crypto hashing function to create a consistent ID from a string.
 */
const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Escapes special characters in iCalendar TEXT fields per RFC 5545.
 */
const escapeICSText = (text: string): string => {
  return text
    .replace(/\\/g, "\\\\")     // backslash -> \\
    .replace(/;/g, "\\;")       // semicolon -> \;
    .replace(/,/g, "\\,")       // comma -> \,
    .replace(/\n/g, "\\n")      // newline -> \n
    .replace(/\r/g, "");        // remove carriage return
};



export const generateICSFile = (examEntry: ExamEntry[]) => {
  const fileStart = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//pruefungsplan.entcheneric.com
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Berlin
LAST-MODIFIED:20240422T053451Z
TZURL:https://www.tzurl.org/zoneinfo-outlook/Europe/Berlin
X-LIC-LOCATION:Europe/Berlin
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE`;

  const events: string[] = [];
  const iCalFormat = "YYYYMMDDTHHmmss";

  examEntry.forEach((entry) => {
    if (!entry["zeit"]) return;

    const examStartDate = moment(
      `${entry["datum"]} ${entry["zeit"]}`,
      "YYYY-MM-DD HH:mm",
    );

    const examEndDate = examStartDate
      .clone()
      .add(entry["pruefungsdauer"], "minutes");

    const dtStamp = moment.utc().format("YYYYMMDDTHHmmss") + "Z";
    const uniqueString =
      entry["datum"] + entry["zeit"] + entry["mid"] + entry["beisitzer"];
    const uid = `${stringToHash(uniqueString)}@pruefungsplan.entcheneric.com`;

    events.push(`
BEGIN:VEVENT
DTSTAMP:${dtStamp}
UID:${uid}
DTSTART;TZID=Europe/Berlin:${examStartDate.format(iCalFormat)}
DTEND;TZID=Europe/Berlin:${examEndDate.format(iCalFormat)}
SUMMARY:${escapeICSText(entry["modul"])}
URL:https://w-hs.de
DESCRIPTION:Prüfung ${escapeICSText(entry["modul"])}
LOCATION:${escapeICSText(entry["raeume"])}
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder
TRIGGER:-PT30M
END:VALARM
END:VEVENT`);
  });

  return fileStart + events.join("") + "\nEND:VCALENDAR";
};
