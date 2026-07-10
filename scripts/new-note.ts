/* eslint-disable no-console */
/**
 * new-note.ts — Scaffold a new note draft.
 *
 * Usage:  pnpm new-note "Note Title" --topic dsa/graphs
 *
 * What it does:
 *   1. Slugifies the title to derive src/data/notes/{slug}.md
 *   2. Validates --topic as a slash-separated kebab-case path
 *   3. Refuses to overwrite an existing file
 *   4. Generates frontmatter (draft: true) + the scaffold body from
 *      src/data/_templates/note.md
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "../src/utils/slugify.ts";

const ROOT = process.cwd();
const NOTES_DIR = join(ROOT, "src/data/notes");
const TEMPLATE_PATH = join(ROOT, "src/data/_templates/note.md");

const TOPIC_RE = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

// ── Validate inputs ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const title = args[0]?.startsWith("--") ? undefined : args[0]?.trim();

let topic: string | undefined;
const topicFlagIdx = args.findIndex(a => a === "--topic" || a.startsWith("--topic="));
if (topicFlagIdx !== -1) {
  const flag = args[topicFlagIdx];
  topic = flag.includes("=") ? flag.split("=")[1] : args[topicFlagIdx + 1];
  topic = topic?.trim();
}

if (!title || !topic) {
  console.error('Usage: pnpm new-note "Note Title" --topic dsa/graphs');
  process.exit(1);
}

if (!TOPIC_RE.test(topic)) {
  console.error(
    `Error: invalid topic "${topic}".\n` +
      `Topics are slash-separated kebab-case paths — e.g. "finance" or "dsa/graphs".`
  );
  process.exit(1);
}

const slug = slugifyStr(title);
const mdPath = join(NOTES_DIR, `${slug}.md`);

if (existsSync(mdPath)) {
  console.error(
    `Error: a note already exists at src/data/notes/${slug}.md\n` +
      `Choose a different title, or edit that file directly.`
  );
  process.exit(1);
}

// ── Derive body from the template ────────────────────────────────────────────

const FALLBACK_BODY = `The idea in one or two sentences — what clicked and why it matters.

More context, an example, or the thing you'd want your future self to re-read.
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
description: A short summary of what this note covers.
topic: ${topic}
pubDatetime: ${pubDatetime}
draft: true
---

${body}`;

mkdirSync(NOTES_DIR, { recursive: true });
writeFileSync(mdPath, md, "utf-8");

console.log(`Note created → src/data/notes/${slug}.md`);
console.log(`\nDon't forget to fill in the description before publishing.`);
