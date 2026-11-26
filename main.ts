// NusaStat entry program (Node 22, standard library only).
//
// The site is this directory's app/ folder: plain static files a browser opens
// at app/index.html (ES modules, CSS, inline SVG charts, no build step), its
// content held in its own files — nothing it runs, styles or shows loads over
// the network. This program hands it in: it copies app/ and screenshots/ from
// beside this file to /output and writes /output/dossier.json, the summary the
// judge reads (the screenshots, the first load's files and bytes, and the
// source), with the vendored make.fun library.
//
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Refuse to hand in a broken entry: the site must exist and its screenshots
// must be present before anything is copied.
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');
if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
if (statSync(join(appDir, 'index.html')).size > 1048576) throw new Error('app/index.html is over the 1 MiB gate cap');
if (!existsSync(shotsDir)) throw new Error('screenshots/ is missing');

// The gate takes 3 or 4 screenshots, each a whole PNG or JPEG of at most
// 256 KiB; check that here so a stale or oversized render fails loudly
// instead of handing in an entry the scorer would refuse.
const shots = readdirSync(shotsDir).filter((f) => !f.startsWith('.'));
if (shots.length < 3 || shots.length > 4) throw new Error(`screenshots/ must hold 3 or 4 images, found ${shots.length}`);
for (const shot of shots) {
  if (!/\.(png|jpe?g)$/i.test(shot)) throw new Error(`screenshot ${shot} is not a PNG or JPEG`);
  const size = statSync(join(shotsDir, shot)).size;
  if (size > 262144) throw new Error(`screenshot ${shot} is ${size} bytes, over the 256 KiB gate cap`);
}

// The gate also caps each screenshot's dimensions (long side at most 1280,
// short side at least 360); read them from the PNG/JPEG headers here so a
// wrongly-sized render fails loudly instead of handing in an entry the
// scorer would refuse.
function imageSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let at = 2;
    while (at + 9 < buf.length) {
      if (buf[at] !== 0xff) throw new Error(`screenshot ${path} is not a well-formed JPEG`);
      const marker = buf[at + 1];
      const len = buf.readUInt16BE(at + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buf.readUInt16BE(at + 7), height: buf.readUInt16BE(at + 5) };
      }
      at += 2 + len;
    }
    throw new Error(`screenshot ${path} has no JPEG frame header`);
  }
  throw new Error(`screenshot ${path} is neither PNG nor JPEG`);
}

for (const shot of shots) {
  const { width, height } = imageSize(join(shotsDir, shot));
  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);
  if (longSide > 1280) throw new Error(`screenshot ${shot} is ${width}x${height}, long side over the 1280 gate cap`);
  if (shortSide < 360) throw new Error(`screenshot ${shot} is ${width}x${height}, short side under the 360 gate minimum`);
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
