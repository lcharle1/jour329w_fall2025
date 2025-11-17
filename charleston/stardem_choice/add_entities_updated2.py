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

Return only valid JSON with the metadata. If information is not available, use an empty array or null.

CRITICAL EXTRACTION INSTRUCTIONS:

1. PEOPLE - Extract EVERY mention of:
   - People, and sometimes their position/title, to extract can be found before the word 'said' or after the punctuations of a closing quote: ' ," '. Extract full names before or after position and/or titles. 
   - Full names (first and last names) exactly as written
   - Their complete titles, positions, or roles
   - Groups of people or demographics (e.g., "Korean Americans", "Maryland immigrants")
   - Do NOT modify spelling or create variations
   - Include prefixes (Dr., Rev., President, etc.) and suffixes (Jr., Sr., III, etc.)
   - Extract names even if mentioned only once in passing

2. GEOGRAPHIC_FOCUS - Extract EVERY location mentioned:
   - Counties (all Maryland counties, especially Eastern Shore)
   - Cities, towns, and municipalities
   - Complete street addresses with numbers, street names, and designations (St., Rd., Ave., Blvd., etc.)
   - Named buildings, parks, geographical or man made landmarks, and infrastructure (auditoriums, rivers, cove, streets, rooms, museum, etc.)
   - Natural features (rivers, bays, islands, coves, etc.)
   - Regional references (Eastern Shore, Western Maryland, etc.)
   - State and national locations if mentioned

3. KEY_INSTITUTIONS - Extract EVERY organization mentioned:
   - Various types of institutions, whether academic, medical, musical, federal, etc., can be found after an individual's full name. Most likely as an introduction. 
   - Full official names of all organizations without abbreviations unless abbreviated in source
   - Schools, universities, and educational institutions
   - Government agencies at all levels (federal, state, local)
   - Businesses and corporations
   - Musical groups and "song troupes" and musical bands. 
   - Non-profit organizations and charities
   - Medical facilities and health organizations
   - Religious institutions
   - Community groups and associations
   - Sports teams and athletic organizations

