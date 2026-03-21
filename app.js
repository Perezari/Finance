/* ── SUPABASE ──────────────────────────────────────── */
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── ISRAELI INSTITUTIONS ──────────────────────────── */
const INSTITUTIONS = [
  /* Banks */
  { id:'hapoalim',   name:'בנק הפועלים',       domain:'bankhapoalim.co.il',  type:'bank' },
  { id:'leumi',      name:'בנק לאומי',          domain:'https://www.leumi.co.il/he',         type:'bank' },
  { id:'discount',   name:'בנק דיסקונט',        domain:'https://www.discountbank.co.il/',      type:'bank' },
  { id:'mizrahi',    name:'מזרחי-טפחות',        domain:'https://www.mizrahi-tefahot.co.il/',type:'bank'},
  { id:'fibi',       name:'הבינלאומי',          domain:'https://www.fibi.co.il/private/',          type:'bank' },
  { id:'igud',       name:'בנק יהב',            domain:'bank-yahav.co.il',    type:'bank' },
  { id:'otzar',      name:'אוצר החייל',         domain:'https://www.bankotsar.co.il/private/',     type:'bank' },
  /* Insurance / Pension */
  { id:'migdal',     name:'מגדל',               domain:'migdal.co.il',        type:'pension' },
  { id:'harel',      name:'הראל',               domain:'harel.co.il',         type:'pension' },
  { id:'menora',     name:'מנורה מבטחים',       domain:'https://www.menoramivt.co.il/',        type:'pension' },
  { id:'phoenix',    name:'הפניקס',             domain:'fnx.co.il',           type:'pension' },
  { id:'clal',       name:'כלל ביטוח',          domain:'https://www.clalbit.co.il/',       type:'pension' },
  { id:'ayalon',     name:'איילון',             domain:'https://www.ayalon-ins.co.il/',        type:'pension' },
  /* Investment / Savings */
  { id:'meitav',     name:'מיטב',               domain:'meitav.co.il',        type:'invest' },
  { id:'psagot',     name:'פסגות',              domain:'psagot.co.il',        type:'invest' },
  { id:'altshuler',  name:'אלטשולר שחם',        domain:'https://www.as-invest.co.il',type:'invest'},
  { id:'moreinfo',   name:'מור',                domain:'mor.co.il',           type:'invest' },
  { id:'analyst',    name:'אנליסט',             domain:'https://www.analyst.co.il/',       type:'invest' },
  { id:'ibi',        name:'IBI',                domain:'ibi.co.il',           type:'invest' },
  { id:'iek',        name:'ילין לפידות',        domain:'https://www.yl-invest.co.il/',         type:'invest' },
  { id:'interactive',        name:'אינטראקטיב ישראל',        domain:'https://www.inter-il.com/client-portal/',         type:'invest' },
  /* Savings funds */
  { id:'worker',     name:'קרן הגמל לעובד',     domain:'hishtalmut.co.il',    type:'savings'},
];


/* ── SVG ICON LIBRARY ───────────────────────────────── */
const ICONS_JS = {
  edit:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  save:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  plus:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  bank:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  home:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  calendar:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  note:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  alert:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  target:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  x:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  eye:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  noInst:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  clock:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  trending:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  piggy:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8.4-3.9 1.1C14.1 5.4 13 5 12 5c-3.9 0-7 3.1-7 7s3.1 7 7 7c1 0 2-.2 2.8-.6l.2.1c.9.4 3 1.5 3 1.5v-3c1.2-1.2 2-2.9 2-4.7 0-.7-.1-1.4-.3-2.1.8-.7 1.3-1.8 1.3-3.3z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`,
  breakdown: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  diamond:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="2"/><polyline points="2 8.5 12 15 22 8.5"/></svg>`,
  barChart:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`,
  mail:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  check:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ><polyline points="20 6 9 17 4 12"/></svg>`,
};


/* ── CATEGORY SVG ICONS (keyed by category key) ────── */
const CAT_SVG = {
  cash:        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  currentAcc:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  deposit:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`,
  savingsFund: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  pensionFund: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  _default:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
};
function getCatSvg(cat) {
  return CAT_SVG[cat.key] || CAT_SVG._default;
}

function logoUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/* ── STATE ─────────────────────────────────────────── */
let currentUser   = null;
let categories    = [];
let records       = [];
let blurActive    = false;
let mainChart     = null;
let retChart      = null;
let yvyChart      = null;
let editMode      = false;
let instTargetCatId = null;
let instTargetMode   = 'cat';
let selectedMortgageInst = null;
let wizardStep    = 0;
let wizardData    = {}; // holds values across steps

/* ── INIT ──────────────────────────────────────────── */
async function init() {
  initDarkMode();

  // Recovery is handled in handleRecoveryIfNeeded() called at DOMContentLoaded
  showLoader('מאמת...');
  populateInstitutionSelect();
  let appLoaded = false;
  try {
    const { data: { session } } = await db.auth.getSession();
    if (session?.user) { currentUser = session.user; appLoaded = true; await loadApp(); }
    else showScreen('auth');
  } catch(e) { console.error(e); showScreen('auth'); }

  db.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY' && session) {
      currentUser = session.user; appLoaded = false;
      hideLoader();
      document.getElementById('loader').style.display      = 'none';
      document.getElementById('app-screen').style.display  = 'none';
      document.getElementById('auth-screen').style.display = 'flex';
      showPasswordResetModal();
      return;
    }
    if (event === 'SIGNED_IN' && session && !appLoaded) {
      currentUser = session.user; appLoaded = true; await loadApp();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null; appLoaded = false; records = []; categories = [];
      // Show friendly explanation instead of silent redirect
      showScreen('auth');
    }
  });
  hideLoader();
}

async function loadApp() {
  showLoader('טוען נתונים...');
  await Promise.all([loadCategories(), loadRecords()]);
  loadRetirementSettings();
  // Sync mortgage institution from Supabase to localStorage
  const cloudMortInst = currentUser?.user_metadata?.mortgage_inst;
  if (cloudMortInst) localStorage.setItem('mortgage_inst_v1', cloudMortInst);
  renderCurrentReport();
  updateUserUI();
  syncDarkModeFromCloud();
  checkAutoBackup();
  // Fix stale _share_invite row if owner name wasn't stored correctly
  const isOwner = !!(currentUser.user_metadata?.partner_email);
  if (isOwner) {
    const ownerName = currentUser.user_metadata?.full_name || currentUser.email;
    db.from('categories').update({ label: ownerName, icon: currentUser.email })
      .eq('user_id', currentUser.id).eq('key', '_share_invite');
  }
  showScreen('app');
  hideLoader();
  checkOnboarding();
}

/* ══════════════════════════════════════════════════════
   DISPLAY NAME — additions_app.js
   See INTEGRATION_GUIDE.md for placement
══════════════════════════════════════════════════════ */

/* ── 1. REPLACE updateUserUI() ───────────────────────── */
function updateUserUI() {
  if (!currentUser) return;
  const email       = currentUser.email || '';
  const metaName    = currentUser.user_metadata?.full_name || '';
  const displayName = metaName || email;

  ['user-email-display','user-email-display2'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = email;
  });

  // Show display name in sidebar
  const nameEl = document.getElementById('user-display-name');
  if (nameEl) nameEl.textContent = displayName;

  const av = document.getElementById('user-avatar-char');
  if (av) av.textContent = (displayName[0] || '?').toUpperCase();

  // Always prefill from Supabase metadata (overwrite any stale value)
  const input = document.getElementById('settings-display-name');
  if (input) input.value = metaName;
}

/* ── 2. NEW FUNCTION — save display name ─────────────── */
async function saveDisplayName() {
  const input = document.getElementById('settings-display-name');
  const name  = input?.value.trim();
  if (!name) return showToast('⚠️ יש להזין שם');

  showLoader('שומר שם...');
  const { data, error } = await db.auth.updateUser({
    data: { full_name: name }
  });
  hideLoader();

  if (error) return showToast('❌ שגיאה: ' + error.message);

  // Update currentUser from the fresh response so UI reflects immediately
  if (data?.user) currentUser = data.user;
  localStorage.removeItem('display_name_v1'); // clean up old cache if exists
  updateUserUI();
  showToast('✅ שם עודכן');
}



/* ── PARTNER BANNER ──────────────────────────────────── */
async function renderPartnerBanner() {
  const banner = document.getElementById('partner-banner');
  if (!banner || !currentUser) return;
  const accepted = !!(currentUser.user_metadata?.accepted_share_from);
  if (!accepted) { banner.style.display = 'none'; return; }

  // Try metadata first (set during acceptShare), fallback to invite row
  let display = currentUser.user_metadata?.partner_owner_name
             || currentUser.user_metadata?.partner_owner_email
             || '';

  if (!display) {
    const { data: rows } = await db.from('categories')
      .select('label,icon').eq('key', '_share_invite').neq('user_id', currentUser.id).limit(1);
    if (rows?.[0]) {
      display = rows[0].label !== '_share_invite' ? rows[0].label : rows[0].icon || '';
      // Cache it for next time
      if (display) {
        await db.auth.updateUser({ data: {
          partner_owner_name:  rows[0].label,
          partner_owner_email: rows[0].icon
        }});
        const res = await db.auth.getUser(); currentUser = res.data.user;
      }
    }
  }

  if (display) {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>צופה בתיק של <strong>${display}</strong></span>
      </div>`;
    banner.style.display = 'flex';
  } else {
    banner.style.display = 'none';
  }
}


function showPasswordResetModal() {
  const m = document.getElementById('pwd-reset-modal');
  m.style.display = 'flex';
}

function closePasswordResetModal() {
  document.getElementById('pwd-reset-modal').style.display = 'none';
}

async function confirmPasswordReset() {
  const newPwd     = document.getElementById('reset-pwd-new').value;
  const confirmPwd = document.getElementById('reset-pwd-confirm').value;

  if (!newPwd || newPwd.length < 6) return showToast('סיסמה חייבת להכיל לפחות 6 תווים');
  if (newPwd !== confirmPwd)        return showToast('הסיסמאות אינן תואמות');

  showLoader('מעדכן סיסמה...');
  const { error } = await db.auth.updateUser({ password: newPwd });
  hideLoader();

  if (error) return showToast('שגיאה: ' + error.message);

  closePasswordResetModal();
  document.getElementById('auth-screen').style.display = 'none';
  showToast('הסיסמה עודכנה בהצלחה');
  if (currentUser) { await loadApp(); }
}

/* ── CHANGE PASSWORD ─────────────────────────────────── */
function getAuthProvider() {
  // Check how the current user authenticated
  const identities = currentUser?.identities || [];
  if (identities.some(i => i.provider === 'google')) return 'google';
  if (identities.length === 0) return 'magic_link';
  // email provider = has password
  if (identities.some(i => i.provider === 'email')) return 'email';
  return 'magic_link';
}

function renderPasswordSection() {
  const section = document.getElementById('pwd-section');
  if (!section || !currentUser) return; // guard: modal not yet in DOM
  const provider = getAuthProvider();

  if (provider === 'email') {
    // Has password — show change form
    section.innerHTML = `
      <div class="pwd-form">
        <input type="password" id="pwd-new"     placeholder="סיסמה חדשה (לפחות 6 תווים)" class="form-input" style="direction:ltr;text-align:right"/>
        <input type="password" id="pwd-confirm" placeholder="אישור סיסמה" class="form-input" style="direction:ltr;text-align:right"/>
        <button class="pwd-save-btn" onclick="changePassword()">${ICONS_JS.save} עדכן סיסמה</button>
      </div>`;
  } else {
    // OAuth / Magic link — offer reset email
    const providerLabel = provider === 'google' ? 'Google' : 'קישור אימייל';
    section.innerHTML = `
      <p class="settings-hint" style="margin-bottom:10px">החשבון שלך מחובר עם ${providerLabel}. לשינוי סיסמה שלח קישור איפוס לאימייל.</p>
      <button class="pwd-save-btn" onclick="sendPasswordReset()">${ICONS_JS.mail} שלח קישור איפוס סיסמה</button>`;
  }
}

async function sendPasswordReset() {
  const email = currentUser?.email;
  if (!email) return showToast('לא נמצאה כתובת אימייל');
  showLoader('שולח...');
  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  hideLoader();
  if (error) return showToast('שגיאה: ' + error.message);
  showToast('קישור איפוס נשלח לאימייל');
}

async function changePassword() {
  const newPwd     = document.getElementById('pwd-new')?.value;
  const confirmPwd = document.getElementById('pwd-confirm')?.value;
  if (!newPwd || newPwd.length < 6) return showToast('סיסמה חייבת להכיל לפחות 6 תווים');
  if (newPwd !== confirmPwd)        return showToast('הסיסמאות אינן תואמות');
  showLoader('מעדכן סיסמה...');
  const { error } = await db.auth.updateUser({ password: newPwd });
  hideLoader();
  if (error) return showToast('שגיאה: ' + error.message);
  document.getElementById('pwd-new').value     = '';
  document.getElementById('pwd-confirm').value = '';
  showToast('הסיסמה עודכנה בהצלחה');
}

/* ── AUTH ──────────────────────────────────────────── */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-password').value;
  if (!email || !pw) return showAuthMsg('יש למלא אימייל וסיסמה', false);
  showLoader('נכנס...');
  const { error } = await db.auth.signInWithPassword({ email, password: pw });
  hideLoader();
  if (error) showAuthMsg(translateError(error.message), false);
}

async function handleGoogleLogin() {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://perezari.github.io/Finance'
    }
  });
  if (error) showAuthMessage(error.message, 'error');
}

window.handleGoogleLogin = handleGoogleLogin;

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pw    = document.getElementById('reg-password').value;
  if (!email || !pw) return showAuthMsg('יש למלא אימייל וסיסמה', false);
  if (pw.length < 6) return showAuthMsg('סיסמה חייבת להכיל לפחות 6 תווים', false);
  showLoader('יוצר חשבון...');
  const { data, error } = await db.auth.signUp({ email, password: pw, options: { data: { full_name: name } } });
  hideLoader();
  if (error) return showAuthMsg(translateError(error.message), false);
  if (data?.user) await createDefaultCategories(data.user.id);
  showAuthMsg('✅ נשלח אימייל אישור!', true);
}

async function handleMagicLink() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) return showAuthMsg('הכנס אימייל קודם', false);
  showLoader('שולח...');
  const { error } = await db.auth.signInWithOtp({ email });
  hideLoader();
  if (error) return showAuthMsg(translateError(error.message), false);
  showAuthMsg('✅ קישור נשלח לאימייל!', true);
}

async function handleLogout() {
  closeSettings();
  localStorage.removeItem('display_name_v1');
  await db.auth.signOut();
}

function translateError(msg) {
  return ({'Invalid login credentials':'אימייל או סיסמה שגויים',
           'Email not confirmed':'יש לאשר את האימייל קודם',
           'User already registered':'משתמש כבר קיים – נסה להיכנס'})[msg] || msg;
}

function switchAuthTab(tab) {
  document.getElementById('login-form').style.display    = tab==='login'    ? 'flex':'none';
  document.getElementById('register-form').style.display = tab==='register' ? 'flex':'none';
  document.querySelectorAll('.auth-tab-ul').forEach((b,i) =>
    b.classList.toggle('active',(i===0&&tab==='login')||(i===1&&tab==='register')));
  hideAuthMsg();
}

/* ── CATEGORIES ────────────────────────────────────── */
const DEFAULT_CATEGORIES = [
  { key:'cash',        label:'מזומן',         icon:'💵', order_index:0, institution_id:null },
  { key:'currentAcc',  label:'עו"ש',          icon:'🏦', order_index:1, institution_id:null },
  { key:'deposit',     label:'פיקדון/חסכון',  icon:'🏛️', order_index:2, institution_id:null },
  { key:'savingsFund', label:'קרן השתלמות',   icon:'📈', order_index:3, institution_id:null },
  { key:'pensionFund', label:'פנסיה',         icon:'🧓', order_index:4, institution_id:null },
];

async function createDefaultCategories(userId) {
  await db.from('categories').insert(DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: userId })));
}

async function loadCategories() {
  const { data: all } = await db.from('categories').select('*').order('order_index');
  const allCats = all || [];

  const own     = allCats.filter(c => c.user_id === currentUser.id && c.key !== '_share_invite');
  const partner = allCats.filter(c => c.user_id !== currentUser.id && c.key !== '_share_invite');

  const isOwner   = !!(currentUser.user_metadata?.partner_email);
  const accepted  = !!(currentUser.user_metadata?.accepted_share_from);

  if (isOwner) {
    if (own.length) { categories = own; return; }
  } else if (accepted) {
    if (partner.length) {
      categories = partner; return;
    } else {
      // Owner removed sharing — clear our acceptance
      await db.auth.updateUser({ data: { accepted_share_from: null } });
      const res = await db.auth.getUser(); currentUser = res.data.user;
    }
  }

  if (own.length) { categories = own; return; }

  await createDefaultCategories(currentUser.id);
  const { data: fresh } = await db.from('categories').select('*').eq('user_id', currentUser.id).order('order_index');
  categories = fresh || [];
}

function getInstitution(id) { return INSTITUTIONS.find(i => i.id === id) || null; }

function populateInstitutionSelect() {
  const sel = document.getElementById('new-cat-institution'); if (!sel) return;
  const groups = { bank:'בנקים', pension:'פנסיה וביטוח', invest:'השקעות', savings:'חסכון' };
  let html = '<option value="">גוף מנהל (אופציונלי)</option>';
  Object.entries(groups).forEach(([type, label]) => {
    const items = INSTITUTIONS.filter(i => i.type === type);
    html += `<optgroup label="${label}">`;
    items.forEach(i => { html += `<option value="${i.id}">${i.name}</option>`; });
    html += '</optgroup>';
  });
  sel.innerHTML = html;
}

