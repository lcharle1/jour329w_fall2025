# Star-Dem Entities

11/5/2025

Stories_with_entities_1: This was more of a tester running the code that worked. I did not change the prompt or metadata. 

Stories_with_entities_2: I am happy with the results. I used the groq model: groq/openair/gpt-oss-120b. I added metadata for the primary topic, inspired by Cat's work, and rewrote my prompt for the people category. I told it to list first and last names and added that it includes, but is not limited to, government officials, regular citizens, ethnicities, and more. I know regular citizens are probably not the best way to put it, but I wanted a word for the residents, but I did not want to say residents in case that would confuse the LLM. 

The rewritten prompt for people metadata: List the first and last names of individuals mentioned in the story. This includes, but is not limited to, government officials, regular citizens, ethnicities, and more, "Korean Americans", "Maryland immigrants", "President Trump", "Martinez-Hernandez"]

For the topic metadata I added a prompt that included all of the stardem topics I narrowed down to: What is the primary article topic the story fits under?", "Art and Music", "Obituary", "Education", "News", "Government and Politics", "Sports", "Health", "Economy", "Environment", "Agriculture and Farming", "Housing and Urban Planning"], 


Stories_with entities_3: I used groq model: groq/meta-llama/. I am content with the results, but some review is necessary for the secondary topics. The difference with this version of stories_with_entities is that it has the secondary topic, also inspired by Cat. The only thing I added about the metadata prompt was changing 'primary' to 'secondary' topic. I did not want the purpose of the metadata to change or the LLM to think anything differently about this metadata, so I kept it the same. After seeing the results, I would like to change the line to include that it is okay to repeat the same topic in a secondary topic if it fits. Some secondary topics I feel strayed away from. 


I ran into an issue when trying to create a SQLite database. It showed only the results for stories_with_entities_1.json and not the other json files. 
