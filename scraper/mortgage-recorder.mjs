/* Budgy — monthly mortgage recorder.

   Opens a real browser at the bank, waits while you sign in yourself, then
   reads the outstanding balance and the per-route breakdown off whatever the
   site fetched, and hands it to the record-mortgage Edge Function, which
   stores the snapshot and pushes "המשכנתא ירדה ב-X ₪" to your phone.

   Credentials: this script never sees them. It does not type, store, read or
   transmit your password or OTP — you sign in by hand in the window it opens,
   exactly as you would normally. It only reads *responses* the bank sends back
   after you are already in, and it skips auth-related URLs entirely so no
   session token ends up on disk.

   Database access: none. This machine holds one shared secret that can record
   a mortgage snapshot and nothing else; the service-role key stays in the
   Edge Function.

   Usage
     node mortgage-recorder.mjs              record this month + push
     node mortgage-recorder.mjs --dry-run    extract and print, write nothing
     node mortgage-recorder.mjs --discover   dump every JSON response for inspection
     node mortgage-recorder.mjs --replay dir re-run extraction on a discover dump
*/

import readline from 'node:readline/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractMortgage, redact } from './extract.mjs';

/* playwright is imported lazily, so --replay and the tests run on a bare
   checkout with nothing installed. */

const HERE = fileURLToPath(new URL('.', import.meta.url));

try {
  process.loadEnvFile(path.join(HERE, '.env'));
} catch {
  /* no .env yet — the config check below reports what is missing */
}

/* ── config ───────────────────────────────────────── */

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const MODE = {
  discover: has('--discover'),
  dryRun: has('--dry-run'),
  yes: has('--yes') || has('-y'),
  noPush: has('--no-push'),
  replay: val('--replay', null),
  timeoutMin: parseInt(val('--timeout', '12'), 10),
};

const CFG = {
  supabaseUrl: (process.env.SUPABASE_URL || '').replace(/\/+$/, ''),
  secret: process.env.PUSH_SECRET,
  userId: process.env.BUDGY_USER_ID,
  /* The sign-in form itself — the marketing host costs an extra click. */
  startUrl: process.env.BANK_START_URL || 'https://sc.mizrahi-tefahot.co.il/TFHLogin/index.html#/login',
  institution: process.env.BANK_INSTITUTION_ID || 'mizrahi',
  profileDir: process.env.BROWSER_PROFILE_DIR || path.join(HERE, 'browser-profile'),
};

/* Never store a response body from an auth flow — that is where tokens live. */
const SKIP_URL = /(login|logon|signin|sign-in|auth|oauth|token|otp|sms|captcha|password|identify|kyc)/i;
const ASSET_URL = /\.(js|css|png|jpe?g|gif|svg|woff2?|ttf|ico|map)(\?|$)/i;

/* The bank's raw payload is kept for re-parsing later, but not at any size. */
const MAX_RAW_BYTES = 250_000;

const nis = (n) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(Math.round(n));
const nis2 = (n) => new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const log = (...a) => console.log(...a);
const isTTY = process.stdin.isTTY && process.stdout.isTTY;

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

function requireConfig() {
  const missing = [
    !CFG.supabaseUrl && 'SUPABASE_URL',
    !CFG.secret && 'PUSH_SECRET',
    !CFG.userId && 'BUDGY_USER_ID',
  ].filter(Boolean);
  if (missing.length) die(`חסר ב-.env: ${missing.join(', ')}  (העתק מ-.env.example)`);
}

/* ── API — the only channel to Supabase ───────────── */

