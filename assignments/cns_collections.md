# CNS Collections

Beat reporting is the backbone of journalism - reporters who specialize in covering specific topics, institutions, or geographic areas over time. Capital News Service has covered many beats over the years, from Maryland state politics to environmental issues to local government.

### Getting Started

What we're going to do is create a collection of stories from a specific beat, add structured metadata, and try to better understand the patterns and relationships within that coverage. This will help you see how beat reporting should create a network of stories, sources, and themes. Finally, we'll create a prototype beat book!

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called cns_collections using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "CNS Collections - [Your Beat Name]" and today's date at the top, then save it

### Setup

Install the llm-anthropic plugin and set your Claude API key value if you haven't already.

```bash
uv run llm install llm-anthropic
# check to see if you have the key set
uv run llm keys
# if not, set it
uv run llm keys set anthropic
```

### Choose Your Beat

First, you need to pick a topic to focus on. Let's look at the available topics:

```bash
# See the available topic categories
cat ../../data/new_topics.csv
```

### Find Your Stories

Now you need to identify and collect stories from your chosen beat using the `story_summaries.json` file. Each story in this file has a `topic` field that corresponds to one of the topics from `new_topics.csv`.

First, let's see what topics are available and how many stories are in each:

```bash
# Count stories by topic
uv run sqlite-utils memory ../../data/story_summaries.json \
  "SELECT topic, COUNT(*) as story_count 
   FROM story_summaries 
   GROUP BY topic 
   ORDER BY story_count DESC" --csv
```

Choose a topic from the list that has a good number of stories (aim for at least 50). Then query for all stories in that topic and save them to a JSON file named after your topic. Use this as a template:

```bash
# Save all stories for your chosen topic
# Replace 'Elections' with your actual topic name as it appears in the data
uv run sqlite-utils memory ../../data/story_summaries.json \
  "SELECT * FROM story_summaries 
   WHERE topic = 'Elections'" \
  --json-cols > story_summaries_elections.json
```

**Examples for other topics:**

```bash
# For Maryland Government & Politics:
uv run sqlite-utils memory ../../data/story_summaries.json \
  "SELECT * FROM story_summaries 
   WHERE topic = 'Maryland Government & Politics'" \
  --json-cols > story_summaries_maryland_government_politics.json

# For Education:
uv run sqlite-utils memory ../../data/story_summaries.json \
  "SELECT * FROM story_summaries 
   WHERE topic = 'Education'" \
  --json-cols > story_summaries_education.json

# For Baltimore:
uv run sqlite-utils memory ../../data/story_summaries.json \
  "SELECT * FROM story_summaries 
   WHERE topic = 'Baltimore'" \
  --json-cols > story_summaries_baltimore.json
```

Verify your results:

```bash
# Check how many stories you got
uv run jq 'length' story_summaries_elections.json

```

Document in `notes.md`:
- What topic did you choose?
- How many stories are in your topic?

### Design Your Metadata Schema

Since the `story_summaries.json` file already had AI-generated summaries, you'll enhance your chosen topic stories with beat-specific metadata. Design a consistent schema that will help you understand your beat's ecosystem:

**Required Fields (all beats should have these):**
- **people**: Array of key people mentioned (names only)
- **geographic_focus**: Primary location (county, city, region, or "statewide")
- **key_institutions**: Organizations, agencies, companies involved

You should add any other metadata that you think would be useful. Be sure to describe what and why in `notes.md`.

### Add Metadata with LLM Assistance

Now you'll use the LLM to help extract and standardize metadata from the story summaries and titles. Create a Python script called `add_metadata.py`:

```bash
touch add_metadata.py
```

And paste the following in it:

```python
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
      "people": ["Person Name 1", "Person Name 2"],
      "geographic_focus": "Baltimore City",
      "key_institutions": ["Maryland General Assembly", "Department of Environment"],
      "beat_specific_field": "value"
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
```

**Important**: Customize the `schema_prompt` variable for your specific beat before running the script. Choose the beat-specific fields that make sense for your topic. And you'll need to pick your model. You can choose any model you have access to, but generally it should be one you've used before. You can run `uv run llm models` to see which ones you have access to.

Run the script with the required arguments:

```bash
# Example usage - replace with your actual input file and preferred model
uv run python add_metadata.py --model gpt-4o-mini --input story_summaries_housing.json

# Or use Claude (if you have the API key set)
uv run python add_metadata.py --model claude-3.5-haiku --input story_summaries_housing.json

# Run without arguments to see help
uv run python add_metadata.py
```

Document any issues in `notes.md`. 

### Load into SQLite Database

Use sqlite-utils to create a database from your enhanced collection:

```bash
# Create database and import your stories
uv run sqlite-utils insert beat_stories.db stories enhanced_beat_stories.json --pk link

# Now the metadata fields are stored as separate columns:
# - metadata_people (JSON array as text)
# - metadata_geographic_focus (text)
# - metadata_key_institutions (JSON array as text)
# - metadata_beat_specific_field (varies by topic)
```

Now you can run browse the data using Datasette

First, install datasette:

```bash
uv add datasette
uv run datasette beat_stories.db
```

### Analysis and Insights

Using facets and filters, explore patterns in your beat (you should facet by array for metadata or tags):

1. **Key Players**: Who appears most frequently?

2. **Geographic Patterns**: Which areas get the most coverage?

3. **Institutional Network**: Which organizations appear in stories?

Do these findings make sense? Document your findings in `notes.md`. What changes would you make to the `add_metadata.py` script to refine the metadata output?

### Make a Prototype Beat Book

Take your `enhanced_beat_stories.json` file and `notes.md` evaluation and create a prompt that produces a guide for a reporter assigned to cover stories on that topic. Put that prompt in a file called `prompt.txt`. You can be as detailed as you like in the prompt, and you can revise and re-run it. You will choose the model and replace "REPLACE WITH YOUR MODEL" below with it and then run the command.

```bash
cat prompt.txt enhanced_beat_stories.json | uv run llm -m REPLACE WITH YOUR MODEL > prototype.md
```

### Evaluation

Conclude your `notes.md` with reflection on:

- What did the structured metadata reveal about this beat?
- Does your `prototype.md` result seem useful? What does it do well and what does it not do well?
- Did you change your prompt, and if so, how? Did that work better?
- What would you do differently with more time or data?

### Submission

When you are finished, add, commit and push your changes:

```bash
git add .
git commit -m "CNS beat collection analysis"
git pull origin main
git push origin main
```

Submit the link to your  `notes.md` in ELMS.
