/*
    This file is AI generated. However tests are checked closely.
*/

jest.mock("@//config/tableConfig", () => {
  const KEYS = [
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
  const TABLE_HEADERS = KEYS.map((key) => ({ key }));
  const DEFAULT_HIDDEN_COLUMNS = ["po", "raeume"];
  const DEFAULT_COLUMN_WIDTHS = {
    mid: 100,
    kuerzel: 120,
    po: 80,
    lp: 60,
    datum: 90,
    zeit: 60,
    pruefungsform: 140,
    pruefungsdauer: 110,
    modul: 130,
    pruefer: 100,
    pruefer_name: 150,
    zweitpruefer: 100,
    b_m: 60,
    raeume: 100,
    beisitzer: 90,
  };
  const MIN_COLUMN_WIDTH = 60;
  const COURSES = [{ key: "AI" }, { key: "SE" }];
  const SEMESTERS = [{ key: "WS23" }, { key: "SS24" }];

  return {
    TABLE_HEADERS,
    DEFAULT_HIDDEN_COLUMNS,
    DEFAULT_COLUMN_WIDTHS,
    MIN_COLUMN_WIDTH,
    COURSES,
    SEMESTERS,
  };
});

import {
  encodeColumnFilters,
  decodeColumnFilters,
  encodeColumnVisibility,
  decodeColumnVisibility,
  encodeColumnWidths,
  decodeColumnWidths,
  isCourse,
  isSemester,
  createSearchParams,
} from "@//utils/urlUtils";

import {
  TABLE_HEADERS,
  DEFAULT_COLUMN_WIDTHS,
  MIN_COLUMN_WIDTH,
  DEFAULT_HIDDEN_COLUMNS,
} from "@//config/tableConfig";

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = global;
  if (typeof g.btoa === "undefined") {
    g.btoa = (str: string) => Buffer.from(str, "utf-8").toString("base64");
  }
  if (typeof g.atob === "undefined") {
    g.atob = (str: string) => Buffer.from(str, "base64").toString("utf-8");
  }
});

describe("encodeColumnFilters", () => {
  test("returns empty string for empty filters", () => {
    expect(encodeColumnFilters({} as any)).toBe("");
  });

  test("strips whitespace-only values and encodes only active filters", () => {
    const input = { a: "   ", b: "\n\t  ", c: "value", d: " value " } as any;
    const result = encodeColumnFilters(input);
    const decoded = JSON.parse(atob(result));
    expect(decoded).toEqual({ c: "value", d: " value " });
  });

  test("does not mutate the input object", () => {
    const input = { key: "value", empty: "   " } as any;
    const before = JSON.parse(JSON.stringify(input));
    encodeColumnFilters(input);
    expect(input).toEqual(before);
  });

  test("produces expected base64 for a simple, stable object (single key)", () => {
    const valueToTest = { key: "value" } as any;
    expect(encodeColumnFilters(valueToTest)).toBe(
      btoa(JSON.stringify(valueToTest)),
    );
  });

  test("handles long data without error", () => {
    const longData: Record<string, string> = {};
    for (let i = 0; i < 2000; i++) {
      longData[i.toString()] = `v${i}`;
    }
    expect(encodeColumnFilters(longData)).toBeDefined();
  });
});

describe("decodeColumnFilters", () => {
  const defaultFilters = Object.fromEntries(
    TABLE_HEADERS.map((h) => [h.key, ""]),
  );

  test("returns default filters for empty string", () => {
    expect(decodeColumnFilters("")).toEqual(defaultFilters);
  });

  test("merges decoded values into defaults", () => {
    const partial = { po: "2016" };
    const encoded = btoa(JSON.stringify(partial));
    const result = decodeColumnFilters(encoded);
    expect(result).toEqual({ ...defaultFilters, po: "2016" });
  });

  test("preserves unknown keys from decoded object", () => {
    const decodedHasUnknown = { po: "2016", unknown_key: "x" };
    const encoded = btoa(JSON.stringify(decodedHasUnknown));
    const result = decodeColumnFilters(encoded);
    expect(result).toEqual({ ...defaultFilters, po: "2016", unknown_key: "x" });
  });

  test("invalid JSON (valid base64) logs a warning and returns defaults", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const notJson = btoa("not-json");
    const result = decodeColumnFilters(notJson);
    expect(result).toEqual(defaultFilters);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("atob throwing is caught and returns defaults", () => {
    const originalAtob = global.atob;
    global.atob = () => {
      throw new Error("bad base64");
    };
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(decodeColumnFilters("some-bad-value")).toEqual(defaultFilters);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    global.atob = originalAtob;
  });

  test("roundtrip encode -> decode preserves data where applicable", () => {
    const startValue = {
      mid: "",
      kuerzel: "",
      po: "2016",
      lp: "",
      datum: "",
      zeit: "",
      pruefungsform: "",
      pruefungsdauer: "",
      modul: "",
      pruefer: "",
      pruefer_name: "",
      zweitpruefer: "",
      b_m: "",
      raeume: "",
      beisitzer: "",
    };
    const encoded = encodeColumnFilters(startValue as any);
    const decoded = decodeColumnFilters(encoded);
    expect(decoded).toEqual({ ...defaultFilters, po: "2016" });
  });

  test("whitespace-only filter values are not encoded and thus decode as default", () => {
    const startValue = { po: "   " };
    const encoded = encodeColumnFilters(startValue as any);
    expect(encoded).toBe("");
    const decoded = decodeColumnFilters(encoded);
    expect(decoded).toEqual(defaultFilters);
  });
});

describe("encodeColumnVisibility", () => {
  test("returns empty string if visibility equals default", () => {
    const v: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    );
    expect(encodeColumnVisibility(v as any)).toBe("");
  });

  test("encodes only changed visibilities", () => {
    const v: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    );
    const firstHidden = DEFAULT_HIDDEN_COLUMNS[0];
    v[firstHidden] = false;
    const firstVisible = TABLE_HEADERS.find(
      (h) => !DEFAULT_HIDDEN_COLUMNS.includes(h.key),
    )!.key;
    v[firstVisible] = true;

    const res = encodeColumnVisibility(v as any);
    const obj = JSON.parse(atob(res));
    expect(obj).toEqual({ [firstHidden]: false, [firstVisible]: true });
  });

  test("does not mutate input", () => {
    const v: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    );
    const before = JSON.parse(JSON.stringify(v));
    encodeColumnVisibility(v as any);
    expect(v).toEqual(before);
  });
});

