Laura Charleston 9/22/2025


Laura Charleston 9/23/2025
# cns_tags assignment
In your notes.md file, describe what the data is and how it's organized. Can you tell what the most popular tags are? How would you describe determining which were the most common tags?

1. This is a categorized JSON list of CNS tags and their article. You cannot tell that it is supposed to be listing the most popular tags, and none of the articles include a description, despite it being a category in the list. Determining what the most common tags are would be a strenuous process of looking through each link, listing the tags, and seeing how many overlaps there are. 

Choose a story and click on the link, then read the story. Put the URL and the title of the story in your `notes.md` file.
1. Short films and screenplays highlighted District film festival’s 16th year: https://cnsmaryland.org/2019/10/03/short-films-and-screenplays-highlighted-district-film-festivals-16th-year/ 

Run the following command in Terminal, replacing YOUR_URL with the actual URL. We'll be using a model called Kimi-K2 for this.
1. Command: uv run python -m newspaper --url=https://cnsmaryland.org/2025/09/19/trump-administration-warns-maryland-against-dei-contracts-in-key-bridge-rebuild/ -of=text | uv run llm -m groq/moonshotai/kimi-k2-instruct-0905 "You are an expert at categorizing topics for news stories. Read the text and provide no more than 5 topics."
2. Response: 
- Infrastructure Policy
- Federal-State Relations
- DEI / Affirmative-Action Contracting 
- Budget & Oversight Disputes
- Trump-Moore Political Feud

Evaluation: 
- For the most part the tags are brief and relevant to the story. 'Budget and Oversight Disputes' could be replaced because there isn't much dispute over tax dollars being wasted - though Wes Moore made a point that tax dollars are not being wasted, which is probably why it noted it - but instead the legality of how contracts are being awarded. So 'Contracting Disputes' or 'Contracting Legalities' could be alternatives. The word choice might not be realistic when it comes to people searching for tags or stories. If I were looking for the same story, I would use 'Bridge Construction' rather than 'Infrastructure Policy'. I tested this theory and searched 'Bridge Construction' in the CNS search bar, and my story was the first one up. I searched 'Infrastructure Policy' and it was not listed in the results. 
- Following my searching experiment, I wrote the prompt question: "You are an expert at categorizing tags for news stories. Read the text and provide no more than 5 tags a college student would use to search for the story." It gave me: Key Bridge collapse; Trump DEI warning; Maryland infrastructure; Federal funding politics; Baltimore reconstruction. 4/5 of the new tags popped up in the search. Key Bridge collapse: 2 page, 2nd option; Trump DEI warning: 1 page, 1st option; Maryland infrastructure: 1 page, 3rd option; Federal funding politics: 0; Baltimore reconstruction: 2nd page, 1st option. In all, the word choice of the tags matters a lot, whether people will actually think of these terms or not. 
- Command used for my new question: uv run python -m newspaper --url=https://cnsmaryland.org/2025/09/19/trump-administration-warns-maryland-against-dei-contracts-in-key-bridge-rebuild/ -of=text | uv run llm -m groq/moonshotai/kimi-k2-instruct-0905 "You are an expert at categorizing tags for news stories. Read the text and provide no more than 5 
tags a college student would use to search for the story."

Evaluation on the assignment process: Was it easy to think of changes? Was it too repetitive? What do you think a better workflow would look like? Be creative: if you could control the whole process, how would it differ?
- The process was easy to follow and resolve. One issue I came across was that after populating 20 different tags, there was no link for me to click on. I figured out how to slightly change the line of code so the results would include a like as well. The format of these assignments is repetitive, but I like it that way. The way specific commands are presented as examples and require following step-by-step instructions helps me because we go through new types of tools and commands quickly, and I will forget the basics just as quickly. I wouldn't change the style of the workflow at all. I was proud of myself for finding the link solution on my own though. The way the assignment is formatted, how easy it is to read and understand the line of code I am copy and pasting does, I can edit it if needed. 
