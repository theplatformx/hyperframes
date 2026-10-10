import { createHash } from 'node:crypto';
import { readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
const require = createRequire(import.meta.url);
const destination = path.join(assets, 'catalyst-source.mp3');
try {
  await access(destination);
} catch {
  execFileSync('curl', [
    '--fail', '-L', '--connect-timeout', '30', '--max-time', '180',
    'https://www.scottbuckley.com.au/library/wp-content/uploads/2020/06/sb_catalyst.mp3',
    '-o', destination,
  ], {stdio:'inherit'});
}
const actual = createHash('sha256').update(await readFile(destination)).digest('hex');
const expected = '8dabdc650ed2db00c9b5b685e5c9ddbc9e14e5d9f4a8dcd3f87db3ccf139e41e';
if (actual !== expected) throw new Error('Music source changed; review license and asset before updating');
await writeFile(path.join(assets, 'gsap.min.js'), await readFile(require.resolve('gsap/dist/gsap.min.js')));
execFileSync('python3', [path.join(root, 'scripts/build-score.py')], {stdio:'inherit'});
console.log('Pinned local assets and scored sound edit ready.');
