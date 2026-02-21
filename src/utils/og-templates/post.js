import satori from "satori";
import { SITE } from "@/config";
import { colors } from "@/theme";
import loadFonts from "../loadGoogleFont";

export default async post => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: colors.bgRoot,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "iA Writer Mono",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                border: `1px solid ${colors.borderSubtle}`,
                background: colors.bgElevated,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
                overflow: "hidden",
              },
              children: [
                // Accent bar at top
                {
                  type: "div",
                  props: {
                    style: {
                      width: "100%",
                      height: "4px",
                      background: colors.accentPrimary,
                    },
                  },
                },
                // Content area
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "2.5rem 3rem",
                      flex: "1",
                    },
                    children: [
                      // Title
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 62,
                            fontWeight: "bold",
                            color: colors.headingHero,
                            lineHeight: 1.2,
                            maxHeight: "70%",
                            overflow: "hidden",
                            margin: 0,
                          },
                          children: post.data.title,
                        },
                      },
                      // Footer row
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            width: "100%",
                          },
                          children: [
                            // Author
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 26,
                                  color: colors.textSecondary,
                                  overflow: "hidden",
                                },
                                children: `by ${post.data.author}`,
                              },
                            },
                            // Site name
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: 26,
                                  fontWeight: "bold",
                                  color: colors.accentPrimary,
                                  overflow: "hidden",
                                },
                                children: SITE.title,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadFonts(),
    }
  );
};
