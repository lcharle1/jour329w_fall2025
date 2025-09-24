# CNS Metadata

Building on your work with CNS tags, this assignment will have you generate and compare metadata for news stories using LLMs. You'll extract not just topics, but also people, organizations, locations and other structured information that could be useful for newsrooms. You'll also have the LLMs make some subjective choices.

### Getting Started

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called cns_metadata using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "CNS Metadata" and today's date at the top, then save it
6. Do cd .. twice to get back to the main directory (/workspaces/jour329w_fall2025)
7. In the Terminal, do the git add, commit, pull and push your changes as described in the `setup.md` file.

### Pick Your Stories

Using the tag you used in the CNS Tags assignment, select 5 stories from that tag. They can be about similar topics or a broad selection. List each story and its URL in `notes.md`, creating a list of the following:

* up to 3 key people (with title or role)
* up to 3 main organizations/institutions
* up to 3 geographic locations
* 3 short (two-word) topics you would assign
* what kind of story is this - breaking news, feature, analysis, investigation, other
* a rating of the story's importance on a scale from 1 to 5, taking into account its impact on people (greater impact means higher score)

### LLM Analysis

Follow that with the LLM's version. You must use one of the following groq models: 

groq/openai/gpt-oss-20b
groq/openai/gpt-oss-120b
groq/qwen/qwen3-32b
groq/meta-llama/llama-4-maverick-17b-128e-instruct
groq/moonshotai/kimi-k2-instruct-0905

AND the claude-4-sonnet model

To do that you will need to set your Claude key by doing the following:

```bash
uv run llm keys set anthropic
```

and pasting in the key I will give to each of you.

```{bash}
uv run python -m newspaper --url=YOUR_URL -of=text | llm -m groq/moonshotai/kimi-k2-instruct-0905 "Extract structured metadata from this news story and return as JSON with these exact fields:
{
  \"url\": \"the url of the story\",
  \"people\": [\"list of up to 3 people with their titles/roles\"],
  \"organizations\": [\"government agencies, companies, groups mentioned\"],  
  \"locations\": [\"cities, counties, states, specific places\"],
  \"topics\": [\"3-5 topic tags, max 2 words each\"],
  \"story_type\": \"breaking news, feature, analysis, investigation, other\",
  \"impact\": \"a rating of the story's importance on a scale from 1 to 5, taking into account its impact on people\",
  \"
}"

```

Be sure to include the commands you run and the responses in your `notes.md` file.

### Evaluation 

Compare your own metadata to those created by the LLMs, both in terms of quality but also noting differences. Did the LLMs produce responses that you didn't? Are any of those differences semantically the same? What changes could you make to the llm commands to improve the responses? Try doing that and check the results - did it improve things? How?

What would be the potential issues of repeating this with 50 or 500 stories? How could you improve the consistency of the results? Do not skim on details here, and feel free to speculate or propose ideas even if you don't know if they would work.

Finally, what would make this entire process easier, particularly comparing the responses and revising the prompts? If you had to show your work to someone else, what would make that easier?

When you are finished, add, commit and push your changes:

```{bash}
git add .
git commit -m "replace with your commit msg"
git pull origin main
git push origin main
```

Submit the link to your `notes.md` file in ELMS.