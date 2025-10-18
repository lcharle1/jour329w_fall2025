# CNS Collections - Immigration  

10/15/2025

# topic
Immigration, 77 stories

**Required Fields (all beats should have these):**
- **people**: Array of key people mentioned (names only)
- **geographic_focus**: Primary location (county, city, region, or "statewide")
- **key_institutions**: Organizations, agencies, companies involved
- **immigration_status**: legal immigrants, not legal immigrants, illegal immigrants, not mentioned 

# review 
- All of my LLMS failed. 
- I realized I typed "Immigration status" and not "immigration_status". I will fix the formatting to match the other metadatas
- I learned seeing 'LLM failed' for all of them had to do with the API key. I will restart from the beginning and make sure everthing works accordingly and try my metadata again.

# new errors - 10/17/2025

I am receiving this error since after this command: 'uv run datasette beat_stories.db'. This is the error: 

# Analysis and Insights 

1. Key Players: The people listed are relevant and follow the example, but it does not include everyone in the article. I updated the prompt for it to recognize and list more names by saying "List the different people, their full name, mentioned in the article". I also listed examples: "Korean Americans", "Maryland immigrants","President Trump", "Martinez-Hernandez". Some stories did not include names, when they do. One of them was a video story and it did not include any specific names.

For the next prompt I want to include titles or positions as people too, like agents. 

2. Geographic Patterns: All, if I'm not mistaken, take place in the United States. United States is the most common geographic location, followed by states (usually Maryland) and counties. One of the stories listed the U.S. Senate as a location. I tried to narrow or write a prompt so it knows what I am looking for: "List the different geographical locations in the article. For example, countries, states, counties, towns, etc.". And included examples: "United States", "Maryland", "Prince George's County". But it does not seem to be very effective. 

It did include other countries, like Jamaica and El Salvador, but sometimes it included these countries or locations in the tags but did not recognize them for the metadata_geographic_location. 

3. Institution: Similarly to the other categories, I included a prompt trying to explain further what I wanted. I said "List the different federal, state, or local, organizations involved in the article." and listed examples such as Maryland General Assembly and Trump Administration. 

It was able to detect 'Biden Administration', 'Supreme Court', and 'U.S. Senate'. Adding more examples would still benefit the assignment and mentioning something about acronyms and full names. Like DHS or Department of Homeland Security was never mentioned

4. Types of Journalism: this metadata seems to have done well. It even detected things outside of the examples, such as 'community impact', 'policy/legislative reporting', and 'Policy analysis'. 

5. True or False, Trump Administration: this metadata is used to detect whether than article found the word "trump administration" in a story or not. I think this would help find stories more community based and less federal or legislative, which most stories involving the trump administration includes. This can also be detected through institution, but the institution list can get long and this can help shorten the search. 


To get better results for all of these metadata categories. I want to try to see what type of prompt writing works best. Will finding a better prompt or listing more examples work?

The tagging system seems to be doing a better job at listing some of the metadata categories than the prompt I used for the metadata. 

Videos seem to trip the metadata up a little bit. It was not able to fill in some of the categories. Like people or institutions was left empty. 

# Evaluation 

1. Metadata revealed to me organization is not as simple as I might imagine it to be. Finding and defining each category - their differences and reason for it - can get tricky. For immigration, the stories either include legislative/federal/trump administration or it is about community impact/industry changes/jobs - these are two very generic examples - but there are overlaps when it comes to protests or certain institutions/organizations, among other overlaps. Finding a way for a new journalist to use the Beat Book to best sift through it is harder than I initially thought. Executing what I imagine is harder than I thought. I would love for it find specific ethnicities. 

I ran into issues with the port forwarding and only a column saying 'metadata_error' showed. Each row said 'LLM failed'. But the enhanced beat story json worked and showed results from the prompt I wrote. There were still some hiccups with the prompt, as they either did not find what I wanted it to find or find all of it. This is where executing what I imagine is harder than what I thought. 

2. The prototype seems useful but a lot of the results seem to be from the examples I provided. This worries me as I am not sure if it produced the results because it analyzed the articles or if it took from the examples I provided and expanded on them. 

Where it expanded:
- For the people category, more names are mentioned than in my examples and I recognize them from different stories. Steve McMurray for example is not one of my examples and was listed in the people category, but it was the only name mentioned for that story when it could have listed more names I know the article included. 
 - For the location, Mexico and Central America are not examples but listed in the metadata
 - For institutions, I used ICE as an example and only included the full name for DHS. The prototype included the full name of ICE in parenthesis.
 - Trump Administration involvement, it realized my goal with wanting to know if the article mentioned the trump administration or not and lsited the key policy areas. This gives me hope it can help gather information and organize them in a way where the new journalist will know what to do afterwards, or find inspiration for their next step. 
 
 3. I was more step by step with my prompt the next time around, for the prototype. I also included more examples. Looking at the results I think it worked better. I like my responses.

 I was more step by step and included more examples the next time, for the prototype. Looking at the results I thnk it worked better. It seems to have a better understanding of what I want from how the results have more context to the story and overall assignment. For example, including the full name of ICE with parenthesis. Though it did say just 'Department of Homeland Security' and no DHS. That could be a future problem of inconsistency. 

 4. Think of more metadata categories to create and further test the prompts. With more time and proper thought process, I think more metadata would benefit in the Beat Book. Thoroughly examining the responses for each way I wrote the prompt would tell me more on how I can better speak to the model. 