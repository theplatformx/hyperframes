# StudioX Viewport × TradingView · 30-second motion study

An independent concept film. The market signal is a moving vector object throughout the cut: it draws a path, creates a chart, becomes a cursor and annotation, morphs three chart views, converges three panels, and becomes the typographic seam. All chart and interface data are illustrative. This is not a TradingView endorsement, current price display, or trading recommendation.

## Reproduce

Node 22+, Python 3 with NumPy, FFmpeg, curl and Chrome/Chromium are required. Hyperframes and GSAP are pinned in `package-lock.json`.

```bash
cd projects/studiox-v3
npm ci
npm run assets
npm run lint
npm run check
npm run render
```

If Chrome is installed outside the usual path, set `HYPERFRAMES_BROWSER_PATH` to its binary. `scripts/prepare-assets.mjs` verifies the SHA-256 hash of the licensed music source, copies the pinned GSAP runtime, and generates the 30-second WAV. `scripts/render-film.mjs` renders the coded picture in Hyperframes and muxes the authored score with FFmpeg. This avoids a Hyperframes 0.8.145 audio-normalization failure observed during this export. Assets and renders are excluded from git where they can be rebuilt. The font files and their license are retained with the source. `STORYBOARD.md` records the visual sequence; `motion.js` authors deterministic GSAP animation; `scripts/build-score.py` authors the sectional music edit and event sound cues.

## Media credit

Music: **“Catalyst” by Scott Buckley**, CC BY 4.0, https://www.scottbuckley.com.au/library/catalyst/ . Four excerpts and original effects are remixed and mastered for the cut; the on-film music credit must be retained in public exports. See https://creativecommons.org/licenses/by/4.0/ . Fonts: DejaVu subsets, license in `assets/FONT-LICENSE.txt`. GSAP notice: `assets/GSAP-NOTICE.md`.

## Quality gates

The browser check catches broken rendering, clipping, text collisions and basic contrast; it cannot grade editorial rhythm. Review the rendered MP4 with audio and check the motion at 9.4–10.3, 19.5–20.3 and 26.8–28.5. This film is 30 seconds by request, separate from the planned 60-second deliverable.
