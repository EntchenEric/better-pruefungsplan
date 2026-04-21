export interface ExamEntry {
  mid: string;
  kuerzel: string;
  po: string;
  lp: string;
  datum: string;
  zeit: string;
  pruefungsform: string;
  pruefungsdauer: string;
  modul: string;
  erstpruefer: string;
  zweitpruefer: string;
  b_m: string;
  beisitzer: string;
  pi_ba: string;
  ti_ba: string;
  mi_ba: string;
  wi_ba: string;
  id_ba: string;
  pi_ba_dual: string;
  ti_ba_dual: string;
  mi_ba_dual: string;
  wi_ba_dual: string;
  pi_ma: string;
  ti_ma: string;
  mi_ma: string;
  wi_ma: string;
  is_ma: string;
}

export interface TableHeader {
  key: keyof ExamEntry;
  label: string;
}

export interface ColumnFilters {
  [key: string]: string;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface ColumnWidths {
  [key: string]: number;
}

export interface ResizeInfo {
  startX: number;
  colKey: string | null;
  startWidth: number;
}

export const STUDIENGAENGE: { key: keyof ExamEntry; label: string; gruppe: "ba" | "ma" }[] = [
  { key: "pi_ba", label: "PI Bachelor", gruppe: "ba" },
  { key: "ti_ba", label: "TI Bachelor", gruppe: "ba" },
  { key: "mi_ba", label: "MI Bachelor", gruppe: "ba" },
  { key: "wi_ba", label: "WI Bachelor", gruppe: "ba" },
  { key: "id_ba", label: "ID Bachelor", gruppe: "ba" },
  { key: "pi_ma", label: "PI Master", gruppe: "ma" },
  { key: "ti_ma", label: "TI Master", gruppe: "ma" },
  { key: "mi_ma", label: "MI Master", gruppe: "ma" },
  { key: "wi_ma", label: "WI Master", gruppe: "ma" },
  { key: "is_ma", label: "IS Master", gruppe: "ma" },
];