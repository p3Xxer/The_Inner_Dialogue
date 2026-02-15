# Blog Setup Guide

## Stack

- **Framework:** Astro (static site generator with component support for React/Svelte/Vue)
- **Hosting:** Cloudflare Pages (unlimited bandwidth, auto-deploy from Git, edge CDN, free SSL)
- **Domain:** Cloudflare Registrar (at-cost pricing, integrated DNS)

## Why Astro

- Ships zero JS by default, only hydrates interactive components
- Use React, Svelte, Vue, or Solid components in your pages
- MDX support — embed interactive components inside blog posts
- Content collections API with type-safe frontmatter schemas
- Vite-based — standard DX, full npm ecosystem access
- Style with Tailwind, CSS modules, Sass, or plain CSS

## Why Cloudflare Pages

- Unlimited bandwidth and sites on free tier
- Auto-builds and deploys on `git push`
- Global edge CDN
- Free SSL, analytics, DDoS protection, and WAF
- Cloudflare Workers available for server-side logic (100k requests/day free)
- Cloudflare R2 for image storage if needed (10GB free)

## Starter Themes

- [Astro Paper](https://github.com/satnaing/astro-paper) — clean, minimal, Tailwind-based
- [Astro Nano](https://github.com/markhorn-dev/astro-nano) — ultra-minimal
- [Starlight](https://starlight.astro.build/) — docs-style blog by the Astro team
- Official blog template via `npm create astro@latest -- --template blog`

## Prerequisites

- Node.js 18.17.1+ (20+ recommended)

## Setup

### 1. Create the project

```bash
# From a theme
git clone https://github.com/satnaing/astro-paper.git myblog
cd myblog
npm install
npm run dev

# Or from the official template
npm create astro@latest -- --template blog
```

### 2. Configure your site

Set your site URL in `astro.config.mjs` (required for sitemap and RSS to work):

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
```

### 3. Write content

Posts go in `src/content/blog/` as Markdown or MDX files with frontmatter:

```markdown
---
title: "My First Post"
description: "Hello world"
pubDate: 2026-02-15
---

Your content here.
```

> **Note:** AstroPaper uses `pubDatetime` instead of `pubDate`. Use whichever matches your theme's schema.

If using the official template, you'll also need a content config file at `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

### 4. Test locally

```bash
npm run build && npm run preview
```

Visit `http://localhost:4321` to verify the production build before deploying.

### 5. Deploy to Cloudflare Pages

1. Push your project to a GitHub repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → Create a project
3. Connect your GitHub repo
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy

Every `git push` to your main branch auto-deploys the site.

### 6. Connect your domain

1. Register a domain on [Cloudflare Registrar](https://dash.cloudflare.com/?to=/:account/domains/register)
2. In your Pages project → Custom domains → Add your domain
3. DNS is configured automatically since both are on Cloudflare

## SEO

- Add sitemap: `npx astro add sitemap` — auto-generates `sitemap.xml` on build (requires `site` in config)
- Add RSS feed: `npm install @astrojs/rss` — then create `src/pages/rss.xml.js` ([see docs](https://docs.astro.build/en/guides/rss/))
- Add Open Graph and Twitter meta tags in your layout's `<head>` for social link previews
- Add a `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://yourdomain.com/sitemap-index.xml
  ```
- Submit your sitemap to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters)

## Analytics

- **Cloudflare Web Analytics** — free, privacy-friendly, already in your Cloudflare dashboard. Enable it under your Pages project settings.
- Alternatives: [Plausible](https://plausible.io/) or [Umami](https://umami.is/) (both can be self-hosted for free)

## Images & Media

- Use Astro's built-in `<Image />` component — auto-optimizes images at build time
- For media-heavy blogs, use Cloudflare R2 for storage (10GB free, no egress fees)
- For lighter blogs, committing images to your repo works fine

## Contact Form

- Use a free service like [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/)
- Or handle submissions with a Cloudflare Worker (100k requests/day free)

## Code Syntax Highlighting

- Astro uses [Shiki](https://shiki.style/) out of the box — no setup needed
- Theme is configured in `astro.config.mjs` under `markdown.shikiConfig` (see step 2)

## Security

- SSL, DDoS protection, and WAF are handled automatically by Cloudflare
- Add a Content Security Policy header via `public/_headers`:
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
    Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'
  ```

## Optional Enhancements

- **Decap CMS** — adds a `/admin` panel that commits to your Git repo for browser-based editing
- **Cloudflare Workers** — server-side logic for forms, APIs, etc.
- **Cloudflare R2** — image/media hosting with no egress fees
