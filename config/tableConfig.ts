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

export const COURSES = [
  { key: "pi_ba", label: "Praktische Informatik Bachelor" },
  { key: "ti_ba", label: "Theoretische Informatik Bachelor" },
  { key: "mi_ba", label: "Medieninformatik Bachelor" },
  { key: "wi_ba", label: "Wirtschaftsinformatik Bachelor" },
  { key: "pi_ba_dual", label: "Praktische Informatik Dual Bachelor" },
  { key: "ti_ba_dual", label: "Theoretische Informatik Dual Bachelor" },
  { key: "mi_ba_dual", label: "Medieninformatik Dual Bachelor" },
  { key: "wi_ba_dual", label: "Wirtschaftsinformatik Dual Bachelor" },
  { key: "pi_ma", label: "Praktische Informatik Master" },
  { key: "ti_ma", label: "Theoretische Informatik Master" },
  { key: "mi_ma", label: "Medieninformatik Master" },
  { key: "wi_ma", label: "Wirtschaftsinformatik Master" },
  { key: "is_ma", label: "Internetsicherheit Master" },
]

export const SEMESTERS = [
  {key: "1", label: "1"},
  {key: "2", label: "2"},
  {key: "3", label: "3"},
  {key: "4", label: "4"},
  {key: "5", label: "5"},
  {key: "6", label: "6"},
  {key: "7", label: "7"},
  //{key: "8", label: "8"},
  {key: "WP", label: "Wahlpflicht"},
  {key: "WP-I", label: "Wahlpflicht Informatik Master"},
  {key: "WP-IN", label: "Wahlpflicht Informatik Bachelor"},
  {key: "WP-L", label: "Wahlpflicht Lerneinheit Master"},
  {key: "WP-LE", label: "Wahlpflicht Lerneinheit Bachelor"},
]

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