# Using Datasette to Analyze CNS Stories

Datasette is a powerful tool for exploring and analyzing data through a web interface. In this assignment, you'll use it to dive into CNS story data, looking for patterns, trends, and insights that would be difficult to find by manually browsing stories.

### The Plan

By the end of this assignment, you'll be able to:
- Set up and configure Datasette for data exploration
- Load JSON data into a SQLite database using sqlite-utils
- Write SQL queries to analyze story patterns and trends
- Use Datasette's web interface to explore data interactively
- Identify newsroom insights from story data analysis

### Getting Started

1. In the Terminal, cd into the directory with your last name
2. Create a directory called `cns_datasette` using mkdir
3. cd into that new directory
4. Create a file called `notes.md` using touch and open it
5. Put "CNS Datasette Analysis" and today's date at the top, then save it
6. Do NOT cd out of that directory

### Part 1: Setting Up Datasette

#### Install Datasette and sqlite-utils

First, we need to install the tools we'll be using:

```bash
# Install datasette and sqlite-utils
uv add datasette sqlite-utils
uv run datasette install datasette-codespaces
```

### Part 2: Creating the Database

#### Load the Story Data

Now we'll create a SQLite database from the CNS story summaries:

```bash
# Create the database and load the JSON data
uv run sqlite-utils insert cns.db stories ../../data/story_summaries.json

# Check that it worked
uv run sqlite-utils tables cns.db --counts
```
You should see output showing a `stories` table with 4,000 records.

#### Explore the Database Structure

Let's see what columns our data has:

```bash
# Show the schema
uv run sqlite-utils schema cns.db
```

### Part 3: Launch Datasette

Start the Datasette web interface:

```bash
# Start Datasette (this will run in the background)
uv run datasette serve cns.db
```

In the lower right corner of your codespace, a pop-up should appear; click on it to open a browser page.

**Explore the Interface**:
- Click on the `cns` database
- Click on the `stories` table
- Browse through some records
- Try the "View and edit SQL" link

### Part 4: Basic Data Exploration

Use Datasette's interface to answer explore the data. Let's start with facets. Click on the gear icon next to `topic` and choose "Facet by this". Drill down into a topic; you can facet by words in the tags, and you can use the drop-down filters. You can use the "View and edit SQL" to see the commands that are happening under the hood. 

### Part 5: Adding Embeddings

Embeddings are numerical representations of text that allow us to find semantically similar content. We'll use the LLM tool to create embeddings for our story summaries, which will enable semantic search and similarity analysis.

#### Install LLM and Required Plugins

First, let's install the LLM tool and the sentence transformers plugin:

```bash
# Install the sentence transformers plugin
uv run llm install llm-sentence-transformers

# Install the specific model we'll use
uv run llm sentence-transformers register multi-qa-mpnet-base-cos-v1 --alias mpnet
```

#### Verify the Installation

Check that everything is installed correctly:

```bash
# Test that the model works
uv run llm embed -m mpnet -c "Hello, world!"
```

You should see a long list of numbers (the embedding vector) if everything is working.

#### Create Embeddings for Story Summaries

Now we'll create embeddings for all the story summaries in our database:

```bash
# Create embeddings for the summary field
uv run llm embed-multi stories \
  -d cns.db \
  --sql "SELECT rowid, summary FROM stories WHERE summary IS NOT NULL" \
  -m mpnet
```

This process will take several minutes as it processes thousands of stories. The `multi-qa-mpnet-base-cos-v1` model is specifically designed for question-answering and similarity tasks, making it perfect for finding related news stories.

#### Verify Embeddings Were Created

Check that the embeddings table was created:

```bash
# Check the new embeddings table
uv run sqlite-utils tables cns.db --counts
```

You should see an `embeddings` table with the same number of rows as stories that have summaries.

### Part 6: Semantic Search with Embeddings

Now we can use embeddings to find semantically similar stories.

#### Test Semantic Search 

On the command line, we can use `llm similar` to do this. We'll need to refer to a _collection_ of embeddings; in our case, that'll be stories. You can see the list of collections like so:

```bash
uv run llm collections list
```

And then run the similar command. For example:

```bash
uv run llm similar -d cns.db stories -c "fentanyl"
```

That gives you a list of embeddings - the `id` and `score` are what matter. You can retrieve stories in Datasette using the `id`.

### Part 7: Logging What You've Done

LLM logs every prompt and response to a SQLite database. You can see the location of that database by running:

```bash
uv run llm logs path
```

That's a SQLite database that stores your interactions with `llm`. Here's how to look at the most recent conversation:

```bash
uv run llm logs -c
```

You also can browse your logs with Datasette!

```bash
uv run datasette "$(llm logs path)"
```

### Part 8: Reflections

In your `notes.md` file, you should answer the following questions:

- What was the most interesting thing you saw doing this?
- What was the most useful thing you saw doing this?
- How useful was Datasette for this kind of analysis?
- What would you use this tool for in a newsroom?
- How does this compare to analyzing data in other tools?

When finished:

```bash
git add .
git commit -m "CNS Datasette analysis and findings"
git pull origin main
git push origin main
```

Submit the link to your `notes.md` file in ELMS.