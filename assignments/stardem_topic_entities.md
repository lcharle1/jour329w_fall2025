# Star-Democrat Topic Entities

In this assignment, we'll add important metadata to a topic-based collection of Star-Democrat stories: entities, including people, places and organizations. You'll choose a topic from the .json files in the data directory and extract structured entity information from those stories, and evaluate the results. The goal here is to end up with the most relevant material for a beat book.

### Setup

Update from upstream: 

```{bash}
git fetch upstream
git merge upstream/main
```

### Getting Started

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called stardem_topic_entities using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "Star-Dem Topic Entities" and today's date at the top, then save it

### Choose Your Topic

Look at the available topic-based JSON files in the data/stardem_topics folder

```bash
ls ../../data/stardem_topics/*.json
```

In your `notes.md`, document which topic you chose and why it interests you.

### Copy Your Topic File

Copy your chosen topic file to your working directory (replace `TOPIC` with your choice and make sure you're in your assignment directory):

```bash
cp ../../data/stardem_topics/TOPIC.json topic_stories.json
```

Explore what's in your topic file by looking at the JSON. Take the time to really make sense of the range of stories.

### Add Entities

Make sure you have the `llm-groq` plugin installed, and also install the `llm-ollama` plugin

```bash
uv run llm install llm-groq
uv run llm install llm-ollama
```

You must use one of the following groq models: 

- groq/openai/gpt-oss-20b
- groq/openai/gpt-oss-120b
- groq/meta-llama/llama-4-maverick-17b-128e-instruct
- groq/moonshotai/kimi-k2-instruct-0905
- glm-4.6:cloud

Let's use the `add_entities.py` script you created for the previous assignment as a starting point. Copy that script:

```bash
cp ../../stardem_entities/add_entities.py add_entities.py
```

Now, given that your stories are all from the same topic, modify the `add_entities.py` script so that the prompt takes advantage of that. Make the examples more specific, or provide some better context. 

Run the script with your chosen model. Ask Copilot to alter the script so you can test it out with a smaller number of stories first, using a command-line --limit argument and to produce output files that are versioned.

```bash
uv run python add_entities.py --model groq/openai/gpt-oss-120b --input topic_stories.json
```

### Try Another Approach

Rename your first output file so you can create another:

```bash
mv stories_with_entities.json stories_with_entities_v1.json
```

Now modify your prompt or try a different model. Some options to experiment with:

1. **Focus on a different topic**: Use a different topic, maybe one that is closest to your first choice
2. **Different model**: Try a different model from the approved list
3. **Add context**: Modify the prompt to give the LLM more context about what makes an entity more important
4. **Exclude stories you don't want**: If there are stories that don't make sense for a beat book, skip them

In your `notes.md` file, document:
- Which models you used for each run
- What prompt variations you tried
- Your reasoning for the changes

### Evaluate Your Results

Create a SQLite database to explore your results:

```bash
# Create database from first version
uv run sqlite-utils insert stardem_entities.db stories_v1 stories_with_entities_v1.json --pk docref

# Add second version to same database
uv run sqlite-utils insert stardem_entities.db stories_v2 stories_with_entities_v2.json --pk docref

# Launch Datasette to explore
uv run datasette stardem_entities.db
```

### Analysis Questions

In Datasette, explore the entity extraction results and answer these questions in your `notes.md`:

#### Accuracy Assessment
- Are the extracted entities accurate? Check 5-10 stories in detail
- Are there false positives (entities that shouldn't be there)?
- Are there false negatives (important entities that were missed)?
- Do the entities match what you see when reading the stories?

#### Entity Quality
- **People**: Are full names captured correctly? Are titles/roles included appropriately?
- **Places**: Are location names consistent (e.g., "Easton" vs "Easton, MD")? Are they specific enough?
- **Organizations**: Are organization names complete and accurate? Are abbreviations expanded?

#### Comparison Between Models/Prompts
- How do the results differ between your two runs?
- Which model/prompt produced better results? Why?
- Did focusing on "important" entities improve quality?
- Are there systematic differences in how entities are extracted?

#### Topic-Specific Patterns
- What are the most frequently mentioned people in this topic? Use this query:
```sql
SELECT value as person, COUNT(*) as mentions
FROM stories_v1, json_each(metadata_people)
GROUP BY person
ORDER BY mentions DESC
LIMIT 20
```

- What are the most common places? Organizations?
- Do these patterns make sense for your chosen topic?
- Are there any surprising or unexpected entities?
- What changes would you need to make to ensure that a beat book built with this information would be properly scoped?

### Submission

When you are finished, add, commit and push your changes:

```{bash}
git add .
git commit -m "Star-Democrat topic entities analysis"
git pull origin main
git push origin main
```

Your `stardem_topic_entities` directory should contain:
- `notes.md` with your complete analysis and reflections
- `topic_stories.json` (your original topic file)
- `add_entities.py` (your modified script)
- `stories_with_entities_v1.json` (first run results)
- `stories_with_entities_v2.json` (second run results)
- `stardem_entities.db` (your SQLite database)

Submit the link to your `stardem_topic_entities` directory in ELMS.