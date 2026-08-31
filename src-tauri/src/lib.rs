//! Budgy desktop.
//!
//! The web app can never read the bank: a page on github.io cannot touch
//! mto.mizrahi-tefahot.co.il, and that restriction is the whole reason the
//! browser build needs a bookmarklet or a local helper.
//!
//! A desktop shell removes it. We open the bank in our own webview and attach
//! an initialization script to that window, so our code runs *inside* the
//! bank's page — same origin, session already attached. The user still signs
//! in by hand; nothing here touches a password or an OTP.
//!
//! The injected script talks to Supabase directly and reports the outcome to a
//! one-shot loopback listener. Deliberately no Tauri IPC is granted to the
//! bank's window: if that page were ever compromised it must not be able to
//! reach a single app command.

use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::Duration;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Emitter, Listener, Manager, WebviewUrl, WebviewWindowBuilder};

const BANK_WINDOW: &str = "bank";
/// Straight to the sign-in form. The bank's marketing host redirects to
/// www., which costs a click; the session then lands on mto., and the reader
/// uses a relative endpoint so it follows along on its own.
const DEFAULT_BANK_URL: &str = "https://sc.mizrahi-tefahot.co.il/TFHLogin/index.html#/login";

/* ── settings ─────────────────────────────────────── */

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Settings {
    supabase_url: String,
    user_id: String,
    /// Shared secret for the record-mortgage Edge Function. Local only —
    /// this file never leaves the machine and is not in the repo.
    secret: String,
    bank_url: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            supabase_url: String::new(),
            user_id: String::new(),
            secret: String::new(),
            bank_url: DEFAULT_BANK_URL.to_string(),
        }
    }
}

/// What the frontend is allowed to see: everything except the secret.
#[derive(Serialize)]
struct SettingsStatus {
    configured: bool,
    supabase_url: String,
    user_id: String,
    bank_url: String,
}

fn config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("app_config_dir: {e}"))?;
    fs::create_dir_all(&dir).map_err(|e| format!("create config dir: {e}"))?;
    Ok(dir.join("config.json"))
}

/// Parse the KEY=VALUE lines we care about out of scraper/.env.
fn parse_env_file(path: &PathBuf) -> Option<Settings> {
    let text = fs::read_to_string(path).ok()?;
    let mut s = Settings::default();
    for line in text.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let Some((k, v)) = line.split_once('=') else { continue };
        let v = v.trim().trim_matches('"').to_string();
        match k.trim() {
            "SUPABASE_URL" => s.supabase_url = v,
            "BUDGY_USER_ID" => s.user_id = v,
            "BOOKMARKLET_SECRET" => s.secret = v,
            "BANK_START_URL" => s.bank_url = v,
            _ => {}
        }
    }
    if s.supabase_url.is_empty() || s.user_id.is_empty() || s.secret.is_empty() {
        return None;
    }
    if s.bank_url.is_empty() {
        s.bank_url = DEFAULT_BANK_URL.to_string();
    }
    Some(s)
}

/// Saved config wins; otherwise fall back to the scraper's .env, which is
/// already filled in on this machine — one less thing to set up twice.
fn load_settings(app: &AppHandle) -> Settings {
    if let Ok(p) = config_path(app) {
        if let Ok(text) = fs::read_to_string(&p) {
            if let Ok(s) = serde_json::from_str::<Settings>(&text) {
                if !s.secret.is_empty() {
                    return s;
                }
            }
        }
    }

    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("scraper/.env"));
        candidates.push(cwd.join("../scraper/.env"));
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("scraper/.env"));
        }
    }
    for c in candidates {
        if let Some(s) = parse_env_file(&c) {
            return s;
        }
    }
    Settings::default()
}

#[tauri::command]
fn settings_status(app: AppHandle) -> SettingsStatus {
    let s = load_settings(&app);
    SettingsStatus {
        configured: !s.secret.is_empty() && !s.user_id.is_empty() && !s.supabase_url.is_empty(),
        supabase_url: s.supabase_url,
        user_id: s.user_id,
        bank_url: s.bank_url,
    }
}

#[tauri::command]
fn save_settings(
    app: AppHandle,
    supabase_url: String,
    user_id: String,
    secret: String,
    bank_url: Option<String>,
) -> Result<(), String> {
    let s = Settings {
        supabase_url: supabase_url.trim().trim_end_matches('/').to_string(),
        user_id: user_id.trim().to_string(),
        secret: secret.trim().to_string(),
        bank_url: bank_url
            .filter(|b| !b.trim().is_empty())
            .unwrap_or_else(|| DEFAULT_BANK_URL.to_string()),
    };
    let path = config_path(&app)?;
    fs::write(
        &path,
        serde_json::to_string_pretty(&s).map_err(|e| e.to_string())?,
    )
    .map_err(|e| format!("write config: {e}"))
}

