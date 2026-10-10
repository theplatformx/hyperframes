# TradingView — a StudioX Viewport concept film

A 30-second, 1920 × 1080, 30 fps independent motion film. The edit combines editorial typography, local TradingView product artwork, illustrative chart studies, perspective panels, a tracked chart close-up, a three-beat montage and a quiet StudioX Viewport closing credit. No affiliation or commission from TradingView is represented.

## Reproduce

Requires Node 22+, Python 3 with NumPy, FFmpeg and curl. Hyperframes and GSAP versions are pinned in package-lock.json. A Chrome-compatible browser is required for validation and rendering; set HYPERFRAMES_BROWSER_PATH to an existing supported binary if the automatic download is unavailable.

```bash
cd projects/studiox-v2
npm ci
python3 -m pip install numpy==2.2.6
npm run assets
npm run lint
npm run check
npm run render
```

The asset preparation script downloads two public source assets, verifies their SHA-256 hashes, rasterizes the product artwork, copies the installed GSAP runtime and builds the stereo soundtrack. All playback assets are local after preparation. A changed source hash stops preparation for review.

`build_visuals.py` regenerates the seven scene templates and root orchestrator. Run `scripts/refine-moment.py` after it to apply the macro chart shot. Existing source HTML is ready to use; regeneration is optional. Scene timing and copy are documented in storyboard.json; sound events in audio-cues.json. Rendered media, installed dependencies and downloaded/generated assets are excluded from git.

## Credits and sources

Music: **“Catalyst” by Scott Buckley — released under CC BY 4.0. www.scottbuckley.com.au**. Source: https://www.scottbuckley.com.au/library/catalyst/ . License: https://creativecommons.org/licenses/by/4.0/ . Changes: 30-second excerpt beginning at source 80 seconds, fades, original layered sound effects and loudness mastering. The music attribution is included on the closing frame. Preserve it when sharing the video; include the same attribution in a YouTube description.

Product artwork: TradingView's official features page, https://www.tradingview.com/features/ , `make-it-easy.ca34373f92d54032738c.svg`. Copyright and marks remain with TradingView. Artwork is used as the subject of this independent concept demonstration. Generated chart studies are illustrative and are labelled as such; they do not show current prices or trading recommendations.

Fonts: subset DejaVu Sans Bold, DejaVu Sans Mono and DejaVu Serif; see assets/FONT-LICENSE.txt. Runtime: GSAP, see assets/GSAP-NOTICE.md.

The audio mix targets −14 LUFS integrated and −1.5 dBTP. The measured local WAV is −14.22 LUFS, −1.50 dBTP, with 7.4 LU loudness range. These describe technical levels; final listening preference is subjective.

## Validation and timing

See validation.json for the final browser gate and export checks. Render time is measured separately from research, scripting, coding, revisions, asset preparation and delivery.

Final export: 30.000 seconds, 900 H.264 frames at 1920 × 1080 / 30 fps, stereo AAC at 48 kHz, 15,984,932 bytes. Export audio measured −14.28 LUFS integrated and −1.49 dBTP. The successful two-worker beginframe render took 114.315 seconds. Use `npm run render:benchmark` for that capture profile; regular `npm run render` retains the engine’s automatic memory safeguards.
