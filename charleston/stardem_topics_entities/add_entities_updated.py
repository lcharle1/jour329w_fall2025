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

Return only valid JSON with the metadata. If information is not available, use an empty array or null:
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
    parser = argparse.ArgumentParser(description='Add metadata to Star-Democrat stories using LLM')
    parser.add_argument('--model', required=True, help='LLM model to use (e.g., gpt-4o-mini, claude-3.5-haiku, groq-kimi-k2)')
    parser.add_argument('--input', default='stardem_sample.json', help='Input JSON file with stories')
    parser.add_argument('--output', default='enhanced_beat_stories.json', help='Output JSON file')
    
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

    # Define your schema prompt with detailed topic category definitions
    schema_prompt = """
    {
        "people": ["List the first and last names and position and/or title of every interviewed and referenced individuals in the story. This includes government officials, regular citizens, ethnicities, and more. Correctly spell the names and position/title of the individuals as well. Do not incldue new variations of names. Examples: 'Korean Americans', 'Maryland immigrants', 'President Trump', 'Martinez-Hernandez'", "Interim Town Manager", "Coach", "Kristy Marshall", "Kimberly Abner"],
        
        "geographic_focus": ["List the different geographical locations mentioned in the article. Focus on Maryland counties and municipalities from the Eastern Shore and surrounding areas. Include infrastructure names, urban developments, and specific addresses when mentioned.
        
        Maryland Counties to recognize: Dorchester County, Caroline County, Kent County, Queen Anne's County, Talbot County, Prince George's County, Calvert County, Anne Arundel County, Baltimore County, Baltimore City, Howard County, Carroll County, Montgomery County, Frederick County, St. Mary's County, Charles County, Washington County, Somerset County, Allegany County, Cecil County, Worcester County, Wicomico County, Garrett County, Harford County.
        
        Key municipalities include (but are not limited to):
        - Dorchester County: Cambridge, East New Market, Hurlock, Vienna
        - Caroline County: Denton, Federalsburg, Greensboro, Preston, Ridgely
        - Kent County: Chestertown, Rock Hall
        - Queen Anne's County: Centreville, Queenstown, Stevensville, Kent Narrows
        - Talbot County: Easton, Oxford, St. Michaels, Trappe, Tilghman Island
        - And other Maryland locations as mentioned in the story.
        
        Examples: 'United States', 'Maryland', 'Prince George's County', 'Easton', 'Cambridge', 'Dorchester County', 'Route 50', 'Bay Bridge'"],
        
        "key_institutions": ["List the different federal, state, or local organizations, businesses, groups, organizations, and institutions (whether academic, medical or government) involved in the article. Examples: 'Maryland General Assembly', 'Trump Administration', 'Talbot County Public Schools', 'Shore Regional Health'"],
        
        "primary_topic": "Select ONE primary topic that best fits this story from the following categories:
        
        - Art and Music: Stories covering art, music, and other forms of artistic expression. This may include event announcements, performance reviews, artist profiles, and cultural highlights.
        
        - Obituary: Announcements and remembrances acknowledging an individual's death, often including biographical details and community reflections.
        
        - Education: Coverage of local, state, or national education issues, developments, and achievements. Includes K-12, higher education, and related community programs or initiatives.
        
        - News: General news coverage on topics of public interest that are not primarily political in nature. This includes emergencies, urban development, crime, law, and justice, among others. It also encompasses community features and human-interest stories that inform or inspire - such as volunteer efforts, profiles, and local history ('Today in History'). The community events calendar also falls under this category.
        
        - Government and Politics: Coverage of local, state, and national government actions, policies, and political events, including elections, legislation, and civic engagement.
        
        - Sports: Stories covering athletics at all levels, including local, school, collegiate, and national sports. May include game coverage, athlete profiles, and team developments.
        
        - Health: Coverage related to physical and mental health, healthcare systems, nutrition, fitness, wellness trends, government health programs, community health initiatives, and more.
        
        - Economy: Stories focused on financial and economic topics affecting the community. This includes taxation, local government spending and budgeting, grants, business developments, employment, local enterprises, and tourism-related economic activity.
        
        - Environment: Coverage of environmental issues and their impact on local ecosystems, wildlife, pollution, and climate. Unlike agriculture-focused stories, this category emphasizes the relationship between humans and the natural world, including weather events, conservation efforts, and ecological changes.
        
        - Agriculture and Farming: Stories focusing on the business, labor, and production aspects of farming and agriculture. Environmental effects may be noted when relevant, but are not the primary focus.
        
        - Housing and Urban Planning: Coverage of housing issues, urban development, zoning, and infrastructure projects. Includes stories about new construction, renovations, housing policy, and community planning initiatives.
        
        Return only the topic name (e.g., 'Sports', 'Education', etc.)",
        
        "secondary_topic": "Select ONE secondary topic (if applicable) that also fits this story from the same categories listed above. Return only the topic name, or null if no secondary topic applies. Provide an explanation if null.", 
        
        "publication": ["List the publication and the county and city from which the article was published”, “The Star Democrat”, “Cecil Whig”, “Dorchester County”, “Cecil County”, “Anne Arundel County”]
    }
    """
    
    # Process each story
    enhanced_stories = []
    for i, story in enumerate(stories):
        print(f"Processing {i+1}/{len(stories)}: {story['title'][:60]}...")
        
        # Get content for metadata extraction (truncate if too long)
        content = story.get('content', '')[:1000]
        
        metadata = extract_metadata(story['title'], content, schema_prompt, args.model)
        
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
            print(f"  ⚠️  Error: {metadata.get('error', 'Unknown error')}")
            
        enhanced_stories.append(enhanced_story)
        
        # Be respectful to the API
        time.sleep(1)

    # Save the enhanced collection
    with open(args.output, 'w') as f:
        json.dump(enhanced_stories, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Processed {len(enhanced_stories)} stories with metadata")
    print(f"Saved to: {args.output}")

if __name__ == "__main__":
    main()
