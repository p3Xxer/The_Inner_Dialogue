import type { CollectionEntry } from "astro:content";

const bookFilter = ({ data }: CollectionEntry<"library">) => {
  return import.meta.env.DEV || !data.draft;
};

export default bookFilter;
