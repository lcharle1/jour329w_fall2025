#!/usr/bin/env python3
import json
import re
from pathlib import Path
from collections import Counter, defaultdict
import html

STOPWORDS = {
    "the","and","to","of","a","in","for","on","with","is","that",
    "was","as","by","at","from","it","an","be","are","this","has",
    "will","have","or","its","which","their","but","they","were","we",
}

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "stardem_draft2" / "filtered_stories.json"
OUT = ROOT / "learning_app.html"

def load_stories(path):
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("Expected JSON array of stories")
    return data

def tokenize(text):
    words = re.findall(r"[A-Za-z']+", text.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 2]

def extract_themes(stories, top_n=8):
    cnt = Counter()
    for s in stories:
        cnt.update(tokenize(s.get('title','') + ' ' + s.get('content','')))
    return [w for w,_ in cnt.most_common(top_n)]

def collect_contacts(stories):
    people = Counter()
    inst = Counter()
    locations = Counter()
    for s in stories:
        for p in s.get('metadata_people') or []:
            people[p] += 1
        for k in s.get('metadata_key_institutions') or []:
            inst[k] += 1
        for g in s.get('metadata_geographic_focus') or []:
            locations[g] += 1
    return people, inst, locations

def pick_examples_for_theme(stories, theme, max_examples=3):
    examples = []
    for s in stories:
        txt = (s.get('title','') + ' ' + s.get('content','')).lower()
        if theme.lower() in txt:
            examples.append(s)
        if len(examples) >= max_examples:
            break
    return examples

def build_quiz(stories, themes, num_questions=5):
    qs = []
    # Question types: year of story, location, institution
    for i in range(min(num_questions, len(stories))):
        s = stories[i]
        title = s.get('title')
        year = s.get('year') or s.get('date','')
        locs = s.get('metadata_geographic_focus') or []
        insts = s.get('metadata_key_institutions') or []
        # prefer location question
        if locs:
            correct = locs[0]
            choices = [correct]
            # add distractors from other stories
            j = 0
            while len(choices) < 4 and j < len(stories):
                other = (stories[j].get('metadata_geographic_focus') or [])
                if other and other[0] not in choices:
                    choices.append(other[0])
                j += 1
            qs.append({
                'question': f"Which location is most associated with the story: '{title}'?",
                'choices': choices,
                'answer': correct,
                'meta': f"source: {s.get('date','')}",
            })
        elif insts:
            correct = insts[0]
            choices = [correct]
            j = 0
            while len(choices) < 4 and j < len(stories):
                other = (stories[j].get('metadata_key_institutions') or [])
                if other and other[0] not in choices:
                    choices.append(other[0])
                j += 1
            qs.append({
                'question': f"Which institution is mentioned in the story '{title}'?",
                'choices': choices,
                'answer': correct,
                'meta': f"source: {s.get('date','')}",
            })
        else:
            # fallback: year question
            correct = s.get('year') or ''
            choices = [correct or s.get('date','')]
            # fill with other years
            j = 0
            while len(choices) < 4 and j < len(stories):
                y = stories[j].get('year') or ''
                if y and y not in choices:
                    choices.append(y)
                j += 1
            qs.append({
                'question': f"When was the story '{title}' published?",
                'choices': choices,
                'answer': correct,
                'meta': f"source: {s.get('date','')}",
            })
    return qs

