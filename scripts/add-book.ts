/**
 * add-book.ts — Add a book to the library via Google Books ISBN lookup.
 *
 * Usage:  pnpm add-book <isbn>
 * Requires GOOGLE_BOOKS_API_KEY to be set in .env (project root).
 *
 * What it does:
 *   1. Looks up the ISBN on the Google Books API
 *   2. Downloads the best available cover image to src/assets/images/library/
 *      (falls back to src/assets/images/library/_placeholder.jpg if none found)
 *   3. Generates src/data/library/{slug}.md with pre-filled frontmatter
 *      — set `dateRead` manually once you finish the book
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

// ── Validate inputs ───────────────────────────────────────────────────────────

const isbn = process.argv[2]?.trim();
if (!isbn) {
  console.error("Usage: pnpm add-book <isbn>");
  process.exit(1);
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

console.log(`Fetching data for ISBN ${isbn}...`);

const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`;
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
  console.error(`No book found for ISBN ${isbn}.`);
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
  writeFileSync(imgPath, Buffer.from(await imgRes.arrayBuffer()));
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
const today = new Date().toISOString().slice(0, 10);
const relImgPath = `../../assets/images/library/${imgSlug}.jpg`;
const genreYaml = genre.map(g => `  - "${esc(g)}"`).join("\n");

const md = `---
title: "${esc(title)}"
bookAuthor: "${esc(bookAuthor)}"
genre:
${genreYaml}
coverImage: "${relImgPath}"
dateRead: ${today}
isbn: "${isbn}"
---

<!-- Add your notes here -->
`;

writeFileSync(mdPath, md, "utf-8");
console.log(`Book file created → ${mdPath}`);
console.log(`\nDone! Open ${mdSlug}.md and update dateRead when you finish the book.`);
