// main.ts — penyalin entry news-image-20261124.
// Membaca entry.png di folder yang sama, memeriksa bahwa berkas itu
// benar-benar PNG 1024x1024 dan tidak lebih dari 1 MiB, lalu menyalinnya
// apa adanya ke /output/entry.png. Tidak ada akses jaringan sama sekali.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const folder = dirname(fileURLToPath(import.meta.url));
const asal = join(folder, "entry.png");
const tujuan = "/output/entry.png";

if (!existsSync(asal)) throw new Error("entry.png tidak ada");

function periksaGambar(data: Buffer): { lebar: number; tinggi: number } {
  const magic = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (data.length > 1048576) throw new Error("entry.png lebih dari 1 MiB");
  if (!data.subarray(0, 8).equals(magic)) throw new Error("bukan PNG");
  if (data.subarray(12, 16).toString("ascii") !== "IHDR") throw new Error("chunk pertama bukan IHDR");
  const lebar = data.readUInt32BE(16);
  const tinggi = data.readUInt32BE(20);
  if (lebar !== 1024 || tinggi !== 1024) throw new Error(`ukuran ${lebar}x${tinggi}, bukan 1024x1024`);
  return { lebar, tinggi };
}

const data = readFileSync(asal);
const { lebar, tinggi } = periksaGambar(data);

mkdirSync("/output", { recursive: true });
copyFileSync(asal, tujuan);
const hasil = readFileSync(tujuan);
if (!hasil.equals(data)) throw new Error("salinan tidak identik dengan sumber");
console.log(`disalin: ${tujuan} (${data.length} byte, ${lebar}x${tinggi})`);
