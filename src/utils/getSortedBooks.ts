import type { CollectionEntry } from "astro:content";

const getSortedBooks = (books: CollectionEntry<"library">[]) => {
  return books.sort(
    (a, b) =>
      Math.floor(new Date(b.data.dateRead).getTime() / 1000) -
      Math.floor(new Date(a.data.dateRead).getTime() / 1000)
  );
};

export default getSortedBooks;
