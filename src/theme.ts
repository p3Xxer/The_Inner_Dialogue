/**
 * Centralized design system — single source of truth.
 * Used by: Layout.astro (generates :root CSS vars), OG templates (Satori inline styles).
 * Never hardcode hex values anywhere else — always reference from here.
 */

export const colors = {
  // Backgrounds
  bgRoot: "#0E0E0E",
  bgElevated: "#161616",
  bgSubtle: "#1A1A1A",
  bgHover: "#1F1F1F",

  // Borders
  borderSubtle: "#2A2A2A",
  borderStrong: "#3A3A3A",

  // Text
  textPrimary: "#E6E6E6",
  textSecondary: "#A8A8A8",
  textMuted: "#7A7A7A",
  textDisabled: "#5A5A5A",
  heading: "#DADADA",
  headingHero: "#FFFFFF",

  // Accent — Warm Brass
  accentPrimary: "#D4A259",
  accentPrimaryHover: "#E6B86A",
  accentPrimaryMuted: "#7A5A2E",

  // Accent — Muted Wine
  accentSecondary: "#8C5A6A",
  accentSecondaryMuted: "#5A3A45",

  // Accent — Tertiary (rare)
  accentTertiary: "#6F7B4A",

  // Code blocks
  codeBg: "#121212",
  codeText: "#DCDCDC",
} as const;

/**
 * CSS custom property map — Layout.astro iterates this to generate :root { ... }.
 * Keys are CSS var names; values come from `colors` above.
 */
export const cssVars: Record<string, string> = {
  "--bg-root": colors.bgRoot,
  "--bg-elevated": colors.bgElevated,
  "--bg-subtle": colors.bgSubtle,
  "--bg-hover": colors.bgHover,

  "--border-subtle": colors.borderSubtle,
  "--border-strong": colors.borderStrong,

  "--text-primary": colors.textPrimary,
  "--text-secondary": colors.textSecondary,
  "--text-muted": colors.textMuted,
  "--text-disabled": colors.textDisabled,
  "--heading": colors.heading,
  "--heading-hero": colors.headingHero,

  "--accent-primary": colors.accentPrimary,
  "--accent-primary-hover": colors.accentPrimaryHover,
  "--accent-primary-muted": colors.accentPrimaryMuted,

  "--accent-secondary": colors.accentSecondary,
  "--accent-secondary-muted": colors.accentSecondaryMuted,

  "--accent-tertiary": colors.accentTertiary,

  "--code-bg": colors.codeBg,
  "--code-text": colors.codeText,
};

export const typography = {
  baseFontSize: "18px",
  bodyLineHeight: 1.7, // terminal mode (default)
  blogMaxWidth: "42.5rem", // 680px
  libraryMaxWidth: "68.75rem", // 1100px
} as const;

