# Talbot County — Health & Public Safety Progression App

Quick static app to help early-career reporters learn the local Health & Public Safety beat using the provided `filtered_stories.json` dataset.

Files added
- `index.html` — app UI
- `app.js` — client logic (loads `filtered_stories.json` and runs micro-lessons)
- `styles.css` — basic styling

How to run

1. From the workspace root run a simple HTTP server (required so `fetch` can load JSON):

```bash
python3 -m http.server 8000
```

2. Open this URL in your browser:

http://localhost:8000/charleston/stardem_final/progression_app/

Notes and next steps
- Progress is saved locally in `localStorage` under `talbot_progress`.
- The app attempts best-effort extraction from story fields (`title`, `text`, `summary`, `tags`, `people`, `locations`). If your `filtered_stories.json` uses different field names, edit `app.js` extraction helpers (`extractPeople`, `extractLocations`, `extractNumbers`).
- I can extend the app to add: spaced-repetition scheduling UI, administrative dashboard, CSV export of progress, or generate printable reporter checklists per story.
