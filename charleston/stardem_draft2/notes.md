# Star-Democrat Second Draft Beat Book

11/21/2025

## Option 3: Filtered/Refined Collection 

- Topics: Public Safety + Health + Local Government

## SQL code 

- this is for my own use. Saving the code here saves me time when I forget what I used and where it is.

```bash 
uv run sqlite-utils query stardem_entities.db   "SELECT * FROM stories ORDER BY RANDOM() LIMIT 100"   --json-cols > filtered_stories.json
```
## Prototype Code

```bash 

cat prompt.txt filtered_stories.json | uv run llm -m [MODEL]> prototype_v[#].md
```
## Evaluation:

### Prototype 1: Shorter prompt
- I ran this prompt first after receiving the suggestion that it was too long. I cut it down, but I also want to know what a shorter prompt would produce. 
Professionally, the introduction and tone are unnecessary. I find it amusing. Surprisingly, the book's tone took this direction. 
-- Model: groq/moonshotai/kimi-k2-instruct-0905

### Prototype 2: Longer Prompt
- I went back to my longer prompt after seeing the shorter one work. Same very casual speaking tone. 
- Model: groq/moonshotai/kimi-k2-instruct-0905

### Prototype 3: Longer prompt, edited. 
- I edited the prompt to emphasize a professional tone. No casual tone. 
- I realized the prompt is still the same. My next plan is to switch the models. 
- Model: groq/moonshotai/kimi-k2-instruct-0905

### Prototype 4: Longer Prompt, switched model
- Model: groq/meta-llama/llama-4-maverick-17b-128e-instruct
- I realized by the fourth prototype that I did not change the random selection sql line command from 10 back to 100. I had decreased it to see if it would work and continued to. I am unsure if this could be a factor contributing to the casual tone the guide has. 

### Prototype 5: Longer prompt, switched random story sample size
- Model: groq/meta-llama/llama-4-maverick-17b-128e-instruct
- I increased the random sample size back to 100 and received this error. Now I have a quantity parameter. 10 is my minimum, and 100 is my maximum
- Error: Error code: 400 - {'error': {'message': 'Please reduce the length of the messages or completion.', 'type': 'invalid_request_error', 'param': 'messages', 'code': 'context_length_exceeded'}}

### Prototype 6: Longer prompt, switched random story sample size
- Model: groq/meta-llama/llama-4-maverick-17b-128e-instruct
- Sample size of 50 works. Huzzah 
- The first thing I noticed compared to the other guides is that it is shorter, despite having more background stories. I can understand it: the more background information it has, the more generalized the results are, rather than having a smaller sample size and diving deeper into each one individually. 


