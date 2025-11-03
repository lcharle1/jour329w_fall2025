# Star-Democrat Topic Classification

The Star-Democrat covers stories from Maryland's Eastern Shore, focusing on local communities, county government and regional issues. Unlike Capital News Service, the Star-Democrat has its own distinct coverage patterns reflecting the interests and concerns of Eastern Shore residents.

### Setup

1. Update from upstream: 

```{bash}
git fetch upstream
git merge upstream/main
```

2. You'll need to add some Python libraries using `uv` in the Terminal: `uv add pandas pyarrow ijson embedding-atlas`
3. Wait for it to finish
4. Create the embeddings: `uv run embedding-atlas data/star_democrat_articles_master.parquet --text content`
5. Wait for it to finish
6. Go to the Ports tab of the Terminal and click on the globe icon under "Forwarded Address"

Explore the results and see if they can help you with the task you have to complete.

### Your Task

Your job is to analyze a sample of 200 Star-Democrat stories and create a topic classification system for them. You'll use GitHub Copilot to write a Python script that adds topics to each story, then evaluate how well the classification works.

You can choose one of two approaches:

**Option 1: Let the LLM Decide**
- Have the LLM analyze the stories and classify them into topics without providing a specific list
- The LLM will create its own topic categories based on what it finds in the stories

**Option 2: You Decide**
- Create your own list of topics that you think will fit the Star-Democrat's coverage
- Provide this list to the LLM and have it apply your topics to each story

### Getting Started

Install the llm-groq plugin plugin and set your API key if needed:

```bash
uv run llm install llm-groq
uv run llm keys get groq # if you see a value, you don't need to proceed
uv run llm keys set groq # only run if the above command didn't show you an API key
```

1. In the Terminal, cd into the directory with your last name
2. Create a directory called `stardem_topics` using mkdir
3. cd into that new directory
4. Create a file called `notes.md` using touch and open it
5. Put "Star-Democrat Topic Classification" and today's date at the top, then save it

### Understand Your Data

Choose one of the JSON files posted in this Google Drive: https://drive.google.com/drive/folders/1SkGouI-wutVuZrE1rDeLof0fMtqshQ7R?usp=sharing. Download this file into your `stardem_topics` directory and rename it to `stardem_sample.json`.

First, explore what's in your data:

```bash
# Look at a few example stories
uv run jq '.[0:3] | .[] | {title, content}' stardem_sample.json

# Get a sense of story titles
uv run jq '.[].title' stardem_sample.json | head -20
```

### Choose Your Approach

Decide whether you'll use Option 1 (LLM decides) or Option 2 (You decide), and document your choice in `notes.md` along with your reasoning.

**If you choose Option 2**, create your proposed topic list now. Consider:
- Local government (county, municipal)
- Courts and public safety
- Education
- Business and economy
- Agriculture and farming
- Environment and natural resources
- Community events and culture
- Sports and recreation
- Development and planning
- Other relevant Eastern Shore topics

### Write Your Classification Script

Use GitHub Copilot to help you write a Python script called `classify_topics.py` that:

1. Reads the Star-Democrat JSON file
2. For each story, uses the LLM to add a single `topic` field
3. Saves the results to a new JSON file called `stardem_topics_classified.json`

**Important**: Copy your entire GitHub Copilot chat conversation into your `notes.md` file under a section called "GitHub Copilot Conversation".

#### For Option 1 (LLM Decides):

Your script should ask the LLM to:
- Analyze the story title and summary
- Determine the most appropriate single topic
- Create consistent topic names across all stories

Example prompt structure:
```python
prompt = f"""
Analyze this news story and assign it a single topic category.
Choose a 1 or 2-word broad topic that best represents what this story is about.
Use consistent topic names - if you've used a topic before, use the same name.

Title: {story['title']}
Content: {story['content']}

Return only the topic name as a single string.
"""
```

#### For Option 2 (You Decide):

Your script should provide your topic list and ask the LLM to:
- Choose the single best-fitting topic from your list
- Make sure your list has an option for "Other" or "None" if it's not exhaustive

Example prompt structure:
```python
topic_list = ["Local Government", "Education", "Public Safety", ...]  # Your list

prompt = f"""
Assign this news story to exactly ONE topic from the following list:
{', '.join(topic_list)}

Choose the topic that best represents what this story is primarily about.

Title: {story['title']}
Content: {story['content']}

Return only the topic name from the list above.
"""
```

#### Script Requirements:

Your script should:
- Use the `llm` command-line tool with an appropriate Groq model (e.g., `groq/meta-llama/llama-4-scout-17b-16e-instruct` or `groq-kimi-k2` or `groq/meta-llama/llama-4-maverick-17b-128e-instruct`)
- Process each story and add a `topic` field
- Save the enhanced stories to `stardem_topics_classified.json`
- Print progress as it processes stories

**Tip**: Have the script use subprocess to call the `llm` command. You should provide this document (`stardem_topics.md`) as a reference.

### Run Your Script

Execute your classification script:

```bash
uv run python classify_topics.py
```

This may take a bit of time, but not too long. Document any errors or issues in your `notes.md`.

### Load into Datasette

Now explore your results using Datasette:

```bash
# Create a SQLite database from your classified stories
uv run sqlite-utils insert stardem_topics.db stories stardem_topics_classified.json --pk id

# Launch Datasette to explore
uv run datasette stardem_topics.db
```

### Analyze Your Results

In Datasette, examine:

1. **Topic Distribution**: How many stories are in each topic?
2. **Topic Consistency**: Do similar stories get the same topic?
3. **Topic Clarity**: Are the topic names clear and distinct?
4. **Coverage Patterns**: What does the distribution tell you about Star-Democrat coverage?

Create a section in your `notes.md` called "Results Analysis" and address:

#### Quality Assessment
- Did the LLM (or you and the LLM) do a good job with the list of topics?
- Are there topics that seem too broad or too narrow?
- Are there stories that seem mis-categorized?
- Give specific examples of stories and their topics

#### Topic Refinement
- What topics should be consolidated or combined?
- What topics are missing that would be useful?
- Are there redundant or overlapping topics?
- How would you revise the topic list?

#### Approach Evaluation
- Did your chosen approach (Option 1 or 2) work well?
- Would the other approach have been better? Why or why not?
- What surprised you about the results?

### Submission

When finished:
```bash
git add .
git commit -m "Star-Democrat topic classification"
git pull origin main  
git push origin main
```

Submit the link to your `stardem_topics` directory in ELMS. Your directory should contain:
- `notes.md` with your complete analysis, GitHub Copilot conversation, and reflections
- `stardem_sample.json` (the original data file I provided)
- `classify_topics.py` (your classification script)
- `stardem_topics_classified.json` (the results)
- `stardem_topics.db` (your SQLite database)

### Extra Credit

Want to go further? Try:

- **Compare Approaches**: If you did Option 1, try Option 2 (or vice versa) and compare the results
- **Multiple Topics**: Modify your script to assign up to 3 topics per story and analyze the differences
- **Subtopics**: Create a two-level classification system with main topics and subtopics
- **Temporal Analysis**: Look at how topic distribution changes over time (if date information is available)
- **Geographic Analysis**: Analyze which topics appear most in different Eastern Shore counties or towns
