# Star-Democrat Draft Beat Book

The goal of this assignment is to produce a draft beat book from Star-Democrat articles, building on the metadata and entity extraction work you've done in previous assignments. A beat book is a guide for reporters covering a specific topic - it introduces key people, institutions, issues, patterns, and story ideas. Your job is to experiment with different formats and approaches to create the most useful resource possible.

### Getting Started

Update from upstream:

```bash
git fetch upstream
git merge upstream/main
```

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called `stardem_draft` using mkdir
3. cd into that new directory
4. Create a file called `notes.md` using touch and open it
5. Put "Star-Democrat Draft Beat Book" and today's date at the top, then save it

### Choose Your Approach

You have several options for selecting your source material:

**Option 1: Single Topic**
Choose one topic from `data/stardem_topics/` that has rich, well-structured content. This works well if your topic has strong entity extraction results and clear patterns.

**Option 2: Combined Topics**
Combine multiple related topics to create a broader beat. For example:
- Local government + Education = "Public Institutions"
- Environment + Aquaculture + Agriculture = "Natural Resources"
- Arts_Culture + Entertainment = "Community Life"
- Health + Public_Safety = "Community Wellbeing"

**Option 3: Filtered/Refined Collection**
Start with one or more topics, then filter based on metadata you've added:
- Stories from specific locations (e.g., only Cambridge or Easton)
- Stories featuring certain types of institutions
- Stories within a date range
- Stories with specific entity patterns

Document your choice in `notes.md`:
- What topic(s) did you choose?
- Why this combination?
- What makes this a coherent beat?

### Prepare Your Source Material

Copy your chosen topic file(s) to your working directory:

```bash
# Single topic
cp ../../data/stardem_topics/Local_Government.json source_stories.json

# Or combine multiple topics using jq
uv run jq -s 'add' ../../data/stardem_topics/Environment.json ../../data/stardem_topics/Aquaculture.json > source_stories.json
```

If you want to filter or refine your collection, you can use sqlite-utils:

```bash
# Load into database
uv run sqlite-utils insert stories.db stories source_stories.json --pk docref

# Filter and export (example: only Cambridge stories)
uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%'" \
  --json-cols > filtered_stories.json

# Or filter by date
uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE date >= '2024-01-01'" \
  --json-cols > recent_stories.json
```

### Design Your Beat Book Format

Before generating content, think about what format would be most useful. Here are some approaches to consider:

**Narrative Guide** (like the CNS Collections assignment)
- Introduces the beat through connected stories and themes
- Explains key institutions, people, and issues in context
- Provides background and connections between topics
- Business casual tone, not just lists

**Reference/Directory Format**
- Organized by category (People, Institutions, Issues, Locations)
- Quick-lookup format with summaries
- More structured, less narrative

**Chronological Story Analysis**
- Traces how coverage has evolved over time
- Identifies emerging trends and recurring themes
- Shows how stories build on each other

**Geographic Beat Book**
- Organized by location (Cambridge, Easton, Talbot County, etc.)
- Helps reporters understand different communities
- Highlights local leaders and institutions

**Issue-Focused Approach**
- Organized by major issues or themes
- Shows different angles and stakeholders for each issue
- Provides context for ongoing debates

Document your format choice in `notes.md` and explain why you think it would be most useful.

### Create Your Prompt

Create a file called `prompt.txt` that will guide the LLM in producing your beat book. Your prompt should describe the format and structure, tone/style, the must-have elements and the audience for this beat book, although with any specific instructions.

Some example prompt starters:

```
# For narrative guide:
Create a comprehensive narrative guide for a reporter covering [TOPIC] on the Eastern Shore. Use the provided stories to introduce key people, institutions, and issues. Organize by major themes rather than alphabetically. Include specific examples from the stories to illustrate patterns. Write in a business casual tone that balances being informative with being readable.

# For reference format:
Create a structured reference guide organized into sections: Key People, Major Institutions, Recurring Issues, and Geographic Areas. For each entry, provide a brief summary and list relevant stories. Make this easy to scan and search.

# For issue-focused:
Analyze the provided stories to identify 5-7 major issues or themes. For each issue, explain the background, identify key stakeholders, describe different perspectives, and suggest story angles. Include specific examples from the coverage.
```

