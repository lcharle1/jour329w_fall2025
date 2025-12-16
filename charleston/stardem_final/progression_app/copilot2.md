# Copilot Conversation Summary — Progression App

**Date:** December 15–16, 2025  
**Project:** Star-Democrat Final Beat Book — Duolingo/Quizlet-Style Learning App

---

## Overview

This conversation focused on building a **gamified progression app** for early-career reporters learning the Health and Public Safety beat in Talbot County, Maryland. The app draws content from local news stories in `filtered_stories.json` and follows requirements outlined in `prompt.txt`.

---

## Requirements Review

I began by reading `prompt.txt`, which specified:

- **Style and Tone:** Professional yet casual; descriptive paragraphs with bullet points for quick-reference lists.
- **Content Scope:** Recurring themes, key institutions, key people (with full names and roles), geographic context limited to Talbot County and its five municipalities (Easton, Oxford, Queen Anne, St. Michaels, Trappe).
- **Interactive Elements:** Micro-learning (bite-sized lessons), gamification (streaks, points), inspired by Quizlet and Duolingo.
- **Story Integration:** Use published stories from `filtered_stories.json` to illustrate patterns, cite dates, and extract statistics.
- **Caveats:** Flag unresolved storylines and information not confirmed from the dataset.

---

## What Was Built

A static web application was created in `charleston/stardem_final/progression_app/`:

| File | Purpose |
|------|---------|
| `index.html` | Main UI with session controls, lesson display, quiz area, and progress bar |
| `styles.css` | Clean, responsive styling inspired by modern learning apps |
| `app.js` | Core logic: loads stories, renders lessons, generates quizzes, tracks points/streaks, saves progress to localStorage |
| `README.md` | Instructions for running the app locally |

---

## Key Features Implemented

### Three Progression Levels

1. **Level 1 – Read & Know (Foundations)**  
   Micro-lessons showing story excerpts, publication dates, and context about the beat.

2. **Level 2 – Quick Quizzes (People & Stats)**  
   Multiple-choice questions about people, places, and statistics extracted automatically from stories.

3. **Level 3 – Reporting Prompts (Story Ideas)**  
   Suggested follow-up angles, source recommendations, and ideas based on unfinished storylines.

### Gamification

- **Points:** +10 for each correct quiz answer
- **Streaks:** Counter that resets on wrong answers, encouraging consistency
- **Progress Saved:** Stored locally in browser `localStorage` under key `talbot_progress`

### Content Extraction Helpers

| Function | Purpose |
|----------|---------|
| `extractPeople()` | Pulls names from bylines, explicit fields, or capitalized name patterns in text |
| `extractLocations()` | Identifies Talbot County municipalities mentioned in stories |
| `extractNumbers()` | Finds statistics (percentages, dollar amounts, counts) for quiz generation |
| `makeAngles()` | Generates reporting angle suggestions for Level 3 |

---

## Troubleshooting

When the user reported browser errors, I diagnosed the issue as a **404 error** when fetching `filtered_stories.json`. The root cause was the HTTP server being started from a different directory than expected.

### Fix Applied

Updated `app.js` to try multiple potential paths for the JSON file:

```javascript
const pathsToTry = [
  '/filtered_stories.json',
  '../../../filtered_stories.json',
  '../../filtered_stories.json',
  '../filtered_stories.json',
  'filtered_stories.json'
];
```

Added console logging to help debug path issues and provided clear instructions for starting the server from the workspace root.

---

## How to Run

1. Start server from the workspace root:
   ```bash
   cd /workspaces/jour329w_fall2025
   python3 -m http.server 8000
   ```

2. Open your browser to:
   ```
   http://localhost:8000/charleston/stardem_final/progression_app/
   ```

---

## Files Created

```
charleston/stardem_final/progression_app/
├── index.html
├── app.js
├── styles.css
└── README.md
```

---

## Remaining Opportunities

If time permits, the app could be extended with:

- **Spaced repetition scheduling** — Resurface lessons the reporter struggled with at increasing intervals
- **Admin dashboard** — Track multiple reporters' progress over time
- **Export functionality** — Generate printable checklists or CSV reports of completed lessons
- **Richer entity extraction** — If `filtered_stories.json` includes structured people/location fields, extraction could be more accurate

---

## Conclusion

The conversation successfully produced a working, browser-based learning app tailored to the Talbot County Health and Public Safety beat. The app draws content directly from the local story dataset, offers three levels of engagement, and includes basic gamification to encourage consistent practice—mirroring the style of popular apps like Duolingo and Quizlet.
