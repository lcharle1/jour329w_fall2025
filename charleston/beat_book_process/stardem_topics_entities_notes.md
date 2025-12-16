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
- Model: groq/moonshotai/kimi-k2-instruct-0905
- Topic: Race and Diversity
- Prompt variations: I specified 'correctly spell the names and position and/or title of every interviewed and referenced individuals', after the Kristy vs. Kristi results in v1. 

- evaluation: The issue I had with the interim town manager is resolved, the name of the woman is correct in the metadata people column. 

My continued problem is missing people and institutions in articles. The Realtors holding summit on diversity, equity September 1, 2023 | Star Democrat, The (Easton, MD) article is missing some institutions (like Morgan University), locations (Waterfowl Building on Harrison Street in Easton), and people. 


# Accuracy Assessment
- As mentioned above, no. Each version has their respective or continued hiccups in accuracy. 
- I did not notice any entities I felt were false positives or negatives. I felt every story had a good reason to be involved in Race and Diversity. 
- In version one I would say no because the problem of Kristy vs. Kristi is there, but in version two its resolved. There is a possibility other incorrect duplicates are there in other metadata categories, so this is a prompt edit I want to make. 

# Entity Quality
- People: In the first version I was running into incorrect duplicate problems, for example Kristy vs. Kristi. That problem specifically resolved but in the second version I noticed I am still running into problems of the LLM not noticing people. In one article, 	Mid-Shore native appointed to Maryland Commission on African American History and Culture January 31, 2024 | Star Democrat, The (Easton, MD),  it only mentioned two people but I noted a lot of people were missing. 
- Places: The locations are very general. Basic counties and a few specific places, but it is missing building names, streets (addresses), and other. 
- Organizations: The organization or institution names were also lacking. In the same article, Mid-Shore native appointed, there are a lot of associations, organizations, centers and more.

# Comparison Between Models/Prompts
-   For the first version, I changed the prompt to be more specific with first and last names and positions and/or title, I added counties and their municipalities to be more specific with locatons, and listed the different topic categories definitions. It helped identify certain people and places and categorized the articles correctly, in my eyes, but there was still some room for improvments. The second time around a few of my problems was resolved - the incorrect duplicates - but others continued - the lack of places, people, and institutions. 
- The second model was: gpt-oss:120b, and I felt it did better, despite it's continued issues. 
- I have not found a pattern or systematic difference yet in how the entities are extracted but I want to loose further at articles missing singificant amount of names, places, and institutions and see why they did not get recognized. Is it the length of the story? Does the LLM only see the first few mentioned of the metadata.
