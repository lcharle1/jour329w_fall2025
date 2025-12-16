# Star-Democrat Nearly Final Beat Book

12/6/2025


## Code to run for prompt

```bash
cat prompt.txt filtered_stories.json | uv run llm -m [MODEL]> prototype_v[#].md
```

## Trial 1 - Learning App

This structure and format is inspired by a learning app, step by step, process. How you complete one slide or one page and continue onto the next, but with the concise and detailed manner to retain the short attention span social media has kind of instilled in us. 

I am using prototype_v13 from stardem_draft2 to conduct stardem_nearly_final
 
- Model: groq/openai/gpt-oss-120b

- evualuation: 

It gave me more of an instructional guide on how to create the learning app rather than using the information from filtered_stories.json to createa learning app. 


## Trial 2 - Learning App

I am going to shorten the prompt:

"Create an accurate, descriptive, and detailed learning app with a step-by-step narrative for an early-career reporter covering the Health and public safety beat only in Talbot County and its municipalities. Use the attached filtered_stories.json dataset of stories as your primary source material. 

Include interactive elements such as: micro-learning (bite-sized lessons) and gamification (streaks, points). Use inspiration from other interactive learning apps such as Quizlet or Duolingo. 
"


- model: groq/openai/gpt-oss-120b
- eval: A lot more detailed than the first trial. It still works as a how to guide to creating the app, rather than giving a learning app of the information. 


## Trial 3 - Pitch Deck
Pitch deck format with long style prompt

- model: groq/openai/gpt-oss-120b
- eval: 

I like the style of the pitch deck presentation. With better results from the LLM using the filtered_stories.json I can see a lot of potential using a pitch deck format. It does miss the visual aspect. I will emphasize a visual aspect in the next trial. Since the filter_stories.json does not include any images I can see this not working but maybe it can create images.

The downside is we loose the narrative and detailed aspect for every section. For a quick debrief, this works, but for more informative and narrative, not so much. 

## trial 4 - Pitch deck

Requesting a visual aspect wherever necessary, and where it can. 

- model: groq/openai/gpt-oss-120b
- eval: 

As expected it does not provide any visuals. 


## Trial 5 - Learning App with Copilot

Using Copilot to create the learning app. 

- Eval: Unsuccessful. It created a one question quiz lesson. Smaller than expected. More clarity, in instructions and examples, is needed to execute this format better. The only location mentioned was Easton. The other sections were titled 'Said', 'County', 'Info', 'All', and 'Center', but it all included the same information. The same 'Why it matters explanation for three stories. 

I am happy it is possible though. This gives hope for different formats to be created, visual ones too, with the help of copilot. 

## Evaluation

Overall, between the learning app and pitch deck format, what dictates a good Beat Book is what provides the most of what you are looking for. If it is detail and narrative, a training guide is best because it can give you the most information. If it is a quick debrief, then the pitch deck format is great. 

It was difficult to experiment with the learning app style because it delivered the results in a how to guide to create the app, rather than giving me the information from filtered_stories.json as a learning app. This is probably because the LLM is not familiar with creating apps so it did not know how to present the information that way, but could give me a guide in creating one.

Switching to copilot to try to create the app was a good idea but the output was unsuccessful. Definitely needs more guidance in what is expected. A different format than the way we've been writing prompts. Maybe step by step?

I was content with the pitch deck's delivery of the information but it lacked detail. If I was a seasoned reporter coming to Talbot for the first time, I think I could do well with the pitch deck style, but a newly graduated reporter moving to Talbot, the training guide would suite them better. 