# CNS More Datasette

Now that you've worked with CNS data and created some collections, let's explore more advanced ways to enrich and analyze that data using Datasette. We'll use two powerful features: enrichments to enhance your data with AI analysis, and embeddings to find semantic relationships between stories.

### Getting Started

What we're going to do is take your existing CNS work and enhance it with Datasette's AI capabilities. You'll learn how to automatically enrich data with AI-generated insights and explore semantic relationships through embeddings.

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called cns_more_datasette using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "CNS More Datasette" and today's date at the top, then save it
6. Do cd .. twice to get back to the main directory (/workspaces/jour329w_fall2025)
7. In the Terminal, do the git add, commit, pull and push your changes as described in the `setup.md` file.

### Install Datasette and Plugins

Install the tools we'll need:

```bash
# Install Datasette and the plugins we'll use
uv add datasette sqlite-utils
uv run datasette install datasette-enrichments-gpt datasette-codespaces datasette-embeddings
```

### Use Your Existing Database

For this assignment, we'll use the `cns.db` database you created in the `cns_datasette` assignment, which already contains all the CNS stories in a `stories` table.

```bash
# Copy your existing database to your new directory
cp ../cns_datasette/cns.db ./cns.db

# Verify your database has the stories
uv run sqlite-utils tables cns.db --counts
```

You should see a `stories` table with the 4000 CNS posts. If it has 8000 posts, you did the insert command twice, and here's how to fix that:

```bash
rm cns.db
uv run sqlite-utils insert cns.db stories ../../data/story_summaries.json
```

### Configure Datasette Plugin

Let's configure Datasette to use the OpenAI API key. In the Terminal, do the following:

```bash
touch metadata.json
```

Then copy the contents of this file into `metadata.json`: https://gist.githubusercontent.com/dwillis/419c9187b19e9b82775c3783dd5d8ff4/raw/7d51bde21e192f252e28fd6566976e310e2fd4b6/metadata.json

### Set Up OpenAI API Key

The datasette-enrichments plugin uses OpenAI's API for AI analysis. You'll need to set up your API key:

1. I will provide you with an OpenAI API key for this assignment
2. Set it as an environment variable in your Codespace:

```bash
# Set your OpenAI API key (replace with the key I provide)
export DATASETTE_SECRETS_OPENAI_API_KEY="your-api-key-here"

# Verify it's set
echo $DATASETTE_SECRETS_OPENAI_API_KEY
```

**Important**: Keep this API key secure and DO NOT commit it to your repository. The environment variable will only last for your current session.

### Exploring Datasette Enrichments

Enrichments let you use AI to automatically analyze and enhance your data. Let's try several different types of analysis.

First, launch Datasette with your database.

```bash
# Launch Datasette with enrichments enabled
uv run datasette cns.db --metadata metadata.json
```

You'll know if it worked by going to the stories table: there should be a gear icon right next to "stories".

#### Enrichment 1: Keywords or Sentiment

1. In Datasette, facet by Topic and choose "Chesapeake Bay". There should be 36 stories.
2. Click on the "Enrich selected data" button
3. Choose "AI analysis with OpenAI GPT"
4. Choose the gpt-4o model
5. Use the menu to create and populate a new column based on an existing column. For example, you could use the summary to generate keywords, or have the LLM perform sentiment analysis using the title.
6. Before running, you'll need to plug in the API key I gave you. Need to get it? Use the command from above in the Terminal!
7. Run the enrichment and observe the results

Run this enrichment and document in `notes.md`:
- Do the results make sense?
- Any surprising patterns?
- Anything you don't like about this?

#### Enrichment 2: Topics

1. Go back to the full stories table and use the drop-down menu to search for stories where the summary contains "annapolis". Should be 87 rows.
2. Cick that gear icon and click on the "Enrich selected data" button
3. Choose "AI analysis with OpenAI GPT"
4. Choose the gpt-4o model
5. Using the topics we've generated together, write a prompt that includes them in `notes.md` (and has the {{ summary }} column) and paste that into the Prompt section.
6. Create a new column name for the output.
7. Add your OpenAI key again

Run this enrichment and document in `notes.md`:
- Do the results make sense?
- Any surprising patterns?
- Anything you don't like about this?

### Working with Embeddings

Now let's explore semantic relationships using the embeddings plugin. We'll work with a smaller set of stories, which you'll load like this (and then run the server)

```bash
uv run sqlite-utils insert cns.db annapolis ../../data/annapolis.json --pk=link
uv run datasette cns.db --metadata metadata.json --setting sql_time_limit_ms 35000
```

#### Generate Embeddings

First, create embeddings for your stories. In the Datasette interface:

1. Go to the annapolis table. There should be 87 stories.
2. Click on the gear icon and choose "Enrich selected data"
3. Click on "Text embeddings with OpenAI"
4. On the next page, remove all but {{ summary }} from the Template box
5. Click the "Enrich data" button.

When it's done, you can click on the gear icon again and choose "Semantic search against this table". Try a few phrases - remember, you want to search the concept, not specific keywords.

Document your searches in `notes.md`:
- What words or phrases did you try?
- Do the results make sense?
- Anything you don't like about this?

### Submission

When you are finished, add, commit and push your changes:

```bash
git add .
git commit -m "Datasette enrichments and embeddings analysis"
git pull origin main
git push origin main
```

Submit the link to your `notes.md` file in ELMS.
