// news-image-20261124 — "The World Today", Tuesday 24 November 2026.
// A small, deterministic entrypoint: it takes the front-page image that
// ships with this repository and writes it, byte for byte, to the path
// the competition expects. There is no network access and no randomness,
// so running it twice produces identical output.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const imagePath = join(repoRoot, "entry.png");
const outputPath = "/output/entry.png";

if (!existsSync(imagePath)) {
  throw new Error(`front-page image is missing: ${imagePath}`);
}

const png = readFileSync(imagePath);

// The first eight bytes of every PNG are a fixed magic signature.
// Refuse to write anything else, so a corrupted file can never
// silently pass as a valid entry.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error(`not a PNG file: ${imagePath}`);
}

// The competition caps the image at 1 MiB; fail loudly instead of
// shipping an oversized entry.
const ONE_MIB = 1024 * 1024;
if (png.length > ONE_MIB) {
  throw new Error(`entry image is ${png.length} bytes, over the 1 MiB limit`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, png);

console.log(`wrote ${outputPath} (${png.length} bytes)`);
