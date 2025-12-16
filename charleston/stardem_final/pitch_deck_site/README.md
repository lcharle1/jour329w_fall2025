Pitch Deck — Health & Public Safety (Reporter Training)

Files
- `index.html` — main single-page pitch-deck site
- `styles.css` — lightweight styles
- `app.js` — loads `../filtered_stories3.json`, generates themes, institutions, people, micro-lessons, quiz, and basic gamification

Run locally
1. From the `charleston/stardem_final/pitch_deck_site` folder run a simple HTTP server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes
- The site reads `../filtered_stories3.json`. Keep the file in `charleston/stardem_final`.
- The micro-quiz uses simple auto-generated questions from the dataset to practice quick recall. Points and streaks are stored in `localStorage`.
- This is a starter prototype — you can extend the extraction logic for people/institutions and add richer lessons.

Caveat
- The dataset contains stories published on specific dates. Confirm current status of any ongoing investigations, funding efforts, or legal actions before publishing follow-ups.
Pitch Deck — Health & Public Safety (Talbot County)

This is a static, local pitch-deck style learning site that uses the provided `filtered_stories3.json` dataset in the same folder (`..`).

How to run locally:

1. From the `stardem_final` directory run a simple HTTP server (Python 3):

```bash
python3 -m http.server 8000
```

2. Open your browser to:

http://localhost:8000/pitch_deck_site/

Notes:
- The site fetches `../filtered_stories3.json` at runtime.
- You can attach links to stories (stored in `localStorage`) and open Google Maps for locations.
- Night/day mode toggle and basic English/Spanish labels are included.

Accessibility:
- High-contrast dark mode available.
- Keyboard-accessible controls (basic).

Files added:
- `index.html` — main UI
- `styles.css` — theme and layout
- `app.js` — client-side logic: parsing, indexing, search, dashboard, word cloud

Next steps (optional):
- Improve i18n/localization for full Spanish content
- Replace rudimentary word cloud with a library for better layout
- Add server-side exporter for attachments/links