async function addCategory() {
  const key         = document.getElementById('new-cat-key').value.trim();
  const label       = document.getElementById('new-cat-label').value.trim();
  const instId      = document.getElementById('new-cat-institution').value || null;
  if (!key || !label)                      return alert('נא למלא מזהה ושם');
  if (!/^[a-zA-Z0-9_]+$/.test(key))       return alert('מזהה – אנגלית בלבד');
  if (categories.find(c => c.key === key)) return alert('מזהה זה כבר קיים');
  showLoader('מוסיף...');
  await db.from('categories').insert({ user_id:currentUser.id, key, label, icon:'_svg', order_index:categories.length, institution_id:instId });
  await loadCategories(); hideLoader();
  renderCategoriesList(); renderDynamicFields();
  showToast('✅ קטגוריה נוספה');
  ['new-cat-key','new-cat-label'].forEach(id => document.getElementById(id).value='');
  document.getElementById('new-cat-institution').value = '';
}

async function deleteCategory(id) {
  if (!confirm('למחוק קטגוריה זו?')) return;
  showLoader('מוחק...');
  await db.from('categories').delete().eq('id',id).eq('user_id',currentUser.id);
  await loadCategories(); hideLoader();
  renderCategoriesList(); renderDynamicFields();
  showToast('🗑️ נמחקה');
}

async function setInstitution(catId, instId) {
  await db.from('categories').update({ institution_id: instId||null }).eq('id',catId).eq('user_id',currentUser.id);
  await loadCategories();
  renderCategoriesList();
  renderCurrentReport();
  showToast('✅ גוף מנהל עודכן');
}

/* ── INSTITUTION MODAL ─────────────────────────────── */
function openInstModal(catId) {
  instTargetMode   = 'cat';
  instTargetCatId  = catId;
  renderInstGrid(INSTITUTIONS);
  document.getElementById('inst-modal').style.display = 'flex';
  document.getElementById('inst-search').value = '';
}

function openMortgageInstModal() {
  instTargetMode  = 'mortgage';
  instTargetCatId = null;
  renderInstGrid(INSTITUTIONS.filter(i => i.type === 'bank'));
  document.getElementById('inst-modal').style.display = 'flex';
  document.getElementById('inst-search').value = '';
}

function closeInstModal() {
  document.getElementById('inst-modal').style.display = 'none';
  instTargetCatId = null;
}

function closeInstModalOutside(e) { if (e.target.id==='inst-modal') closeInstModal(); }

function filterInstitutions() {
  const q = document.getElementById('inst-search').value.trim().toLowerCase();
  renderInstGrid(q ? INSTITUTIONS.filter(i => i.name.includes(q) || i.id.includes(q)) : INSTITUTIONS);
}

function renderInstGrid(list) {
  document.getElementById('inst-grid').innerHTML = `
    <div class="inst-none-btn" onclick="pickInstitution(null)">
      ${ICONS_JS.noInst}
      <span>ללא גוף מנהל</span>
    </div>
    ${list.map(i => `
    <div class="inst-tile" onclick="pickInstitution('${i.id}')">
      <img src="${logoUrl(i.domain)}" alt="${i.name}" class="inst-logo"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="inst-logo-fallback" style="display:none">${i.name[0]}</div>
      <span class="inst-name">${i.name}</span>
    </div>`).join('')}`;
}

async function pickInstitution(instId) {
  if (instTargetMode === 'mortgage' || instTargetMode === 'mortgage_settings') {
    closeInstModal();
    if (instId) {
      localStorage.setItem('mortgage_inst_v1', instId);
    } else {
      localStorage.removeItem('mortgage_inst_v1');
    }
    // Sync to Supabase
    if (currentUser) {
      await db.auth.updateUser({ data: { mortgage_inst: instId || null } });
    }
    renderMortgageInstSettings();
    renderCurrentReport();
    showToast('גוף מנהל משכנתא עודכן');
    return;
  }
  if (!instTargetCatId) return;
  const catId = instTargetCatId;
  closeInstModal();
  await setInstitution(catId, instId);
}

function renderMortgageInstButton() {
  const btn = document.getElementById('mortgage-inst-btn');
  if (!btn) return;
  const inst = selectedMortgageInst ? getInstitution(selectedMortgageInst) : null;
  if (inst) {
    btn.innerHTML = `<img src="${logoUrl(inst.domain)}" width="18" height="18" style="border-radius:4px;object-fit:contain" onerror="this.style.display='none'"/> ${inst.name}`;
    btn.style.color = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
  } else {
    btn.innerHTML = `${ICONS_JS.bank} בחר גוף מנהל`;
    btn.style.color = '';
    btn.style.borderColor = '';
  }
}

/* ── RECORDS ────────────────────────────────────────── */
async function loadRecords() {
  const { data: all } = await db.from('monthly_records').select('*').order('record_date',{ascending:true});
  const allRecs = all || [];

  const own     = allRecs.filter(r => r.user_id === currentUser.id);
  const partner = allRecs.filter(r => r.user_id !== currentUser.id);

  const isOwner  = !!(currentUser.user_metadata?.partner_email);
  const accepted = !!(currentUser.user_metadata?.accepted_share_from);

  if (isOwner) {
    records = own; return;
  }
  if (accepted) {
    // Verify invite row still exists (owner hasn't removed sharing)
    const { data: inviteRows } = await db.from('categories')
      .select('user_id').eq('key', '_share_invite').neq('user_id', currentUser.id).limit(1);
    const inviteStillActive = !!(inviteRows && inviteRows.length > 0);
    if (inviteStillActive && partner.length) {
      records = partner; return;
    } else if (!inviteStillActive) {
      // Owner removed sharing — clear our acceptance
      await db.auth.updateUser({ data: { accepted_share_from: null, declined_share: null } });
      const res = await db.auth.getUser(); currentUser = res.data.user;
    }
  }
  records = own;
}

function openAddForm(record) {
  if (record) {
    // Edit mode — use original form
    openEditForm(record);
  } else {
    // New entry — open wizard
    openWizard();
  }
}

