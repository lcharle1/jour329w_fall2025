# Star-Democrat: Your Choice

In this assignment, you'll choose your own path forward with the Star-Democrat data. You can either refine entity extraction to create better source materials for beat books, or begin experimenting with generating draft beat books using the topic and entity metadata you've already created. Both paths involve experimentation and iteration; the goal is to learn what works, not to achieve perfection.

### Setup

Update from upstream: 

```{bash}
git fetch upstream
git merge upstream/main
```

### Getting Started

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name
2. Create a directory called `stardem_choice` using mkdir
3. cd into that new directory
4. Create a file called `notes.md` using touch and open it
5. Put "Star-Democrat Choice Assignment" and today's date at the top, then save it

### Choose Your Path

You have two options for this assignment. Read both carefully before deciding:

## Option 1: Refine Entity Extraction

Improve entity extraction quality through systematic prompt engineering and model comparison.

This path is for you if:
- You want to improve your entity extraction before moving forward
- You're interested in understanding how different prompts and models affect metadata generation
- You think you still have work to do to create the best possible source material for future beat books

### What You'll Do

1. **Choose your starting point**: Use a topic-specific JSON file from `data/stardem_topics/` or continue with a file you've already worked with

2. **Copy your entity extraction script**:
```bash
cp ../stardem_topic_entities/add_entities.py add_entities.py
```

3. **Run systematic experiments**: Create at least 3 different versions by varying:
   - **Prompts**: Try different instructions, examples, or emphasis
   - **Models**: Compare different Groq models
   - **Filtering**: Exclude certain story types or focus on specific characteristics
   - **Entity definitions**: Change what counts as an important entity

4. **Document everything**: In your `notes.md`, record:
   - Each prompt variation (copy the full prompt)
   - Which model you used for each run
   - Your hypothesis about what would improve
   - What actually happened

5. **Compare results systematically**:
```bash
# Create database with all versions
uv run sqlite-utils insert entities.db stories_v1 stories_with_entities_v1.json --pk docref
uv run sqlite-utils insert entities.db stories_v2 stories_with_entities_v2.json --pk docref
uv run sqlite-utils insert entities.db stories_v3 stories_with_entities_v3.json --pk docref

# Launch Datasette
uv run datasette entities.db
```

