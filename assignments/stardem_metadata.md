# Star-Democrat Metadata

In this assignment, we'll add important metadata to our collection of Star-Democrat stories, and then use them to separate the stories into topics. We'll start with extracting the section, page numbers and word count, then proceed to classifying different types of stories to properly label non-articles such as event calendars, obituaries and legal notices. We'll start with your sample of Star-Democrat stories and compare the results. The goal here is to see what metadata we can add to _every_ article before we move to topic-specific metadata.

### Setup

Update from upstream: 

```{bash}
git fetch upstream
git merge upstream/main
```

### Getting Started

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called stardem_metadata using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "Star-Dem Metadata" and today's date at the top, then save it

### Create Your Python Script

Make sure you have the `llm-groq` plugin installed:

```bash
uv run llm install llm-groq
```

Have Copilot (you can choose the model, but I'd go with Claude Sonnet 4.5) create a Python script called `add_sections.py`. You'll use Copilot to do what we want: in this case, write a script that uses the Python llm library and llm-groq plugin, reads the `stardem_sample.json` file and extracts the section title, page number and word count for each article, producing the following:

```python
 schema_prompt = """
    {
      "section": "the section",
      "page": "the page",
      "word_count": word_count
    }
    """
```

Tell Copilot that you want to run the script using this command: uv run python add_sections.py --model MODEL_NAME --input stardem_sample.json

To help the model, tell Copilot to add an example to your prompt in addition to providing the structure of the JSON output. Have it change the output file to `enhanced_stories.json`. 

You must use one of the following groq models: 

groq/openai/gpt-oss-20b
groq/openai/gpt-oss-120b
groq/meta-llama/llama-4-maverick-17b-128e-instruct
groq/moonshotai/kimi-k2-instruct-0905

Run the script using the model name; it'll take a bit to process all 200 entries:

```bash
uv run python add_sections.py --model YOUR MODEL --input stardem_sample.json
```

### Repeat

Do the same steps as before, picking another model and changing the schema_prompt value so that it looks like this:

```python
 schema_prompt = """
    {
      "section2": "the section",
      "page2": "the page",
      "word_count2": word_count
    }
    """
```

Re-run the script using `enhanced_stories.json` as input:

```bash
uv run python add_sections.py --model OTHER MODEL --input enhanced_stories.json
```

In your `notes.md` file, be sure to list which models you used.

### Evaluation 

Now explore your results using Datasette:

```bash
# Create a SQLite database from your classified stories
uv run sqlite-utils insert stardem_metadata.db stories enhanced_stories.json --pk docref

# Launch Datasette to explore
uv run datasette stardem_metadata.db
```

Use facets and filters to explore the new metadata and evaluate the results in your `notes.md` file. Do the results look accurate? Are there any records that don't have all three (or six) new attributes? Do the results from the two models agree? Are these metadata useful? What other universal (not topic-specific metadata) would be useful?

When you are finished, add, commit and push your changes:

```{bash}
git add .
git commit -m "replace with your commit msg"
git pull origin main
git push origin main
```

Submit the link to your `notes.md` file in ELMS.