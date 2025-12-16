# Copilot Conversation Summary — Health & Public Safety Pitch Deck

**Date:** December 16, 2025  
**Project:** Star-Democrat Final Beat Book — Pitch Deck Website

---

## Overview

This conversation focused on building a **professional pitch-deck style website** to teach early-career reporters about the **Health and Public Safety beat** in eastern Maryland (Talbot County area). The site uses the `filtered_stories3.json` dataset extracted from Star-Democrat news stories and follows requirements outlined in `prompt.txt`.

---

## What Was Built

A static, client-side learning application was created in `charleston/stardem_final/pitch_deck_site/` with the following files:

| File | Purpose |
|------|---------|
| `index.html` | Main UI structure with navigation, search, and content views |
| `styles.css` | Light/dark theme, layout, accessibility styles, error banner |
| `app.js` | Client-side logic: data loading, indexing, search, dashboard, word cloud |
| `README.md` | Run instructions and project notes |

### Key Features Implemented

1. **Night/Day Mode Toggle** — Users can switch between light and dark themes for accessibility and preference.

2. **Language Selector** — Basic English/Spanish label switching (minimal i18n implementation).

3. **Search Bar** — Full-text search across story titles and content; displays matching results with links to attach external URLs.

4. **Dashboard with Statistics** — Shows total story count and topic breakdown extracted from the dataset.

5. **Word Cloud (Display-Only)** — Canvas-rendered visualization of the most frequently occurring words across all stories, highlighting recurring themes on the beat.

6. **Key People Directory** — Lists authors/bylines from the dataset with story counts.

7. **Key Institutions Directory** — Curated list of local institutions (fire departments, sheriff's office, health departments) with search buttons to find related stories.

8. **Key Locations Directory** — Locations detected in stories (Easton, Oxford, Queen Anne, etc.) with Google Maps links.

9. **Attach Links Feature** — Users can attach external URLs to stories, saved in browser localStorage.

10. **Micro-Lessons** — Short instructional cards about what to watch for, quick sources, and daily routines on the beat.

11. **Error Handling** — On-page error screen and a JavaScript error banner that captures and displays runtime errors for debugging.

---

## Technical Decisions

- **Static Site / No Backend:** The site runs entirely in the browser using vanilla HTML, CSS, and JavaScript. Data is fetched from the parent directory (`../filtered_stories3.json`) at runtime.

- **Local HTTP Server Required:** Because the site fetches JSON via `fetch()`, it must be served over HTTP (not opened as a local file). Instructions use Python's built-in HTTP server:
  ```bash
  cd charleston/stardem_final
  python3 -m http.server 8000
  ```
  Then open: http://localhost:8000/pitch_deck_site/

- **safeForEach Helper:** To avoid cross-browser issues with `NodeList.prototype.forEach`, a defensive helper function wraps all DOM iteration.

- **Word Cloud is Display-Only:** Originally planned to have clickable words that navigate to explanatory text. Due to complexity and runtime errors with canvas hit-detection, the word cloud was simplified to display-only per user request.

---

## Debugging Process

Several JavaScript runtime errors occurred during development:

1. **"Cannot read properties of undefined (reading 'forEach')"** — Caused by calling `.forEach()` on `querySelectorAll` results that could be undefined in some edge cases. Fixed by replacing all DOM `.forEach` calls with the `safeForEach` helper.

2. **"positions is not defined"** — A leftover reference to a removed variable for word-cloud click handling. Fixed by removing the line.

3. **Error Banner Added** — To make debugging easier, an on-page error banner was added that captures `window.onerror` and `unhandledrejection` events and displays them visibly at the top of the page.

---

## What's Working

- Site loads and displays all sections (Overview, Dashboard, People, Institutions, Locations)
- Search returns matching stories
- Night/day mode toggles correctly
- Dashboard shows statistics and word cloud
- Google Maps links open in new tabs
- Attach-link feature saves to localStorage

---

## Remaining Work / Next Steps

1. **Full i18n** — Currently only a few labels switch between English and Spanish. Full translation of all content would require a more robust internationalization approach.

2. **Richer Data Extraction** — A Python script could pre-process the dataset to extract more structured contact information (emails, phone numbers, positions) for the people and institutions directories.

3. **Accessibility Audit** — While basic keyboard navigation and high-contrast dark mode are included, a full accessibility audit (ARIA labels, focus management, screen reader testing) would improve the experience.

4. **Word Cloud Interactivity** — If desired, the word cloud could be made interactive again with proper hit-testing and accessible keyboard navigation.

5. **Export/Share Feature** — Currently attached links are stored only in localStorage. A future version could allow exporting or sharing curated link collections.

---

## Files Created

```
charleston/stardem_final/pitch_deck_site/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## How to Run

1. Open a terminal and navigate to the `stardem_final` directory:
   ```bash
   cd charleston/stardem_final
   ```

2. Start a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser to:
   ```
   http://localhost:8000/pitch_deck_site/
   ```

---

## Summary

This conversation produced a functional, accessible pitch-deck learning site for early-career reporters covering the Health and Public Safety beat in Talbot County, Maryland. The site draws on real news stories from the Star-Democrat dataset, provides searchable directories of people, institutions, and locations, and includes interactive features like night mode and link attachment. While some advanced features (full i18n, interactive word cloud) remain as future enhancements, the core learning tool is complete and ready for use.
