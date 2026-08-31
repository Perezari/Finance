/* Builds the installable bookmarklet from bookmarklet.js.
 *
 * The repository is public, so the source keeps placeholders and the real
 * values are injected here from .env. The output lands in bookmarklet.txt,
 * which is gitignored.
 *
 *   node build-bookmarklet.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
try {
  process.loadEnvFile(path.join(HERE, '.env'));
} catch {
  /* reported below */
}

const API = `${(process.env.SUPABASE_URL || '').replace(/\/+$/, '')}/functions/v1/record-mortgage`;
const SECRET = process.env.BOOKMARKLET_SECRET;
const USER = process.env.BUDGY_USER_ID;

const missing = [
  !process.env.SUPABASE_URL && 'SUPABASE_URL',
  !SECRET && 'BOOKMARKLET_SECRET',
  !USER && 'BUDGY_USER_ID',
].filter(Boolean);
if (missing.length) {
  console.error(`\n✗ חסר ב-.env: ${missing.join(', ')}\n`);
  process.exit(1);
}

const src = fs
  .readFileSync(path.join(HERE, 'bookmarklet.js'), 'utf8')
  .replace(/^\/\*[\s\S]*?\*\/\s*/, '') // drop the doc comment
  .replaceAll('__API__', API)
  .replaceAll('__SECRET__', SECRET)
  .replaceAll('__USER__', USER);

const url = 'javascript:' + encodeURIComponent(src);
fs.writeFileSync(path.join(HERE, 'bookmarklet.txt'), url, 'utf8');

console.log(`\n✓ נכתב bookmarklet.txt  (${url.length} תווים)`);
console.log('  הקובץ מכיל סוד — הוא ב-.gitignore, אל תשתף אותו.\n');
