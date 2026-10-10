# StudioX · First motion film

30-second promotional concept: **Great ideas should move faster.**

This project uses the existing Hyperframes engine. It is the first motion sample, not a shipped StudioX editor or proof of model superiority.

## Run

Node 22+, FFmpeg/FFprobe and Chromium are required. From this directory:

```bash
npm ci
npm run assets
npm run check
npm run preview
npm run render
```

The CLI and GSAP are pinned by package-lock.json. `assets` regenerates the original 30-second stereo soundtrack and local GSAP bundle; English glyph subsets of the DejaVu fonts are shipped (basic Latin plus punctuation). No audio provider, key or paid API is used. After install and browser setup, rendering uses local assets.

`npm run render:4k` supersamples the same 1920×1080 layout to 3840×2160. It takes longer; review the 1080p film first. `HYPERFRAMES_BROWSER_PATH` can point at an existing Chromium executable. To fix a missing managed browser, use `npx --no-install hyperframes browser ensure`.

## Editing contract

`storyboard.json` holds copy, scene slots, motion cues and palette. After changes run `node scripts/sync-storyboard.mjs`, then `npm run check`. The verifier rejects mismatched scene timing, duplicate IDs, bad cues, copy references and audio duration. The JSON is a StudioX authoring manifest; Hyperframes reads the generated HTML and paused GSAP timeline.

`style.css` holds resting layouts; `motion.js` holds the tested choreography. Changing text needs fit review. Changing scene lengths also needs audio re-timing in `scripts/prepare-assets.mjs`. This first film deliberately keeps a single timeline; adding more subjects should extract proven motifs into scene components before claiming reusable automation.

## Provenance and review

Astra: creative direction. Sol: implementation. Luna: rendering-contract review. Root agent: integration, sound, validation and GitHub delivery. Fonts: DejaVu (license in assets/FONT-LICENSE.txt). GSAP 3.14.2 retains its upstream license notice; see https://gsap.com/standard-license. Hyperframes: Apache-2.0 (repository LICENSE).

Measure authoring, correction, browser setup, frame capture, encode and audio mixing separately. This first run includes cold setup; there is no matched Opus or open-weight baseline and no substantiated 90–99% speed claim.
