import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
mkdirSync(resolve(root, "assets"), { recursive: true });
copyFileSync(require.resolve("gsap/dist/gsap.min.js"), resolve(root, "assets/gsap.min.js"));

// Original deterministic score, 48kHz stereo PCM. No third-party music or API.
const rate = 48000;
const seconds = 30;
const mix = new Float64Array(rate * seconds);
function add(start, duration, fn) {
  const first = Math.round(start * rate);
  const count = Math.round(duration * rate);
  for (let j = 0; j < count && first + j < mix.length; j++) {
    mix[first + j] += fn(j / rate, j / count);
  }
}
const tau = Math.PI * 2;
const cues = [0.3, 3, 3.5, 6, 9, 10, 13, 14.7, 16.3, 18, 21.8, 23, 26];
for (const at of cues) {
  add(
    at,
    0.16,
    (t) => 0.13 * Math.exp(-55 * t) * (Math.sin(tau * 1480 * t) + 0.4 * Math.sin(tau * 2391 * t)),
  );
}
for (let at = 6; at < 26; at += 0.5) {
  add(
    at,
    0.38,
    (t) => 0.2 * Math.exp(-11 * t) * Math.sin(tau * (49 * t + 3 * (1 - Math.exp(-35 * t)))),
  );
  add(
    at + 0.25,
    0.09,
    (t) => 0.025 * Math.exp(-45 * t) * (Math.sin(tau * 7313 * t) + Math.sin(tau * 8923 * t)),
  );
}
for (const at of [6, 9, 13, 18, 23]) {
  add(
    at,
    0.85,
    (t) => 0.11 * Math.exp(-7 * t) * Math.sin(tau * (42 * t + 2 * (1 - Math.exp(-30 * t)))),
  );
}
for (const hz of [146.83, 220, 293.66, 440]) {
  add(13, 13, (t, p) => 0.015 * Math.sin(Math.PI * p) ** 2 * Math.sin(tau * hz * t));
  add(26, 4, (t, p) => 0.024 * Math.min(1, t * 5) * (1 - p) ** 1.6 * Math.sin(tau * hz * t));
}
for (const at of [5.55, 8.55, 17.55, 22.55]) {
  add(
    at,
    0.45,
    (t, p) => 0.055 * Math.sin(Math.PI * p) ** 2 * Math.sin(tau * (320 * t + 2100 * t * t)),
  );
}
const pcm = Buffer.alloc(44 + mix.length * 4);
pcm.write("RIFF", 0);
pcm.writeUInt32LE(pcm.length - 8, 4);
pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(rate, 24);
pcm.writeUInt32LE(rate * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write("data", 36);
pcm.writeUInt32LE(mix.length * 4, 40);
let peak = 0;
for (const sample of mix) peak = Math.max(peak, Math.abs(sample));
const gain = 0.7 / Math.max(peak, 0.7);
for (let i = 0; i < mix.length; i++) {
  const fade = Math.min(1, i / (rate * 0.015), (mix.length - 1 - i) / (rate * 0.12));
  const sample = Math.round(mix[i] * gain * fade * 32767);
  pcm.writeInt16LE(sample, 44 + i * 4);
  pcm.writeInt16LE(sample, 46 + i * 4);
}
writeFileSync(resolve(root, "assets/soundtrack.wav"), pcm);
console.log("Prepared local GSAP and original 30-second soundtrack.");
