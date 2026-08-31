/* Copies the web app into src-tauri/dist for bundling.
 *
 * The same index.html / app.js / style.css serve GitHub Pages from the repo
 * root, so there is exactly one frontend. This only stages it — it is not a
 * build step, and the web app still has none.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const DIST = path.resolve(HERE, '../dist');

const FILES = [
  'index.html',
  'app.js',
  'style.css',
  'config.js',
  'lock.js',
  'manifest.json',
  'icon.png',
];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const missing = [];
for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (!fs.existsSync(src)) { missing.push(f); continue; }
  fs.copyFileSync(src, path.join(DIST, f));
}

if (missing.length) {
  console.error(`\n✗ חסרים קבצים בשורש הפרויקט: ${missing.join(', ')}\n`);
  process.exit(1);
}

console.log(`✓ הועתקו ${FILES.length} קבצים ל-src-tauri/dist`);
