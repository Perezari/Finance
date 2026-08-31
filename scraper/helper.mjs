/* Budgy import helper — a tiny local server so the "ייבא נתונים מהבנק"
 * button in Budgy can start the recorder on this PC.
 *
 * A web page cannot launch a process. This is the standard way around that:
 * a loopback server the page talks to over fetch. It:
 *
 *   • binds 127.0.0.1 only, so nothing outside this machine can reach it
 *   • answers only the Budgy origins listed below, so a random site you visit
 *     cannot trigger it
 *   • does nothing destructive — the worst it can do is open a browser window
 *     that you then have to sign into yourself
 *
 *   GET  /ping    -> { ok, version }        is the helper running?
 *   POST /import  -> { started }            launch the recorder
 *   GET  /status  -> { state, message, … }  poll while it runs
 *
 * Start it by double-clicking helper.bat.
 */
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.BUDGY_HELPER_PORT || 8787);
const VERSION = '1.0.0';

/* Only these pages may talk to the helper. */
const ALLOWED_ORIGINS = new Set([
  'https://perezari.github.io',
  'http://localhost:5599',
  'http://127.0.0.1:5599',
]);

let job = { state: 'idle', message: '', result: null, startedAt: null };

const json = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  /* Chrome's Private Network Access preflight for public page -> localhost. */
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
}

/** Last human-readable line the recorder printed, for the progress label. */
function lastLine(buf) {
  const parts = buf.replace(/\r/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (!parts[i].startsWith('__BUDGY_RESULT__')) return parts[i].slice(0, 160);
  }
  return '';
}

function startImport() {
  if (job.state === 'running') return false;
  job = { state: 'running', message: 'נפתח דפדפן…', result: null, startedAt: Date.now() };

  const child = spawn(process.execPath, [path.join(HERE, 'mortgage-recorder.mjs'), '--yes'], {
    cwd: HERE,
    env: { ...process.env, BUDGY_HELPER: '1' },
  });

  let out = '';
  const collect = (d) => {
    out += d.toString();
    if (job.state === 'running') job.message = lastLine(out) || job.message;
  };
  child.stdout.on('data', collect);
  child.stderr.on('data', collect);

  child.on('error', (e) => {
    job = { state: 'error', message: `לא הצלחנו להריץ את הסקריפט: ${e.message}`, result: null };
  });

  child.on('exit', (code) => {
    const m = out.match(/__BUDGY_RESULT__ (\{.*\})/);
    let result = null;
    if (m) { try { result = JSON.parse(m[1]); } catch { /* keep null */ } }

    if (code === 0 && result) {
      job = { state: 'done', message: result.title || 'הנתונים עודכנו', result };
    } else if (code === 0) {
      job = { state: 'done', message: 'הסתיים', result: null };
    } else {
      job = { state: 'error', message: lastLine(out) || `הסקריפט נכשל (קוד ${code})`, result: null };
    }
    console.log(`[import] ${job.state}: ${job.message}`);
  });

  return true;
}

const server = http.createServer((req, res) => {
  applyCors(req, res);

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(res, 403, { ok: false, error: 'origin' });

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === '/ping') return json(res, 200, { ok: true, version: VERSION });
  if (url.pathname === '/status') return json(res, 200, { ok: true, ...job });
  if (url.pathname === '/import' && req.method === 'POST') {
    const started = startImport();
    return json(res, started ? 200 : 409, { ok: started, started, state: job.state });
  }
  return json(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log(`  Budgy import helper — מאזין על http://127.0.0.1:${PORT}`);
  console.log('  השאר את החלון הזה פתוח, ולחץ על "ייבא נתונים מהבנק" ב-Budgy.');
  console.log('  לסגירה: Ctrl+C');
  console.log('');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n✗ פורט ${PORT} תפוס — כנראה שהעוזר כבר רץ בחלון אחר.\n`);
    process.exit(1);
  }
  throw e;
});
