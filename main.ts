// news-image-20261124 — "THE WORLD TODAY", Tuesday 24 November 2026.
//
// The front page ships in this repo as entry.png (1024x1024 PNG). It
// covers six stories that happened or were first reported on 24 November
// 2026, with stylised editorial illustrations — each one tagged
// "ILLUSTRATION" on the page, so nothing poses as a photograph of a
// real event. This entrypoint only moves that file to the output path
// the competition reads, after confirming it is a real PNG inside the
// size limit. It fetches nothing and rolls no dice, so every run writes
// the same bytes.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE = "entry.png";
const TARGET_DIR = "/output";
const TARGET = join(TARGET_DIR, "entry.png");
const MAX_BYTES = 1024 * 1024; // 1 MiB

// First eight bytes of any PNG file.
const PNG_HEAD = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!existsSync(SOURCE)) {
  throw new Error(`cannot find ${SOURCE} in this repo`);
}
const bytes = readFileSync(SOURCE);
checkPng(bytes);
mkdirSync(TARGET_DIR, { recursive: true });
writeFileSync(TARGET, bytes);
const check = readFileSync(TARGET);
if (!check.equals(bytes)) {
  throw new Error(`${TARGET} differs from ${SOURCE} after copying`);
}
console.log(`wrote ${TARGET} (${bytes.length} bytes, 1024x1024)`);

// The size, signature and dimension checks, kept together so the
// copy step above stays a straight read-then-write.
function checkPng(data: Buffer): void {
  if (data.length > MAX_BYTES) {
    throw new Error(`${SOURCE} is ${data.length} bytes, over the 1 MiB limit`);
  }
  if (data.length < 33 || !data.subarray(0, 8).equals(PNG_HEAD)) {
    throw new Error(`${SOURCE} is not a valid PNG`);
  }
  // In a PNG the IHDR chunk holds width (bytes 16..19) and height (20..23).
  const w = data.readUInt32BE(16);
  const h = data.readUInt32BE(20);
  if (w !== 1024 || h !== 1024) {
    throw new Error(`expected 1024x1024, got ${w}x${h}`);
  }
}