/* ── talking to the page ──────────────────────────────
   Both scripts report back with Tauri's event IPC rather than an HTTP call to
   a loopback port. On Windows that rides WebView2's native postMessage
   bridge, so it keeps working on sites whose CSP forbids the page from
   reaching anything off-origin — which an HTTP sink does not survive. The
   bank window is granted exactly one permission for this, core:event:allow-emit.
   Anything arriving on these channels is untrusted input from a bank's page.
══════════════════════════════════════════════════════ */

/// Reads the mortgage profile out of the page's own traffic and forwards it.
fn injection_script(api: &str, secret: &str, user_id: &str) -> String {
    let template = r####"
(function () {
  if (window.__budgyImport) return;
  window.__budgyImport = true;

  var API = "__API__", SECRET = "__SECRET__", USER = "__USER__";
  var ENDPOINT = "/Online/api/mashkanta/profile";
  var done = false;

  function box() {
    var el = document.getElementById("__budgy_box");
    if (!el && document.body) {
      el = document.createElement("div");
      el.id = "__budgy_box";
      el.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:2147483647;" +
        "background:#16181d;color:#fff;padding:13px 16px;border-radius:14px;direction:rtl;text-align:right;" +
        "font:600 15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45);white-space:pre-line";
      document.body.appendChild(el);
    }
    return el;
  }
  function say(t, ok) {
    var el = box(); if (!el) return;
    el.textContent = t;
    if (ok === true) el.style.background = "#0e9e7e";
    if (ok === false) el.style.background = "#b3312c";
  }
  function report(payload) {
    try { window.__TAURI__.event.emit("budgy://result", payload); } catch (e) {}
  }

  function submit(profile) {
    if (done) return;
    done = true;
    say("Budgy — שומר…");
    fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json", "x-budgy-secret": SECRET },
      body: JSON.stringify({ action: "record_profile", user_id: USER, via: "desktop", profile: profile })
    }).then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || j.ok === false) throw new Error((j && j.error) || "השמירה נכשלה");
        say("\u2713 " + j.push.title + "\n" + j.push.message, true);
        report({ ok: true, result: j });
      })
      .catch(function (e) {
        done = false;
        say("\u2717 " + (e.message || e), false);
        report({ ok: false, error: String(e.message || e) });
      });
  }

  function consider(text) {
    if (done || typeof text !== "string" || text.indexOf("mashkantaot") === -1) return;
    var p; try { p = JSON.parse(text); } catch (e) { return; }
    if (p && Array.isArray(p.mashkantaot) && p.mashkantaot.length) submit(p);
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    var out = _fetch.apply(this, arguments);
    try { out.then(function (r) { try { r.clone().text().then(consider, function () {}); } catch (e) {} }, function () {}); } catch (e) {}
    return out;
  };
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    try { this.addEventListener("load", function () { try { consider(this.responseText); } catch (e) {} }); } catch (e) {}
    return _send.apply(this, arguments);
  };

  var tries = 0;
  var timer = setInterval(function () {
    if (done) { clearInterval(timer); return; }
    tries++;
    fetch(ENDPOINT, { credentials: "include", headers: { accept: "application/json" } })
      .then(function (r) {
        var ct = r.headers.get("content-type") || "";
        return (!r.ok || !/json/i.test(ct)) ? null : r.text();
      })
      .then(function (t) {
        if (t) consider(t);
        if (!done) say("Budgy — ממתין לנתוני המשכנתא…\nהתחבר ופתח את מסך המשכנתאות (" + tries + ")");
      })
      .catch(function () {});
    if (tries > 200) clearInterval(timer);
  }, 3000);
})();
"####;

    template
        .replace("__API__", api)
        .replace("__SECRET__", secret)
        .replace("__USER__", user_id)
}

