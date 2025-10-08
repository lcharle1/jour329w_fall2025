#!/usr/bin/env python3
"""
Script to process CNS Maryland posts and generate summaries using LLM.
Requires: uv install llm
"""

import json
import sys
import time
import subprocess
import csv
import argparse
from pathlib import Path
from typing import List, Dict, Any
import re


def load_topics(topics_file: Path) -> Dict[str, str]:
    """Load topics and descriptions from topics.csv file."""
    try:
        topics = {}
        with open(topics_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                topic = row['Topic'].strip()
                description = row['Description'].strip()
                if topic and description:
                    topics[topic] = description
        
        # Add "General news" as fallback option if not in CSV
#        if "General news" not in topics:
#            topics["General news"] = "Stories that don't fit clearly into other specific categories"
            
        return topics
    except FileNotFoundError:
        print(f"Warning: Topics file '{topics_file}' not found.")
        raise


def clean_content(content: str) -> str:
    """
    Clean the content by removing HTML tags and extra whitespace.
    
    Args:
        content (str): Raw content from the post
        
    Returns:
        str: Cleaned content
    """
    # Remove HTML tags
    content = re.sub(r'<[^>]+>', '', content)
    # Remove shortcode tags like [vc_row], [/vc_column_text], etc.
    content = re.sub(r'\[[^\]]+\]', '', content)
    # Replace multiple whitespace with single space
    content = re.sub(r'\s+', ' ', content)
    # Remove extra newlines and tabs
    content = content.replace('\n', ' ').replace('\t', ' ')
    return content.strip()


def classify_topic(title: str, content: str, topics: Dict[str, str], model: str = 'gpt-4o-mini') -> str:
    """Classify a story into one of the predefined topics using LLM."""
    try:
        cleaned_content = clean_content(content)
        
        # Truncate content if too long
        max_content_length = 1500
        if len(cleaned_content) > max_content_length:
            cleaned_content = cleaned_content[:max_content_length] + "..."
        
        # Create topics list for the prompt with descriptions (excluding "General news" as it's the default)
        topic_options = [(topic, desc) for topic, desc in topics.items() if topic != "General news"]
        topics_str = "\n".join([f"- {topic}: {description}" for topic, description in topic_options])
        
        prompt = f"""Classify this news article into exactly ONE of the following topics based on the topic descriptions. Choose the topic that best matches the primary focus of the story.

Available topics and their descriptions:
{topics_str}

Title: {title}

Content: {cleaned_content}

Consider the main focus and subject matter of the story. Look at what the story is primarily about, not just mentions or minor details.

Respond with only the topic name (exactly as listed above):"""
        
        result = subprocess.run([
            'llm', '-m', 'claude-3.5-haiku', prompt
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            classified_topic = result.stdout.strip()
            
            # Validate the response is one of our topics
            if classified_topic in topics:
                return classified_topic
            else:
                # If the LLM returned something not in our list, default to General news
                return "No topic"
        else:
            return "No topic"
    
    except (subprocess.TimeoutExpired, Exception):
        return "No topic"


def generate_tags(title: str, content: str, topic: str, summary: str, model: str = 'gpt-4o-mini') -> List[str]:
    """Generate up to 5 tags for a story, focusing on people, places, and ideas."""
    try:
        cleaned_content = clean_content(content)
        
        # Truncate content if too long
        max_content_length = 1500
        if len(cleaned_content) > max_content_length:
            cleaned_content = cleaned_content[:max_content_length] + "..."
        
        prompt = f"""Generate up to 5 relevant tags for this news article. Each tag must be:
- No more than 2 words
- Focus on prominent people, places, and key ideas mentioned in the story
- Do NOT use words similar to or related to the topic "{topic}" - avoid the topic entirely
- Be broad enough to be useful (avoid overly specific or niche terms)
- Only generate tags if they are meaningful and relevant

Focus on specific names, locations, organizations, and concrete concepts mentioned in the story.

If there aren't 5 meaningful tags, generate fewer. Quality over quantity.

Title: {title}

Summary: {summary}

Content: {cleaned_content}

Respond with only the tags, one per line, each tag being 1-2 words maximum:"""
        
        result = subprocess.run([
            'llm', '-m', model, prompt
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            raw_tags = result.stdout.strip().split('\n')
            
            # Process and validate tags
            tags = []
            topic_words = set(word.lower() for word in topic.split())
            
            for tag in raw_tags:
                # Clean the tag
                tag = tag.strip().strip('-').strip('•').strip('*').strip()
                
                # Skip empty tags, numbers, or generic placeholder tags
                if not tag or tag.isdigit() or tag.lower().startswith('tag '):
                    continue
                
                # Ensure tag is no more than 2 words
                words = tag.split()
                if len(words) <= 2:
                    # Check if tag is similar to topic - avoid any overlap in words
                    tag_words = set(word.lower() for word in words)
                    if not tag_words.intersection(topic_words):
                        # Additional check for semantic similarity
                        tag_lower = tag.lower()
                        topic_lower = topic.lower()
                        
                        # Skip if tag contains topic words or vice versa
                        skip_tag = False
                        for topic_word in topic_words:
                            if len(topic_word) > 3:  # Only check meaningful words
                                if topic_word in tag_lower or any(topic_word in tag_word for tag_word in tag_words):
                                    skip_tag = True
                                    break
                        
                        if not skip_tag:
                            tags.append(tag)
                
                # Stop if we have 5 tags
                if len(tags) >= 5:
                    break
            
            return tags  # Return only the actual tags generated
        else:
            return []
    
    except (subprocess.TimeoutExpired, Exception):
        return []


def generate_summary(title: str, content: str, model: str = 'gpt-4o-mini') -> str:
    """Generate a summary using the LLM command line."""
    cleaned_content = clean_content(content)
    
    # Truncate content if too long to avoid token limits
    max_content_length = 2000
    if len(cleaned_content) > max_content_length:
        cleaned_content = cleaned_content[:max_content_length] + "..."
    
    prompt = f"""You must provide ONLY the final summary without showing any thinking process or reasoning steps. Summarize the following news article in exactly 2 sentences or fewer:

Title: {title}

Content: {cleaned_content}

Final summary (2 sentences maximum):"""
    
    try:
        # Use subprocess to call llm
        result = subprocess.run([
            'llm', '-m', model, prompt
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            summary = result.stdout.strip()
            
            # Ensure summary is not too long and clean up any extra formatting
            sentences = summary.split('. ')
            if len(sentences) > 2:
                summary = '. '.join(sentences[:2])
                if not summary.endswith('.'):
                    summary += '.'
            
            return summary
        else:
            return f"Error: {result.stderr.strip()}"
    
    except subprocess.TimeoutExpired:
        return "Error: Summary generation timed out"
    except Exception as e:
        return f"Error generating summary: {str(e)}"


def process_stories(input_file: Path, output_file: Path, max_stories: int = None, model: str = 'gpt-4o-mini') -> None:
    """
    Process all stories in the JSON file and generate summaries, topics, and tags.
    
    Args:
        input_file (Path): Path to input JSON file
        output_file (Path): Path to output JSON file
        max_stories (int, optional): Maximum number of stories to process. If None, process all stories.
        model (str): LLM model to use for processing
    """
    try:
        # Load topics and descriptions
        topics_file = input_file.parent.parent / 'data' / 'new_topics.csv'
        topics = load_topics(topics_file)
        print(f"Loaded {len(topics)} topics with descriptions")
        
        # Read the input JSON file
        print(f"Reading stories from: {input_file}")
        with open(input_file, 'r', encoding='utf-8') as f:
            stories = json.load(f)
        
        # Limit stories if max_stories is specified
        if max_stories is not None:
            stories = stories[:max_stories]
            print(f"Limited to {len(stories)} stories for testing")
        
        print(f"Found {len(stories)} stories to process")
        
        # Process each story
        summaries = []
        
        for i, story in enumerate(stories, 1):
            title = story.get('title', 'Untitled')
            print(f"Processing story {i}/{len(stories)}: {title}")
            
            try:
                # Classify topic
                topic = classify_topic(
                    story.get('title', ''),
                    story.get('content', ''),
                    topics,
                    model
                )
                
                # Generate summary
                summary = generate_summary(
                    story.get('title', ''), 
                    story.get('content', ''),
                    model
                )
                
                # Generate tags
                tags = generate_tags(
                    story.get('title', ''),
                    story.get('content', ''),
                    topic,
                    summary,
                    model
                )
                
                # Create summary object with topic, tags, and full content
                summary_obj = {
                    "link": story.get('link', ''),
                    "title": story.get('title', ''),
                    "topic": topic,
                    "tags": tags,
                    "summary": summary,
                    "content": story.get('content', '')
                }
                
                summaries.append(summary_obj)
                
                # Add a small delay to be respectful to the model
                time.sleep(0.1)
                
            except Exception as e:
                print(f"Error processing story {i}: {e}")
                # Add a placeholder entry for failed summaries
                summary_obj = {
                    "link": story.get('link', ''),
                    "title": story.get('title', ''),
                    "topic": "No topic",
                    "tags": [],
                    "summary": f"Error generating summary: {str(e)}",
                    "content": story.get('content', '')
                }
                summaries.append(summary_obj)
            
            # Save progress periodically (every 50 stories)
            if i % 50 == 0:
                print(f"Saving progress... ({i} stories processed)")
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(summaries, f, indent=2, ensure_ascii=False)
        
        # Save final results
        print(f"Saving final results to: {output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(summaries, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully processed {len(summaries)} stories!")
        print(f"Results saved to: {output_file}")
        
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format in '{input_file}': {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def main():
    """Main function to run the story processing."""
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Process CNS Maryland posts and generate summaries using LLM')
    parser.add_argument('-test', '--test', action='store_true', 
                       help='Test mode: process only 5 stories instead of all stories')
    parser.add_argument('-m', '--model', required=True,
                       help='LLM model to use (e.g., gpt-4o-mini, claude-3.5-haiku)')
    
    # If no arguments provided, show help
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(1)
    
    args = parser.parse_args()
    
    # Set up file paths
    script_dir = Path(__file__).parent
    input_file = script_dir.parent / 'data' / 'cns_maryland_posts_stripped.json'
    
    # Set output file based on test flag
    if args.test:
        output_file = script_dir.parent / 'data' / 'story_summaries_test.json'
        max_stories = 5
    else:
        output_file = script_dir.parent / 'data' / 'story_summaries.json'
        max_stories = None
    
    # Check if input file exists
    if not input_file.exists():
        print(f"Error: Input file '{input_file}' not found.")
        print("Please ensure the cns_maryland_posts_stripped.json file exists in the data/ directory.")
        sys.exit(1)
    
    # Check if llm command is available
    try:
        import subprocess
        result = subprocess.run(['llm', '--version'], capture_output=True)
        if result.returncode != 0:
            raise FileNotFoundError
    except FileNotFoundError:
        print("Error: 'llm' command not found. Please install it with: pip install llm")
        sys.exit(1)
    
    print("CNS Maryland Story Processing System")
    print("=" * 50)
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    print(f"Model: {args.model}")
    print("Features: Summarization, Topic Classification, Tag Generation")
    if args.test:
        print("Mode: TEST (processing only 5 stories)")
    else:
        print("Mode: FULL (processing all stories)")
    print()
    
    # Confirm before starting
    mode_text = "5 stories (test mode)" if args.test else "all stories"
    response = input(f"Do you want to proceed with processing {mode_text}? This may take a while... (y/N): ")
    if response.lower() not in ['y', 'yes']:
        print("Operation cancelled.")
        sys.exit(0)
    
    # Process the stories
    start_time = time.time()
    process_stories(input_file, output_file, max_stories, args.model)
    end_time = time.time()
    
    print(f"\nProcessing completed in {end_time - start_time:.2f} seconds")


if __name__ == "__main__":
    main()