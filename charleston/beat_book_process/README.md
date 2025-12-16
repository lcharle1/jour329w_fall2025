# Talbot County Learning App (generated)

This small generator produces an interactive, single-file learning app (`learning_app.html`) from the filtered stories dataset.

What it is
- `generate_learning_app.py` — Python script that reads `../stardem_draft2/filtered_stories.json` and writes `learning_app.html` in this folder.
- `learning_app.html` — generated micro-learning + quiz app (created when you run the generator).

How to run
1. Open a terminal in this folder:

```bash
cd /workspaces/jour329w_fall2025/charleston/stardem_nearly_final
python3 generate_learning_app.py
```

2. If successful, open `learning_app.html` in your browser. You can use the built-in VS Code preview or a local file open.

Notes & assumptions
- The script expects the dataset at `../stardem_draft2/filtered_stories.json`. If your `filtered_stories.json` is in a different path, update the `SOURCE` path in `generate_learning_app.py`.
- The generator does a lightweight analysis (word frequency, metadata extraction) to produce lessons, contacts and a short quiz. It is intentionally simple and meant as a starting point — you can extend the logic to extract more precise themes, named-entity recognition, and more sophisticated quiz generation.

Next steps you might want me to do
- Run the generator now and open `learning_app.html` and iterate on copy and structure.
- Improve theme extraction using an NLP library (spaCy or NLTK) and extract named entities.
- Add more gamification (badges, levels) and a progress dashboard.
