import type { CollectionEntry } from "astro:content";
import quoteFilter from "./quoteFilter";

const getSortedQuotes = (quotes: CollectionEntry<"quotes">[]) => {
  return quotes
    .filter(quoteFilter)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.dateAdded).getTime() / 1000) -
        Math.floor(new Date(a.data.dateAdded).getTime() / 1000)
    );
};

export default getSortedQuotes;
