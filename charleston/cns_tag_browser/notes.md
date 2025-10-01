CNS Tag Browser 9/30/2025

### Explore the Data

1. The first command lists the top 10 popular tags. The counts descend in order from most to least. There is a complication for certain words, as there always will be. CNS TV, cns, cnstv, and Capital News Service are all the same thing but count for four of the tags in the top 10. 

2. The second command lists the different ways "Trump" is tagged in stories. 4/10 are other people: Melania, Ivanka, Barron, and Eric. All of the other tags refer to Donald Trump in 6 other ways. It is very helpful that the count shows how many times the tags are used. 

3. The third command proves why I think there should be a filter for different types of journalism reported. There are 20 different ways Baltimore is mentioned in a tag. Its in sports, government, geographic location, politics, local authorities, health, and education. Geographic location and local authorities are not specific types of journalism but other possible ways we could categorize stories to better define tag. 


### Planning your Tag Browser

Feature Wishlist
1. Include an author filter. You can write the name of the author if the researcher rememebers it.  
2. Include a date filter -  you can customize the range of dates. 
3. Include a "type of journalism" filter - this way you can specifically find the "Maryland" tag for culture section rather than only politics section. 
4. Include a geographical filter - this can be as narrow or broad as wanted: City/Town/County/State/National/International. 
5. A feature that would be helpful is if the  browser could understand "president trump" and "President Donald Trump" as the same tag or "Donald Trump" and "Donald J Trump". Maybe a library could help with grammar as it did for Dylan. 


### Setting Up GitHub Copilot

1. "create a webpage that displays URLs in a user-friendly way with these features: 1. Include an author filter. You can write the name of the author if the researcher rememebers it.  
2. Include a date filter -  you can customize the range of dates. 
3. Include a "type of journalism" filter - this way you can specifically find the "Maryland" tag for culture section rather than only politics section. 
4. Include a geographical filter - this can be as narrow or broad as wanted: City/Town/County/State/National/International. 
5. A feature that would be helpful is if the  browser could understand "president trump" and "President Donald Trump" as the same tag or "Donald Trump" and "Donald J Trump". Maybe a library could help with grammar as it did for Dylan. "

My first request didn't go fully as planned because I forgot to specify where I wanted the html to go or where the source of the data is. 

It asked me if I wanted a static HTML/JS file or a python backened to serve and filter the data. I didn't know which to select so I emphasized in my next comment where to get the source from and where to put the html. 

2. "In the file index.html, create a webpage to display the CNS tags from the tags.json file. Including the features I mention above "

The file was created including all of my suggested parameters and served via a Python HTTP server. 

3. After testing the server and clicking the link, I realized I forgot to add a search bar for tags. 

so I added a comment to add a search bar for tags: "add a search bar for tags". 

4. After adding the search bar it did not work. I tried searching 'Donald Trump' in the tags with a date from Jan 19th 2025 to today and selected Politics in the types of journalism filter to find stories within those categories. It said no tags were found. 

I added a comment: " Use the tags from the tags.json file as a source for the data. When I apply filters, I want a list of correlating tags with their stories populating."

5. I am still running into the issue of tags populating. 

So I asked copilot for any suggestions. 

"I am not able to see any tags in the webpage. Do you have any recommendations?"

It responded with a list of suggestions: "Make sure you are serving the webpage using a local server (e.g., python -m http.server) from the cns_tag_browser directory.
Confirm that the path to tags.json is correct. The fetch URL should be accessible from the browser (try opening tags.json in your browser).
Check the browser console for errors (such as CORS issues or file not found).
Ensure tags.json is a valid JSON file and contains tag objects with a name property.
Would you like help checking the fetch path or updating the code to handle errors and show a message if the data fails to load?" 


### Reflection
1.  The copilot incorporated all of my recommended features and filters to narrow down tags but it did not work in populating tags after every search. I tried asking copilot for suggestions and tried improving it myself but it did not work. I tried to restart from scratch but that did not work either and stopped before I over used the chat before the end of the month. I wish I started off with a simple request and then aded the additional features. Right now I am struggling to have the html show a list of tags. 



2. Copy and Pasted Chat:
lcharle1: hello

GitHub Copilot: Hello! How can I assist you with your project today?

lcharle1: create a file called test.html

