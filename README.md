# The Inner Dialogue

A personal blog about writing, tools, and thinking more clearly — built on [AstroPaper v5.5.1](https://github.com/satnaing/astro-paper).

**Live site:** [khushilkataria.com](https://khushilkataria.com/)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## Features

- [x] Type-safe markdown with Astro content collections
- [x] Fast static site with Pagefind full-text search
- [x] Light & dark mode (dark default)
- [x] Dynamic OG image generation (Satori + resvg)
- [x] SEO-friendly — sitemap, RSS feed, canonical URLs
- [x] Responsive and accessible
- [x] Draft posts & scheduled posts
- [x] Code highlighting via Shiki (night-owl / min-light themes)
- [x] Pagination on post listings and tag pages

## Project Structure

```
/
├── public/
│   ├── pagefind/          # auto-generated on build
│   ├── favicon.svg
│   └── og.png
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/          # blog posts as .md files
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   ├── utils/
│   ├── config.ts          # site-wide settings (SITE object)
│   ├── constants.ts       # social links & share buttons
│   ├── content.config.ts  # content collection schema
│   └── env.d.ts
└── astro.config.ts
```

Blog posts live in `src/data/blog/` as Markdown files. Subdirectories become part of the URL path unless prefixed with `_` (excluded from URLs). Frontmatter requires `title`, `pubDatetime`, and `description`.

## Tech Stack

| Layer             | Tool                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Framework         | [Astro 5](https://astro.build/)                                                           |
| Language          | [TypeScript](https://www.typescriptlang.org/)                                             |
| Styling           | [Tailwind CSS 4](https://tailwindcss.com/)                                                |
| Search            | [Pagefind](https://pagefind.app/)                                                         |
| OG Images         | [Satori](https://github.com/vercel/satori) + [resvg](https://github.com/RazrFalcon/resvg) |
| Code Highlighting | [Shiki](https://shiki.style/)                                                             |
| Icons             | [Tabler Icons](https://tabler-icons.io/)                                                  |
| Formatting        | [Prettier](https://prettier.io/)                                                          |
| Linting           | [ESLint](https://eslint.org/)                                                             |
| Deployment        | [Cloudflare Pages](https://pages.cloudflare.com/)                                         |

## Running Locally

Requires **Node 20+** and **pnpm 10**.

```bash
# install dependencies
pnpm install

# start dev server at localhost:4321
pnpm run dev
```

## Commands

All commands are run from the project root:

| Command                 | Action                                       |
| :---------------------- | :------------------------------------------- |
| `pnpm install`          | Install dependencies                         |
| `pnpm run dev`          | Start dev server at `localhost:4321`         |
| `pnpm run build`        | Type-check → build → generate Pagefind index |
| `pnpm run preview`      | Preview production build locally             |
| `pnpm run format`       | Format with Prettier                         |
| `pnpm run format:check` | Check formatting                             |
| `pnpm run lint`         | Lint with ESLint                             |
| `pnpm run sync`         | Generate Astro TypeScript types              |

## Configuration

Site settings are in `src/config.ts` (SITE object). Key fields:

```ts
export const SITE = {
  website: "https://khushilkataria.com/",
  author: "Khushil Kataria",
  desc: "A personal blog about writing, tools, and thinking more clearly.",
  title: "The Inner Dialogue",
  // ...
};
```

## Google Site Verification (optional)

Add this to your `.env` file to include the verification meta tag:

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value
```

## License

MIT License — based on [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev).
