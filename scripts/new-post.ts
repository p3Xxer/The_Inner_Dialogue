/* eslint-disable no-console */
/**
 * new-post.ts — Scaffold a new blog post draft.
 *
 * Usage:  pnpm new-post "Post Title"
 *
 * What it does:
 *   1. Slugifies the title to derive src/data/blog/{slug}.md
 *   2. Refuses to overwrite an existing file
 *   3. Generates frontmatter (draft: true) + the scaffold body from
 *      src/data/_templates/blog.md
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "../src/utils/slugify.ts";

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, "src/data/blog");
const TEMPLATE_PATH = join(ROOT, "src/data/_templates/blog.md");

// ── Validate inputs ───────────────────────────────────────────────────────────

const title = process.argv[2]?.trim();
if (!title) {
  console.error('Usage: pnpm new-post "Post Title"');
  process.exit(1);
}

const slug = slugifyStr(title);
const mdPath = join(BLOG_DIR, `${slug}.md`);

if (existsSync(mdPath)) {
  console.error(
    `Error: a post already exists at src/data/blog/${slug}.md\n` +
      `Choose a different title, or edit that file directly.`
  );
  process.exit(1);
}

// ── Derive body from the template ────────────────────────────────────────────

const FALLBACK_BODY = `Opening paragraph. Set the tone here — one or two sentences that pull the reader in.

## Section Heading

Body content.

## Another Heading

More content.

---

*Last thought or closing line.*
`;

const getTemplateBody = (): string => {
  if (!existsSync(TEMPLATE_PATH)) return FALLBACK_BODY;
  const raw = readFileSync(TEMPLATE_PATH, "utf-8");
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  if (!match) return FALLBACK_BODY;
  return match[1].replace(/^\n+/, "");
};

const body = getTemplateBody();

// ── Write frontmatter + body ──────────────────────────────────────────────────

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const pubDatetime = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

const md = `---
title: "${esc(title)}"
pubDatetime: ${pubDatetime}
description: A short summary of what this post is about.
tags:
  - tag
featured: false
draft: true
---

${body}`;

writeFileSync(mdPath, md, "utf-8");

console.log(`Post created → src/data/blog/${slug}.md`);
console.log(`\nDon't forget to fill in the description before publishing.`);
