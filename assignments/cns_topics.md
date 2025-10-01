# CNS Topic Analysis and Refinement

Capital News Service covers a range of stories across many different topic areas. The topic list that I've provided includes different categories that were originally designed for general policy areas. However, CNS has its own unique focus and story patterns that may not perfectly align with this system.

### Your Task

Your job is to analyze the current topic list and propose changes based on your understanding of what CNS actually covers. The goal is **not to expand** the list but to make it more coherent and more reflective of CNS's actual coverage patterns. You should:

1. Reduce redundancy by consolidate overlapping categories
2. Improve clarity by making topic definitions clearer and more distinct
3. Ensure topics match what CNS actually covers
4. Maintain important coverage areas

### Getting Started

1. In the Terminal, cd into the directory with your last name
2. Create a directory called `cns_topics` using mkdir
3. cd into that new directory
4. Create a file called `notes.md` using touch and open it
5. Put "CNS Topic Analysis" and today's date at the top, then save it

### Research Phase (you should spend the bulk of the time on this part)

Before making changes, you need to understand what CNS actually covers:

#### 1. Browse CNS Stories
- Go to [cnsmaryland.org](https://cnsmaryland.org) 
- Look through recent stories (from the last year or two)
- Pay attention to:
  - What types of stories appear most frequently?
  - What Maryland-specific topics come up repeatedly?
  - Are there coverage areas that seem over-represented in the topic list?
  - Are there coverage areas that seem under-represented?

#### 2. Use Your Tag Browser
- Go back to your CNS tag browser (http://localhost:8000 if your server is still running)
- Search for and examine high-count tags (50+ posts, 25+ posts, etc.)
- Look for patterns:
  - Which government levels get the most coverage? (state, local, federal)
  - What policy areas appear most in tag names?
  - Are there Maryland-specific themes that deserve their own categories?
  - Do you see topic overlap in the tags?

#### 3. Document Your Observations
In your `notes.md`, describe:
- Current topics that seem too broad or too narrow
- Topics that seem to overlap significantly
- Any Maryland-specific topics that seem important

### Refine the Topics

Now analyze the current topic list in `data/topics.csv`:

#### Current Topic List
Copy this list into your `notes.md` file and work with it there:

```
1. Agriculture and Food
2. Animals
3. Armed Forces and National Security
4. Arts & Culture
5. Civil Rights
6. Commerce
7. Congress
8. Justice
9. Budget
10. Education
11. Elections
12. Emergency Management
13. Energy
14. Environmental Protection
15. Families
16. Economy
17. Trade
18. Maryland Government and Politics
19. Federal Government and Politics
20. Health
21. Housing
22. Immigration
23. International Affairs
24. Labor and Employment
25. Law
26. Native Americans
27. Natural Resources
28. Science & Technology
29. History
30. Social Welfare
31. Sports
32. Taxes
33. Transportation and Public Works
34. Chesapeake Bay
35. Baltimore
```

Some questions to consider:

Is the topic definition clear and distinct?
Does this topic overlap significantly with others?
Is this topic important for Maryland coverage?
How often does CNS cover this topic?
Could this be combined with another topic?

### Your Topics

In your `notes.md` file, create a section called "Revised Topic List" with:

1. Your new consolidated list (aim for no more than 35 topics, and ideally less)
2. Brief descriptions for any new or significantly changed topics
3. A clear explanation of what you combined and why

**Remember:** The goal is to make the topic system work better for CNS, not to create a perfect classification system. If you use an LLM or Copilot to help with this, be sure to copy your conversation into the `notes.md` file. If you use Copilot, change "Agent" to "Ask".

### Submission

When finished:
```bash
git add .
git commit -m "CNS topics changes"
git pull origin main  
git push origin main
```

Submit the link to your `notes.md` file in ELMS.
