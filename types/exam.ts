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