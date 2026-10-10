import { readFile, writeFile, mkdir, unlink, rename } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(path.join(root, 'index.html'), 'utf8');
const audio = /\s*<audio id="studiox-score"[^>]*><\/audio>/;
if (!audio.test(source)) throw new Error('Expected scored audio slot was not found');
const videoEntry = path.join(root, 'index-video.html');
await writeFile(videoEntry, source.replace(audio, ''));
await mkdir(path.join(root, 'renders'), {recursive:true});
const silent = path.join(root, 'renders', 'StudioX-Viewport-Picture.mp4');
const final = path.join(root, 'renders', 'StudioX-Viewport-Motion-Study.mp4');
const muxed = path.join(root, 'renders', 'StudioX-Viewport-Motion-Study.tmp.mp4');
const hyperframes = path.join(root, 'node_modules', '.bin', 'hyperframes');
try {
  execFileSync(hyperframes, ['render', '--composition', 'index-video.html',
    '--fps', '30', '--quality', 'delivery', '--output', silent,
    '--workers', '2', '--no-low-memory-mode'], {cwd:root,stdio:'inherit'});
} finally {
  await unlink(videoEntry);
}
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', silent,
  '-i', path.join(root, 'assets', 'score.wav'), '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
  '-t', '30', '-movflags', '+faststart', muxed], {cwd:root,stdio:'inherit'});
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries',
  'format=duration', '-show_entries', 'stream=codec_name', '-of', 'json', muxed],
{cwd:root,encoding:'utf8'}));
if (Math.abs(Number(probe.format?.duration) - 30) > 0.04 ||
    !probe.streams?.some(s => s.codec_name === 'h264') ||
    !probe.streams?.some(s => s.codec_name === 'aac')) {
  throw new Error('Muxed export failed duration or stream verification');
}
await rename(muxed, final);
console.log(`Delivered ${final}`);
