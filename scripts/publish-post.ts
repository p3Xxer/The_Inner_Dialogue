/* eslint-disable no-console */
/**
 * publish-post.ts — Promote a blog draft to published.
 *
 * Usage:  pnpm publish-post <slug> [--keep-date]
 *
 * What it does:
 *   1. Locates src/data/blog/{slug}.md (moving it out of _drafts/ first if
 *      that's where it lives)
 *   2. Validates that placeholder/template content has been replaced
 *   3. Removes `draft: true` and (unless --keep-date) bumps pubDatetime to now
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  renameSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, "src/data/blog");
const DRAFTS_DIR = join(BLOG_DIR, "_drafts");

const args = process.argv.slice(2);
const keepDate = args.includes("--keep-date");
const slug = args.find(a => !a.startsWith("--"))?.trim();

if (!slug) {
  console.error("Usage: pnpm publish-post <slug> [--keep-date]");
  process.exit(1);
}

// ── Locate the file ───────────────────────────────────────────────────────────

const mdPath = join(BLOG_DIR, `${slug}.md`);
const draftPath = join(DRAFTS_DIR, `${slug}.md`);

if (!existsSync(mdPath)) {
  if (existsSync(draftPath)) {
    renameSync(draftPath, mdPath);
    console.log(`Moved src/data/blog/_drafts/${slug}.md → src/data/blog/${slug}.md`);
  } else {
    console.error(
      `Error: no post found for slug "${slug}".\nChecked:\n` +
        `  - src/data/blog/${slug}.md\n` +
        `  - src/data/blog/_drafts/${slug}.md`
    );
    process.exit(1);
  }
}

// ── Parse frontmatter ─────────────────────────────────────────────────────────

const content = readFileSync(mdPath, "utf-8");
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

if (!frontmatterMatch) {
  console.error(`Error: could not parse frontmatter in ${mdPath}`);
  process.exit(1);
}

const [, frontmatter, body] = frontmatterMatch;

const PLACEHOLDER_DESCRIPTION = "A short summary of what this post is about.";

const descriptionMatch = frontmatter.match(/^description:\s*(.*)$/m);
const description = descriptionMatch?.[1]?.trim().replace(/^["']|["']$/g, "");

const failures: string[] = [];

if (!description) {
  failures.push("description is missing or empty.");
} else if (description === PLACEHOLDER_DESCRIPTION) {
  failures.push(`description is still the placeholder: "${PLACEHOLDER_DESCRIPTION}"`);
}

if (body.includes("*Last thought or closing line.*")) {
  failures.push('body still contains the template artifact "*Last thought or closing line.*"');
}

if (body.includes("Opening paragraph. Set the tone here")) {
  failures.push('body still contains the template artifact "Opening paragraph. Set the tone here"');
}

if (/^Body content\.$/m.test(body)) {
  failures.push('body still contains a template section that is literally "Body content."');
}

if (/^More content\.$/m.test(body)) {
  failures.push('body still contains a template section that is literally "More content."');
}

const tagsBlockMatch = frontmatter.match(/^tags:\n((?:\s*-\s*.+\n?)*)/m);
if (tagsBlockMatch) {
  const tagLines = tagsBlockMatch[1]
    .split("\n")
    .map(l => l.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  if (tagLines.includes("tag")) {
    failures.push('tags still contains the literal placeholder "tag"');
  }
}

if (failures.length > 0) {
  console.error(`Cannot publish "${slug}" — validation failed:\n`);
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

// ── Update frontmatter ────────────────────────────────────────────────────────

let updatedFrontmatter = frontmatter
  .split("\n")
  .filter(line => !/^draft:\s*/.test(line.trim()))
  .join("\n");

if (!keepDate) {
  const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  if (/^pubDatetime:\s*.*$/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^pubDatetime:\s*.*$/m,
      `pubDatetime: ${nowIso}`
    );
  } else {
    updatedFrontmatter += `\npubDatetime: ${nowIso}`;
  }
}

const updatedContent = `---\n${updatedFrontmatter}\n---\n${body}`;
writeFileSync(mdPath, updatedContent, "utf-8");

console.log(`Published "${slug}".`);
console.log(`URL: /blog/${slug}/`);