/// Bank Hapoalim: reads the current-account balance and the securities
/// portfolio, then posts both to record-accounts.
///
/// The endpoints came from israeli-bank-scrapers and were confirmed against a
/// real captured session. All three calls are same-origin from the logged-in
/// page, which is what keeps them working under the site's own CSP — an
/// approach that re-issuing them from anywhere else would not survive.
fn hapoalim_script() -> String {
    let template = r####"
(function () {
  /* Top frame only. The bank's app runs several iframes and the script fired
     in each of them — duplicate readers, and fetches from a frame that gets
     detached reject outright. */
  if (window.top !== window.self) return;
  if (window.__budgyPoalim) return;
  window.__budgyPoalim = true;

  /* No API url and no secret here on purpose — the app relays, so a page we
     do not control never holds a credential. */
  /* Captured at document-start, before the bank's app can replace it. */
  var nativeFetch = window.fetch.bind(window);
  var found = {}, details = {}, done = false, tries = 0, lastErr = "ממתין", firstSeen = 0;

  /* The sign-in flow walks through landing-page and then homepage, so the
     reader runs in more than one document and each had its own `done` — the
     result was two submissions of the same balance. sessionStorage is shared
     across documents of the same tab, so the guard has to live there. */
  function alreadySubmitted() {
    try { return sessionStorage.getItem("__budgySubmitted") === "1"; } catch (e) { return false; }
  }
  function markSubmitted() {
    try { sessionStorage.setItem("__budgySubmitted", "1"); } catch (e) {}
  }

  function box() {
    var el = document.getElementById("__budgy_box");
    if (!el && document.body) {
      el = document.createElement("div");
      el.id = "__budgy_box";
      el.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:2147483647;" +
        "background:#16181d;color:#fff;padding:13px 16px;border-radius:14px;direction:rtl;text-align:right;" +
        "font:600 15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45);white-space:pre-line";
      document.body.appendChild(el);
    }
    return el;
  }
  function say(t, ok) {
    var el = box(); if (!el) return;
    el.textContent = t;
    if (ok === true) el.style.background = "#0e9e7e";
    if (ok === false) el.style.background = "#b3312c";
  }
  function report(p) { try { window.__TAURI__.event.emit("budgy://result", p); } catch (e) {} }

  /* ── read the page's own traffic ──────────────────────────────────────
     The bank's app has to fetch these to render the home page, and watching
     it sidesteps every question about which host serves the API, which
     headers it wants, and whether the page may call out at all. */
  function consider(url, text) {
    if (done || typeof text !== "string" || !text) return;
    var j; try { j = JSON.parse(text); } catch (e) { return; }
    if (!j) return;

    if (/balanceAndCreditLimit/.test(url) && typeof j.currentBalance === "number") {
      found.current = j.currentBalance;
      details.current = {
        balance: j.currentBalance, withdrawal: j.withdrawalBalance,
        creditLimit: j.creditLimitAmount, creditUsed: j.creditLimitUtilizationAmount,
        creditUsedPercent: j.creditLimitUtilizationPercent
      };
    }

    var tiles = j.homePageTiltes;
    if (Array.isArray(tiles)) {
      for (var i = 0; i < tiles.length; i++) {
        var t = tiles[i];
        if (t && t.source === "capitalMarket" && typeof t.balance === "number") {
          found.securities = t.balance;
          details.securities = {
            total: t.balance,
            israeli: t.data && t.data.israeliSecurityiesPortfolioTotalValue,
            foreign: t.data && t.data.previousDayForeignSecuritiesTotalValue
          };
        }
      }
    }

    if (/cards\/transactions-totals/.test(url)) {
      var amounts = j.account && j.account.accountBookedBalances &&
                    j.account.accountBookedBalances.currencyAmount;
      details.cards = {
        total: amounts && amounts[0] ? amounts[0].amount : null,
        byDebitDate: (j.totalCurrencyDebitDate || []).map(function (d) {
          return { amount: d.currentAmount, date: String(d.debitDate || ""), currency: d.currencyDescription };
        })
      };
    }

    if (found.current != null && !firstSeen) firstSeen = Date.now();
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    var url = (arguments[0] && arguments[0].url) || String(arguments[0] || "");
    var out = _fetch.apply(this, arguments);
    try {
      out.then(function (r) { try { r.clone().text().then(function (t) { consider(url, t); }, function () {}); } catch (e) {} },
               function () {});
    } catch (e) {}
    return out;
  };

  var _open = XMLHttpRequest.prototype.open, _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = String(u || ""); return _open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function () {
    var self = this;
    try {
      this.addEventListener("load", function () {
        try { consider(self.__u || location.href, self.responseText); } catch (e) {}
      });
    } catch (e) {}
    return _send.apply(this, arguments);
  };

  /* ── and ask directly too, when the page allows it ─────────────────── */
  function get(u) {
    return nativeFetch(u, { credentials: "include", headers: { accept: "application/json" } })
      .then(function (r) { return r.text().then(function (t) { return { status: r.status, text: t }; }); })
      .catch(function (e) { return { status: 0, text: "", err: String(e && e.message || e) }; });
  }

  async function probe() {
    var ctx = String((window.bnhpApp && window.bnhpApp.restContext) || "/ServerServices").replace(/^\//, "");
    var accRes = await get("/" + ctx + "/general/accounts");
    if (accRes.status !== 200) {
      lastErr = "חשבונות: HTTP " + accRes.status + (accRes.err ? " (" + accRes.err + ")" : "");
      return;
    }
    var accounts; try { accounts = JSON.parse(accRes.text); } catch (e) { return; }
    if (!Array.isArray(accounts) || !accounts.length) { lastErr = "חשבונות: ריק"; return; }
    var a = accounts[0];
    var id = a.bankNumber + "-" + a.branchNumber + "-" + a.accountNumber;
    details.accountId = id;
    lastErr = "קורא יתרות";

    var b = await get("/" + ctx + "/current-account/composite/balanceAndCreditLimit?accountId=" + id + "&view=details&lang=he");
    consider("balanceAndCreditLimit", b.text);
    var h = await get("/" + ctx + "/general/home-page/composite/myAccount?accountId=" + id + "&lang=he");
    consider("myAccount", h.text);
    var c = await get("/" + ctx + "/cards/transactions-totals?accountId=" + id + "&transactionsType=current&lang=he");
    consider("cards/transactions-totals", c.text);
  }

  /* Wait for the securities tile before sending. Submitting the moment the
     current-account balance arrived is why the trading card never updated:
     myAccount had not come back yet. After the grace period, send what we
     have rather than losing the run. */
  var GRACE_MS = 20000;
  function readyToSubmit() {
    if (done || alreadySubmitted() || found.current == null) return false;
    if (found.securities != null) return true;
    return firstSeen > 0 && Date.now() - firstSeen > GRACE_MS;
  }

  function submitNow() {
    if (done || alreadySubmitted()) return;
    done = true;
    markSubmitted();
    var out = [{ kind: "current", label: "עובר ושב", balance: found.current }];
    if (found.securities != null) out.push({ kind: "securities", label: "ניירות ערך", balance: found.securities });

    /* Hand off to the app. Posting to Supabase from here fails: the bank's
       CSP blocks connect-src, which is what "Failed to fetch" was. */
    say("Budgy — שומר…");
    try {
      window.__TAURI__.event.emit("budgy://accounts", {
        institution_id: "hapoalim", accounts: out, details: details
      });
      say("\u2713 נשלח לשמירה");
    } catch (e) {
      done = false;
      say("\u2717 " + (e.message || e), false);
    }
  }

  var timer = setInterval(function () {
    if (done) { clearInterval(timer); return; }
    tries++;
    probe().then(function () {
      if (done) return;
      if (readyToSubmit()) { submitNow(); return; }
      var have = (found.current != null ? "עו\"ש \u2713 " : "") +
                 (found.securities != null ? "ני\"ע \u2713" : "");
      say("Budgy — ממתין לנתונים…\n" + (have || lastErr) + "\nניסיון " + tries);
      report({ progress: true, error: have || lastErr, tries: tries });
    });
    if (tries > 200) { clearInterval(timer); done = true;
      say("\u2717 לא הצלחנו לקרוא את החשבונות\n" + lastErr, false);
      report({ ok: false, error: lastErr }); }
  }, 3000);
})();
"####;

    template.to_string()
}

/// Meitav Dash — provident and pension balances.
///
/// /v2/api/AmitLobby/getAllAmitAccounts carries every account the member
/// holds. KupaType is the stable identifier for the product (2 = study fund,
/// 5 = pension), so the mapping survives a renamed account.
///
/// Only the financial fields are forwarded. The payload also carries an ID
/// number, phone, email, home address and the agent's details, and none of
/// that belongs in a balance snapshot.
fn meitav_script() -> String {
    r####"
(function () {
  if (window.top !== window.self) return;
  if (window.__budgyMeitav) return;
  window.__budgyMeitav = true;

  var NL = String.fromCharCode(10);
  var nativeFetch = window.fetch.bind(window);
  var payload = null, done = false, tries = 0, lastErr = "ממתין להתחברות";

  function alreadySubmitted() {
    try { return sessionStorage.getItem("__budgySubmitted") === "1"; } catch (e) { return false; }
  }
  function markSubmitted() {
    try { sessionStorage.setItem("__budgySubmitted", "1"); } catch (e) {}
  }

  function box() {
    var el = document.getElementById("__budgy_box");
    if (!el && document.body) {
      el = document.createElement("div");
      el.id = "__budgy_box";
      el.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:2147483647;" +
        "background:#16181d;color:#fff;padding:13px 16px;border-radius:14px;direction:rtl;text-align:right;" +
        "font:600 15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45);white-space:pre-line";
      document.body.appendChild(el);
    }
    return el;
  }
  function say(t, ok) {
    var el = box(); if (!el) return;
    el.textContent = t;
    if (ok === true) el.style.background = "#0e9e7e";
    if (ok === false) el.style.background = "#b3312c";
  }

  function kindOf(kupaType) {
    if (kupaType === 2) return "study";
    if (kupaType === 5) return "pension";
    return "kupa" + kupaType;
  }

  /* Pull out the numbers and nothing else. */
  function consider(text) {
    if (done || typeof text !== "string" || text.indexOf("AmitAccounts") === -1) return;
    var j; try { j = JSON.parse(text); } catch (e) { return; }
    var lobby = j && j.lobbyData;
    var list = lobby && lobby.AmitAccounts;
    if (!Array.isArray(list) || !list.length) return;

    var accounts = [], details = { accounts: [], deposits: [] };
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (typeof a.YitrotAccountSum !== "number") continue;
      var kind = kindOf(a.KupaType);
      var name = a.KupaTypeNameHebrew || kind;
      accounts.push({ kind: kind, label: name, balance: a.YitrotAccountSum });
      details.accounts.push({
        kind: kind, name: name, value: a.YitrotAccountSum,
        number: a.AccountNumForShow || null,
        asOf: (a.RevaluationDate || "").slice(0, 10) || null
      });
    }
    if (!accounts.length) return;

    var tx = lobby.DayliTransactions || [];
    for (var k = 0; k < tx.length; k++) {
      var t = tx[k];
      if (typeof t.HafkadotSum !== "number") continue;
      details.deposits.push({
        fund: t.KupaName || null,
        date: (t.ErehDate || "").slice(0, 10) || null,
        employee: t.HafkadotOved, employer: t.HafkadotEmployer,
        severance: t.HafkadotPitzuim, total: t.HafkadotSum
      });
    }
    var loans = lobby.lobbyLoanData || j.lobbyLoanData;
    if (loans && typeof loans.TotalLoansAmount === "number") {
      details.loans = loans.TotalLoansAmount;
    }

    payload = { institution_id: "meitav", accounts: accounts, details: details };
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    var out = _fetch.apply(this, arguments);
    try { out.then(function (r) { try { r.clone().text().then(consider, function () {}); } catch (e) {} }, function () {}); } catch (e) {}
    return out;
  };
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    try { this.addEventListener("load", function () { try { consider(this.responseText); } catch (e) {} }); } catch (e) {}
    return _send.apply(this, arguments);
  };

  function probe() {
    return nativeFetch("/v2/api/AmitLobby/getAllAmitAccounts", {
      credentials: "include", headers: { accept: "application/json" }
    }).then(function (r) {
      if (r.status !== 200) { lastErr = "חשבונות: HTTP " + r.status; return; }
      return r.text().then(consider);
    }).catch(function (e) { lastErr = "חשבונות: " + (e && e.message || e); });
  }

  function submitNow() {
    if (done || alreadySubmitted() || !payload) return;
    done = true;
    markSubmitted();
    say("Budgy — שומר…");
    try {
      window.__TAURI__.event.emit("budgy://accounts", payload);
      say("\u2713 נשלח לשמירה");
    } catch (e) {
      done = false;
      say("\u2717 " + (e.message || e), false);
    }
  }

  var timer = setInterval(function () {
    if (done) { clearInterval(timer); return; }
    tries++;
    probe().then(function () {
      if (done) return;
      if (payload) { submitNow(); return; }
      say("Budgy — ממתין לנתונים…" + NL + lastErr + NL + "ניסיון " + tries);
      try { window.__TAURI__.event.emit("budgy://result", { progress: true, error: lastErr, tries: tries }); } catch (e) {}
    });
    if (tries > 200) {
      clearInterval(timer); done = true;
      say("\u2717 לא הצלחנו לקרוא את החשבונות" + NL + lastErr, false);
      try { window.__TAURI__.event.emit("budgy://result", { ok: false, error: lastErr }); } catch (e) {}
    }
  }, 3000);
})();
"####
    .to_string()
}