describe("decodeColumnVisibility", () => {
  const defaultVis: Record<string, boolean> = Object.fromEntries(
    TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
  );

  test("returns default for empty input", () => {
    expect(decodeColumnVisibility("")).toEqual(defaultVis);
  });

  test("merges decoded values into defaults", () => {
    const partial = { [DEFAULT_HIDDEN_COLUMNS[0]]: false };
    const encoded = btoa(JSON.stringify(partial));
    expect(decodeColumnVisibility(encoded)).toEqual({
      ...defaultVis,
      ...partial,
    });
  });

  test("preserves unknown keys from decoded object", () => {
    const partial = { [DEFAULT_HIDDEN_COLUMNS[0]]: false, bad: true };
    const encoded = btoa(JSON.stringify(partial));
    expect(decodeColumnVisibility(encoded)).toEqual({
      ...defaultVis,
      ...partial,
    });
  });

  test("invalid JSON logs warning and returns defaults", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const encoded = btoa("not-json");
    expect(decodeColumnVisibility(encoded)).toEqual(defaultVis);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("atob throwing is caught and returns defaults", () => {
    const originalAtob = global.atob;
    global.atob = () => {
      throw new Error("bad base64");
    };
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(decodeColumnVisibility("garbage")).toEqual(defaultVis);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    global.atob = originalAtob;
  });
});

describe("encodeColumnWidths", () => {
  test("returns empty string if widths equal defaults", () => {
    expect(encodeColumnWidths(DEFAULT_COLUMN_WIDTHS as any)).toBe("");
  });

  test("encodes only changed widths", () => {
    const modified = {
      ...DEFAULT_COLUMN_WIDTHS,
      po: DEFAULT_COLUMN_WIDTHS.po + 10,
      mid: DEFAULT_COLUMN_WIDTHS.mid - 5,
    };
    const res = encodeColumnWidths(modified as any);
    const obj = JSON.parse(atob(res));
    expect(obj).toEqual({
      po: DEFAULT_COLUMN_WIDTHS.po + 10,
      mid: DEFAULT_COLUMN_WIDTHS.mid - 5,
    });
  });

  test("does not mutate input", () => {
    const modified = {
      ...DEFAULT_COLUMN_WIDTHS,
      po: DEFAULT_COLUMN_WIDTHS.po + 10,
    };
    const before = JSON.parse(JSON.stringify(modified));
    encodeColumnWidths(modified as any);
    expect(modified).toEqual(before);
  });
});

describe("decodeColumnWidths", () => {
  test("returns defaults for empty input", () => {
    expect(decodeColumnWidths("")).toEqual(DEFAULT_COLUMN_WIDTHS);
  });

  test("merges and sanitizes widths: floors, clamps to MIN, filters unknown keys", () => {
    const badKey = "not_a_real_column";
    const partial = {
      po: 123.9, // floor to 123
      mid: MIN_COLUMN_WIDTH - 10, // clamp up to MIN_COLUMN_WIDTH
      kuerzel: "200.7", // string -> 200.7 -> floor 200
      datum: "abc", // NaN => default
      zeit: Infinity, // non-finite => default
      [badKey]: 1000, // should be removed
    } as any;
    const encoded = btoa(JSON.stringify(partial));
    const result = decodeColumnWidths(encoded);

    expect(result.po).toBe(Math.max(MIN_COLUMN_WIDTH, Math.floor(123.9))); // 123
    expect(result.mid).toBe(MIN_COLUMN_WIDTH);
    expect(result.kuerzel).toBe(Math.max(MIN_COLUMN_WIDTH, Math.floor(200.7))); // 200
    expect(result.datum).toBe(DEFAULT_COLUMN_WIDTHS.datum);
    expect(result.zeit).toBe(DEFAULT_COLUMN_WIDTHS.zeit);
    expect((result as any)[badKey]).toBeUndefined();
    expect(result.modul).toBe(DEFAULT_COLUMN_WIDTHS.modul);
  });

  test("invalid JSON logs warning and returns defaults", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const result = decodeColumnWidths(btoa("not-json"));
    expect(result).toEqual(DEFAULT_COLUMN_WIDTHS);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("atob throwing is caught and returns defaults", () => {
    const originalAtob = global.atob;
    global.atob = () => {
      throw new Error("bad base64");
    };
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(decodeColumnWidths("nope")).toEqual(DEFAULT_COLUMN_WIDTHS);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    global.atob = originalAtob;
  });
});

describe("isCourse", () => {
  test("returns true for valid courses", () => {
    expect(isCourse("AI")).toBe(true);
    expect(isCourse("SE")).toBe(true);
  });

  test("returns false for invalid courses", () => {
    expect(isCourse("CS")).toBe(false);
    expect(isCourse("")).toBe(false);
  });
});

describe("isSemester", () => {
  test("returns true for valid semesters", () => {
    expect(isSemester("WS23")).toBe(true);
    expect(isSemester("SS24")).toBe(true);
  });

  test("returns false for invalid semesters", () => {
    expect(isSemester("WS25")).toBe(false);
    expect(isSemester("")).toBe(false);
  });
});

describe("createSearchParams", () => {
  test("includes only non-empty, valid params", () => {
    const globalSearch = "  hello world  ";
    const columnFilters = { po: "2016", mid: "   " } as any; // only po is active
    const visibility: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    );
    const firstHidden = DEFAULT_HIDDEN_COLUMNS[0];
    visibility[firstHidden] = false;
    const widths = {
      ...DEFAULT_COLUMN_WIDTHS,
      po: DEFAULT_COLUMN_WIDTHS.po + 5,
    };
    const course = "AI";
    const semester = "SS24";

    const params = createSearchParams(
      globalSearch,
      columnFilters as any,
      visibility as any,
      widths as any,
      course,
      semester,
    );
    expect(params.get("search")).toBe("hello world");

    const filtersParam = params.get("filters");
    expect(filtersParam).toBeTruthy();
    expect(JSON.parse(atob(filtersParam!))).toEqual({ po: "2016" });

    const colsParam = params.get("cols");
    expect(colsParam).toBeTruthy();
    expect(JSON.parse(atob(colsParam!))).toEqual({ [firstHidden]: false });

    const widthsParam = params.get("widths");
    expect(widthsParam).toBeTruthy();
    expect(JSON.parse(atob(widthsParam!))).toEqual({
      po: DEFAULT_COLUMN_WIDTHS.po + 5,
    });

    expect(params.get("course")).toBe("AI");
    expect(params.get("semester")).toBe("SS24");
  });

  test("omits params when empty/default or invalid", () => {
    const globalSearch = "   "; // trimmed empty
    const columnFilters = { po: "   " } as any; // no active filters
    const visibility: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    ); // default vis
    const widths = { ...DEFAULT_COLUMN_WIDTHS }; // default widths
    const course = "INVALID";
    const semester = "WS25";

    const params = createSearchParams(
      globalSearch,
      columnFilters as any,
      visibility as any,
      widths as any,
      course,
      semester,
    );
    expect(params.get("search")).toBeNull();
    expect(params.get("filters")).toBeNull();
    expect(params.get("cols")).toBeNull();
    expect(params.get("widths")).toBeNull();
    expect(params.get("course")).toBeNull();
    expect(params.get("semester")).toBeNull();
  });

  test("works when some inputs are undefined for course/semester", () => {
    const params = createSearchParams(
      "",
      {} as any,
      {} as any,
      DEFAULT_COLUMN_WIDTHS as any,
      undefined,
      undefined,
    );
    expect(params.get("course")).toBeNull();
    expect(params.get("semester")).toBeNull();
  });

  test("end-to-end: params reflect encode functions results", () => {
    const filters = { po: "2016" } as any;
    const vis: Record<string, boolean> = Object.fromEntries(
      TABLE_HEADERS.map((h) => [h.key, DEFAULT_HIDDEN_COLUMNS.includes(h.key)]),
    );
    vis.mid = true;
    const widths = {
      ...DEFAULT_COLUMN_WIDTHS,
      datum: DEFAULT_COLUMN_WIDTHS.datum + 33,
    };

    const params = createSearchParams(
      "x",
      filters as any,
      vis as any,
      widths as any,
      "AI",
      "WS23",
    );
    expect(params.get("filters")).toBe(encodeColumnFilters(filters as any));
    expect(params.get("cols")).toBe(encodeColumnVisibility(vis as any));
    expect(params.get("widths")).toBe(encodeColumnWidths(widths as any));
  });
});
