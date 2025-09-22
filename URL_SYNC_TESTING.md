# URL Synchronization Feature - Testing Guide

The URL synchronization feature allows users to share URLs that preserve their current filter settings, global search query, and column visibility preferences.

## How it works

### URL Parameters
- `search`: Global search query (plain text)
- `filters`: Base64-encoded JSON object containing column-specific filters
- `cols`: Base64-encoded JSON object containing column visibility changes from defaults

### Testing Steps

1. **Basic Global Search**
   - Enter text in the global search field
   - Verify URL contains `?search=your-search-term`
   - Share the URL with someone or open in new tab/window
   - Confirm search term is restored

2. **Column Filters**
   - Enter filter text in any column header filter
   - Verify URL contains `?filters=...` parameter
   - Copy URL and open in new tab
   - Confirm column filters are restored

3. **Column Visibility**
   - Toggle column visibility using the column toggle controls
   - Verify URL contains `?cols=...` parameter
   - Copy URL and open in new tab
   - Confirm hidden/visible columns match

4. **Combined State**
   - Set global search + column filters + toggle columns
   - Verify URL contains multiple parameters
   - Use "URL teilen" button to copy full URL
   - Open in new tab and confirm all state is restored

### URL Format Examples

**Global search only:**
```
http://localhost:3000/?search=Mathematik
```

**Column filters only:**
```
http://localhost:3000/?filters=eyJtb2R1bCI6Ik1hdGgiLCJwcnVlZmVyIjoiU21pdGgifQ==
```

**Column visibility changes:**
```
http://localhost:3000/?cols=eyJtaWQiOmZhbHNlLCJscCI6ZmFsc2V9
```

**Combined state:**
```
http://localhost:3000/?search=Mathe&filters=eyJtb2R1bCI6Ik1hdGgiLCJwcnVlZmVyIjoiU21pdGgifQ==&cols=eyJtaWQiOmZhbHNlLCJscCI6ZmFsc2V9
```

### Features
- ✅ 300ms debounced URL updates (prevents excessive history entries)
- ✅ Base64 encoding for complex filter states
- ✅ Graceful fallback to defaults if URL parameters are corrupted
- ✅ Share button with clipboard integration
- ✅ Only stores non-default values to keep URLs clean

### Browser Compatibility
- Modern browsers with `navigator.clipboard` support
- Fallback clipboard implementation for older browsers
- Uses Next.js App Router's `useSearchParams` for SSR compatibility