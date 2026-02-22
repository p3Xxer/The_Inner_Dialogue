# Writing Flow

## Blog Posts

**1. Start a new draft**

Copy `src/data/blog/_drafts/_template.md`, fill in the frontmatter, start writing. The file stays in `_drafts/` — completely invisible, not processed by Astro.

**2. Ready to preview**

Move the file to `src/data/blog/your-post-slug.md` with `draft: true`. Run `pnpm run dev` and visit `http://localhost:4321/blog/your-post-slug/` to see it rendered. It will also appear in the feed in dev — that's expected.

**3. Ready to publish**

Remove `draft: true` from the frontmatter. It goes live on next build/deploy.

---

## Library Notes

**Option A — Manual**

Copy `src/data/library/_drafts/_template.md`, fill in frontmatter, write your notes. Move to `src/data/library/book-slug.md` when ready.

**Option B — Use the script**

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

Write your reading notes in the body of the Markdown file below the frontmatter.

### Edge cases

| Situation | Behaviour |
|---|---|
| No cover image found | Copies `src/assets/images/library/_placeholder.jpg` — add this file once if you want a fallback |
| No categories from Google | Defaults to `["Uncategorized"]` |
| Duplicate title slug | Appends `-2`, `-3`, etc. to avoid overwriting |
| Missing API key | Exits with a clear error message |
| ISBN not found | Exits with a clear error message |

---

## Visibility Rules

Applies to both blog posts and library notes.

| Condition | Dev | Prod |
|---|---|---|
| File in `_drafts/` | Not processed at all | Not processed at all |
| `draft: true` anywhere | Visible | Never visible |
| No `draft`, past `pubDatetime` | Visible | Visible |
| No `draft`, future `pubDatetime` | Visible | Hidden until 15min before |

---

## Reference

- Blog template: `src/data/blog/_drafts/_template.md`
- Library template: `src/data/library/_drafts/_template.md`
- Typography reference post: viewable in dev mode only — navigate to `http://localhost:4321/blog/typography-reference/` to preview all typography elements
- Typography element docs: `docs/typography-reference.md`
