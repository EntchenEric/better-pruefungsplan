import { TableHeader, ColumnWidths } from "@/types/exam";

// Core exam columns (always visible in column toggle)
export const CORE_HEADERS: TableHeader[] = [
  { key: "kuerzel", label: "Kürzel" },
  { key: "po", label: "PO" },
  { key: "datum", label: "Datum" },
  { key: "zeit", label: "Zeit" },
  { key: "pruefungsform", label: "Form" },
  { key: "pruefungsdauer", label: "Dauer" },
  { key: "modul", label: "Modul" },
  { key: "erstpruefer", label: "Erstprüfer" },
  { key: "zweitpruefer", label: "Zweitprüfer" },
  { key: "b_m", label: "B/M" },
];

// Studiengang columns (auto-shown when studiengang is selected)
export const STUDIENGAENG_HEADERS: TableHeader[] = [
  { key: "pi_ba", label: "PI BA" },
  { key: "ti_ba", label: "TI BA" },
  { key: "mi_ba", label: "MI BA" },
  { key: "wi_ba", label: "WI BA" },
  { key: "id_ba", label: "ID BA" },
  { key: "pi_ba_dual", label: "PI BA dual" },
  { key: "ti_ba_dual", label: "TI BA dual" },
  { key: "mi_ba_dual", label: "MI BA dual" },
  { key: "wi_ba_dual", label: "WI BA dual" },
  { key: "pi_ma", label: "PI MA" },
  { key: "ti_ma", label: "TI MA" },
  { key: "mi_ma", label: "MI MA" },
  { key: "wi_ma", label: "WI MA" },
  { key: "is_ma", label: "IS MA" },
];

// Rarely needed columns (hidden by default, available in toggle)
export const EXTRA_HEADERS: TableHeader[] = [
  { key: "mid", label: "MID" },
  { key: "lp", label: "LP" },
  { key: "beisitzer", label: "Beisitzer" },
];

// All headers combined (for table rendering)
export const TABLE_HEADERS: TableHeader[] = [
  ...CORE_HEADERS.slice(0, 1), // kuerzel first
  { key: "mid", label: "MID" },
  { key: "po", label: "PO" },
  { key: "lp", label: "LP" },
  { key: "datum", label: "Datum" },
  { key: "zeit", label: "Zeit" },
  { key: "pruefungsform", label: "Form" },
  { key: "pruefungsdauer", label: "Dauer" },
  { key: "modul", label: "Modul" },
  { key: "erstpruefer", label: "Erstprüfer" },
  { key: "zweitpruefer", label: "Zweitprüfer" },
  { key: "b_m", label: "B/M" },
  { key: "beisitzer", label: "Beisitzer" },
  { key: "pi_ba", label: "PI BA" },
  { key: "ti_ba", label: "TI BA" },
  { key: "mi_ba", label: "MI BA" },
  { key: "wi_ba", label: "WI BA" },
  { key: "id_ba", label: "ID BA" },
  { key: "pi_ba_dual", label: "PI BA dual" },
  { key: "ti_ba_dual", label: "TI BA dual" },
  { key: "mi_ba_dual", label: "MI BA dual" },
  { key: "wi_ba_dual", label: "WI BA dual" },
  { key: "pi_ma", label: "PI MA" },
  { key: "ti_ma", label: "TI MA" },
  { key: "mi_ma", label: "MI MA" },
  { key: "wi_ma", label: "WI MA" },
  { key: "is_ma", label: "IS MA" },
];

// Columns shown in the toggle UI (core + extra, not studiengang)
export const TOGGLE_HEADERS: TableHeader[] = [
  ...CORE_HEADERS,
  ...EXTRA_HEADERS,
];

export const MIN_COLUMN_WIDTH = 60;
export const DEFAULT_COLUMN_WIDTH = 140;

export const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  mid: 80,
  kuerzel: 80,
  po: 70,
  lp: 50,
  datum: 100,
  zeit: 70,
  pruefungsform: 200,
  pruefungsdauer: 70,
  modul: 280,
  erstpruefer: 150,
  zweitpruefer: 150,
  b_m: 50,
  beisitzer: 100,
  pi_ba: 70,
  ti_ba: 70,
  mi_ba: 70,
  wi_ba: 70,
  id_ba: 70,
  pi_ba_dual: 90,
  ti_ba_dual: 90,
  mi_ba_dual: 90,
  wi_ba_dual: 90,
  pi_ma: 70,
  ti_ma: 70,
  mi_ma: 70,
  wi_ma: 70,
  is_ma: 70,
};

// Hide studiengang + extra columns by default
export const DEFAULT_HIDDEN_COLUMNS = [
  "mid",
  "lp",
  "beisitzer",
  "erstpruefer",
  "zweitpruefer",
  "pi_ba",
  "ti_ba",
  "mi_ba",
  "wi_ba",
  "id_ba",
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