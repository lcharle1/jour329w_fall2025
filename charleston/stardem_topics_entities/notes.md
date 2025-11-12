# Star-Dem Topic Entities

11/10/2025

## Topic: Race and Diversity 

This topic interested me because I am curious how race and diversity is reported in this part of Maryland and any patterns regarding the coverage. Race and Diversity is an umbrella term for anything involving a specific demography/ethnicity/etc. Race and Diversity could include stories focused on crime, education, art and culture, economy, and more. 

# stories_with_entities_v1
- model: - groq/openai/gpt-oss-120b
- Topic: Race and Diversity 
- prompt variations: I added Cat's county and municipalities list to my prompt so it would have a better perspective on the locations I am referring too. It will help better the location and the extent of results I want it to be. This helped not just geographically but also for naming publications (a new metadata I added). 

Another prompt variations was including definitions to the topic categories I listed. Though I was content with the results I received without it, I wanted to test and see the results I would get with more specification. 

I removed my 'type of journalism' and 'trump administration' metadatas. They were more catered to my previous topic, immigration, and the primary/secondary topics metadata accomplishment the same job as the 'type of journalism' metadata. 

In the people metadata, I specified listing the position and/or title of individuals. Previously it did a better job at naming people but it did not provide professions.


- evualtion: My additions were partially successful. I ran into nulls in the secondary topics option, as requested for stories it did not see necessary. Clutter of information was on my mind as I saw Cat's prompt response showing the primary and secondary responses, and repitition and doubting. To make the process smoother for whoever uses the Beat Book, I made it optional so there is not too much information thrown at the journalist, but to also test the LLM's perception of what is definitively one topic or what could use a secondary topic. 

Not everyone in a story is being listed, but the description in the person's profession is getting better. It was able to find the person and their profession, but it is missing some people. For the story: Federalsburg elects first two Black council members in historic election, September 27, 2023 | Star Democrat, The (Easton, MD), the LLM mispelled the interim mayor's name. In the story it is Kristy, but it spelled it as Kristi. I am going to emphaize keeping the same name and listening every individual interviewed and referenced in the article. While it was missing individuals, it took the authors from the articles and listed them as people rather than the people in the article. 

I added a metadata to list which publication the article came from and the results were three different ways of the Star Democrat. But it fulfill my wishes of including the publciation, county, and city. For future uses, I think this will be very helpful to quickly see and know where the article is coming from. 


# stories_with_entities_v2
- 