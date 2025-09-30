import json
import re
from pathlib import Path

def strip_html_tags(text):
    if not isinstance(text, str):
        return text
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', text)
    # Optionally, unescape HTML entities (e.g., &amp;)
    clean = re.sub(r'&[a-zA-Z0-9#]+;', '', clean)
    return clean.strip()

DATA_PATH = Path(__file__).parent.parent / 'data' / 'cns_maryland_posts.json'
OUTPUT_PATH = Path(__file__).parent.parent / 'data' / 'cns_maryland_posts_stripped.json'

def main():
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    for post in posts:
        if 'content' in post:
            post['content'] = strip_html_tags(post['content'])

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"Stripped HTML tags from 'content' in {DATA_PATH.name} and saved to {OUTPUT_PATH.name}")

if __name__ == '__main__':
    main()
