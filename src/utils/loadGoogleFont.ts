import { readFileSync } from "fs";
import { join } from "path";

// Fonts are loaded from local @fontsource packages rather than fetching from the
// Google Fonts API at build time. This keeps fonts consistent with the site's
// design system and avoids a network dependency during OG image generation.
// Option A chosen: load .woff buffers from @fontsource packages.
// Note: Satori supports WOFF and TTF/OTF but NOT WOFF2 — using .woff files here.
// Newsreader carries the title line (serif voice); iA Writer Mono carries the
// meta line (site name / author) — same serif/mono signature as the site.
function loadLocalFont(
  pkg: "ia-writer-mono" | "newsreader",
  weight: 400 | 600 | 700
): ArrayBuffer {
  const filename = `${pkg}-latin-${weight}-normal.woff`;
  const fontPath = join(
    process.cwd(),
    `node_modules/@fontsource/${pkg}/files`,
    filename
  );
  const buffer = readFileSync(fontPath);
  // Convert Node Buffer to ArrayBuffer (Buffer shares underlying memory, so slice to isolate)
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

async function loadFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  return [
    {
      name: "iA Writer Mono",
      data: loadLocalFont("ia-writer-mono", 400),
      weight: 400,
      style: "normal",
    },
    {
      name: "iA Writer Mono",
      data: loadLocalFont("ia-writer-mono", 700),
      weight: 700,
      style: "normal",
    },
    {
      name: "Newsreader",
      data: loadLocalFont("newsreader", 600),
      weight: 600,
      style: "normal",
    },
    {
      name: "Newsreader",
      data: loadLocalFont("newsreader", 400),
      weight: 400,
      style: "normal",
    },
  ];
}

export default loadFonts;