/* ══ WIZARD ══════════════════════════════════════════ */
function openWizard() {
  editMode  = false;
  wizardData = {};
  const last = records.length ? records[records.length - 1] : null;
  const today = new Date();
  wizardData.date = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-10`;
  if (last) {
    wizardData.mortgage = last.mortgage_balance || 0;
    wizardData.values   = { ...(last.values || {}) };
  } else {
    wizardData.mortgage = 0;
    wizardData.values   = {};
  }
  wizardData.notes  = '';
  wizardData.editId = null;
  wizardStep = 0;
  renderWizard();
  document.getElementById('wizard-modal').style.display = 'flex';
  const titleEl = document.getElementById('wz-title');
  if (titleEl) titleEl.textContent = editMode ? 'עריכת חודש' : 'הוספת חודש חדש';
}

function openWizardEdit(record) {
  editMode  = true;
  wizardData = {
    editId:   record.id,
    date:     record.record_date,
    mortgage: record.mortgage_balance || 0,
    values:   { ...(record.values || {}) },
    notes:    record.notes || ''
  };
  wizardStep = 0;
  renderWizard();
  document.getElementById('wizard-modal').style.display = 'flex';
  const titleEl = document.getElementById('wz-title');
  if (titleEl) titleEl.textContent = 'עריכת חודש';
}

function closeWizard() {
  document.getElementById('wizard-modal').style.display = 'none';
}

function wizardSteps() {
  // Step 0: date
  // Steps 1..N: one per category
  // Step N+1: mortgage (if any mortgage data exists or last had mortgage)
  // Step N+2: notes + confirm
  const catSteps = categories.map((cat, i) => ({ type: 'cat', cat, index: i }));
  const hasMortgage = !!(wizardData.mortgage || localStorage.getItem('mortgage_inst_v1'));
  const steps = [
    { type: 'date' },
    ...catSteps,
    ...(hasMortgage ? [{ type: 'mortgage' }] : []),
    { type: 'summary' }
  ];
  return steps;
}

function renderWizard() {
  const steps   = wizardSteps();
  const total   = steps.length;
  const step    = steps[wizardStep];
  const isFirst = wizardStep === 0;
  const isLast  = wizardStep === total - 1;

  // Progress bar
  const pct = Math.round((wizardStep / (total - 1)) * 100);

  let bodyHtml = '';

  if (step.type === 'date') {
    bodyHtml = `
      <div class="wz-step-icon">📅</div>
      <div class="wz-step-title">באיזה חודש אנחנו?</div>
      <div class="wz-step-sub">בחר את תאריך הדיווח</div>
      <input type="date" id="wz-date" class="form-input wz-input" value="${wizardData.date}" style="direction:ltr;text-align:center;font-size:1.1rem;margin-top:8px"/>`;
  }
  else if (step.type === 'cat') {
    const cat  = step.cat;
    const inst = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const val  = wizardData.values?.[cat.key] || '';
    const logoHtml = inst
      ? `<img src="${logoUrl(inst.domain)}" alt="${inst.name}" style="width:40px;height:40px;border-radius:10px;object-fit:contain;margin-bottom:4px" onerror="this.style.display='none'"/>`
      : `<div style="color:var(--ink-3);margin-bottom:4px">${getCatSvg({...cat, key:cat.key})}</div>`;
    const instHtml = inst
      ? `<div style="font-size:.82rem;color:var(--green);margin-bottom:16px;font-family:var(--font)">${inst.name}</div>`
      : `<div style="font-size:.82rem;color:var(--ink-3);margin-bottom:16px;font-family:var(--font)">ללא גוף מנהל</div>`;
    bodyHtml = `
      <div class="wz-step-icon">${logoHtml}</div>
      <div class="wz-step-title">${cat.label}</div>
      ${instHtml}
      <div class="wz-amount-wrap">
        <span class="wz-currency">₪</span>
        <input type="number" id="wz-cat-val" class="form-input wz-amount-input"
          value="${val}" placeholder="0" inputmode="numeric"/>
      </div>
      <div class="wz-prev-hint" id="wz-prev-hint"></div>`;
  }
  else if (step.type === 'mortgage') {
    const mortInstId = localStorage.getItem('mortgage_inst_v1');
    const mortInst   = mortInstId ? getInstitution(mortInstId) : null;
    const logoHtml   = mortInst
      ? `<img src="${logoUrl(mortInst.domain)}" alt="${mortInst.name}" style="width:40px;height:40px;border-radius:10px;object-fit:contain;margin-bottom:4px" onerror="this.style.display='none'"/>`
      : `<div style="font-size:2rem;margin-bottom:4px">🏠</div>`;
    const instHtml = mortInst
      ? `<div style="font-size:.82rem;color:var(--green);margin-bottom:16px;font-family:var(--font)">${mortInst.name}</div>`
      : `<div style="font-size:.82rem;color:var(--ink-3);margin-bottom:16px;font-family:var(--font)">ללא גוף מנהל</div>`;
    bodyHtml = `
      <div class="wz-step-icon">${logoHtml}</div>
      <div class="wz-step-title">יתרת משכנתא</div>
      ${instHtml}
      <div class="wz-amount-wrap">
        <span class="wz-currency">₪</span>
        <input type="number" id="wz-mortgage-val" class="form-input wz-amount-input"
          value="${wizardData.mortgage || ''}" placeholder="0" inputmode="numeric"/>
      </div>`;
  }
  else if (step.type === 'summary') {
    const dateLabel = wizardData.date
      ? new Date(wizardData.date).toLocaleDateString('he-IL',{year:'numeric',month:'long'})
      : '';
    const rows = categories.map(cat => {
      const v   = wizardData.values?.[cat.key] || 0;
      const inst = cat.institution_id ? getInstitution(cat.institution_id) : null;
      return `<div class="wz-summary-row">
        <span style="color:var(--ink-3)">${cat.label}${inst?` · <span style="color:var(--green);font-size:.75rem">${inst.name}</span>`:''}</span>
        <span style="font-family:var(--mono);font-weight:600">${fmt(v)}</span>
      </div>`;
    }).join('');
    const mortRow = wizardData.mortgage > 0 ? `
      <div class="wz-summary-row">
        <span style="color:var(--ink-3)">יתרת משכנתא</span>
        <span style="font-family:var(--mono);font-weight:600;color:var(--red)">${fmt(wizardData.mortgage)}</span>
      </div>` : '';
    const saveSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;
    bodyHtml = `
      <div class="wz-step-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
      <div class="wz-step-title">סיכום — ${dateLabel}</div>
      <div class="wz-summary-list">${rows}${mortRow}</div>
      <textarea id="wz-notes" class="form-input" placeholder="הערה קצרה (אופציונלי)" rows="2"
        style="margin-top:12px;resize:none;direction:rtl;text-align:right;width:100%">${wizardData.notes||''}</textarea>`;
    // Update save button label with SVG
    setTimeout(() => {
      const btn = document.getElementById('wz-next-btn');
      if (btn) btn.innerHTML = `${saveSvg} שמור`;
    }, 0);
  }

  document.getElementById('wizard-body').innerHTML = `
    <div class="wz-progress-wrap">
      <div class="wz-progress-bar" style="width:${pct}%"></div>
    </div>
    <div class="wz-step-counter">${wizardStep + 1} / ${total}</div>
    <div class="wz-content">${bodyHtml}</div>`;

  // Show prev hint for category steps
  if (step.type === 'cat') {
    const last = records.length ? records[records.length - 1] : null;
    const prevVal = last ? (last.values?.[step.cat.key] || 0) : null;
    const hint = document.getElementById('wz-prev-hint');
    if (hint && prevVal !== null) {
      hint.innerHTML = `<span style="font-family:var(--font);font-size:.82rem;color:var(--ink-3)">חודש שעבר: </span><span style="font-family:var(--mono);font-size:.82rem;color:var(--ink-3)">${fmt(prevVal)}</span>`;
    }
    // Auto-focus — immediate focus keeps keyboard open on mobile
    const catInput = document.getElementById('wz-cat-val');
    if (catInput) { catInput.focus(); catInput.select(); }
  }
  if (step.type === 'mortgage') {
    const mortInput = document.getElementById('wz-mortgage-val');
    if (mortInput) { mortInput.focus(); mortInput.select(); }
  }

  // Button labels
  document.getElementById('wz-prev-btn').style.visibility = isFirst ? 'hidden' : 'visible';
  document.getElementById('wz-next-btn').textContent = isLast ? '💾 שמור' : 'הבא ←';
}

function wizardSaveStep() {
  const steps = wizardSteps();
  const step  = steps[wizardStep];
  if (step.type === 'date') {
    const v = document.getElementById('wz-date')?.value;
    if (!v) return showToast('יש לבחור תאריך');
    wizardData.date = v;
  } else if (step.type === 'cat') {
    const v = parseFloat(document.getElementById('wz-cat-val')?.value || 0) || 0;
    wizardData.values = wizardData.values || {};
    wizardData.values[step.cat.key] = v;
  } else if (step.type === 'mortgage') {
    wizardData.mortgage = parseFloat(document.getElementById('wz-mortgage-val')?.value || 0) || 0;
  } else if (step.type === 'summary') {
    wizardData.notes = document.getElementById('wz-notes')?.value.trim() || '';
  }
}

function wizardNext() {
  // Save current input value before transition
  const activeInput = document.activeElement;
  wizardSaveStep();
  const steps = wizardSteps();
  // Check for duplicate date when moving past the date step
  if (steps[wizardStep]?.type === 'date' && !wizardData.editId) {
    const exists = records.find(r => r.record_date === wizardData.date);
    if (exists) {
      showToast('⚠️ חודש זה כבר קיים — בחר אותו מהרשימה כדי לערוך');
      return;
    }
  }
  if (wizardStep < steps.length - 1) {
    wizardStep++;
    renderWizard();
  } else {
    // Blur before submit so keyboard closes cleanly
    if (activeInput) activeInput.blur();
    wizardSubmit();
  }
}

function wizardPrev() {
  wizardSaveStep();
  if (wizardStep > 0) { wizardStep--; renderWizard(); }
}

async function wizardSubmit() {
  const { date, mortgage, values, notes, editId } = wizardData;
  if (!date) return showToast('יש לבחור תאריך');
  const mortInstSaved = localStorage.getItem('mortgage_inst_v1');
  if (mortInstSaved) values._mortgage_inst = mortInstSaved;
  showLoader(editId ? 'מעדכן...' : 'שומר...');
  let error;
  if (editId) {
    ({ error } = await db.from('monthly_records')
      .update({ record_date: date, values, mortgage_balance: mortgage || 0, notes })
      .eq('id', editId).eq('user_id', currentUser.id));
  } else {
    ({ error } = await db.from('monthly_records').upsert(
      { user_id: currentUser.id, record_date: date, values, mortgage_balance: mortgage || 0, notes },
      { onConflict: 'user_id,record_date' }
    ));
  }
  hideLoader();
  if (error) return showToast('שגיאה: ' + error.message);
  closeWizard();
  await loadRecords();
  renderCurrentReport();
  document.getElementById('history-detail').style.display = 'none';
  document.getElementById('dateSelect').value = '';
  if (document.getElementById('tab-history').style.display !== 'none') renderHistoryTab();
  showToast(editId ? '✅ עודכן!' : '✅ נשמר!');
}

function openEditForm(record) {
  editMode = true;
  const form      = document.getElementById('add-form');
  const title     = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const editId    = document.getElementById('edit-record-id');
  renderDynamicFields();
  form.style.display = 'block';
  title.innerHTML       = `${ICONS_JS.edit} עריכת חודש`;
  submitBtn.innerHTML   = `${ICONS_JS.save} עדכן`;
  editId.value          = record.id;
  document.getElementById('new-date').value     = record.record_date;
  document.getElementById('new-mortgage').value = record.mortgage_balance || '';
  document.getElementById('new-notes').value    = record.notes || '';
  const vals = record.values || {};
  categories.forEach(cat => { const el=document.getElementById(`field_${cat.key}`); if(el) el.value=vals[cat.key]||''; });
  setTimeout(()=>form.scrollIntoView({behavior:'smooth',block:'start'}),100);
}

async function submitRecord() {
  const date = document.getElementById('new-date').value;
  if (!date) return alert('יש לבחור תאריך');
  const values = {};
  categories.forEach(cat => { const el=document.getElementById(`field_${cat.key}`); values[cat.key]=parseFloat(el?.value||0)||0; });
  const mortInstSaved = localStorage.getItem('mortgage_inst_v1');
  if (mortInstSaved) values._mortgage_inst = mortInstSaved;
  const mortgage = parseFloat(document.getElementById('new-mortgage').value||0)||0;
  const notes    = document.getElementById('new-notes').value.trim();
  const editId   = document.getElementById('edit-record-id').value;
  showLoader(editMode?'מעדכן...':'שומר...');
  let error;
  if (editMode && editId) {
    ({error} = await db.from('monthly_records').update({record_date:date,values,mortgage_balance:mortgage,notes}).eq('id',editId).eq('user_id',currentUser.id));
  } else {
    ({error} = await db.from('monthly_records').upsert({user_id:currentUser.id,record_date:date,values,mortgage_balance:mortgage,notes},{onConflict:'user_id,record_date'}));
  }
  hideLoader();
  if (error) { alert('שגיאה: '+error.message); return; }
  await loadRecords();
  renderCurrentReport();
  ['new-date','new-mortgage','new-notes'].forEach(id=>document.getElementById(id).value='');
  categories.forEach(cat=>{ const el=document.getElementById(`field_${cat.key}`); if(el) el.value=''; });
  document.getElementById('add-form').style.display='none';
  document.getElementById('history-detail').style.display='none';
  document.getElementById('dateSelect').value='';
  editMode=false;
  if (document.getElementById('tab-history').style.display!=='none') renderHistoryTab();
  showToast(editMode?'✅ עודכן!':'✅ נשמר!');
}

async function deleteRecord(id) {
  if (!confirm('למחוק את החודש הזה?')) return;
  showLoader('מוחק...');
  await db.from('monthly_records').delete().eq('id',id).eq('user_id',currentUser.id);
  await loadRecords(); hideLoader();
  renderCurrentReport(); renderHistoryTab();
  document.getElementById('history-detail').style.display='none';
  document.getElementById('dateSelect').value='';
  showToast('🗑️ נמחק');
}

/* ── CALCULATIONS ───────────────────────────────────── */
function calcRecord(r) {
  const v = r.values || {};
  const totalAssets = categories.reduce((s,c)=>s+(v[c.key]||0),0);
  const mortgage    = r.mortgage_balance||0;
  return { totalAssets, mortgage, netWorth:totalAssets, ...v };
}

/* ── PENSION TAX ─────────────────────────────────────── */
function isPensionCat(cat) {
  return cat.key.toLowerCase().includes('pension') || cat.label.includes('פנסיה');
}

function calcPensionTax(amount) {
  if (!amount || amount <= 0) return 0;
  return Math.round(amount * 0.35);
}

function calcNetWorthAfterTax(calc) {
  const pensionTotal = categories.filter(isPensionCat).reduce((s,c) => s + (calc[c.key] || 0), 0);
  const tax          = calcPensionTax(pensionTotal);
  const netAfterTax  = calc.totalAssets - tax;
  return { pensionTotal, tax, netAfterTax };
}

/* ══════════════════════════════════════════════════════
   HEALTH SCORE
══════════════════════════════════════════════════════ */
function calcHealthScore(calc, records) {
  if (!records.length) return null;
  let score = 0;
  const details = [];

  // 1. Liquidity ratio (liquid assets / total) – target 15-40%
  const liquidKeys = ['cash','currentAcc','savingsFund','deposit'];
  const liquid     = categories.filter(c=>liquidKeys.includes(c.key)).reduce((s,c)=>s+(calc[c.key]||0),0);
  const liquidRatio = calc.totalAssets ? liquid/calc.totalAssets : 0;
  if      (liquidRatio >= 0.15 && liquidRatio <= 0.40) { score+=30; details.push({ label:'נזילות', note:'אחוז נזילות תקין', ok:true }); }
  else if (liquidRatio >= 0.10 && liquidRatio <= 0.55) { score+=18; details.push({ label:'נזילות', note:'נזילות סבירה', ok:null }); }
  else { score+=5; details.push({ label:'נזילות', note: liquidRatio<0.10?'נזילות נמוכה מדי':'נזילות גבוהה מדי (כסף לא עובד)', ok:false }); }

  // 2. Diversification – how many categories have meaningful amounts (>5% of total)
  const activeCats = categories.filter(c=>(calc[c.key]||0) > calc.totalAssets*0.02).length;
  if      (activeCats >= 4) { score+=30; details.push({ label:'פיזור', note:`${activeCats} קטגוריות פעילות`, ok:true }); }
  else if (activeCats >= 2) { score+=18; details.push({ label:'פיזור', note:`${activeCats} קטגוריות – יכול להשתפר`, ok:null }); }
  else                      { score+=5;  details.push({ label:'פיזור', note:'מיעוט קטגוריות – פיזור נמוך', ok:false }); }

  // 3. Growth momentum – is the trend positive?
  if (records.length >= 3) {
    const last3 = records.slice(-3).map(r=>calcRecord(r).totalAssets);
    const growing = last3[1]>last3[0] && last3[2]>last3[1];
    const stable  = last3[2]>=last3[0];
    if      (growing) { score+=25; details.push({ label:'מגמה',  note:'צמיחה עקבית ב-3 חודשים', ok:true }); }
    else if (stable)  { score+=15; details.push({ label:'מגמה',  note:'יציבות – אין ירידה', ok:null }); }
    else              { score+=0;  details.push({ label:'מגמה',  note:'ירידה ב-3 חודשים אחרונים', ok:false }); }
  } else {
    score+=15; details.push({ label:'מגמה', note:'נדרש יותר נתונים', ok:null });
  }

  // 4. Has pension/long-term
  const hasPension = (calc['pensionFund']||0)+(calc['savingsFund']||0) > 0;
  if (hasPension) { score+=15; details.push({ label:'חיסכון ארוך טווח', note:'יש פנסיה/קרן השתלמות', ok:true }); }
  else            { score+=0;  details.push({ label:'חיסכון ארוך טווח', note:'אין חיסכון ארוך טווח', ok:false }); }

  return { score: Math.min(100, Math.round(score)), details };
}

function renderHealthScore() {
  const container = document.getElementById('health-score-card');
  if (!records.length) { container.innerHTML=''; return; }
  const latest = records[records.length-1];
  const calc   = calcRecord(latest);
  const hs     = calcHealthScore(calc, records);
  if (!hs) { container.innerHTML=''; return; }

  const { score, details } = hs;
  const color = score>=75 ? 'var(--green)' : score>=50 ? 'var(--amber)' : 'var(--red)';
  const label = score>=75 ? 'מצוין' : score>=50 ? 'טוב' : 'יש מה לשפר';

  // mini arc SVG (52px)
  const r=20, cx=26, cy=26, circ=2*Math.PI*r;
  const fill = (score/100)*circ;

  const dotsHtml = details.map(d => {
    const c = d.ok===true ? 'var(--green)' : d.ok===false ? 'var(--red)' : 'var(--amber)';
    return `<span class="hs-dot" style="background:${c}" title="${d.label}: ${d.note}"></span>`;
  }).join('');

  container.innerHTML = `
    <div class="health-card-wrap" id="health-card-wrap">
      <div class="health-bar" onclick="toggleHealthDetails()" role="button" aria-expanded="false" id="health-bar-el">
        <div class="hb-right">
          <svg width="52" height="52" viewBox="0 0 52 52" class="hb-ring">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="5"/>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="5"
              stroke-dasharray="${fill} ${circ}" stroke-linecap="round"
              transform="rotate(-90 26 26)" style="transition:stroke-dasharray 1s ease"/>
            <text x="26" y="30" text-anchor="middle" font-family="JetBrains Mono,monospace"
              font-size="10" font-weight="800" fill="${color}">${score}</text>
          </svg>
          <div class="hb-meta">
            <span class="hb-title">בריאות פיננסית</span>
            <span class="hb-label" style="color:${color}">${label} · ${score}/100</span>
          </div>
        </div>
        <div class="hb-left">
          <div class="hb-dots">${dotsHtml}</div>
          <svg class="hb-chevron" id="health-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="var(--ink-4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="health-details-panel" id="health-details-panel" style="display:none;">
        ${details.map(d=>{
          const c = d.ok===true ? 'var(--green)' : d.ok===false ? 'var(--red)' : 'var(--amber)';
          return `<div class="hdp-row">
            <span class="hdp-dot" style="background:${c}"></span>
            <span class="hdp-label">${d.label}</span>
            <span class="hdp-note">${d.note}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function toggleHealthDetails() {
  const panel   = document.getElementById('health-details-panel');
  const chevron = document.getElementById('health-chevron');
  const bar     = document.getElementById('health-bar-el');
  const open    = panel.style.display === 'none';
  panel.style.display     = open ? 'block' : 'none';
  chevron.style.transform = open ? 'rotate(180deg)' : '';
  bar.setAttribute('aria-expanded', open);
}

/* ══════════════════════════════════════════════════════
   RENDER CURRENT
══════════════════════════════════════════════════════ */
function renderCurrentReport() {
  renderHealthScore();
  const el = document.getElementById('current-card');
 
  if (!records.length) {
    el.innerHTML = `
      <div class="empty-state-v2">
        <div class="es-blob">
          <div class="es-icon-ring">
            <span class="es-main-icon">₪</span>
          </div>
        </div>
        <h2 class="es-title">עדיין אין נתונים</h2>
        <p class="es-desc">הוסף את החודש הראשון שלך ותראה<br/>את התמונה הכלכלית שלך מתבהרת</p>
        <button class="es-cta-btn"
          onclick="switchTab('history', document.querySelector('[data-tab=\\'history\\']'));
                   setTimeout(() => openAddForm(null), 150);">
          ${ICONS_JS.plus} הוסף את החודש הראשון
        </button>
        <div class="es-steps">
          <div class="es-step-item">
            <div class="es-step-num">1</div>
            <span>הזן יתרות נכסים</span>
          </div>
          <div class="es-step-arrow">←</div>
          <div class="es-step-item">
            <div class="es-step-num">2</div>
            <span>חזור כל חודש</span>
          </div>
          <div class="es-step-arrow">←</div>
          <div class="es-step-item">
            <div class="es-step-num">3</div>
            <span>צפה בצמיחה</span>
          </div>
        </div>
      </div>`;
    return;
  }
 
  const latest    = records[records.length-1];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
 
  const SVG_TOTAL    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`;
  const SVG_LIQUID   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 8 2 13a10 10 0 0 0 20 0c0-5-4.48-11-10-11z"/></svg>`;
  const SVG_MORTGAGE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  const SVG_NETWORTH = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const SVG_GROWTH   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  let growthSub='', growthHtml='';
  if (records.length>=2) {
    const prev  = calcRecord(records[records.length-2]);
    const delta = calc.totalAssets - prev.totalAssets;
    const pct   = prev.totalAssets ? (delta/prev.totalAssets*100).toFixed(2) : '0.00';
    const sign  = delta>=0?'+':'';
    const cls   = delta>=0?'pos':'neg';
    const avg   = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length-1);
    growthSub   = `<span class="ht-sub ${cls}">${sign}${pct}% מחודש קודם</span>`;
    growthHtml  = `
      <div class="growth-card">
        <div class="gc-header">
          <span class="gc-title">${SVG_GROWTH} נתוני צמיחה</span>
          <span class="gc-badge ${cls}">${sign}${pct}% החודש</span>
        </div>
        <div class="gc-row"><span class="gc-row-label">צמיחה מחודש קודם</span>
          <span class="gc-row-val ${cls} blur-text">${sign}${fmt(delta)}</span></div>
        <div class="gc-row"><span class="gc-row-label">צמיחה ממוצעת לחודש</span>
          <span class="gc-row-val blur-text">${fmt(avg)}</span></div>
      </div>`;
  }

  // Year-ago comparison
  let yearAgoSub = '';
  if (records.length >= 2) {
    const latestDate = new Date(latest.record_date);
    const yearAgoTarget = new Date(latestDate);
    yearAgoTarget.setFullYear(yearAgoTarget.getFullYear() - 1);
    let yearAgoRec = null, minDiff = Infinity;
    records.forEach(r => {
      const d = Math.abs(new Date(r.record_date) - yearAgoTarget);
      if (d < minDiff && d < 45 * 86400000) { minDiff = d; yearAgoRec = r; }
    });
    if (yearAgoRec) {
      const yCalc  = calcRecord(yearAgoRec);
      const yDelta = calc.totalAssets - yCalc.totalAssets;
      const yPct   = yCalc.totalAssets ? (yDelta / yCalc.totalAssets * 100).toFixed(1) : '0.0';
      const ySign  = yDelta >= 0 ? '+' : '';
      const yCls   = yDelta >= 0 ? 'pos' : 'neg';
      const yLabel = new Date(yearAgoRec.record_date).toLocaleDateString('he-IL',{month:'long',year:'numeric'});
      yearAgoSub   = `<span class="ht-sub ${yCls}" style="font-size:.68rem;opacity:.85">${ySign}${yPct}% מ-${yLabel}</span>`;
    }
  }
 
  const liquidKeys = ['cash','currentAcc','savingsFund'];
  const liquid     = categories.filter(c=>liquidKeys.includes(c.key)).reduce((s,c)=>s+(calc[c.key]||0),0);
  const liquidPct  = calc.totalAssets ? ((liquid/calc.totalAssets)*100).toFixed(1) : '0';
 
  // Previous month calc (used for mortgage delta + cat badges)
  const prevCalc = records.length >= 2 ? calcRecord(records[records.length-2]) : null;

  const _mortInstId = localStorage.getItem('mortgage_inst_v1') || latest.values?._mortgage_inst;
  const mortInst = _mortInstId ? getInstitution(_mortInstId) : null;
  // Mortgage month-over-month delta
  const prevMort = prevCalc ? prevCalc.mortgage : null;
  let mortDeltaHtml = '';
  if (prevMort != null && calc.mortgage > 0) {
    const md = calc.mortgage - prevMort;
    const mp = prevMort ? (md / prevMort * 100).toFixed(1) : null;
    if (mp !== null) {
      // Invert sign: more debt = negative, less debt = positive
      const mCls  = md <= 0 ? 'pos' : 'neg';
      const mSign = md <= 0 ? '-' : '+'; // decrease in debt shown as -, increase as +
      const mpAbs = Math.abs(parseFloat(mp)).toFixed(1);
      mortDeltaHtml = `<div class="ct-growth ${mCls}">${mSign}${mpAbs}%</div>`;
    }
  }

  const { pensionTotal, tax, netAfterTax } = calcNetWorthAfterTax(calc);

  const mortgageHero = calc.mortgage>0 ? `
    <div class="hero-tile danger" style="animation-delay:.1s;position:relative;cursor:pointer" onclick="openCatHistory('_mortgage','יתרת משכנתא')">
      <div class="ht-label" style="margin-bottom:4px">${SVG_MORTGAGE} יתרת משכנתא</div>
      ${mortInst ? `<span class="ct-inst" style="display:flex;align-items:center;gap:4px;margin-bottom:8px"><img src="${logoUrl(mortInst.domain)}" width="13" height="13" style="border-radius:3px;object-fit:contain" onerror="this.style.display='none'"/>${mortInst.name}</span>` : ''}
      <div class="ht-value blur-text" style="margin-bottom:6px" data-countup="${calc.mortgage}">${fmt(calc.mortgage)}</div>
      ${mortDeltaHtml}
    </div>
    <div class="hero-tile warning" style="animation-delay:.15s;cursor:pointer" onclick="showTaxBreakdown()">
      <div class="ht-label">${SVG_NETWORTH} שווי נקי אחרי מס</div>
      <div class="ht-value blur-text" data-countup="${netAfterTax}">${fmt(netAfterTax)}</div>
      ${tax > 0 ? `<div class="ct-growth neg" style="margin-top:4px;font-size:.7rem;font-family:var(--font)">מס פנסיה: ${fmt(tax)}</div>` : ''}
    </div>` : '';
 

  const catTiles = categories.map((cat,i) => {
    const inst     = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const logoHtml = inst
      ? `<img src="${logoUrl(inst.domain)}" alt="${inst.name}" class="cat-tile-logo"
             onerror="this.style.display='none'"/>`
      : '';

    // Per-category growth badge
    let growthBadge = '';
    if (prevCalc) {
      const cur  = calc[cat.key] || 0;
      const prev = prevCalc[cat.key] || 0;
      if (prev > 0) {
        const delta = cur - prev;
        const pct   = (delta / prev * 100).toFixed(1);
        const pos   = delta >= 0;
        const sign  = pos ? '+' : '';
        growthBadge = `<div class="ct-growth ${pos?'pos':'neg'}">${sign}${pct}%</div>`;
      } else if (cur > 0 && prev === 0) {
        growthBadge = `<div class="ct-growth pos" style="font-family:var(--font)">חדש</div>`;
      }
    }

    return `
    <div class="cat-tile" style="animation-delay:${.05*(i+1)}s;cursor:pointer" onclick="openCatHistory('${cat.key}','${cat.label}')">
      ${logoHtml}
      <span class="ct-icon" ${inst?'style="display:none"':''}>${getCatSvg(cat)}</span>
      <div class="ct-label">${cat.label}${inst?`<span class="ct-inst">${inst.name}</span>`:''}</div>
      <div class="ct-value blur-text" data-countup="${calc[cat.key]||0}">${fmt(calc[cat.key]||0)}</div>
      ${growthBadge}
    </div>`;
  }).join('');
 
  const notesHtml = latest.notes
    ? `<div class="notes-bar ${latest.notes.includes('✔️')?'pos':'neg'}">${latest.notes}</div>` : '';
 
  el.innerHTML = `
    <div class="hero-strip">
      <div class="hero-tile accent" style="cursor:pointer" onclick="showTotalAssetsBreakdown()">
        <div class="ht-label">${SVG_TOTAL} סה"כ נכסים</div>
        <div class="ht-value blur-text" data-countup="${calc.totalAssets}">${fmt(calc.totalAssets)}</div>
        ${growthSub}
        ${yearAgoSub}
      </div>
      <div class="hero-tile" style="animation-delay:.05s;cursor:pointer" onclick="showLiquidInfo()">
        <div class="ht-label">${SVG_LIQUID} נכסים נזילים</div>
        <div class="ht-value blur-text" data-countup="${liquid}">${fmt(liquid)}</div>
        <span class="ht-sub">${liquidPct}% מהתיק</span>
      </div>
      ${mortgageHero}
    </div>
    <div class="section-header">פירוט נכסים – ${dateLabel}</div>
    <div class="cat-grid">${catTiles}</div>
    ${growthHtml}
    ${notesHtml}`;
  applyBlur();
  animateCountUps();
}

/* ══════════════════════════════════════════════════════
   HISTORY TAB
══════════════════════════════════════════════════════ */
function renderHistoryTab() {
  renderChart();
  populateDateSelect();
  renderDynamicFields();
  populateYearSelects();
  renderYearVsYear();
}

/* ── Year vs Year ───────────────────────────────────── */
function getYearsFromRecords() {
  const years = new Set(records.map(r => new Date(r.record_date).getFullYear()));
  return [...years].sort((a,b)=>b-a);
}

function populateYearSelects() {
  const years = getYearsFromRecords();
  ['yvy-year-a','yvy-year-b'].forEach((id,idx) => {
    const sel = document.getElementById(id); if(!sel) return;
    sel.innerHTML = years.map((y,i) =>
      `<option value="${y}" ${i===idx&&years.length>1?'selected':''}>${y}</option>`).join('');
  });
}

function renderYearVsYear() {
  const yearA = parseInt(document.getElementById('yvy-year-a')?.value);
  const yearB = parseInt(document.getElementById('yvy-year-b')?.value);
  const card  = document.getElementById('yvy-card');
  if (!yearA || !yearB || yearA===yearB || !records.length) {
    if(card) card.style.display='none'; return;
  }
  card.style.display = 'block';
  const months = Array.from({length:12},(_,i)=>i);
  const monthNames = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];

  function getMonthData(year) {
    return months.map(m => {
      const r = records.find(rec => {
        const d = new Date(rec.record_date);
        return d.getFullYear()===year && d.getMonth()===m;
      });
      return r ? calcRecord(r).totalAssets : null;
    });
  }

  const dataA = getMonthData(yearA);
  const dataB = getMonthData(yearB);

  const canvas = document.getElementById('yvy-chart'); if(!canvas) return;
  if (yvyChart) { yvyChart.destroy(); yvyChart=null; }

  yvyChart = new Chart(canvas, {
    type:'bar',
    data:{
      labels: monthNames,
      datasets:[
        { label:`${yearA}`, data:dataA, backgroundColor:'rgba(14,158,126,.7)', borderRadius:4 },
        { label:`${yearB}`, data:dataB, backgroundColor:'rgba(79,142,247,.7)', borderRadius:4 },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ position:'bottom', labels:{ font:{family:"'Outfit','Heebo',sans-serif",size:11}, color:'#6b7280', padding:14, boxWidth:12 }},
        tooltip:{
          rtl:true, backgroundColor:'#111827', titleColor:'#f9fafb', bodyColor:'#9ca3af',
          borderColor:'#374151', borderWidth:1, padding:10,
          callbacks:{ label: ctx => ctx.raw!=null ? ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` : ' אין נתון' }
        }
      },
      scales:{
        y:{ grid:{color:'rgba(0,0,0,.05)'}, border:{color:'#e5e9f0'}, ticks:{font:{family:"'JetBrains Mono',monospace",size:10},color:'#9ca3af',
            callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M₪':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K₪':v+'₪'}},
        x:{ grid:{display:false}, border:{color:'#e5e9f0'}, ticks:{font:{family:"'Outfit','Heebo',sans-serif",size:10},color:'#9ca3af'}}
      }
    }
  });
}

/* ── Main chart with best-month highlight ───────────── */
function renderChart() {
  const canvas = document.getElementById('main-chart'); if(!canvas) return;
  if (mainChart) { mainChart.destroy(); mainChart=null; }
  if (!records.length) return;

  const labels    = records.map(r=>new Date(r.record_date).toLocaleDateString('he-IL',{month:'short',year:'2-digit'}));
  const totals    = records.map(r=>calcRecord(r).totalAssets);
  const mortgages = records.map(r=>r.mortgage_balance||0);
  const nets      = records.map(r=>calcRecord(r).netWorth);
  const hasMort   = mortgages.some(m=>m>0);

  // Find best month (highest growth)
  let bestIdx = -1, bestGrowth = -Infinity;
  totals.forEach((v,i)=>{ if(i>0){ const g=v-totals[i-1]; if(g>bestGrowth){bestGrowth=g;bestIdx=i;} } });

  // Point styles – golden star for best month
  const pointStyles  = totals.map((_,i)=> i===bestIdx ? 'star'   : 'circle');
  const pointSizes   = totals.map((_,i)=> i===bestIdx ? 10       : 5);
  const pointColors  = totals.map((_,i)=> i===bestIdx ? '#f59e0b' : '#0e9e7e');

  const datasets = [{
    label:'סה"כ נכסים', data:totals,
    borderColor:'#0e9e7e', backgroundColor:'rgba(14,158,126,.08)',
    fill:true, tension:.4,
    pointRadius:pointSizes, pointStyle:pointStyles,
    pointBackgroundColor:pointColors,
    pointBorderColor:'#fff', pointBorderWidth:2,
  }];

  if (hasMort) {
    datasets.push({ label:'יתרת משכנתא', data:mortgages, borderColor:'#ef4444',
      backgroundColor:'transparent', fill:false, tension:.4,
      pointRadius:5, pointBackgroundColor:'#ef4444', pointBorderColor:'#fff', pointBorderWidth:2 });
    datasets.push({ label:'שווי נקי', data:nets, borderColor:'#f59e0b',
      backgroundColor:'rgba(245,158,11,.06)', fill:false, tension:.4, borderDash:[5,4],
      pointRadius:5, pointBackgroundColor:'#f59e0b', pointBorderColor:'#fff', pointBorderWidth:2 });
  }

  const opts = chartOptions();
  // Add best-month tooltip note
  const origLabel = opts.plugins.tooltip.callbacks.label;
  opts.plugins.tooltip.callbacks.label = function(ctx) {
    const base = ` ${ctx.dataset.label}: ${fmt(ctx.raw)}`;
    if (ctx.datasetIndex===0 && ctx.dataIndex===bestIdx)
      return [base, ` ⭐ החודש הטוב ביותר! (+${fmt(bestGrowth)})`];
    return base;
  };

  mainChart = new Chart(canvas,{type:'line',data:{labels,datasets},options:opts});
}

function populateDateSelect() {
  const sel=document.getElementById('dateSelect'); if(!sel) return;
  sel.innerHTML='<option value="" disabled selected>בחר חודש לפירוט</option>';
  [...records].reverse().forEach(r=>{
    const o=document.createElement('option');
    o.value=r.id;
    o.textContent=new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
    sel.appendChild(o);
  });
}

function onDateChange() {
  const r=records.find(r=>r.id===document.getElementById('dateSelect').value);
  if(r) renderDetailCard(r);
}

function renderDetailCard(record) {
  const calc      = calcRecord(record);
  const dateLabel = new Date(record.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  const _recMortInstId = localStorage.getItem('mortgage_inst_v1') || record.values?._mortgage_inst;
  const recMortInst = _recMortInstId ? getInstitution(_recMortInstId) : null;
  const mortInstLabel = recMortInst
    ? `<img src="${logoUrl(recMortInst.domain)}" width="14" height="14" style="border-radius:3px;object-fit:contain;margin-left:4px" onerror="this.style.display='none'"/> ${recMortInst.name} · `
    : '';
  const mortRows  = calc.mortgage>0 ? `
    <div class="hd-row"><span class="hd-row-label">${ICONS_JS.home} ${mortInstLabel}יתרת משכנתא</span>
      <span class="hd-row-val neg blur-text">${fmt(calc.mortgage)}</span></div>
    <div class="hd-row total-row"><span class="hd-row-label">${ICONS_JS.diamond} שווי נקי</span>
      <span class="hd-row-val blur-text">${fmt(calc.netWorth)}</span></div>` : '';
  const notesHtml = record.notes
    ? `<div class="notes-bar ${record.notes.includes('✔️')?'pos':'neg'}" style="margin:14px 18px">${record.notes}</div>` : '';
  const container = document.getElementById('history-detail');
  container.innerHTML = `
    <div class="hd-card">
      <div class="hd-header">
        <span class="hd-date">${ICONS_JS.calendar} ${dateLabel}</span>
        <div style="display:flex;gap:8px">
          <button class="edit-btn" onclick="openWizardEdit(${JSON.stringify(record).replace(/"/g,'&quot;')})">${ICONS_JS.edit} ערוך</button>
          <button class="delete-btn" onclick="deleteRecord('${record.id}')">${ICONS_JS.trash} מחק</button>
        </div>
      </div>
      ${categories.map(cat=>`
      <div class="hd-row"><span class="hd-row-label">${cat.label}</span>
        <span class="hd-row-val blur-text">${fmt(calc[cat.key]||0)}</span></div>`).join('')}
      <div class="hd-row total-row">
        <span class="hd-row-label" style="font-weight:700">${ICONS_JS.barChart} סה"כ נכסים</span>
        <span class="hd-row-val blur-text">${fmt(calc.totalAssets)}</span></div>
      ${mortRows}
    </div>${notesHtml}`;
  container.style.display='block';
  applyBlur();
  setTimeout(()=>container.scrollIntoView({behavior:'smooth',block:'start'}),100);
}

function renderDynamicFields() {
  const container=document.getElementById('dynamic-fields'); if(!container) return;
  container.innerHTML=categories.map(cat=>`
    <div class="form-field">
      <label>${cat.label}</label>
      <input type="number" id="field_${cat.key}" placeholder="0" class="form-input"/>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════
   RETIREMENT
══════════════════════════════════════════════════════ */
const RET_KEY='ret_settings_v1';

function loadRetirementSettings() {
  try {
    // Load from Supabase user_metadata first, fallback to localStorage
    const meta = currentUser?.user_metadata?.retirement_settings;
    const s = meta ? JSON.parse(meta) : JSON.parse(localStorage.getItem(RET_KEY)||'{}');
    ['ret-current-age','ret-age','ret-return','ret-monthly'].forEach(id=>{
      const el=document.getElementById(id); if(el&&s[id]!==undefined) el.value=s[id];
    });
  } catch(e){}
}

async function saveRetirementSettings() {
  const s={};
  ['ret-current-age','ret-age','ret-return','ret-monthly'].forEach(id=>{
    const el=document.getElementById(id); if(el) s[id]=el.value;
  });
  localStorage.setItem(RET_KEY,JSON.stringify(s));
  // Also save to Supabase so it syncs across devices
  if (currentUser) {
    await db.auth.updateUser({ data: { retirement_settings: JSON.stringify(s) } });
  }
}

function renderRetirement() {
  saveRetirementSettings();
  const currentAge   = parseInt(document.getElementById('ret-current-age').value)||0;
  const retireAge    = parseInt(document.getElementById('ret-age').value)||0;
  const annualReturn = parseFloat(document.getElementById('ret-return').value)||0;
  const monthlySave  = parseFloat(document.getElementById('ret-monthly').value)||0;

  const warnEl = document.getElementById('ret-warning');
  if (annualReturn>15) {
    warnEl.innerHTML=`${ICONS_JS.alert} תשואה של ${annualReturn}% היא גבוהה מאוד ולא ריאלית לטווח ארוך. ממוצע S&P 500 היסטורי הוא ~10% שנתי.`;
    warnEl.style.display='block';
  } else { warnEl.style.display='none'; }

  if (!currentAge||!retireAge||retireAge<=currentAge) {
    document.getElementById('ret-summary').innerHTML='<div class="ret-hint">הכנס גיל נוכחי וגיל פרישה להצגת התחזית</div>';
    return;
  }

  const yearsLeft  = retireAge-currentAge;
  const monthsLeft = yearsLeft*12;
  const mRate      = annualReturn/100/12;
  const startAssets= records.length ? calcRecord(records[records.length-1]).totalAssets : 0;

  let avgMonthlyGrowth=0;
  if (records.length>=2) {
    const first=calcRecord(records[0]).totalAssets;
    const last =calcRecord(records[records.length-1]).totalAssets;
    avgMonthlyGrowth=(last-first)/(records.length-1);
  }

  const proj=[startAssets];
  let v=startAssets;
  for(let m=1;m<=monthsLeft;m++){
    v = mRate>0 ? v*(1+mRate)+monthlySave : v+avgMonthlyGrowth+monthlySave;
    proj.push(Math.max(0,v));
  }
  const projected=proj[proj.length-1];

  const yearLabels=[], histByYear=[], projByYear=[];
  records.forEach(r=>{
    const d=new Date(r.record_date);
    const age=currentAge-Math.round((new Date()-d)/(365.25*24*3600*1000));
    yearLabels.push(`גיל ${Math.round(age)}`);
    histByYear.push(calcRecord(r).totalAssets);
  });
  for(let y=0;y<=yearsLeft;y++){
    projByYear.push({x:`גיל ${currentAge+y}`,y:proj[Math.min(y*12,proj.length-1)]});
  }

  renderRetirementSummary(projected,yearsLeft,monthlySave,annualReturn,startAssets);
  renderRetirementChart(records,projByYear,currentAge,annualReturn);
  renderRetirementBreakdown(startAssets,projected,yearsLeft,monthlySave);
}

function renderRetirementSummary(projected,yearsLeft,monthlySave,annualReturn,start) {
  const growth=projected-start;
  const mult=start>0?(projected/start).toFixed(1):'—';
  document.getElementById('ret-summary').innerHTML=`
    <div class="ret-tiles">
      <div class="ret-tile accent">
        <div class="rt-label">${ICONS_JS.target} צבירה צפויה בפרישה</div>
        <div class="rt-value blur-text">${fmt(projected)}</div>
        <div class="rt-sub">פי ${mult} מהיום</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">${ICONS_JS.clock} שנים עד פרישה</div>
        <div class="rt-value">${yearsLeft}</div>
        <div class="rt-sub">${yearsLeft*12} חודשים</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">${ICONS_JS.trending} צמיחה כוללת</div>
        <div class="rt-value blur-text">${fmt(growth)}</div>
        <div class="rt-sub">בריבית ${annualReturn}% שנתי</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">${ICONS_JS.piggy} חיסכון חודשי</div>
        <div class="rt-value blur-text">${fmt(monthlySave)}</div>
        <div class="rt-sub">${fmt(monthlySave*yearsLeft*12)} סה"כ</div>
      </div>
    </div>`;
  applyBlur();
}

function renderRetirementChart(histRecords,projByYear,currentAge,annualReturn) {
  const canvas=document.getElementById('ret-chart'); if(!canvas) return;
  if(retChart){retChart.destroy();retChart=null;}
  const histPoints=histRecords.map(r=>{
    const d=new Date(r.record_date);
    const age=currentAge-Math.round((new Date()-d)/(365.25*24*3600*1000));
    return {x:`גיל ${Math.round(age)}`,y:calcRecord(r).totalAssets};
  });
  const allLabels=[...new Set([...histPoints,...projByYear].map(p=>p.x))]
    .sort((a,b)=>parseInt(a.replace('גיל ',''))-parseInt(b.replace('גיל ','')));
  const opts=chartOptions();
  opts.plugins.tooltip.callbacks.label=ctx=>` ${ctx.dataset.label}: ${fmt(ctx.raw.y||ctx.raw)}`;
  opts.scales.x={type:'category',grid:{display:false},border:{color:'#e5e9f0'},ticks:{font:{family:"'Outfit','Heebo',sans-serif",size:10},color:'#9ca3af'}};
  retChart=new Chart(canvas,{type:'line',data:{labels:allLabels,datasets:[
    {label:'נכסים בפועל',data:histPoints,borderColor:'#0e9e7e',backgroundColor:'rgba(14,158,126,.08)',fill:true,tension:.4,pointRadius:5,pointBackgroundColor:'#0e9e7e',pointBorderColor:'#fff',pointBorderWidth:2},
    {label:`תחזית (${annualReturn}%)`,data:projByYear,borderColor:'#4f8ef7',backgroundColor:'rgba(79,142,247,.06)',fill:true,tension:.4,borderDash:[6,4],pointRadius:4,pointBackgroundColor:'#4f8ef7',pointBorderColor:'#fff',pointBorderWidth:2}
  ]},options:opts});
}

function renderRetirementBreakdown(start,projected,years,monthly) {
  const contributions=monthly*years*12;
  const organic=Math.max(0,projected-start-contributions);
  const bars=[
    {label:'נכסים נוכחיים',value:start,color:'#0e9e7e',pct:(start/projected*100).toFixed(1)},
    {label:'חיסכון עתידי', value:contributions,color:'#4f8ef7',pct:(contributions/projected*100).toFixed(1)},
    {label:'תשואה',         value:organic,color:'#f59e0b',pct:(organic/projected*100).toFixed(1)},
  ].filter(b=>b.value>0);
  document.getElementById('ret-breakdown').innerHTML=`
    <div class="rbd-header"><span class="gc-title">${ICONS_JS.breakdown} פירוק צבירה</span></div>
    ${bars.map(b=>`
    <div class="rbd-row">
      <div class="rbd-info"><span class="rbd-dot" style="background:${b.color}"></span><span class="rbd-label">${b.label}</span></div>
      <div class="rbd-right">
        <div class="rbd-bar-wrap"><div class="rbd-bar" style="width:${b.pct}%;background:${b.color}"></div></div>
        <span class="rbd-val blur-text">${fmt(b.value)}</span>
        <span class="rbd-pct">${b.pct}%</span>
      </div>
    </div>`).join('')}`;
  applyBlur();
}

/* ── CHART OPTIONS ──────────────────────────────────── */
function chartOptions() {
  return {
    responsive:true, maintainAspectRatio:false,
    plugins:{
      legend:{position:'bottom',labels:{font:{family:"'Outfit','Heebo',sans-serif",size:11},color:'#6b7280',padding:16,boxWidth:12,usePointStyle:true}},
      tooltip:{rtl:true,backgroundColor:'#111827',titleColor:'#f9fafb',bodyColor:'#9ca3af',borderColor:'#374151',borderWidth:1,padding:12,
        titleFont:{family:"'Outfit',sans-serif",weight:'700'},bodyFont:{family:"'JetBrains Mono',monospace",size:12},
        callbacks:{label:ctx=>` ${ctx.dataset.label}: ${fmt(ctx.raw)}`}}
    },
    scales:{
      y:{grid:{color:'rgba(0,0,0,.05)'},border:{color:'#e5e9f0'},ticks:{font:{family:"'JetBrains Mono',monospace",size:10},color:'#9ca3af',
          callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M₪':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K₪':v+'₪'}},
      x:{grid:{display:false},border:{color:'#e5e9f0'},ticks:{font:{family:"'Outfit','Heebo',sans-serif",size:10},color:'#9ca3af'}}
    }
  };
}

/* ── PDF EXPORT ─────────────────────────────────────── */
function exportPDF() {
  if (!records.length) { showToast('אין נתונים להדפסה'); return; }

  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });
  const userName  = currentUser?.user_metadata?.full_name || currentUser?.email || '';
  const today     = new Date().toLocaleDateString('he-IL', { year:'numeric', month:'long', day:'numeric' });

  let deltaAmt = 0, deltaPct = '0.0', avgGrowth = 0, growthSign = '+', growthColor = '#0e9e7e';
  if (records.length >= 2) {
    const prev = calcRecord(records[records.length - 2]);
    deltaAmt   = calc.totalAssets - prev.totalAssets;
    deltaPct   = prev.totalAssets ? Math.abs(deltaAmt / prev.totalAssets * 100).toFixed(1) : '0.0';
    avgGrowth  = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length - 1);
    growthSign = deltaAmt >= 0 ? '+' : '-';
    growthColor= deltaAmt >= 0 ? '#0e9e7e' : '#ef4444';
  }

  const mortInstId = localStorage.getItem('mortgage_inst_v1') || latest.values?._mortgage_inst;
  const mortInst   = mortInstId ? getInstitution(mortInstId) : null;

  const catRows = categories.map(cat => {
    const inst = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const val  = calc[cat.key] || 0;
    const pct  = calc.totalAssets ? (val / calc.totalAssets * 100).toFixed(1) : '0.0';
    const bar  = Math.round(parseFloat(pct));
    return '<tr><td><div style="font-weight:600;color:#111827">' + cat.label + '</div>'
      + (inst ? '<div style="font-size:.72rem;color:#0e9e7e;margin-top:1px">' + inst.name + '</div>' : '')
      + '</td><td style="text-align:left;font-family:\'Courier New\',monospace;font-weight:700">' + fmt(val) + '</td>'
      + '<td style="width:130px"><div style="display:flex;align-items:center;gap:7px">'
      + '<div style="flex:1;height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden">'
      + '<div style="width:' + bar + '%;height:100%;background:#0e9e7e;border-radius:3px"></div></div>'
      + '<span style="font-size:.72rem;color:#6b7280;min-width:32px;text-align:right">' + pct + '%</span>'
      + '</div></td></tr>';
  }).join('');

  const histRows = [...records].reverse().slice(0, 12).map((r, i) => {
    const c   = calcRecord(r);
    const d   = new Date(r.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });
    const idx = records.length - 1 - i;
    const prev = idx > 0 ? calcRecord(records[idx - 1]) : null;
    let changeHtml = '\u2014';
    if (prev) {
      const chg = c.totalAssets - prev.totalAssets;
      const pp  = prev.totalAssets ? (chg / prev.totalAssets * 100).toFixed(1) : null;
      if (pp !== null) changeHtml = '<span style="color:' + (chg>=0?'#0e9e7e':'#ef4444') + ';font-weight:600">' + (chg>=0?'+':'') + pp + '%</span>';
    }
    return '<tr style="background:' + (i%2===0?'#ffffff':'#f9fafb') + '">'
      + '<td style="text-align:right">' + d + '</td>'
      + '<td style="text-align:right;font-family:\'Courier New\',monospace;font-weight:600">' + fmt(c.totalAssets) + '</td>'
      + '<td style="text-align:right">' + (c.mortgage > 0 ? '<span style="color:#ef4444">' + fmt(c.mortgage) + '</span>' : '<span style="color:#d1d5db">\u2014</span>') + '</td>'
      + '<td style="text-align:right">' + changeHtml + '</td></tr>';
  }).join('');

  const mortHeroHtml = calc.mortgage > 0
    ? '<div class="hero-card danger"><div class="hc-label">\u05d9\u05ea\u05e8\u05ea \u05de\u05e9\u05db\u05e0\u05ea\u05d0' + (mortInst ? ' \u00b7 ' + mortInst.name : '') + '</div><div class="hc-val">' + fmt(calc.mortgage) + '</div></div>'
    + '<div class="hero-card warning"><div class="hc-label">\u05e9\u05d5\u05d5\u05d9 \u05e0\u05e7\u05d9</div><div class="hc-val">' + fmt(calc.netWorth) + '</div></div>'
    : '<div class="hero-card"><div class="hc-label">\u05d7\u05d5\u05d3\u05e9\u05d9\u05dd \u05de\u05ea\u05d5\u05e2\u05d3\u05d9\u05dd</div><div class="hc-val">' + records.length + '</div></div>'
    + '<div class="hero-card"><div class="hc-label">\u05e6\u05de\u05d9\u05d7\u05d4 \u05de\u05de\u05d5\u05e6\u05e2\u05ea \u05dc\u05d7\u05d5\u05d3\u05e9</div><div class="hc-val">' + fmt(avgGrowth) + '</div></div>';

  const growthStripHtml = records.length >= 2
    ? '<div class="growth-strip">'
    + '<div class="gs-item"><div class="gs-label">\u05e9\u05d9\u05e0\u05d5\u05d9 \u05d4\u05d7\u05d5\u05d3\u05e9</div><div class="gs-val" style="color:' + growthColor + '">' + growthSign + fmt(Math.abs(deltaAmt)) + '</div></div>'
    + '<div class="gs-item"><div class="gs-label">\u05e9\u05d9\u05e0\u05d5\u05d9 %</div><div class="gs-val" style="color:' + growthColor + '">' + growthSign + deltaPct + '%</div></div>'
    + '<div class="gs-item"><div class="gs-label">\u05de\u05de\u05d5\u05e6\u05e2 \u05d7\u05d5\u05d3\u05e9\u05d9</div><div class="gs-val">' + fmt(avgGrowth) + '</div></div>'
    + '</div>' : '';

  const deltaSubHtml = records.length >= 2
    ? '<div class="hc-sub" style="color:' + growthColor + ';font-weight:700">' + growthSign + deltaPct + '% \u05de\u05d7\u05d5\u05d3\u05e9 \u05e7\u05d5\u05d3\u05dd</div>' : '';

  const html = '<!DOCTYPE html>\n<html dir="rtl" lang="he">\n<head>\n<meta charset="UTF-8"/>\n'
    + '<title>\u05d3\u05d5\u05d7 \u05e4\u05d9\u05e0\u05e0\u05e1\u05d9 \u2013 ' + dateLabel + '</title>\n'
    + '<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>\n'
    + '<style>\n'
    + '*{box-sizing:border-box;margin:0;padding:0}\n'
    + 'body{font-family:\'Heebo\',sans-serif;color:#111827;background:#f8fafc;direction:rtl;padding:24px}\n'
    + '.page{max-width:780px;margin:0 auto;background:#fff;border-radius:16px;padding:48px 40px;box-shadow:0 4px 24px rgba(0,0,0,.08)}\n'
    + '.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:3px solid #0e9e7e}\n'
    + '.brand{display:flex;align-items:center;gap:14px}\n'
    + '.logo{width:48px;height:48px;background:linear-gradient(135deg,#0e9e7e,#13b891);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:900;color:#fff}\n'
    + '.brand-text h1{font-size:1.5rem;font-weight:900;color:#111827;letter-spacing:-.03em}\n'
    + '.brand-text p{font-size:.8rem;color:#6b7280;margin-top:2px}\n'
    + '.header-meta{text-align:left;font-size:.82rem;color:#6b7280;line-height:1.8}\n'
    + '.header-meta strong{color:#111827;font-weight:700}\n'
    + '.hero{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:36px}\n'
    + '.hero-card{padding:20px 18px;border-radius:14px;border:1.5px solid #e5e9f0}\n'
    + '.hero-card.primary{background:linear-gradient(135deg,#f0fdf9,#dcfdf5);border-color:#a7f3d0}\n'
    + '.hero-card.danger{background:linear-gradient(135deg,#fff5f5,#fee2e2);border-color:#fecaca}\n'
    + '.hero-card.warning{background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#fde68a}\n'
    + '.hc-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:8px}\n'
    + '.hc-val{font-size:1.5rem;font-weight:900;color:#111827;letter-spacing:-.02em}\n'
    + '.hero-card.primary .hc-val{color:#0e9e7e}.hero-card.danger .hc-val{color:#dc2626}.hero-card.warning .hc-val{color:#d97706}\n'
    + '.hc-sub{font-size:.72rem;margin-top:5px;color:#6b7280}\n'
    + '.growth-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:36px}\n'
    + '.gs-item{padding:14px 16px;background:#f9fafb;border-radius:10px;border:1px solid #f3f4f6}\n'
    + '.gs-label{font-size:.68rem;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}\n'
    + '.gs-val{font-size:1rem;font-weight:800;color:#111827}\n'
    + '.section-title{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;margin:32px 0 12px;display:flex;align-items:center;gap:8px}\n'
    + '.section-title::after{content:"";flex:1;height:1px;background:#f3f4f6}\n'
    + 'table{width:100%;border-collapse:collapse}\n'
    + 'th{text-align:right;padding:10px 14px;background:#f9fafb;font-weight:700;color:#374151;border-bottom:2px solid #e5e9f0;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}\n'
    + 'td{padding:12px 14px;border-bottom:1px solid #f3f4f6;font-size:.875rem;color:#374151;vertical-align:middle}\n'
    + '.total-row td{font-weight:800;background:#f0fdf9;color:#0e9e7e;border-top:2px solid #a7f3d0}\n'
    + '.footer{margin-top:48px;padding-top:20px;border-top:2px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center}\n'
    + '.footer-brand{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#9ca3af}\n'
    + '.footer-logo{width:22px;height:22px;background:linear-gradient(135deg,#0e9e7e,#13b891);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:900;color:#fff}\n'
    + '.footer-note{font-size:.72rem;color:#9ca3af}\n'
    + '.action-bar{position:fixed;bottom:0;left:0;right:0;background:#111827;padding:14px 24px;display:flex;gap:12px;justify-content:center;align-items:center}\n'
    + '.action-btn{padding:10px 28px;border:none;border-radius:8px;font-family:\'Heebo\',sans-serif;font-size:.95rem;font-weight:700;cursor:pointer;background:#0e9e7e;color:#fff}\n'
    + '.action-hint{font-size:.75rem;color:#6b7280}\n'
    + '@media print{body{background:#fff;padding:0}.page{box-shadow:none;border-radius:0;padding:20px}.action-bar{display:none}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}\n'
    + '@page{margin:8mm;size:A4}\n'
    + '</style></head><body>\n'
    + '<div class="page">'
    + '<div class="header"><div class="brand"><div class="logo">\u20aa</div><div class="brand-text"><h1>\u05d3\u05d5\u05d7 \u05e4\u05d9\u05e0\u05e0\u05e1\u05d9 \u05d0\u05d9\u05e9\u05d9</h1><p>\u05e1\u05d9\u05db\u05d5\u05dd \u05de\u05e6\u05d1 \u05e0\u05db\u05e1\u05d9\u05dd \u05d5\u05ea\u05d9\u05e7 \u05e4\u05d9\u05e0\u05e0\u05e1\u05d9</p></div></div>'
    + '<div class="header-meta"><div><strong>\u05e9\u05dd:</strong> ' + userName + '</div><div><strong>\u05d3\u05d5\u05d7 \u05dc\u05ea\u05d0\u05e8\u05d9\u05da:</strong> ' + dateLabel + '</div><div><strong>\u05d4\u05d5\u05e4\u05e7:</strong> ' + today + '</div></div></div>'
    + '<div class="hero"><div class="hero-card primary"><div class="hc-label">\u05e1\u05d4"\u05db \u05e0\u05db\u05e1\u05d9\u05dd</div><div class="hc-val">' + fmt(calc.totalAssets) + '</div>' + deltaSubHtml + '</div>' + mortHeroHtml + '</div>'
    + growthStripHtml
    + '<div class="section-title">\u05e4\u05d9\u05e8\u05d5\u05d8 \u05e0\u05db\u05e1\u05d9\u05dd</div>'
    + '<table><thead><tr><th>\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4 / \u05d2\u05d5\u05e3 \u05de\u05e0\u05d4\u05dc</th><th style="text-align:left">\u05d9\u05ea\u05e8\u05d4</th><th>\u05d7\u05dc\u05e7 \u05de\u05d4\u05ea\u05d9\u05e7</th></tr></thead>'
    + '<tbody>' + catRows + '<tr class="total-row"><td>\u05e1\u05d4"\u05db \u05e0\u05db\u05e1\u05d9\u05dd</td><td style="text-align:left;font-family:\'Courier New\',monospace">' + fmt(calc.totalAssets) + '</td><td>100%</td></tr></tbody></table>'
    + '<div class="section-title">\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4 \u2014 12 \u05d7\u05d5\u05d3\u05e9\u05d9\u05dd \u05d0\u05d7\u05e8\u05d5\u05e0\u05d9\u05dd</div>'
    + '<table><thead><tr>'
    + '<th style="text-align:right">חודש</th>'
    + '<th style="text-align:right">סה"כ נכסים</th>'
    + '<th style="text-align:right">משכנתא</th>'
    + '<th style="text-align:right">שינוי</th>'
    + '</tr></thead><tbody>' + histRows + '</tbody></table>'
    + '<div class="footer"><div class="footer-brand"><div class="footer-logo">\u20aa</div>\u05de\u05e2\u05e7\u05d1 \u05e4\u05d9\u05e0\u05e0\u05e1\u05d9 \u2014 Budgy</div><div class="footer-note">\u05e1\u05d5\u05d3\u05d9 \u2014 \u05dc\u05e9\u05d9\u05de\u05d5\u05e9 \u05d0\u05d9\u05e9\u05d9 \u05d5\u05d9\u05d5\u05e2\u05e6\u05d9\u05dd \u05de\u05d5\u05e8\u05e9\u05d9\u05dd \u05d1\u05dc\u05d1\u05d3</div></div>'
    + '</div>'
    + '<div class="action-bar"><button class="action-btn" onclick="window.print()">🖨 שמור / הדפס</button><button class="action-btn" style="background:#374151" onclick="window.location.href=\'https://perezari.github.io/Finance/\'">← חזרה</button></div>'
    + '</body></html>';

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

const ONBOARDING_STEPS = [
  {
    emoji: '👋',
    title: 'ברוך הבא למעקב פיננסי!',
    desc:  'האפליקציה עוזרת לך לעקוב אחרי הנכסים שלך, לראות צמיחה לאורך זמן ולתכנן את הפרישה שלך.'
  },
  {
    emoji: '📅',
    title: 'הוסף חודש אחד בחודש',
    desc:  'כל חודש עדכן את יתרות הנכסים שלך — עו"ש, חסכונות, פנסיה ועוד. לוקח פחות מ-2 דקות.'
  },
  {
    emoji: '🚀',
    title: 'צפה בצמיחה שלך!',
    desc:  'אחרי מספר חודשים תראה גרפים, ניתוח בריאות פיננסית ותחזית לפרישה. בוא נתחיל!'
  }
];
 
function checkOnboarding() {
  if (!records.length && !localStorage.getItem('onboarding_done_v1')) {
    setTimeout(showOnboarding, 400);
  }
}
 
function showOnboarding() {
  document.getElementById('onboarding-overlay').style.display = 'flex';
  setOnboardingStep(0);
}
 
function setOnboardingStep(step) {
  onboardingStep = step;
  const s = ONBOARDING_STEPS[step];
  document.getElementById('ob-emoji').textContent = s.emoji;
  document.getElementById('ob-title').textContent = s.title;
  document.getElementById('ob-desc').textContent  = s.desc;
  document.getElementById('ob-dots').innerHTML    = ONBOARDING_STEPS.map((_,i) =>
    `<div class="ob-dot${i===step?' active':''}"></div>`).join('');
  document.getElementById('ob-next-btn').textContent =
    step < ONBOARDING_STEPS.length - 1 ? 'הבא ←' : '🚀 בואו נתחיל!';
}
 
function nextOnboardingStep() {
  if (onboardingStep < ONBOARDING_STEPS.length - 1) {
    setOnboardingStep(onboardingStep + 1);
  } else {
    closeOnboarding();
  }
}
 
function closeOnboarding() {
  document.getElementById('onboarding-overlay').style.display = 'none';
  localStorage.setItem('onboarding_done_v1', '1');
}
 
 
/* ────────────────────────────────────────────────────
   FEATURE 3 — DELETE ACCOUNT
──────────────────────────────────────────────────────*/
async function deleteAccount() {
  if (!confirm('⚠️ האם אתה בטוח?\n\nפעולה זו תמחק את כל ההיסטוריה הפיננסית שלך לצמיתות.')) return;
  if (!confirm('אישור סופי — כל הנתונים יימחקו ולא ניתן לשחזרם. להמשיך?')) return;
  showLoader('מוחק נתונים...');
  try {
    await db.from('monthly_records').delete().eq('user_id', currentUser.id);
    await db.from('categories').delete().eq('user_id', currentUser.id);
    localStorage.removeItem('onboarding_done_v1');
    localStorage.removeItem('ret_settings_v1');
    localStorage.removeItem('display_name_v1');
  } catch(e) { console.error(e); }
  hideLoader();
  closeSettings();
  showToast('✅ כל הנתונים נמחקו');
  await db.auth.signOut();
}

/* ── SETTINGS ───────────────────────────────────────── */
function showSettings(tab) {
  renderCategoriesList();
  document.getElementById('settings-modal').style.display='flex';
  switchSettingsTab(tab || 'categories');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) toggle.checked = isDark;
  setTimeout(renderPasswordSection, 0);
  setTimeout(renderPartnerSection, 0);
  setTimeout(renderMortgageInstSettings, 0);
}
function closeSettings() { document.getElementById('settings-modal').style.display='none'; }
function closeSettingsOutside(e) { if(e.target.id==='settings-modal') closeSettings(); }

function switchSettingsTab(tab) {
  ['categories','account'].forEach(t => {
    document.getElementById(`settings-panel-${t}`).style.display = t===tab ? 'flex' : 'none';
    const btn = document.getElementById(`stab-${t}`);
    if (btn) btn.classList.toggle('active', t===tab);
  });
}

/* ── CATEGORIES LIST with drag & edit ───────────────── */
let dragSrcIndex = null;

function renderCategoriesList() {
  const list = document.getElementById('categories-list');
  if (!list) return;
  list.innerHTML = categories.map((cat, idx) => {
    const inst = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const logo = inst ? `<img src="${logoUrl(inst.domain)}" alt="" class="cat-list-logo" onerror="this.style.display='none'"/>` : '';
    return `
    <div class="cat-item" draggable="true" data-idx="${idx}" data-id="${cat.id}"
         ondragstart="catDragStart(event,${idx})"
         ondragover="catDragOver(event)"
         ondrop="catDrop(event,${idx})"
         ondragend="catDragEnd(event)">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
        <span class="drag-handle" title="גרור לשינוי סדר">⠿</span>
        ${logo}
        <div style="min-width:0;flex:1">
          <div style="font-size:.875rem;font-weight:600;color:var(--ink)">${cat.label}</div>
          <div style="font-size:.72rem;color:var(--ink-4)">${cat.key}${inst ? ` · <span style="color:var(--green)">${inst.name}</span>` : ''}</div>
        </div>
      </div>
      <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
        <button class="cat-action-btn" onclick="openCatEdit('${cat.id}')" title="עריכה">${ICONS_JS.edit}</button>
        <button class="cat-action-btn" onclick="openInstModal('${cat.id}')" title="גוף מנהל">${ICONS_JS.bank}</button>
        <button class="cat-delete" onclick="deleteCategory('${cat.id}')" title="מחק">${ICONS_JS.x}</button>
      </div>
    </div>
    <div class="cat-edit-panel" id="cat-edit-${cat.id}" style="display:none;">
      <div class="cat-edit-grid">
        <input type="text" id="cat-edit-label-${cat.id}" value="${cat.label}" placeholder="שם בעברית" class="form-input" style="direction:rtl;text-align:right"/>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button class="cat-edit-save-btn" onclick="saveCatEdit('${cat.id}')">${ICONS_JS.check} שמור</button>
        <button class="cat-edit-cancel-btn" onclick="closeCatEdit('${cat.id}')">ביטול</button>
      </div>
    </div>`;
  }).join('');
}

function openCatEdit(id) {
  document.querySelectorAll('.cat-edit-panel').forEach(p => p.style.display='none');
  const panel = document.getElementById(`cat-edit-${id}`);
  if (panel) { panel.style.display='block'; panel.querySelector('input').focus(); }
}

function closeCatEdit(id) {
  const panel = document.getElementById(`cat-edit-${id}`);
  if (panel) panel.style.display='none';
}

async function saveCatEdit(id) {
  const label = document.getElementById(`cat-edit-label-${id}`)?.value.trim();
  if (!label) return showToast('⚠️ שם לא יכול להיות ריק');
  showLoader('שומר...');
  await db.from('categories').update({ label }).eq('id',id).eq('user_id',currentUser.id);
  await loadCategories();
  hideLoader();
  renderCategoriesList();
  renderCurrentReport();
  showToast('✅ קטגוריה עודכנה');
}

/* ── MORTGAGE INSTITUTION IN SETTINGS ───────────────── */
function renderMortgageInstSettings() {
  const section = document.getElementById('mortgage-inst-section');
  if (!section) return;
  // Read from localStorage, fallback to Supabase user_metadata
  const savedId = localStorage.getItem('mortgage_inst_v1')
    || currentUser?.user_metadata?.mortgage_inst
    || null;
  // Keep localStorage in sync
  if (savedId && !localStorage.getItem('mortgage_inst_v1')) {
    localStorage.setItem('mortgage_inst_v1', savedId);
  }
  const inst = savedId ? getInstitution(savedId) : null;
  section.innerHTML = inst
    ? `<div class="cat-item" style="margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px;flex:1">
          <img src="${logoUrl(inst.domain)}" alt="" class="cat-list-logo" onerror="this.style.display='none'"/>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--ink)">${inst.name}</div>
            <div style="font-size:.72rem;color:var(--green)">גוף מנהל משכנתא</div>
          </div>
        </div>
        <div style="display:flex;gap:5px">
          <button class="cat-action-btn" onclick="openMortgageInstFromSettings()" title="שנה">${ICONS_JS.edit}</button>
          <button class="cat-action-btn" onclick="clearMortgageInst()" title="הסר" style="color:var(--red)">${ICONS_JS.x}</button>
        </div>
      </div>`
    : `<button class="mortgage-inst-btn" onclick="openMortgageInstFromSettings()" style="margin-top:4px">
        ${ICONS_JS.bank} בחר גוף מנהל משכנתא
      </button>`;
}

function openMortgageInstFromSettings() {
  instTargetMode  = 'mortgage_settings';
  instTargetCatId = null;
  renderInstGrid(INSTITUTIONS.filter(i => i.type === 'bank'));
  document.getElementById('inst-modal').style.display = 'flex';
  document.getElementById('inst-search').value = '';
}

async function clearMortgageInst() {
  localStorage.removeItem('mortgage_inst_v1');
  if (currentUser) await db.auth.updateUser({ data: { mortgage_inst: null } });
  renderMortgageInstSettings();
  renderCurrentReport();
  showToast('גוף מנהל משכנתא הוסר');
}

/* ── DRAG & DROP reorder ─────────────────────────────── */
function catDragStart(e, idx) {
  dragSrcIndex = idx;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function catDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('drag-over'));
  e.currentTarget.classList.add('drag-over');
}

