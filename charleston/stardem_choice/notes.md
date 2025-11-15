# Star-Democrat Choice Assignment 

11/13/2025

Run the script with your chosen model:

```bash
uv run python add_entities_updated2.py --model [INSERT] --input Race_Diversity.json
```

Create a SQLite database to explore your results:

```bash
# Create database from fourth version
uv run sqlite-utils insert stardem_entities.db stories_4 stories_with_entities_4.json --pk docref

# Add fifth version to same database
uv run sqlite-utils insert stardem_entities.db stories_5 stories_with_entities_5.json --pk docref

# Add sixth version to same database
uv run sqlite-utils insert stardem_entities.db stories_6 stories_with_entities_6.json --pk docref

#add seventh version to same database
uv run sqlite-utils insert stardem_entities.db stories_7 stories_with_entities_7.json --pk docref

# Launch Datasette to explore
uv run datasette stardem_entities.db
```

## trial 1
- prompt edits:

1. I asked copilot to improve my script to extract everyone in the story, as it continues to miss people, locations, and institutions.

2. I asked it to limit the results to 20 so it did not take as long to run

3. I changed the word list to extract in the schema_prompt.


- model: groq/meta-llama/llama-4-maverick-17b-128e-instruct

- results: No improvements or regressions. Some locations, people, and institutions that should be included in their respective columns are not there. 

Like for the Antisemitic incidents increasing, double in Maryland story, it is missing names of interviewees: Meredith Weisel, the regional director for the ADL's Washington, D.C. Regional Office. The only person listed is President Biden, and he wasn't interviewed. I will add a line including people who are interviewed by emphasizing you can find these names and positions/titles before the word 'said' or after these punctuations ' ," ' (<- that is the closing of a quote). 

For the CBMM to host Souls at Sea remembrance ceremony, I noticed geographical landmarks were not mentioned in the Geographical metadata column. Names of rivers and coves were left out could have been added. But it did have the Chesapeak Bay, Baltimore, Easton Shore, and St. Micheals, but that is general information. My goal is to be as specific as possible. It is noticing these larger or more general areas, why not specific names or locations? I will be updating the prompt to mention geographical landmarks such as rivers and coves and for buildings, I will list rooms and auditoriums as examples. For this story it missed some locations such as the auditorium, and the museum where the ceremony was held.

There was an error with story #14. I used copilot to figure out what was the issue as the terminal did not show a lot of information for the error. This is what it had to say:

This is a JSON parsing error. It means the LLM returned malformed JSON - likely the model returned valid JSON followed by additional text or commentary that wasn't part of the JSON structure. The parser successfully read the JSON object but then encountered extra data on line 27 after the JSON should have ended.

Common causes:

The LLM added explanatory text after the JSON
The LLM included multiple JSON objects instead of one
The LLM added markdown formatting that wasn't completely stripped
The script tried to handle this by removing markdown code blocks, but some extra content still remained after the valid JSON ended.



- Suggested edits:

1. I will be updating the prompt to mention geographical landmarks such as rivers and coves and for buildings, I will list rooms and auditoriums as examples. For this story it missed some locations such as the auditorium, and the museum where the ceremony was held.

2. I will add a line including people who are interviewed by emphasizing you can find these names and positions/titles before the word 'said' or after these punctuations ' ," ' (<- that is the closing of a quote). 

3. I will add "include acronyms and their full name" in the extraction rules of the prompt

## trial 2

- prompt edits: same edits mentioned above

1. updated geographical metadata
2. updated people metadata
3. updated institutional metadata
4. changed models
5. add 'Advice' metadata category with definition.

- model: groq/moonshotai/kimi-k2-instruct-0905

- results: Immediately I noticed no change in the results, but one thing caught my eye was the llm_classification_meta column listed gpt-oss:120b as the model. Below is a template of the line of code I am running for my chosen model, as used in the assignemnt 'stardem_topics_entities':

```bash
uv run python add_entities_updated2.py --model [INSERT] --input Race_Diversity.json
```

I asked copilot this question in hopes it could identify where the model is listed in the script and figure out how I could change it:
"When I launch the datasette to explore there is a column called 'llm_classification_meta', where does it come from and how do I change the model it lists?"


Edits were made to the script: 
"Done! The script will now update the llm_classification_meta column to show the model you're actually using (the one you pass with --model). It will also set llm_failed to true if there's an error during metadata extraction, and false if successful." - According to Copilot. 

## trial 3

- prompt edits: Not really prompt edits but script edits to make sure the llm_classification_meta column reflects the model I am using when I use the line command with ' --model '. 

- model: groq/moonshotai/kimi-k2-instruct-0905

- results:

I no longer see an error for line 14 - improvement. Now there are results in the metadata columns. 

Another name has been added for the Antisemitism story I noted in trial 1, but it is the name of the author, instead of the person I wanted it to extract. 

- suggested edits:
1. I am going to use the qwen model. 

## trial 4

- prompt edits: added more examples in the people and location metadata categories. These examples are people
- model: groq/qwen/qwen3-32b
- results:

Despite including direct names, like Meredith Weisel from the Antisemitic incidents increasing, double in Maryland story, some people are still missing. 







