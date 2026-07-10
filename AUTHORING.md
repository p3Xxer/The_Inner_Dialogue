# How To: Add Content

Quick reference for creating blog posts, library (book) entries, quotes, and notes. For edge cases and visibility rules, see [how/writing-flow.md](how/writing-flow.md).

## New Blog Post

```bash
pnpm new-post "Your Post Title"
```

This creates `src/data/blog/your-post-title.md` with:

- a slugified filename (no more hand-picking slugs)
- `pubDatetime` stamped for you (ISO UTC)
- `draft: true` — visible in dev, never in prod
- the standard body scaffold from `src/data/_templates/blog.md`

Then:

1. Write the post. Replace the placeholder `description` with a real one-line summary and set your `tags`.
2. Preview at `http://localhost:4321/blog/your-post-title/` (`pnpm run dev`).
3. Publish:

```bash
pnpm publish-post your-post-title        # refreshes pubDatetime to now
pnpm publish-post your-post-title --keep-date   # keeps the original date
```

`publish-post` removes `draft: true` and **refuses to publish** if the description is still the placeholder, the tags still say `tag`, or template scaffold lines are left in the body — so you can't ship a half-finished post by accident.

## New Book Entry

With an ISBN (recommended — fetches metadata and cover automatically):

```bash
pnpm add-book 9780349413686
pnpm add-book 9780349413686 --date-read=2026-05-14
```

Without an ISBN, search by title:

```bash
pnpm add-book --title "Deep Work"
```

Either way this creates `src/data/library/<slug>.md` with title, author, genre, ISBN, and a cover image downloaded to `src/assets/images/library/` (a placeholder cover is used if none is found). New entries start with `draft: true` — the book stays off the live site until you've written your notes.

Then:

1. Fix `dateRead` if you didn't pass `--date-read` (it defaults to today).
2. Write your notes in the body.
3. Remove the `draft: true` line to publish.

Manual alternative: copy `src/data/_templates/library.md` to `src/data/library/<slug>.md`, fill in the frontmatter, and place a cover image at `src/assets/images/library/<slug>.jpg` yourself.

To remove a book (deletes the markdown file and its cover):

```bash
pnpm remove-book <slug-or-title>
```

## New Quote

```bash
pnpm new-quote "Author Name"
pnpm new-quote "Author Name" --source "Where it's from"
```

This creates `src/data/quotes/author-name.md` (repeat authors get `-2`, `-3`, ... suffixes) with:

- `quoteAuthor` and `dateAdded` (today) pre-filled, plus `source` if you passed it
- `draft: true` — visible in dev, never in prod
- the placeholder body from `src/data/_templates/quote.md`

Then:

1. Replace the placeholder body with the quote — the Markdown body _is_ the quote.
2. Preview at `http://localhost:4321/quotes/` (`pnpm run dev`).
3. Remove the `draft: true` line to publish.

There's no publish script for quotes; there's nothing to validate beyond what `pnpm check-content` catches (a published quote with a placeholder body or author fails the build). Quotes appear on `/quotes/` sorted by `dateAdded`, newest first — no detail pages.

## New Note

```bash
pnpm new-note "Note Title" --topic dsa/graphs
```

This creates `src/data/notes/note-title.md` with:

- a slugified filename (note URLs stay flat — the topic never appears in the URL)
- `pubDatetime` stamped for you (ISO UTC)
- `draft: true` — visible in dev, never in prod
- the placeholder body from `src/data/_templates/note.md`

`--topic` is required and must be a slash-separated kebab-case path: `finance` for a flat topic, `dsa/graphs` for a nested one. Depth is optional — parents roll up their children on `/notes/`, so `dsa` shows everything under `dsa/...`.

Then:

1. Write the note. Replace the placeholder `description` with a real one-line summary.
2. Preview at `http://localhost:4321/notes/note-title/` (`pnpm run dev`).
3. Remove the `draft: true` line to publish. When you revisit a note later, set `modDatetime` — the index sorts by it and the note page shows "last tended".

There's no publish script for notes; `pnpm check-content` catches a published note with a placeholder description, a bad topic, or leftover template text.

## Drafts & Visibility

| State                          | Dev     | Prod   |
| ------------------------------ | ------- | ------ |
| `draft: true` (blog, book, quote, or note) | visible | hidden |
| No draft flag, past `pubDatetime` | visible | visible |
| Blog post with future `pubDatetime` | visible | hidden until ~15 min before |

## Guard Rails

`pnpm check-content` validates all content (kebab-case filenames, no leftover template placeholders in published posts) and runs automatically as part of `pnpm run build` — a bad post fails the build instead of going live.
