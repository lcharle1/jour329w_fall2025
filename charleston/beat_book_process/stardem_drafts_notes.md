# Star-democrat Draft beat Book 

11/17/2025

## Opton 3: Filtered/Refined Collection
- Topics: Local government + Health + Public Safety = Public Health. I chose these topics with the goal of creating a Beat Book specialized in Public health of eastern Maryland. It is a mix of government and health, which individually are coherent and popular beats, but together these could provide legislative or political side of how health is managed in this part of Maryland. 

- 
``` bash
uv run jq -s 'add' ../../data/stardem_topics/Public_Safety.json ../../data/stardem_topics/Health.json ../../data/stardem_topics/Local_Government.json > source_stories.json
``` 

- Beat Book format: Narrative guide + Issue Focused approach
- model: 
1. groq/moonshotai/kimi-k2-instruct-0905 = Failed; too large
2. groq/openai/gpt-oss-20b = failed' too large
3. groq/openai/gpt-oss-120b = failed; too large
4. groq/meta-llama/llama-4-maverick-17b-128e-instruct = failed too large
5. groq/qwen/qwen3-32b = failed; too large


11/19/2025

## Option 3:

- Used this command, provided by copilot to filter and find a random sample of 100 stories between local government, health, and public safety:

```bash 
uv run sqlite-utils query stardem_entities.db   "SELECT * FROM stories ORDER BY RANDOM() LIMIT 100"   --json-cols > filtered_stories.json
```
I am using filtered_stories.json. 

# Copilot Convo:
lcharle1: How do I edit this line of command to filter by a certain quantity: uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%'" \
  --json-cols > filtered_stories.json

GitHub Copilot: To filter by a certain quantity (limit the number of results), add a `LIMIT` clause to the SQL query:

```bash
uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%' LIMIT 100" \
  --json-cols > filtered_stories.json
```

Replace `100` with whatever number of stories you want. This will return only the first 100 stories matching your filter criteria.

If you want more control over which stories you get, you can also add `ORDER BY`:

```bash
uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY date DESC LIMIT 100" \
  --json-cols > filtered_stories.json
```

This would give you the 100 most recent Cambridge stories.

lcharle1: make it a random sample

GitHub Copilot: To get a random sample, use `ORDER BY RANDOM()` with `LIMIT`:

```bash
uv run sqlite-utils memory stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY RANDOM() LIMIT 100" \
  --json-cols > filtered_stories.json
```

This will give you a random sample of 100 stories that mention Cambridge. Each time you run it, you'll get a different random selection.

lcharle1: UnicodeDecodeError: 'utf-8' codec can't decode byte 0xab in position 31: invalid start byte

GitHub Copilot: The error indicates that `stories.db` has encoding issues. Try using the correct command - you need to read from the database file with the `--load-extension` flag or use the correct table name. Let me check what's in your directory: 

Ran terminal command: ls -lh

Ran terminal command: cd /workspaces/jour329w_fall2025/charleston/stardem_draft && ls -lh

The issue is that `sqlite-utils memory` is trying to read `stories.db` as if it's a JSON file. Since you already have the database created, use this command instead: 

Ran terminal command: uv run sqlite-utils query stories.db "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY RANDOM() LIMIT 100" --json-cols > filtered_stories.json

Use `sqlite-utils query` instead of `sqlite-utils memory` when working with an existing database file:

```bash
uv run sqlite-utils query stories.db \
  "SELECT * FROM stories WHERE content LIKE '%Cambridge%' ORDER BY RANDOM() LIMIT 100" \
  --json-cols > filtered_stories.json
```

The command has run successfully and created your filtered file with 100 random Cambridge stories.