function catDrop(e, idx) {
  e.preventDefault();
  if (dragSrcIndex === null || dragSrcIndex === idx) return;
  const moved = categories.splice(dragSrcIndex, 1)[0];
  categories.splice(idx, 0, moved);
  saveCategoryOrder();
  renderCategoriesList();
}

function catDragEnd(e) {
  dragSrcIndex = null;
  document.querySelectorAll('.cat-item').forEach(el => {
    el.classList.remove('dragging','drag-over');
  });
}

async function saveCategoryOrder() {
  const updates = categories.map((cat, i) =>
    db.from('categories').update({ order_index: i }).eq('id', cat.id).eq('user_id', currentUser.id)
  );
  await Promise.all(updates);
  showToast('✅ סדר נשמר');
}

/* ── TAB SWITCH ─────────────────────────────────────── */
function switchTab(name, btn) {
  ['current','history','retirement','portfolio','annual'].forEach(t=>{
    const p=document.getElementById(`tab-${t}`); if(p) p.style.display=t===name?'block':'none';
  });
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${name}"]`).forEach(b=>b.classList.add('active'));
  const titles={current:'דוח נוכחי',history:'היסטוריה',retirement:'תכנון פרישה',portfolio:'תיק השקעות',annual:'סיכום שנתי'};
  const te=document.getElementById('topbar-title'); if(te) te.textContent=titles[name]||'';
  if(name==='history')    renderHistoryTab();
  if(name==='retirement') { loadRetirementSettings(); renderRetirement(); }
  if(name==='portfolio')  renderPortfolioTab();
  if(name==='annual')     renderAnnualTab();
}


