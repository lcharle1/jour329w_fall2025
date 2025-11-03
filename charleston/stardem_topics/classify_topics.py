import json
import os
from collections import defaultdict

# Read the stardem_sample.json file
input_file = '/workspaces/jour329w_fall2025/charleston/stardem_topics/stardem_sample.json'
output_file = '/workspaces/jour329w_fall2025/charleston/stardem_topics/stardem_topics_classified.json'

with open(input_file, 'r') as f:
    stories = json.load(f)

# Dictionary to track topic usage for consistency
topic_tracker = defaultdict(int)

# Process each story and assign topics
classified_stories = []

for story in stories:
    title = story.get('title', '')
    content = story.get('content', '')
    
    # Create a summary field by combining title and a snippet of content
    # Extract first few paragraphs or words from content as summary
    content_lines = content.split('\n')
    summary_lines = []
    for line in content_lines:
        if line.strip() and not line.strip().startswith('©') and 'Words' not in line:
            summary_lines.append(line.strip())
            if len(summary_lines) >= 3:
                break
    summary = ' '.join(summary_lines)
    
    # Assign topics based on title and content analysis
    topics = []
    
    # Convert to lowercase for easier matching
    title_lower = title.lower()
    content_lower = content.lower()
    combined = (title_lower + ' ' + content_lower)
    
    # Sports topics
    if any(word in combined for word in ['baseball', 'softball', 'lacrosse', 'football', 'basketball', 'soccer', 'game', 'coach', 'team', 'player', 'season', 'tournament', 'championship']):
        if 'baseball' in combined or 'pitcher' in combined or 'inning' in combined:
            topics.append('High School Baseball')
            topic_tracker['High School Baseball'] += 1
        elif 'softball' in combined:
            topics.append('High School Softball')
            topic_tracker['High School Softball'] += 1
        elif 'lacrosse' in combined:
            topics.append('High School Lacrosse')
            topic_tracker['High School Lacrosse'] += 1
        elif 'football' in combined:
            topics.append('High School Football')
            topic_tracker['High School Football'] += 1
        else:
            topics.append('High School Sports')
            topic_tracker['High School Sports'] += 1
    
    # Crime & Legal topics
    if any(word in combined for word in ['guilty', 'convicted', 'sentenced', 'charged', 'arrest', 'murder', 'assault', 'abuse', 'trial', 'court', 'judge', 'police', 'shooting', 'stabbing', 'crime']):
        if 'child' in combined and ('abuse' in combined or 'pornography' in combined):
            topics.append('Child Abuse')
            topic_tracker['Child Abuse'] += 1
        elif 'murder' in combined or 'stabbing' in combined or 'shooting' in combined:
            topics.append('Violent Crime')
            topic_tracker['Violent Crime'] += 1
        else:
            topics.append('Crime & Justice')
            topic_tracker['Crime & Justice'] += 1
    
    # Politics & Government
    if any(word in combined for word in ['election', 'council', 'commissioner', 'candidate', 'mayor', 'vote', 'town council', 'board', 'political']):
        if 'candidate' in combined or 'election' in combined:
            topics.append('Local Elections')
            topic_tracker['Local Elections'] += 1
        else:
            topics.append('Local Government')
            topic_tracker['Local Government'] += 1
    
    # Education
    if any(word in combined for word in ['school', 'teacher', 'student', 'education', 'principal', 'superintendent']):
        topics.append('Education')
        topic_tracker['Education'] += 1
    
    # Infrastructure & Development
    if any(word in combined for word in ['bridge', 'traffic', 'road', 'construction', 'infrastructure', 'development', 'housing', 'water', 'sewer']):
        if 'housing' in combined or 'development' in combined or 'growth' in combined:
            topics.append('Housing & Development')
            topic_tracker['Housing & Development'] += 1
        elif 'traffic' in combined or 'bridge' in combined or 'road' in combined:
            topics.append('Transportation')
            topic_tracker['Transportation'] += 1
        elif 'water' in combined or 'sewer' in combined:
            topics.append('Water & Utilities')
            topic_tracker['Water & Utilities'] += 1
    
    # Environmental topics
    if any(word in combined for word in ['environmental', 'pollution', 'recycling', 'bacteria', 'water quality', 'bay', 'river', 'plastic', 'conservation']):
        topics.append('Environment')
        topic_tracker['Environment'] += 1
    
    # Community & Events
    if any(word in combined for word in ['festival', 'parade', 'farmers market', 'calendar', 'event', 'celebration', 'concert', 'fair']):
        topics.append('Community Events')
        topic_tracker['Community Events'] += 1
    
    # Obituaries
    if 'obituar' in combined or 'died' in title_lower or 'death' in title_lower or 'passed away' in combined:
        topics.append('Obituaries')
        topic_tracker['Obituaries'] += 1
    
    # Historical
    if 'today in history' in title_lower or 'historical' in combined or 'history' in title_lower:
        topics.append('History')
        topic_tracker['History'] += 1
    
    # Food & Recipes
    if any(word in combined for word in ['recipe', 'cooking', 'thanksgiving', 'leftovers', 'ingredients']):
        topics.append('Food & Recipes')
        topic_tracker['Food & Recipes'] += 1
    
    # Arts & Culture
    if any(word in combined for word in ['art', 'museum', 'movie', 'film', 'theater', 'music', 'band', 'concert']):
        if 'band director' in combined or 'music' in combined:
            topics.append('Arts & Culture')
            topic_tracker['Arts & Culture'] += 1
    
    # If no topics were assigned, add a general "Local News" topic
    if not topics:
        topics.append('Local News')
        topic_tracker['Local News'] += 1
    
    # Create classified story entry
    classified_story = {
        'title': title,
        'summary': summary if summary else title,
        'topics': topics,
        'date': story.get('date', ''),
        'author': story.get('author', ''),
        'docref': story.get('docref', '')
    }
    
    classified_stories.append(classified_story)

# Save the classified results
with open(output_file, 'w') as f:
    json.dump(classified_stories, f, indent=2)

print(f"Classified {len(classified_stories)} stories")
print(f"\nSaved to: {output_file}")
print(f"\nTopic usage statistics:")
for topic, count in sorted(topic_tracker.items(), key=lambda x: x[1], reverse=True):
    print(f"  {topic}: {count}")
