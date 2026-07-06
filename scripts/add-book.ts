/* eslint-disable no-console */
/**
 * add-book.ts — Add a book to the library via Google Books lookup.
 *
 * Usage:
 *   pnpm add-book <isbn> [--date-read=YYYY-MM-DD]
 *   pnpm add-book --title "Book Title" [--date-read=YYYY-MM-DD]
 *
 * Requires GOOGLE_BOOKS_API_KEY to be set in .env (project root).
 *
 * What it does:
 *   1. Looks up the book on the Google Books API, either by ISBN or by
 *      title (first match wins for title search)
 *   2. Downloads the best available cover image to src/assets/images/library/
 *      (falls back to src/assets/images/library/_placeholder.jpg if none found)
 *   3. Generates src/data/library/{slug}.md with pre-filled frontmatter,
 *      including `draft: true` so new entries stay hidden from prod until
 *      notes are written — set `dateRead` manually if you didn't pass
 *      --date-read, and remove `draft: true` once ready to publish
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
} from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "../src/utils/slugify.ts";

// ── Load .env ─────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const dotenvPath = join(ROOT, ".env");

if (existsSync(dotenvPath)) {
  readFileSync(dotenvPath, "utf-8")
    .split("\n")
    .filter(line => /^\s*[^#\s]/.test(line) && line.includes("="))
    .forEach(line => {
      const eqIdx = line.indexOf("=");
      const key = line.slice(0, eqIdx).trim();
      const val = line
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key) process.env[key] ??= val;
    });
}

// ── Parse args ────────────────────────────────────────────────────────────────

const USAGE =
  "Usage:\n" +
  "  pnpm add-book <isbn> [--date-read=YYYY-MM-DD]\n" +
  '  pnpm add-book --title "Book Title" [--date-read=YYYY-MM-DD]';

const rawArgs = process.argv.slice(2);

let titleQuery: string | null = null;
let isbn: string | null = null;
let dateReadArg: string | null = null;
const positional: string[] = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];

  if (arg === "--title") {
    titleQuery = rawArgs[++i]?.trim() ?? "";
    continue;
  }
  if (arg.startsWith("--title=")) {
    titleQuery = arg.slice("--title=".length).trim();
    continue;
  }
  if (arg === "--date-read") {
    dateReadArg = rawArgs[++i]?.trim() ?? "";
    continue;
  }
  if (arg.startsWith("--date-read=")) {
    dateReadArg = arg.slice("--date-read=".length).trim();
    continue;
  }
  positional.push(arg);
}

if (titleQuery === "") {
  console.error("Error: --title requires a value.\n\n" + USAGE);
  process.exit(1);
}

if (!titleQuery && positional[0]) {
  isbn = positional[0].trim();
}

if (!isbn && !titleQuery) {
  console.error(USAGE);
  process.exit(1);
}

let dateRead = new Date().toISOString().slice(0, 10);
if (dateReadArg !== null) {
  if (dateReadArg === "" || !/^\d{4}-\d{2}-\d{2}$/.test(dateReadArg)) {
    console.error(
      `Error: --date-read must be in YYYY-MM-DD format (got "${dateReadArg}").`
    );
    process.exit(1);
  }
  const parsed = new Date(`${dateReadArg}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    console.error(`Error: --date-read "${dateReadArg}" is not a valid date.`);
    process.exit(1);
  }
  dateRead = dateReadArg;
}

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
if (!API_KEY) {
  console.error("Error: GOOGLE_BOOKS_API_KEY is not set.\n  Add it to .env in the project root.");
  process.exit(1);
}

// ── Fetch book data ───────────────────────────────────────────────────────────

const IMAGES_DIR = join(ROOT, "src/assets/images/library");
const DATA_DIR = join(ROOT, "src/data/library");
const PLACEHOLDER = join(IMAGES_DIR, "_placeholder.jpg");
const TEMPLATE_PATH = join(ROOT, "src/data/_templates/library.md");

const searchQuery = titleQuery
  ? `intitle:${titleQuery}`
  : `isbn:${isbn}`;

console.log(
  titleQuery
    ? `Searching Google Books for title "${titleQuery}"...`
    : `Fetching data for ISBN ${isbn}...`
);

const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
const apiRes = await fetch(apiUrl);

if (!apiRes.ok) {
  console.error(`Google Books API error: ${apiRes.status} ${apiRes.statusText}`);
  process.exit(1);
}

const apiData = (await apiRes.json()) as {
  totalItems: number;
  items?: Array<{ volumeInfo: Record<string, unknown> }>;
};

if (!apiData.totalItems || !apiData.items?.length) {
  console.error(
    titleQuery
      ? `No book found for title "${titleQuery}".`
      : `No book found for ISBN ${isbn}.`
  );
  process.exit(1);
}

const volumeInfo = apiData.items[0].volumeInfo;

// ── Extract fields ────────────────────────────────────────────────────────────

const title = (volumeInfo.title as string | undefined) ?? "Unknown Title";
const bookAuthor =
  ((volumeInfo.authors as string[] | undefined)?.join(", ")) ?? "Unknown Author";
const genre: string[] =
  (volumeInfo.categories as string[] | undefined) ?? ["Uncategorized"];
const imageLinks =
  (volumeInfo.imageLinks as Record<string, string> | undefined) ?? {};

// When searching by title, recover an ISBN (if any) from the result so the
// generated frontmatter can still include it.
if (!isbn) {
  const identifiers =
    (volumeInfo.industryIdentifiers as
      | Array<{ type: string; identifier: string }>
      | undefined) ?? [];
  const isbn13 = identifiers.find(id => id.type === "ISBN_13");
  const isbn10 = identifiers.find(id => id.type === "ISBN_10");
  isbn = (isbn13 ?? isbn10)?.identifier ?? null;
}

const coverUrl = (
  imageLinks.large ??
  imageLinks.medium ??
  imageLinks.thumbnail
)
  ?.replace("http://", "https://")
  ?.replace("&edge=curl", "");

// ── Deduplicate file names ────────────────────────────────────────────────────

const uniqueSlug = (base: string, ext: string, dir: string): string => {
  if (!existsSync(join(dir, `${base}${ext}`))) return base;
  let n = 2;
  while (existsSync(join(dir, `${base}-${n}${ext}`))) n++;
  return `${base}-${n}`;
};

const baseSlug = slugifyStr(title);
const imgSlug = uniqueSlug(baseSlug, ".jpg", IMAGES_DIR);
const mdSlug = uniqueSlug(baseSlug, ".md", DATA_DIR);
const imgPath = join(IMAGES_DIR, `${imgSlug}.jpg`);
const mdPath = join(DATA_DIR, `${mdSlug}.md`);

// ── Download cover image ──────────────────────────────────────────────────────

if (coverUrl) {
  console.log(`Downloading cover...`);
  const imgRes = await fetch(coverUrl);
  if (!imgRes.ok) {
    console.error(`Failed to download cover image: ${imgRes.status}`);
    process.exit(1);
  }
  writeFileSync(imgPath, new Uint8Array(await imgRes.arrayBuffer()));
  console.log(`Cover saved → ${imgPath}`);
} else {
  if (!existsSync(PLACEHOLDER)) {
    console.error(
      `No cover image found and no placeholder exists at:\n  ${PLACEHOLDER}\n` +
        `Add a placeholder image there and re-run, or add a cover manually.`
    );
    process.exit(1);
  }
  copyFileSync(PLACEHOLDER, imgPath);
  console.log(`No cover found — copied placeholder → ${imgPath}`);
}

// ── Write Markdown file ───────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const relImgPath = `../../assets/images/library/${imgSlug}.jpg`;
const genreYaml = genre.map(g => `  - "${esc(g)}"`).join("\n");
const isbnLine = isbn ? `\nisbn: "${isbn}"` : "";

const FALLBACK_BODY = "<!-- Add your notes here -->\n";

const getTemplateBody = (): string => {
  if (!existsSync(TEMPLATE_PATH)) return FALLBACK_BODY;
  const raw = readFileSync(TEMPLATE_PATH, "utf-8");
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  if (!match) return FALLBACK_BODY;
  return match[1].replace(/^\n+/, "");
};

const body = getTemplateBody();

const md = `---
title: "${esc(title)}"
bookAuthor: "${esc(bookAuthor)}"
genre:
${genreYaml}
coverImage: "${relImgPath}"
dateRead: ${dateRead}${isbnLine}
draft: true
---

${body}`;

writeFileSync(mdPath, md, "utf-8");
console.log(`Book file created → ${mdPath}`);
console.log(
  `\nDone! The entry is marked draft: true (hidden from prod). ` +
    `Remove that line once you've written your notes.` +
    (dateReadArg ? "" : "\nUpdate dateRead if this isn't when you actually finished it.")
);