### Approved Models for Option 1:
- groq/openai/gpt-oss-20b
- groq/openai/gpt-oss-120b
- groq/meta-llama/llama-4-maverick-17b-128e-instruct
- groq/moonshotai/kimi-k2-instruct-0905
- groq/qwen/qwen3-32b (if you use this one, you'll need to have Copilot strip out content contained in <think></think> tags)

### Key Questions to Address (Option 1):

In your `notes.md`, create sections for:

#### Experiment Design
- What specific aspects did you vary in each version?
- What were your hypotheses about what would improve results?
- Why did you choose these particular variations?

#### Comparative Analysis
- Which version produced the best results overall? Why?
- Were there specific categories (people/places/organizations) where one version excelled?
- Did any version have unexpected strengths or weaknesses?
- How consistent were entity names across versions?

#### Prompt Engineering Insights
- What prompt elements had the biggest impact on quality?
- Did adding examples help? What kind of examples worked best?
- How specific should instructions be?
- What caused the LLM to make mistakes?

#### Final Recommendations
- If you were creating a beat book, which version would you use?
- What's your recommended prompt and model combination?
- What remaining issues need to be addressed?

---

## Option 2: Generate Draft Beat Books

**Goal**: Experiment with using topic and entity metadata to generate draft beat book content.

This path is for you if:
- You're ready to start creating actual beat book content
- You want to explore what's possible with LLMs for long-form writing
- You're curious about how metadata can guide content generation

### What You'll Do

1. **Gather your materials**: You'll need:
   - A topic-specific JSON file with stories from `data/stardem_topics/`
   - Entity-enriched stories (you may want to add them to another topic that is related, and then include those stories)

2. **Create a beat book generation script**:
```bash
touch generate_beatbook.py
```

3. **Design your approach**: Your script should:
   - Read the entity-enriched stories for your chosen topic
   - Use an LLM to generate beat book sections based on that metadata
   - Save generated content to markdown files

4. **Experiment with different inputs**: Try generating content using:
   - Just entity lists (people, places, organizations)
   - Entity lists + story titles
   - Entity lists + story summaries
   - Full story content with entity highlights
   - Aggregated entity information (top 10 people, key organizations, etc.)

5. **Try different prompts**: Experiment with asking the LLM to generate:
   - Source profiles (who are the key people in this beat?)
   - Organization overviews (what institutions matter here?)
   - Story opportunity lists (what should a reporter cover?)
   - Background briefings (what context does a reporter need?)
   - Contact lists (who should a reporter know?)

### Approved Models for Option 2:
- groq/openai/gpt-oss-20b
- groq/openai/gpt-oss-120b
- groq/meta-llama/llama-4-maverick-17b-128e-instruct
- groq/moonshotai/kimi-k2-instruct-0905
- groq/qwen/qwen3-32b (if you use this one, you'll need to have Copilot strip out content contained in <think></think> tags)

### Example Script Structure:

```python
import json
import subprocess

def generate_beatbook_section(entities, stories_sample, prompt_type, model):
    """Generate a beat book section based on entities and stories."""
    
    if prompt_type == "source_profiles":
        prompt = f"""Based on these news stories about [TOPIC], create profiles of the 5 most important sources a reporter should know.

Key people mentioned: {entities['top_people']}
Key organizations: {entities['top_organizations']}
Sample story titles: {stories_sample}

For each source, provide:
- Name and title
- Why they matter to this beat
- What topics they can speak to
- Contact approach recommendations

Write in a concise, professional style suitable for a reporter's reference guide.
"""
    
    elif prompt_type == "story_opportunities":
        prompt = f"""Based on this beat's coverage patterns, suggest 10 story ideas a reporter should pursue.

Coverage analysis:
- Key people: {entities['top_people']}
- Key places: {entities['top_places']}
- Key organizations: {entities['top_organizations']}
- Recent story themes: {stories_sample}

For each story idea, provide:
- Story angle/headline
- Why it matters
- Who to interview
- What data/documents to get

Focus on enterprise stories, not breaking news.
"""
    
    # Add more prompt types as you experiment
    
    result = subprocess.run(
        ['llm', '-m', model, prompt],
        capture_output=True,
        text=True,
        check=True
    )
    
    return result.stdout.strip()

def main():
    # Load entity-enriched stories
    with open('stories_with_entities.json') as f:
        stories = json.load(f)
    
    # Aggregate entity information
    entities = aggregate_entities(stories)
    
    # Generate different sections
    sections = {
        'source_profiles': generate_beatbook_section(entities, stories[:10], 'source_profiles', model),
        'story_opportunities': generate_beatbook_section(entities, stories[:10], 'story_opportunities', model),
        # Add more sections
    }
    
    # Save to markdown
    save_beatbook(sections, 'beatbook_draft_v1.md')

# Implement helper functions
```

### Key Questions to Address (Option 2):

In your `notes.md`, address the following:

#### Experimental Design
- What input combinations did you test (entities only, entities + summaries, etc.)?
- How did you structure your prompts?
- If you used Copilot, include the full conversation

#### Generation Quality Assessment
- Which types of content generated well? Which didn't?
- How accurate was the generated content compared to the source stories?
- Did the LLM hallucinate information not in the stories?

#### Input Effectiveness
- Did providing just entities work, or did you need story content too?
- How much context did the LLM need to generate useful content?
- Did entity lists help focus the generation?
- What was the optimal amount of input to provide?

#### Model Comparison
- Did you try multiple models? How did they differ?
- Which model produced the most useful beat book content?
- Were certain models better for specific types of sections?

#### Beat Book Utility
- What sections worked best for a beat book?
- What would need human editing or verification?
- What's missing?

#### Lessons Learned
- What surprised you about LLM-generated beat book content?
- What's the best use case for automated beat book generation?
- Where does human judgment remain essential?
- How would you improve your approach?

---

## Shared Requirements (Both Options)

Regardless of which path you choose:

### Documentation Requirements

Your `notes.md` must include:

1. **Choice Justification**: Why did you choose this path?
2. **Process Documentation**: 
   - Step-by-step record of what you tried
   - All prompts you tested (full text)
   - All models you used
   - Command line invocations you ran
3. **GitHub Copilot Conversation**: If you used Copilot, paste the entire conversation
4. **Results Analysis**: Detailed answers to your option's key questions
5. **Examples**: 
   - Option 1: Show comparison of how 2-3 specific stories were processed differently
   - Option 2: Include the best examples of generated content
6. **Reflection**: What did you learn? What would you do differently?

### Technical Requirements

- Use `--limit` argument to test with small samples first (5-10 stories)
- Version your output files (v1, v2, v3, etc.)
- Use Datasette to explore results (Option 1) or files to review content (Option 2)
- Document all errors or unexpected behaviors

### Install Required Tools

```bash
uv run llm install llm-groq
uv run llm keys get groq  # Check if you have a key
# If needed: uv run llm keys set groq
```

## Submission

When finished:

```bash
git add .
git commit -m "Star-Democrat choice"
git pull origin main  
git push origin main
```

Your `stardem_choice` directory should contain:

**For Option 1:**
- `notes.md` with complete documentation
- `add_entities.py` (your script)
- `stories_with_entities_v1.json`, `v2.json`, `v3.json` (at least 3 versions)
- `entities.db` (your comparison database)
- Original topic JSON file (optional)

**For Option 2:**
- `notes.md` with complete documentation
- `generate_beatbook.py` (your generation script)
- `beatbook_draft_v1.md`, `v2.md`, etc. (generated content in markdown)
- `stories_with_entities.json` (your input data)
- Original topic JSON file (optional)

Submit the link to your `stardem_choice` directory in ELMS.