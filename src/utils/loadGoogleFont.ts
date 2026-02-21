import { readFileSync } from "fs";
import { join } from "path";

// iA Writer Mono is loaded from the local @fontsource package rather than fetching
// from the Google Fonts API at build time. This keeps fonts consistent with the site's
// design system and avoids a network dependency during OG image generation.
// Option A chosen: load .woff buffers from @fontsource/ia-writer-mono package.
// Note: Satori supports WOFF and TTF/OTF but NOT WOFF2 — using .woff files here.
function loadLocalFont(weight: 400 | 700): ArrayBuffer {
  const filename = `ia-writer-mono-latin-${weight}-normal.woff`;
  const fontPath = join(
    process.cwd(),
    "node_modules/@fontsource/ia-writer-mono/files",
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
      data: loadLocalFont(400),
      weight: 400,
      style: "normal",
    },
    {
      name: "iA Writer Mono",
      data: loadLocalFont(700),
      weight: 700,
      style: "normal",
    },
  ];
}

export default loadFonts;
