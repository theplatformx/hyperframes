import { createHash } from "node:crypto";
import { readFile, writeFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const require = createRequire(import.meta.url);
async function download(name, url, hash) {
  const destination = path.join(assets, name);
  try {
    await access(destination);
  } catch {
    execFileSync(
      "curl",
      ["--fail", "-L", "--connect-timeout", "30", "--max-time", "180", url, "-o", destination],
      { stdio: "inherit" },
    );
  }
  const actual = createHash("sha256")
    .update(await readFile(destination))
    .digest("hex");
  if (actual !== hash) throw new Error(`${name}: source hash changed; review before updating`);
  return destination;
}
const svg = await download(
  "tradingview-chart-source.svg",
  "https://static.tradingview.com/static/bundles/make-it-easy.ca34373f92d54032738c.svg",
  "32788b5244c077521a7d1ee0f04106df26df090d07504061c524cd705c173ea2",
);
await sharp(svg, { density: 144 })
  .resize(2400, 1200)
  .png()
  .toFile(path.join(assets, "tradingview-chart.png"));
await download(
  "catalyst-source.mp3",
  "https://www.scottbuckley.com.au/library/wp-content/uploads/2020/06/sb_catalyst.mp3",
  "8dabdc650ed2db00c9b5b685e5c9ddbc9e14e5d9f4a8dcd3f87db3ccf139e41e",
);
await writeFile(
  path.join(assets, "gsap.min.js"),
  await readFile(require.resolve("gsap/dist/gsap.min.js")),
);
execFileSync("python3", [path.join(root, "scripts/mix-audio.py")], { stdio: "inherit" });
console.log("Pinned local visual and audio assets ready.");
