/*
    This file is AI generated. However tests are checked closely.
*/

import {
  TABLE_HEADERS,
  COURSES,
  SEMESTERS,
  MIN_COLUMN_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_COLUMN_WIDTHS,
  DEFAULT_HIDDEN_COLUMNS,
} from "@/config/tableConfig";
import { ExamEntry, TableHeader } from "@/types/exam";

describe("TABLE_HEADERS", () => {
  test("contains all expected column keys", () => {
    const expectedKeys: (keyof ExamEntry)[] = [
      "mid",
      "kuerzel",
      "po",
      "lp",
      "datum",
      "zeit",
      "pruefungsform",
      "pruefungsdauer",
      "modul",
      "pruefer",
      "pruefer_name",
      "zweitpruefer",
      "b_m",
      "raeume",
      "beisitzer",
    ];

    const actualKeys = TABLE_HEADERS.map(h => h.key);
    expect(actualKeys).toEqual(expectedKeys);
  });

  test("each header has both key and label properties", () => {
    TABLE_HEADERS.forEach(header => {
      expect(header).toHaveProperty("key");
      expect(header).toHaveProperty("label");
      expect(typeof header.key).toBe("string");
      expect(typeof header.label).toBe("string");
      expect(header.label.length).toBeGreaterThan(0);
    });
  });

  test("all keys are unique", () => {
    const keys = TABLE_HEADERS.map(h => h.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  test("contains expected number of headers", () => {
    expect(TABLE_HEADERS).toHaveLength(15);
  });

  test("labels are in German as expected", () => {
    const germanLabels = [
      "Kürzel",
      "Datum",
      "Zeit",
      "Dauer",
      "Modul",
      "Prüfer",
      "Prüfer Name",
      "Zweitprüfer",
      "Bachelor/Master",
      "Räume",
      "Beisitzer",
    ];

    germanLabels.forEach(label => {
      expect(TABLE_HEADERS.some(h => h.label === label)).toBe(true);
    });
  });

  test("satisfies TableHeader type", () => {
    TABLE_HEADERS.forEach(header => {
      // TypeScript compile-time check, runtime verification
      const typed: TableHeader = header;
      expect(typed).toBeDefined();
    });
  });
});

describe("COURSES", () => {
  test("contains all expected course types", () => {
    const expectedCourseKeys = [
      "pi_ba",
      "ti_ba",
      "mi_ba",
      "wi_ba",
      "pi_ba_dual",
      "ti_ba_dual",
      "mi_ba_dual",
      "wi_ba_dual",
      "pi_ma",
      "ti_ma",
      "mi_ma",
      "wi_ma",
      "is_ma",
    ];

    const actualKeys = COURSES.map(c => c.key);
    expect(actualKeys).toEqual(expectedCourseKeys);
  });

  test("has correct number of courses", () => {
    expect(COURSES).toHaveLength(13);
  });

  test("each course has key and label", () => {
    COURSES.forEach(course => {
      expect(course).toHaveProperty("key");
      expect(course).toHaveProperty("label");
      expect(typeof course.key).toBe("string");
      expect(typeof course.label).toBe("string");
      expect(course.label.length).toBeGreaterThan(0);
    });
  });

  test("all course keys are unique", () => {
    const keys = COURSES.map(c => c.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  test("bachelor and master courses are separated", () => {
    const bachelorCourses = COURSES.filter(c => c.key.includes("_ba"));
    const masterCourses = COURSES.filter(c => c.key.includes("_ma"));
    
    expect(bachelorCourses.length).toBeGreaterThan(0);
    expect(masterCourses.length).toBeGreaterThan(0);
  });

  test("includes dual study programs", () => {
    const dualCourses = COURSES.filter(c => c.key.includes("_dual"));
    expect(dualCourses.length).toBeGreaterThan(0);
  });

  test("course labels indicate Bachelor or Master correctly", () => {
    COURSES.forEach(course => {
      if (course.key.includes("_ba")) {
        expect(course.label).toContain("Bachelor");
      } else if (course.key.includes("_ma")) {
        expect(course.label).toContain("Master");
      }
    });
  });
});

describe("SEMESTERS", () => {
  test("contains numeric semesters 1-7", () => {
    const numericSemesters = ["1", "2", "3", "4", "5", "6", "7"];
    numericSemesters.forEach(sem => {
      expect(SEMESTERS.some(s => s.key === sem)).toBe(true);
    });
  });

  test("contains Wahlpflicht options", () => {
    const wahlpflichtOptions = ["WP", "WP-I", "WP-IN", "WP-L", "WP-LE"];
    wahlpflichtOptions.forEach(wp => {
      expect(SEMESTERS.some(s => s.key === wp)).toBe(true);
    });
  });

  test("each semester has key and label", () => {
    SEMESTERS.forEach(semester => {
      expect(semester).toHaveProperty("key");
      expect(semester).toHaveProperty("label");
      expect(typeof semester.key).toBe("string");
      expect(typeof semester.label).toBe("string");
    });
  });

  test("all semester keys are unique", () => {
    const keys = SEMESTERS.map(s => s.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  test("numeric semester labels match their keys", () => {
    for (let i = 1; i <= 7; i++) {
      const semester = SEMESTERS.find(s => s.key === i.toString());
      expect(semester).toBeDefined();
      expect(semester!.label).toBe(i.toString());
    }
  });

  test("Wahlpflicht labels are descriptive", () => {
    const wpSemesters = SEMESTERS.filter(s => s.key.startsWith("WP"));
    wpSemesters.forEach(wp => {
      expect(wp.label).toContain("Wahlpflicht");
    });
  });

  test("does not contain semester 8 (as per comment)", () => {
    expect(SEMESTERS.some(s => s.key === "8")).toBe(false);
  });
});

describe("Column Width Constants", () => {
  test("MIN_COLUMN_WIDTH is set to reasonable minimum", () => {
    expect(MIN_COLUMN_WIDTH).toBe(20);
    expect(typeof MIN_COLUMN_WIDTH).toBe("number");
    expect(MIN_COLUMN_WIDTH).toBeGreaterThan(0);
  });

  test("DEFAULT_COLUMN_WIDTH is larger than minimum", () => {
    expect(DEFAULT_COLUMN_WIDTH).toBe(140);
    expect(DEFAULT_COLUMN_WIDTH).toBeGreaterThan(MIN_COLUMN_WIDTH);
  });
});

describe("DEFAULT_COLUMN_WIDTHS", () => {
  test("defines width for all table header keys", () => {
    TABLE_HEADERS.forEach(header => {
      expect(DEFAULT_COLUMN_WIDTHS).toHaveProperty(header.key);
      expect(typeof DEFAULT_COLUMN_WIDTHS[header.key]).toBe("number");
    });
  });

  test("all widths are at least MIN_COLUMN_WIDTH", () => {
    Object.values(DEFAULT_COLUMN_WIDTHS).forEach(width => {
      expect(width).toBeGreaterThanOrEqual(MIN_COLUMN_WIDTH);
    });
  });

  test("all widths are positive numbers", () => {
    Object.values(DEFAULT_COLUMN_WIDTHS).forEach(width => {
      expect(width).toBeGreaterThan(0);
      expect(Number.isFinite(width)).toBe(true);
    });
  });

  test("contains expected specific widths", () => {
    expect(DEFAULT_COLUMN_WIDTHS.mid).toBe(90);
    expect(DEFAULT_COLUMN_WIDTHS.kuerzel).toBe(60);
    expect(DEFAULT_COLUMN_WIDTHS.po).toBe(60);
    expect(DEFAULT_COLUMN_WIDTHS.lp).toBe(60);
    expect(DEFAULT_COLUMN_WIDTHS.datum).toBe(180);
    expect(DEFAULT_COLUMN_WIDTHS.zeit).toBe(80);
    expect(DEFAULT_COLUMN_WIDTHS.pruefungsform).toBe(104);
    expect(DEFAULT_COLUMN_WIDTHS.pruefungsdauer).toBe(60);
    expect(DEFAULT_COLUMN_WIDTHS.modul).toBe(300);
    expect(DEFAULT_COLUMN_WIDTHS.pruefer).toBe(90);
    expect(DEFAULT_COLUMN_WIDTHS.pruefer_name).toBe(140);
    expect(DEFAULT_COLUMN_WIDTHS.zweitpruefer).toBe(90);
    expect(DEFAULT_COLUMN_WIDTHS.b_m).toBe(60);
    expect(DEFAULT_COLUMN_WIDTHS.raeume).toBe(140);
    expect(DEFAULT_COLUMN_WIDTHS.beisitzer).toBe(90);
  });

  test("modul has the largest width", () => {
    const modulWidth = DEFAULT_COLUMN_WIDTHS.modul;
    const otherWidths = Object.entries(DEFAULT_COLUMN_WIDTHS)
      .filter(([key]) => key !== "modul")
      .map(([, width]) => width);
    
    otherWidths.forEach(width => {
      expect(modulWidth).toBeGreaterThanOrEqual(width);
    });
  });

  test("short fields have smaller widths", () => {
    const shortFields = ["lp", "b_m", "po", "kuerzel", "pruefungsdauer"];
    shortFields.forEach(field => {
      expect(DEFAULT_COLUMN_WIDTHS[field]).toBeLessThanOrEqual(90);
    });
  });
});

describe("DEFAULT_HIDDEN_COLUMNS", () => {
  test("is an array of strings", () => {
    expect(Array.isArray(DEFAULT_HIDDEN_COLUMNS)).toBe(true);
    DEFAULT_HIDDEN_COLUMNS.forEach(col => {
      expect(typeof col).toBe("string");
    });
  });

  test("contains expected hidden columns", () => {
    const expectedHidden = [
      "mid",
      "lp",
      "pruefungsform",
      "modul",
      "pruefer",
      "zweitpruefer",
      "b_m",
      "beisitzer",
    ];
    
    expect(DEFAULT_HIDDEN_COLUMNS).toEqual(expectedHidden);
  });

  test("all hidden columns exist in TABLE_HEADERS", () => {
    const headerKeys = TABLE_HEADERS.map(h => h.key);
    DEFAULT_HIDDEN_COLUMNS.forEach(col => {
      expect(headerKeys).toContain(col);
    });
  });

  test("has no duplicates", () => {
    const uniqueCols = new Set(DEFAULT_HIDDEN_COLUMNS);
    expect(uniqueCols.size).toBe(DEFAULT_HIDDEN_COLUMNS.length);
  });

  test("hides meta/technical fields by default", () => {
    expect(DEFAULT_HIDDEN_COLUMNS).toContain("mid");
    expect(DEFAULT_HIDDEN_COLUMNS).toContain("lp");
    expect(DEFAULT_HIDDEN_COLUMNS).toContain("b_m");
  });

  test("visible columns include essential exam info", () => {
    const visibleColumns = TABLE_HEADERS
      .map(h => h.key)
      .filter(key => !DEFAULT_HIDDEN_COLUMNS.includes(key));
    
    expect(visibleColumns).toContain("datum");
    expect(visibleColumns).toContain("zeit");
    expect(visibleColumns).toContain("pruefer_name");
    expect(visibleColumns).toContain("raeume");
  });
});

describe("Configuration Consistency", () => {
  test("DEFAULT_HIDDEN_COLUMNS are subset of TABLE_HEADERS", () => {
    const headerKeys = TABLE_HEADERS.map(h => h.key);
    DEFAULT_HIDDEN_COLUMNS.forEach(col => {
      expect(headerKeys).toContain(col);
    });
  });

  test("course keys match ExamEntry interface course fields", () => {
    // Create a mock ExamEntry to verify types
    const mockEntry: Partial<ExamEntry> = {};
    
    COURSES.forEach(course => {
      // Verify that the course key can be used as ExamEntry property
      mockEntry[course.key as keyof ExamEntry] = "";
      expect(course.key).toMatch(/^(pi|ti|mi|wi|is)_(ba|ma)(_dual)?$/);
    });
  });
});