/* ══ TOTAL ASSETS PIE BREAKDOWN ══════════════════════ */
function showTotalAssetsBreakdown() {
  if (!records.length) return;
  const latest = records[records.length - 1];
  const calc   = calcRecord(latest);
  const colors = ['#0e9e7e','#4f8ef7','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b','#22c55e'];
  const items  = categories.map((cat,i) => ({ label:cat.label, val:calc[cat.key]||0, color:colors[i%colors.length] }))
    .filter(d => d.val > 0).sort((a,b) => b.val - a.val);
  const total  = items.reduce((s,d) => s+d.val, 0);
  const r=70, cx=90, cy=90, sw=28, circ=2*Math.PI*r;
  let off=0;
  const arcs = items.map(d => {
    const dash = (d.val/total)*circ;
    const arc  = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${sw}" stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})" opacity=".9"/>`;
    off += dash; return arc;
  }).join('');
  const legend = items.map(d => {
    const pct = (d.val/total*100).toFixed(1);
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);gap:8px">
      <div style="display:flex;align-items:center;gap:8px;min-width:0">
        <div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0"></div>
        <span style="font-size:.82rem;color:var(--ink-2)">${d.label}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span style="font-family:var(--mono);font-size:.8rem;color:var(--ink)">${fmt(d.val)}</span>
        <span style="font-size:.72rem;color:var(--ink-4);min-width:36px;text-align:left">${pct}%</span>
      </div>
    </div>`;
  }).join('');
  openInfoModal('פירוט סה"כ נכסים', `
    <div style="display:flex;justify-content:center;margin-bottom:16px">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${sw}"/>
        ${arcs}
        <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="var(--mono)" font-size="13" font-weight="800" fill="var(--ink)">${fmt(total)}</text>
        <text x="${cx}" y="${cy+12}" text-anchor="middle" font-family="var(--font)" font-size="10" fill="var(--ink-4)">סה"כ</text>
      </svg>
    </div>${legend}`);
}

