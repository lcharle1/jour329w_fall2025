Pitch Deck — Health & Public Safety (Reporter Training)

Files
- `index.html` — main single-page pitch-deck site
- `styles.css` — lightweight styles
- `app.js` — improved entity extraction and contact parsing; reads `../filtered_stories3.json`

Run locally
1. From the `charleston/stardem_final/webpage` folder run a simple HTTP server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes
- The site reads `../filtered_stories3.json`. Keep the file in `charleston/stardem_final`.
- `app.js` now performs cleaner extraction of people and institutions, and parses emails and phone numbers found in stories.
- Points and streaks are stored in `localStorage`.

Caveat
- The dataset contains stories published on specific dates. Confirm current status of ongoing investigations, funding efforts, or legal actions before publishing follow-ups.
