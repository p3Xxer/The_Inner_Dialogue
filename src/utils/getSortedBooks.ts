import type { CollectionEntry } from "astro:content";
import bookFilter from "./bookFilter";

const getSortedBooks = (books: CollectionEntry<"library">[]) => {
  return books
    .filter(bookFilter)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.dateRead).getTime() / 1000) -
        Math.floor(new Date(a.data.dateRead).getTime() / 1000)
    );
};

export default getSortedBooks;