async function api(payload) {
  const res = await fetch(`${CFG.supabaseUrl}/functions/v1/record-mortgage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-push-secret': CFG.secret },
    body: JSON.stringify({ user_id: CFG.userId, ...payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) {
    throw new Error(body.error ? `${res.status} ${body.error}` : `HTTP ${res.status}`);
  }
  return body;
}

/** Last known balance — the anchor the extraction heuristic leans on. */
async function readAnchor() {
  const r = await api({ action: 'anchor' });
  return { value: r.value ?? null, from: r.from ?? null };
}

async function record(result, captures, { dry }) {
  const rawSource = captures.find((c) => c.url === result.balanceSource?.url)?.json ?? null;

  /* When the payload is one the Edge Function knows how to read, send it raw
     and let the server parse. The phone bookmarklet takes the same path, so
     both clients store identical numbers and a field rename is a redeploy
     rather than two separate fixes. The bank's own as-of date is used, so
     snapshot_date is deliberately not sent here. */
  if (result.balanceSource?.shape === 'mizrahi.profile' && rawSource) {
    return api({ action: 'record_profile', via: 'pc', profile: rawSource, push: !MODE.noPush, dry });
  }

  let raw = redact(rawSource);
  if (raw && JSON.stringify(raw).length > MAX_RAW_BYTES) {
    raw = { _note: 'raw payload omitted — over size limit', _url: result.balanceSource?.url ?? null };
  }

  return api({
    action: 'record',
    snapshot_date: new Date().toISOString().slice(0, 10),
    institution_id: CFG.institution,
    balance: result.balance,
    payoff_balance: result.payoff,
    early_repayment_fees: result.fees,
    routes: result.routes.map(({ raw: _r, ...r }) => r),
    confidence: result.confidence,
    source: { ...result.balanceSource, routes: result.routesSource, sum_matches: result.sumMatches },
    raw,
    push: !MODE.noPush,
    dry,
  });
}

/* ── browser ──────────────────────────────────────── */

async function launch() {
  const mod = await import('playwright').catch(() => null);
  if (!mod) die('Playwright לא מותקן. הרץ:  npm install');
  const { chromium } = mod;

  await fs.mkdir(CFG.profileDir, { recursive: true });
  const opts = {
    headless: false,
    viewport: null,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized'],
  };
  /* Prefer the real Chrome already on this machine — a genuine sign-in should
     not look synthetic to the bank. */
  try {
    return await chromium.launchPersistentContext(CFG.profileDir, { ...opts, channel: 'chrome' });
  } catch {
    log('· Chrome לא נמצא, נופל ל-Chromium המצורף');
    return await chromium.launchPersistentContext(CFG.profileDir, opts);
  }
}

/** Collect every JSON response the site receives, minus auth traffic. */
function startCapture(context) {
  const captures = [];
  const seen = new Set();

  context.on('response', async (res) => {
    try {
      const url = res.url();
      if (ASSET_URL.test(url) || SKIP_URL.test(url)) return;
      const ct = (res.headers()['content-type'] || '').toLowerCase();
      if (!ct.includes('json')) return;
      if (parseInt(res.headers()['content-length'] || '0', 10) > 4_000_000) return;

      const text = await res.text();
      if (!text || text.length > 4_000_000) return;
      const key = url.split('?')[0] + ':' + text.length;
      if (seen.has(key)) return;
      seen.add(key);

      captures.push({ url, json: JSON.parse(text) });
    } catch {
      /* non-JSON, aborted, or navigated away — nothing to record */
    }
  });

  return captures;
}

async function pageText(context) {
  let out = '';
  for (const p of context.pages()) {
    try {
      out += '\n' + (await p.evaluate(() => document.body?.innerText ?? ''));
    } catch {
      /* page closed or cross-origin */
    }
  }
  return out;
}

/**
 * Poll until the data shows up. Runs the full extraction every couple of
 * seconds, so the moment you land on the mortgage page we are done — no
 * selectors, no guessing which click matters.
 */
async function waitForData(context, captures, anchor, timeoutMs) {
  const started = Date.now();
  let forced = false;

  /* Must be closed before confirm() opens its own reader, or this one keeps
     stdin and swallows the y/N answer. */
  let rl = null;
  if (isTTY) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('').then(() => { forced = true; }).catch(() => {});
  }

  try {
    while (Date.now() - started < timeoutMs) {
      await new Promise((r) => setTimeout(r, 2500));
      if (!context.pages().length) break;

      const result = extractMortgage(captures, { anchor, pageText: await pageText(context) });

      const mins = Math.floor((Date.now() - started) / 60000);
      const found = result.balance
        ? `יתרה משוערת ${nis2(result.balance)} ₪ (${result.confidence})`
        : 'עדיין לא זוהתה יתרה';
      process.stdout.write(
        `\r  ⏳ ${captures.length} תגובות נקלטו · ${found} · ${mins}/${Math.floor(timeoutMs / 60000)} דק'          `,
      );

      if (result.confidence === 'high' && result.routes.length) break;
      if (forced) break;
    }
  } finally {
    rl?.close();
    process.stdout.write('\n');
  }

  return extractMortgage(captures, { anchor, pageText: await pageText(context) });
}