/// Records every JSON response the page receives, so an adapter for a new
/// bank can be written from real payloads instead of guesswork.
fn capture_script() -> String {
    r####"
(function () {
  if (window.__budgyCapture) return;
  window.__budgyCapture = true;

  var SKIP = /(login|logon|signin|sign-in|auth|oauth|token|otp|sms|captcha|password|identify|kyc)/i;
  var seen = {}, count = 0, sent = 0, failed = 0, lastText = "";

  function box() {
    var el = document.getElementById("__budgy_box");
    if (!el && document.body) {
      el = document.createElement("div");
      el.id = "__budgy_box";
      el.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:2147483647;" +
        "background:#3b2f00;color:#ffd479;padding:13px 16px;border-radius:14px;direction:rtl;text-align:right;" +
        "font:600 15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45);white-space:pre-line";
      document.body.appendChild(el);
    }
    return el;
  }
  function status() {
    var el = box(); if (!el) return;
    el.textContent = "Budgy — מצב גילוי\n" + count + " נקלטו · " + sent + " נשמרו" +
      (failed ? " · " + failed + " נכשלו" : "") + "\nעבור בין המסכים, ואז סגור את החלון.";
  }

  function keep(url, text) {
    if (!text || typeof text !== "string" || text.length > 2000000) return;
    if (SKIP.test(url)) return;
    var t = text.replace(/^\s+/, "");
    if (t[0] !== "{" && t[0] !== "[") return;
    var key = url.split("?")[0] + ":" + text.length;
    if (seen[key]) return;
    seen[key] = 1;
    count++;
    try {
      window.__TAURI__.event.emit("budgy://capture", { url: url, body: text });
      sent++;
    } catch (e) {
      failed++;
    }
    status();
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    var url = (arguments[0] && arguments[0].url) || String(arguments[0] || "");
    var out = _fetch.apply(this, arguments);
    try { out.then(function (r) { try { r.clone().text().then(function (t) { keep(url, t); }, function () {}); } catch (e) {} }, function () {}); } catch (e) {}
    return out;
  };

  var _open = XMLHttpRequest.prototype.open, _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__budgyUrl = String(u || ""); return _open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function () {
    var self = this;
    try { this.addEventListener("load", function () { try { keep(self.__budgyUrl || location.href, self.responseText); } catch (e) {} }); } catch (e) {}
    return _send.apply(this, arguments);
  };

  /* Not every site has an API to listen to. A server-rendered page carries the
     numbers in its markup, so record the rendered DOM as well — text to find
     the figures, markup to find a selector that will still be there tomorrow. */
  function snapshotDom() {
    if (!document.body) return;
    /* Same rule as the network capture: nothing from a sign-in screen. */
    if (SKIP.test(location.href)) return;
    var text = document.body.innerText || "";
    if (text.length < 200) return;
    /* Re-send only when the page actually changed. */
    var fingerprint = text.length + ":" + text.slice(0, 200);
    if (fingerprint === lastText) return;
    lastText = fingerprint;

    var payload = JSON.stringify({
      kind: "dom",
      url: location.href,
      title: document.title,
      text: text.slice(0, 300000),
      html: document.body.innerHTML.slice(0, 600000)
    });
    count++;
    try {
      window.__TAURI__.event.emit("budgy://capture", { url: location.href + "#dom", body: payload });
      sent++;
    } catch (e) { failed++; }
    status();
  }

  setInterval(snapshotDom, 3000);
  window.addEventListener("load", function () { setTimeout(snapshotDom, 1500); });

  /* The IPC channel only exists for hosts listed in the bank capability. A
     missing one produced an empty dump with no hint why — say it out loud. */
  if (!(window.__TAURI__ && window.__TAURI__.event)) {
    var el = box();
    if (el) {
      el.style.background = "#b3312c";
      el.style.color = "#fff";
      var NL = String.fromCharCode(10);
      el.textContent = "Budgy — הדומיין הזה לא מורשה" + NL + location.hostname + NL +
        "צריך להוסיף אותו ל-capabilities/bank.json ולבנות מחדש.";
    }
    return;
  }

  status();
})();
"####
    .to_string()
}

