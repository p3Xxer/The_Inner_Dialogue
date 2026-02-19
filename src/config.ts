export const SITE = {
  website: "https://theinnerdialogue.com/", // TODO: replace with your deployed domain
  author: "Your Name", // TODO: replace with your name
  profile: "", // TODO: replace with your personal site URL, or leave empty
  desc: "A personal blog about writing, tools, and thinking more clearly.",
  title: "The Inner Dialogue",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 8,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "UTC", // TODO: set your local timezone (IANA format)
} as const;