/* ══ LIQUID ASSETS INFO ═══════════════════════════════ */
function showLiquidInfo() {
  if (!records.length) return;
  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const liquidKeys = ['cash','currentAcc','savingsFund','deposit'];
  const liquid    = categories.filter(c => liquidKeys.includes(c.key)).reduce((s,c) => s+(calc[c.key]||0), 0);
  const pct       = calc.totalAssets ? (liquid/calc.totalAssets*100).toFixed(1) : '0';
  const liqRows   = categories.filter(c => liquidKeys.includes(c.key) && (calc[c.key]||0)>0).map(c =>
    `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <span style="color:var(--ink-2)">${c.label}</span>
      <span style="font-family:var(--mono);font-weight:600;color:var(--green)">${fmt(calc[c.key]||0)}</span>
    </div>`).join('');
  const nonLiqRows = categories.filter(c => !liquidKeys.includes(c.key) && (calc[c.key]||0)>0).map(c =>
    `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <span style="color:var(--ink-2)">${c.label}</span>
      <span style="font-family:var(--mono);font-weight:600;color:var(--ink-4)">${fmt(calc[c.key]||0)}</span>
    </div>`).join('');
  const p         = parseFloat(pct);
  const statusColor = p >= 15 && p <= 40 ? 'var(--green)' : p < 15 ? 'var(--red)' : 'var(--amber)';
  const statusText  = p >= 15 && p <= 40 ? 'יחס נזילות תקין ✅' : p < 15 ? 'נזילות נמוכה מדי ⚠️' : 'נזילות גבוהה — כסף לא עובד ⚠️';
  openInfoModal('נכסים נזילים', `
    <div style="padding:12px;background:rgba(14,158,126,.1);border-radius:var(--r-xs);border:1.5px solid ${statusColor};margin-bottom:16px">
      <div style="font-size:1.1rem;font-weight:800;color:${statusColor};font-family:var(--font)">${pct}% נזיל</div>
      <div style="font-size:.8rem;color:${statusColor};margin-top:2px">${statusText}</div>
      <div style="font-size:.72rem;color:var(--ink-4);margin-top:4px">יחס אידיאלי: 15%–40% מהתיק</div>
    </div>
    <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-4);margin-bottom:8px">נכסים נזילים (ניתן למשיכה מיידית)</div>
    ${liqRows||'<div style="color:var(--ink-4);font-size:.875rem;padding:8px 0">אין</div>'}
    ${nonLiqRows?`<div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-4);margin:16px 0 8px">נכסים לא נזילים</div>${nonLiqRows}`:''}
    <p style="font-size:.72rem;color:var(--ink-4);margin-top:12px;line-height:1.6">* נזיל = ניתן למשיכה תוך ימים ספורים ללא קנס.</p>`);
}

/* ══ GENERIC INFO MODAL ═══════════════════════════════ */
function openInfoModal(title, bodyHtml) {
  document.getElementById('info-modal-existing')?.remove();
  const modal = document.createElement('div');
  modal.id = 'info-modal-existing';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--r-xl);width:100%;max-width:400px;max-height:85vh;overflow-y:auto;scrollbar-width:none;box-shadow:var(--shadow-lg);animation:fadeUp .22s ease">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--surface);z-index:1">
        <span style="font-size:.95rem;font-weight:700;color:var(--ink)">${title}</span>
        <button onclick="document.getElementById('info-modal-existing').remove()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex">${ICONS_JS.x}</button>
      </div>
      <div style="padding:16px 20px 24px">${bodyHtml}</div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
}

/* ══ TAX BREAKDOWN MODAL ════════════════════════════ */
function showTaxBreakdown() {
  if (!records.length) return;
  const latest = records[records.length - 1];
  const calc   = calcRecord(latest);
  const { pensionTotal, tax, netAfterTax } = calcNetWorthAfterTax(calc);
  const nonPensionTotal = calc.totalAssets - pensionTotal;
  const pensionAfterTax = pensionTotal - tax;
  const pensionRows = categories.filter(isPensionCat).map(cat => {
    const val = calc[cat.key] || 0; if (!val) return '';
    return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <span style="color:var(--ink-2)">${cat.label}</span>
      <span style="font-family:var(--mono);font-weight:600;color:var(--ink)">${fmt(val)}</span></div>`;
  }).join('');
  const nonPensionRows = categories.filter(c => !isPensionCat(c)).map(cat => {
    const val = calc[cat.key] || 0; if (!val) return '';
    return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <span style="color:var(--ink-2)">${cat.label}</span>
      <span style="font-family:var(--mono);font-weight:600;color:var(--ink)">${fmt(val)}</span></div>`;
  }).join('');
  document.getElementById('tax-breakdown-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'tax-breakdown-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px';
  modal.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--r-xl);width:100%;max-width:400px;max-height:85vh;overflow-y:auto;scrollbar-width:none;box-shadow:var(--shadow-lg);animation:fadeUp .22s ease">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--surface);z-index:1">
        <span style="font-size:.95rem;font-weight:700;color:var(--ink)">פירוט שווי נקי אחרי מס</span>
        <button onclick="document.getElementById('tax-breakdown-modal').remove()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex">${ICONS_JS.x}</button>
      </div>
      <div style="padding:16px 20px">
        ${nonPensionRows?`<div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-4);margin-bottom:8px">נכסים נזילים (ללא מס)</div>${nonPensionRows}
        <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:.875rem;font-weight:700">
          <span>סה"כ נכסים נזילים</span><span style="font-family:var(--mono);color:var(--green)">${fmt(nonPensionTotal)}</span></div>`:''}
        ${pensionRows?`<div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-4);margin:16px 0 8px">פנסיה (חייבת במס 35%)</div>${pensionRows}
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.875rem">
          <span style="color:var(--ink-2)">סה"כ פנסיה (ברוטו)</span><span style="font-family:var(--mono);font-weight:600">${fmt(pensionTotal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.875rem">
          <span style="color:var(--ink-2)">מס 35%</span><span style="font-family:var(--mono);font-weight:600;color:var(--red)">− ${fmt(tax)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:.875rem;font-weight:700">
          <span>פנסיה נטו</span><span style="font-family:var(--mono)">${fmt(pensionAfterTax)}</span></div>`:''}
        <div style="margin-top:16px;padding:16px;background:var(--green-light,rgba(14,158,126,.12));border-radius:var(--r-xs);border:1.5px solid var(--green)">
          <div style="font-size:.78rem;color:var(--ink-3);margin-bottom:6px">סה"כ נכסים אחרי מס פנסיה</div>
          <div style="font-size:1.4rem;font-weight:800;color:${netAfterTax>=0?'var(--green)':'var(--red)'};font-family:var(--mono)">${fmt(netAfterTax)}</div>
          <div style="font-size:.72rem;color:var(--ink-3);margin-top:6px">נזיל ${fmt(nonPensionTotal)} + פנסיה נטו ${fmt(pensionAfterTax)}</div>
        </div>
        <p style="font-size:.72rem;color:var(--ink-4);margin-top:12px;line-height:1.6">* 35% מס על משיכה מוקדמת של פנסיה. מומלץ להתייעץ עם יועץ מס.</p>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
}

