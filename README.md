# better-pruefungsplan

Ein modernes, typunges React-Web-Applicaiton für Pruefungsverwaltung.

## 🚀 Features

- **PDF-Abholung und Parsen**: Automatische Extraktion von Prufergungsinformationen
- **Studiengang-Umschaltung**: Einfaches Wechseln zwischen Studiengangen
- **Authentifizierung**: Sichere Benutzerauthentifizierung
- **Settings-Panel**: Benutzerdefinierte Einstellungen
- **Data Export**: Export in PDF, CSV und JSON Format
- **Global Search**: Ubergreifende Suche nach Prufergungen
- **Column Toggle**: Anpassen der Spaltenanordnung
- **Error Boundaries**: Robuste Fehlerbehandlung
- **Loading States**: Optimierte Nutzererfahrung mit Skeleton-Loadern

## 📋 Komponenten

### Exportierte Komponenten

- `PdfFetcher` - PDF-Daten abholen und parsen
- `StudyProgramSwitcher` - Studiengang-Wechsel
- `GlobalSearch` - Ubergreifende Suche
- `ColumnToggle` - Spalten anpassen
- `ShareUrlButton` - URL-Teilen
- `SettingsPanel` - Benutzereinstellungen
- `DataExportPanel` - Daten exportieren
- `ErrorBoundary` - Fehlerbehandlung
- `LoadingSkeleton` - Loading States

## 🔧 Tech Stack

- React (Client Components)
- TypeScript
- Tailwind CSS
- Vercel

## 📂 Projektstruktur

```
components/
├── ColumnToggle.tsx
├── GlobalSearch.tsx
├── PdfFetcher.tsx
├── ShareUrlButton.tsx
├── StudyProgramSwitcher.tsx
├── StickyHeader.tsx
├── DataExportPanel.tsx
├── ErrorBoundary.tsx
├── ErrorBoundaryWrapper.tsx
└── LoadingSkeleton.tsx

hooks/
└── useLocalStorage.ts

types/
└── index.ts

tests/
├── DataExportPanel.test.tsx
├── ErrorBoundary.test.tsx
├── LoadingSkeleton.test.tsx
├── PdfFetcher.test.tsx
└── SettingsPanel.test.tsx

types/
└── index.ts

tests/
└── TODO.md
```

## 📝 TODO

Siehe `TODO.md` für aktuelle Aufgaben und Implementierungsstatus.
