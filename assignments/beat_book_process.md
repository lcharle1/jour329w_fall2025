# A Guide to Making Beat Books

### Getting Started

Update from upstream:

```bash
git fetch upstream
git merge upstream/main
```

For this assignment, I want you to try to distill your notes and reflections on the process of making a beat book into a "How To" guide for someone following in your footsteps. If you had to tell someone how to do what you've done this semester, what would that look like?

In your codespace, create a beat_book_process folder inside your folder and copy the Python files and `notes.md` files from *all* of your previous assignments in that directory. Here's how to do that after you cd into your folder:

```bash
mkdir -p beat_book_process
cd beat_book_process

# Copy all .py and .md files from subdirectories, prefixing with folder name if filename would collide
for dir in ../stardem_*/ ; do
  dirname=$(basename "$dir")
  if [ "$dirname" != "beat_book_process" ]; then
    for file in "$dir"*.{py,md}; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        # Check if file already exists in beat_book_process
        if [ -f "$filename" ]; then
          # File exists, add directory prefix
          cp "$file" "${dirname}_${filename}"
        else
          # File doesn't exist, copy as-is
          cp "$file" .
        fi
      fi
    done
  fi
done
```

Then combine those files into a single text file for use in a prompt:

```bash
for file in *.py *.md; do
  echo "=== $file ===" >> combined.txt
  cat "$file" >> combined.txt
  echo "" >> combined.txt
done
```

Create a `guide_notes.md` file in your beat_book_process directory:

```bash
touch guide_notes.md
```

In `guide_notes.md`, detail your process for building your guide. You can create files for this, such as a `prompt.txt` file, and you should experiment with the format and structure. As long as you do NOT include any JSON files, you can use any model you have access to, including any of the Claude, OpenAI or Google models. Experiment with them, but be sure to save enough Copilot credits to finish your final beat book. For that reason, I recommend you do this assignment last. The guide can be in any format you choose, but it must be accessible to a non-technical person (no JSON files!).

Be sure to include any problems you weren't able to overcome and an evaluation of your draft beat book. At the end of your Copilot conversation, ask Copilot to create a narrative summary of your conversation in a file called `copilot.md`. Make sure that your guide is included in the `beat_book_process` directory.

When you are finished, add, commit and push those files and submit the URL of your `guide_notes.md` file in ELMS.