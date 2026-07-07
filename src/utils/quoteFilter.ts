import type { CollectionEntry } from "astro:content";

const quoteFilter = ({ data }: CollectionEntry<"quotes">) => {
  return import.meta.env.DEV || !data.draft;
};

export default quoteFilter;
