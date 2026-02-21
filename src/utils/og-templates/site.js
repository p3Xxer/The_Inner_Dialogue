import satori from "satori";
import { SITE } from "@/config";
import { colors } from "@/theme";
import loadFonts from "../loadGoogleFont";

export default async () => {
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
                      alignItems: "center",
                      padding: "2.5rem 3rem",
                      flex: "1",
                      textAlign: "center",
                    },
                    children: [
                      // Site title + description
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1rem",
                          },
                          children: [
                            {
                              type: "p",
                              props: {
                                style: {
                                  fontSize: 72,
                                  fontWeight: "bold",
                                  color: colors.headingHero,
                                  margin: 0,
                                  lineHeight: 1.2,
                                },
                                children: SITE.title,
                              },
                            },
                            {
                              type: "p",
                              props: {
                                style: {
                                  fontSize: 28,
                                  color: colors.textSecondary,
                                  margin: 0,
                                  maxWidth: "80%",
                                  overflow: "hidden",
                                },
                                children: SITE.desc,
                              },
                            },
                          ],
                        },
                      },
                      // Domain
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 24,
                            fontWeight: "bold",
                            color: colors.accentPrimary,
                            overflow: "hidden",
                          },
                          children: new URL(SITE.website).hostname,
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
