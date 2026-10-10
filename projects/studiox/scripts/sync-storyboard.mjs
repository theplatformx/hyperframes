import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "storyboard.json"), "utf8"));
const file = resolve(root, "index.html");
let html = readFileSync(file, "utf8");
html = html.replace(
  /(<script id="studiox-storyboard" type="application\/json">)[\s\S]*?(<\/script>)/,
  (_, before, after) => `${before}${JSON.stringify(manifest, null, 2)}${after}`,
);
for (const scene of manifest.scenes) {
  html = html.replace(new RegExp(`<section\\b[^>]*id="scene-${scene.id}"[^>]*>`), (tag) =>
    tag
      .replace(/data-start="[^"]*"/, `data-start="${scene.start}"`)
      .replace(/data-duration="[^"]*"/, `data-duration="${scene.duration}"`),
  );
}
writeFileSync(file, html);
console.log(
  "Synchronized storyboard embedding and static scene slots. Run check before rendering.",
);
