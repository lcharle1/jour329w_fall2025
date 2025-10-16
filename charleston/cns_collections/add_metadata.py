import json
import subprocess
import time
import argparse
import sys
from pathlib import Path

def extract_metadata(story_title, story_content, schema_prompt, model):
    """Use LLM to extract structured metadata from story title and summary."""
    prompt = f"""
Extract metadata from this news story in JSON format using only the title and summary provided.

Schema to follow:
{schema_prompt}

Story Title: {story_title}
Story Summary: {story_content}

Return only valid JSON with the metadata. If information is not available, use an empty array:
"""
    
    try:
        result = subprocess.run([
            'llm', '-m', model, prompt
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            # Parse and validate the JSON response
            response_text = result.stdout.strip()
            # Remove any markdown code blocks if present
            if response_text.startswith('```'):
                response_text = response_text.split('\n', 1)[1]
                response_text = response_text.rsplit('\n', 1)[0]
            
            metadata = json.loads(response_text)
            return metadata
        else:
            return {"error": "LLM failed", "stderr": result.stderr}
    except Exception as e:
        return {"error": str(e)}

def main():
    parser = argparse.ArgumentParser(description='Add metadata to CNS beat stories using LLM')
    parser.add_argument('--model', required=True, help='LLM model to use (e.g., gpt-4o-mini, claude-3.5-haiku)')
    parser.add_argument('--input', default='story_summaries_elections.json', help='Input JSON file with stories')
    
    # Show help if no arguments provided
    if len(sys.argv) == 1:
        parser.print_help()
        return
    
    args = parser.parse_args()
    
    # Load your beat stories
    try:
        with open(args.input) as f:
            stories = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find input file '{args.input}'")
        print("Make sure to update the --input parameter to match your topic file!")
        return

    # Define your schema prompt based on your beat - CUSTOMIZE THIS!
    schema_prompt = """
    {
      "people": ["Korean Americans", "Maryland immigrants", "President Trump"],
      "geographic_focus": "United States",
      "key_institutions": ["Maryland General Assembly", "Trump Administration"],
      "Immigration status": ["legal immigrant", "illegal immigrant", "not legal immigrant", "not mentioned"]
    }
    """

    # Process each story
    enhanced_stories = []
    for i, story in enumerate(stories):
        print(f"Processing {i+1}/{len(stories)}: {story['title']}")
        
        metadata = extract_metadata(story['title'], story['content'], schema_prompt, args.model)
    # Process each story
    enhanced_stories = []
    for i, story in enumerate(stories):
        print(f"Processing {i+1}/{len(stories)}: {story['title']}")
        
        metadata = extract_metadata(story['title'], story['summary'], schema_prompt, args.model)
        
        # Add metadata fields as separate columns instead of nested object
        enhanced_story = story.copy()
        
        # If metadata extraction was successful, add each field separately
        if 'error' not in metadata:
            # Add each metadata field as a top-level column
            for key, value in metadata.items():
                # Convert arrays to JSON strings for storage
                if isinstance(value, list):
                    enhanced_story[f'metadata_{key}'] = json.dumps(value)
                else:
                    enhanced_story[f'metadata_{key}'] = value
        else:
            # If there was an error, add error information
            enhanced_story['metadata_error'] = metadata.get('error', 'Unknown error')
            
        enhanced_stories.append(enhanced_story)
        
        # Be respectful to the API
        time.sleep(1)

    # Save the enhanced collection
    with open('enhanced_beat_stories.json', 'w') as f:
        json.dump(enhanced_stories, f, indent=2)

    print(f"Processed {len(enhanced_stories)} stories with metadata")

if __name__ == "__main__":
    main()