import type { CollectionEntry } from "astro:content";
import getSortedBooks from "./getSortedBooks";
import { slugifyAll } from "./slugify";

const getBooksByGenre = (books: CollectionEntry<"library">[], genre: string) =>
  getSortedBooks(
    books.filter(book => slugifyAll(book.data.genre).includes(genre))
  );

export default getBooksByGenre;