/* ── discover / replay ────────────────────────────── */

async function dumpDiscovery(captures) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = path.join(HERE, 'discovery', stamp);
  await fs.mkdir(dir, { recursive: true });

  const index = [];
  for (let i = 0; i < captures.length; i++) {
    const c = captures[i];
    const safe = c.url.replace(/^https?:\/\//, '').replace(/[^a-z0-9._-]/gi, '_').slice(0, 90);
    const file = `${String(i).padStart(3, '0')}-${safe}.json`;
    await fs.writeFile(path.join(dir, file), JSON.stringify(redact(c.json), null, 2), 'utf8');
    index.push({ file, url: c.url });
  }
  await fs.writeFile(path.join(dir, '_index.json'), JSON.stringify(index, null, 2), 'utf8');
  return dir;
}

async function loadReplay(dir) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json') && f !== '_index.json');
  const out = [];
  for (const f of files) {
    try {
      out.push({ url: f, json: JSON.parse(await fs.readFile(path.join(dir, f), 'utf8')) });
    } catch {
      /* skip unreadable dump file */
    }
  }
  return out;
}

/* ── reporting ────────────────────────────────────── */

function printResult(result, anchor) {
  log('\n══════════════════════════════════════');
  if (!result.balance) {
    log('  לא זוהתה יתרת משכנתא.');
    log('  הרץ שוב עם --discover כדי לשמור את כל התגובות ולבדוק ידנית.');
    log('══════════════════════════════════════\n');
    return;
  }
  log(`  יתרת קרן:     ${nis2(result.balance)} ₪`);
  if (anchor != null) {
    const d = anchor - result.balance;
    log(`  מול קודם:     ${d >= 0 ? '−' : '+'}${nis2(Math.abs(d))} ₪  (${nis2(anchor)} ₪)`);
  }
  if (result.payoff != null && result.payoff !== result.balance) {
    const extra = result.payoff - result.balance;
    log(`  יתרה לסילוק:  ${nis2(result.payoff)} ₪  (+${nis2(extra)} ריבית צבורה)`);
  }
  if (result.fees) log(`  עמלות פירעון: ${nis2(result.fees)} ₪`);
  if (result.arrears) log(`  ⚠ פיגורים:    ${nis2(result.arrears)} ₪`);
  log(`  ביטחון:       ${result.confidence}${result.balanceSource.shape ? ` · ${result.balanceSource.shape}` : result.sumMatches ? ' · סכום המסלולים תואם' : ''}`);
  log(`  נכון לתאריך:  ${result.asOf ?? '—'}`);
  log(`  מקור:         ${result.balanceSource.path} @ ${result.balanceSource.url.slice(0, 70)}`);

  if (result.routes.length) {
    log(`\n  מסלולים (${result.routes.length}):`);
    for (const r of result.routes) {
      log('   · ' + [
        (r.name || 'ללא שם').slice(0, 32).padEnd(32),
        r.balance != null ? `${nis(r.balance)} ₪`.padStart(13) : ''.padStart(13),
        r.rate != null ? `${r.rate}%`.padStart(7) : ''.padStart(7),
        r.linkage || '',
      ].join(' '));
    }
  } else {
    log('\n  לא זוהו מסלולים (היתרה בלבד תישמר).');
  }
  log('══════════════════════════════════════\n');
}

