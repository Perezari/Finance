/* Budgy — mortgage extraction heuristics.

   Pure functions, zero I/O. Given whatever JSON the bank's site happened to
   return while we browsed it, find (a) the outstanding mortgage balance and
   (b) the per-route breakdown.

   Why heuristics instead of a hard-coded endpoint: the bank's internal API is
   undocumented, unversioned, and gets reshaped without notice. Nothing here
   depends on a specific field name. Every numeric leaf is scored, and the
   strongest signal by far is the anchor — last month's balance — because a
   mortgage only moves a fraction of a percent per month. A second, near-proof
   signal is that the route balances must sum to the total.

   If the bank renames every field tomorrow, this still works. */

const MAX_DEPTH = 12;

/* Keys that never hold a mortgage balance — account numbers, ids and dates are
   the main source of false positives because they are numbers of similar size. */
const REJECT_KEY = /(^|_|\b)(id|uuid|guid|code|key|seq|index|idx|num|number|mispar|account|acct|cheshbon|branch|snif|bank|date|time|taarich|year|shana|month|phone|zip|version|status|count|page|size|rows?)($|_|\b)/i;

const KEY_HINTS = [
  /* payoff / settlement — the exact figure the bank shows as "יתרה לסילוק" */
  [/(payoff|pay_?off|settle(ment)?|siluk|redemption)/i, 45],
  /* outstanding / remaining */
  [/(remaining|outstanding|unpaid|open)/i, 30],
  /* generic balance */
  [/(balance|yitra|yitrat|bal$)/i, 35],
  /* principal */
  [/(principal|keren)/i, 25],
  /* debt */
  [/(debt|chov|hov)/i, 25],
  /* Hebrew keys, on the off-chance the API returns them */
  [/(יתר|סילוק|קרן|חוב)/, 40],
  [/total/i, 10],
];

/* A path that runs through anything mortgage-shaped is more trustworthy. */
const PATH_HINTS = [
  [/(mortgage|mashkanta|halva|loan|credit)/i, 15],
  [/(משכנת|הלוואה)/, 15],
];

const ROUTE_NAME_KEY = /(name|desc|description|title|label|maslul|maslul|track|route|type|sug|loan_?type|product)/i;
const ROUTE_RATE_KEY = /(rate|ribit|ribbit|interest|percent|ahuz)/i;
const ROUTE_LINK_KEY = /(linkage|linked|hatzmada|hazmada|index|madad|cpi)/i;
const ROUTE_PAY_KEY = /(payment|monthly|hachzar|hehzer|tashlum|installment|pmt)/i;
const ROUTE_END_KEY = /(end|last|final|maturity|siyum|expiry|until)/i;

/* Hebrew words that only ever show up in a mortgage route description. */
const ROUTE_TEXT_HINT = /(פריים|קבועה|משתנה|צמוד|לא\s*צמוד|מדד|ריבית|מסלול|ק"צ|ק״צ|קל"צ|קל״צ|מק"מ)/;

/* ══════════════════════════════════════════════════════
   Generic JSON walking
══════════════════════════════════════════════════════ */

/** Yield every scalar leaf as { path, key, value }. */
export function* walkLeaves(node, path = [], depth = 0) {
  if (node == null || depth > MAX_DEPTH) return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* walkLeaves(node[i], [...path, i], depth + 1);
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) yield* walkLeaves(v, [...path, k], depth + 1);
    return;
  }
  yield { path, key: String(path[path.length - 1] ?? ''), value: node };
}

/** Yield every array-of-objects as { path, arr }. */
export function* walkArrays(node, path = [], depth = 0) {
  if (node == null || depth > MAX_DEPTH || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    if (node.length && node.every((e) => e && typeof e === 'object' && !Array.isArray(e))) {
      yield { path, arr: node };
    }
    for (let i = 0; i < node.length; i++) yield* walkArrays(node[i], [...path, i], depth + 1);
    return;
  }
  for (const [k, v] of Object.entries(node)) yield* walkArrays(v, [...path, k], depth + 1);
}