def render_html(stories, themes, people, insts, locations, quiz):
    title = "Talbot County Health & Public Safety — Learning App"
    esc = html.escape
    people_list = '\n'.join(f"<li>{esc(k)} — {v} mentions</li>" for k,v in people.most_common(30)) or '<li>None listed in metadata</li>'
    inst_list = '\n'.join(f"<li>{esc(k)} — {v} mentions</li>" for k,v in insts.most_common(30)) or '<li>None listed</li>'
    loc_list = '\n'.join(f"<li>{esc(k)} — {v} mentions</li>" for k,v in locations.most_common(30)) or '<li>None listed</li>'

    lessons_html = []
    for t in themes:
        examples = pick_examples_for_theme(stories, t, 3)
        ex_html = ''
        for e in examples:
            ex_html += f"<li><strong>{esc(e.get('title',''))}</strong> — {esc(e.get('date',''))}</li>"
        if not ex_html:
            ex_html = '<li>No direct examples found in dataset.</li>'
        lessons_html.append(f"<section class=\"lesson\"><h3>{esc(t.title())}</h3><p>Why this matters: {esc(' '.join(['This theme appears in local reporting and influences public health, policy and community safety.']))}</p><ul>{ex_html}</ul></section>")

    quiz_html = ''
    for i,q in enumerate(quiz):
        qa = html.escape(str(q.get('answer','')))
        choices_html = ''.join(f"<button class=\"choice\" data-answer=\"{qa}\">{html.escape(str(c))}</button>" for c in q['choices'])
        quiz_html += f"<div class=\"q\" data-correct=\"{qa}\"><p class=\"qtext\">{html.escape(str(q.get('question','')))}</p><div class=\"choices\">{choices_html}</div><p class=\"qmeta\">{html.escape(str(q.get('meta','')))}</p></div>"

        # use placeholder template to avoid brace escaping issues
        template = """
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>%%TITLE%%</title>
    <style>
        body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:20px}
        .lesson{border:1px solid #ddd;padding:12px;margin:8px 0;border-radius:6px}
        .choice{display:block;margin:6px 0;padding:8px;background:#f0f0f0;border:0;border-radius:4px;cursor:pointer}
        .choice.correct{background:#c8e6c9}
        .choice.wrong{background:#ffcdd2}
        #score{position:fixed;right:16px;top:16px;background:#fff;border:1px solid #ccc;padding:8px;border-radius:8px}
        nav a{margin-right:10px}
    </style>
</head>
<body>
    <div id="score">Points: <span id="points">0</span> | Streak: <span id="streak">0</span></div>
    <h1>%%TITLE%%</h1>
    <nav><a href="#lessons">Lessons</a><a href="#quiz">Quiz</a><a href="#contacts">Contacts</a></nav>
    <section id="intro">
        <h2>Introduction</h2>
        <p>This micro-learning guide was generated from the local filtered stories dataset. It focuses on the Health & Public Safety beat across Talbot County municipalities: Easton, Oxford, Queen Anne, St. Michaels, and Trappe. Use the lessons, checklists and quizzes to build reporting familiarity quickly.</p>
    </section>
    <section id="lessons">
        <h2>Micro-Lessons</h2>
        %%LESSONS%%
    </section>
    <section id="quiz">
        <h2>Quick Quiz</h2>
        <p>Test your knowledge. Correct answers give points and build streaks.</p>
        %%QUIZ%%
    </section>
    <section id="contacts">
        <h2>Key People (from metadata)</h2>
        <ul>
        %%PEOPLE%%
        </ul>
        <h2>Key Institutions (from metadata)</h2>
        <ul>
        %%INSTITUTIONS%%
        </ul>
        <h2>Geographic Focus (from metadata)</h2>
        <ul>
        %%LOCATIONS%%
        </ul>
    </section>
    <script>
        const pointsEl = document.getElementById('points')
        const streakEl = document.getElementById('streak')
        function load(){
            pointsEl.textContent = localStorage.getItem('tl_points')||'0'
            streakEl.textContent = localStorage.getItem('tl_streak')||'0'
        }
        function save(points,streak){
            localStorage.setItem('tl_points', points)
            localStorage.setItem('tl_streak', streak)
        }
        load()
        document.querySelectorAll('.q').forEach(qel=>{
            qel.querySelectorAll('.choice').forEach(b=>{
                b.addEventListener('click', ()=>{
                    const correct = qel.dataset.correct
                    const answer = b.dataset.answer
                    let points = parseInt(localStorage.getItem('tl_points')||'0')
                    let streak = parseInt(localStorage.getItem('tl_streak')||'0')
                    if(answer === correct){
                        b.classList.add('correct')
                        points += 10
                        streak += 1
                    } else {
                        b.classList.add('wrong')
                        streak = 0
                    }
                    pointsEl.textContent = points
                    streakEl.textContent = streak
                    save(points,streak)
                    // disable siblings
                    qel.querySelectorAll('.choice').forEach(c=>c.disabled=true)
                })
            })
        })
    </script>
</body>
</html>
"""
        html_doc = template.replace('%%TITLE%%', esc(title)).replace('%%LESSONS%%', ''.join(lessons_html)).replace('%%QUIZ%%', quiz_html).replace('%%PEOPLE%%', people_list).replace('%%INSTITUTIONS%%', inst_list).replace('%%LOCATIONS%%', loc_list)
        return html_doc

def main():
    stories = load_stories(SOURCE)
    print(f"Loaded {len(stories)} stories from {SOURCE}")
    themes = extract_themes(stories, top_n=6)
    people, insts, locations = collect_contacts(stories)
    quiz = build_quiz(stories, themes, num_questions=6)
    html_doc = render_html(stories, themes, people, insts, locations, quiz)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html_doc)
    print(f"Wrote learning app to {OUT}")

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('Error:', e)
        raise