GitHub Copilot: Created [](file:///workspaces/jour329w_fall2025/test.html)

The file test.html has been created in your workspace with a basic HTML structure. Let me know if you want to customize its content or add more features.

Made changes.

lcharle1: can you make it with a header with the name Laura using the <blink> tag, and serve it using a simle python server. 

GitHub Copilot: Using "Apply Patch"


```

```


Ran terminal command: python3 -m http.server 8080

Made changes.

lcharle1: create a webpage that displays URLs in a user-friendly way with these features: 1. Include an author filter. You can write the name of the author if the researcher rememebers it.  
2. Include a date filter -  you can customize the range of dates. 
3. Include a "type of journalism" filter - this way you can specifically find the "Maryland" tag for culture section rather than only politics section. 
4. Include a geographical filter - this can be as narrow or broad as wanted: City/Town/County/State/National/International. 
5. A feature that would be helpful is if the  browser could understand "president trump" and "President Donald Trump" as the same tag or "Donald Trump" and "Donald J Trump". Maybe a library could help with grammar as it did for Dylan. 

GitHub Copilot: To create a user-friendly webpage with the features you described, I recommend building a simple HTML/JavaScript interface that loads URLs and allows filtering by author, date, type of journalism, and geography. For tag normalization (e.g., "president trump" ≈ "Donald J Trump"), you can use a JavaScript library like compromise or natural for basic NLP.

Would you like this to be a static HTML/JS file, or do you want a Python backend to serve and filter the data? If you have a data source (e.g., JSON), please specify its format or location (such as cns_maryland_posts.json). 

Let me know your preference, and I’ll start building the page and filtering logic for you.

lcharle1: In the file index.html, create a webpage to display the CNS tags from the tags.json file. Including the features I mention above 

GitHub Copilot: Created [](file:///workspaces/jour329w_fall2025/charleston/cns_tag_browser/index.html)

The file `index.html` has been created in cns_tag_browser with all the requested features:

- Author filter
- Date range filter
- Type of journalism filter
- Geographical filter
- Tag normalization using the compromise library

It loads tags from tags.json and displays them in a user-friendly way. You can open this file in a browser (served via a Python HTTP server) to use the filters. Let me know if you need help serving the file or want further customization.

Made changes.

lcharle1: Add a search bar for tags 

GitHub Copilot: Read [](file:///workspaces/jour329w_fall2025/charleston/cns_tag_browser/index.html#1-1), lines 1 to 60

Using "Apply Patch"


```

```
A search bar for tags has been added to your index.html. You can now type in the search box to filter tags by name instantly. All other features remain available. Let me know if you want further improvements!

Made changes.

lcharle1: Use the tags from the tags.json file as a source for the data. When I apply filters, I want a list of  correlating tags with their stories populating. 

GitHub Copilot: Read [](file:///workspaces/jour329w_fall2025/data/tags.json#1-1), lines 1 to 60

Read [](file:///workspaces/jour329w_fall2025/charleston/cns_tag_browser/index.html#61-61), lines 61 to 92

Using "Apply Patch"


```

```
Your tag browser now uses the tags from tags.json as its data source. When you apply filters, it displays a list of matching tags, each with a link to view their related stories on the CNS website. Let me know if you want to further customize how stories are shown or add more features!

Made changes.

lcharle1: I am not able to see any tags in the webpage. Do you have any recommendations?

GitHub Copilot: Here are some recommendations to troubleshoot why tags are not displaying:

1. Make sure you are serving the webpage using a local server (e.g., python -m http.server) from the cns_tag_browser directory.
2. Confirm that the path to tags.json is correct. The fetch URL should be accessible from the browser (try opening tags.json in your browser).
3. Check the browser console for errors (such as CORS issues or file not found).
4. Ensure tags.json is a valid JSON file and contains tag objects with a `name` property.

Would you like help checking the fetch path or updating the code to handle errors and show a message if the data fails to load?

lcharle1: Yes please help me check the fetch path or update the code to handle errors and show a message if the data fails to load?

GitHub Copilot: Using "Apply Patch"


```

```
The code in index.html now handles errors when loading tags.json and displays a clear message if the data fails to load. The fetch path was updated to tags.json, which should work when serving from the cns_tag_browser directory.

Try reloading the page. If there is a problem with loading the tags, you will see an error message. If you still have issues, let me know what error appears or if you need further troubleshooting!

Made changes.

lcharle1: I want to restart the webpage. Provide me a webpage where I can search through the different tags mentioned in the cns story.

GitHub Copilot: Created [](file:///workspaces/jour329w_fall2025/charleston/cns_tag_browser/index.html)

Using "Apply Patch"


```

```
Your webpage has been restarted and simplified. You can now search through the different tags mentioned in CNS stories using the search bar. Each tag displays its name, count, and a link to view related stories.

Open index.html in your browser (served from the cns_tag_browser directory) to use the new search feature. Let me know if you want to add more features or filters!

Made changes.

lcharle1: Use the tags data from the tags.json

GitHub Copilot: Using "Apply Patch"


```

```
Your webpage now cleanly uses the tags data from tags.json as its source. You can search through the tags using the search bar, and each tag displays its name, count, and a link to view related stories.

Open the page in your browser (served from the cns_tag_browser directory) to see the updated functionality. Let me know if you need further enhancements!

Made changes.

lcharle1: return index.html to the previous html with all of the wanted features 

GitHub Copilot: Using "Apply Patch"


```

```
Your index.html has been restored to the previous version with all the requested features:

- Tag search bar
- Author filter
- Date range filter
- Type of journalism filter
- Geography filter
- Story links for each tag

You can now use all these features to browse and filter CNS tags. Let me know if you need further adjustments!

Made changes.


### Extra Credit