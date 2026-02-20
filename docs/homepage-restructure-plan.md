# Homepage Restructure — Implementation Plan

Reference: [manuelmoreale.com](https://manuelmoreale.com/thoughts/step-aside-phone)

## Goal

Replace the current "recent posts + All Posts button" homepage with a single chronological list of ALL blog posts, grouped by year/month. Keep the hero section.

## Current State

```
Hero section (title + tagline)
  ↓
"Recent Posts" heading
  ↓
8 posts using <Card> (title + calendar icon + full date + description)
  ↓
"All Posts" button → /blog/
```

## New State

```
Hero section (title + tagline)
  ↓
2026 February          ← year/month group header
  Post Title         15th
  Post Title         12th
  ↓
2026 January
  Post Title         30th
  Post Title         22nd
  ↓
2025 December
  ...all posts, no pagination
```

## Approach

### 1. Rewrite `src/pages/index.astro`

- Keep hero section as-is
- Fetch all posts → `getSortedPosts()` → `getPostsByGroupCondition()` with a year-month grouping key
- Render each group with a heading (e.g., "2026 February")
- Under each heading, render a `<ul>` of simple one-line rows

### 2. Post Row Format

```
[Post Title]                                    [15 Feb, 2026]
```

- Title is a link (using `getPath()`)
- Date is right-aligned, muted/smaller
- One line per post, flexbox with `justify-between`
- Hover: title gets accent color or underline (matching existing link style)

### 3. Remove from `index.astro`

- `<Card>` import
- `LinkButton` + "All Posts" button
- `IconArrowRight` import
- `SITE.postPerIndex` usage

### 4. Keep

- Hero section (title + tagline)
- Header + Footer
- `backUrl` script at the bottom

### 5. Existing Utilities Used

- `getSortedPosts()` — sorts all posts by date descending
- `getPostsByGroupCondition()` — groups posts by any key function; pass a function returning `"2026 February"` from `pubDatetime`
- `dayjs` — already installed, for date formatting
- `getPath()` — generates correct URL for each post

### 6. Styling

- Group headers: `text-lg font-medium opacity-70` — visually lighter than hero
- Post rows: enough vertical padding for 44px mobile touch targets
- Date text: muted (`opacity-60`) so title is the primary visual element
- Spacing between entries (no borders, clean like the reference)

### 7. `/blog/` Route

The paginated `/blog/[...page].astro` can stay as an alternative view or be removed later. Not part of this change.
