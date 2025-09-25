import { TableHeader, ColumnWidths } from "@/types/exam";

export const TABLE_HEADERS: TableHeader[] = [
  { key: "mid", label: "MID" },
  { key: "kuerzel", label: "Kürzel" },
  { key: "po", label: "PO" },
  { key: "lp", label: "LP" },
  { key: "datum", label: "Datum" },
  { key: "zeit", label: "Zeit" },
  { key: "pruefungsform", label: "Form" },
  { key: "pruefungsdauer", label: "Dauer" },
  { key: "modul", label: "Modul" },
  { key: "pruefer", label: "Prüfer" },
  { key: "pruefer_name", label: "Prüfer Name" },
  { key: "zweitpruefer", label: "Zweitprüfer" },
  { key: "b_m", label: "Bachelor/Master" },
  { key: "raeume", label: "Räume" },
  { key: "beisitzer", label: "Beisitzer" },
];

export const MIN_COLUMN_WIDTH = 20;
export const DEFAULT_COLUMN_WIDTH = 140;

export const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  mid: 90,
  kuerzel: 100,
  po: 100,
  lp: 60,
  datum: 100,
  zeit: 80,
  pruefungsform: 104,
  pruefungsdauer: 90,
  modul: 300,
  pruefer: 90,
  pruefer_name: 140,
  zweitpruefer: 90,
  b_m: 60,
  raeume: 140,
  beisitzer: 90,
};

export const DEFAULT_HIDDEN_COLUMNS = ["mid", "lp", "pruefungsform", "modul", "pruefer", "zweitpruefer", "b_m", "beisitzer"];