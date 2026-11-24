// news-image-20261124 — "THE WORLD TODAY", Tuesday 24 November 2026.
//
// The front page already exists in this repo as entry.png (1024x1024 PNG).
// All this script does is hand that file to the competition's output path,
// after making sure it really is a PNG of the right size. Nothing is
// downloaded, nothing is generated and nothing is random, so two runs
// always produce the same bytes.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const IMAGE = "entry.png";
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.png");
const ONE_MIB = 1024 * 1024;

// The eight bytes every PNG file starts with.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!existsSync(IMAGE)) {
  throw new Error(`${IMAGE} is missing from the repo`);
}

const data = readFileSync(IMAGE);

if (data.length < 33) {
  // A PNG needs at least the 8-byte signature plus the 25-byte IHDR chunk.
  throw new Error(`${IMAGE} is only ${data.length} bytes — too small to be a PNG`);
}

if (data.length > ONE_MIB) {
  throw new Error(`${IMAGE} is ${data.length} bytes, over the 1 MiB limit`);
}

if (!data.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error(`${IMAGE} is not a PNG file`);
}

// Width and height live in the IHDR chunk, right after the signature:
// bytes 16-19 are the width, bytes 20-23 the height (big-endian).
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`expected a 1024x1024 image, got ${width}x${height}`);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, data);

// Prove the copy landed intact: read the output back and compare it
// byte for byte with the source before calling the run a success.
const written = readFileSync(OUT_FILE);
if (!written.equals(data)) {
  throw new Error(`${OUT_FILE} does not match ${IMAGE} after writing`);
}

console.log(`wrote ${OUT_FILE} (${data.length} bytes, ${width}x${height})`);
