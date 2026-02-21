# KhushilKataria.com — Dark Minimal Design System (v1)

**Status:** Locked  
**Theme:** Dark · Minimal · Warm · Literary  
**Primary Goal:** Long-form readability, quiet confidence, personal archive feel

---

## 1. Design Philosophy

This design system is built for:
- Writing-first experiences
- Long reading sessions at night
- Minimal visual noise
- Personal knowledge & library curation

Principles:
- Content over decoration
- Accents are functional, not aesthetic
- Dark does not mean harsh
- Color should guide attention, not compete for it

---

## 2. Core Background Palette

Used for ~60% of the interface.

| Token | Name | HEX | Usage |
|------|------|-----|------|
| `--bg-root` | Absolute Charcoal | `#0E0E0E` | Main page background |
| `--bg-elevated` | Elevated Panel | `#161616` | Cards, library items |
| `--bg-subtle` | Subtle Panel | `#1A1A1A` | Secondary sections |
| `--bg-hover` | Hover Surface | `#1F1F1F` | Hover states |

Notes:
- Avoid pure black (`#000000`)
- Depth is created through subtle elevation, not shadows

---

## 3. Borders & Dividers

Used for separation, never decoration.

| Token | HEX | Usage |
|------|-----|------|
| `--border-subtle` | `#2A2A2A` | Section dividers |
| `--border-strong` | `#3A3A3A` | Focused elements |

---

## 4. Text System (Reading-First)

Optimized for essays and notes.

| Token | Name | HEX | Usage |
|------|------|-----|------|
| `--text-primary` | Soft Paper White | `#E6E6E6` | Blog body |
| `--text-secondary` | Ash Gray | `#A8A8A8` | Author, metadata |
| `--text-muted` | Dust Gray | `#7A7A7A` | Footnotes, captions |
| `--text-disabled` | Charcoal Gray | `#5A5A5A` | Disabled UI |

Rules:
- Never use pure white for body text
- Pure white is reserved for hero titles only

---

## 5. Accent Colors (No Blue)

Accents must never exceed ~10% of visible UI.

### 5.1 Primary Accent — Warm Brass

| Token | HEX | Usage |
|-----|-----|------|
| `--accent-primary` | `#D4A259` | Links, CTAs, active nav |
| `--accent-primary-hover` | `#E6B86A` | Hover states |
| `--accent-primary-muted` | `#7A5A2E` | Borders, subtle emphasis |

Intent:
- Intellectual
- Warm
- Timeless
- Non-distracting

---

### 5.2 Secondary Accent — Muted Wine

| Token | HEX | Usage |
|-----|-----|------|
| `--accent-secondary` | `#8C5A6A` | Quotes, tags, highlights |
| `--accent-secondary-muted` | `#5A3A45` | Subtle emphasis |

Used for emotional or reflective emphasis.

---

### 5.3 Optional Tertiary Accent (Rare)

| Token | HEX | Usage |
|-----|-----|------|
| `--accent-tertiary` | `#6F7B4A` | Very rare categorical use |

Use only if an extra semantic layer is needed.

---

## 6. Blog Content Color Mapping

How colors are applied while writing.

### Text Elements

| Element | Color |
|------|------|
| Body text | `--text-primary` |
| H1 | `#FFFFFF` |
| H2–H4 | `#DADADA` |
| Metadata | `--text-secondary` |
| Footnotes | `--text-muted` |

### Links
- Default: `--accent-primary`
- Hover: underline + `--accent-primary-hover`

### Blockquotes
- Border: `--accent-primary-muted`
- Text: `--accent-secondary`

### Code Blocks
- Background: `#121212`
- Text: `#DCDCDC`
- Border: `--border-subtle`

---

## 7. Library Section Design

The library should feel like a **private archive**, not a marketplace.

### Book Card Layout

| Element | Color |
|------|------|
| Card background | `--bg-elevated` |
| Hover background | `--bg-hover` |
| Book title | `#FFFFFF` |
| Author | `--text-secondary` |
| Notes preview | `--text-muted` |
| Category tag | `--accent-primary` |
| Highlighted quote | `--accent-secondary` |

Rules:
- Book covers provide most visual color
- UI must stay neutral and calm
- No shadows on covers, only subtle borders

---

## 8. Interaction States

| State | Color |
|-----|------|
| Hover | `--bg-hover` |
| Active | `--accent-primary` |
| Focus ring | `--accent-primary` |
| Disabled text | `--text-disabled` |

---

## 9. CSS Variables (Authoritative)

