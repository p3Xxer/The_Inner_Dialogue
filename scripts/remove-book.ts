/* eslint-disable no-console */
/**
 * remove-book.ts — Remove a book from the library.
 *
 * Usage:  pnpm remove-book <slug>
 *
 * What it does:
 *   1. Finds the markdown file in src/data/library/ by slug or title
 *   2. Reads the frontmatter to get the cover image path
 *   3. Deletes both the markdown file and the cover image
 */

import { readFileSync, readdirSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "../src/utils/slugify.ts";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src/data/library");

const slugOrTitle = process.argv[2]?.trim();
if (!slugOrTitle) {
  console.error("Usage: pnpm remove-book <slug>");
  console.error("  <slug> can be the book slug (e.g., 'the-great-gatsby') or title");
  process.exit(1);
}

const mdFiles = (() => {
  const files = readdirSync(DATA_DIR);
  return files.filter((f: string) => f.endsWith(".md"));
})();

let targetMdPath: string | null = null;
let coverImagePath: string | null = null;

for (const file of mdFiles) {
  const filePath = join(DATA_DIR, file);
  const content = readFileSync(filePath, "utf-8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) continue;
  
  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
  const fileSlug = file.replace(".md", "");
  
  const title = titleMatch ? titleMatch[1] : "";
  const titleSlug = slugifyStr(title);
  
  if (
    fileSlug === slugOrTitle ||
    titleSlug === slugifyStr(slugOrTitle) ||
    title.toLowerCase() === slugOrTitle.toLowerCase()
  ) {
    targetMdPath = filePath;
    const coverMatch = frontmatter.match(/coverImage:\s*["'](.+?)["']/);
    if (coverMatch) {
      const relPath = coverMatch[1];
      coverImagePath = join(ROOT, "src", relPath.replace(/^\//, ""));
    }
    break;
  }
}

if (!targetMdPath) {
  console.error(`No book found matching "${slugOrTitle}"`);
  process.exit(1);
}

console.log(`Found book: ${targetMdPath}`);

if (coverImagePath && existsSync(coverImagePath)) {
  unlinkSync(coverImagePath);
  console.log(`Deleted cover image: ${coverImagePath}`);
} else if (coverImagePath) {
  console.log(`Cover image not found: ${coverImagePath}`);
}

unlinkSync(targetMdPath);
console.log(`Deleted book file: ${targetMdPath}`);
console.log("\nDone!");