/* ══ PORTFOLIO TAB ════════════════════════════════════ */
function renderPortfolioTab() {
  const el = document.getElementById('portfolio-content');
  if (!el) return;
  if (!records.length) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-4)">אין נתונים</div>'; return; }

  const latest = records[records.length - 1];
  const calc   = calcRecord(latest);
  const total  = calc.totalAssets;

  // Assign each category to a bucket
  const liquidKeys  = ['cash','currentAcc'];
  const savingKeys  = ['deposit','savingsFund','hishtalmut'];
  const buckets = { liquid:0, savings:0, pension:0, invest:0 };
  const colors  = { liquid:'#0e9e7e', savings:'#4f8ef7', pension:'#f59e0b', invest:'#8b5cf6' };
  const labels  = { liquid:'נזיל', savings:'חיסכון', pension:'פנסיוני', invest:'השקעות' };

  categories.forEach(cat => {
    const val = calc[cat.key] || 0;
    if (!val) return;
    if (isPensionCat(cat))           buckets.pension += val;
    else if (liquidKeys.includes(cat.key))  buckets.liquid  += val;
    else if (savingKeys.includes(cat.key))  buckets.savings += val;
    else                                    buckets.invest  += val;
  });

  // Ideal allocation by age
  const userAge     = parseInt(document.getElementById('ret-current-age')?.value) || 35;
  const iPension    = Math.min(50, Math.max(20, userAge - 10));
  const iLiquid     = 15;
  const iSavings    = Math.min(30, Math.max(10, 60 - userAge));
  const iInvest     = Math.max(0, 100 - iPension - iLiquid - iSavings);
  const ideal       = { liquid:iLiquid, savings:iSavings, pension:iPension, invest:iInvest };

  // Donut SVG
  const r = 85, cx = 105, cy = 105, sw = 34, circ = 2*Math.PI*r;
  let off = 0;
  const arcs = Object.entries(buckets).map(([k,v]) => {
    if (!v) return '';
    const dash = (v/total) * circ;
    const arc  = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[k]}"
      stroke-width="${sw}" stroke-dasharray="${dash} ${circ-dash}"
      stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off += dash;
    return arc;
  }).join('');

  const catRows = Object.entries(buckets).map(([k,v]) => {
    if (!v) return '';
    const pct  = total ? (v/total*100).toFixed(1) : '0';
    const diff = parseFloat(pct) - ideal[k];
    const dClr = Math.abs(diff) <= 5 ? 'var(--green)' : 'var(--amber)';
    const dTxt = `${diff>0?'+':''}${diff.toFixed(1)}% מהאידיאלי (${ideal[k]}%)`;
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
      <div style="width:12px;height:12px;border-radius:50%;background:${colors[k]};flex-shrink:0"></div>
      <div style="flex:1">
        <div style="font-size:.875rem;font-weight:600;color:var(--ink)">${labels[k]}</div>
        <div style="font-size:.72rem;color:${dClr};margin-top:2px">${dTxt}</div>
      </div>
      <div style="text-align:left;margin-left:8px">
        <div style="font-family:var(--mono);font-weight:700;color:var(--ink)">${fmt(v)}</div>
        <div style="font-size:.72rem;color:var(--ink-4)">${pct}%</div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div class="section-header" style="margin-bottom:16px">פיזור תיק ההשקעות</div>
      <div style="display:flex;justify-content:center;margin-bottom:8px">
        <svg width="210" height="210" viewBox="0 0 210 210">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${sw}"/>
          ${arcs}
          <text x="${cx}" y="${cy-8}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">${fmt(total)}</text>
          <text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="10" fill="var(--ink-4)">סה"כ נכסים</text>
        </svg>
      </div>
      ${catRows}
    </div>
    <div class="card" style="padding:16px">
      <div style="font-size:.78rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">פיזור אידיאלי לגיל ${userAge}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Object.entries(ideal).map(([k,v])=>`
        <div style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--surface2);border-radius:99px">
          <div style="width:8px;height:8px;border-radius:50%;background:${colors[k]}"></div>
          <span style="font-size:.78rem;color:var(--ink-3)">${labels[k]}: </span>
          <span style="font-size:.78rem;font-weight:700;color:var(--ink)">${v}%</span>
        </div>`).join('')}
      </div>
      <p style="font-size:.72rem;color:var(--ink-4);margin-top:10px;line-height:1.6">* המלצה כללית בלבד — לא ייעוץ פיננסי. עדכן גילך בטאב תכנון פרישה לדיוק טוב יותר.</p>
    </div>`;
}

/* ══ ANNUAL SUMMARY TAB ══════════════════════════════ */
function renderAnnualTab() {
  const el = document.getElementById('annual-content');
  if (!el) return;
  if (!records.length) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-4)">אין נתונים</div>'; return; }

  const years = [...new Set(records.map(r => new Date(r.record_date).getFullYear()))].sort((a,b)=>b-a);
  const selectedYear = parseInt(el.dataset.year) || years[0];
  const yr = records.filter(r => new Date(r.record_date).getFullYear() === selectedYear)
    .sort((a,b) => new Date(a.record_date) - new Date(b.record_date));

  if (!yr.length) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-4)">אין נתונים לשנה זו</div>'; return; }

  const calcs   = yr.map(r => ({ r, c: calcRecord(r) }));
  const first   = calcs[0].c.totalAssets;
  const last    = calcs[calcs.length-1].c.totalAssets;
  const growth  = last - first;
  const gPct    = first ? (growth/first*100).toFixed(1) : '0';

  let bestIdx = -1, worstIdx = -1, bestDelta = -Infinity, worstDelta = Infinity;
  for (let i = 1; i < calcs.length; i++) {
    const d = calcs[i].c.totalAssets - calcs[i-1].c.totalAssets;
    if (d > bestDelta)  { bestDelta  = d; bestIdx  = i; }
    if (d < worstDelta) { worstDelta = d; worstIdx = i; }
  }

  const mName = d => new Date(d).toLocaleDateString('he-IL',{month:'long'});
  const monthAbbr = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];

  const monthGrid = monthAbbr.map((m,i) => {
    const entry = calcs.find(({r}) => new Date(r.record_date).getMonth() === i);
    if (!entry) return `<div style="padding:10px 6px;border-radius:8px;background:var(--surface2);opacity:.3;text-align:center">
      <div style="font-size:.72rem;font-family:var(--font);color:var(--ink-4)">${m}</div>
      <div style="font-size:.72rem;color:var(--ink-4);margin-top:2px">—</div></div>`;
    const idx = calcs.indexOf(entry);
    const isBest  = idx === bestIdx;
    const isWorst = idx === worstIdx && worstDelta < 0;
    let deltaHtml = '';
    if (idx > 0) {
      const d = calcs[idx].c.totalAssets - calcs[idx-1].c.totalAssets;
      const p = calcs[idx-1].c.totalAssets ? (d/calcs[idx-1].c.totalAssets*100).toFixed(1) : null;
      if (p) deltaHtml = `<div style="font-size:.62rem;color:${d>=0?'var(--green)':'var(--red)'}">${d>=0?'+':''}${p}%</div>`;
    }
    const border = isBest ? '1.5px solid var(--green)' : isWorst ? '1.5px solid var(--red)' : '1px solid var(--border)';
    return `<div style="padding:10px 6px;border-radius:8px;background:var(--surface2);border:${border};text-align:center">
      <div style="font-size:.72rem;font-family:var(--font);color:var(--ink-4)">${m}${isBest?' ⭐':isWorst?' 📉':''}</div>
      <div style="font-size:.72rem;font-family:var(--mono);font-weight:600;color:var(--ink);margin-top:3px">${(entry.c.totalAssets/1000).toFixed(0)}K</div>
      ${deltaHtml}</div>`;
  }).join('');

  const insights = [];
  if (growth > 0) insights.push(`📈 גדלת ב-${fmt(growth)} השנה — צמיחה של ${gPct}%`);
  else insights.push(`📉 ירידה של ${fmt(Math.abs(growth))} השנה`);
  if (bestIdx > 0)  insights.push(`⭐ החודש הטוב: ${mName(calcs[bestIdx].r.record_date)} (+${fmt(bestDelta)})`);
  if (worstIdx > 0 && worstDelta < 0) insights.push(`⚠️ החודש הקשה: ${mName(calcs[worstIdx].r.record_date)} (${fmt(worstDelta)})`);
  const avgM = calcs.length > 1 ? growth/(calcs.length-1) : 0;
  if (avgM > 0) insights.push(`📊 ממוצע חודשי: +${fmt(avgM)}`);
  if (yr.length < 6) insights.push(`💡 יש לך ${yr.length} חודשים מתועדים השנה בלבד`);

  // 🚀 Fastest growing category this year
  if (yr.length >= 2) {
    const firstCalc = calcRecord(yr[0]);
    const lastCalc  = calcRecord(yr[yr.length-1]);
    let fastestCat = null, fastestPct = -Infinity;
    let sleepyCat  = null, sleepyPct  = Infinity;
    categories.forEach(cat => {
      const vFirst = firstCalc[cat.key] || 0;
      const vLast  = lastCalc[cat.key]  || 0;
      if (vFirst <= 0 || vLast <= 0) return;
      const pct = (vLast - vFirst) / vFirst * 100;
      if (pct > fastestPct) { fastestPct = pct; fastestCat = cat; }
      if (Math.abs(pct) < Math.abs(sleepyPct)) { sleepyPct = pct; sleepyCat = cat; }
    });
    if (fastestCat && fastestPct > 0)
      insights.push(`🚀 הקטגוריה שצמחה הכי מהר: ${fastestCat.label} (+${fastestPct.toFixed(1)}%)`);
    if (sleepyCat && Math.abs(sleepyPct) < 2)
      insights.push(`😴 הקטגוריה הישנה ביותר: ${sleepyCat.label} — כמעט ללא שינוי (${sleepyPct >= 0 ? '+' : ''}${sleepyPct.toFixed(1)}%)`);
  }

  // 💰 Projection to milestone
  if (avgM > 0 && last > 0) {
    const milestones = [500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000];
    const nextMilestone = milestones.find(m => m > last);
    if (nextMilestone) {
      const monthsNeeded = Math.ceil((nextMilestone - last) / avgM);
      const targetDate   = new Date();
      targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
      const targetYear   = targetDate.getFullYear();
      const targetMonth  = targetDate.toLocaleDateString('he-IL', { month: 'long' });
      const milLabel     = nextMilestone >= 1000000 ? `${nextMilestone/1000000}M₪` : `${nextMilestone/1000}K₪`;
      insights.push(`💰 אם המגמה תמשך — תגיע ל-${milLabel} ב${targetMonth} ${targetYear} (${monthsNeeded} חודשים)`);
    }
  }

  const yearBtns = years.map(y=>`<button onclick="document.getElementById('annual-content').dataset.year='${y}';renderAnnualTab()"
    style="padding:6px 14px;border-radius:99px;border:1.5px solid ${y===selectedYear?'var(--green)':'var(--border)'};
    background:${y===selectedYear?'rgba(14,158,126,.15)':'transparent'};
    color:${y===selectedYear?'var(--green)':'var(--ink-3)'};
    font-family:var(--font);font-size:.82rem;font-weight:600;cursor:pointer">${y}</button>`).join('');

  el.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">${yearBtns}</div>
    <div class="card" style="margin-bottom:16px">
      <div class="section-header" style="margin-bottom:16px">סיכום ${selectedYear}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
        <div style="padding:14px;background:var(--surface2);border-radius:10px;text-align:center">
          <div style="font-size:.65rem;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">פתיחה</div>
          <div style="font-family:var(--mono);font-weight:700;color:var(--ink);font-size:.875rem">${fmt(first)}</div>
        </div>
        <div style="padding:14px;background:var(--surface2);border-radius:10px;text-align:center">
          <div style="font-size:.65rem;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">סגירה</div>
          <div style="font-family:var(--mono);font-weight:700;color:var(--ink);font-size:.875rem">${fmt(last)}</div>
        </div>
        <div style="padding:14px;background:var(--surface2);border-radius:10px;text-align:center;border:1.5px solid ${growth>=0?'var(--green)':'var(--red)'}">
          <div style="font-size:.65rem;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">גידול</div>
          <div style="font-family:var(--mono);font-weight:800;color:${growth>=0?'var(--green)':'var(--red)'};font-size:.875rem">${growth>=0?'+':''}${gPct}%</div>
        </div>
      </div>
      <div class="section-header" style="margin-bottom:10px;font-size:.7rem">12 חודשים</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${monthGrid}</div>
    </div>
    <div class="card" style="padding:16px">
      <div style="font-size:.78rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">תובנות</div>
      ${insights.map(i=>`<div style="padding:9px 0;border-bottom:1px solid var(--border);font-size:.875rem;color:var(--ink-2);line-height:1.5">${i}</div>`).join('')}
    </div>`;
}


function toggleAddForm() {
  const f=document.getElementById('add-form');
  if(!f.style.display||f.style.display==='none') openAddForm(null);
  else { f.style.display='none'; editMode=false; }
}

/* ── BLUR ───────────────────────────────────────────── */
const BLUR_SVG_OPEN   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const BLUR_SVG_CLOSED = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function toggleBlur() {
  blurActive=!blurActive;
  const svg = blurActive ? BLUR_SVG_CLOSED : BLUR_SVG_OPEN;
  const blurBtn = document.getElementById('blur-btn');
  if (blurBtn) blurBtn.innerHTML = blurActive ? ICONS_JS.eyeOff : ICONS_JS.eye;
  const mobileIcon = document.getElementById('blur-icon-mobile');
  if (mobileIcon) mobileIcon.innerHTML = svg;
  applyBlur();
}

function applyBlur() {
  document.querySelectorAll('.blur-text').forEach(el=>{
    el.style.filter=blurActive?'blur(6px)':'none';
    el.style.userSelect=blurActive?'none':'auto';
  });
}

/* ── UTILITIES ──────────────────────────────────────── */
const fmt = v => (v||0).toLocaleString('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0});

function showScreen(n) {
  document.getElementById('auth-screen').style.display=n==='auth'?'flex':'none';
  document.getElementById('app-screen').style.display =n==='app' ?'flex':'none';
}
function showLoader(t='טוען...') { document.getElementById('loader-text').textContent=t; document.getElementById('loader').style.display='flex'; }
function hideLoader() { document.getElementById('loader').style.display='none'; }
function showAuthMsg(msg,ok) {
  const el=document.getElementById('auth-message');
  el.textContent=msg; el.className='auth-message '+(ok?'success':'error'); el.style.display='block';
}
function hideAuthMsg() { document.getElementById('auth-message').style.display='none'; }
function showToast(msg) {
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}


/* ── RECOVERY HANDLER (runs before init) ────────────── */
async function handleRecoveryIfNeeded() {
  const rawHash   = window.location.hash.slice(1);
  const params    = new URLSearchParams(rawHash);
  const type      = params.get('type');
  const accessTok = params.get('access_token');
  const refreshTok= params.get('refresh_token');

  if (type !== 'recovery' || !accessTok || !refreshTok) return false;

  // Immediately clear hash so other tabs don't process it
  history.replaceState(null, '', window.location.pathname);

  // Show auth screen as background
  document.getElementById('loader').style.display      = 'none';
  document.getElementById('auth-screen').style.display = 'flex';

  // Set the session directly with the tokens
  const { data, error } = await db.auth.setSession({
    access_token:  accessTok,
    refresh_token: refreshTok
  });

  if (!error && data?.session) {
    currentUser = data.session.user;
    showPasswordResetModal();
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const wasRecovery = await handleRecoveryIfNeeded();
  if (!wasRecovery) init();
});

/* ══ SWIPE NAVIGATION (PWA / mobile) ════════════════ */
(function() {
  const TABS = ['current', 'history', 'retirement'];
  let touchStartX = 0, touchStartY = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    // Skip if any modal/overlay is open
    const modals = ['wizard-modal','settings-modal','inst-modal','cat-history-panel','backup-modal'];
    if (modals.some(id => {
      const el = document.getElementById(id);
      return el && el.style.display !== 'none' && el.style.display !== '';
    })) return;

    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only horizontal swipes (more horizontal than vertical, min 60px)
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    const activeTab = TABS.find(t => {
      const el = document.getElementById(`tab-${t}`);
      return el && el.style.display !== 'none';
    }) || 'current';
    const idx = TABS.indexOf(activeTab);

    // Swipe right → previous tab, swipe left → next tab
    let nextIdx = dx > 0 ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= TABS.length) return;

    const nextTab = TABS[nextIdx];
    const btn = document.querySelector(`[data-tab="${nextTab}"]`);
    switchTab(nextTab, btn);
  }, { passive: true });
})();

/* ── KEYBOARD SHORTCUTS ─────────────────────────────── */
document.addEventListener('keydown', e => {
  // Skip if typing in an input
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

  switch(e.key.toLowerCase()) {
    case 'n':
      if (document.getElementById('tab-history').style.display === 'none') {
        switchTab('history', document.querySelector('[data-tab="history"]'));
      }
      openAddForm(null);
      showToast('➕ הוספת חודש חדש');
      break;
    case 'h':
      switchTab('history', document.querySelector('[data-tab="history"]'));
      break;
    case 'd':
      switchTab('current', document.querySelector('[data-tab="current"]'));
      break;
    case 'r':
      switchTab('retirement', document.querySelector('[data-tab="retirement"]'));
      break;
    case 'b':
      toggleBlur();
      break;
    case 'escape':
      const addForm = document.getElementById('add-form');
      if (addForm && addForm.style.display !== 'none') {
        addForm.style.display = 'none'; editMode = false;
      }
      if (document.getElementById('settings-modal').style.display    !== 'none') closeSettings();
      if (document.getElementById('inst-modal').style.display        !== 'none') closeInstModal();
      if (document.getElementById('cat-history-panel')?.style.display !== 'none') closeCatHistory();
      if (document.getElementById('shortcuts-panel')?.classList.contains('open')) closeShortcutsPanel();
      break;
    case '?':
      toggleShortcutsPanel();
      break;
  }
});


/* ══ KEYBOARD SHORTCUTS PANEL ════════════════════════ */
function toggleShortcutsPanel() {
  const p = document.getElementById('shortcuts-panel');
  if (!p) return;
  p.classList.contains('open') ? closeShortcutsPanel() : openShortcutsPanel();
}
function openShortcutsPanel() {
  document.getElementById('shortcuts-panel')?.classList.add('open');
}
function closeShortcutsPanel() {
  document.getElementById('shortcuts-panel')?.classList.remove('open');
}

/* ══ CATEGORY HISTORY PANEL ══════════════════════════ */
function openCatHistory(catKey, catLabel) {
  const panel = document.getElementById('cat-history-panel');
  const title = document.getElementById('cat-history-title');
  const body  = document.getElementById('cat-history-body');
  if (!panel) return;

  title.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> ${catLabel} — 12 חודשים אחרונים`;

  // Build last 12 month entries
  const sorted = [...records].sort((a,b) => new Date(a.record_date)-new Date(b.record_date));
  const last12 = sorted.slice(-13);

  const isMortgage = catKey === '_mortgage';

  if (last12.length < 2) {
    body.innerHTML = '<div style="text-align:center;color:var(--ink-4);font-size:.875rem;padding:24px 0">אין מספיק נתונים היסטוריים</div>';
    panel.style.display = 'flex';
    return;
  }

  let rows = '';
  for (let i = last12.length - 1; i >= 1; i--) {
    const cur  = last12[i];
    const prev = last12[i - 1];
    const curVal  = isMortgage ? (cur.mortgage_balance  || 0) : ((cur.values  || {})[catKey] || 0);
    const prevVal = isMortgage ? (prev.mortgage_balance || 0) : ((prev.values || {})[catKey] || 0);
    const dateLabel = new Date(cur.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });

    let deltaHtml = '';
    if (prevVal > 0) {
      const delta = curVal - prevVal;
      const pct   = (delta / prevVal * 100).toFixed(1);
      // For mortgage: decrease in balance is good (green), increase is bad (red)
      const pos   = isMortgage ? delta <= 0 : delta >= 0;
      const sign  = delta >= 0 ? '+' : '';
      const color = pos ? 'var(--green)' : 'var(--red)';
      deltaHtml = `<span style="font-size:.78rem;font-weight:700;color:${color};font-family:var(--mono)">${sign}${pct}%</span>`;
    } else if (curVal > 0 && prevVal === 0) {
      deltaHtml = `<span style="font-size:.78rem;font-weight:700;color:var(--green);font-family:var(--font)">חדש</span>`;
    } else {
      deltaHtml = `<span style="font-size:.78rem;color:var(--ink-4)">—</span>`;
    }

    rows += `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <span style="color:var(--ink-3)">${dateLabel}</span>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-family:var(--mono);font-size:.82rem;color:var(--ink-2)">${fmt(curVal)}</span>
        ${deltaHtml}
      </div>
    </div>`;
  }

  body.innerHTML = rows;
  panel.style.display = 'flex';
}