/* ── import ───────────────────────────────────────── */

/// The discovery session in progress. One mutex over all of it: events arrive
/// concurrently, and deriving the next index by counting files raced — two
/// payloads landed on the same number and one overwrote the other.
#[derive(Default)]
struct CaptureSession {
    dir: Option<PathBuf>,
    n: usize,
    index: Vec<Value>,
}

#[derive(Default)]
struct CaptureDir(Mutex<CaptureSession>);

/// POSTs a payload to one of our Edge Functions and returns its JSON.
/// Runs on the caller's thread — always call it from a spawned one.
fn post_json(url: &str, secret: &str, body: Value) -> Result<Value, String> {
    let res = ureq::post(url)
        .set("content-type", "application/json")
        .set("x-budgy-secret", secret)
        .send_json(body);
    match res {
        Ok(r) => r.into_json::<Value>().map_err(|e| format!("bad json: {e}")),
        // A 409 carries a real explanation in its body; surface that, not "409".
        Err(ureq::Error::Status(code, r)) => {
            let v = r.into_json::<Value>().unwrap_or(Value::Null);
            let msg = v.get("error").and_then(|e| e.as_str()).unwrap_or("").to_string();
            Err(if msg.is_empty() { format!("HTTP {code}") } else { msg })
        }
        Err(e) => Err(format!("network: {e}")),
    }
}