```css
:root {
  /* Backgrounds */
  --bg-root: #0E0E0E;
  --bg-elevated: #161616;
  --bg-subtle: #1A1A1A;
  --bg-hover: #1F1F1F;

  /* Borders */
  --border-subtle: #2A2A2A;
  --border-strong: #3A3A3A;

  /* Text */
  --text-primary: #E6E6E6;
  --text-secondary: #A8A8A8;
  --text-muted: #7A7A7A;
  --text-disabled: #5A5A5A;

  /* Accents (NO BLUE) */
  --accent-primary: #D4A259;
  --accent-primary-hover: #E6B86A;
  --accent-primary-muted: #7A5A2E;

  --accent-secondary: #8C5A6A;
  --accent-secondary-muted: #5A3A45;

  /* Optional */
  --accent-tertiary: #6F7B4A;
}

---

# 11. Typography System

**Tone:** Developer-intellectual · Terminal restraint · Typewriter clarity  
**Primary Font:** iA Writer Mono  
**Fallback:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace  

---

## 11.1 Philosophy

Typography is the brand.

Because the site is writing-first:
- Font carries personality more than color.
- Monospace creates discipline.
- Spacing creates elegance.

We embrace:
- Terminal precision
- Typewriter calm
- High legibility over decoration

---

## 11.2 Font Stack

```css
--font-primary: "iA Writer Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;


11.3 Base Typography Scale

Root base:

html {
  font-size: 18px;
}
Body Text
Element	Size	Weight	Line Height
Body	1rem	400	1.8
Small	0.9rem	400	1.6

Rationale:

18px base improves long-form reading

1.8 line height prevents density fatigue in monospace

Headings
Element	Size	Weight	Spacing
H1	2.2rem	600	1.2
H2	1.6rem	600	1.3
H3	1.3rem	500	1.4
H4	1.1rem	500	1.4

Rules:

No uppercase headings

No letter spacing

Margin-top should be generous (2.5rem+)

11.4 Paragraph Rhythm

Spacing system:

Paragraph bottom margin: 1.6rem

Section spacing: 3rem

Blog max width: 680px (ideal for reading)

Library max width: 1100px

Reading width matters more than font choice.

11.5 Code Styling

Because you are a developer, code must feel native.

Inline code:

Background: #121212

Border: --border-subtle

Padding: 2px 6px

Border radius: 4px

Code blocks:

Background: #121212

Padding: 1.4rem

Border: 1px solid var(--border-subtle)

Font size: 0.95rem

No syntax colors that conflict with accent palette

Keep syntax subtle — avoid neon.

12. Blog Post Template

This is the canonical structure for posts.

---
title: "Post Title"
date: 2026-02-20
tags: ["systems", "thinking"]
description: "Short summary of the post."
---

# Post Title

Short intro paragraph.

## Section Heading

Main body paragraph text.

> A highlighted quote or important insight.
> Keep it concise.

Some inline code like `function example()`.

### Subsection

More explanation.

---

## References

- Book or link reference
- Additional reading
12.1 Blog UI Mapping
Markdown Element	Style
# H1	White
## H2	Slightly muted
> Quote	Muted Wine text + brass border
code	Dark inline block
Links	Warm Brass
13. Library Data Schema + UI Mapping

Your library is not a store.
It is a thinking archive.

13.1 Data Schema (JSON Example)
{
  "title": "The Beginning of Infinity",
  "author": "David Deutsch",
  "year": 2011,
  "coverImage": "/covers/beginning-of-infinity.jpg",
  "tags": ["physics", "epistemology"],
  "status": "completed",
  "rating": 5,
  "notes": "Knowledge grows through conjectures and refutations...",
  "favoriteQuote": "Problems are inevitable. Progress is optional."
}
13.2 Library UI Mapping
Field	Visual Style
Title	White, slightly larger
Author	Secondary gray
Tags	Warm Brass
Status	Muted text
Rating	Minimal dots or subtle indicator
Notes	Muted gray preview
Favorite Quote	Muted Wine
13.3 Library Card Layout

Structure:

[ Cover Image ]
Title
Author
Tags
Short Note Preview

Hover:

Background becomes --bg-hover

Border becomes --accent-primary-muted

No shadows.
No animation beyond subtle fade.

14. Terminal vs Typewriter Mode (Optional Feature)

If desired, you may add a toggle:

Terminal Mode

Slightly higher contrast

Cursor-style blinking caret

Slightly tighter spacing

Typewriter Mode

Slightly warmer text tone

Slightly more vertical spacing

No UI chrome

This is optional but aligned with your personality as a developer.

15. Final Identity Summary

KhushilKataria.com should feel like:

A late-night writing session

A clean terminal window

A private study desk

A long-form thinking space

Color is restrained.
Typography is disciplined.
Content is sovereign.