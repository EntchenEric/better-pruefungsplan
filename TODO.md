# TODO - Better Prüfungsplan

## Completed
- [x] Analyze and plan technical debt fixes
- [x] Fix accessibility issues in UI components
  - [x] ColumnToggle.tsx: Added roles, aria-labels, ids
  - [x] GlobalSearch.tsx: Added aria-describedby, focus states
  - [x] ShareUrlButton.tsx: Added aria-hidden, sr-only
  - [x] StickyHeader.tsx: Added role="banner", aria-hidden

## In Progress
- [ ] Implement automatic WHS exam data fetching
  - [ ] Fetch PDF from WHS URL
  - [ ] Parse PDF contents to extract exam data
  - [ ] Store data for next semester
  - [ ] Add fetch button to UI
  - [ ] Handle pagination (multiple pages in PDF)

## Pending
- [ ] Fetch exam data from WHS website
- [ ] Display fetched data in the app
- [ ] Test with actual PDF data

## Notes
WHS Prüfungsplan URL:
- Current: https://www.w-hs.de/downloads/sdl-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.../pp_2026_ib_-_aushang.pdf
- All plans: https://www.w-hs.de/informatik/info-center/pruefungen/
