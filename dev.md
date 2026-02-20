# Dev Notes

## Adding a book to the Library

### 1. Get a Google Books API key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable the **Books API** under *APIs & Services → Library*
4. Create an API key under *APIs & Services → Credentials*

### 2. Add the key to `.env`

Create `.env` in the project root (it is gitignored):

```
GOOGLE_BOOKS_API_KEY=your_key_here
```

### 3. Run the script

```bash
pnpm add-book <isbn>
```

Example:

```bash
pnpm add-book 9780743273565
```

The script will:

- Look up the ISBN on Google Books
- Download the best available cover image to `src/assets/images/library/`
- Create a Markdown file at `src/data/library/{slugified-title}.md`

### 4. Fill in the date

Open the generated file and set `dateRead` to the date you finished the book (ISO format `YYYY-MM-DD`):

```yaml
---
title: "The Great Gatsby"
bookAuthor: "F. Scott Fitzgerald"
genre:
  - "Fiction"
coverImage: "../../assets/images/library/the-great-gatsby.jpg"
dateRead: 2026-01-15   # ← update this
isbn: "9780743273565"
---

<!-- Add your notes here -->
```

### 5. Optionally add notes

Write your reading notes in the body of the Markdown file below the frontmatter. Standard Markdown is supported.

---

### Edge cases

| Situation | Behaviour |
|---|---|
| No cover image found | Copies `src/assets/images/library/_placeholder.jpg` — add this file once if you want a fallback |
| No categories from Google | Defaults to `["Uncategorized"]` |
| Duplicate title slug | Appends `-2`, `-3`, etc. to avoid overwriting |
| Missing API key | Exits with a clear error message |
| ISBN not found | Exits with a clear error message |
