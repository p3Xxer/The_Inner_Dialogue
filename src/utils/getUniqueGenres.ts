import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

interface Genre {
  genre: string;
  genreName: string;
}

const getUniqueGenres = (books: CollectionEntry<"library">[]): Genre[] => {
  return books
    .flatMap(book => book.data.genre)
    .map(genre => ({ genre: slugifyStr(genre), genreName: genre }))
    .filter(
      (value, index, self) =>
        self.findIndex(g => g.genre === value.genre) === index
    )
    .sort((a, b) => a.genre.localeCompare(b.genre));
};

export default getUniqueGenres;
