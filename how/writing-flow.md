# Writing Flow

## Blog Posts

**1. Start a new draft**

```bash
pnpm new-post "Post Title"
```

This slugifies the title, creates `src/data/blog/{slug}.md` with `draft: true`
frontmatter pre-filled (title, `pubDatetime` set to now, a placeholder
description, `tags: [tag]`, `featured: false`), and drops in the scaffold body
from `src/data/_templates/blog.md`. Refuses to run if a post already exists at
that path.

**2. Write**

Fill in the description, replace the placeholder tags, and write the post.
While `draft: true` is set, the post is visible in `pnpm run dev` (so you can
preview it at `http://localhost:4321/blog/{slug}/`) but never in production
builds.

**3. Publish**

```bash
pnpm publish-post <slug>
```

This removes `draft: true` and bumps `pubDatetime` to the current time (pass
`--keep-date` to keep the original `pubDatetime` instead — useful for
backdating). Before publishing, it validates that:

- `description` isn't missing, empty, or still the placeholder
- the body doesn't still contain template artifacts (`Opening paragraph. Set
  the tone here...`, `*Last thought or closing line.*`, or literal `Body
  content.` / `More content.` sections)
- `tags` doesn't still contain the literal placeholder `tag`

If validation fails, it reports every failing check at once and exits without
touching the file. If the post is still sitting in `src/data/blog/_drafts/`,
`publish-post` moves it out to `src/data/blog/` automatically before
validating.

It goes live on the next build/deploy once it passes.

---

## Library Notes

**Option A — Manual**

Copy `src/data/_templates/library.md`, fill in the frontmatter, write your
notes, and save it as `src/data/library/book-slug.md`.

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

By ISBN:

```bash
pnpm add-book <isbn>
```

Or search by title (uses the first Google Books match):

```bash
pnpm add-book --title "Book Title"
```

Example:

```bash
pnpm add-book 9780743273565
```

The script will:

- Look up the book on Google Books (by ISBN or title)
- Download the best available cover image to `src/assets/images/library/`
- Create a Markdown file at `src/data/library/{slugified-title}.md`, using the
  body sections from `src/data/_templates/library.md`
- Mark the entry `draft: true` — new books start hidden from production
  builds but are visible in `pnpm run dev`, so you can write notes at your own
  pace before publishing

Pass `--date-read=YYYY-MM-DD` to set `dateRead` directly instead of defaulting
to today:

```bash
pnpm add-book 9780743273565 --date-read=2026-01-15
```

### 4. Fill in the date (if you skipped --date-read)

Open the generated file and set `dateRead` to the date you finished the book
(ISO format `YYYY-MM-DD`):

```yaml
---
title: "The Great Gatsby"
bookAuthor: "F. Scott Fitzgerald"
genre:
  - "Fiction"
coverImage: "../../assets/images/library/the-great-gatsby.jpg"
dateRead: 2026-01-15   # ← update this if you didn't pass --date-read
isbn: "9780743273565"
draft: true            # ← remove once notes are written
---
```

### 5. Add notes, then publish

Write your reading notes in the body of the Markdown file, then remove
`draft: true` from the frontmatter once you're ready for it to appear in
production.

### Edge cases

| Situation | Behaviour |
|---|---|
| No cover image found | Copies `src/assets/images/library/_placeholder.jpg` |
| No categories from Google | Defaults to `["Uncategorized"]` |
| Duplicate title slug | Appends `-2`, `-3`, etc. to avoid overwriting |
| Missing API key | Exits with a clear error message |
| ISBN or title not found | Exits with a clear error message |
| Neither ISBN nor `--title` given | Exits with usage instructions |

---

## Checking Content Before Publishing

```bash
pnpm check-content
```

A build guard that scans `src/data/blog/` and `src/data/library/` (skipping
`_`-prefixed files/dirs) and reports:

- **ERROR** — blog filenames that aren't kebab-case
- **ERROR** — for published blog posts (no `draft: true`): missing/placeholder
  description, leftover template artifacts, or the literal `tag` placeholder
  still in `tags`
- **WARN** — for published library notes: an empty body or one that's still
  just the `<!-- Add your notes here -->` placeholder (this doesn't fail the
  build — several existing notes are like this)

Exits 1 if any ERRORs are found, 0 otherwise. `pnpm run build` runs this
automatically after the type check and before the Astro build, so bad content
fails CI before it fails in production.

---

## Visibility Rules

Applies to both blog posts and library notes.

| Condition | Dev | Prod |
|---|---|---|
| File in `_drafts/` | Not processed at all | Not processed at all |
| `draft: true` anywhere | Visible | Never visible |
| No `draft`, past `pubDatetime` | Visible | Visible |
| No `draft`, future `pubDatetime` | Visible | Hidden until 15min before |

Library notes support `draft: true` the same way blog posts do — new entries
created by `pnpm add-book` start as drafts so you can write notes over time
without them showing up in production.

---

## Reference

- Blog template: `src/data/_templates/blog.md`
- Library template: `src/data/_templates/library.md`
- Typography reference post: viewable in dev mode only — navigate to `http://localhost:4321/blog/typography-reference/` to preview all typography elements
- Typography element docs: `docs/typography-reference.md`
