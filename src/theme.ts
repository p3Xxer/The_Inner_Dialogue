/**
 * Centralized design system — single source of truth.
 * Marginalia palette: warm ink-and-paper dark tones, one interactive accent (muted oxblood).
 * Used by: Layout.astro (generates :root CSS vars), OG templates (Satori inline styles).
 * Never hardcode hex values anywhere else — always reference from here.
 */

export const colors = {
  // Backgrounds
  bgRoot: "#1C1815",
  bgElevated: "#221D19",
  bgSubtle: "#262019",
  bgHover: "#2B241D",

  // Borders
  borderSubtle: "#362D24",
  borderStrong: "#463A2E",

  // Text
  textPrimary: "#EAE3D8",
  textSecondary: "#B8AB98",
  textMuted: "#8A7D6C",
  textDisabled: "#6B6155",
  heading: "#EAE3D8",
  headingHero: "#F2ECE1",

  // Accent — Muted Oxblood (the only interactive color)
  accentPrimary: "#A65F52",
  accentPrimaryHover: "#B96E60",
  accentPrimaryMuted: "#7D4A41",

  // Accent — Secondary (retired from UI; var kept so typography.css still compiles)
  accentSecondary: "#7D4A41",
  accentSecondaryMuted: "#5E3B34",

  // Accent — Tertiary (retired from UI; var kept, now reads as neutral ink)
  accentTertiary: "#8A7D6C",

  // Code blocks
  codeBg: "#16120F",
  codeText: "#DBD7CA",
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
  bodyLineHeight: 1.75,
  blogMaxWidth: "42.5rem", // 680px
  libraryMaxWidth: "68.75rem", // 1100px
} as const;
