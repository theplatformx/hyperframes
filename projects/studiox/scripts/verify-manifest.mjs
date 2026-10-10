import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "storyboard.json"), "utf8"));
const html = readFileSync(resolve(root, "index.html"), "utf8");
const embedded = html.match(
  /<script id="studiox-storyboard" type="application\/json">([\s\S]*?)<\/script>/,
);
assert.ok(embedded, "Embedded storyboard missing");
assert.deepEqual(JSON.parse(embedded[1]), manifest, "Embedded and canonical storyboards differ");
const attrs = (tag) =>
  Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const tags = [...html.matchAll(/<(?:div|section|audio)\b[^>]*>/g)].map((m) => attrs(m[0]));
const composition = tags.find((tag) => tag["data-composition-id"] === manifest.id);
assert.ok(composition, "Root composition missing");
for (const key of ["width", "height", "fps", "duration"]) {
  assert.equal(Number(composition[`data-${key}`]), manifest[key], `Root ${key} differs`);
}
let end = 0;
for (const scene of manifest.scenes) {
  assert.equal(scene.start, end, `Gap or overlap before ${scene.id}`);
  const tag = tags.find((item) => item.id === `scene-${scene.id}`);
  assert.ok(tag, `Scene ${scene.id} missing`);
  assert.equal(Number(tag["data-start"]), scene.start, `Scene ${scene.id} start differs`);
  assert.equal(Number(tag["data-duration"]), scene.duration, `Scene ${scene.id} duration differs`);
  for (const cue of Object.values(scene.cues)) {
    assert.ok(cue >= 0 && cue < scene.duration, `Cue outside ${scene.id}`);
  }
  end = Math.round((scene.start + scene.duration) * manifest.fps) / manifest.fps;
}
assert.equal(end, manifest.duration, "Scenes do not fill the film");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate DOM ids");
const sound = tags.find((tag) => tag.id === "studiox-soundtrack");
assert.equal(sound.src, manifest.audio.source);
assert.equal(Number(sound["data-duration"]), manifest.duration);
assert.equal(Number(sound["data-start"]), manifest.audio.start);
assert.equal(Number(sound["data-track-index"]), manifest.audio.track);
for (const match of html.matchAll(/data-copy="([^:]+):(\d+)"/g)) {
  assert.ok(
    manifest.scenes.find((scene) => scene.id === match[1])?.copy[Number(match[2])],
    "Copy reference missing",
  );
}
console.log(
  `Verified ${manifest.scenes.length} scenes, ${manifest.duration * manifest.fps} frames, copy, assets and timeline contract.`,
);