function closeCatHistory() {
  const panel = document.getElementById('cat-history-panel');
  if (panel) panel.style.display = 'none';
}


/* ══ PARTNER / SHARED ACCOUNT ════════════════════════ */
async function renderPartnerSection() {
  const section = document.getElementById('partner-section');
  if (!section || !currentUser) return;

  const isOwner   = !!(currentUser.user_metadata?.partner_email);
  const accepted  = !!(currentUser.user_metadata?.accepted_share_from);
  const declined  = !!(currentUser.user_metadata?.declined_share);
  const partnerEmail = currentUser.user_metadata?.partner_email || null;

  if (isOwner) {
    // ── OWNER: can manage sharing ──
    section.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);margin-bottom:10px">'
      + '<div><div style="font-size:.875rem;font-weight:600;color:var(--ink)">' + partnerEmail + '</div>'
      + '<div style="font-size:.75rem;color:var(--green);margin-top:2px">חשבון משותף פעיל</div></div>'
      + '<button onclick="removePartner()" style="padding:5px 12px;background:var(--red-light);color:var(--red);border:1.5px solid #fecaca;border-radius:var(--r-xs);font-family:var(--font);font-size:.78rem;font-weight:600;cursor:pointer">הסר</button>'
      + '</div>';
    return;
  }

  if (accepted) {
    let ownerName  = currentUser.user_metadata?.partner_owner_name  || '';
    let ownerEmail = currentUser.user_metadata?.partner_owner_email || '';
    if (!ownerName && !ownerEmail) {
      const { data: rows } = await db.from('categories')
        .select('label,icon').eq('key', '_share_invite').neq('user_id', currentUser.id).limit(1);
      if (rows?.[0]) {
        // label holds name (if set after update), icon holds email
        const lbl = rows[0].label;
        ownerName  = (lbl && lbl !== '_share_invite') ? lbl : '';
        ownerEmail = rows[0].icon && rows[0].icon !== '_share' ? rows[0].icon : '';
      }
    }
    const display = ownerName || ownerEmail || 'בעל החשבון';
    section.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--green-light,rgba(14,158,126,.12));border:1.5px solid var(--green);border-radius:var(--r-xs);margin-bottom:10px">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
      + '<div style="flex:1">'
      + `<div style="font-size:.875rem;font-weight:600;color:var(--ink)">מחובר לתיק של ${display}</div>`
      + '<div style="font-size:.75rem;color:var(--ink-3);margin-top:2px">רק בעל החשבון יכול לנהל את השיתוף.</div>'
      + '</div>'
      + '</div>';
    return;
  }

  // ── Check for explicit invite row written by owner ──
  const { data: inviteRows } = await db.from('categories')
    .select('user_id').eq('key', '_share_invite').neq('user_id', currentUser.id).limit(1);
  const hasPendingInvite = !!(inviteRows && inviteRows.length > 0);

  if (hasPendingInvite && !declined) {
    // ── PENDING INVITATION ──
    section.innerHTML =
      '<div style="padding:12px;background:var(--amber-light,#fffbeb);border:1.5px solid #fcd34d;border-radius:var(--r-xs);margin-bottom:10px">'
      + '<div style="font-size:.875rem;font-weight:700;color:#92400e;margin-bottom:4px">📩 הוזמנת לצפייה בתיק משותף</div>'
      + '<div style="font-size:.78rem;color:#78350f;margin-bottom:12px">מישהו שיתף איתך את התיק הפיננסי שלו. האם ברצונך לקבל גישה?</div>'
      + '<div style="display:flex;gap:8px">'
      + '<button onclick="acceptShare()" style="flex:1;padding:7px 0;background:var(--green);color:#fff;border:none;border-radius:var(--r-xs);font-family:var(--font);font-size:.82rem;font-weight:700;cursor:pointer">✅ אשר גישה</button>'
      + '<button onclick="declineShare()" style="flex:1;padding:7px 0;background:var(--red-light);color:var(--red);border:1.5px solid #fecaca;border-radius:var(--r-xs);font-family:var(--font);font-size:.82rem;font-weight:600;cursor:pointer">❌ דחה</button>'
      + '</div>'
      + '</div>';
    return;
  }

  // ── NO CONNECTION: show add form ──
  section.innerHTML =
    '<div style="display:flex;gap:8px;margin-top:8px">'
    + '<input type="email" id="partner-email-input" placeholder="אימייל בן/בת הזוג" class="form-input" style="flex:1;direction:ltr;text-align:right"/>'
    + '<button onclick="addPartner()" class="display-name-save-btn">הוסף</button>'
    + '</div>'
    + '<p class="settings-hint" style="margin-top:8px">בן/בת הזוג יצטרכו להירשם עם אותו אימייל</p>';
}

async function acceptShare() {
  showLoader('מאשר...');
  const { data: inviteRows } = await db.from('categories')
    .select('user_id,label,icon').eq('key', '_share_invite').neq('user_id', currentUser.id).limit(1);
  const invite      = inviteRows?.[0];
  const ownerUserId = invite?.user_id || 'shared';
  const ownerName   = invite?.label   || '';
  const ownerEmail  = invite?.icon    || '';
  await db.auth.updateUser({ data: {
    accepted_share_from: ownerUserId,
    partner_owner_name:  ownerName,
    partner_owner_email: ownerEmail,
    declined_share: null
  }});
  const res = await db.auth.getUser(); currentUser = res.data.user;
  hideLoader();
  closeSettings();
  await loadApp();
  showToast('✅ גישה אושרה — אתה רואה את התיק המשותף');
}

async function declineShare() {
  if (!confirm('לדחות את הגישה לתיק המשותף?')) return;
  showLoader('דוחה...');
  await db.auth.updateUser({ data: { declined_share: true, accepted_share_from: null } });
  const res = await db.auth.getUser(); currentUser = res.data.user;
  hideLoader();
  renderPartnerSection();
  showToast('הגישה נדחתה');
}

async function addPartner() {
  const inp = document.getElementById('partner-email-input');
  const email = inp ? inp.value.trim() : '';
  if (!email) return showToast('יש להזין אימייל');
  if (email === currentUser.email) return showToast('לא ניתן להוסיף את עצמך');
  showLoader('שומר...');
  const { error } = await db.auth.updateUser({ data: { partner_email: email } });
  if (error) { hideLoader(); return showToast('שגיאה: ' + error.message); }
  // Write invite row — include owner name+email so viewer can display it
  const ownerName  = currentUser.user_metadata?.full_name || currentUser.email;
  await db.from('categories').upsert({
    user_id: currentUser.id, key: '_share_invite', label: ownerName,
    icon: currentUser.email, order_index: 9999
  }, { onConflict: 'user_id,key' });
  hideLoader();
  const res = await db.auth.getUser();
  currentUser = res.data.user;
  renderPartnerSection();
  showToast('חשבון משותף הוגדר');
}

async function removePartner() {
  if (!confirm('להסיר את החשבון המשותף?')) return;
  showLoader('מסיר...');
  // Delete the explicit invite row — this is what the viewer checks
  await db.from('categories').delete().eq('user_id', currentUser.id).eq('key', '_share_invite');
  await db.auth.updateUser({ data: { partner_email: null } });
  hideLoader();
  const res = await db.auth.getUser();
  currentUser = res.data.user;
  renderPartnerSection();
  showToast('החשבון המשותף הוסר');
}

/* ══ BACKUP & RESTORE ════════════════════════════════ */
async function exportBackup() {
  if (!currentUser) return;
  showLoader('מכין גיבוי...');
  const { cats, recs } = await gatherBackupData();
  hideLoader();
  const backup = buildBackupObject(cats, recs);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `finance-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('גיבוי הורד בהצלחה');
  localStorage.setItem('last_backup_v1', Date.now().toString());
}

function triggerRestoreUpload() {
  document.getElementById('restore-file-input').click();
}

async function handleRestoreFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.version || !backup.categories || !backup.records) {
        return showToast('קובץ גיבוי לא תקין');
      }
      if (!confirm(`שחזור גיבוי מ-${backup.exported_at?.slice(0,10) || 'לא ידוע'}

פעולה זו תחליף את כל הנתונים הקיימים. להמשיך?`)) {
        input.value = ''; return;
      }
      showLoader('משחזר נתונים...');
      // Delete existing
      await db.from('monthly_records').delete().eq('user_id', currentUser.id);
      await db.from('categories').delete().eq('user_id', currentUser.id);
      // Re-insert with current user_id
      const cats = backup.categories.map(c => ({ ...c, id: undefined, user_id: currentUser.id }));
      const recs = backup.records.map(r   => ({ ...r, id: undefined, user_id: currentUser.id }));
      if (cats.length) await db.from('categories').insert(cats);
      if (recs.length) await db.from('monthly_records').insert(recs);
      await loadCategories();
      await loadRecords();
      renderCurrentReport();
      hideLoader();
      showToast('הנתונים שוחזרו בהצלחה');
      input.value = '';
      closeSettings();
    } catch(err) {
      hideLoader();
      showToast('שגיאה בקריאת הקובץ');
      input.value = '';
    }
  };
  reader.readAsText(file);
}

/* ══ AUTO BACKUP (monthly modal) ════════════════════════ */
function checkAutoBackup() {
  if (!localStorage.getItem('last_backup_v1')) {
    localStorage.setItem('last_backup_v1', Date.now().toString());
    return;
  }
  const last = parseInt(localStorage.getItem('last_backup_v1'));
  const days  = (Date.now() - last) / (1000 * 60 * 60 * 24);
  if (days >= 30) {
    setTimeout(() => showBackupModal(), 2500);
  }
}

function showBackupModal() {
  const m = document.getElementById('backup-modal');
  if (m) m.style.display = 'flex';
}

function closeBackupModal() {
  const m = document.getElementById('backup-modal');
  if (m) m.style.display = 'none';
  localStorage.setItem('last_backup_v1', Date.now().toString());
}

async function backupAndClose() {
  await exportBackup();
  closeBackupModal();
}

async function gatherBackupData() {
  const { data: cats } = await db.from('categories').select('*').eq('user_id', currentUser.id);
  const { data: recs } = await db.from('monthly_records').select('*').eq('user_id', currentUser.id);
  return { cats: cats || [], recs: recs || [] };
}

function buildBackupObject(cats, recs) {
  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    user_email: currentUser.email,
    categories: cats,
    records: recs
  };
}


/* ══ DARK MODE ═══════════════════════════════════════ */
function applyDarkMode(on) {
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) toggle.checked = on;
  const themeColor = on ? '#0d0f14' : '#ffffff';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
  meta.content = themeColor;
}

async function toggleDarkMode(on) {
  localStorage.setItem('dark_mode_v1', on ? '1' : '0');
  applyDarkMode(on);
  // Save to Supabase user_metadata so it syncs across devices
  if (currentUser) {
    await db.auth.updateUser({ data: { dark_mode: on ? '1' : '0' } });
  }
}

function initDarkMode() {
  // On login screen we only have localStorage — best effort
  const saved = localStorage.getItem('dark_mode_v1');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const on = saved !== null ? saved === '1' : prefersDark;
  applyDarkMode(on);
}

function syncDarkModeFromCloud() {
  // Called after login — pull preference from Supabase and override localStorage
  if (!currentUser) return;
  const cloudPref = currentUser.user_metadata?.dark_mode;
  if (cloudPref !== undefined) {
    const on = cloudPref === '1';
    localStorage.setItem('dark_mode_v1', cloudPref);
    applyDarkMode(on);
  }
}

/* ══ COUNT-UP ANIMATION ══════════════════════════════ */
function countUp(el, target, duration = 900) {
  const start     = performance.now();
  const isNeg     = target < 0;
  const absTarget = Math.abs(target);

  // easeOutExpo
  function ease(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current  = Math.round(ease(progress) * absTarget);
    const formatted = (isNeg ? -current : current)
      .toLocaleString('he-IL', { style:'currency', currency:'ILS', maximumFractionDigits:0 });
    el.textContent = formatted;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('he-IL',
      { style:'currency', currency:'ILS', maximumFractionDigits:0 });
  }

  requestAnimationFrame(tick);
}

function animateCountUps() {
  // Wait a frame so elements are in the DOM
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseFloat(el.dataset.countup);
      if (!isNaN(target)) countUp(el, target);
    });
  });
}