/// Appends one line to import.log next to the app's config. The bank window
/// cannot be inspected after the fact, and the useful part of a failed import
/// is exactly what happened after sign-in — so it gets written down.
fn log_line(app: &AppHandle, text: impl AsRef<str>) {
    let Ok(dir) = app.path().app_config_dir() else { return };
    let _ = fs::create_dir_all(&dir);
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let line = format!("{secs} {}\n", text.as_ref());
    use std::io::Write;
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(dir.join("import.log")) {
        let _ = f.write_all(line.as_bytes());
    }
}

#[derive(Clone, Serialize)]
struct ImportEvent {
    state: &'static str,
    message: String,
    result: Option<Value>,
}

fn emit(app: &AppHandle, state: &'static str, message: impl Into<String>, result: Option<Value>) {
    let _ = app.emit(
        "budgy://import",
        ImportEvent { state, message: message.into(), result },
    );
}

/// Wire the two channels the bank window reports on. Registered once at
/// startup; the payloads are untrusted, so every field is optional here.
fn wire_page_channels(app: &AppHandle) {
    let a = app.clone();
    app.listen_any("budgy://result", move |ev| {
        log_line(&a, format!("result {}", ev.payload().chars().take(400).collect::<String>()));
        let parsed: Value = serde_json::from_str(ev.payload()).unwrap_or(Value::Null);

        /* A progress ping, not a verdict. Without this every "still waiting"
           read as a failure and closed the window mid-login. */
        if parsed.get("progress").and_then(|v| v.as_bool()) == Some(true) {
            let msg = parsed.get("error").and_then(|e| e.as_str()).unwrap_or("").to_string();
            let tries = parsed.get("tries").and_then(|t| t.as_i64()).unwrap_or(0);
            emit(&a, "running", format!("{msg} · ניסיון {tries}"), None);
            return;
        }

        if parsed.get("ok").and_then(|v| v.as_bool()) == Some(true) {
            let result = parsed.get("result").cloned();
            let title = result
                .as_ref()
                .and_then(|r| r.get("push"))
                .and_then(|p| p.get("title"))
                .and_then(|t| t.as_str())
                .unwrap_or("הנתונים עודכנו")
                .to_string();
            emit(&a, "done", title, result);
        } else {
            let err = parsed
                .get("error")
                .and_then(|e| e.as_str())
                .unwrap_or("הייבוא נכשל")
                .to_string();
            emit(&a, "error", err, None);
        }
    });

    /* The page reports what it found; the request to Supabase is made here.
       Untrusted input: only the shape we expect is forwarded. */
    let a = app.clone();
    app.listen_any("budgy://accounts", move |ev| {
        log_line(&a, format!("accounts {}", ev.payload().chars().take(300).collect::<String>()));
        let parsed: Value = serde_json::from_str(ev.payload()).unwrap_or(Value::Null);
        let app2 = a.clone();
        std::thread::spawn(move || {
            let s = load_settings(&app2);
            let url = format!("{}/functions/v1/record-accounts", s.supabase_url);
            let body = serde_json::json!({
                "action": "record",
                "user_id": s.user_id,
                "institution_id": parsed.get("institution_id").and_then(|v| v.as_str()).unwrap_or(""),
                "accounts": parsed.get("accounts").cloned().unwrap_or(Value::Null),
                "details": parsed.get("details").cloned().unwrap_or(Value::Null),
            });
            match post_json(&url, &s.secret, body) {
                Ok(v) => {
                    let changes = v.get("changes").and_then(|c| c.as_array()).cloned().unwrap_or_default();
                    let summary = changes
                        .iter()
                        .filter_map(|c| {
                            let l = c.get("label")?.as_str()?;
                            let n = c.get("now")?.as_f64()?;
                            Some(format!("{l}: {} ₪", (n.round() as i64)))
                        })
                        .collect::<Vec<_>>()
                        .join(" · ");
                    let msg = if summary.is_empty() { "אין שינוי".to_string() } else { summary };
                    log_line(&app2, format!("relay ok {msg}"));
                    emit(&app2, "done", msg.clone(), Some(serde_json::json!({
                        "push": { "title": "הנתונים מהבנק עודכנו", "message": msg }
                    })));
                }
                Err(e) => {
                    log_line(&app2, format!("relay err {e}"));
                    emit(&app2, "error", e, None);
                }
            }
        });
    });

    let a = app.clone();
    app.listen_any("budgy://capture", move |ev| {
        let parsed: Value = serde_json::from_str(ev.payload()).unwrap_or(Value::Null);
        let url = parsed.get("url").and_then(|u| u.as_str()).unwrap_or("").to_string();
        let body = parsed.get("body").and_then(|b| b.as_str()).unwrap_or("");
        if body.is_empty() {
            return;
        }

        let state = a.state::<CaptureDir>();
        let Ok(mut session) = state.0.lock() else { return };
        let Some(dir) = session.dir.clone() else { return };

        let safe: String = url
            .replace("https://", "")
            .replace("http://", "")
            .chars()
            .map(|c| if c.is_ascii_alphanumeric() || c == '.' || c == '-' { c } else { '_' })
            .collect();
        let name = format!("{:03}-{}.json", session.n, &safe[..safe.len().min(90)]);
        if fs::write(dir.join(&name), body).is_ok() {
            session.n += 1;
            session.index.push(serde_json::json!({ "file": name, "url": url }));
            let _ = fs::write(
                dir.join("_index.json"),
                serde_json::to_string_pretty(&session.index).unwrap_or_default(),
            );
            let n = session.n;
            drop(session);
            emit(&a, "running", format!("{n} תגובות נשמרו"), None);
        }
    });
}

