# Talbot County Learning App — Development Summary

## Overview
Created an interactive, single-file micro-learning application for early-career reporters covering the Health & Public Safety beat in Talbot County, Maryland, using the filtered stories dataset as the primary source material.

## Project Context
- **Dataset**: `charleston/stardem_draft2/filtered_stories.json` (50 stories)
- **Specification**: `prompt_learning_app.txt` — detailed requirements for micro-learning format with gamification, themes, key people/institutions, geographic context, and story ideas
- **Output**: `learning_app.html` (generated single-file web app)

## What Was Built

### 1. Generator Script (`generate_learning_app.py`)
A Python generator that:
- Reads the filtered stories JSON dataset
- Extracts key themes, people, institutions, and locations from story metadata and content
- Generates micro-lessons with narrative descriptions
- Produces an interactive quiz with diverse question types (location, institution, people, date/year)
- Builds a contacts reference section aggregated from metadata
- Outputs a single self-contained HTML file with built-in gamification

**Key Features**:
- Automatic theme extraction using keyword matching (public_safety, health, government, community, education)
- Quiz generation with 4 different question types rotated across stories
- Gamification: points (10 per correct answer) and streaks tracked in localStorage
- Responsive design with navigation between sections (Lessons, Quiz, Contacts)

### 2. Generated Learning App (`learning_app.html`)
Single-file interactive web application containing:

#### Introduction Section
Brief overview explaining focus on Health & Public Safety beat across Talbot County municipalities (Easton, Oxford, Queen Anne, St. Michaels, Trappe).

#### Micro-Lessons Section
- Auto-extracted themes: Public Safety, Health, Government, Community, Education
- Each lesson includes:
  - Narrative paragraph explaining significance to the beat
  - Up to 4 story examples from dataset (with dates)
  - Context on how the theme surfaces in reporting

#### Quick Quiz Section
- 10 dynamically generated questions with varying types:
  - Geographic location matching
  - Institution/organization identification
  - Key people recognition
  - Publication date/year questions
- Multiple-choice format with 4 options
- Immediate feedback (correct = green, wrong = red)
- Points system: 10 points per correct answer
- Streak tracking: increments on correct, resets on wrong
- Progress persisted in browser localStorage

#### Contacts Section (Three lists from metadata)
1. **Key People** — 30 most-mentioned individuals with mention counts
   - Examples: Donald Trump (2), Joe Biden (2), Rev. Jeffrey Butler (1), etc.
2. **Key Institutions** — 30 most-mentioned organizations
   - Examples: Star Democrat (4), Caroline County Sheriff's Office (2), Trappe Council (1), etc.
3. **Geographic Focus** — 30 most-mentioned locations
   - Examples: Maryland (16), United States (14), Easton (6), Caroline County (4), etc.

### 3. Documentation (`README.md`)
Instructions for running the generator and next steps for enhancement.

## Technical Details

**Python Dependencies**: 
- Standard library only (json, re, pathlib, collections, html, datetime)
- No external packages required

**How the Generator Works**:
1. Loads JSON array of stories
2. Tokenizes and filters stopwords from content
3. Extracts themes via keyword matching against predefined theme categories
4. Collects metadata (people, institutions, locations) with frequency counting
5. Generates quiz questions by rotating across question types
6. Renders template-based HTML with all content embedded
7. Uses placeholder replacement to avoid f-string brace escaping issues

**Running the Generator**:
```bash
cd /workspaces/jour329w_fall2025/charleston/stardem_nearly_final
python3 generate_learning_app.py
```

## Alignment with Specification

### From `prompt_learning_app.txt`:
✅ **Micro-learning (bite-sized lessons)** — Delivered as 5 themed lessons with narrative + examples  
✅ **Gamification (streaks, points)** — Implemented with localStorage persistence  
✅ **Interactive elements** — Quiz with immediate feedback, navigation between sections  
✅ **Professional & casual tone** — Lesson narratives use direct language suitable for reporters  
✅ **Narrative paragraphs** — Each lesson includes descriptive paragraph on why theme matters  
✅ **Key institutions** — Listed with mention counts; searchable metadata  
✅ **Key people** — Contact list with full names and mention frequency  
✅ **Geographic focus** — Talbot County + municipalities highlighted with counts  
✅ **Story examples with dates** — Each lesson/quiz question cites source date  
✅ **Key statistics** — Mention counts provide quantitative view of beat coverage  

