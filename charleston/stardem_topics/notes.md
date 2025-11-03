# Star-Democrat Topic Classification 

11/2/2025



## Copilot Convo

lcharle1: prompt = f"""
Analyze each story in the 'stardem_sample.json' file and assign one or more relevant topic categories.
Use short, consistent topic names (1–3 words) that accurately represent what each story is about.
If a topic name has been used before, reuse it for similar stories to maintain consistency.
For each story, consider both the title and the summary when determining the topics.
Title: {{story['title']}}
Summary: {{story['summary']}}

Return a JSON list of topic names for each story.

Save all classified results into a new file called 'stardem_topics_classified.json'.


GitHub Copilot: Enable Claude Sonnet 4.5 for all clients
[object Object]

lcharle1: @agent Enable: "Enable Claude Sonnet 4.5 for all clients"

GitHub Copilot: I'll help you analyze the stories in the `stardem_sample.json` file and assign topic categories. Let me start by reading the file to see what stories we're working with. 

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/stardem_sample.json#1-1), lines 1 to 100

Let me continue reading to see more of the file: 

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/stardem_sample.json#100-100), lines 100 to 500

I can see this is a large JSON file with news stories. Let me check if there are any existing summaries to see what format they should be in: 

Searched text for `summary` (`**/charleston/stardem_topics/*.json`), no results

Now let me create a Python script that will analyze each story and assign topics. I'll use the approach described in the user's prompt: 

Created [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/classify_topics.py)

Now let's run the script to classify the stories: 

Ran terminal command: cd /workspaces/jour329w_fall2025/charleston/stardem_topics && python classify_topics.py

Made changes.

lcharle1: Please update the script according to these requirements: - Use the `llm` command-line tool with an appropriate Groq model (e.g., `groq/meta-llama/llama-4-scout-17b-16e-instruct` or `groq-kimi-k2` or `groq/meta-llama/llama-4-maverick-17b-128e-instruct`)
- Process each story and add a `topic` field
- Save the enhanced stories to `stardem_topics_classified.json`
- Print progress as it processes stories
- Use 'stardem_topics.md' as a reference to use subprocess call the 'llm' command. 


GitHub Copilot: I'll help you update the script to use the `llm` command-line tool with subprocess instead of making direct API calls. Let me first check if there's an existing script in the charleston/stardem_topics directory. 

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics)

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/classify_topics.py#1-1), lines 1 to 100

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/classify_topics.py#100-100), lines 100 to 154

Now I'll rewrite this script to use the `llm` command-line tool with subprocess as specified in the requirements: 

Using "Replace String in File"


```

```
Perfect! I've updated the script according to the requirements. Here's what changed:

## Key Updates:

1. **Uses `llm` command-line tool**: The script now uses `subprocess.run()` to call the `llm` command with the Groq model
2. **Groq model**: Set to use `groq/meta-llama/llama-4-scout-17b-16e-instruct` (you can easily change to `groq-kimi-k2` or `groq/meta-llama/llama-4-maverick-17b-128e-instruct`)
3. **Adds `topic` field**: Each story gets a `topic` field with the classified topics
4. **Prints progress**: Shows progress as each story is processed (e.g., `[1/200] Story title... -> ["Topic Name"]`)
5. **Saves to `stardem_topics_classified.json`**: Output file as specified
6. **Uses LLM for classification**: Instead of keyword matching, it now uses the LLM to intelligently classify each story

The script:
- Reads each story from `stardem_sample.json`
- Sends the title and first 500 characters of content to the LLM
- Asks the LLM to return topics as a JSON list
- Adds the `topic` field to each story
- Preserves all original fields from the input
- Tracks topic usage and displays statistics at the end

You can now run it with:
```bash
uv run python classify_topics.py
```

Made changes.

lcharle1: Please update the script to use the `llm` command-line tool with an appropriate Groq model (e.g., `groq-kimi-k2`)

GitHub Copilot: I'll update the script to use the `groq-kimi-k2` model, which is one of the suggested models in the requirements. 

Using "Replace String in File"


```

```
Perfect! I've updated the script to use the `groq-kimi-k2` model. The script is now ready to run with:

```bash
uv run python classify_topics.py
```

The model has been changed from `groq/meta-llama/llama-4-scout-17b-16e-instruct` to `groq-kimi-k2`, which is one of the recommended Groq models in the assignment instructions. This model should provide good topic classification results for the Star-Democrat news stories.

Made changes.

lcharle1: The topic section is "uncategorized" for all of the stories. Where is the error coming from? What solutions do you recommend?

GitHub Copilot: Let me check the current state of the script and the output file to diagnose the issue. 

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/classify_topics.py#1-1), lines 1 to 100

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/stardem_topics_classified.json#1-1), lines 1 to 50

I can see the problem! All stories have `"topic": ["Uncategorized"]`, which means the subprocess calls are catching errors. Let me check if there were any error messages during execution: 

Ran terminal command: cd /workspaces/jour329w_fall2025/charleston/stardem_topics && uv run llm -m groq-kimi-k2 "Test prompt"

Ah! The issue is an invalid API key. Let me check if the Groq API key is set: 

Ran terminal command: uv run llm keys get groq

lcharle1: The Groq API key is set but the error is still there. Every story is labeled with "uncategorized". How can I make the script analyze the stories and determine a list of topics based on the stories, and include the requirements I listed?

GitHub Copilot: Looking at the issue, I can see that all stories are getting "Uncategorized" which means the subprocess calls are failing. Let me check the actual error output and fix the script to properly handle the LLM responses. 

Read [](file:///workspaces/jour329w_fall2025/charleston/stardem_topics/classify_topics.py#1-1), lines 1 to 100

The issue is that the script is catching errors but not showing what they are. Let me update it to better handle errors and use the `uv run` command which is the standard way to run Python in this environment: 

Using "Replace String in File"


```

```
Now let's run the updated script to see what the actual error is: 

Ran terminal command: cd /workspaces/jour329w_fall2025/charleston/stardem_topics && uv run python classify_topics.py 2>&1 | head -50

Perfect! Now I can see the actual error - it's an **Invalid API Key** error. The Groq API key needs to be set. Let me check if there's a key set and help you configure it: 

Ran terminal command: uv run llm keys get groq

Made changes.

## Notes

The script does not provide topics. Every story received an "uncategorzed". I continued talking with Copilotto try to resolve the issue and followed their steps but the error persists. For the second time it sugested an invalid API key error, but there is a Groq API Key in. Other than the topic, my script provides the same information as stardem_sampe.json.

## Notes: Update

It works now 


## Results Analysis

I think the LLM followed instructions but not as intended. It created very specific or too general topics. Some topics were just right or they were the same topic category written in different ways. For example, obits were written either as obituaries or obituary. There was another story topic that listed "Voter Turnout" and "Election 2024". It would be easier to classify all in one as Elections. There was also the problem of the topic lsiting the crime as well as "Crime". The added context is nice but it is too specific for a classification system.

Finding patterns is tricky because there is no guarantee the same general topic will be named the same - there are a lot of variants - but by my observation I would say the top three topics was: Government, Sports, Education. Sports and Government could be a close tie also. 

This finding is more of a question to Star Democrat but there was a news article listed under the section News, but it was about a reality TV show called Temptation Island. I did not agree with this section classification and it made me think dramas or societal topics like these should be in the Arts & Culture & Society section more than News. It could become News if anything substantial happens in or out of the show. 

I also noticed "editorial inbox" or "letters" is not labeled as a topic. Except one "Editorial" (the article was titled: Always plenty to be thankful for in Maryland) and "Letters to the Editor" (the article was titled: Letter had no good reasoning), there are no similar topics. You can kind of suspect which are through the topics listed. Like "food" or "Political commentary". 

History is also still a big factor here. Numerous times it was mentioned in some fashion. 

There are definitely redundant and overlapping topics with topics that go into too much detail and are too narrow to classify articles with. The story titled, 	Man allegedly hits person suffering from overdose with vehicle, has the topics listed as "Crime", "Drug", and "Hit-and-Run". These could all be combined into Crime. 

I would refine the topic list by finding a full list of all the topics it listed and grouping them together. Ideally I would want to do this in Rstudio and just see the list of topics it suggested and work on grouping them individually. 

I would say my option did not work out. While it was great to see what the LLM would come up with and the detailed topics give inspiration for other types of topics, to keep or remove, I think option 2 is better. I was a little surpised by my results from using option 1 because I did not expect the topics to be so specific. But I also see the error in how I did not provide any information regarding how specific or broad a topic should be. Which if we're doing that, we could skip and go straight to option 2. 