Laura Charleston 9/26/2025

# cns_metadata

### Pick your stories
url: https://cnsmaryland.org/2025/02/18/craving-more-energy-maryland-looks-to-nuclear-power/
1. People:
- Paul Pinsky, director of the Maryland Energy Administration. 
- Del. Chao Wu, a Democrat from Howard and Montgomery counties, is a co-sponsor of the ENERGIZE Act and supports nuclear as a source of clean, affordable energy. 
- Jorge Aguilar, the southern region director for the nonprofit Food & Water Watch. 

2. Main organizations/institutions
- Maryland Energy Administration
- Maryland Land & Liberty Coalition
- The nonprofit Food & Water Watch

3. Geographic Locations
- Calvert County 
- Montgomery County 
- Howard County 

4. Two-word topics
- Nuclear Development 
- Environmental Policy
- Renewable Energy 

5. investigation, political

6. 4 

### Evaluation
1. The first thing I noticed was the people were the first few people mentioend in the article. I selected my people because of their different stances on the article. One was pro-nuclear, anti-nuclear, and someone connected to the ENERGIZE act. As a computer, I wouldn't expect to think of key differences like this because it might just see them all as just people. No one has more significance than the other. This is definitely something we loose when we use LLMs. With 50 or 500 stories, getting the first few names leaves out major plot points or new information mentioned later on. When writing, even in journalism, you mention important things at the top, but juicy bits are scattered through out to keep the reader interested in finishing the article. 

I ran this line of code:" uv run llm -c "Could you organize a list of people mentioned in the story from most to least relevant to the proposed nuclear development?"". And it produced this list:
1. Gov. Wes Moore – initiator of the ENERGIZE Maryland Act that would classify nuclear as clean and open the state to new reactors.  
2. Paul Pinsky (Maryland Energy Administration director) – top state energy official framing nuclear as key to “resource adequacy” and emissions cuts.  
3. Del. Chao Wu – co-sponsor of the ENERGIZE Act and vocal supporter of expanding nuclear in Maryland.  
4. Del. Jesse Pippy – House Minority Whip arguing nuclear is the affordable, reliable, clean fix for “self-inflicted” energy woes.  
5. Sen. Jim Rosapepe – co-sponsor of the Decarbonization Infrastructure Solutions Act that would make nuclear eligible for state procurement.  
6. Del. Lorig Charkoudian – sponsor of parallel long-term planning bills; sees eventual SMR deployment if legislation passes.  
7. Jorge Aguilar (Food & Water Watch) – leading opponent warning of cost and waste dangers.  
8. Adam Dubitsky (Maryland Land & Liberty Coalition) – advocate for relicensing Calvert Cliffs and adding new reactors to curb rate spikes.

I appreciate the emphasis on explaining their role in the story more than title. You can kind of see it's thought process and why it selected the person. Also, if someone was skimming through and had this index explaining each person quoted in the story, it helps to know who is included and why. And the LLM did get everyone in the story.


2. I also listed the Maryland Energy Administration, Food and Water Watch, and Maryland land and Liberty Coalition. MGA and PJM are two other relevant and good organizations to include.

3. The locations were good. The article mainly talked about state and county levels. The addition of Annapolis is questionable because it probbaly pulled it from the beginning of the article and not become it was relevant to the story. With 50 or 500 stories, how will we verify things like locations are mentioned because they are relevant and not the location of the publication?

Because of the Annapolis part, I asked it this question: "uv run llm -c "Could you organize a list of geographical locations mentioned in the story from most to least relevant?"". 

This was it's response:
1. Maryland – the state where the entire policy debate and proposed nuclear expansion is centered.  
2. Calvert County – site of Maryland’s only existing nuclear plant (Calvert Cliffs) that backers want relicensed and that serves as the reference point for any new build.  
3. Annapolis – state capital and venue of the legislative session driving the nuclear bills.  
4. Montgomery County – home to multiple key delegates (Wu, Charkoudian) and a focal point of both support and skepticism for the legislation.  
5. Prince George’s County – part of Sen. Rosapepe’s district and mentioned in the context of grid-operator failures affecting rates.  
6. Anne Arundel County – also within Rosapepe’s district and adjacent to the Calvert Cliffs plant zone.  
7. Frederick County – represented by Del. Pippy, a prominent GOP voice for nuclear in the debate.  
8. Howard County – co-represented by Del. Wu, another legislative champion of the ENERGIZE Act.

So there was a good reason for including Annapolis. Disregard my concern earlier. 

4. My topics were close to the topics mentioned and I am happy to see their word choice is simpler and it was no more than two-words. 

5. I believe the story is an investigative story and does not offer enough in-depth detail to be a feature story. The discussion took place at a legislative session, meaning a reporter either went to the session or later watched it, then did more research about how Maryland uses our current nuclear plant and other policies regarding clear energy and nuclear development.  

In regards to 50 and 500 stories. This could be tricky situation telling a computer the difference between different stories. This might require human verification. We could tell it to give suggested tagging, so there are different options the story could be classified as. 

I ran this line: "uv run llm -c "Provide me a list of different story types my story could classify as"". It listed me 8 different story types. So I ran this instead: "uv run llm -c "List me the top two story types my story could classify as"". It gave me feature and policy/legislation. It is adamant it is a feature story.