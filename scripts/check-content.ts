/* eslint-disable no-console */
/**
 * check-content.ts — Build guard for content quality.
 *
 * Usage:  pnpm check-content
 *
 * Rules:
 *   Blog (src/data/blog/**\/*.md, skipping _-prefixed dirs/files):
 *     - ERROR if the filename is not kebab-case
 *     - For PUBLISHED posts only (no `draft: true`): ERROR if description is
 *       missing/placeholder, body contains template artifacts, or tags still
 *       contain the literal placeholder "tag"
 *
 *   Library (src/data/library/**\/*.md, skipping _-prefixed):
 *     - For PUBLISHED books only: WARN (not error) if the body is empty or
 *       just the "Add your notes here" placeholder comment
 *
 *   Quotes (src/data/quotes/**\/*.md, skipping _-prefixed):
 *     - For PUBLISHED quotes only: ERROR if the body is empty or still the
 *       template placeholder, or if quoteAuthor is still the placeholder
 *
 * Exits 1 if any ERRORs were found, 0 otherwise (warnings don't fail the build).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, "src/data/blog");
const LIBRARY_DIR = join(ROOT, "src/data/library");
const QUOTES_DIR = join(ROOT, "src/data/quotes");

const PLACEHOLDER_DESCRIPTION = "A short summary of what this post is about.";
const NOTES_PLACEHOLDER = "<!-- Add your notes here -->";
const QUOTE_PLACEHOLDER = "The quote text goes here.";
const QUOTE_AUTHOR_PLACEHOLDER = "Author Name";

type Issue = { level: "ERROR" | "WARN"; file: string; message: string };
const issues: Issue[] = [];

const err = (file: string, message: string) =>
  issues.push({ level: "ERROR", file, message });
const warn = (file: string, message: string) =>
  issues.push({ level: "WARN", file, message });

// ── Walk a content dir, skipping _-prefixed dirs/files ────────────────────────

const walk = (dir: string): string[] => {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
};

// ── Frontmatter parsing (line-based, no YAML dependency) ─────────────────────

const parseFile = (path: string) => {
  const content = readFileSync(path, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const [, frontmatter, body] = match;
  return { frontmatter, body };
};

const isDraft = (frontmatter: string): boolean =>
  /^draft:\s*true\s*$/m.test(frontmatter);

const getFieldValue = (frontmatter: string, field: string): string | null => {
  const m = frontmatter.match(new RegExp(`^${field}:\\s*(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "");
};

const getTagsList = (frontmatter: string): string[] => {
  const m = frontmatter.match(/^tags:\n((?:\s*-\s*.+\n?)*)/m);
  if (!m) return [];
  return m[1]
    .split("\n")
    .map(l => l.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
};

// ── Blog checks ────────────────────────────────────────────────────────────────

const KEBAB_CASE_RE = /^[a-z0-9-]+\.md$/;

const blogFiles = walk(BLOG_DIR);

for (const filePath of blogFiles) {
  const relPath = relative(ROOT, filePath);
  const filename = filePath.split("/").pop() as string;

  if (!KEBAB_CASE_RE.test(filename)) {
    err(relPath, `filename is not kebab-case (expected pattern ${KEBAB_CASE_RE})`);
  }

  const parsed = parseFile(filePath);
  if (!parsed) {
    err(relPath, "could not parse frontmatter");
    continue;
  }

  const { frontmatter, body } = parsed;
  if (isDraft(frontmatter)) continue; // only published posts are checked below

  const description = getFieldValue(frontmatter, "description");
  if (!description) {
    err(relPath, "description is missing or empty");
  } else if (description === PLACEHOLDER_DESCRIPTION) {
    err(relPath, `description is still the placeholder: "${PLACEHOLDER_DESCRIPTION}"`);
  }

  if (body.includes("*Last thought or closing line.*")) {
    err(relPath, 'body still contains template artifact "*Last thought or closing line.*"');
  }
  if (body.includes("Opening paragraph. Set the tone here")) {
    err(relPath, 'body still contains template artifact "Opening paragraph. Set the tone here"');
  }
  if (getTagsList(frontmatter).includes("tag")) {
    err(relPath, 'tags still contain the literal placeholder "tag"');
  }
}

// ── Library checks ─────────────────────────────────────────────────────────────

const libraryFiles = walk(LIBRARY_DIR);

for (const filePath of libraryFiles) {
  const relPath = relative(ROOT, filePath);
  const parsed = parseFile(filePath);
  if (!parsed) {
    err(relPath, "could not parse frontmatter");
    continue;
  }

  const { frontmatter, body } = parsed;
  if (isDraft(frontmatter)) continue; // only published books are checked below

  const trimmedBody = body.trim();
  if (trimmedBody === "" || trimmedBody === NOTES_PLACEHOLDER) {
    warn(relPath, "body is empty or still just the notes placeholder");
  }
}

// ── Quotes checks ──────────────────────────────────────────────────────────────

const quoteFiles = walk(QUOTES_DIR);

for (const filePath of quoteFiles) {
  const relPath = relative(ROOT, filePath);
  const parsed = parseFile(filePath);
  if (!parsed) {
    err(relPath, "could not parse frontmatter");
    continue;
  }

  const { frontmatter, body } = parsed;
  if (isDraft(frontmatter)) continue; // only published quotes are checked below

  const trimmedBody = body.trim();
  if (trimmedBody === "") {
    err(relPath, "body is empty — a quote needs its text");
  } else if (trimmedBody === QUOTE_PLACEHOLDER) {
    err(relPath, `body is still the placeholder: "${QUOTE_PLACEHOLDER}"`);
  }

  if (getFieldValue(frontmatter, "quoteAuthor") === QUOTE_AUTHOR_PLACEHOLDER) {
    err(relPath, `quoteAuthor is still the placeholder: "${QUOTE_AUTHOR_PLACEHOLDER}"`);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────────

const errors = issues.filter(i => i.level === "ERROR");
const warnings = issues.filter(i => i.level === "WARN");

console.log(
  `Checked ${blogFiles.length} blog file(s), ${libraryFiles.length} library file(s), and ${quoteFiles.length} quote file(s).`
);

if (issues.length === 0) {
  console.log("No issues found.");
} else {
  for (const issue of issues) {
    console.log(`${issue.level === "ERROR" ? "[ERROR]" : "[WARN] "} ${issue.file}: ${issue.message}`);
  }
}

console.log(
  `\n${errors.length} error(s), ${warnings.length} warning(s).`
);

if (errors.length > 0) {
  process.exit(1);
}