### Generate Your First Prototype

Choose a model that you have access to and that works well for longer-form content. Some good options:

- groq/openai/gpt-oss-20b
- groq/openai/gpt-oss-120b
- groq/meta-llama/llama-4-maverick-17b-128e-instruct
- groq/moonshotai/kimi-k2-instruct-0905
- groq/qwen/qwen3-32b (if you use this one, you'll need to have Copilot strip out content contained in <think></think> tags)

Run your command:

```bash
cat prompt.txt source_stories.json | uv run llm -m YOUR-MODEL-HERE > prototype_v1.md
```

**Important**: This may take a while if you have many stories. Consider starting with a smaller subset (100-200 stories) for your first prototype.

### Evaluate and Iterate

Read through your first prototype carefully. In your `notes.md`, evaluate:

**Strengths:**
- What works well?
- What information is most useful?
- Are the people/institutions accurately represented?
- Does the structure make sense?

**Weaknesses:**
- What's missing?
- What's inaccurate or misleading?
- Is anything repetitive or unnecessary?
- Does the format work for its intended purpose?

**Ideas for improvement:**
- What would you change in the prompt?
- Should you try a different format?
- Do you need to filter or refine your source stories?
- Would a different model produce better results?

### Create Additional Prototypes

Based on your evaluation, create at least one more prototype with significant changes:

1. **Revise your prompt**: Save the new version as `prompt_v2.txt`
2. **Try different approaches**: Maybe split into multiple documents, try a different format, or focus on a subset
3. **Experiment with models**: Different models have different strengths
4. **Adjust your source data**: Filter differently or combine topics differently

Generate your second prototype:

```bash
cat prompt_v2.txt source_stories.json | uv run llm -m YOUR-MODEL-HERE > prototype_v2.md
```

If you want to try additional variations (format without full content, different topics, etc.), create as many prototypes as you want: `prototype_v3.md`, `prototype_v4.md`, etc.

### Creative Experiments

You're encouraged to try approaches we haven't done yet. Some ideas:

**Different Output Formats:**
- HTML with a table of contents and internal links
- Multiple smaller documents (one per theme, location, or institution)
- A timeline format showing how coverage evolved
- A "frequently covered" vs "under-covered" analysis

**Different Content Focus:**
- Story gap analysis: What's been covered vs what's missing?
- Source diversity report: Who gets quoted most? Who's missing?
- Beat coverage patterns: What types of stories dominate?
- Seasonal/temporal analysis: How does coverage change over time?
- Geographic equity: Which communities get more/less coverage?

**Enhanced with Additional Metadata:**
- Cross-reference with other datasets (census data, election results, etc.)
- Add sections on demographics or economic indicators

**Multi-Part Formats:**
- Main guide + detailed appendices
- Quick reference card + full guide
- Different versions for different audiences (editor vs reporter vs intern)

Document your experiments in your `notes.md` with:
- What you tried
- Why you thought it would be useful
- What you learned
- Whether it worked

### Final Evaluation

Make sure your `notes.md` file addresses the following:

#### Process Insights
- What worked well in your prompt engineering?
- What changes made the biggest difference?
- What surprised you about the results?
- What would you do differently next time?

### Submission

When you are finished, add, commit and push your changes:

```bash
git add .
git commit -m "Star-Democrat draft beat book"
git pull origin main
git push origin main
```

Your `stardem_draft` directory should contain:
- `notes.md` with your complete analysis and evaluation
- `source_stories.json` (your chosen/filtered stories)
- `prompt.txt` (and any other prompt versions you tried)
- `prototype_v1.md`, `prototype_v2.md`, etc. (your beat book drafts)
- Any other experimental outputs you created

Submit the link to your `stardem_draft` directory in ELMS.
