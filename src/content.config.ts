import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const LIBRARY_PATH = "src/data/library";
export const QUOTES_PATH = "src/data/quotes";
export const NOTES_PATH = "src/data/notes";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const library = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${LIBRARY_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      bookAuthor: z.string(),
      genre: z.array(z.string()).default(["Uncategorized"]),
      coverImage: image(),
      dateRead: z.date(),
      isbn: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${NOTES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string().regex(/^[a-z0-9-]+(\/[a-z0-9-]+)*$/),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    draft: z.boolean().optional(),
  }),
});

const quotes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${QUOTES_PATH}` }),
  schema: z.object({
    quoteAuthor: z.string(),
    source: z.string().optional(),
    dateAdded: z.date(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog, library, notes, quotes };