async fn open_bank_window(app: &AppHandle, url: tauri::Url, title: &str, script: String) -> Result<(), String> {
    log_line(app, format!("open {url}"));
    if let Some(w) = app.get_webview_window(BANK_WINDOW) {
        let _ = w.set_focus();
        return Err("חלון בנק כבר פתוח".into());
    }
    let nav_app = app.clone();
    let win = WebviewWindowBuilder::new(app, BANK_WINDOW, WebviewUrl::External(url.clone()))
        .title(title)
        .inner_size(1180.0, 900.0)
        .center()
        .initialization_script(&script)
        .on_navigation(move |u| {
            log_line(&nav_app, format!("nav {u}"));
            true
        })
        .build()
        .map_err(|e| format!("bank window: {e}"))?;

    // The window can come up on about:blank when the URL is only given at
    // build time; navigating explicitly makes the load deterministic.
    if let Err(e) = win.navigate(url) {
        eprintln!("[budgy] navigate failed: {e}");
    }
    Ok(())
}

/// Async on purpose. A synchronous command runs on the main thread, and
/// building a window from there deadlocks: `build()` waits on the event loop
/// that is busy running this very command. The window appears with its title
/// but never navigates, no error is returned, and the caller's promise never
/// settles. Async commands run off the main thread, so the dispatch completes.
#[tauri::command]
async fn import_from_bank(app: AppHandle) -> Result<(), String> {
    let s = load_settings(&app);
    if s.secret.is_empty() || s.user_id.is_empty() || s.supabase_url.is_empty() {
        return Err("חסרות הגדרות — פתח את ההגדרות והזן אותן".into());
    }
    let url: tauri::Url = s.bank_url.parse().map_err(|e| format!("bank url: {e}"))?;
    let api = format!("{}/functions/v1/record-mortgage", s.supabase_url);
    let script = injection_script(&api, &s.secret, &s.user_id);

    open_bank_window(&app, url, "התחבר לבנק — Budgy ייקח את הנתונים", script).await?;
    emit(&app, "running", "נפתח חלון הבנק — התחבר ולך למסך המשכנתא", None);
    Ok(())
}

