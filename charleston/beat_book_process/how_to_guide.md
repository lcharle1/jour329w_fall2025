# How-To Guide: Creating a Beat Book Using LLMs
*A guide for journalism students following in my footsteps*

---

## Table of Contents
1. [Introduction](#introduction)
2. [Phase 1: Topic Classification](#phase-1-topic-classification)
3. [Phase 2: Entity Extraction](#phase-2-entity-extraction)
4. [Phase 3: Creating a Filtered Dataset](#phase-3-creating-a-filtered-dataset)
5. [Phase 4: Drafting the Beat Book](#phase-4-drafting-the-beat-book)
6. [Phase 5: Final Output Formats](#phase-5-final-output-formats)
7. [Key Commands Reference](#key-commands-reference)
8. [Lessons Learned: Successes & Failures](#lessons-learned-successes--failures)
9. [Final Recommendations](#final-recommendations)

---

## Introduction

This guide walks you through the complete process of creating an AI-assisted Beat Book for early-career journalists. The process involves classifying news stories by topic, extracting metadata (people, places, institutions), filtering the dataset, and generating a comprehensive Beat Book using Large Language Models (LLMs).

**Project Focus:** Health and Public Safety Beat in Talbot County, Maryland (Eastern Shore)

**Tools Used:**
- Python with `uv` package manager
- `llm` command-line tool for interacting with LLMs
- `sqlite-utils` and Datasette for database exploration
- Various Groq models (kimi-k2, qwen3-32b, gpt-oss-120b, etc.)
- GitHub Copilot for development assistance

### Key Concepts

**API Key:** An API (Application Programming Interface) key is like a password that allows your scripts to communicate with external services like Groq's LLM servers. When you run commands that use AI models, your API key authenticates you and tracks your usage. Without a valid API key, you'll get errors like "Invalid API Key" and all your stories will be labeled "Uncategorized." You set your API key once using `uv run llm keys set groq` and it's stored securely on your machine. Keep your API key private—never share it or commit it to GitHub, as others could use your account and potentially rack up charges.

**Embeddings:** Embeddings are a way of representing text (words, sentences, or entire documents) as numerical vectors—essentially lists of numbers that capture the meaning of the text. Think of it like converting words into coordinates on a map: words with similar meanings end up close together. In this project, embeddings help with semantic search—finding stories that are conceptually related even if they don't share exact keywords. For example, a search for "drug crisis" might find stories about "opioid overdoses" or "fentanyl deaths" because their embeddings are mathematically similar. The embedding map we used earlier in the semester visualized these relationships, showing clusters of related stories.

---

## Phase 1: Topic Classification

### Goal
Automatically classify news stories into topic categories using an LLM.

### Process

1. **Set up your classification script** (`classify_topics.py`):
   - The script reads stories from a JSON file
   - Sends each story's title and content to an LLM
   - Asks the LLM to assign topic categories
   - Saves results to a classified JSON file

2. **Run the classification**:
```bash
uv run python classify_topics.py
```

### ⚠️ Warning: API Key Issues
I ran into an error where every story was labeled as "Uncategorized." The issue was an **invalid API key**. Make sure your Groq API key is properly set:
```bash
uv run llm keys set groq
```

### ✅ Success: Topic Categories
The LLM was able to identify categories like:
- Government
- Sports
- Education
- Health
- Crime
- Local Government
- Public Safety

### ❌ Failure: Over-Specific Topics
The LLM created topics that were **too specific or redundant**. For example:
- "Voter Turnout" and "Election 2024" should just be "Elections"
- "Crime" and "Hit-and-Run" listed separately when they could be combined
- Obituaries spelled as both "obituaries" and "obituary"

**My Recommendation:** Provide the LLM with a predefined list of topic categories. Option 2 (providing a topic list) works better than letting the LLM create topics freely.

---

## Phase 2: Entity Extraction

### Goal
Extract structured metadata from stories: people, locations, institutions, and more.

### The Script
Use `add_entities_updated2.py` to extract metadata from your stories.

### Basic Command
```bash
uv run python add_entities_updated2.py --model [MODEL] --input [YOUR_FILE].json
```

### Example with Groq Qwen model:
```bash
uv run python add_entities_updated2.py --model groq/qwen/qwen3-32b --input Race_Diversity.json
```

### Storing Results in SQLite
```bash
# Create database and add first version
uv run sqlite-utils insert stardem_entities.db stories_4 stories_with_entities_4.json --pk docref

# Add subsequent versions to same database
uv run sqlite-utils insert stardem_entities.db stories_5 stories_with_entities_5.json --pk docref
uv run sqlite-utils insert stardem_entities.db stories_6 stories_with_entities_6.json --pk docref

# Launch Datasette to explore
uv run datasette stardem_entities.db
```

### ⚠️ Warning: JSON Parsing Errors
I encountered this error on story 14:
> `Extra data: line 27 column 1 (char 466)`

**What it means:** The LLM returned valid JSON followed by extra text or commentary. The parser read the JSON but found additional data after it.

**Common causes:**
- The LLM added explanatory text after the JSON
- The LLM included multiple JSON objects instead of one
- Markdown formatting wasn't completely stripped

**Fix:** The script handles this by removing markdown code blocks, but if you use models like `qwen3-32b`, you need to strip `<think></think>` tags:
```python
# Strip think tags from response
response = re.sub(r'<think>.*?</think>', '', response, flags=re.DOTALL)
```

### ⚠️ Warning: Wrong Model Listed in Database
I noticed the `llm_classification_meta` column showed `gpt-oss:120b` even when I was using a different model. This column came from the **input file**, not my current script.

**Fix:** Update the script to reflect the actual model being used:
```python
enhanced_story['llm_classification_meta'] = {
    "model": args.model,
    "llm_failed": False
}
```

### ❌ Failure: Missing People, Locations, and Institutions
Despite multiple trials with different models and prompts, the LLM consistently missed:
- Interview subjects (people quoted with "said")
- Specific geographic landmarks (rivers, coves, auditoriums)
- Complete institutional names

**Example:** For a story about antisemitic incidents, the LLM extracted President Biden (mentioned in passing) but missed Meredith Weisel, the ADL regional director who was actually interviewed.

### ✅ Success: Iterative Improvement Through Examples
After providing more specific examples in the prompt, the LLM found broader mentions like:
- "Black sailors" and "captive Africans" (communities, not just individual names)
- More accurate geographic references

### Model Comparison Results

| Model | Strengths | Weaknesses |
|-------|-----------|------------|
| `groq/moonshotai/kimi-k2-instruct-0905` | No empty rows, consistent output | Quality could be improved |
| `groq/qwen/qwen3-32b` | Better quality responses | Sometimes misses specific names |
| `groq/openai/gpt-oss-120b` | Good detail, professional output | Can miss interview subjects |
| `groq/meta-llama/llama-4-maverick-17b-128e-instruct` | Fast processing | Similar quality issues |

**Best Overall:** Trial 3 with `groq/moonshotai/kimi-k2-instruct-0905` - no empty rows and substantial responses.

---

## Phase 3: Creating a Filtered Dataset

### Goal
Create a manageable subset of stories for your Beat Book.

### Combining Topic Files
```bash
uv run jq -s 'add' ../../data/stardem_topics/Public_Safety.json ../../data/stardem_topics/Health.json ../../data/stardem_topics/Local_Government.json > source_stories.json
```

### ⚠️ Warning: Context Length Exceeded
Large datasets will fail with this error:
> `Please reduce the length of the messages or completion.`

**Fix:** Limit your sample size. Through testing, I found:
- **10 stories:** Minimum (works but too little context)
- **50 stories:** Sweet spot for most models
- **100 stories:** Too large for most Groq models

### Creating a Random Sample
```bash
# Random sample of 50 stories
uv run sqlite-utils query stardem_entities.db \
  "SELECT * FROM stories ORDER BY RANDOM() LIMIT 50" \
  --json-cols > filtered_stories.json
```

### Filtering by Content
```bash
# Filter by keyword (e.g., stories mentioning Cambridge)
uv run sqlite-utils query stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY RANDOM() LIMIT 50" \
  --json-cols > filtered_stories.json
```

### ⚠️ Warning: UnicodeDecodeError
If you see:
> `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xab in position 31`

**Fix:** Use `sqlite-utils query` instead of `sqlite-utils memory` for existing databases.

---

## Phase 4: Drafting the Beat Book

### Goal
Generate a comprehensive Beat Book from your filtered stories.

### Basic Command
```bash
cat prompt.txt filtered_stories.json | uv run llm -m [MODEL] > prototype_v[#].md
```

### Example
```bash
cat prompt.txt filtered_stories.json | uv run llm -m groq/openai/gpt-oss-120b > prototype_v8.md
```

### Prompt Engineering Insights

#### ✅ Success: What Worked
1. **Specific examples** - The more specific names/locations/institutions you include as examples, the better the output
2. **Narrative instruction style** - Framing the Beat Book as a "training guide" or "instruction manual" improved quality
3. **Professional tone emphasis** - Explicitly requesting professional tone eliminated overly casual language

#### ❌ Failure: What Didn't Work
1. **Casual tone by default** - Early prototypes had an unprofessional, overly casual tone ("Hey—congrats and condolences")
2. **Other counties included** - Despite specifying Talbot County, Caroline County kept appearing
3. **Missing statistics** - The Beat Books lacked supporting statistics from the stories

### Prompt Fixes to Make

Add these to your prompt:
- "Use only references to Talbot County and its municipalities: Easton, Oxford, Queen Anne, St. Michaels, and Trappe"
- "Include statistics from stories to support the text"
- "Include key people who were interviewed or are engaged with relevant organizations"
- "Offer more description on what each institution provides and does"

### Sample Size Impact

| Sample Size | Result |
|-------------|--------|
| 10 stories | Works but results are very specific to those stories |
| 50 stories | Good balance - more generalized but still detailed |
| 100 stories | Too large - context length errors with most models |

### ❌ Failure: Casual Tone
My first prototypes read like a casual blog post:
> "Hey—congrats and condolences. You just landed one of the most interesting, emotionally heavy, and source-driven beats..."

**Fix:** Add explicit tone instructions to your prompt: "Use a professional, instructive tone suitable for a training manual."

### ✅ Success: Detailed Prototypes with gpt-oss-120b
Prototype 8 with `groq/openai/gpt-oss-120b` produced:
- Detailed stakeholder lists with names
- "Competing viewpoints" section
- Clear organization with caveats highlighted
- References to source articles with dates
- Quick Reference Checklist

---

## Phase 5: Final Output Formats

### Format Options Explored

#### 1. Traditional Markdown Beat Book
**Result:** ✅ Success with `groq/openai/gpt-oss-120b`
- Best for detailed, narrative content
- Easy to read and reference
- Works well as a training manual

#### 2. Learning App / Interactive Format
**Result:** ❌ Unsuccessful
- LLM provided instructions on HOW to create an app rather than the content itself
- When using Copilot, produced only a one-question quiz with limited content

#### 3. Pitch Deck Style
**Result:** Partial success
- Good for quick overviews
- Lacked the depth and detail of narrative format
- Missing visual elements

#### 4. Web Application (Final Project)
**Result:** ✅ Success with simple approach

**What Worked:**
I used the most basic prompt possible:
> "Using filtered_stories3.json, create a webpage explaining the recurring themes in concerns/issues mentioned in the stories, key people, key institutions, and key locations. For the key people, include a directory of the people and ways to contact them."

Then I **iteratively added features** step by step:
1. Basic content → Table of contents → Statistics → Word cloud → Styling

**Key Insight:** Start small and build up. Asking for too much at once leads to failure.

### ⚠️ Warning: JavaScript Errors in Web Apps
Common issues:
- `Cannot read properties of undefined (reading 'forEach')` - Data not loading properly
- Word cloud features caused cascading errors

**Fix:** When complex features break, ask Copilot to remove them and start simpler.

---

## Key Commands Reference

### Topic Classification
```bash
uv run python classify_topics.py
```

### Entity Extraction
```bash
uv run python add_entities_updated2.py --model groq/qwen/qwen3-32b --input [FILE].json
```

### Database Operations
```bash
# Insert data
uv run sqlite-utils insert [database].db [table_name] [file].json --pk docref

# Query data
uv run sqlite-utils query [database].db "SELECT * FROM [table] LIMIT 50" --json-cols > output.json

# Launch explorer
uv run datasette [database].db
```

### Beat Book Generation
```bash
cat prompt.txt filtered_stories.json | uv run llm -m [MODEL] > prototype_v[#].md
```

### Recommended Models
| Use Case | Recommended Model |
|----------|-------------------|
| Entity Extraction | `groq/moonshotai/kimi-k2-instruct-0905` |
| Beat Book Generation | `groq/openai/gpt-oss-120b` |
| Quick Testing | `groq/qwen/qwen3-32b` |

---

## Lessons Learned: Successes & Failures

### 🎯 Key Successes

1. **Start Simple, Build Up**
   - My successful web application started with a basic prompt and expanded feature by feature
   - Asking for everything at once led to failures

2. **Model Selection Matters**
   - `groq/openai/gpt-oss-120b` produced the most professional, detailed Beat Books
   - Different models excel at different tasks

3. **Examples Improve Output**
   - Adding specific names, locations, and institutions as examples dramatically improved extraction
   - The LLM needs to see patterns to replicate them

4. **Sample Size Sweet Spot**
   - 50 stories provides good balance between context and manageability
   - Too few = too specific; too many = context errors

5. **Iterative Refinement Works**
   - Each prototype built on lessons from the previous one
   - Trial 3 was actually best because it had no empty rows

### ⚠️ Key Failures & Warnings

1. **Give and Take Trade-offs**
   - When one metadata category improved, others often regressed
   - No single configuration was perfect for all categories

2. **LLMs Miss Interview Subjects**
   - The LLM often extracted mentioned names but missed people who were actually interviewed
   - Add explicit instructions to find names before "said" or after closing quotes

3. **Geographic Specificity Issues**
   - General locations were captured, but specific landmarks (rivers, coves, rooms) were missed
   - Add examples of the level of specificity you want

4. **Interactive Formats Are Challenging**
   - Learning apps and complex web features often failed
   - Simpler formats (markdown, basic HTML) were more reliable

5. **County Confusion**
   - Even with explicit instructions, other counties kept appearing
   - May need post-processing to filter out unwanted references

6. **Accuracy Requires Verification**
   - Statistics, contact information, and links should all be verified
   - Some phone numbers and emails may not be accurate

---

## Final Recommendations

### For Entity Extraction
1. Use `groq/moonshotai/kimi-k2-instruct-0905` with an improved prompt containing specific examples
2. Be as specific as possible with examples from your actual stories
3. Include instructions to extract interview subjects (look for "said", quote attributions)
4. Accept that there will be trade-offs between categories

### For Beat Book Generation
1. Use `groq/openai/gpt-oss-120b` for the most detailed, professional output
2. Limit your sample to 50 stories to avoid context length issues
3. Include explicit geographic boundaries in your prompt
4. Request statistics, competing viewpoints, and source attributions
5. Frame the output as a "training guide" or "instruction manual"

### For Web Applications
1. Start with the simplest possible prompt
2. Add features one at a time, testing after each addition
3. When something breaks, remove the problematic feature and try a simpler approach
4. Verify all contact information, links, and statistics manually

### General Advice
1. **Document everything** - Keep detailed notes of each trial, model, and prompt variation
2. **Version your outputs** - Save each prototype with a version number
3. **Be patient** - The process requires multiple iterations
4. **Use Copilot strategically** - Great for debugging scripts and adding features incrementally
5. **Trust but verify** - Always fact-check the LLM's output against your source material

---

## Appendix A: My Trial Summary

| Trial | Model | Prompt Changes | Outcome |
|-------|-------|----------------|---------|
| 1 | groq/meta-llama/llama-4-maverick-17b-128e-instruct | Initial extraction rules | Missing people, locations, institutions |
| 2 | groq/moonshotai/kimi-k2-instruct-0905 | Updated geographic, people, institutional metadata | No change in results; model column wrong |
| 3 | groq/moonshotai/kimi-k2-instruct-0905 | Script edits for model tracking | **Best overall** - no empty rows |
| 4 | groq/qwen/qwen3-32b | Added more examples | Some names still missing |
| 5 | groq/qwen/qwen3-32b | Added tagging, more examples | Mixed - found communities but missed individuals |

**Final Choice:** Trial 3's model (`groq/moonshotai/kimi-k2-instruct-0905`) with Trial 5's improved prompt.

---

## Appendix B: LLM Models Reference

| Model | Full Name | Best Use Case | Notes |
|-------|-----------|---------------|-------|
| `groq/openai/gpt-oss-120b` | GPT OSS 120B | Beat Book generation | Produced the most professional, detailed output. Best for narrative Beat Books. |
| `groq/openai/gpt-oss-20b` | GPT OSS 20B | Testing | Smaller version; useful for quick tests but less detailed output. |
| `groq/moonshotai/kimi-k2-instruct-0905` | Kimi K2 Instruct | Entity extraction | **Recommended for extraction.** No empty rows, consistent output. |
| `groq/qwen/qwen3-32b` | Qwen 3 32B | Entity extraction | Good quality but requires stripping `<think></think>` tags from responses. |
| `groq/meta-llama/llama-4-maverick-17b-128e-instruct` | LLaMA 4 Maverick 17B | General purpose | Fast processing; prone to context length errors with larger datasets. |
| `groq/meta-llama/llama-4-scout-17b-16e-instruct` | LLaMA 4 Scout 17B | Topic classification | Alternative for classification tasks. |
| `groq-kimi-k2` | Kimi K2 (alias) | General purpose | Shorthand alias for kimi-k2-instruct model. |

### Model Selection Guide

| Task | Recommended Model | Why |
|------|-------------------|-----|
| Topic Classification | `groq/moonshotai/kimi-k2-instruct-0905` | Consistent categorization |
| Entity Extraction | `groq/moonshotai/kimi-k2-instruct-0905` | No empty rows, reliable output |
| Beat Book (Detailed) | `groq/openai/gpt-oss-120b` | Best narrative quality, professional tone |
| Beat Book (Quick Draft) | `groq/meta-llama/llama-4-maverick-17b-128e-instruct` | Faster, good for iteration |
| Debugging/Testing | `groq/qwen/qwen3-32b` | Fast responses, good for prompt testing |

### Model-Specific Warnings

| Model | Warning |
|-------|---------|
| `groq/qwen/qwen3-32b` | Wraps reasoning in `<think></think>` tags - must be stripped before JSON parsing |
| `groq/openai/gpt-oss-120b` | May add explanatory text after JSON - can cause parsing errors |
| All Groq models | Context length limits - keep input under ~50 stories |
| All models | May return casual tone by default - explicitly request professional tone |

---

## Appendix C: Command Line Reference

### Python Script Execution

| Command | Description |
|---------|-------------|
| `uv run python classify_topics.py` | Run topic classification script on stories |
| `uv run python add_entities_updated2.py --model [MODEL] --input [FILE].json` | Extract metadata (people, places, institutions) from stories |
| `uv run python add_entities_updated2.py --model groq/qwen/qwen3-32b --input Race_Diversity.json` | Example: Extract entities using Qwen model |
| `uv run python add_entities_updated2.py --model [MODEL] --input [FILE].json --output [OUTPUT].json` | Extract entities with custom output filename |
| `uv run python add_entities_updated2.py --model [MODEL] --input [FILE].json --limit 20` | Limit processing to first 20 stories |
| `python3 generate_learning_app.py` | Generate learning app HTML from filtered stories |

### LLM Command Line Tool

| Command | Description |
|---------|-------------|
| `uv run llm -m [MODEL]` | Run LLM with specified model (reads from stdin) |
| `cat prompt.txt filtered_stories.json \| uv run llm -m [MODEL] > prototype_v[#].md` | Generate Beat Book from prompt and stories |
| `uv run llm keys set groq` | Set/update your Groq API key |
| `uv run llm keys get groq` | Check if Groq API key is configured |

### SQLite & Datasette Operations

| Command | Description |
|---------|-------------|
| `uv run sqlite-utils insert [DB].db [TABLE] [FILE].json --pk docref` | Insert JSON data into SQLite database |
| `uv run sqlite-utils query [DB].db "SELECT * FROM [TABLE]" --json-cols` | Query database and output JSON |
| `uv run sqlite-utils query [DB].db "SELECT * FROM [TABLE] ORDER BY RANDOM() LIMIT 50" --json-cols > output.json` | Get random sample of 50 stories |
| `uv run sqlite-utils query [DB].db "SELECT * FROM [TABLE] WHERE content LIKE '%keyword%'" --json-cols` | Filter stories by keyword |
| `uv run datasette [DB].db` | Launch Datasette web interface to explore database |

### JSON Processing with jq

| Command | Description |
|---------|-------------|
| `uv run jq -s 'add' file1.json file2.json file3.json > combined.json` | Combine multiple JSON files into one |
| `cat file.json \| jq '.[0] \| keys'` | Show keys of first object in JSON array |
| `cat file.json \| jq '.[0].field_name'` | Extract specific field from first object |
| `cat file.json \| jq -r 'to_entries \| .[] \| "\(.key + 1): \(.value.title)"' \| head -20` | List first 20 story titles with numbers |

### Database Creation Examples

```bash
# Create database from first version
uv run sqlite-utils insert stardem_entities.db stories_4 stories_with_entities_4.json --pk docref

# Add subsequent versions to same database
uv run sqlite-utils insert stardem_entities.db stories_5 stories_with_entities_5.json --pk docref
uv run sqlite-utils insert stardem_entities.db stories_6 stories_with_entities_6.json --pk docref
uv run sqlite-utils insert stardem_entities.db stories_7 stories_with_entities_7.json --pk docref
uv run sqlite-utils insert stardem_entities.db stories_8 stories_with_entities_8.json --pk docref

# Launch Datasette to explore
uv run datasette stardem_entities.db
```

### Beat Book Generation Examples

```bash
# Generate Beat Book with GPT OSS 120B (recommended for final version)
cat prompt.txt filtered_stories.json | uv run llm -m groq/openai/gpt-oss-120b > prototype_v8.md

# Generate Beat Book with Kimi K2 (good for drafts)
cat prompt.txt filtered_stories.json | uv run llm -m groq/moonshotai/kimi-k2-instruct-0905 > prototype_v1.md

# Generate Beat Book with LLaMA 4 Maverick (fast iteration)
cat prompt.txt filtered_stories.json | uv run llm -m groq/meta-llama/llama-4-maverick-17b-128e-instruct > prototype_v6.md
```

### Filtered Dataset Creation Examples

```bash
# Combine topic files
uv run jq -s 'add' ../../data/stardem_topics/Public_Safety.json ../../data/stardem_topics/Health.json ../../data/stardem_topics/Local_Government.json > source_stories.json

# Random sample of 50 stories (recommended size)
uv run sqlite-utils query stardem_entities.db "SELECT * FROM stories ORDER BY RANDOM() LIMIT 50" --json-cols > filtered_stories.json

# Random sample of 100 stories (may cause context length errors)
uv run sqlite-utils query stardem_entities.db "SELECT * FROM stories ORDER BY RANDOM() LIMIT 100" --json-cols > filtered_stories.json

# Filter by location keyword
uv run sqlite-utils query stories.db "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY RANDOM() LIMIT 50" --json-cols > filtered_stories.json
```

### Troubleshooting Commands

| Command | Description |
|---------|-------------|
| `cat file.json \| jq '.[13]' \| grep -A 2 "metadata_error"` | Check error on specific story (story 14 = index 13) |
| `uv run llm -m groq-kimi-k2 "Test prompt"` | Test if LLM is working with simple prompt |
| `ls -lh` | List files with sizes to check output |

---

*This guide was created based on the Fall 2025 JOUR329W course project at the University of Maryland.*
