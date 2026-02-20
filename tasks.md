# Library Feature — Task Checklist

## Phase 1: Configuration & Setup

- [ ] Create a Google Books API key in Google Cloud Console and enable the Books API
- [ ] Add `GOOGLE_BOOKS_API_KEY` to `.env` (gitignored, local-only — not needed at build time)
- [x] Add `booksPerPage` to the `SITE` object in `src/config.ts`
- [x] Create directory `src/data/library/`
- [x] Create directory `src/assets/images/library/`

## Phase 2: Content Collection Schema

- [x] Add a `library` collection in `src/content.config.ts` with fields:
  - `title` — string (from Google)
  - `bookAuthor` — string (from Google, joined if multiple authors)
  - `genre` — string array (from Google's `categories`)
  - `coverImage` — image (local file, downloaded by CLI)
  - `dateRead` — date (filled in manually)
  - `isbn` — string (kept for reference)
- [x] Export `library` collection alongside `blog`: `collections = { blog, library }`

## Phase 3: CLI Script — `add-book`

- [ ] Create `scripts/add-book.ts` that:
  - [ ] Takes ISBN as CLI argument
  - [ ] Calls Google Books API: `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={key}`
  - [ ] Extracts `title`, `authors`, `categories`, `imageLinks` from `volumeInfo`
  - [ ] Downloads best available cover image (`large` → `medium` → `thumbnail`) to `src/assets/images/library/{slugified-title}.jpg`
  - [ ] Generates `src/data/library/{slugified-title}.md` with frontmatter and placeholder body (`<!-- Add your notes here -->`)
  - [ ] Handles edge cases: no cover image (copies placeholder), no categories (defaults to `["Uncategorized"]`), duplicate file names
- [ ] Add `"add-book": "npx tsx scripts/add-book.ts"` to `package.json` scripts

## Phase 4: Utility Functions

- [ ] Create `src/utils/getSortedBooks.ts` — fetches library collection, sorts by `dateRead` descending
- [ ] Create `src/utils/getUniqueGenres.ts` — extracts and deduplicates genres across all books, slugifies them (same pattern as `getUniqueTags`)
- [ ] Create `src/utils/getBooksByGenre.ts` — filters books matching a genre slug

## Phase 5: BookCard Component

- [ ] Create `src/components/BookCard.astro` with:
  - [ ] Astro `<Image />` for the cover (optimized, lazy-loaded)
  - [ ] Title linking to individual book page
  - [ ] Book author display
  - [ ] Genre pill/badge(s) (same styling as tag badges on blog posts)
  - [ ] Date read display
  - [ ] Horizontal card layout on desktop (cover left, info right), stacked on mobile
  - [ ] `data-genre` attribute on each card for client-side filtering

## Phase 6: Pages

- [ ] Create `src/pages/library/[...page].astro` — main listing page:
  - [ ] Fetches library collection, sorts by `dateRead`, paginates using `booksPerPage`
  - [ ] Renders `BookCard` grid (2 columns desktop, 1 column mobile)
  - [ ] Genre filter pills at the top ("All" + each genre)
  - [ ] Client-side JS to toggle card visibility by `data-genre` attribute
  - [ ] Uses existing `Pagination` component
- [ ] Create `src/pages/library/[...slug]/index.astro` — individual book page:
  - [ ] Shows large cover image, title, author, genre pills, date read
  - [ ] Renders markdown body (notes) below a horizontal rule
  - [ ] Back button to `/library`
  - [ ] Uses new `BookDetails.astro` layout
- [ ] Create `src/components/BookDetails.astro` layout (similar to `PostDetails.astro`, no prev/next, no share links)
- [ ] *(Optional)* Create `src/pages/library/genres/index.astro` — lists all genres with book counts

## Phase 7: Navigation

- [ ] Add `Library` nav item in `Header.astro`:
  - [ ] New `<li>` with `href="/library"` and `isActive("/library")`
  - [ ] Positioned between Blog and About
  - [ ] Same styling as existing nav items

## Phase 8: UX Details

- [ ] Genre filter pills: "All" selected by default, active pill gets accent styling
- [ ] BookCard: fixed-height cover image with `object-cover`, subtle shadow/border, hover effect
- [ ] Book details page: large cover image, metadata block, horizontal rule, notes below
- [ ] Responsive: 2-column grid on desktop/tablet, 1-column on mobile

## Phase 9: Generalize Pagination Component

- [ ] Update `Pagination` component types to accept `CollectionEntry<"library">` in addition to `CollectionEntry<"blog">`

---

## Implementation Order

1. [x] Content collection schema (Phase 2)
2. [ ] Utility functions (Phase 4)
3. [ ] BookCard component + listing page (Phases 5–6, listing only)
4. [ ] Navigation update (Phase 7)
5. [ ] Individual book page + BookDetails layout (Phase 6, detail page)
6. [ ] Genre filtering client-side JS (Phase 8)
7. [ ] CLI script (Phase 3)
8. [ ] Generalize Pagination component types (Phase 9)
9. [ ] Configuration & setup (Phase 1)