EXTRACTION RULES:
- Extract metadata EXACTLY as written in the source text - no paraphrasing, no variations
- Include ALL instances, even brief mentions
- Include acronyms and their full name
- Maintain original capitalization and formatting
- Do not combine or consolidate similar entries
- When in doubt, include it rather than exclude it
- Double-check you haven't missed any names, places, or organizations

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
            
            # Strip out <think></think> tags and their content (for models like qwen3-32b)
            import re
            response_text = re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL)
            response_text = response_text.strip()
            
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
    parser.add_argument('--limit', type=int, default=20, help='Maximum number of stories to process (default: 20)')
    
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
    
    # STORY LIMIT FEATURE: Limit the number of stories to process
    # You can change the default limit of 20 by modifying the default value above (line with --limit argument)
    # Or override at runtime using: --limit N (where N is your desired number)
    original_count = len(stories)
    stories = stories[:args.limit]
    if original_count > len(stories):
        print(f"Processing {len(stories)} of {original_count} stories (limited by --limit parameter)")
    else:
        print(f"Processing all {len(stories)} stories")

    # Define your schema prompt with detailed topic category definitions
    schema_prompt = """
    {
        "people": ["Extract EVERY person mentioned in the story with their complete name and title/position. Include: full names (first and last), all titles and positions, demographic groups, prefixes (Dr., Rev., President), and suffixes (Jr., Sr., III). Extract exactly as written - do not modify spelling or create duplicates. Examples: 'Korean Americans', 'Maryland immigrants', 'President Donald Trump', 'Dr. Martinez-Hernandez, Chief Surgeon', 'Interim Town Manager Sarah Johnson', 'Coach Mike Stevens', 'Kristy Marshall', 'Kimberly Abner', 'Meredith Weisel', 'Dale Green', 'Shandell Green', 'Annie Raymond', 'Derich Daly', 'Victoria Gomez', 'Tina Jones', 'Natalie Davis', 'Megan Rosendale', 'Xaala Mainama', 'Marcus Asante', 'Micheal Campbell', 'Edward Garrison Draper', 'Judge', 'Sureme Court Justice', 'Attorney', 'Supreme Court Justice Shirley M. Watts', 'Shirly M/ Watts', 'Z Collins', 'Judge Z Collins', 'David Chase', 'Black applicant', 'white citizen', 'Nace Hopkins','Abraham Lincoln', 'Tywanda Griffin', 'Willie G. Woods', 'Eunice Roberts', 'Kweisi Mfume', 'Sherone Lewis', 'Governor', 'Governor Wes Moore', 'Wes Moore', 'Dr. Yusef Salaam', 'Doctor', 'Ezola Webb', 'Wanda Moloch', 'Moonyene Jackson', 'descendants', 'Frederick Douglass', 'African American', 'Hispanic', 'Asian American', 'Asian', 'African', 'President', 'Savannah Winston', 'Rev.', 'Reverend', 'Mayor', 'Rev. Kobi Little', 'Carl O. Snowden', 'Sen.', 'Senator', 'Johnny Mautz'"],
        
        "geographic_focus": ["Extract EVERY geographical location mentioned in the article. Include: all Maryland counties (especially Eastern Shore: Dorchester, Caroline, Kent, Queen Anne's, Talbot, Somerset, Worcester, Wicomico, Cecil), all cities and towns, complete street addresses with numbers and designations (St., Rd., Ave., Blvd., Lane, Drive, etc.), named buildings and landmarks, parks and natural features, highways and routes, bridges, neighborhoods, and regional references. Extract exactly as written. 
        
        Maryland Counties: Dorchester County, Caroline County, Kent County, Queen Anne's County, Talbot County, Prince George's County, Calvert County, Anne Arundel County, Baltimore County, Baltimore City, Howard County, Carroll County, Montgomery County, Frederick County, St. Mary's County, Charles County, Washington County, Somerset County, Allegany County, Cecil County, Worcester County, Wicomico County, Garrett County, Harford County.
        
        Key municipalities (non-exhaustive): Cambridge, Easton, Denton, Chestertown, Centreville, Oxford, St. Michaels, Federalsburg, Rock Hall, Queenstown, Stevensville, East New Market, Hurlock, Vienna, Greensboro, Preston, Ridgely, Trappe, Tilghman Island, Kent Narrows.
        
        Examples: 'Auditorium', 'Maryland', 'Prince George's County', 'Easton', '123 Main Street', 'Cambridge City Hall', 'Dorchester County', 'Route 50', 'Chesapeake Bay Bridge', 'Choptank River', 'Eastern Shore', 'Downtown Cambridge', 'Chesapeake Bay', 'Annapolis', 'Cambridge', 'Fogg's Cove', 'Miles River', 'College Park', 'Gaza Strip', 'Isreal', 'Baltimore', 'Dartmouth University', 'University', 'Dartmouth', 'United State', 'Mexico', 'Japan', 'Canada', 'Haiti', 'Museum', 'Chesapeake Bay Maritime Museum', 'Denton'"],
        
        "key_institutions": ["Extract EVERY organization, institution, business, and group mentioned in the article. Include: complete official names of all federal/state/local government agencies, schools and universities, businesses and corporations, non-profit organizations, medical facilities, religious institutions, community groups, sports teams, and any other organized entities. Extract full names exactly as written without abbreviations unless abbreviated in source. Examples: 'Maryland General Assembly', 'Trump Administration', 'Talbot County Public Schools', 'Shore Regional Health', 'Cambridge-South Dorchester High School', 'University of Maryland Eastern Shore', 'Dorchester County Council', 'Chesapeake Bay Foundation', 'St. Paul's Episcopal Church', 'Cambridge Main Street', 'Easton Rotary Club', 'Anti-Defamation League's', 'ADL', 'National African American Quilt Guild', 'Regional Folklife Center', 'Union Army', 'United Methodist Church', 'Church', 'NAACP', 'Black church', 'colored school'"],
        
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
        
        - Advice: Stories written as letters, addressed to an editor, columnist, or success coach, where the writer is seeking guidance, shares a dilemma, or reflects on a personal situation. The narratives centers on problems, decisions, or emotional/physical conflicts. Typically these are written in a first person, confessional style. 
        
        Return only the topic name (e.g., 'Sports', 'Education', etc.)",
        
        "secondary_topic": "Select ONE secondary topic (if applicable) that also fits this story from the same categories listed above. Return only the topic name, or null if no secondary topic applies. Provide an explanation if null.", 
        
        "publication": ["Extract the publication and the county and city from which the article was published”, “The Star Democrat”, “Cecil Whig”, “Dorchester County”, “Cecil County”, “Anne Arundel County”]
        
        "tags":["List at least three relevant and cohesive tags for the story]
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
            
            # Update llm_classification_meta to reflect the current model used
            enhanced_story['llm_classification_meta'] = {
                "model": args.model,
                "llm_failed": False
            }
        else:
            # If there was an error, add error information
            enhanced_story['metadata_error'] = metadata.get('error', 'Unknown error')
            print(f"  ⚠️  Error: {metadata.get('error', 'Unknown error')}")
            
            # Update llm_classification_meta to show the error
            enhanced_story['llm_classification_meta'] = {
                "model": args.model,
                "llm_failed": True
            }
            
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
