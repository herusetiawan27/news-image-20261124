// news-image-20261124: "The World Today" — Tuesday 24 November 2026.
// This entrypoint is deliberately boring: it hands the front-page image
// that already lives in this repo to the place the competition reads it
// from. Nothing is fetched, nothing is generated, nothing is random, so
// every run writes exactly the same bytes.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "entry.png");
const target = "/output/entry.png";
const MAX_BYTES = 1024 * 1024;

const size = statSync(source).size;
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes, above the 1 MiB cap`);
}

const bytes = readFileSync(source);

// A real PNG always opens with these eight bytes. If the file on disk
// is not a PNG, say so instead of writing garbage to the output.
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const looksLikePng = signature.every((b, i) => bytes[i] === b);
if (!looksLikePng) {
  throw new Error("entry.png does not start with the PNG signature");
}

// The first chunk after the signature is IHDR: its width and height sit
// at bytes 16-19 and 20-23. The competition wants at most 1024x1024,
// so confirm the picture is within that before writing it out.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, above the 1024x1024 cap`);
}

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, bytes);

console.log(`wrote ${target} (${bytes.length} bytes)`);
