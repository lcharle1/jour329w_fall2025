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
- Model: groq/moonshotai/kimi-k2-instruct-0905
- I ran this prompt first after receiving the suggestion that it was too long. I cut it down, but I also want to know what a shorter prompt would produce. 
Professionally, the introduction and tone are unnecessary. I find it amusing. Surprisingly, the book's tone took this direction. 
- There is a good list of stakeholders but it is very basic and general. There are no links or names for these positions/titles. There is a list of names later on though. None of the names match Prototype 8's list of names. 
- The 'Where Stories Come From' is a nice section to let the journalist know where to bookmark and look further into for other stories or revisit stories. 
- There is a specific mention of fentanyl compared to generically saying 'opiod crisis' or drug related problems and stories. 

### Prototype 2: Longer Prompt 
- Model: groq/moonshotai/kimi-k2-instruct-0905
- I went back to my longer prompt after seeing the shorter one work. Same very casual speaking tone.

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

### Prototype 7: longer prompt, edited
- Model: groq/meta-llama/llama-4-maverick-17b-128e-instruct
- Editing the prompt worked, but only so much. Now it references stories, but in a footnote style
- At the end of the guide, there is a numbered list of every story it refers to, but no hyperlink.
- No specific names were mentioned but the guide connected it to the story it used as an example.  
- I do like how it included the date of the story it was referring to.
- I am going to switch models. 

### Prototype 8: Longer prompt, switched models. 
- Model: groq/openai/gpt-oss-120b
- I am very happy with these results. This lets me know my prompt is good and works and this model works well. I am curious to try it with other models still just to see the varying results. 
The additional detail is amazing. It lists names as examples, but does not directly attribute the position/title to the person, which can cause some confusion. The names are presented as a list of examples after the position/title is listed, rather than being said in the introduction of the position/title. 
- The ‘competing viewpoints’ is a new subsection for me, and I am not against it. It helps the journalist have different perspectives regarding the theme. My only worry is the accuracy of these challenging views. How far does it go? Is it because of one quote of someone doubting a policy or anything regarding topic and now the LLM thinks it is an opposing view? I would want it to verify these “competing viewpoints” with stories where the journalist could verify themselves if it is a valid viewpoint or not. 
- I like how the caveat is clearly pointed out. I am a big color classifying person and enjoy how the caveats and tips are in a different color to stand out
- The recent examples subsection does a good job of providing supporting evidence. It is not embedded into the text as I would’ve liked, but it gets the job done. 
- The organization template of the order of information is new and helpful. Helps the reader understand what they are reading and where the information is. 
- There is an entire section on relevant people with their full name and positions/titles - Huzzah - and even the article where they were referenced! Though it does not come with a link, I like this extra step. The same is done for institutions, except they do not get articles referenced; instead, we get how they are relevant to the beat. 
- #9. Quick Reference Checklist: This is a new section for me in the Beat Book, and I like it. It suggests a schedule the journalist should follow to stay up to date with the beat and stories. 
- Compared to prototype 1, specific problems like Fentanyl are generically mentioned. In P.1 we have it named out but in P.8 there are no mention of fent. Its 'opiod', 'overdose', and 'overdose' being mentioned. I think with the increase of stories could have caused the Beat Book to approach the overall issue and it's impact and contributing factors than just naming Fentanyl and Heroin. 
- One thing I want to try is the shorter prompt with this model because P.1 wasn't too bad but definitely needs improvement. Out of curiousity I want to see it with this model. 

### Prototype 9: Shorter Prompt, switch models 
- 

