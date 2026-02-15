# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AstroPaper v5.5.1 blog — an Astro-based static site with Tailwind CSS 4, TypeScript, and Pagefind search. Uses pnpm as package manager (v10.11.1). Requires Node 20+.

## Commands

```bash
pnpm run dev              # Dev server at localhost:4321
pnpm run build            # Type check → Astro build → Pagefind index → copy to public
pnpm run preview          # Preview production build
pnpm run format           # Format with Prettier
pnpm run format:check     # Check formatting
pnpm run lint             # ESLint
pnpm run sync             # Generate Astro TypeScript types
```

## Architecture

**Content:** Blog posts live in `src/data/blog/` as Markdown files. Subdirectories become part of the URL path unless prefixed with `_` (e.g., `_releases/` is excluded from URLs). Frontmatter requires `title`, `pubDatetime`, and `description`.

**Routing:** File-based via `src/pages/`. Post pages at `posts/[slug]`, tags at `tags/[tag]/[page]`, paginated list at `posts/[page]`.

**Configuration:** Site settings in `src/config.ts` (SITE object). Social links and share buttons in `src/constants.ts`. Content collection schema in `src/content.config.ts`.

**Styling:** Tailwind CSS 4 with CSS custom properties in `src/styles/global.css`. Typography prose styles in `src/styles/typography.css`. Font is Jost. Max content width controlled by `max-w-app` utility (42rem).

**Theme:** Dark/light mode via `src/scripts/theme.ts`. CSS variables switch between modes. Dark is default.

**OG Images:** Dynamically generated using Satori + resvg. Templates in `src/utils/og-templates/`. Google font loaded for OG images via `src/utils/loadGoogleFont.ts`.

**Code Highlighting:** Shiki with night-owl (dark) and min-light (light) themes. Custom transformers in `src/utils/transformers/`.

**Path alias:** `@/*` maps to `./src/*`.

## Key Conventions

- Posts with `draft: true` are excluded from production builds
- Scheduled posts (future `pubDatetime`) have a 15-minute visibility margin
- Tags are slugified and deduplicated via `src/utils/slugify.ts`
- Post filtering logic is in `src/utils/postFilter.ts`; sorting in `src/utils/getSortedPosts.ts`
- CI runs lint, format check, and build on PRs (`.github/workflows/ci.yml`)
