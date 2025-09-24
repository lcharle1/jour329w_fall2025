# CNS Embeddings

Continuing our work with CNS stories, this assignment will have you generate and explore embeddings from news stories using an embeddings model. This will allow you to make better sense of the ideas and topics in a larger set of stories.

### Getting Started

In your class repository, open a codespace and do the following:

1. In the Terminal, cd into the directory with your last name.
2. Create a directory called cns_embeddings using mkdir
3. cd into that new directory
4. Create a file called notes.md using touch. Keep that file open.
5. Open that document and put "CNS Embeddings" and today's date at the top, then save it
6. Do cd .. twice to get back to the main directory (/workspaces/jour329w_fall2025)
7. In the Terminal, do the git add, commit, pull and push your changes as described in the `setup.md` file.

### Setup

1. Update from upstream: 

```{bash}
git fetch upstream
git merge upstream/main
```

2. You'll need to add some Python libraries using `uv` in the Terminal: `uv add pandas pyarrow ijson embedding-atlas`
3. Wait for it to finish
4. Create the embeddings: `uv run embedding-atlas data/cns_maryland_posts.parquet --text content`
5. Wait for it to finish
6. Go to the Ports tab of the Terminal and click on the globe icon under "Forwarded Address"

### Explore

In `notes.md`, describe your initial impressions of the visualization of the CNS stories. Click on them and see if you can tell how they are grouped together. Describe some of the larger groupings. Does this help you understand CNS coverage better? What would be more useful?

When you are finished, add, commit and push your changes:

```{bash}
git add .
git commit -m "replace with your commit msg"
git pull origin main
git push origin main
```

Submit the link to your `notes.md` file in ELMS.