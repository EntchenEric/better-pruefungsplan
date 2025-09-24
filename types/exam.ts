export interface ExamEntry {
  mid: string;
  kuerzel: string;
  po: string;
  lp: string;
  datum: string;
  zeit?: string;
  pruefungsform: string;
  pruefungsdauer?: string;
  modul: string;
  pruefer: string;
  pruefer_name: string;
  zweitpruefer: string;
  b_m: "B" | "M";
  raeume: string
  beisitzer: string;
  pi_ba: string;
  ti_ba: string;
  mi_ba: string;
  wi_ba: string;
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