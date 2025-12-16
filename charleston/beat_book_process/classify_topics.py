#!/usr/bin/env python3
"""
Star-Democrat Topic Classification Script

This script analyzes Star-Democrat news stories and assigns topic categories using an LLM.
"""

import json
import subprocess
import sys
from collections import defaultdict

# Configuration
INPUT_FILE = 'stardem_sample.json'
OUTPUT_FILE = 'stardem_topics_classified.json'
MODEL = 'groq-kimi-k2'

def extract_summary(content, max_chars=600):
    """Extract a summary from the story content."""
    lines = content.split('\n')
    clean_lines = []
    
    for line in lines:
        line = line.strip()
        if line and not line.startswith('©') and 'Words' not in line and 'Read News Document' not in line:
            clean_lines.append(line)
            if len(' '.join(clean_lines)) > max_chars:
                break
    
    summary = ' '.join(clean_lines)
    return summary[:max_chars] if len(summary) > max_chars else summary

def classify_story(title, summary, story_num, total_stories):
    """Use LLM to classify a story into topic categories."""
    
    prompt = f"""Analyze this news story and assign one or more relevant topic categories.

Use short, consistent topic names (1-3 words) that accurately represent what each story is about.
If a topic name has been used before, reuse it for similar stories to maintain consistency.

Title: {title}
Summary: {summary}

Return ONLY a JSON list of topic names (e.g., ["Local Government", "Crime"]).
Do not include any explanation, just the JSON list."""

    try:
        result = subprocess.run(
            ['uv', 'run', 'llm', '-m', MODEL],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"  ⚠️  Error: {result.stderr}", file=sys.stderr)
            return ["Uncategorized"]
        
        response = result.stdout.strip()
        
        try:
            if '[' in response and ']' in response:
                start = response.index('[')
                end = response.rindex(']') + 1
                json_str = response[start:end]
                topics = json.loads(json_str)
                topics = [str(t).strip() for t in topics if t]
                if not topics:
                    topics = ["General News"]
                return topics
            else:
                clean_response = response.strip().strip('"\'')
                return [clean_response] if clean_response else ["General News"]
                
        except (json.JSONDecodeError, ValueError) as e:
            clean_response = response.strip().strip('"\'')
            return [clean_response] if clean_response else ["General News"]
            
    except subprocess.TimeoutExpired:
        print(f"  ⚠️  Timeout", file=sys.stderr)
        return ["Uncategorized"]
    except Exception as e:
        print(f"  ⚠️  Error: {e}", file=sys.stderr)
        return ["Uncategorized"]

def main():
    """Main function to process all stories."""
    
    print("="*70)
    print("Star-Democrat Topic Classification")
    print("="*70)
    print(f"Model: {MODEL}")
    print(f"Input: {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print("="*70)
    
    try:
        with open(INPUT_FILE, 'r') as f:
            stories = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: {INPUT_FILE} not found!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON: {e}")
        sys.exit(1)
    
    total_stories = len(stories)
    print(f"\n📚 Processing {total_stories} stories...\n")
    
    topic_tracker = defaultdict(int)
    classified_stories = []
    
    for idx, story in enumerate(stories, 1):
        title = story.get('title', 'Untitled')
        content = story.get('content', '')
        
        summary = extract_summary(content)
        
        print(f"[{idx}/{total_stories}] {title[:55]}...")
        topics = classify_story(title, summary, idx, total_stories)
        
        print(f"           → {', '.join(topics)}")
        
        for topic in topics:
            topic_tracker[topic] += 1
        
        classified_story = story.copy()
        classified_story['topic'] = topics
        classified_stories.append(classified_story)
    
    print(f"\n💾 Saving results to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(classified_stories, f, indent=2)
    
    print("\n" + "="*70)
    print("📊 Topic Distribution Statistics")
    print("="*70)
    
    for topic, count in sorted(topic_tracker.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_stories) * 100
        print(f"  {topic:30} {count:3} ({percentage:5.1f}%)")
    
    print("\n" + "="*70)
    print(f"✅ Successfully classified {len(classified_stories)} stories!")
    print(f"📄 Output saved to: {OUTPUT_FILE}")
    print("="*70)

if __name__ == "__main__":
    main()
