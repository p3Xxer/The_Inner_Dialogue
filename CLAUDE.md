# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AstroPaper v5.5.1 blog — an Astro-based static site with Tailwind CSS 4, TypeScript, and Pagefind search. Uses pnpm as package manager (v10.11.1). Requires Node 20+. Dark-only (`lightAndDarkMode: false` in `src/config.ts`).

## Commands

```bash
pnpm run dev              # Dev server at localhost:4321
pnpm run build            # Type check → Astro build → Pagefind index → copy to public
pnpm run preview          # Preview production build
pnpm run format           # Format with Prettier
pnpm run format:check     # Check formatting
pnpm run lint             # ESLint
pnpm run sync             # Generate Astro TypeScript types

# Library management (requires GOOGLE_BOOKS_API_KEY in .env)
pnpm add-book <isbn>      # Fetch from Google Books, download cover, create src/data/library/<slug>.md
pnpm remove-book <slug>   # Remove markdown + cover image
```

## Architecture

**Content collections** (defined in `src/content.config.ts`):
- `blog` — posts at `src/data/blog/`. Required frontmatter: `title`, `pubDatetime`, `description`. Supports `tags`, `draft`, `featured`, `ogImage`.
- `library` — books at `src/data/library/`. Required frontmatter: `title`, `bookAuthor`, `genre` (array), `coverImage`, `dateRead`. Optional: `isbn`. Cover images stored in `src/assets/images/library/`.

**Routing** (file-based via `src/pages/`):
- Blog: `/blog/[...slug]/` (post detail), `/blog/[...page]/` (paginated list)
- Library: `/library/` (grid with client-side genre filter), `/library/[slug]/` (book detail)
- Tags: `/tags/[tag]/[...page]/`

**Configuration:** Site settings in `src/config.ts` (SITE object). Social links and share buttons in `src/constants.ts`.

**Design system** (`src/theme.ts` — single source of truth):
- `colors` — all hex values. Never hardcode colors elsewhere; always reference from here.
- `cssVars` — maps CSS var names to colors. `Layout.astro` generates `:root { ... }` by iterating this at build time.
- `typography` — `blogMaxWidth` (42.5rem), `libraryMaxWidth` (68.75rem).
- Tailwind utilities consume the CSS vars via `@theme inline` in `src/styles/global.css`.

**Styling:** Tailwind CSS 4 with CSS custom properties. Typography prose styles (hand-rolled `.app-prose`) in `src/styles/typography.css`. Font is iA Writer Mono (loaded via `@fontsource` in `Layout.astro`).

**OG Images:** Generated with Satori + resvg. Templates in `src/utils/og-templates/`. Font loaded from `@fontsource` `.woff` files via `src/utils/loadGoogleFont.ts` — Satori does not support WOFF2.

**Code highlighting:** Shiki with single `vitesse-dark` theme. Custom transformers in `src/utils/transformers/` (filename display, diff notation, highlights).

**Path alias:** `@/*` maps to `./src/*`.

## Key Conventions

- Posts with `draft: true` are excluded from production builds
- Scheduled posts (future `pubDatetime`) have a 15-minute visibility margin
- Tags are slugified and deduplicated via `src/utils/slugify.ts`
- Post filtering in `src/utils/postFilter.ts`; sorting in `src/utils/getSortedPosts.ts`
- Library books sorted by `dateRead` descending (`src/utils/getSortedBooks.ts`)
- Subdirectories prefixed with `_` (e.g., `_releases/`) are excluded from URLs by the glob loader
- CI runs lint, format check, and build on PRs (`.github/workflows/ci.yml`)