/** "827,934.00" / "‏₪ 827934" / 827934 -> 827934. Anything else -> null. */
export function toNumber(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const s = v.replace(/[‎‏\s₪]/g, '').replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/** yyyymmdd, unix seconds and unix millis all land in mortgage-balance range. */
function looksLikeDate(n) {
  if (!Number.isInteger(n)) return false;
  return (
    (n >= 19000101 && n <= 21001231) ||
    (n >= 1_500_000_000 && n <= 4_000_000_000) ||
    (n >= 1_500_000_000_000 && n <= 4_000_000_000_000)
  );
}

function plausibleBalance(n) {
  return Number.isFinite(n) && n >= 1000 && n <= 50_000_000 && !looksLikeDate(n);
}

/* ══════════════════════════════════════════════════════
   Balance
══════════════════════════════════════════════════════ */

function scoreKey(key, path) {
  let s = 0;
  for (const [re, pts] of KEY_HINTS) if (re.test(key)) s += pts;
  const joined = path.join('.');
  for (const [re, pts] of PATH_HINTS) if (re.test(joined)) s += pts;
  if (REJECT_KEY.test(key)) s -= 70;
  return s;
}

/** Last month's balance is the single most reliable signal we have. */
function scoreAnchor(value, anchor) {
  if (!anchor) return 0;
  const drift = Math.abs(value - anchor) / anchor;
  if (drift > 0.15) return -25;
  let s;
  if (drift <= 0.005) s = 70;
  else if (drift <= 0.02) s = 55;
  else if (drift <= 0.05) s = 35;
  else s = 15;
  if (value <= anchor) s += 15; // an amortizing loan goes down, not up
  return s;
}

/**
 * Rank every numeric leaf across all captured responses as "is this the
 * outstanding mortgage balance?".
 *
 * @param {{url:string, json:any}[]} captures
 * @param {{anchor?:number|null}} opts
 * @returns {{value:number, score:number, url:string, path:string, key:string, scale:number}[]}
 */
export function balanceCandidates(captures, { anchor = null } = {}) {
  const out = [];
  for (const cap of captures) {
    for (const { path, key, value } of walkLeaves(cap.json)) {
      const raw = toNumber(value);
      if (raw === null) continue;

      /* Some banks return agorot as integers; consider both readings. */
      const scales = [1];
      if (Number.isInteger(raw) && raw >= 100_000 && plausibleBalance(raw / 100)) scales.push(0.01);

      for (const scale of scales) {
        const n = raw * scale;
        if (!plausibleBalance(n)) continue;
        const score = scoreKey(key, path) + scoreAnchor(n, anchor) + (scale === 1 ? 0 : -10);
        if (score <= 0) continue;
        out.push({
          value: n,
          score,
          url: cap.url,
          path: path.join('.'),
          key,
          scale,
        });
      }
    }
  }
  /* Same figure reported by several endpoints is more likely the real one. */
  const byValue = new Map();
  for (const c of out) {
    const k = c.value.toFixed(2);
    if (!byValue.has(k)) byValue.set(k, []);
    byValue.get(k).push(c);
  }
  for (const group of byValue.values()) {
    if (group.length > 1) for (const c of group) c.score += Math.min(15, group.length * 3);
  }

  return out.sort((a, b) => b.score - a.score);
}

/* ══════════════════════════════════════════════════════
   Routes (מסלולים)
══════════════════════════════════════════════════════ */

function numericKeysPresentInAll(arr) {
  const counts = new Map();
  for (const el of arr) {
    for (const [k, v] of Object.entries(el)) {
      if (toNumber(v) !== null) counts.set(k, (counts.get(k) || 0) + 1);
    }
  }
  return [...counts.entries()].filter(([, c]) => c === arr.length).map(([k]) => k);
}

/**
 * The route balances must add up to the total. When they do, we have found
 * both the route array and the field inside it that holds the balance — this
 * is close to proof, not a guess.
 */
function pickRouteBalanceField(arr, total) {
  if (!total) return null;
  let best = null;
  for (const key of numericKeysPresentInAll(arr)) {
    if (REJECT_KEY.test(key)) continue;
    for (const scale of [1, 0.01]) {
      const sum = arr.reduce((s, el) => s + toNumber(el[key]) * scale, 0);
      const drift = Math.abs(sum - total) / total;
      if (drift > 0.03) continue;
      const score = 100 - drift * 1000 + (scale === 1 ? 0 : -10);
      if (!best || score > best.score) best = { key, scale, sum, drift, score };
    }
  }
  return best;
}

function scoreRouteArray(arr, total) {
  if (arr.length < 1 || arr.length > 20) return { score: -1 };
  let score = 0;

  const sample = arr[0];
  const keys = Object.keys(sample);
  if (keys.length < 2) return { score: -1 };

  if (arr.length >= 2 && arr.length <= 8) score += 15; // typical mortgage shape

  if (keys.some((k) => ROUTE_RATE_KEY.test(k))) score += 25;
  if (keys.some((k) => ROUTE_LINK_KEY.test(k))) score += 20;
  if (keys.some((k) => ROUTE_PAY_KEY.test(k))) score += 15;
  if (keys.some((k) => ROUTE_NAME_KEY.test(k))) score += 10;

  /* Hebrew route wording anywhere in the element is a strong tell. */
  const text = JSON.stringify(arr).slice(0, 20000);
  if (ROUTE_TEXT_HINT.test(text)) score += 30;

  const bal = pickRouteBalanceField(arr, total);
  if (bal) score += bal.score;

  return { score, bal };
}

/** Normalise one raw route object into Budgy's shape. */
function normaliseRoute(el, balField, balScale) {
  const entries = Object.entries(el);
  const pick = (re, transform) => {
    for (const [k, v] of entries) {
      if (!re.test(k)) continue;
      const t = transform(v, k);
      if (t !== null && t !== undefined && t !== '') return t;
    }
    return null;
  };

  const balance = balField ? toNumber(el[balField]) * balScale : null;

  let rate = pick(ROUTE_RATE_KEY, (v) => {
    const n = toNumber(v);
    return n !== null && n >= 0 && n <= 30 ? n : null;
  });

  const name =
    pick(ROUTE_NAME_KEY, (v) => (typeof v === 'string' && v.trim() ? v.trim() : null)) ??
    /* fall back to any Hebrew string that reads like a route description */
    (entries.find(([, v]) => typeof v === 'string' && ROUTE_TEXT_HINT.test(v))?.[1] ?? null);

  const linkage = pick(ROUTE_LINK_KEY, (v) =>
    typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'boolean' ? (v ? 'צמוד' : 'לא צמוד') : null,
  );

  const monthlyPayment = pick(ROUTE_PAY_KEY, (v) => {
    const n = toNumber(v);
    return n !== null && n > 0 && n < 200_000 ? n : null;
  });

  const endDate = pick(ROUTE_END_KEY, (v) =>
    typeof v === 'string' && /\d{2,4}[-/.]\d{1,2}/.test(v) ? v : null,
  );

  return {
    name: name || null,
    balance,
    rate,
    linkage: linkage || null,
    monthly_payment: monthlyPayment,
    end_date: endDate,
    raw: el,
  };
}

/**
 * @param {{url:string, json:any}[]} captures
 * @param {number|null} total
 */
export function routeCandidates(captures, total) {
  const out = [];
  for (const cap of captures) {
    for (const { path, arr } of walkArrays(cap.json)) {
      const { score, bal } = scoreRouteArray(arr, total);
      if (score <= 30) continue;
      out.push({
        score,
        url: cap.url,
        path: path.join('.'),
        count: arr.length,
        sum: bal ? bal.sum : null,
        routes: arr.map((el) => normaliseRoute(el, bal?.key ?? null, bal?.scale ?? 1)),
      });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

/* ══════════════════════════════════════════════════════
   DOM-text fallback
══════════════════════════════════════════════════════ */

const TEXT_BALANCE_LABELS = [
  /יתרה\s*לסילוק/,
  /יתרת\s*(ה)?משכנתא/,
  /יתרה\s*לפירעון/,
  /סה["״']?כ\s*יתרה/,
  /יתרת\s*הלוואה/,
];

/**
 * Last resort: the page rendered the number but never sent it as JSON we saw
 * (server-rendered HTML, or a websocket we did not intercept).
 */
export function extractFromText(text, { anchor = null } = {}) {
  if (!text) return null;
  const flat = text.replace(/[‎‏]/g, '');
  const found = [];

  for (const label of TEXT_BALANCE_LABELS) {
    const re = new RegExp(label.source + '[^\\d\\n]{0,60}([\\d,]+(?:\\.\\d{1,2})?)', 'g');
    let m;
    while ((m = re.exec(flat)) !== null) {
      const n = toNumber(m[1]);
      if (plausibleBalance(n)) found.push({ value: n, score: 40 + scoreAnchor(n, anchor) });
    }
  }

  /* Nothing labelled? Take any number sitting close to the anchor. */
  if (!found.length && anchor) {
    const re = /([\d,]{5,15}(?:\.\d{1,2})?)/g;
    let m;
    while ((m = re.exec(flat)) !== null) {
      const n = toNumber(m[1]);
      if (!plausibleBalance(n)) continue;
      const s = scoreAnchor(n, anchor);
      if (s >= 35) found.push({ value: n, score: s });
    }
  }

  found.sort((a, b) => b.score - a.score);
  return found[0] ?? null;
}

/* ══════════════════════════════════════════════════════
   Known shapes

   The heuristics above exist for when we do not know the bank's response.
   Once we do, guessing is the wrong tool: Mizrahi's /api/mashkanta/profile
   reports several different totals and only one of them is the figure Budgy
   tracks. Scoring picked `sachItraLeSiluk` — a real, well-named field that
   happens to be principal *plus accrued interest*, so the balance appeared to
   rise every month. The principal is the sum of `itratKrnSiluk` over the
   routes, and there is no way to infer that preference from field names.

   The heuristics stay as the fallback for when this shape stops matching.
══════════════════════════════════════════════════════ */

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Mizrahi Tefahot — GET /Online/api/mashkanta/profile
 *
 * One customer can hold several mortgage files (`mashkantaot`), each split
 * into routes (`maslulim`). Routes that are paid off stay in the response
 * with zeroed balances, so they are dropped here.
 */
export function mizrahiProfile(json) {
  if (!json || typeof json !== 'object') return null;
  if (!Array.isArray(json.mashkantaot) || json.sachItraLeSiluk == null) return null;

  const routes = [];
  for (const file of json.mashkantaot) {
    for (const s of file?.maslulim ?? []) {
      const principal = toNumber(s.itratKrnSiluk) ?? 0;
      const payoff = toNumber(s.itraLesiluk) ?? 0;
      if (principal <= 0 && payoff <= 0) continue; // route already repaid

      routes.push({
        name: s.shemMaslul || s.teurSugRbt || null,
        balance: round2(principal),
        rate: toNumber(s.ahuzRbtHiuv) || null,
        linkage: s.teurSugHatzmada || null,
        monthly_payment: toNumber(s.schumEhzerAba) || null,
        end_date: String(s.taarihHiuvAharon ?? '').slice(0, 10) || null,
        file_id: file.id ?? null,
        payoff: round2(payoff),
        fees: round2(toNumber(s.sachAmlot) ?? 0),
        raw: s,
      });
    }
  }
  if (!routes.length) return null;

  return {
    balance: round2(routes.reduce((a, r) => a + r.balance, 0)),
    payoff: toNumber(json.sachItraLeSiluk),
    fees: toNumber(json.sachItraAmlotLeSiluk) ?? 0,
    arrears: toNumber(json.sachItraPigur) ?? 0,
    asOf: String(json.taarihNehonut ?? '').slice(0, 10) || null,
    routes,
  };
}

const KNOWN_SHAPES = [{ id: 'mizrahi.profile', parse: mizrahiProfile }];

function matchKnownShape(captures) {
  for (const cap of captures) {
    for (const shape of KNOWN_SHAPES) {
      let hit = null;
      try {
        hit = shape.parse(cap.json);
      } catch {
        continue; // malformed payload — fall through to the heuristics
      }
      if (hit?.balance > 0) return { ...hit, shape: shape.id, url: cap.url };
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════
   Top-level
══════════════════════════════════════════════════════ */

/**
 * @param {{url:string, json:any}[]} captures
 * @param {{anchor?:number|null, pageText?:string}} opts
 */
export function extractMortgage(captures, { anchor = null, pageText = '' } = {}) {
  /* A recognised payload beats any amount of scoring. */
  const known = matchKnownShape(captures);
  if (known) {
    return {
      balance: known.balance,
      balanceSource: {
        url: known.url,
        path: 'Σ mashkantaot[].maslulim[].itratKrnSiluk',
        key: 'itratKrnSiluk',
        shape: known.shape,
        score: 1000,
        scale: 1,
      },
      routes: known.routes,
      routesSource: { url: known.url, path: 'maslulim', count: known.routes.length, sum: known.balance, shape: known.shape },
      payoff: known.payoff,
      fees: known.fees,
      arrears: known.arrears,
      asOf: known.asOf,
      sumMatches: true,
      confidence: 'high',
      topBalances: [],
      topRoutes: [],
    };
  }

  const balances = balanceCandidates(captures, { anchor });
  let best = balances[0] ?? null;

  let routes = routeCandidates(captures, best?.value ?? anchor);
  let bestRoutes = routes[0] ?? null;

  /* Cross-check: if the routes sum cleanly but disagrees with the balance we
     picked, the sum wins — an exact sum beats a name match every time. */
  if (bestRoutes?.sum && best && Math.abs(bestRoutes.sum - best.value) / best.value > 0.03) {
    const sumScore = scoreAnchor(bestRoutes.sum, anchor);
    if (sumScore > scoreAnchor(best.value, anchor)) {
      best = {
        value: bestRoutes.sum,
        score: bestRoutes.score,
        url: bestRoutes.url,
        path: bestRoutes.path + ' (sum of routes)',
        key: 'sum',
        scale: 1,
      };
      routes = routeCandidates(captures, best.value);
      bestRoutes = routes[0] ?? null;
    }
  }

  /* Still nothing in the JSON — try what the page actually rendered. */
  let fromText = null;
  if (!best) {
    fromText = extractFromText(pageText, { anchor });
    if (fromText) {
      best = { value: fromText.value, score: fromText.score, url: 'dom:text', path: 'page text', key: 'text', scale: 1 };
    }
  }

  const sumMatches =
    !!(bestRoutes?.sum && best && Math.abs(bestRoutes.sum - best.value) / best.value <= 0.03);

  let confidence = 'low';
  if (best) {
    if (sumMatches && best.score >= 60) confidence = 'high';
    else if (best.score >= 80 || (sumMatches && best.score >= 40)) confidence = 'high';
    else if (best.score >= 45) confidence = 'medium';
  }

  return {
    balance: best?.value ?? null,
    balanceSource: best
      ? { url: best.url, path: best.path, key: best.key, score: best.score, scale: best.scale }
      : null,
    routes: bestRoutes?.routes ?? [],
    routesSource: bestRoutes
      ? { url: bestRoutes.url, path: bestRoutes.path, count: bestRoutes.count, sum: bestRoutes.sum, score: bestRoutes.score }
      : null,
    payoff: null,
    fees: null,
    arrears: null,
    asOf: null,
    sumMatches,
    confidence,
    topBalances: balances.slice(0, 5),
    topRoutes: routes.slice(0, 3).map(({ routes: _r, ...meta }) => meta),
  };
}

/* ══════════════════════════════════════════════════════
   Redaction — never persist tokens or credentials
══════════════════════════════════════════════════════ */

const SECRET_KEY = /(token|jwt|bearer|password|passwd|pwd|secret|cookie|authoriz|session|otp|pin|credential|refresh)/i;

/** Deep-copy a payload with anything secret-shaped replaced by "[redacted]". */
export function redact(node, depth = 0) {
  if (node == null || depth > MAX_DEPTH) return node;
  if (Array.isArray(node)) return node.map((v) => redact(v, depth + 1));
  if (typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = SECRET_KEY.test(k) ? '[redacted]' : redact(v, depth + 1);
  }
  return out;
}
