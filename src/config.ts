export const SITE = {
  website: "https://khushilkataria.com/",
  author: "Khushil Kataria",
  profile: "",
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
  timezone: "Asia/Kolkata",
} as const;