#[tauri::command]
async fn discover_from_bank(app: AppHandle, url: String) -> Result<String, String> {
    let url: tauri::Url = url.trim().parse().map_err(|e| format!("url: {e}"))?;

    let stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("app_config_dir: {e}"))?
        .join("discovery")
        .join(stamp.to_string());
    fs::create_dir_all(&dir).map_err(|e| format!("create dump dir: {e}"))?;
    {
        let state = app.state::<CaptureDir>();
        let mut session = state.0.lock().map_err(|_| "capture state poisoned")?;
        *session = CaptureSession { dir: Some(dir.clone()), n: 0, index: Vec::new() };
    }

    open_bank_window(&app, url, "מצב גילוי — Budgy מקליט את המסכים", capture_script()).await?;
    emit(&app, "running", "נפתח חלון — התחבר ועבור בין המסכים", None);
    Ok(dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn import_accounts_from_bank(
    app: AppHandle,
    url: String,
    institution: Option<String>,
) -> Result<(), String> {
    let s = load_settings(&app);
    if s.secret.is_empty() || s.user_id.is_empty() || s.supabase_url.is_empty() {
        return Err("חסרות הגדרות — פתח את ההגדרות והזן אותן".into());
    }
    let url: tauri::Url = url.trim().parse().map_err(|e| format!("url: {e}"))?;

    /* One reader per institution. Adding a bank is a new arm plus its script —
       nothing else in this file changes. */
    let inst = institution.unwrap_or_else(|| "hapoalim".to_string());
    let script = match inst.as_str() {
        "hapoalim" => hapoalim_script(),
        "meitav" => meitav_script(),
        other => return Err(format!("אין עדיין קורא ל-{other}")),
    };

    open_bank_window(&app, url, "התחבר לבנק — Budgy ייקח את היתרות", script).await?;
    emit(&app, "running", "נפתח חלון הבנק — התחבר", None);
    Ok(())
}

/// Path of the import trace, so the UI can point at it when something fails.
#[tauri::command]
fn import_log_path(app: AppHandle) -> String {
    app.path()
        .app_config_dir()
        .map(|d| d.join("import.log").to_string_lossy().to_string())
        .unwrap_or_default()
}

#[tauri::command]
fn close_bank_window(app: AppHandle) {
    if let Some(w) = app.get_webview_window(BANK_WINDOW) {
        let _ = w.close();
    }
}

/* ── entry point ──────────────────────────────────── */

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // A second launch just focuses the window we already have.
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.show();
                let _ = w.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .manage(CaptureDir::default())
        .setup(|app| {
            wire_page_channels(app.handle());
            // The window starts hidden so the app never flashes an unstyled
            // frame; the frontend shows it once the theme is applied. Safety
            // net: if that never happens (a JS error on load), show it anyway
            // rather than leaving the user with a process and no window.
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(Duration::from_secs(5));
                let _ = handle.clone().run_on_main_thread(move || {
                    if let Some(w) = handle.get_webview_window("main") {
                        if !w.is_visible().unwrap_or(true) {
                            let _ = w.show();
                        }
                    }
                });
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            settings_status,
            save_settings,
            import_from_bank,
            discover_from_bank,
            import_accounts_from_bank,
            import_log_path,
            close_bank_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running Budgy");
}
