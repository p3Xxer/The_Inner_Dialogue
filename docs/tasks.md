# Task List — The Inner Dialogue Blog

Derived from `docs/blog-implementation-plan.md`, `docs/blog-design-doc.md`, and `docs/blog-setup-guide.md`.

---

## Task 1: Project scaffolding and Jost font integration ✅

**Status:** Complete (commit `43e2e24`)

- [x] Scaffold Astro Paper v5.5.1
- [x] Install `@fontsource/jost`
- [x] Remove experimental fonts API from `astro.config.ts`
- [x] Import Jost weights (400/500/600/700) in `Layout.astro`
- [x] Set `--font-app: 'Jost', sans-serif` in `global.css`
- [x] Set body `leading-[1.7]`

---

## Task 2: Custom color scheme with dark mode as default ✅

**Status:** Complete

- [x] Set `initialColorScheme = "dark"` in `src/scripts/theme.ts`
- [x] Replace CSS custom properties in `src/styles/global.css`
- [x] Verify Shiki code themes still work (night-owl dark / min-light light)
- [x] Test contrast ratios pass WCAG AA
- [x] Test theme toggle works in both directions without FOUC

---

## Task 3: Layout, content width, nav cleanup, and /posts → /blog rename ✅

**Status:** Complete

- [x] Change `max-w-app` from `max-w-3xl` (48rem) to `42rem` in `global.css`
- [x] Simplify `Header.astro` nav: Blog, About, Search icon, Theme toggle
- [x] Remove Tags nav link from header
- [x] Set `showArchives: false` in `src/config.ts` (removes Archives from nav)
- [x] Set `editPost.enabled: false` in `src/config.ts`
- [x] Empty `SOCIALS` array in `src/constants.ts`, remove unused icon imports
- [x] Rename `src/pages/posts/` → `src/pages/blog/`
- [x] Update `src/utils/getPath.ts` base path from `/posts` to `/blog`
- [x] Update `src/pages/index.astro` "All Posts" link from `/posts/` to `/blog/`

---

## Task 4: Home page customization ✅

**Status:** Complete

- [x] Replace "Mingalaba" hero in `src/pages/index.astro` with 2–3 line personal intro
- [x] Remove Socials component from hero area
- [x] Remove "Featured Posts" section
- [x] Keep "Recent Posts" section, increase `postPerIndex` to 8 in config
- [x] Verify Card component displays: title (linked), date + reading time, description

---

## Task 5: Blog post page + sample content

**Status:** Not started

- [ ] Clean up `src/layouts/PostDetails.astro`:
  - Remove ShareLinks component
  - Remove EditPost component (already disabled in config)
  - Keep title, Datetime, tags, content
  - Decide on prev/next nav and BackButton (keep or remove)
- [ ] Verify typography in `src/styles/typography.css` works well with Jost at 1.7 line-height
- [ ] Create 2–3 sample posts in `src/data/blog/`:
  - One with headings, paragraphs, links, blockquote
  - One with code blocks (verify Shiki themes)
  - One with lists, images, inline code
- [ ] Delete default Astro Paper sample posts from `src/data/blog/`

---

## Task 6: About page ✅

**Status:** Complete

- [x] Edit `src/pages/about.md` with placeholder content:
  - Who you are (2–3 sentences)
  - What you write about
  - How to reach you
- [x] Verify it renders correctly in both dark and light mode (uses `app-prose` + `AboutLayout.astro` — same styling pipeline as posts)

---

## Task 7: SEO, security headers, and analytics ✅

**Status:** Complete

- [x] Update `src/config.ts` with site title, description, placeholder domain/author (TODO comments left for real values before deploy)
- [x] Create `public/_headers` for Cloudflare Pages security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] Sitemap verified — `@astrojs/sitemap` configured in `astro.config.ts`, `<link rel="sitemap">` in `Layout.astro`
- [x] RSS verified — `src/pages/rss.xml.ts` exists, `<link rel="alternate">` in `Layout.astro`
- [x] OG meta tags verified — og:title, og:description, og:image, Twitter cards, JSON-LD all in `Layout.astro`; dynamic OG images enabled
- [ ] Enable Cloudflare Web Analytics after deploy (CSP already allows `static.cloudflareinsights.com`)

---

## Task 8: Deploy to Cloudflare Pages

**Status:** Not started

- [ ] Push repo to GitHub
- [ ] Connect to Cloudflare Pages:
  - Production branch: `main`
  - Build command: `pnpm run build`
  - Build output: `dist`
  - Env vars: `NODE_VERSION=20`, `PNPM_VERSION=10`
- [ ] Verify live site loads in dark mode, all pages work, SSL active
- [ ] Run Lighthouse audit (target: 95+ all categories)
- [ ] Verify `_headers` are applied (check response headers)
- [ ] (Optional) Connect custom domain via Cloudflare Registrar
