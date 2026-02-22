# Typography Reference

All inline and block typography elements available in blog posts and library notes.
Styling lives in `src/styles/typography.css` inside `.app-prose`.

---

## Inline Text Elements

### Highlight
```html
<mark>highlighted text</mark>
```
Use for: emphasizing key ideas, annotations, important terms.

---

### Underline
```html
<u>underlined text</u>
```
Use for: non-hyperlink emphasis (distinct from links, which are colored brass).

---

### Strikethrough
```markdown
~~struck through text~~
```
Or with HTML:
```html
<s>struck through text</s>
```
Use for: corrections, changed thoughts, things you've reconsidered.

---

### Superscript
```html
text<sup>1</sup>
```
Use for: footnote references¹, ordinals (1st, 2nd), math exponents (x²).

---

### Subscript
```html
H<sub>2</sub>O
```
Use for: chemical formulas, mathematical notation.

---

### Keyboard Key
```html
Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.
```
Use for: keyboard shortcuts, key combinations in tech writing.

---

### Abbreviation
```html
<abbr title="As Soon As Possible">ASAP</abbr>
```
Use for: acronyms and abbreviations — renders with a dotted underline and tooltip on hover.

---

### Citation
```html
I was reading <cite>Thinking, Fast and Slow</cite> when...
```
Use for: book titles, article names, works of art referenced in prose.

---

### Small Print
```html
<small>This is a side note or disclaimer.</small>
```
Use for: asides, fine print, inline captions, tangential remarks.

---

### Deleted Text
```html
<del>old incorrect content</del>
```
Use for: explicitly struck-out content, corrections, tracked changes.

---

### Inserted Text
```html
<ins>newly added content</ins>
```
Use for: explicitly added content, often paired with `<del>` to show a revision.

```html
Price was <del>$50</del> <ins>$35</ins> today.
```

---

## Block / Structural Elements

### Callout / Note Box
```html
<aside class="callout-note">
  <strong>Note:</strong> Something worth flagging here.
</aside>

<aside class="callout-warning">
  <strong>Warning:</strong> Be careful about this.
</aside>

<aside class="callout-tip">
  <strong>Tip:</strong> A helpful suggestion.
</aside>
```
Use for: notes, warnings, tips, and other asides that break from prose flow.

---

### Pull Quote
```html
<blockquote class="pull-quote">
  The idea that stuck with me most.
</blockquote>
```
Use for: highlighting a key sentence from the body in a visually distinct way.

---

### Footnote Block
```html
<section class="footnotes">
  <ol>
    <li id="fn-1">This is the footnote text. <a href="#fnref-1">↩</a></li>
  </ol>
</section>
```
Pair with superscript refs in body:
```html
Here is a statement<sup><a href="#fn-1" id="fnref-1">1</a></sup> worth footnoting.
```
Use for: numbered footnote definitions at the bottom of a post.

---

## Already Supported (no extra styling needed)

| Element | Syntax | Notes |
|---|---|---|
| Bold | `**text**` | weight 700, `--text-primary` |
| Italic | `*text*` | font-style italic |
| Inline code | `` `code` `` | `--code-bg` bg, bordered |
| Code block | ```` ```lang ```` | Shiki vitesse-dark, supports `file=`, diff, highlight |
| Blockquote | `> text` | Brass left border, wine italic text |
| Link | `[text](url)` | Brass color, underline on hover |
| Headings | `## Heading` | h1–h6 with semantic sizing |
| Lists | `- item` / `1. item` | Brass list markers |
| Table | `\| col \|` | Bordered, elevated header bg |
| Details | `<details><summary>` | Collapsible section |
| Image | `![alt](src)` | Centered, bordered, responsive |
| Figcaption | `<figcaption>` | Muted small text, centered |

---

## Color Reference

All colors from `src/theme.ts`:

| Role | CSS Variable | Hex |
|---|---|---|
| Body text | `--text-primary` | `#E6E6E6` |
| Secondary text | `--text-secondary` | `#A8A8A8` |
| Muted text | `--text-muted` | `#7A7A7A` |
| Disabled | `--text-disabled` | `#5A5A5A` |
| H1 | `--heading-hero` | `#FFFFFF` |
| H2–H6 | `--heading` | `#DADADA` |
| Accent (brass) | `--accent-primary` | `#D4A259` |
| Accent hover | `--accent-primary-hover` | `#E6B86A` |
| Accent muted | `--accent-primary-muted` | `#7A5A2E` |
| Secondary accent | `--accent-secondary` | `#8C5A6A` |
| Secondary muted | `--accent-secondary-muted` | `#5A3A45` |
| Tertiary accent | `--accent-tertiary` | `#6F7B4A` |
| Page bg | `--bg-root` | `#0E0E0E` |
| Card bg | `--bg-elevated` | `#161616` |
| Subtle bg | `--bg-subtle` | `#1A1A1A` |
| Hover bg | `--bg-hover` | `#1F1F1F` |
| Border | `--border-subtle` | `#2A2A2A` |
| Border strong | `--border-strong` | `#3A3A3A` |
| Code bg | `--code-bg` | `#121212` |
| Code text | `--code-text` | `#DCDCDC` |

---

## Notes

- All elements above are styled in `.app-prose` in `src/styles/typography.css`.
- Raw HTML is valid inside `.md` files — Astro passes it through.
- Inline styles (`style="..."`) work as a fallback if needed.
