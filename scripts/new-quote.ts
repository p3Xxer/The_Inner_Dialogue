/* eslint-disable no-console */
/**
 * new-quote.ts — Scaffold a new quote draft.
 *
 * Usage:  pnpm new-quote "Author Name" [--source "Where it's from"]
 *
 * What it does:
 *   1. Slugifies the author to derive src/data/quotes/{slug}.md, appending
 *      -2, -3, ... if quotes from that author already exist
 *   2. Generates frontmatter (draft: true, dateAdded: today) + the placeholder
 *      body from src/data/_templates/quote.md
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "../src/utils/slugify.ts";

const ROOT = process.cwd();
const QUOTES_DIR = join(ROOT, "src/data/quotes");
const TEMPLATE_PATH = join(ROOT, "src/data/_templates/quote.md");

// ── Validate inputs ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const sourceFlagIndex = args.indexOf("--source");
let source: string | undefined;
if (sourceFlagIndex !== -1) {
  source = args[sourceFlagIndex + 1]?.trim();
  if (!source) {
    console.error("Error: --source requires a value.");
    process.exit(1);
  }
  args.splice(sourceFlagIndex, 2);
}

const author = args[0]?.trim();
if (!author) {
  console.error('Usage: pnpm new-quote "Author Name" [--source "Where it\'s from"]');
  process.exit(1);
}

const baseSlug = slugifyStr(author);
let slug = baseSlug;
for (let n = 2; existsSync(join(QUOTES_DIR, `${slug}.md`)); n++) {
  slug = `${baseSlug}-${n}`;
}
const mdPath = join(QUOTES_DIR, `${slug}.md`);

// ── Derive body from the template ────────────────────────────────────────────

const FALLBACK_BODY = "The quote text goes here.\n";

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
const dateAdded = new Date().toISOString().slice(0, 10);

const md = `---
quoteAuthor: "${esc(author)}"
${source ? `source: "${esc(source)}"` : `# source: Book, talk, or essay it came from`}
dateAdded: ${dateAdded}
draft: true
---

${body}`;

writeFileSync(mdPath, md, "utf-8");

console.log(`Quote created → src/data/quotes/${slug}.md`);
console.log(`\nReplace the placeholder body with the quote, then remove draft: true.`);
