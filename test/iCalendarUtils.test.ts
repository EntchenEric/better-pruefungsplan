/*
    This file is AI generated. However tests are checked closely.
*/

import { generateICSFile } from "@/utils/iCalendarUtils";
import { ExamEntry } from "@/types/exam";

// Mock moment to ensure deterministic tests
jest.mock("moment", () => {
  const actualMoment = jest.requireActual("moment");
  return actualMoment;
});

describe("generateICSFile", () => {
  const mockExamEntry: ExamEntry = {
    mid: "12345",
    kuerzel: "CS",
    po: "2016",
    lp: "5",
    datum: "2024-02-15",
    zeit: "10:00",
    pruefungsform: "Klausur",
    pruefungsdauer: "90",
    modul: "Software Engineering",
    pruefer: "AB",
    pruefer_name: "Dr. Alice Bob",
    zweitpruefer: "CD",
    b_m: "B",
    raeume: "A.101",
    beisitzer: "Jane Doe",
    pi_ba: "",
    ti_ba: "",
    mi_ba: "",
    wi_ba: "",
    pi_ba_dual: "",
    ti_ba_dual: "",
    mi_ba_dual: "",
    wi_ba_dual: "",
    pi_ma: "",
    ti_ma: "",
    mi_ma: "",
    wi_ma: "",
    is_ma: "",
  };

  test("generates valid ICS file header with timezone information", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("BEGIN:VCALENDAR");
    expect(result).toContain("VERSION:2.0");
    expect(result).toContain("PRODID:-//pruefungsplan.entcheneric.com");
    expect(result).toContain("CALSCALE:GREGORIAN");
    expect(result).toContain("BEGIN:VTIMEZONE");
    expect(result).toContain("TZID:Europe/Berlin");
    expect(result).toContain("END:VTIMEZONE");
    expect(result).toContain("END:VCALENDAR");
  });

  test("generates VEVENT with correct structure for valid exam entry", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("END:VEVENT");
    expect(result).toContain("UID:");
    expect(result).toContain("DTSTAMP:");
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:");
    expect(result).toContain("SUMMARY:Software Engineering");
    expect(result).toContain("LOCATION:A.101");
    expect(result).toContain("DESCRIPTION:Prüfung Software Engineering");
  });

  test("calculates correct end time based on exam duration", () => {
    const result = generateICSFile([mockExamEntry]);
    
    // Start: 2024-02-15 10:00, Duration: 90 minutes
    // End should be: 2024-02-15 11:30
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:20240215T100000");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:20240215T113000");
  });

  test("includes alarm/reminder 30 minutes before exam", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("BEGIN:VALARM");
    expect(result).toContain("ACTION:DISPLAY");
    expect(result).toContain("DESCRIPTION:Reminder");
    expect(result).toContain("TRIGGER:-PT30M");
    expect(result).toContain("END:VALARM");
  });

  test("generates unique UID for each exam based on datum, zeit, mid, and beisitzer", () => {
    const exam1: ExamEntry = { ...mockExamEntry };
    const exam2: ExamEntry = { 
      ...mockExamEntry, 
      mid: "54321",
      beisitzer: "John Smith" 
    };
    
    const result1 = generateICSFile([exam1]);
    const result2 = generateICSFile([exam2]);
    
    // Extract UIDs from both results
    const uidPattern = /UID:(-?\d+)@yourdomain\.com/g;
    const uids1 = [...result1.matchAll(uidPattern)].map(m => m[1]);
    const uids2 = [...result2.matchAll(uidPattern)].map(m => m[1]);
    
    expect(uids1[0]).not.toBe(uids2[0]);
  });

  test("skips entries without zeit (time) field", () => {
    const examWithoutTime: ExamEntry = { 
      ...mockExamEntry, 
      zeit: undefined 
    };
    const examWithTime: ExamEntry = mockExamEntry;
    
    const result = generateICSFile([examWithoutTime, examWithTime]);
    
    // Should only have one VEVENT (for the exam with time)
    const eventMatches = result.match(/BEGIN:VEVENT/g);
    expect(eventMatches).toHaveLength(1);
  });

  test("skips entries with empty zeit string", () => {
    const examWithEmptyTime: ExamEntry = { 
      ...mockExamEntry, 
      zeit: "" 
    };
    
    const result = generateICSFile([examWithEmptyTime]);
    
    // Should have no VEVENTs
    const eventMatches = result.match(/BEGIN:VEVENT/g);
    expect(eventMatches).toBeNull();
  });

  test("handles multiple exams in single ICS file", () => {
    const exam1: ExamEntry = mockExamEntry;
    const exam2: ExamEntry = { 
      ...mockExamEntry, 
      datum: "2024-02-20",
      zeit: "14:00",
      modul: "Algorithms",
      raeume: "B.202"
    };
    const exam3: ExamEntry = { 
      ...mockExamEntry, 
      datum: "2024-02-25",
      zeit: "09:00",
      modul: "Database Systems",
      raeume: "C.303"
    };
    
    const result = generateICSFile([exam1, exam2, exam3]);
    
    const eventMatches = result.match(/BEGIN:VEVENT/g);
    expect(eventMatches).toHaveLength(3);
    expect(result).toContain("SUMMARY:Software Engineering");
    expect(result).toContain("SUMMARY:Algorithms");
    expect(result).toContain("SUMMARY:Database Systems");
    expect(result).toContain("LOCATION:A.101");
    expect(result).toContain("LOCATION:B.202");
    expect(result).toContain("LOCATION:C.303");
  });

  test("handles empty exam array", () => {
    const result = generateICSFile([]);
    
    expect(result).toContain("BEGIN:VCALENDAR");
    expect(result).toContain("END:VCALENDAR");
    expect(result).not.toContain("BEGIN:VEVENT");
  });

  test("formats datetime correctly for different times", () => {
    const morningExam: ExamEntry = { 
      ...mockExamEntry, 
      datum: "2024-03-10",
      zeit: "08:30",
      pruefungsdauer: "120"
    };
    
    const result = generateICSFile([morningExam]);
    
    // 08:30 + 120 minutes = 10:30
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:20240310T083000");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:20240310T103000");
  });

  test("handles exams spanning midnight correctly", () => {
    const lateExam: ExamEntry = { 
      ...mockExamEntry, 
      datum: "2024-04-01",
      zeit: "23:00",
      pruefungsdauer: "90"
    };
    
    const result = generateICSFile([lateExam]);
    
    // 23:00 + 90 minutes = 00:30 next day
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:20240401T230000");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:20240402T003000");
  });

  test("generates different UIDs for same exam at different times", () => {
    const exam1: ExamEntry = { 
      ...mockExamEntry, 
      zeit: "10:00" 
    };
    const exam2: ExamEntry = { 
      ...mockExamEntry, 
      zeit: "14:00" 
    };
    
    const result1 = generateICSFile([exam1]);
    const result2 = generateICSFile([exam2]);
    
    const uidPattern = /UID:(-?\d+)@yourdomain\.com/g;
    const uids1 = [...result1.matchAll(uidPattern)].map(m => m[1]);
    const uids2 = [...result2.matchAll(uidPattern)].map(m => m[1]);
    
    expect(uids1[0]).not.toBe(uids2[0]);
  });

  test("includes URL field pointing to w-hs.de", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("URL:https://w-hs.de");
  });

  test("sets TRANSP to OPAQUE for exam events", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("TRANSP:OPAQUE");
  });

  test("handles exam with pruefungsdauer as string", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      pruefungsdauer: "60" 
    };
    
    const result = generateICSFile([exam]);
    
    // Should parse string to number and calculate correct end time
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:20240215T100000");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:20240215T110000");
  });

  test("handles exam with zero duration", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      pruefungsdauer: "0" 
    };
    
    const result = generateICSFile([exam]);
    
    // Start and end should be the same
    expect(result).toContain("DTSTART;TZID=Europe/Berlin:20240215T100000");
    expect(result).toContain("DTEND;TZID=Europe/Berlin:20240215T100000");
  });

  test("handles exam with undefined pruefungsdauer", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      pruefungsdauer: undefined 
    };
    
    const result = generateICSFile([exam]);
    
    // Should handle gracefully, likely adding NaN minutes (moment behavior)
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("END:VEVENT");
  });

  test("preserves special characters in module name", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      modul: "Künstliche Intelligenz & Machine Learning" 
    };
    
    const result = generateICSFile([exam]);
    
    expect(result).toContain("SUMMARY:Künstliche Intelligenz & Machine Learning");
    expect(result).toContain("DESCRIPTION:Prüfung Künstliche Intelligenz & Machine Learning");
  });

  test("preserves special characters in room name", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      raeume: "Raum A.1.01 & B.2.03" 
    };
    
    const result = generateICSFile([exam]);
    
    expect(result).toContain("LOCATION:Raum A.1.01 & B.2.03");
  });

  test("handles exam entries with all empty course fields", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry,
      pi_ba: "",
      ti_ba: "",
      mi_ba: "",
      wi_ba: "",
      pi_ba_dual: "",
      ti_ba_dual: "",
      mi_ba_dual: "",
      wi_ba_dual: "",
      pi_ma: "",
      ti_ma: "",
      mi_ma: "",
      wi_ma: "",
      is_ma: ""
    };
    
    const result = generateICSFile([exam]);
    
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("SUMMARY:Software Engineering");
  });

  test("generates consistent UID for same exam data", () => {
    const exam1: ExamEntry = { ...mockExamEntry };
    const exam2: ExamEntry = { ...mockExamEntry };
    
    const result1 = generateICSFile([exam1]);
    const result2 = generateICSFile([exam2]);
    
    const uidPattern = /UID:(-?\d+)@yourdomain\.com/g;
    const uids1 = [...result1.matchAll(uidPattern)].map(m => m[1]);
    const uids2 = [...result2.matchAll(uidPattern)].map(m => m[1]);
    
    expect(uids1[0]).toBe(uids2[0]);
  });

  test("DTSTAMP is always in UTC format with Z suffix", () => {
    const result = generateICSFile([mockExamEntry]);
    
    const dtstampPattern = /DTSTAMP:(\d{8}T\d{6}Z)/;
    const match = result.match(dtstampPattern);
    
    expect(match).not.toBeNull();
    expect(match![1]).toMatch(/^\d{8}T\d{6}Z$/);
  });

  test("handles very long module names", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      modul: "A".repeat(500) 
    };
    
    const result = generateICSFile([exam]);
    
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("SUMMARY:" + "A".repeat(500));
  });

  test("handles very long room names", () => {
    const exam: ExamEntry = { 
      ...mockExamEntry, 
      raeume: "Room " + "X".repeat(200) 
    };
    
    const result = generateICSFile([exam]);
    
    expect(result).toContain("LOCATION:Room " + "X".repeat(200));
  });

  test("timezone configuration includes both DAYLIGHT and STANDARD rules", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("BEGIN:DAYLIGHT");
    expect(result).toContain("TZNAME:CEST");
    expect(result).toContain("END:DAYLIGHT");
    expect(result).toContain("BEGIN:STANDARD");
    expect(result).toContain("TZNAME:CET");
    expect(result).toContain("END:STANDARD");
  });

  test("timezone rules include recurrence rules", () => {
    const result = generateICSFile([mockExamEntry]);
    
    expect(result).toContain("RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU");
    expect(result).toContain("RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU");
  });
});