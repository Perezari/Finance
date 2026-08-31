/* Budgy — mortgage bookmarklet (readable source).
 *
 * Runs INSIDE the bank's own page, which is the whole point: a page at
 * perezari.github.io can never read mto.mizrahi-tefahot.co.il, but code the
 * user runs on the bank's tab is same-origin and can call the same endpoint
 * the site itself calls, with the session already attached.
 *
 * It deliberately does no parsing. The raw payload goes to the
 * record-mortgage Edge Function, which parses, stores and pushes — so a field
 * rename at the bank is fixed by redeploying a function, not by reinstalling
 * a bookmark on a phone.
 *
 * This repository is PUBLIC, so the placeholders below are never filled in
 * here. Build the installable one-liner with:
 *
 *     node build-bookmarklet.mjs
 *
 * which injects the values from .env and writes bookmarklet.txt (gitignored).
 * Budgy's settings screen can also render it, fetching the secret over an
 * RLS-protected row so it never ships inside app.js.
 */
(async () => {
  const API = '__API__';
  const SECRET = '__SECRET__';
  const USER = '__USER__';
  const ENDPOINT = '/Online/api/mashkanta/profile';

  const box = document.createElement('div');
  box.style.cssText = [
    'position:fixed', 'left:12px', 'right:12px', 'bottom:16px', 'z-index:2147483647',
    'background:#16181d', 'color:#fff', 'padding:14px 16px', 'border-radius:14px',
    'font:600 15px/1.45 -apple-system,system-ui,sans-serif', 'direction:rtl', 'text-align:right',
    'box-shadow:0 10px 40px rgba(0,0,0,.45)', 'white-space:pre-line',
  ].join(';');
  box.textContent = 'Budgy — קורא את נתוני המשכנתא…';
  document.body.appendChild(box);

  const finish = (text, ok) => {
    box.textContent = text;
    box.style.background = ok ? '#0e9e7e' : '#b3312c';
    box.onclick = () => box.remove();
    setTimeout(() => box.remove(), ok ? 8000 : 20000);
  };

  try {
    if (!/mizrahi-tefahot\.co\.il$/.test(location.hostname)) {
      throw new Error('הרץ את זה מתוך האתר של מזרחי טפחות, אחרי שהתחברת.');
    }

    const res = await fetch(ENDPOINT, {
      credentials: 'include',
      headers: { accept: 'application/json' },
    });
    const ctype = (res.headers.get('content-type') || '').split(';')[0];
    const text = await res.text();

    /* Say exactly what came back. A generic "didn't work" here costs a whole
       month, because the next chance to look is the next statement. */
    if (!res.ok) {
      throw new Error(`הבנק החזיר ${res.status}.\nודא שאתה מחובר, ונסה שוב.`);
    }
    if (!/json/i.test(ctype)) {
      throw new Error(`הבנק החזיר ${ctype || 'תוכן לא מזוהה'} במקום JSON.\nכנראה הופנית למסך התחברות.`);
    }
    let profile;
    try {
      profile = JSON.parse(text);
    } catch {
      throw new Error(`התשובה אינה JSON תקין.\n${text.slice(0, 120)}`);
    }
    if (!profile || !Array.isArray(profile.mashkantaot)) {
      const keys = profile && typeof profile === 'object'
        ? Object.keys(profile).slice(0, 12).join(', ') || '(אובייקט ריק)'
        : typeof profile;
      throw new Error(`התקבל JSON בלי mashkantaot.\nשדות שחזרו: ${keys}`);
    }

    const save = await fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-budgy-secret': SECRET },
      body: JSON.stringify({ action: 'record_profile', user_id: USER, via: 'bookmarklet', profile }),
    });
    const out = await save.json().catch(() => ({}));
    if (!save.ok || out.ok === false) throw new Error(out.error || `שמירה נכשלה (${save.status})`);

    finish(`✓ ${out.push.title}\n${out.push.message}`, true);
  } catch (e) {
    finish(`✗ ${e && e.message ? e.message : e}`, false);
  }
})();