### Partial/Future Implementation:
⚠️ **Detailed institution descriptions** — Currently shows names/counts; full narratives per spec would require additional NLP analysis  
⚠️ **Story ideas & underreported angles** — Not yet implemented; would require follow-up pass analyzing gaps and emerging issues  
⚠️ **Unresolved storyline tracking** — Could be added with flagging logic for ongoing stories  

## Files Created/Modified

| File | Status | Purpose |
|------|--------|---------|
| `generate_learning_app.py` | ✅ Created | Python generator script |
| `learning_app.html` | ✅ Generated | Output app (single HTML file) |
| `README.md` | ✅ Created | Run instructions & next steps |
| `copilot.md` | ✅ Created | This summary |

## How to Use the App

**Opening the App**:
- Option 1: Right-click `learning_app.html` in VS Code → Open with Simple Browser
- Option 2: Copy to local machine and open in any web browser
- Option 3: Use Python HTTP server: `python3 -m http.server 8000` from the folder

**Using the App**:
1. Start at **Introduction** to understand the beat
2. Read through **Micro-Lessons** to learn recurring themes and key patterns
3. Take the **Quick Quiz** to test knowledge; watch points and streak grow
4. Reference **Contacts** section when planning reporting or outreach
5. Use story examples and dates to verify current status in original dataset

## Next Steps / Enhancement Opportunities

### (1) Improve Lesson Narratives with NLP
- Use spaCy or NLTK to extract key institutions and people per theme
- Generate more detailed paragraph descriptions per spec
- Add context on stakeholder roles and competing viewpoints

### (2) Expand Quiz & Gamification
- Add more question types (statistics/money questions, multi-select)
- Implement badges/achievements (e.g., "Public Safety Expert" at 50 points)
- Add difficulty levels (easy/medium/hard)
- Include "unresolved stories" verification questions

### (3) Story Ideas & Follow-Up Tracker
- Analyze dataset for gaps (unexplored angles, underreported themes)
- Suggest follow-up story hooks with source recommendations
- Flag ongoing/unresolved storylines from older dates
- Provide reporter checklist of key sources to contact

### (4) Dynamic Data Loading
- Convert to Flask/Node.js backend to load JSON dynamically
- Allow swapping datasets without regenerating HTML
- Add ability to search/filter contacts and stories

### (5) Export Features
- Downloadable reporter checklist (contacts + key buildings + FOIA requests)
- Print-friendly view for offline reference
- CSV export of contact lists

## Notes & Caveats

- **Dataset Source**: Original `filtered_stories.json` in repo root was empty; used `charleston/stardem_draft2/filtered_stories.json` instead
- **Theme Extraction**: Current approach uses keyword matching; more sophisticated topic modeling (LDA, NMF) would improve theme coherence
- **Metadata Completeness**: Some stories have incomplete metadata (null values); quiz questions skip them gracefully
- **Talbot County Focus**: Geographic filtering is not applied in current version; all 50 stories included regardless of location relevance
- **Story Status**: No verification of unresolved/ongoing storylines; users should cross-reference dates with current reporting
- **Browser Compatibility**: Works in all modern browsers; uses localStorage for gamification (limited to same domain)

## Conclusion

The learning app provides an interactive introduction to the Talbot County Health & Public Safety beat. Early-career reporters can quickly familiarize themselves with recurring themes, key stakeholders, institutions, and geographic context through lessons, quiz practice, and a curated contact reference. The app is self-contained in a single HTML file requiring no server or dependencies, making it portable and easy to distribute.

Future iterations can expand narrative depth, add more sophisticated quiz types, and include proactive story-idea generation based on coverage gaps identified in the dataset.