async function confirm(q) {
  if (MODE.yes || !isTTY) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question(`${q} [y/N] `)).trim().toLowerCase();
  rl.close();
  return a === 'y' || a === 'yes';
}

/* ── main ─────────────────────────────────────────── */

async function main() {
  log('\n  Budgy — קליטת משכנתא חודשית\n');

  /* Replay is a debugging aid: no browser and no bank. */
  if (MODE.replay) {
    let anchor = { value: null, from: null };
    if (CFG.supabaseUrl && CFG.secret && CFG.userId) anchor = await readAnchor();
    const captures = await loadReplay(MODE.replay);
    log(`· נטענו ${captures.length} קבצים מ-${MODE.replay}`);
    printResult(extractMortgage(captures, { anchor: anchor.value }), anchor.value);
    return;
  }

  let anchor = { value: null, from: null };
  if (!MODE.discover) {
    requireConfig();
    anchor = await readAnchor();
    log(anchor.value != null
      ? `· יתרה קודמת: ${nis2(anchor.value)} ₪  (${anchor.from})`
      : '· אין יתרה קודמת — זו הקליטה הראשונה');
  }

  const context = await launch();
  const captures = startCapture(context); // attach before the first navigation
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(CFG.startUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});

  log(`\n  ${'─'.repeat(52)}`);
  log('  1. התחבר לחשבון בדפדפן שנפתח (סיסמה + OTP — ידנית).');
  log('  2. נווט אל: משכנתאות ← פירוט מסלולים / יתרה לסילוק.');
  log('  3. הסקריפט יזהה את הנתונים לבד. אפשר גם ללחוץ Enter כאן');
  log('     כדי לקרוא את מה שנקלט עד עכשיו.');
  log(`  ${'─'.repeat(52)}\n`);

  const result = await waitForData(context, captures, anchor.value, MODE.timeoutMin * 60_000);

  if (MODE.discover) {
    const dir = await dumpDiscovery(captures);
    log(`\n✓ נשמרו ${captures.length} תגובות ל:\n  ${dir}`);
    log('  ⚠ התיקייה מכילה נתוני חשבון אמיתיים — היא ב-.gitignore, אל תשתף אותה.\n');
    printResult(result, anchor.value);
    await context.close();
    return;
  }

  printResult(result, anchor.value);
  await context.close();

  if (!result.balance) process.exit(2);
  if (result.confidence !== 'high') {
    log('  ⚠ רמת הביטחון אינה גבוהה — בדוק שהמספר תואם למה שראית בבנק.');
  }

  if (MODE.dryRun) {
    const r = await record(result, captures, { dry: true });
    log(`· --dry-run: לא נשמר כלום. ההתראה שהייתה נשלחת:\n    ${r.push.title}\n    ${r.push.message}\n`);
    return;
  }
  if (!(await confirm('לשמור ולשלוח התראה?'))) {
    log('· בוטל.\n');
    return;
  }

  const r = await record(result, captures, { dry: false });
  log(`✓ נשמר snapshot לתאריך ${r.snapshot_date}`);
  log(r.record_sync?.updated
    ? `✓ עודכן הדוח החודשי (${r.record_sync.date}): ${nis(r.record_sync.was)} ← ${nis(r.balance)} ₪`
    : `· הדוח החודשי לא עודכן — ${r.record_sync?.reason ?? 'לא ידוע'}`);
  log(r.push?.skipped
    ? '· --no-push: לא נשלחה התראה.'
    : `✓ נשלחה התראה (${r.push?.sent ?? 0} מכשירים): ${r.push?.title}`);
  log('');

  /* Machine-readable tail, only when helper.mjs is the one running us. */
  if (process.env.BUDGY_HELPER === '1') {
    log('__BUDGY_RESULT__ ' + JSON.stringify({
      snapshot_date: r.snapshot_date,
      balance: r.balance,
      previous: r.previous,
      delta: r.delta,
      routes: r.routes,
      title: r.push?.title ?? null,
      message: r.push?.message ?? null,
    }));
  }
}

main().catch((e) => {
  console.error('\n✗ שגיאה:', e?.message || e);
  process.exit(1);
});
