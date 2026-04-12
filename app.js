/* ── SUPABASE ──────────────────────────────────────── */
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── ISRAELI INSTITUTIONS ──────────────────────────── */
const INSTITUTIONS = [
  /* Banks */
  { id:'discount',   name:'בנק דיסקונט',        domain:'https://www.discountbank.co.il/',          type:'bank' },
  { id:'hapoalim',   name:'בנק הפועלים',        domain:'bankhapoalim.co.il',                       type:'bank' },
  { id:'igud',       name:'בנק יהב',            domain:'bank-yahav.co.il',                         type:'bank' },
  { id:'jerusalem',  name:'בנק ירושלים',        domain:'https://www.bankjerusalem.co.il/',         type:'bank' },
  { id:'leumi',      name:'בנק לאומי',          domain:'https://www.leumi.co.il/he',               type:'bank' },
  { id:'onezero',    name:'ONE ZERO',           domain:'https://www.onezerobank.com/',             type:'bank' },
  { id:'mizrahi',    name:'מזרחי טפחות',        domain:'https://www.mizrahi-tefahot.co.il/',       type:'bank'},
  { id:'marcantil',  name:'בנק מרכנטיל',        domain:'https://www.mercantile.co.il/',            type:'bank'},
  { id:'fibi',       name:'הבינלאומי',          domain:'https://www.fibi.co.il/private/',          type:'bank' },
  { id:'esh',        name:'בנק אש',             domain:'https://esh.com/',                         type:'bank' },
  /* Insurance / Pension */
  { id:'migdal',     name:'מגדל',               domain:'migdal.co.il',                             type:'pension' },
  { id:'harel',      name:'הראל',               domain:'harel.co.il',                              type:'pension' },
  { id:'menora',     name:'מנורה מבטחים',       domain:'https://www.menoramivt.co.il/',            type:'pension' },
  { id:'phoenix',    name:'הפניקס',             domain:'fnx.co.il',                                type:'pension' },
  { id:'clal',       name:'כלל ביטוח',          domain:'https://www.clalbit.co.il/',               type:'pension' },
  { id:'ayalon',     name:'איילון',             domain:'https://www.ayalon-ins.co.il/',            type:'pension' },
  /* Investment / Savings */
  { id:'meitav',     name:'מיטב',               domain:'meitav.co.il',                             type:'invest' },
  { id:'psagot',     name:'פסגות',              domain:'psagot.co.il',                             type:'invest' },
  { id:'altshuler',  name:'אלטשולר שחם',        domain:'https://www.as-invest.co.il',              type:'invest'},
  { id:'moreinfo',   name:'מור',                domain:'mor.co.il',                                type:'invest' },
  { id:'analyst',    name:'אנליסט',             domain:'https://www.analyst.co.il/',               type:'invest' },
  { id:'ibi',        name:'IBI',                domain:'ibi.co.il',                                type:'invest' },
  { id:'iek',        name:'ילין לפידות',        domain:'https://www.yl-invest.co.il/',             type:'invest' },
  { id:'inter',      name:'אינטראקטיב ישראל',   domain:'https://www.inter-il.com/client-portal/',  type:'invest' },
  /* Savings funds */
  { id:'worker',     name:'קרן הגמל לעובד',     domain:'hishtalmut.co.il',                         type:'savings'},
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
let viewMode      = 'grid'; // 'grid' | 'list'
let navStyle      = 'floating'; // 'floating' | 'classic'
let currentRecordIndex = -1; // -1 = latest

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
  syncViewModeFromCloud();
  syncNavStyleFromCloud();
  initColorTheme();
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
  const av2 = document.getElementById('topbar-avatar-char');
  if (av2) av2.textContent = (displayName[0] || '?').toUpperCase();

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
  const u = document.getElementById('reset-username');
  if (u && currentUser?.email) u.value = currentUser.email;
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
  // Legacy select (for other uses) - keep for compatibility
  const sel = document.getElementById('new-cat-institution-legacy');
  if (sel) {
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
  renderInstDropdownList();
}

function renderInstDropdownList(filter = '') {
  const list = document.getElementById('inst-dropdown-list');
  if (!list) return;

  // Load custom institutions from Supabase user_metadata
  const customInsts = JSON.parse(currentUser?.user_metadata?.custom_institutions || '[]');
  const allInsts = [...INSTITUTIONS, ...customInsts];

  const groups = { bank:'בנקים', pension:'פנסיה וביטוח', invest:'השקעות', savings:'חסכון' };
  let html = `<div onclick="selectInstDropdown('','')" style="padding:9px 14px;font-size:.82rem;color:var(--ink-4);cursor:pointer;border-bottom:1px solid var(--border)"
    >ללא גוף מנהל</div>`;

  Object.entries(groups).forEach(([type, label]) => {
    const items = allInsts.filter(i => i.type === type && (!filter || i.name.includes(filter)));
    if (!items.length) return;
    html += `<div style="padding:5px 14px;font-size:.68rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;background:var(--surface2);border-bottom:1px solid var(--border)">${label}</div>`;
    items.forEach(inst => {
      const isCustom = inst.id.startsWith('custom_');
      const logo = `<img src="${logoUrl(inst.domain)}" width="16" height="16" style="border-radius:3px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'"/>`;
      const delBtn = isCustom ? `<button data-inst-id="${inst.id}" data-inst-name="${inst.name.replace(/"/g,'&quot;')}"
        onclick="event.stopPropagation();deleteCustomInst(this.dataset.instId,this.dataset.instName)"
        style="margin-right:auto;background:none;border:none;cursor:pointer;color:var(--ink-4);padding:2px;display:flex;flex-shrink:0"
        title="מחק">${ICONS_JS.x}</button>` : '';
      html += `<div data-inst-id="${inst.id}" data-inst-name="${inst.name.replace(/"/g,'&quot;')}"
        onclick="selectInstDropdown(this.dataset.instId,this.dataset.instName)"
        style="padding:9px 14px;font-size:.85rem;color:var(--ink);cursor:pointer;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border)"
        ${window.matchMedia('(hover: hover)').matches ? 'onmouseover="this.style.background=\'var(--surface2)\'" onmouseout="this.style.background=\'\'"' : ''}>${logo}${inst.name}${delBtn}</div>`;
    });
  });

  // Add custom institution button at bottom
  html += `<div onclick="showAddCustomInst()" style="padding:11px 14px;font-size:.85rem;color:var(--green);cursor:pointer;display:flex;align-items:center;gap:8px;border-top:1.5px solid var(--border)"
    ${window.matchMedia('(hover: hover)').matches ? 'onmouseover="this.style.background=\'var(--surface2)\'" onmouseout="this.style.background=\'\'"' : ''}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    הוסף גוף מנהל חדש
  </div>`;

  list.innerHTML = html;
}

function showAddCustomInst() {
  document.getElementById('inst-modal').style.display = 'none';
  document.getElementById('add-custom-inst-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'add-custom-inst-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '1002';
  modal.innerHTML = `
    <div class="modal-box" style="direction:rtl">
      <div class="chb-header">
        <div class="chb-title">${ICONS_JS.bank} הוסף גוף מנהל חדש</div>
        <button onclick="document.getElementById('add-custom-inst-modal').remove()" class="chb-close">${ICONS_JS.x}</button>
      </div>
      <div style="overflow-y:auto;-webkit-overflow-scrolling:touch;padding:20px 18px 8px;flex:1;display:flex;flex-direction:column;gap:16px">
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">שם הגוף המנהל</div>
          <input type="text" id="custom-inst-name" class="form-input" placeholder="למשל: בית השקעות XYZ" style="direction:rtl;text-align:right;width:100%"/>
        </div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">קטגוריה</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button type="button" class="cat-type-btn" data-insttype="bank"    onclick="selectInstType('bank')">בנקים</button>
            <button type="button" class="cat-type-btn" data-insttype="pension" onclick="selectInstType('pension')">פנסיה וביטוח</button>
            <button type="button" class="cat-type-btn" data-insttype="invest"  onclick="selectInstType('invest')">השקעות</button>
            <button type="button" class="cat-type-btn" data-insttype="savings" onclick="selectInstType('savings')">חסכון</button>
          </div>
          <input type="hidden" id="custom-inst-type" value=""/>
        </div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">כתובת אתר <span style="font-weight:400;color:var(--ink-4)">(לצורך לוגו)</span></div>
          <input type="text" id="custom-inst-domain" class="form-input" placeholder="example.co.il" style="direction:ltr;text-align:left;width:100%" oninput="previewCustomInstLogo()"/>
        </div>
        <div id="custom-inst-logo-preview" style="display:none;align-items:center;gap:10px;padding:10px;background:var(--surface2);border-radius:var(--r-xs)">
          <img id="custom-inst-logo-img" width="32" height="32" style="border-radius:6px;object-fit:contain"/>
          <span id="custom-inst-logo-label" style="font-size:.82rem;color:var(--ink-3)">תצוגה מקדימה</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;padding:14px 18px 18px;border-top:1px solid var(--border);flex-shrink:0">
        <button class="cat-edit-save-btn" style="flex:1" onclick="saveCustomInst()">${ICONS_JS.plus} הוסף גוף מנהל</button>
        <button class="cat-edit-cancel-btn" style="min-width:72px" onclick="document.getElementById('add-custom-inst-modal').remove()">ביטול</button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('custom-inst-name')?.focus(), 50);
}
function selectInstType(type) {
  document.getElementById('custom-inst-type').value = type;
  document.querySelectorAll('[data-insttype]').forEach(b =>
    b.classList.toggle('selected', b.dataset.insttype === type));
}

function previewCustomInstLogo() {
  const domain = document.getElementById('custom-inst-domain')?.value.trim();
  const preview = document.getElementById('custom-inst-logo-preview');
  const img     = document.getElementById('custom-inst-logo-img');
  const label   = document.getElementById('custom-inst-logo-label');
  if (!domain) { preview.style.display = 'none'; return; }
  const url = logoUrl(domain);
  img.src = url;
  img.onerror = () => { label.textContent = 'לוגו לא נמצא — האתר ישמר בכל זאת'; };
  img.onload  = () => { label.textContent = 'לוגו נמצא ✅'; };
  preview.style.display = 'flex';
}

async function saveCustomInst() {
  const name   = document.getElementById('custom-inst-name')?.value.trim();
  const type   = document.getElementById('custom-inst-type')?.value;
  const domain = document.getElementById('custom-inst-domain')?.value.trim().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  if (!name) { showToast('נא להזין שם'); return; }
  if (!type) { showToast('נא לבחור קטגוריה'); return; }

  const id = 'custom_' + Date.now().toString(36);
  const existing = JSON.parse(currentUser?.user_metadata?.custom_institutions || '[]');
  existing.push({ id, name, domain: domain || '', type });

  const { data } = await db.auth.updateUser({ data: { custom_institutions: JSON.stringify(existing) } });
  if (data?.user) currentUser = data.user;

  document.getElementById('add-custom-inst-modal')?.remove();
  selectInstDropdown(id, name);
  showToast(`✅ ${name} נוסף`);
}

async function deleteCustomInst(id, name) {
  if (!confirm(`למחוק את ${name}?`)) return;
  const existing = JSON.parse(currentUser?.user_metadata?.custom_institutions || '[]');
  const updated  = existing.filter(i => i.id !== id);
  const { data } = await db.auth.updateUser({ data: { custom_institutions: JSON.stringify(updated) } });
  if (data?.user) currentUser = data.user;
  // Reset dropdown if this inst was selected
  if (document.getElementById('new-cat-institution').value === id) {
    selectInstDropdown('', '');
  }
  renderInstDropdownList(document.getElementById('inst-dropdown-search')?.value || '');
  showToast(`🗑️ ${name} נמחק`);
}

function filterInstDropdown() {
  const q = document.getElementById('inst-dropdown-search')?.value || '';
  renderInstDropdownList(q);
}

function toggleInstDropdown() {
  instTargetMode  = 'new_cat';
  instTargetCatId = null;
  const customInsts = JSON.parse(currentUser?.user_metadata?.custom_institutions || '[]');
  renderInstGrid([...INSTITUTIONS, ...customInsts]);
  document.getElementById('inst-modal').style.display = 'flex';
  document.getElementById('inst-search').value = '';
}

function selectInstDropdown(id, name) {
  document.getElementById('new-cat-institution').value = id;
  document.getElementById('inst-dropdown-label').textContent = name || 'גוף מנהל (אופציונלי)';
  document.getElementById('inst-dropdown-label').style.color = name ? 'var(--ink)' : 'var(--ink-4)';
}

function filterInstDropdown() {} // kept for compat

/* ══ CATEGORY PRESETS ════════════════════════════════ */
const CAT_PRESETS = [
  { group:'נזיל', items:[
    { label:'עובר ושב',              type:'liquid'  },
    { label:'מזומן',                 type:'liquid'  },
    { label:'חשבון חיסכון',          type:'liquid'  },
  ]},
  { group:'בנק וחיסכון', items:[
    { label:'פיקדון בנקאי',          type:'savings' },
    { label:'קרן כספית',             type:'savings' },
    { label:'תוכנית חיסכון',         type:'savings' },
    { label:'פיקדון מובנה',          type:'savings' },
  ]},
  { group:'פנסיוני וגמל', items:[
    { label:'קרן פנסיה',             type:'pension' },
    { label:'קרן השתלמות',           type:'pension' },
    { label:'קופת גמל לתגמולים',     type:'pension' },
    { label:'קופת גמל להשקעה',       type:'pension' },
    { label:'ביטוח מנהלים',          type:'pension' },
    { label:'פוליסת חיסכון',         type:'pension' },
    { label:'קופת גמל לפיצויים',     type:'pension' },
    { label:'חיסכון לכל ילד',        type:'pension' },
    { label:'קרן פנסיה ותיקה',       type:'pension' },
  ]},
  { group:'השקעות', items:[
    { label:'תיק מניות',             type:'invest'  },
    { label:'קרן נאמנות',            type:'invest'  },
    { label:'תעודת סל',              type:'invest'  },
    { label:'קרן נדלן',              type:'invest'  },
    { label:'נדלן להשקעה',           type:'invest'  },
    { label:'חשבון מסחר',            type:'invest'  },
    { label:'קריפטו',                type:'invest'  },
    { label:'אגח ומקמ',              type:'invest'  },
    { label:'השקעה עסקית',           type:'invest'  },
  ]},
  { group:'אחר', items:[
    { label:'קטגוריה מותאמת אישית',  type:'custom'  },
  ]},
];

function renderCatNameDropdownList(filter = '') {
  const list = document.getElementById('cat-name-dropdown-list');
  if (!list) return;
  const q = filter.trim().toLowerCase();
  let html = '';
  CAT_PRESETS.forEach(group => {
    const items = q ? group.items.filter(i => i.label.includes(filter) || i.label.toLowerCase().includes(q)) : group.items;
    if (!items.length) return;
    html += `<div style="padding:5px 14px;font-size:.68rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;background:var(--surface2);border-bottom:1px solid var(--border)">${group.group}</div>`;
    html += items.map(item => `
    <div data-label="${item.label.replace(/"/g,'&quot;')}" data-type="${item.type}"
      onclick="selectCatName(this.dataset.label,this.dataset.type)"
      style="padding:10px 16px;font-size:.875rem;color:var(--ink);cursor:pointer;border-bottom:1px solid var(--border);direction:rtl"
>
      ${item.label}
    </div>`).join('');
  });
  list.innerHTML = html || `<div style="padding:16px;text-align:center;color:var(--ink-4);font-size:.875rem">לא נמצאה קטגוריה</div>`;
}

function filterCatNameDropdown() {
  const q = document.getElementById('cat-name-search')?.value || '';
  renderCatNameDropdownList(q);
}

function toggleCatNameDropdown() {
  document.getElementById('cat-name-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'cat-name-modal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>${ICONS_JS.note} בחר סוג חשבון / נכס</h2>
        <button onclick="document.getElementById('cat-name-modal').remove()" class="modal-close">${ICONS_JS.x}</button>
      </div>
      <div class="modal-body" style="padding:12px 16px 32px;">
        <input type="text" id="cat-name-search" placeholder="חפש קטגוריה..." class="form-input"
          style="width:100%;margin-bottom:12px;direction:rtl;text-align:right"
          oninput="filterCatNameModal(this.value)"/>
        <div id="cat-name-modal-list"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  renderCatNameModalList('');
  setTimeout(() => document.getElementById('cat-name-search')?.focus(), 80);
}

function renderCatNameModalList(filter) {
  const list = document.getElementById('cat-name-modal-list');
  if (!list) return;
  const q = (filter || '').trim().toLowerCase();
  let html = '';
  CAT_PRESETS.forEach(group => {
    const items = q ? group.items.filter(i => i.label.includes(filter) || i.label.toLowerCase().includes(q)) : group.items;
    if (!items.length) return;
    html += `<div style="padding:5px 14px;font-size:.68rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;background:var(--surface2);border-bottom:1px solid var(--border)">${group.group}</div>`;
    html += items.map(item => `
      <div data-label="${item.label.replace(/"/g,'&quot;')}" data-type="${item.type}"
        onclick="selectCatName(this.dataset.label,this.dataset.type)"
        style="padding:12px 16px;font-size:.88rem;color:var(--ink);cursor:pointer;border-bottom:1px solid var(--border);direction:rtl"
>
        ${item.label}
      </div>`).join('');
  });
  list.innerHTML = html || `<div style="padding:16px;text-align:center;color:var(--ink-4);font-size:.875rem">לא נמצאה קטגוריה</div>`;
}

function filterCatNameModal(q) { renderCatNameModalList(q); }

let catEditTargetId = null;

function selectCatName(label, type) {
  document.getElementById('cat-name-modal')?.remove();

  /* ── מצב עריכת קטגוריה קיימת ── */
  if (catEditTargetId) {
    const tid = catEditTargetId;
    catEditTargetId = null;
    if (type === 'custom') {
      /* מותאמת אישית בעריכה — פשוט תן למשתמש לערוך את שם הקטגוריה */
      const labelInput = document.getElementById(`cat-edit-label-${tid}`);
      if (labelInput) { labelInput.value = ''; labelInput.focus(); }
      return;
    }
    const labelInput = document.getElementById(`cat-edit-label-${tid}`);
    if (labelInput) labelInput.value = label;
    const typeBtn = document.getElementById(`cat-edit-type-btn-${tid}`);
    if (typeBtn) typeBtn.querySelector('span').textContent = label;
    return;
  }

  document.getElementById('cat-name-dropdown-label').textContent = label;
  document.getElementById('cat-name-dropdown-label').style.color = 'var(--ink)';
  document.getElementById('new-cat-type').value = type === 'custom' ? '' : type;
  const customField = document.getElementById('new-cat-label');
  if (type === 'custom') {
    showCustomCatModal();
  } else {
    customField.style.display = 'none';
    customField.value = label;
    document.getElementById('cat-custom-type-wrap') && (document.getElementById('cat-custom-type-wrap').style.display = 'none');
  }
}

function openCatTypeForEdit(id) {
  catEditTargetId = id;
  document.getElementById('cat-name-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'cat-name-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '1002';
  modal.onclick = e => { if (e.target === modal) { catEditTargetId = null; modal.remove(); } };
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>${ICONS_JS.note} בחר סוג חשבון / נכס</h2>
        <button onclick="catEditTargetId=null;document.getElementById('cat-name-modal').remove()" class="modal-close">${ICONS_JS.x}</button>
      </div>
      <div class="modal-body" style="padding:12px 16px 32px;">
        <input type="text" id="cat-name-search" placeholder="חפש קטגוריה..." class="form-input"
          style="width:100%;margin-bottom:12px;direction:rtl;text-align:right"
          oninput="filterCatNameModal(this.value)"/>
        <div id="cat-name-modal-list"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  renderCatNameModalList('');
  setTimeout(() => document.getElementById('cat-name-search')?.focus(), 80);
}

function showCustomCatModal() {
  document.getElementById('custom-cat-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'custom-cat-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '1002';
  modal.innerHTML = `
    <div class="modal-box" style="direction:rtl">
      <div class="chb-header">
        <div class="chb-title">${ICONS_JS.plus} קטגוריה מותאמת אישית</div>
        <button onclick="document.getElementById('custom-cat-modal').remove()" class="chb-close">${ICONS_JS.x}</button>
      </div>
      <div style="overflow-y:auto;-webkit-overflow-scrolling:touch;padding:20px 18px 8px;flex:1;display:flex;flex-direction:column;gap:18px">
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">שם הקטגוריה</div>
          <input type="text" id="ccm-label" placeholder='לדוגמה: נכס נדל"ן, קרן פרטית...'
            class="form-input" style="width:100%;direction:rtl;text-align:right"/>
        </div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">סוג קטגוריה</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button type="button" class="cat-type-btn ccm-type-btn" data-type="liquid" onclick="ccmSelectType('liquid')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>נזיל
            </button>
            <button type="button" class="cat-type-btn ccm-type-btn" data-type="savings" onclick="ccmSelectType('savings')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>בנק / חיסכון
            </button>
            <button type="button" class="cat-type-btn ccm-type-btn" data-type="pension" onclick="ccmSelectType('pension')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>פנסיוני
            </button>
            <button type="button" class="cat-type-btn ccm-type-btn" data-type="invest" onclick="ccmSelectType('invest')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>השקעות
            </button>
          </div>
          <div id="ccm-type-err" style="display:none;font-size:.75rem;color:var(--red);margin-top:6px">נא לבחור סוג קטגוריה</div>
        </div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--ink-3);margin-bottom:7px">גוף מנהל <span style="font-weight:400;color:var(--ink-4)">(אופציונלי)</span></div>
          <div id="ccm-inst-display" onclick="ccmOpenInst()"
            style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--r-sm);cursor:pointer">
            <span id="ccm-inst-label" style="color:var(--ink-4);flex:1;font-size:.875rem">${ICONS_JS.bank}&nbsp; בחר גוף מנהל</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <input type="hidden" id="ccm-inst-id" value=""/>
        </div>
      </div>
      <div style="display:flex;gap:8px;padding:14px 18px 18px;border-top:1px solid var(--border);flex-shrink:0">
        <button class="cat-edit-save-btn" style="flex:1" onclick="confirmCustomCat()">${ICONS_JS.plus} הוסף קטגוריה</button>
        <button class="cat-edit-cancel-btn" style="min-width:72px" onclick="document.getElementById('custom-cat-modal').remove()">ביטול</button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('ccm-label')?.focus(), 80);
}

function ccmSelectType(type) {
  document.querySelectorAll('.ccm-type-btn').forEach(b => b.classList.toggle('selected', b.dataset.type === type));
  document.getElementById('custom-cat-modal').dataset.type = type;
  document.getElementById('ccm-type-err').style.display = 'none';
}

function ccmOpenInst() {
  instTargetCatId = '__ccm__';
  instTargetMode  = 'ccm';
  renderInstGrid(INSTITUTIONS);
  const el = document.getElementById('inst-modal');
  el.style.display = 'flex';
  el.style.zIndex  = '1003';
  document.getElementById('inst-search').value = '';
}

function ccmSetInst(instId) {
  document.getElementById('ccm-inst-id').value = instId || '';
  const inst  = instId ? getInstitution(instId) : null;
  const label = document.getElementById('ccm-inst-label');
  if (inst) {
    label.innerHTML = `<img src="${logoUrl(inst.domain)}" width="18" height="18" style="border-radius:4px;object-fit:contain;margin-left:6px"/><span style="color:var(--ink);font-weight:600">${inst.name}</span>`;
  } else {
    label.innerHTML = `${ICONS_JS.bank}&nbsp; בחר גוף מנהל`;
    label.style.color = 'var(--ink-4)';
  }
}

async function confirmCustomCat() {
  const label  = document.getElementById('ccm-label')?.value.trim();
  const type   = document.getElementById('custom-cat-modal')?.dataset.type || '';
  const instId = document.getElementById('ccm-inst-id')?.value || null;
  if (!label) { document.getElementById('ccm-label')?.focus(); showToast('נא להזין שם'); return; }
  if (!type)  { document.getElementById('ccm-type-err').style.display = 'block'; return; }
  document.getElementById('custom-cat-modal').remove();
  const labelField = document.getElementById('new-cat-label');
  labelField.style.display = 'block';
  labelField.value = label;
  document.getElementById('new-cat-type').value = type;
  document.getElementById('new-cat-institution').value = instId || '';
  document.getElementById('cat-name-dropdown-label').textContent = label;
  document.getElementById('cat-name-dropdown-label').style.color = 'var(--ink)';
  await addCategory();
}

document.addEventListener('click', e => {
  const wrap = document.getElementById('cat-name-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) {
    const search = document.getElementById('cat-name-search');
    if (search) search.value = '';
  }
});

function selectCatType(type) {
  document.getElementById('new-cat-type').value = type;
  document.querySelectorAll('.cat-type-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.type === type);
  });
}

async function addCategory() {
  const labelField = document.getElementById('new-cat-label');
  const isCustom   = labelField.style.display !== 'none';
  const label      = isCustom ? labelField.value.trim() : document.getElementById('cat-name-dropdown-label').textContent.trim();
  const type       = document.getElementById('new-cat-type').value;
  const instId     = document.getElementById('new-cat-institution').value || null;

  if (!label || label === 'בחר סוג חשבון / נכס') return showToast('נא לבחור קטגוריה');
  if (!type) return showToast('נא לבחור סוג קטגוריה');

  const prefixMap = { liquid:'liquid', savings:'savings', pension:'pension', invest:'invest' };
  const base = prefixMap[type] + '_' + Date.now().toString(36);
  let key = base, suffix = 1;
  while (categories.find(c => c.key === key)) { key = base + '_' + suffix++; }

  showLoader('מוסיף...');
  await db.from('categories').insert({ user_id:currentUser.id, key, label, icon:'_svg', order_index:categories.length, institution_id:instId });
  await loadCategories(); hideLoader();
  renderCategoriesList(); renderDynamicFields();
  showToast('✅ קטגוריה נוספה');
  // Reset
  labelField.style.display = 'none';
  labelField.value = '';
  document.getElementById('new-cat-type').value = '';
  document.getElementById('new-cat-institution').value = '';
  document.getElementById('cat-name-dropdown-label').textContent = 'בחר סוג חשבון / נכס';
  document.getElementById('cat-name-dropdown-label').style.color = 'var(--ink-4)';
  document.getElementById('inst-dropdown-label').textContent = 'גוף מנהל (אופציונלי)';
  document.getElementById('inst-dropdown-label').style.color = 'var(--ink-4)';
  const cw = document.getElementById('cat-custom-type-wrap');
  if (cw) cw.style.display = 'none';
  document.querySelectorAll('.cat-type-btn').forEach(b => b.classList.remove('selected'));
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
  // Refresh institution display inside open edit modal
  const dispEl = document.getElementById(`cat-edit-inst-display-${catId}`);
  if (dispEl) {
    const inst = instId ? getInstitution(instId) : null;
    dispEl.innerHTML = inst ? `
      <img src="${logoUrl(inst.domain)}" width="22" height="22" style="border-radius:5px;object-fit:contain" onerror="this.style.display='none'"/>
      <span style="font-size:.875rem;font-weight:600;color:var(--ink);flex:1">${inst.name}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    ` : `
      <span style="color:var(--ink-4);flex:1;font-size:.875rem">${ICONS_JS.bank}&nbsp; בחר גוף מנהל</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;
  }
}

/* ── INSTITUTION MODAL ─────────────────────────────── */
function openInstModal(catId) {
  instTargetMode   = 'cat';
  instTargetCatId  = catId;
  renderInstGrid(INSTITUTIONS);
  const el = document.getElementById('inst-modal');
  el.style.display = 'flex';
  // If cat-edit-modal is open, elevate inst-modal above it
  el.style.zIndex = document.getElementById('cat-edit-modal') ? '1002' : '';
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
  const el = document.getElementById('inst-modal');
  el.style.display = 'none';
  el.style.zIndex = '';
  instTargetCatId = null;
}

function closeInstModalOutside(e) { if (e.target.id==='inst-modal') closeInstModal(); }

function filterInstitutions() {
  const q = document.getElementById('inst-search').value.trim().toLowerCase();
  renderInstGrid(q ? INSTITUTIONS.filter(i => i.name.includes(q) || i.id.includes(q)) : INSTITUTIONS);
}

function renderInstGrid(list) {
  const addBtn = instTargetMode === 'new_cat' ? `
    <div class="inst-tile" onclick="closeInstModal();showAddCustomInst()" style="border:1.5px dashed var(--border);color:var(--green)">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span class="inst-name" style="color:var(--green)">הוסף חדש</span>
    </div>` : '';
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
    </div>`).join('')}
    ${addBtn}`;
}

async function pickInstitution(instId) {
  if (instTargetMode === 'ccm') { closeInstModal(); ccmSetInst(instId||null); return; }
  if (instTargetMode === 'new_cat') {
    closeInstModal();
    const inst = instId ? getInstitution(instId) : null;
    selectInstDropdown(instId || '', inst?.name || '');
    return;
  }
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
  return cat.key.startsWith('pension_') ||
         cat.key.toLowerCase().includes('pension') ||
         cat.label.includes('פנסיה') ||
         cat.label.includes('גמל') ||
         cat.label.includes('ביטוח מנהלים');
}

function isLiquidCat(cat) {
  // If a future liquid_date is set — not liquid yet
  if (cat.liquid_date) {
    const d = new Date(cat.liquid_date);
    if (!isNaN(d) && d > new Date()) return false;
    // Date passed — now liquid (override is_liquid)
    return true;
  }
  // Manual override takes priority
  if (cat.is_liquid === true)  return true;
  if (cat.is_liquid === false) return false;
  // Legacy auto-detection
  const legacyLiquid = ['cash','currentAcc','savingsFund','deposit','hishtalmut'];
  if (legacyLiquid.includes(cat.key))  return true;
  if (cat.key.startsWith('liquid_'))   return true;
  if (cat.key.startsWith('savings_'))  return true;
  if (cat.key.startsWith('invest_'))   return true;
  if (cat.key.startsWith('pension_'))  return false;
  if (isPensionCat(cat))               return false;
  return true;
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
  const liquid     = categories.filter(isLiquidCat).reduce((s,c)=>s+(calc[c.key]||0),0);
  const liquidRatio = calc.totalAssets ? liquid/calc.totalAssets : 0;
  if      (liquidRatio >= 0.15 && liquidRatio <= 0.40) { score+=30; details.push({ label:'נזילות', note:'אחוז נזילות תקין', ok:true }); }
  else if (liquidRatio >= 0.10 && liquidRatio <= 0.55) { score+=18; details.push({ label:'נזילות', note:'נזילות סבירה', ok:null }); }
  else if (liquidRatio < 0.10) {
    const needed = Math.ceil(calc.totalAssets * 0.15 - liquid);
    score+=5; details.push({ label:'נזילות', note:`נזילות נמוכה מדי — חסרים ${fmt(needed)} להגיע ל-15%`, ok:false });
  }
  else { score+=5; details.push({ label:'נזילות', note:'נזילות גבוהה מדי (כסף לא עובד)', ok:false }); }

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

  // ── Monthly insights ──────────────────────────────
  const SVG_UP    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
  const SVG_DOWN  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`;
  const SVG_STAR  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="var(--green)" stroke="none" style="flex-shrink:0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const SVG_WARN  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--amber,#f59e0b)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const SVG_TARGET= `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
  const SVG_FAST  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  const SVG_AVG   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;

  const insights = [];
  const sorted = [...records].sort((a,b)=>new Date(a.record_date)-new Date(b.record_date));
  const cur = sorted[sorted.length-1];
  const prev = sorted.length >= 2 ? sorted[sorted.length-2] : null;
  const curTotal  = calcRecord(cur).totalAssets;
  const prevTotal = prev ? calcRecord(prev).totalAssets : null;

  if (prev && prevTotal != null) {
    const delta = curTotal - prevTotal;
    const pct   = prevTotal ? (delta/prevTotal*100).toFixed(1) : null;
    const mName = d => new Date(d).toLocaleDateString('he-IL',{month:'long'});
    if (delta > 0)
      insights.push([SVG_UP,   `גדלת ב-${fmt(delta)} לעומת ${mName(prev.record_date)}${pct?` (+${pct}%)`:''}` ]);
    else if (delta < 0)
      insights.push([SVG_DOWN, `ירידה של ${fmt(Math.abs(delta))} לעומת ${mName(prev.record_date)}${pct?` (${pct}%)`:''}` ]);

    // best/worst category this month
    const curCalc  = calcRecord(cur);
    const prevCalc = calcRecord(prev);
    let bestCat=null, bestPct=-Infinity, worstCat=null, worstPct=Infinity;
    categories.filter(cat => cat.key !== 'cash').forEach(cat => {
      const vPrev = prevCalc[cat.key]||0, vCur = curCalc[cat.key]||0;
      if (vPrev<=0 || vCur<=0) return;
      const p = (vCur-vPrev)/vPrev*100;
      if (p > bestPct)  { bestPct=p;  bestCat=cat; }
      if (p < worstPct) { worstPct=p; worstCat=cat; }
    });
    if (bestCat  && bestPct  > 0)
      insights.push([SVG_STAR, `הקטגוריה שצמחה הכי מהר: ${bestCat.label} (+${bestPct.toFixed(1)}%)`]);
    if (worstCat && worstPct < 0)
      insights.push([SVG_WARN, `הקטגוריה שירדה הכי מהר: ${worstCat.label} (${worstPct.toFixed(1)}%)`]);
  }

  // 3-month rolling average
  if (sorted.length >= 3) {
    const last3 = sorted.slice(-3);
    const avgDelta = (calcRecord(last3[2]).totalAssets - calcRecord(last3[0]).totalAssets) / 2;
    if (avgDelta > 0)
      insights.push([SVG_AVG, `ממוצע חודשי (3 חודשים): +${fmt(Math.round(avgDelta))}`]);
  }

  // milestone projection
  if (sorted.length >= 2) {
    const avgM = prev ? (curTotal - prevTotal) : 0;
    if (avgM > 0) {
      const milestones = [100000,250000,500000,750000,1000000,1500000,2000000,3000000,5000000];
      const next = milestones.find(m => m > curTotal);
      if (next) {
        const months = Math.ceil((next - curTotal) / avgM);
        const td = new Date(); td.setMonth(td.getMonth()+months);
        const milLabel = next>=1000000?`${next/1000000}M₪`:`${next/1000}K₪`;
        insights.push([SVG_TARGET, `בדרך ל-${milLabel} — עוד ${months} חודש${months===1?'':'ים'} (${td.toLocaleDateString('he-IL',{month:'long',year:'numeric'})})`]);
      }
    }
  }

  const insightsHtml = insights.length ? `
    <div style="margin-top:8px;padding-top:8px;">
      <div style="font-size:.7rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)">תובנות חודשיות</div>
      ${insights.map(([icon,text])=>`
        <div style="padding:7px 0;border-bottom:1px solid var(--border);font-size:.82rem;color:var(--ink-2);line-height:1.5;display:flex;align-items:center;gap:8px">
          ${icon}<span>${text}</span>
        </div>`).join('')}
    </div>` : '';

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
        <div style="font-size:.7rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)">מדדי בריאות</div>
        ${details.map(d=>{
          const c = d.ok===true ? 'var(--green)' : d.ok===false ? 'var(--red)' : 'var(--amber)';
          return `<div class="hdp-row">
            <span class="hdp-dot" style="background:${c}"></span>
            <span class="hdp-label">${d.label}</span>
            <span class="hdp-note">${d.note}</span>
          </div>`;
        }).join('')}
        ${insightsHtml}
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
 
  const idx       = currentRecordIndex < 0 ? records.length - 1 : Math.min(currentRecordIndex, records.length - 1);
  const latest    = records[idx];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  const isFirst   = idx === 0;
  const isLast    = idx === records.length - 1;
 
  const SVG_TOTAL    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`;
  const SVG_DROP = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  const SVG_MORTGAGE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  const SVG_NETWORTH = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const SVG_GROWTH   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  let growthSub='', growthHtml='';
  if (idx >= 1) {
    const prev  = calcRecord(records[idx-1]);
    const delta = calc.totalAssets - prev.totalAssets;
    const pct   = prev.totalAssets ? (delta/prev.totalAssets*100).toFixed(2) : '0.00';
    const sign  = delta>=0?'+':'';
    const cls   = delta>=0?'pos':'neg';
    const avg   = idx > 0 ? (calc.totalAssets - calcRecord(records[0]).totalAssets) / idx : 0;
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
 
  const liquid     = categories.filter(isLiquidCat).reduce((s,c)=>s+(calc[c.key]||0),0);
  const liquidPct  = calc.totalAssets ? ((liquid/calc.totalAssets)*100).toFixed(1) : '0';
 
  // Previous month calc (used for mortgage delta + cat badges)
  const prevCalc = idx >= 1 ? calcRecord(records[idx-1]) : null;

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

    // Date field alerts: expired=red, expiring within 45 days=orange
    const now = new Date();
    let tileAlertClass = '';
    for (const f of (cat.custom_fields || [])) {
      if (f.type !== 'date' || !f.value) continue;
      const d = new Date(f.value);
      if (isNaN(d)) continue;
      const diffDays = Math.ceil((d - now) / 86400000);
      if (diffDays < 0) { tileAlertClass = 'cat-tile-expired'; break; }
      if (diffDays <= 45 && !tileAlertClass) tileAlertClass = 'cat-tile-warn';
    }

    return `
    <div class="cat-tile${tileAlertClass ? ' ' + tileAlertClass : ''}" style="animation-delay:${.05*(i+1)}s;cursor:pointer" onclick="openCatHistory('${cat.key}','${cat.label}')">
      ${logoHtml}
      <span class="ct-icon" ${inst?'style="display:none"':''}>${getCatSvg(cat)}</span>
      <div class="ct-label">${cat.label}${inst?`<span class="ct-inst">${inst.name}</span>`:''}</div>
      <div class="ct-value blur-text" data-countup="${calc[cat.key]||0}">${fmt(calc[cat.key]||0)}</div>
      ${growthBadge}
    </div>`;
  }).join('');

  // ── Sparkline for list view ──────────────────────────
  function listSpark(catKey) {
    const vals = records.slice(-10).map(r => (r.values || {})[catKey] || 0);
    if (vals.length < 3 || vals.filter(v => v > 0).length < 3) return '<div class="cat-row-spark-empty"></div>';
    const min = Math.min(...vals), max = Math.max(...vals);
    if (max - min === 0) return '<div class="cat-row-spark-empty"></div>';
    const W = 100, H = 24, pad = 2;
    const pts = vals.map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
      const y = pad + (1 - (v - min) / (max - min)) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const isPos = vals[vals.length - 1] >= vals[0];
    const col   = isPos ? 'var(--green,#0e9e7e)' : '#ef4444';
    const allPts = pts.split(' ');
    const first = allPts[0].split(','), last = allPts[allPts.length-1].split(',');
    const fillPath = `M ${pts.split(' ').join(' L ')} L ${last[0]},${H} L ${first[0]},${H} Z`;
    const gid = 'ls_' + catKey.replace(/[^a-z0-9]/gi,'_');
    return `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="cat-row-spark" aria-hidden="true">
      <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="${col}" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${fillPath}" fill="url(#${gid})"/>
      <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // ── List view rows ─────────────────────────────────────
  const catListRows = categories.map((cat, i) => {
    const inst    = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const val     = calc[cat.key] || 0;
    const pct     = calc.totalAssets ? (val / calc.totalAssets * 100).toFixed(1) : '0.0';
    const bar     = Math.min(Math.round(parseFloat(pct)), 100);
    const liq     = isLiquidCat(cat);
    const barCol  = liq ? 'var(--green)' : 'var(--amber,#f59e0b)';

    const logoHtml = inst
      ? `<img src="${logoUrl(inst.domain)}" width="34" height="34" style="border-radius:8px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'"/>`
      : `<span class="cat-row-icon">${getCatSvg(cat)}</span>`;

    let growthBadge = '';
    if (prevCalc) {
      const cur = val, prev = prevCalc[cat.key] || 0;
      if (prev > 0) {
        const delta = cur - prev, dpct = (delta / prev * 100).toFixed(1), pos = delta >= 0;
        growthBadge = `<span class="crg ${pos?'pos':'neg'}">${pos?'+':''}${dpct}%</span>`;
      } else if (cur > 0 && prev === 0) {
        growthBadge = `<span class="crg pos" style="font-family:var(--font)">חדש</span>`;
      }
    }

    return `
    <div class="cat-row" style="animation-delay:${.04*(i+1)}s" onclick="openCatHistory('${cat.key}','${cat.label}')">
      ${logoHtml}
      <div class="cat-row-info">
        <div class="cat-row-name">${cat.label}</div>
        ${inst ? `<div class="cat-row-inst">${inst.name}</div>` : ''}
      </div>
      <div class="cat-row-spark-col">
        ${listSpark(cat.key)}
        <div class="cat-row-bar-wrap"><div class="cat-row-bar" style="width:${bar}%;background:${barCol}"></div></div>
      </div>
      <div class="cat-row-right">
        <div class="cat-row-val blur-text" data-countup="${val}">${fmt(val)}</div>
        <div class="cat-row-meta">${growthBadge}<span class="cat-row-pct">${pct}%</span></div>
      </div>
    </div>`;
  }).join('');

  const addCatTile = `
    <div class="cat-tile cat-tile-add" style="animation-delay:${.05*(categories.length+1)}s;cursor:pointer" onclick="openAddCatFromMain()">
      <span class="ct-icon" style="color:var(--ink-4)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </span>
      <div class="ct-label" style="text-align:center;color:var(--ink-4);margin-top:4px">קטגוריה חדשה</div>
    </div>`;

  const catSection = viewMode === 'list'
    ? `<div class="cat-list">${catListRows}
         <div class="cat-row cat-row-add" onclick="openAddCatFromMain()">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
           קטגוריה חדשה
         </div>
       </div>`
    : `<div class="cat-grid">${catTiles}${addCatTile}</div>`;
 
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
        <div class="ht-label">${SVG_DROP} נכסים נזילים</div>
        <div class="ht-value blur-text" data-countup="${liquid}">${fmt(liquid)}</div>
        <span class="ht-sub">${liquidPct}% מהתיק</span>
      </div>
      ${mortgageHero}
    </div>
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;position:relative">
      <button onclick="navigateRecord(-1)" style="background:none;border:none;cursor:pointer;color:${isFirst?'var(--ink-4)':'var(--ink-2)'};display:flex;padding:4px 6px;border-radius:6px;transition:background .15s,color .15s" ${isFirst?'disabled':''} onmouseover="if(!this.disabled)this.style.background='var(--border)'" onmouseout="this.style.background='transparent'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div style="position:relative">
        <button id="month-picker-btn" onclick="toggleMonthPicker()" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;color:var(--ink);font-size:.875rem;font-weight:600;font-family:var(--font);padding:4px 8px;border-radius:8px;transition:background .15s" onmouseover="this.style.background='var(--border)'" onmouseout="this.style.background='transparent'">
          ${dateLabel}${isLast?' <span style="font-size:.68rem;color:var(--green);font-weight:700;margin-right:2px">· נוכחי</span>':''}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div id="month-picker-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow-lg);z-index:200;min-width:190px;max-height:280px;overflow-y:auto;padding:6px;scrollbar-width:thin;scrollbar-color:var(--border) transparent">
          ${[...records].reverse().map((r, ri) => {
            const rIdx = records.length - 1 - ri;
            const lbl  = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
            const isSelected = rIdx === idx;
            const isNewest   = rIdx === records.length - 1;
            return `<button onclick="selectRecord(${rIdx})" style="display:flex;align-items:center;justify-content:space-between;width:100%;text-align:right;padding:8px 12px;border:none;border-radius:8px;cursor:pointer;background:${isSelected?'var(--green-light)':'transparent'};color:${isSelected?'var(--green)':'var(--ink)'};font-family:var(--font);font-size:.82rem;font-weight:${isSelected?'700':'500'};gap:8px;transition:background .12s" onmouseover="this.style.background='${isSelected?'var(--green-light)':'var(--border)'}'" onmouseout="this.style.background='${isSelected?'var(--green-light)':'transparent'}'">
              <span>${lbl}</span>
              ${isNewest ? `<span style="font-size:.65rem;font-weight:700;color:var(--green);background:var(--green-light);padding:2px 6px;border-radius:99px">נוכחי</span>` : ''}
              ${isSelected && !isNewest ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
            </button>`;
          }).join('')}
        </div>
      </div>
      <button onclick="navigateRecord(1)" style="background:none;border:none;cursor:pointer;color:${isLast?'var(--ink-4)':'var(--ink-2)'};display:flex;padding:4px 6px;border-radius:6px;transition:background .15s,color .15s" ${isLast?'disabled':''} onmouseover="if(!this.disabled)this.style.background='var(--border)'" onmouseout="this.style.background='transparent'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    </div>
    ${catSection}
    ${growthHtml}
    ${notesHtml}`;
  applyBlur();
  animateCountUps();
  renderNextEventWidget();
}

function renderNextEventWidget() {
  const el = document.getElementById('next-event-widget');
  if (!el) return;

  const today = new Date(); today.setHours(0,0,0,0);

  // collect all upcoming events (same logic as calendar tab)
  const upcoming = [];
  const firstRec = records.length ? [...records].sort((a,b)=>new Date(a.record_date)-new Date(b.record_date))[0] : null;

  categories.forEach(cat => {
    if (cat.liquid_date) {
      const d = new Date(cat.liquid_date);
      if (d >= today) {
        const days = Math.round((d-today)/(1000*60*60*24));
        const isPension = cat.key==='savingsFund'||cat.key==='pensionFund';
        upcoming.push({ date:d, days, title: isPension?`משיכת ${cat.label}`:`פקיעת ${cat.label}`, type: isPension?'fund':'deposit' });
      }
    }
    (cat.custom_fields||[]).forEach(f => {
      if (f.type!=='date'||!f.value) return;
      const d = new Date(f.value); if(isNaN(d)||d<today) return;
      const days = Math.round((d-today)/(1000*60*60*24));
      upcoming.push({ date:d, days, title:`${f.label} — ${cat.label}`, type:'custom' });
    });
  });

  if (!upcoming.length) { el.innerHTML=''; return; }

  upcoming.sort((a,b)=>a.days-b.days);
  const ev = upcoming[0];

  const color = ev.days<=30 ? 'var(--amber,#f59e0b)' : 'var(--green)';
  const icon = ev.type==='fund'
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
    : ev.type==='deposit'
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

  const daysLabel = ev.days===0?'היום':ev.days===1?'מחר':ev.days<30?`בעוד ${ev.days} ימים`:ev.days<365?`בעוד ${Math.round(ev.days/30)} חודשים`:`בעוד ${(ev.days/365).toFixed(1)} שנים`;
  const more = upcoming.length-1;

  el.innerHTML = `
    <div onclick="switchTab('calendar',document.querySelector('[data-tab=\\'calendar\\']'))"
      style="margin-top:0;padding:13px 16px;border-radius:14px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:border-color .15s"
      onmouseover="this.style.borderColor='${color}'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:10px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style="font-size:.7rem;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:.06em">האירוע הקרוב</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:34px;height:34px;border-radius:9px;background:${color}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${color}">
          ${icon}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:.88rem;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ev.title}</div>
          <div style="font-size:.72rem;color:var(--ink-4);margin-top:1px">${ev.date.toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <span style="font-size:.75rem;font-weight:800;color:${color}">${daysLabel}</span>
          ${more>0?`<span style="font-size:.68rem;color:var(--ink-4)">ועוד ${more}</span>`:''}
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════
   HISTORY TAB
══════════════════════════════════════════════════════ */
function renderHistoryTab() {
  renderChart();
  renderStackedChart();
  populateDateSelect();
  renderDynamicFields();
  populateYearSelects();
  renderYearVsYear();
}

/* ── Stacked composition chart ──────────────────────── */
let stackedChart = null;
const STACK_PALETTE = ['#0e9e7e','#4f8ef7','#f59e0b','#8b5cf6','#ef4444','#10b981','#f97316','#06b6d4','#ec4899','#84cc16'];

function renderStackedChart() {
  const canvas = document.getElementById('stacked-chart'); if (!canvas) return;
  if (stackedChart) { stackedChart.destroy(); stackedChart=null; }
  if (!records.length || !categories.length) return;

  const isDark  = document.documentElement.getAttribute('data-theme')==='dark';
  const tickCol = isDark ? '#4b5563' : '#9ca3af';
  const gridCol = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)';

  const sorted = [...records].sort((a,b)=>new Date(a.record_date)-new Date(b.record_date));
  const labels = sorted.map(r=>new Date(r.record_date).toLocaleDateString('he-IL',{month:'short',year:'2-digit'}));

  // Only include categories that have at least one non-zero value
  const activeCats = categories.filter(cat =>
    sorted.some(r => (calcRecord(r)[cat.key]||0) > 0)
  );

  const datasets = activeCats.map((cat,i) => ({
    label: cat.label,
    data:  sorted.map(r => calcRecord(r)[cat.key]||0),
    backgroundColor: STACK_PALETTE[i % STACK_PALETTE.length] + 'cc',
    borderColor:     STACK_PALETTE[i % STACK_PALETTE.length],
    borderWidth: 0,
    borderRadius: i === activeCats.length-1 ? 4 : 0, // round only top segment
    borderSkipped: false,
  }));

  // ── hover plugin: crosshair + floating card ──
  const stackHoverPlugin = {
    id:'stackHover',
    afterDraw(chart) {
      const {ctx,chartArea:{top,bottom,left,right}} = chart;
      const activeEls = chart._active; if (!activeEls?.length) return;
      const idx  = activeEls[0].index;
      const dark = document.documentElement.getAttribute('data-theme')==='dark';

      // x position from first active element
      const xi = activeEls[0].element.x;

      ctx.save();
      // crosshair
      ctx.beginPath(); ctx.setLineDash([4,5]);
      ctx.strokeStyle = dark?'rgba(255,255,255,.18)':'rgba(0,0,0,.15)';
      ctx.lineWidth=1.5; ctx.moveTo(xi,top); ctx.lineTo(xi,bottom); ctx.stroke(); ctx.setLineDash([]);

      // collect values for this month
      const monthLabel = chart.data.labels[idx];
      const rows = chart.data.datasets.map((ds,di)=>({
        label: ds.label,
        val:   ds.data[idx]||0,
        col:   STACK_PALETTE[di%STACK_PALETTE.length],
      })).filter(r=>r.val>0).reverse(); // top of stack first

      const total = rows.reduce((s,r)=>s+r.val,0);

      // measure card size
      ctx.font = "600 11px 'Heebo',sans-serif";
      const maxLabelW = Math.max(...rows.map(r=>ctx.measureText(r.label).width));
      ctx.font = "700 11px 'JetBrains Mono',monospace";
      const maxValW   = Math.max(...rows.map(r=>ctx.measureText(fmt(r.val)).width));

      const rowH=20, pad=12, dotSz=8, gap=6;
      const cardW = pad + dotSz + gap + maxLabelW + 16 + maxValW + pad;
      const headerH = 24;
      const cardH = headerH + rows.length*rowH + pad;

      const spaceRight = right - (xi + 12);
      const spaceLeft  = (xi - 12) - left;
      const goLeft = spaceLeft > spaceRight;
      let bx = goLeft ? xi - 12 - cardW : xi + 12;
      // only clamp if truly overflowing the canvas
      if (bx < left) bx = left + 2;
      if (bx + cardW > right) bx = right - cardW - 2;
      const byIdeal = top + (bottom-top)/2 - cardH/2;
      const by = Math.max(top+4, Math.min(bottom-cardH-4, byIdeal));
      const br = 10;

      // shadow + bg
      ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=20; ctx.shadowOffsetY=4;
      ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,cardW,cardH,br):ctx.rect(bx,by,cardW,cardH);
      ctx.fillStyle=dark?'rgba(15,18,25,.95)':'rgba(255,255,255,.97)'; ctx.fill();
      ctx.shadowBlur=ctx.shadowOffsetY=0;
      ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,cardW,cardH,br):ctx.rect(bx,by,cardW,cardH);
      ctx.strokeStyle=dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.07)'; ctx.lineWidth=1; ctx.stroke();

      // header: month + total
      ctx.fillStyle=dark?'#f9fafb':'#111827';
      ctx.font="700 11px 'Heebo',sans-serif"; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(monthLabel, bx+cardW-pad, by+headerH/2);
      ctx.font="700 11px 'JetBrains Mono',monospace"; ctx.textAlign='left';
      ctx.fillStyle=dark?'#9ca3af':'#6b7280';
      ctx.fillText(fmt(total), bx+pad, by+headerH/2);

      // separator
      ctx.beginPath(); ctx.moveTo(bx+8,by+headerH); ctx.lineTo(bx+cardW-8,by+headerH);
      ctx.strokeStyle=dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'; ctx.lineWidth=1; ctx.stroke();

      // rows
      rows.forEach((row,i) => {
        const ry = by+headerH+i*rowH+rowH/2;
        // dot
        ctx.beginPath(); ctx.arc(bx+pad+dotSz/2, ry, dotSz/2, 0, Math.PI*2);
        ctx.fillStyle=row.col; ctx.fill();
        // label
        ctx.font="600 11px 'Heebo',sans-serif"; ctx.fillStyle=dark?'#d1d5db':'#374151';
        ctx.textAlign='left'; ctx.textBaseline='middle';
        ctx.fillText(row.label, bx+pad+dotSz+gap, ry);
        // value
        ctx.font="700 11px 'JetBrains Mono',monospace"; ctx.fillStyle=dark?'#f9fafb':'#111827';
        ctx.textAlign='right';
        ctx.fillText(fmt(row.val), bx+cardW-pad, ry);
      });

      ctx.restore();
    }
  };

  let _rafId=null, _touchEndTimer=null;
  const updateAt=(clientX)=>{
    if(!stackedChart) return;
    const rect=canvas.getBoundingClientRect(), xPos=clientX-rect.left;
    const idx=Math.round(stackedChart.scales.x.getValueForPixel(xPos));
    const cl=Math.max(0,Math.min(idx,labels.length-1));
    if(stackedChart._active?.[0]?.index===cl) return;
    const activeEls=datasets.map((_,di)=>({datasetIndex:di,index:cl}));
    stackedChart.setActiveElements(activeEls);
    stackedChart.update('none');
  };

  stackedChart = new Chart(canvas, {
    type:'bar',
    data:{ labels, datasets },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{duration:500,easing:'easeOutQuart'},
      plugins:{
        legend:{
          position:'bottom',
          labels:{ font:{family:"'Heebo',sans-serif",size:11,weight:'600'}, color:tickCol, padding:12, boxWidth:10, usePointStyle:true }
        },
        tooltip:{ enabled:false },
      },
      interaction:{ mode:'index', intersect:false },
      scales:{
        x:{ stacked:true, grid:{display:false}, border:{display:false},
            ticks:{font:{family:"'Heebo',sans-serif",size:11,weight:'600'},color:tickCol,maxRotation:0,maxTicksLimit:8}},
        y:{ stacked:true, grid:{color:gridCol}, border:{display:false},
            ticks:{font:{family:"'JetBrains Mono',monospace",size:10,weight:'600'},color:tickCol,maxTicksLimit:5,
                   callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K':v}}
      }
    },
    plugins:[stackHoverPlugin]
  });

  canvas.addEventListener('mousemove',e=>{if(_rafId)return;_rafId=requestAnimationFrame(()=>{_rafId=null;updateAt(e.clientX);});});
  canvas.addEventListener('mouseleave',()=>{stackedChart?.setActiveElements([]);stackedChart?.update('none');});
  let _touchRaf=null;
  canvas.addEventListener('touchmove',e=>{e.preventDefault();if(_touchRaf)return;_touchRaf=requestAnimationFrame(()=>{_touchRaf=null;updateAt(e.touches[0].clientX);});},{passive:false});
  canvas.addEventListener('touchend',()=>{clearTimeout(_touchEndTimer);_touchEndTimer=setTimeout(()=>{stackedChart?.setActiveElements([]);stackedChart?.update('none');},800);});
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

  const isDark   = () => document.documentElement.getAttribute('data-theme')==='dark';
  const colA     = '#0e9e7e', colB = '#4f8ef7';
  const dsColors = [colA, colB];

  const yvyCrosshair = {
    id:'yvyCrosshair',
    afterDraw(chart) {
      const {ctx,chartArea:{top,bottom,left,right}} = chart;
      const activeEls = chart._active; if (!activeEls?.length) return;
      const idx  = activeEls[0].index;
      const dark = isDark();

      // collect all dataset bars at this index
      const items = [];
      chart.data.datasets.forEach((ds,di) => {
        const meta = chart.getDatasetMeta(di);
        const el   = meta.data[idx]; if (!el) return;
        const val  = ds.data[idx];   if (val==null) return;
        items.push({ xi: el.x, yi: el.y, val, col: dsColors[di]||colA, label: ds.label });
      });
      if (!items.length) return;

      const xi = items[0].xi; // bars share the same x center

      ctx.save();
      // vertical crosshair
      ctx.beginPath(); ctx.setLineDash([4,5]);
      ctx.strokeStyle = dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.15)';
      ctx.lineWidth=1.5; ctx.moveTo(xi,top); ctx.lineTo(xi,bottom); ctx.stroke(); ctx.setLineDash([]);

      // de-overlap bubble y positions
      const BH=34, GAP=6;
      items.sort((a,b) => a.yi - b.yi);
      items.forEach(it => { it.bubbleY = it.yi; });
      for (let i=1;i<items.length;i++) {
        if (items[i].bubbleY - items[i-1].bubbleY < BH+GAP)
          items[i].bubbleY = items[i-1].bubbleY + BH + GAP;
      }
      items.forEach(it => {
        it.bubbleY = Math.max(top+BH/2+2, Math.min(bottom-BH/2-2, it.bubbleY));
      });

      items.forEach(({xi, yi, bubbleY, val, col, label}) => {
        // highlight dot on top of bar
        ctx.beginPath(); ctx.arc(xi, yi, 5, 0, Math.PI*2);
        ctx.fillStyle=col; ctx.strokeStyle=dark?'#1a1d26':'#fff'; ctx.lineWidth=2;
        ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;

        const text = `${label}  ${fmt(val)}`;
        ctx.font = "700 12px 'JetBrains Mono', monospace";
        const tw = ctx.measureText(text).width;
        const bw = tw+36, br=8, dotR=8;
        const goLeft = xi+dotR+bw+4>right, bx = goLeft ? xi-dotR-bw : xi+dotR;
        const by = bubbleY - BH/2;
        const path=()=>{ctx.beginPath();ctx.moveTo(bx+br,by);ctx.lineTo(bx+bw-br,by);ctx.arcTo(bx+bw,by,bx+bw,by+br,br);ctx.lineTo(bx+bw,by+BH-br);ctx.arcTo(bx+bw,by+BH,bx+bw-br,by+BH,br);ctx.lineTo(bx+br,by+BH);ctx.arcTo(bx,by+BH,bx,by+BH-br,br);ctx.lineTo(bx,by+br);ctx.arcTo(bx,by,bx+br,by,br);ctx.closePath();};
        ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=4;
        path();ctx.fillStyle=dark?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';ctx.fill();ctx.shadowBlur=ctx.shadowOffsetY=0;
        ctx.beginPath();ctx.roundRect?ctx.roundRect(bx+6,by+6,3,BH-12,2):ctx.rect(bx+6,by+6,3,BH-12);ctx.fillStyle=col;ctx.fill();
        path();ctx.strokeStyle=dark?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)';ctx.lineWidth=1;ctx.stroke();
        // arrow pointing to bar top
        const arrowBg=dark?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';
        ctx.beginPath();
        if(goLeft){ctx.moveTo(bx+bw,yi-5);ctx.lineTo(bx+bw,yi+5);ctx.lineTo(bx+bw+6,yi);}
        else{ctx.moveTo(bx,yi-5);ctx.lineTo(bx,yi+5);ctx.lineTo(bx-6,yi);}
        ctx.fillStyle=arrowBg;ctx.fill();
        ctx.fillStyle=dark?'#f9fafb':'#111827';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.font="700 12px 'JetBrains Mono', monospace";ctx.fillText(text,bx+bw/2+4,by+BH/2);
      });
      ctx.restore();
    }
  };

  const tickCol = isDark() ? '#4b5563' : '#9ca3af';
  const gridCol = isDark() ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)';

  yvyChart = new Chart(canvas, {
    type:'bar',
    data:{
      labels: monthNames,
      datasets:[
        { label:`${yearA}`, data:dataA, backgroundColor:colA+'b3', borderRadius:5, borderSkipped:false },
        { label:`${yearB}`, data:dataB, backgroundColor:colB+'b3', borderRadius:5, borderSkipped:false },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{duration:400,easing:'easeOutQuart'},
      plugins:{
        legend:{ position:'bottom', labels:{ font:{family:"'Heebo',sans-serif",size:12,weight:'700'}, color:tickCol, padding:14, boxWidth:10, usePointStyle:true }},
        tooltip:{ enabled:false },
      },
      interaction:{ mode:'index', intersect:false },
      scales:{
        y:{ grid:{color:gridCol}, border:{display:false}, ticks:{font:{family:"'JetBrains Mono',monospace",size:10,weight:'600'},color:tickCol,
            callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K':v}},
        x:{ grid:{display:false}, border:{display:false}, ticks:{font:{family:"'Heebo',sans-serif",size:11,weight:'600'},color:tickCol}}
      }
    },
    plugins:[yvyCrosshair]
  });

  let _rafId=null;
  const updateAt=(clientX)=>{
    if(!yvyChart) return;
    const rect=canvas.getBoundingClientRect(), xPos=clientX-rect.left;
    const idx=yvyChart.scales.x.getValueForPixel(xPos);
    const cl=Math.max(0,Math.min(Math.round(idx),monthNames.length-1));
    const activeEls=[];
    [0,1].forEach(di=>{
      const meta=yvyChart.getDatasetMeta(di);
      if(meta?.data?.[cl]) activeEls.push({datasetIndex:di,index:cl});
    });
    yvyChart.setActiveElements(activeEls);
    yvyChart.update('none');
  };
  canvas.addEventListener('mousemove',e=>{if(_rafId)return;_rafId=requestAnimationFrame(()=>{_rafId=null;updateAt(e.clientX);});});
  canvas.addEventListener('mouseleave',()=>{yvyChart?.setActiveElements([]);yvyChart?.update('none');});
  let _touchRaf=null, _touchEndTimer=null;
  canvas.addEventListener('touchmove',e=>{e.preventDefault();if(_touchRaf)return;_touchRaf=requestAnimationFrame(()=>{_touchRaf=null;updateAt(e.touches[0].clientX);});},{passive:false});
  canvas.addEventListener('touchend',()=>{clearTimeout(_touchEndTimer);_touchEndTimer=setTimeout(()=>{yvyChart?.setActiveElements([]);yvyChart?.update('none');},800);});
}

/* ── Main chart with best-month highlight ───────────── */
/* ══ CROSSHAIR + BUBBLE PLUGIN (category modal) ════ */
const crosshairPlugin = {
  id: 'crosshairBubble',
  _rafId: null,
  afterDraw(chart) {
    const { ctx, chartArea:{ top, bottom, left, right } } = chart;
    const activeEls = chart._active;
    if (!activeEls?.length) return;
    const el    = activeEls[0];
    const xi    = el.element.x;
    const yi    = el.element.y;
    const idx   = el.index;
    const val   = chart.data.datasets[0].data[idx];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color  = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#0e9e7e';
    ctx.save();
    // Crosshair
    ctx.beginPath(); ctx.setLineDash([4,5]);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.18)';
    ctx.lineWidth = 1.5; ctx.moveTo(xi, top); ctx.lineTo(xi, bottom); ctx.stroke(); ctx.setLineDash([]);
    // Dot
    ctx.beginPath(); ctx.arc(xi, yi, 7, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
    ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    // Bubble
    const text = fmt(val);
    ctx.font = "700 13px 'JetBrains Mono', monospace";
    const tw = ctx.measureText(text).width;
    const bw = tw + 36, bh = 32, br = 8, dotR = 8, gap = dotR + 3;
    const goLeft = xi + gap + bw > right;
    const bx = goLeft ? xi - gap - bw : xi + gap;
    const byIdeal = yi - bh/2, byLo = Math.max(top+2, yi-bh+8), byHi = Math.min(bottom-bh, yi-8);
    const by = Math.max(byLo, Math.min(byIdeal, byHi));
    ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=18; ctx.shadowOffsetY=4;
    const path = () => { ctx.beginPath(); ctx.moveTo(bx+br,by); ctx.lineTo(bx+bw-br,by); ctx.arcTo(bx+bw,by,bx+bw,by+br,br); ctx.lineTo(bx+bw,by+bh-br); ctx.arcTo(bx+bw,by+bh,bx+bw-br,by+bh,br); ctx.lineTo(bx+br,by+bh); ctx.arcTo(bx,by+bh,bx,by+bh-br,br); ctx.lineTo(bx,by+br); ctx.arcTo(bx,by,bx+br,by,br); ctx.closePath(); };
    path(); ctx.fillStyle = isDark ? 'rgba(15,18,25,.92)' : 'rgba(255,255,255,.95)'; ctx.fill();
    ctx.shadowBlur=ctx.shadowOffsetY=0;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx+6,by+6,3,bh-12,2) : ctx.rect(bx+6,by+6,3,bh-12); ctx.fillStyle=color; ctx.fill();
    path(); ctx.strokeStyle = isDark?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)'; ctx.lineWidth=1; ctx.stroke();
    const arrowY = yi;
    const arrowBg = isDark ? 'rgba(15,18,25,.92)' : 'rgba(255,255,255,.95)';
    ctx.beginPath();
    if (goLeft) { ctx.moveTo(bx+bw,arrowY-5); ctx.lineTo(bx+bw,arrowY+5); ctx.lineTo(bx+bw+6,arrowY); }
    else        { ctx.moveTo(bx,arrowY-5); ctx.lineTo(bx,arrowY+5); ctx.lineTo(bx-6,arrowY); }
    ctx.fillStyle=arrowBg; ctx.fill();
    ctx.fillStyle=isDark?'#f9fafb':'#111827'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font="700 13px 'JetBrains Mono', monospace"; ctx.fillText(text, bx+bw/2+4, by+bh/2);
    ctx.restore();
  },
  afterEvent(chart, args) {
    const e = args.event;
    if (e.type!=='mousemove' && e.type!=='touchmove') return;
    if (crosshairPlugin._rafId) return;
    crosshairPlugin._rafId = requestAnimationFrame(() => {
      crosshairPlugin._rafId = null;
      const xScale = chart.scales.x; const rawX = e.x; if (rawX==null) return;
      const idx = Math.round(xScale.getValueForPixel(rawX));
      const clamped = Math.max(0, Math.min(idx, chart.data.labels.length-1));
      if (chart._active?.[0]?.index===clamped) return;
      chart.setActiveElements([{datasetIndex:0, index:clamped}]); chart.update('none');
    });
  }
};

/* ══ LAST POINT LABEL PLUGIN ═══════════════════════ */
const lastPointPlugin = {
  id: 'lastPointLabel',
  afterDraw(chart) {
    const ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
    const last = meta.data[meta.data.length-1]; if (!last) return;
    const { ctx } = chart;
    const val = ds.data[ds.data.length-1];
    const color = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#0e9e7e';
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.save();
    if (!chart._active?.length) {
      const text = fmt(val); ctx.font = "600 10px 'JetBrains Mono', monospace";
      const tw = ctx.measureText(text).width, bw = tw+14, bh = 18;
      const bx = last.x-bw-10, by = last.y-bh/2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx,by,bw,bh,5) : ctx.rect(bx,by,bw,bh);
      ctx.fillStyle = isDark ? 'rgba(15,18,25,.9)' : 'rgba(255,255,255,.9)'; ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,bx+bw/2,by+bh/2);
    }
    ctx.beginPath(); ctx.arc(last.x, last.y, 5.5, 0, Math.PI*2);
    ctx.fillStyle=color; ctx.strokeStyle=isDark?'#1a1d26':'#fff'; ctx.lineWidth=2.5;
    ctx.shadowColor=color; ctx.shadowBlur=8; ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
    ctx.restore();
  }
};

function renderChart() {
  const canvas = document.getElementById('main-chart'); if(!canvas) return;
  if (mainChart) { mainChart.destroy(); mainChart=null; }
  if (!records.length) return;

  const isDark      = document.documentElement.getAttribute('data-theme') === 'dark';
  const labels      = records.map(r=>new Date(r.record_date).toLocaleDateString('he-IL',{month:'short',year:'2-digit'}));
  const totals      = records.map(r=>calcRecord(r).totalAssets);
  const mortgages   = records.map(r=>r.mortgage_balance||0);
  const hasMort     = mortgages.some(m=>m>0);
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#0e9e7e';

  let bestIdx = -1, bestGrowth = -Infinity;
  totals.forEach((v,i)=>{ if(i>0){ const g=v-totals[i-1]; if(g>bestGrowth){bestGrowth=g;bestIdx=i;} } });

  const chartH = canvas.parentElement?.offsetHeight || 280;
  const ctx2   = canvas.getContext('2d');
  const gradFill = ctx2.createLinearGradient(0,0,0,chartH);
  gradFill.addColorStop(0,   accentColor+(isDark?'38':'28'));
  gradFill.addColorStop(0.65,accentColor+'0a');
  gradFill.addColorStop(1,   accentColor+'00');

  const lastIdx  = totals.length-1;
  const gridCol  = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)';
  const tickCol  = isDark ? '#4b5563' : '#9ca3af';

  const datasets = [{
    label:'סה"כ נכסים', data:totals,
    borderColor:accentColor, borderWidth:2,
    backgroundColor:gradFill, fill:true, tension:0.4,
    pointRadius:     totals.map((_,i)=>i===bestIdx?7:i===lastIdx?5:3),
    pointStyle:      totals.map((_,i)=>i===bestIdx?'star':'circle'),
    pointBackgroundColor: totals.map((_,i)=>i===bestIdx?'#f59e0b':accentColor),
    pointBorderColor: isDark?'#1a1d26':'#ffffff', pointBorderWidth:totals.map((_,i)=>i===lastIdx?2.5:1.5),
    pointHoverRadius:0,
  }];

  if (hasMort) {
    datasets.push({ label:'יתרת משכנתא', data:mortgages, borderColor:'#ef4444', borderWidth:1.5,
      backgroundColor:'transparent', fill:false, tension:.4,
      pointRadius:3, pointBackgroundColor:'#ef4444',
      pointBorderColor:isDark?'#1a1d26':'#fff', pointBorderWidth:1.5, pointHoverRadius:0 });
  }

  // Extended crosshair for main chart (multi-dataset bubbles)
  const mainCrosshairPlugin = {
    id:'mainCrosshair',
    afterDraw(chart) {
      const {ctx, chartArea:{top,bottom,left,right}} = chart;
      const activeEls = chart._active; if (!activeEls?.length) return;
      const idx = activeEls[0].index, xi = activeEls[0].element.x;
      const color = getComputedStyle(document.documentElement).getPropertyValue('--green').trim()||'#0e9e7e';
      const isDarkNow = document.documentElement.getAttribute('data-theme')==='dark';
      ctx.save();
      ctx.beginPath(); ctx.setLineDash([4,5]);
      ctx.strokeStyle = isDarkNow?'rgba(255,255,255,.18)':'rgba(0,0,0,.15)';
      ctx.lineWidth=1.5; ctx.moveTo(xi,top); ctx.lineTo(xi,bottom); ctx.stroke(); ctx.setLineDash([]);
      const dsColors = [color,'#ef4444'];
      chart.data.datasets.forEach((ds,di) => {
        const meta = chart.getDatasetMeta(di); if (meta.hidden) return;
        const el = meta.data[idx]; if (!el) return;
        const yi = el.y, val = ds.data[idx], col = dsColors[di]||color;
        ctx.beginPath(); ctx.arc(xi,yi,6,0,Math.PI*2);
        ctx.fillStyle=col; ctx.strokeStyle=isDarkNow?'#1a1d26':'#fff'; ctx.lineWidth=2;
        ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
        const text=fmt(val); ctx.font="700 13px 'JetBrains Mono', monospace";
        const tw=ctx.measureText(text).width, bw=tw+36, bh=32, br=8, dotR=8;
        const goLeft=xi+dotR+bw+4>right, bx=goLeft?xi-dotR-bw:xi+dotR;
        const byIdeal=yi-bh/2, byLo=Math.max(top+2,yi-bh+8), byHi=Math.min(bottom-bh,yi-8);
        const by=Math.max(byLo,Math.min(byIdeal,byHi));
        const path=()=>{ctx.beginPath();ctx.moveTo(bx+br,by);ctx.lineTo(bx+bw-br,by);ctx.arcTo(bx+bw,by,bx+bw,by+br,br);ctx.lineTo(bx+bw,by+bh-br);ctx.arcTo(bx+bw,by+bh,bx+bw-br,by+bh,br);ctx.lineTo(bx+br,by+bh);ctx.arcTo(bx,by+bh,bx,by+bh-br,br);ctx.lineTo(bx,by+br);ctx.arcTo(bx,by,bx+br,by,br);ctx.closePath();};
        ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=4;
        path();ctx.fillStyle=isDarkNow?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';ctx.fill();ctx.shadowBlur=ctx.shadowOffsetY=0;
        ctx.beginPath();ctx.roundRect?ctx.roundRect(bx+6,by+6,3,bh-12,2):ctx.rect(bx+6,by+6,3,bh-12);ctx.fillStyle=col;ctx.fill();
        path();ctx.strokeStyle=isDarkNow?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)';ctx.lineWidth=1;ctx.stroke();
        const arrowY=yi, arrowBg=isDarkNow?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';
        ctx.beginPath();
        if(goLeft){ctx.moveTo(bx+bw,arrowY-5);ctx.lineTo(bx+bw,arrowY+5);ctx.lineTo(bx+bw+6,arrowY);}
        else{ctx.moveTo(bx,arrowY-5);ctx.lineTo(bx,arrowY+5);ctx.lineTo(bx-6,arrowY);}
        ctx.fillStyle=arrowBg;ctx.fill();
        ctx.fillStyle=isDarkNow?'#f9fafb':'#111827';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.font="700 13px 'JetBrains Mono', monospace";ctx.fillText(text,bx+bw/2+4,by+bh/2);
      });
      ctx.restore();
    }
  };

  const opts = {
    responsive:true, maintainAspectRatio:false,
    animation:{duration:600,easing:'easeOutQuart'},
    plugins:{
      legend:{position:'bottom',labels:{font:{family:"'Heebo',sans-serif",size:12,weight:'700'},color:tickCol,padding:16,boxWidth:10,usePointStyle:true}},
      tooltip:{enabled:false},
    },
    interaction:{mode:'index',intersect:false,axis:'x'},
    scales:{
      y:{grid:{color:gridCol},border:{display:false},
         ticks:{font:{family:"'JetBrains Mono',monospace",size:10,weight:'600'},color:tickCol,maxTicksLimit:5,
                callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K':v}},
      x:{grid:{display:false},border:{display:false},
         ticks:{font:{family:"'Heebo',sans-serif",size:11,weight:'600'},color:tickCol,maxRotation:0}}
    }
  };

  mainChart = new Chart(canvas, {type:'line', data:{labels,datasets}, options:opts, plugins:[mainCrosshairPlugin,lastPointPlugin]});

  let _rafId=null, _touchEndTimer=null;
  const updateChartAt = (clientX) => {
    if (!mainChart) return;
    const rect=canvas.getBoundingClientRect(), xPos=clientX-rect.left;
    const idx=Math.round(mainChart.scales.x.getValueForPixel(xPos));
    const cl=Math.max(0,Math.min(idx,labels.length-1));
    if (mainChart._active?.[0]?.index===cl) return;
    mainChart.setActiveElements(datasets.map((_,di)=>({datasetIndex:di,index:cl})));
    mainChart.update('none');
  };
  canvas.addEventListener('mousemove',e=>{if(_rafId)return;_rafId=requestAnimationFrame(()=>{_rafId=null;updateChartAt(e.clientX);});});
  canvas.addEventListener('mouseleave',()=>{mainChart?.setActiveElements([]);mainChart?.update('none');});
  let _touchRaf=null;
  canvas.addEventListener('touchmove',e=>{e.preventDefault();if(_touchRaf)return;_touchRaf=requestAnimationFrame(()=>{_touchRaf=null;updateChartAt(e.touches[0].clientX);});},{passive:false});
  canvas.addEventListener('touchend',()=>{clearTimeout(_touchEndTimer);_touchEndTimer=setTimeout(()=>{mainChart?.setActiveElements([]);mainChart?.update('none');},800);});
}

function populateDateSelect() {
  // Native select (mobile)
  const sel = document.getElementById('dateSelect');
  if (sel) {
    sel.innerHTML = '<option value="" disabled selected>בחר חודש לפירוט</option>';
    [...records].reverse().forEach(r => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
      sel.appendChild(o);
    });
  }
  // Custom dropdown (desktop)
  const dd = document.getElementById('history-month-dropdown');
  if (!dd) return;
  dd.innerHTML = [...records].reverse().map(r => {
    const lbl = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
    return `<button onclick="selectHistoryMonth('${r.id}')" style="display:flex;width:100%;text-align:right;padding:9px 12px;border:none;border-radius:8px;cursor:pointer;background:transparent;color:var(--ink);font-family:var(--font);font-size:.82rem;font-weight:500;transition:background .12s" onmouseover="this.style.background='var(--border)'" onmouseout="this.style.background='transparent'">${lbl}</button>`;
  }).join('');
}

function toggleHistoryMonthPicker() {
  const dd = document.getElementById('history-month-dropdown');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  dd.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    setTimeout(() => {
      document.addEventListener('click', function closePicker(e) {
        const btn = document.getElementById('history-month-btn');
        if (!dd.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
          dd.style.display = 'none';
          document.removeEventListener('click', closePicker);
        }
      });
    }, 0);
  }
}

function selectHistoryMonth(id) {
  const r = records.find(r => r.id === id);
  if (!r) return;
  const lbl = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  const btn = document.getElementById('history-month-label');
  if (btn) { btn.textContent = lbl; btn.style.color = 'var(--ink)'; }
  const dd = document.getElementById('history-month-dropdown');
  if (dd) dd.style.display = 'none';
  openDetailModal(r);
}

function onDateChange() {
  const r = records.find(r => r.id === document.getElementById('dateSelect')?.value);
  if (r) openDetailModal(r);
}

function openDetailModal(record) {
  let overlay = document.getElementById('detail-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'detail-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
    overlay.onclick = e => { if (e.target === overlay) closeDetailModal(); };
    const box = document.createElement('div');
    box.id = 'detail-modal-box';
    box.style.cssText = `
      background:var(--surface);
      border-radius:16px;
      width:100%;
      max-width:480px;
      max-height:85vh;
      overflow-y:auto;
      animation:fadeUp .22s ease;
      scrollbar-width:thin;
      scrollbar-color:var(--border) transparent;
      margin:16px;
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const box = document.getElementById('detail-modal-box');
  const dateLabel = new Date(record.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  box.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--surface);z-index:1;border-radius:16px 16px 0 0">
      <div style="font-size:.95rem;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:6px">${ICONS_JS.calendar} ${dateLabel}</div>
      <button onclick="closeDetailModal()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex;padding:4px;border-radius:6px;transition:background .15s" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div id="detail-modal-content" style="padding:4px 0 20px"></div>`;
  const tmp = document.createElement('div');
  tmp.id = 'history-detail';
  document.getElementById('detail-modal-content').appendChild(tmp);
  renderDetailCard(record);
}

function closeDetailModal() {
  const o = document.getElementById('detail-modal-overlay');
  if (o) o.style.display = 'none';
  document.body.style.overflow = '';
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

let _retSaveTimer = null;						 
async function saveRetirementSettings() {
  const s={};
  ['ret-current-age','ret-age','ret-return','ret-monthly'].forEach(id=>{
    const el=document.getElementById(id); if(el) s[id]=el.value;
  });
  localStorage.setItem(RET_KEY,JSON.stringify(s));
  // Also save to Supabase so it syncs across devices
  if (currentUser) {
    clearTimeout(_retSaveTimer);
    _retSaveTimer = setTimeout(async () => {
      try {
        await db.auth.updateUser({ data: { retirement_settings: JSON.stringify(s) } });
      } catch(e) { /* silent — localStorage already saved */ }
    }, 500);
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

  const isDark = document.documentElement.getAttribute('data-theme')==='dark';
  const gridCol = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)';
  const tickCol = isDark ? '#4b5563' : '#9ca3af';
  const colorGreen='#0e9e7e', colorBlue='#4f8ef7';

  const histPoints=histRecords.map(r=>{
    const d=new Date(r.record_date);
    const age=currentAge-Math.round((new Date()-d)/(365.25*24*3600*1000));
    return {x:`גיל ${Math.round(age)}`,y:calcRecord(r).totalAssets};
  });
  const allLabels=[...new Set([...histPoints,...projByYear].map(p=>p.x))]
    .sort((a,b)=>parseInt(a.replace('גיל ',''))-parseInt(b.replace('גיל ','')));

  // Sort histPoints by age ascending so latest record wins per age label
  const sortedHist = [...histPoints].sort((a,b)=>
    parseInt(a.x.replace('גיל ',''))-parseInt(b.x.replace('גיל ','')));
  const histMap = new Map();
  sortedHist.forEach(p => histMap.set(p.x, p.y)); // later entries overwrite earlier same-age ones
  const histData = allLabels.map(lbl => histMap.get(lbl) ?? null);
  const projData = allLabels.map(lbl => projByYear.find(p=>p.x===lbl)?.y ?? null);

  const chartH = canvas.parentElement?.offsetHeight || 260;
  const ctx2 = canvas.getContext('2d');

  const gradGreen = ctx2.createLinearGradient(0,0,0,chartH);
  gradGreen.addColorStop(0, colorGreen+(isDark?'38':'28'));
  gradGreen.addColorStop(0.7, colorGreen+'08');
  gradGreen.addColorStop(1,   colorGreen+'00');

  const gradBlue = ctx2.createLinearGradient(0,0,0,chartH);
  gradBlue.addColorStop(0, colorBlue+(isDark?'28':'18'));
  gradBlue.addColorStop(0.7, colorBlue+'06');
  gradBlue.addColorStop(1,   colorBlue+'00');

  const dsColors = [colorGreen, colorBlue];

  /* ── crosshair + bubble plugin ── */
  const retCrosshairPlugin = {
    id:'retCrosshair',
    afterDraw(chart) {
      const {ctx,chartArea:{top,bottom,left,right}} = chart;
      const activeEls = chart._active; if (!activeEls?.length) return;
      const idx = activeEls[0].index, xi = activeEls[0].element.x;
      const isDarkNow = document.documentElement.getAttribute('data-theme')==='dark';
      const ageLabel = allLabels[idx] || '';
      ctx.save();

      // crosshair line
      ctx.beginPath(); ctx.setLineDash([4,5]);
      ctx.strokeStyle = isDarkNow?'rgba(255,255,255,.18)':'rgba(0,0,0,.15)';
      ctx.lineWidth=1.5; ctx.moveTo(xi,top); ctx.lineTo(xi,bottom); ctx.stroke(); ctx.setLineDash([]);

      // collect all valid items (origY = real dot position)
      const items=[];
      chart.data.datasets.forEach((ds,di) => {
        const meta = chart.getDatasetMeta(di); if (meta.hidden) return;
        const el = meta.data[idx]; if (!el) return;
        const val = ds.data[idx]; // now a plain number or null
        if (val==null) return;
        items.push({origY:el.y, bubbleY:el.y, val, col:dsColors[di]||colorGreen});
      });

      // draw dots at real positions first
      items.forEach(({origY,col}) => {
        ctx.beginPath(); ctx.arc(xi,origY,6,0,Math.PI*2);
        ctx.fillStyle=col; ctx.strokeStyle=isDarkNow?'#1a1d26':'#fff'; ctx.lineWidth=2;
        ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
      });

      // de-overlap bubble positions (push apart if too close)
      const BH=34, GAP=6;
      items.sort((a,b)=>a.origY-b.origY);
      for (let i=1;i<items.length;i++) {
        if (items[i].bubbleY - items[i-1].bubbleY < BH+GAP)
          items[i].bubbleY = items[i-1].bubbleY + BH + GAP;
      }
      // clamp to chart area
      items.forEach(it => {
        it.bubbleY = Math.max(top+BH/2+2, Math.min(bottom-BH/2-2, it.bubbleY));
      });

      // if נכסים בפועל exists at this point, show only its bubble (not תחזית)
      const bubbleItems = items.length > 1 && items.some(it=>it.col===colorGreen)
        ? items.filter(it=>it.col===colorGreen)
        : items;

      // draw bubbles
      bubbleItems.forEach(({origY,bubbleY,val,col}) => {
        const text = `${ageLabel}  ${fmt(val)}`;
        ctx.font="700 12px 'JetBrains Mono', monospace";
        const tw=ctx.measureText(text).width, bw=tw+36, br=8, dotR=8;
        const by=bubbleY-BH/2;
        const goLeft=xi+dotR+bw+4>right, bx=goLeft?xi-dotR-bw:xi+dotR;
        const path=()=>{ctx.beginPath();ctx.moveTo(bx+br,by);ctx.lineTo(bx+bw-br,by);ctx.arcTo(bx+bw,by,bx+bw,by+br,br);ctx.lineTo(bx+bw,by+BH-br);ctx.arcTo(bx+bw,by+BH,bx+bw-br,by+BH,br);ctx.lineTo(bx+br,by+BH);ctx.arcTo(bx,by+BH,bx,by+BH-br,br);ctx.lineTo(bx,by+br);ctx.arcTo(bx,by,bx+br,by,br);ctx.closePath();};
        ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=18;ctx.shadowOffsetY=4;
        path();ctx.fillStyle=isDarkNow?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';ctx.fill();ctx.shadowBlur=ctx.shadowOffsetY=0;
        ctx.beginPath();ctx.roundRect?ctx.roundRect(bx+6,by+6,3,BH-12,2):ctx.rect(bx+6,by+6,3,BH-12);ctx.fillStyle=col;ctx.fill();
        path();ctx.strokeStyle=isDarkNow?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)';ctx.lineWidth=1;ctx.stroke();
        // arrow pointing to real dot position
        const arrowBg=isDarkNow?'rgba(15,18,25,.92)':'rgba(255,255,255,.95)';
        ctx.beginPath();
        if(goLeft){ctx.moveTo(bx+bw,origY-5);ctx.lineTo(bx+bw,origY+5);ctx.lineTo(bx+bw+6,origY);}
        else{ctx.moveTo(bx,origY-5);ctx.lineTo(bx,origY+5);ctx.lineTo(bx-6,origY);}
        ctx.fillStyle=arrowBg;ctx.fill();
        ctx.fillStyle=isDarkNow?'#f9fafb':'#111827';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.font="700 12px 'JetBrains Mono', monospace";ctx.fillText(text,bx+bw/2+4,by+BH/2);
      });
      ctx.restore();
    }
  };

  /* ── last-point label plugin ── */
  const retLastPointPlugin = {
    id:'retLastPoint',
    afterDraw(chart) {
      const isDarkNow = document.documentElement.getAttribute('data-theme')==='dark';
      chart.data.datasets.forEach((ds,di) => {
        const meta = chart.getDatasetMeta(di); if(meta.hidden) return;
        const last = meta.data[meta.data.length-1]; if(!last) return;
        const col = dsColors[di]||colorGreen;
        // find last non-null value
        const dsArr = ds.data;
        let lastNonNullIdx = dsArr.length-1;
        while(lastNonNullIdx>=0 && dsArr[lastNonNullIdx]==null) lastNonNullIdx--;
        if(lastNonNullIdx<0) return;
        const val = dsArr[lastNonNullIdx];
        const lastEl = meta.data[lastNonNullIdx]; if(!lastEl) return;
        const {ctx} = chart; ctx.save();
        if(!chart._active?.length) {
          const text=fmt(val); ctx.font="600 10px 'JetBrains Mono', monospace";
          const tw=ctx.measureText(text).width, bw=tw+14, bh=18;
          const {left,right}=chart.chartArea;
          let bx=lastEl.x-bw-10;
          if(bx<left) bx=Math.min(lastEl.x+10, right-bw);
          const by=lastEl.y-bh/2;
          ctx.beginPath(); ctx.roundRect?ctx.roundRect(bx,by,bw,bh,5):ctx.rect(bx,by,bw,bh);
          ctx.fillStyle=isDarkNow?'rgba(15,18,25,.9)':'rgba(255,255,255,.9)'; ctx.fill();
          ctx.strokeStyle=col; ctx.lineWidth=1; ctx.stroke();
          ctx.fillStyle=col; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,bx+bw/2,by+bh/2);
        }
        ctx.beginPath(); ctx.arc(lastEl.x,lastEl.y,5.5,0,Math.PI*2);
        ctx.fillStyle=col; ctx.strokeStyle=isDarkNow?'#1a1d26':'#fff'; ctx.lineWidth=2.5;
        ctx.shadowColor=col; ctx.shadowBlur=8; ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
        ctx.restore();
      });
    }
  };

  const opts = {
    responsive:true, maintainAspectRatio:false,
    animation:{duration:600,easing:'easeOutQuart'},
    plugins:{
      legend:{position:'bottom',labels:{font:{family:"'Heebo',sans-serif",size:12,weight:'700'},color:tickCol,padding:16,boxWidth:10,usePointStyle:true}},
      tooltip:{enabled:false},
    },
    interaction:{mode:'index',intersect:false,axis:'x'},
    scales:{
      y:{grid:{color:gridCol},border:{display:false},
         ticks:{font:{family:"'JetBrains Mono',monospace",size:10,weight:'600'},color:tickCol,maxTicksLimit:5,
                callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K':v}},
      x:{type:'category',grid:{display:false},border:{display:false},
         ticks:{font:{family:"'Heebo',sans-serif",size:11,weight:'600'},color:tickCol,maxRotation:0}}
    }
  };

  retChart=new Chart(canvas,{type:'line',data:{labels:allLabels,datasets:[
    {label:'נכסים בפועל', data:histData, borderColor:colorGreen, borderWidth:2.5,
     backgroundColor:gradGreen, fill:true, tension:.4,
     spanGaps:false, pointRadius:0, pointHoverRadius:0},
    {label:`תחזית (${annualReturn}%)`, data:projData, borderColor:colorBlue, borderWidth:2,
     backgroundColor:gradBlue, fill:true, tension:.4, borderDash:[7,5],
     spanGaps:false, pointRadius:0, pointHoverRadius:0}
  ]},options:opts, plugins:[retCrosshairPlugin,retLastPointPlugin]});

  let _rafId=null, _touchEndTimer=null;
  const updateAt=(clientX)=>{
    if(!retChart) return;
    const rect=canvas.getBoundingClientRect(), xPos=clientX-rect.left;
    const idx=Math.round(retChart.scales.x.getValueForPixel(xPos));
    const cl=Math.max(0,Math.min(idx,allLabels.length-1));
    if(retChart._active?.[0]?.index===cl) return;
    const activeEls=[];
    [0,1].forEach(di=>{
      const meta=retChart.getDatasetMeta(di);
      if(meta?.data?.[cl]) activeEls.push({datasetIndex:di,index:cl});
    });
    retChart.setActiveElements(activeEls);
    retChart.update('none');
  };
  canvas.addEventListener('mousemove',e=>{if(_rafId)return;_rafId=requestAnimationFrame(()=>{_rafId=null;updateAt(e.clientX);});});
  canvas.addEventListener('mouseleave',()=>{retChart?.setActiveElements([]);retChart?.update('none');});
  let _touchRaf=null;
  canvas.addEventListener('touchmove',e=>{e.preventDefault();if(_touchRaf)return;_touchRaf=requestAnimationFrame(()=>{_touchRaf=null;updateAt(e.touches[0].clientX);});},{passive:false});
  canvas.addEventListener('touchend',()=>{clearTimeout(_touchEndTimer);_touchEndTimer=setTimeout(()=>{retChart?.setActiveElements([]);retChart?.update('none');},800);});
}

function renderRetirementBreakdown(start,projected,years,monthly) {
  const contributions=monthly*years*12;
  const organic=Math.max(0,projected-start-contributions);
  const bars=[
    {label:'נכסים נוכחיים',value:start,color:'#0e9e7e',pct:(start/projected*100).toFixed(1)},
    {label:'חיסכון עתידי', value:contributions,color:'#4f8ef7',pct:(contributions/projected*100).toFixed(1)},
    {label:'תשואה',         value:organic,color:'#f59e0b',pct:(organic/projected*100).toFixed(1)},
  ].filter(b=>b.value>0);

  const monthlyPension = projected * 0.04 / 12;

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
    </div>`).join('')}
    <div class="rbd-row">
      <div class="rbd-info">
        <span class="rbd-dot" style="background:var(--green)"></span>
        <span class="rbd-label">קצבה חודשית צפויה</span>
      </div>
      <div class="rbd-right">
        <span style="font-size:.72rem;color:var(--ink-4);margin-left:6px">כלל 4% שנתי</span>
        <span class="rbd-val blur-text">${fmt(monthlyPension)}</span>
        <span class="rbd-pct">/ חודש</span>
      </div>
    </div>`;
  applyBlur();
}

/* ── CHART OPTIONS ──────────────────────────────────── */
function chartOptions() {
  return {
    responsive:true, maintainAspectRatio:false,
    plugins:{
      legend:{position:'bottom',labels:{font:{family:"'Heebo',sans-serif",size:12,weight:'700'},color:'#6b7280',padding:16,boxWidth:12,usePointStyle:true}},
      tooltip:{rtl:true,backgroundColor:'#111827',titleColor:'#f9fafb',bodyColor:'#9ca3af',borderColor:'#374151',borderWidth:1,padding:12,
        titleFont:{family:"'Outfit',sans-serif",weight:'700'},bodyFont:{family:"'JetBrains Mono',monospace",size:12},
        callbacks:{label:ctx=>` ${ctx.dataset.label}: ${fmt(ctx.raw)}`}}
    },
    scales:{
      y:{grid:{color:'rgba(0,0,0,.05)'},border:{color:'#e5e9f0'},ticks:{font:{family:"'JetBrains Mono',monospace",size:10,weight:'600'},color:'#9ca3af',
          callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M₪':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K₪':v+'₪'}},
      x:{grid:{display:false},border:{color:'#e5e9f0'},ticks:{font:{family:"'Heebo',sans-serif",size:11,weight:'600'},color:'#9ca3af'}}
    }
  };
}

/* ══ EXPORT EXCEL ════════════════════════════════════ */
function exportExcel() {
  if (!records.length) { showToast('אין נתונים לייצוא'); return; }

  const headers = ['תאריך', ...categories.map(c => c.label), 'משכנתא', 'סה"כ נכסים', 'שווי נקי (אחרי מס פנסיה)', 'הערות'];
  const rows = [...records].sort((a,b) => new Date(a.record_date)-new Date(b.record_date)).map(r => {
    const c   = calcRecord(r);
    const { netAfterTax } = calcNetWorthAfterTax(c);
    const d   = new Date(r.record_date).toLocaleDateString('he-IL', {year:'numeric', month:'long'});
    const cats = categories.map(cat => c[cat.key] || 0);
    return [d, ...cats, c.mortgage || 0, c.totalAssets, netAfterTax, r.notes || ''];
  });

  // Build CSV with BOM for Hebrew support in Excel
  const bom = '\uFEFF';
  const escape = v => typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))
    ? `"${v.replace(/"/g,'""')}"` : v;
  const csv = bom + [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `budgy-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('הקובץ הורד בהצלחה ✅');
}

/* ══ COLOR THEMES ════════════════════════════════════ */
const COLOR_THEMES = [
  { id:'green',  label:'ירוק',  primary:'#0e9e7e', mid:'#13b891', dark:'#0a7a62', light:'rgba(14,158,126,.12)',  glow:'rgba(14,158,126,.18)',  shadowSm:'0 4px 14px rgba(14,158,126,.5)',  shadow:'0 6px 24px rgba(14,158,126,.25)' },
  { id:'blue',   label:'כחול',  primary:'#3b82f6', mid:'#60a5fa', dark:'#1d4ed8', light:'rgba(59,130,246,.12)', glow:'rgba(59,130,246,.18)', shadowSm:'0 4px 14px rgba(59,130,246,.5)', shadow:'0 6px 24px rgba(59,130,246,.25)' },
  { id:'purple', label:'סגול',  primary:'#8b5cf6', mid:'#a78bfa', dark:'#6d28d9', light:'rgba(139,92,246,.12)', glow:'rgba(139,92,246,.18)', shadowSm:'0 4px 14px rgba(139,92,246,.5)', shadow:'0 6px 24px rgba(139,92,246,.25)' },
  { id:'rose',   label:'ורוד',  primary:'#f43f5e', mid:'#fb7185', dark:'#be123c', light:'rgba(244,63,94,.12)',  glow:'rgba(244,63,94,.18)',  shadowSm:'0 4px 14px rgba(244,63,94,.5)',  shadow:'0 6px 24px rgba(244,63,94,.25)'  },
  { id:'amber',  label:'זהב',   primary:'#f59e0b', mid:'#fbbf24', dark:'#b45309', light:'rgba(245,158,11,.12)', glow:'rgba(245,158,11,.18)', shadowSm:'0 4px 14px rgba(245,158,11,.5)', shadow:'0 6px 24px rgba(245,158,11,.25)' },
  { id:'mocha',      label:'מוקה',       primary:'#9c6b4e', mid:'#b5856a', dark:'#75502a', light:'rgba(156,107,78,.12)',  glow:'rgba(156,107,78,.18)',  shadowSm:'0 4px 14px rgba(156,107,78,.5)',  shadow:'0 6px 24px rgba(156,107,78,.25)'  },
  { id:'sand',       label:'חול',        primary:'#c8a26a', mid:'#d9bb8e', dark:'#a07842', light:'rgba(200,162,106,.12)', glow:'rgba(200,162,106,.18)', shadowSm:'0 4px 14px rgba(200,162,106,.5)', shadow:'0 6px 24px rgba(200,162,106,.25)' },
  { id:'slate',      label:'פלדה',       primary:'#6c8eae', mid:'#8aaac8', dark:'#4d6e8c', light:'rgba(108,142,174,.12)', glow:'rgba(108,142,174,.18)', shadowSm:'0 4px 14px rgba(108,142,174,.5)', shadow:'0 6px 24px rgba(108,142,174,.25)' },
  { id:'terracotta', label:'טרקוטה',     primary:'#c0614a', mid:'#d4806c', dark:'#963d2a', light:'rgba(192,97,74,.12)',  glow:'rgba(192,97,74,.18)',  shadowSm:'0 4px 14px rgba(192,97,74,.5)',  shadow:'0 6px 24px rgba(192,97,74,.25)'  },
  { id:'sage',       label:'מרווה',      primary:'#6a9e78', mid:'#88b894', dark:'#4a7a58', light:'rgba(106,158,120,.12)', glow:'rgba(106,158,120,.18)', shadowSm:'0 4px 14px rgba(106,158,120,.5)', shadow:'0 6px 24px rgba(106,158,120,.25)' },
  { id:'midnight',   label:'חצות',      primary:'#5c6bc0', mid:'#7986cb', dark:'#3949ab', light:'rgba(92,107,192,.12)',  glow:'rgba(92,107,192,.18)',  shadowSm:'0 4px 14px rgba(92,107,192,.5)',  shadow:'0 6px 24px rgba(92,107,192,.25)'  },
  { id:'rosegold',   label:'זהב ורדרד', primary:'#c27080', mid:'#d4909e', dark:'#9a4d5e', light:'rgba(194,112,128,.12)', glow:'rgba(194,112,128,.18)', shadowSm:'0 4px 14px rgba(194,112,128,.5)', shadow:'0 6px 24px rgba(194,112,128,.25)' },
  { id:'olive',      label:'זית',        primary:'#7d9240', mid:'#97ac5a', dark:'#5d6e2c', light:'rgba(125,146,64,.12)',  glow:'rgba(125,146,64,.18)',  shadowSm:'0 4px 14px rgba(125,146,64,.5)',  shadow:'0 6px 24px rgba(125,146,64,.25)'  },
];

function applyColorTheme(themeId) {
  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  const root  = document.documentElement;
  root.style.setProperty('--green',          theme.primary);
  root.style.setProperty('--green-mid',      theme.mid);
  root.style.setProperty('--green-dark',     theme.dark);
  root.style.setProperty('--green-light',    theme.light);
  root.style.setProperty('--green-glow',     theme.glow);
  root.style.setProperty('--green-shadow-sm',theme.shadowSm);
  root.style.setProperty('--shadow-green',   theme.shadow);
  localStorage.setItem('color_theme_v1', themeId);
  // Sync to Supabase
  if (currentUser) db.auth.updateUser({ data: { color_theme: themeId } });
  renderThemePicker();
}

function renderThemePicker() {
  const el = document.getElementById('theme-picker');
  if (!el) return;
  const saved = localStorage.getItem('color_theme_v1') || 'green';
  el.innerHTML = COLOR_THEMES.map(t => `
    <button onclick="applyColorTheme('${t.id}')" title="${t.label}" style="
      width:36px;height:36px;border-radius:50%;background:${t.primary};border:3px solid ${saved===t.id?'var(--ink)':'transparent'};
      cursor:pointer;transition:transform .15s,border-color .15s;outline:none;
      ${saved===t.id?'transform:scale(1.15)':''}
    "></button>
  `).join('');
}

function initColorTheme() {
  const saved = currentUser?.user_metadata?.color_theme || localStorage.getItem('color_theme_v1') || 'green';
  applyColorTheme(saved);
}
async function exportPDF() {
  if (!records.length) { showToast('אין נתונים להדפסה'); return; }
  showLoader('מכין דוח...');
  await new Promise(r => setTimeout(r, 60));
  hideLoader();

  // ── Data prep ──────────────────────────────────────────────
  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });
  const userName  = currentUser?.user_metadata?.full_name || currentUser?.email || '';
  const today     = new Date().toLocaleDateString('he-IL', { year:'numeric', month:'long', day:'numeric' });

  let deltaAmt = 0, deltaPct = '0.0', avgGrowth = 0, growthSign = '+', growthColor = '#0e9e7e';
  let bestCat = null, bestDelta = 0;
  if (records.length >= 2) {
    const prev  = calcRecord(records[records.length - 2]);
    deltaAmt    = calc.totalAssets - prev.totalAssets;
    deltaPct    = prev.totalAssets ? Math.abs(deltaAmt / prev.totalAssets * 100).toFixed(1) : '0.0';
    avgGrowth   = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length - 1);
    growthSign  = deltaAmt >= 0 ? '+' : '-';
    growthColor = deltaAmt >= 0 ? '#0e9e7e' : '#ef4444';
    // Best-performing category this month
    categories.forEach(c => {
      const d = (calc[c.key] || 0) - (prev[c.key] || 0);
      if (d > bestDelta) { bestDelta = d; bestCat = c; }
    });
  }

  const mortInstId = localStorage.getItem('mortgage_inst_v1') || latest.values?._mortgage_inst;
  const mortInst   = mortInstId ? getInstitution(mortInstId) : null;
  const liquid     = categories.filter(c => isLiquidCat(c)).reduce((s,c) => s + (calc[c.key]||0), 0);
  const nonLiquid  = calc.totalAssets - liquid;
  const liquidPct  = calc.totalAssets ? Math.round(liquid / calc.totalAssets * 100) : 0;

  // ── Sparkline SVG for each category (last 6 months) ───────
  function sparkline(catKey) {
    const vals = records.slice(-6).map(r => (r.values||{})[catKey] || 0);
    if (vals.every(v => v === 0)) return '';
    const max = Math.max(...vals); if (!max) return '';
    const W = 52, H = 20;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * W;
      const y = H - (v / max) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const isPos = vals[vals.length-1] >= vals[0];
    const col   = isPos ? '#0e9e7e' : '#ef4444';
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  // ── Category rows with custom fields ──────────────────────
  const catRows = categories.map((cat, i) => {
    const inst   = cat.institution_id ? getInstitution(cat.institution_id) : null;
    const val    = calc[cat.key] || 0;
    const pct    = calc.totalAssets ? (val / calc.totalAssets * 100).toFixed(1) : '0.0';
    const bar    = Math.round(parseFloat(pct));
    const liq    = isLiquidCat(cat);
    const spark  = sparkline(cat.key);
    const fields = cat.custom_fields || [];
    // Only render custom fields that have a non-empty value
    const filledFields = fields.filter(f => f.value !== '' && f.value !== null && f.value !== undefined);
    const cfHtml = filledFields.length
      ? '<div style="margin-top:6px;padding-top:6px;border-top:1px solid #f3f4f6;display:flex;flex-wrap:wrap;gap:5px">'
        + filledFields.map(f => {
          let dv = f.value;
          if (f.type === 'date') {
            const d = new Date(f.value); if (!isNaN(d)) dv = d.toLocaleDateString('he-IL', { month:'long', year:'numeric' });
          } else if (f.type === 'number') {
            dv = parseFloat(f.value).toLocaleString('he-IL');
          }
          return `<span style="font-size:.67rem;color:#6b7280;background:#f3f4f6;padding:2px 8px;border-radius:4px;border:1px solid #e5e7eb;white-space:nowrap">${f.label}: <strong style="color:#374151">${dv}</strong></span>`;
        }).join('')
        + '</div>'
      : '';

    // Logo — institution favicon, or default ₪ icon
    const logoHtml = inst
      ? `<img src="https://www.google.com/s2/favicons?domain=${inst.domain}&sz=32"
             width="22" height="22"
             style="border-radius:5px;object-fit:contain;flex-shrink:0;margin-top:1px"
             onerror="this.style.display='none'"/>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;background:#f3f4f6;border-radius:5px;padding:3px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

    return `<tr style="page-break-inside:avoid">
      <td style="padding:11px 14px">
        <div style="display:flex;align-items:flex-start;gap:9px">
          ${logoHtml}
          <div style="min-width:0">
            <div style="font-weight:700;color:#111827;font-size:.875rem">${cat.label}</div>
            ${inst ? `<div style="font-size:.7rem;color:#0e9e7e;margin-top:1px;font-weight:500">${inst.name}</div>` : ''}
            ${cfHtml}
          </div>
        </div>
      </td>
      <td style="text-align:left;font-family:'Courier New',monospace;font-weight:700;font-size:.9rem;white-space:nowrap;padding:11px 14px">${fmt(val)}</td>
      <td style="width:140px;padding:11px 14px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="flex:1;height:5px;background:#f3f4f6;border-radius:3px;overflow:hidden">
            <div style="width:${bar}%;height:100%;background:${liq?'#0e9e7e':'#f59e0b'};border-radius:3px"></div>
          </div>
          <span style="font-size:.7rem;color:#6b7280;min-width:34px;text-align:right">${pct}%</span>
        </div>
      </td>
      <td style="padding:11px 14px">${spark}</td>
    </tr>`;
  }).join('');

  // ── History rows ───────────────────────────────────────────
  const histRows = [...records].reverse().slice(0, 12).map((r, i) => {
    const c    = calcRecord(r);
    const d    = new Date(r.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });
    const idx  = records.length - 1 - i;
    const prev = idx > 0 ? calcRecord(records[idx - 1]) : null;
    let chgHtml = '—';
    if (prev) {
      const chg = c.totalAssets - prev.totalAssets;
      const pp  = prev.totalAssets ? (chg / prev.totalAssets * 100).toFixed(1) : null;
      if (pp !== null) chgHtml = `<span style="color:${chg>=0?'#0e9e7e':'#ef4444'};font-weight:700">${chg>=0?'+':''}${pp}%</span>`;
    }
    return `<tr style="background:${i%2===0?'#ffffff':'#fafafa'};page-break-inside:avoid">
      <td style="text-align:right;padding:9px 14px">${d}</td>
      <td style="text-align:right;font-family:'Courier New',monospace;font-weight:600;padding:9px 14px">${fmt(c.totalAssets)}</td>
      <td style="text-align:right;padding:9px 14px">${c.mortgage > 0 ? `<span style="color:#ef4444">${fmt(c.mortgage)}</span>` : '<span style="color:#d1d5db">—</span>'}</td>
      <td style="text-align:right;padding:9px 14px">${chgHtml}</td>
    </tr>`;
  }).join('');

  // ── Hero cards ─────────────────────────────────────────────
  const deltaSubHtml = records.length >= 2
    ? `<div style="font-size:.72rem;margin-top:5px;color:${growthColor};font-weight:700">${growthSign}${deltaPct}% מחודש קודם</div>` : '';

  const card2Html = calc.mortgage > 0
    ? `<div class="hero-card danger"><div class="hc-label">יתרת משכנתא${mortInst?' · '+mortInst.name:''}</div><div class="hc-val">${fmt(calc.mortgage)}</div></div>
       <div class="hero-card warning"><div class="hc-label">שווי נקי</div><div class="hc-val">${fmt(calc.netWorth)}</div></div>`
    : `<div class="hero-card liq"><div class="hc-label">נכסים נזילים</div><div class="hc-val">${fmt(liquid)}</div><div style="font-size:.72rem;margin-top:5px;color:#0e9e7e;font-weight:600">${liquidPct}% מהתיק</div></div>
       <div class="hero-card neutral"><div class="hc-label">חודשים מתועדים</div><div class="hc-val" style="font-size:2rem">${records.length}</div><div style="font-size:.72rem;margin-top:5px;color:#6b7280">צמיחה ממוצעת ${fmt(Math.round(avgGrowth))}/חודש</div></div>`;

  // ── Donut-style liquidity bar SVG ──────────────────────────
  const liqBarHtml = `
    <div style="margin-top:8px;margin-bottom:4px">
      <div style="display:flex;height:10px;border-radius:5px;overflow:hidden">
        <div style="width:${liquidPct}%;background:#0e9e7e"></div>
        <div style="flex:1;background:#f59e0b"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:.72rem;color:#6b7280">
        <span style="color:#0e9e7e;font-weight:600">נזיל ${liquidPct}% — ${fmt(liquid)}</span>
        <span style="color:#f59e0b;font-weight:600">לא נזיל ${100-liquidPct}% — ${fmt(nonLiquid)}</span>
      </div>
    </div>`;

  // ── Best category badge ────────────────────────────────────
  const bestBadge = bestCat && bestDelta > 0
    ? `<div style="margin-top:4px;font-size:.72rem;color:#0e9e7e;font-weight:600">📈 ${bestCat.label} +${fmt(bestDelta)} החודש</div>` : '';

  // ── Inline SVG line chart from raw data (avoids CORS/canvas issues) ──
  function buildSvgChart() {
    const pts = records.slice(-18);
    if (pts.length < 2) return '';
    const vals   = pts.map(r => calcRecord(r).totalAssets);
    const labels = pts.map(r => new Date(r.record_date).toLocaleDateString('he-IL', { month:'short', year:'2-digit' }));

    // Generous padding: top for value labels, right so last dot+label don't clip
    const W = 700, H = 200, padL = 14, padR = 20, padT = 36, padB = 38;
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const range = maxV - minV || 1;
    const xStep = (W - padL - padR) / (vals.length - 1);
    const toX = i => padL + i * xStep;
    const toY = v => padT + (1 - (v - minV) / range) * (H - padT - padB);

    const fmtShort = v => v >= 1e6 ? (v/1e6).toFixed(2)+'M' : v >= 1000 ? Math.round(v/1000)+'K' : Math.round(v);

    // Polyline & area
    const linePoints = vals.map((v,i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
    const areaPath   = `M${toX(0).toFixed(1)},${toY(vals[0]).toFixed(1)} `
      + vals.map((v,i) => `L${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
      + ` L${toX(vals.length-1).toFixed(1)},${(H-padB).toFixed(1)} L${toX(0).toFixed(1)},${(H-padB).toFixed(1)} Z`;

    // Y axis gridlines — lines only, no value labels (values shown on dots)
    const gridLines = [0, 0.5, 1].map(t => {
      const y = (padT + (1-t)*(H-padT-padB)).toFixed(1);
      return `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="#f0f2f5" stroke-width="1"/>`;
    }).join('');

    // X axis labels
    const step = Math.ceil(labels.length / 8);
    const xLabels = labels.map((l,i) => {
      if (i % step !== 0 && i !== labels.length-1) return '';
      return `<text x="${toX(i).toFixed(1)}" y="${(H-padB+16).toFixed(0)}" font-size="9" fill="#9ca3af" font-family="'Heebo',sans-serif" text-anchor="middle">${l}</text>`;
    }).join('');

    // Best month index (highest MoM growth)
    const bestIdx = vals.reduce((bi,v,i,a) => i>0 && (v-a[i-1])>(a[bi]-a[bi-1]) ? i : bi, 1);

    // Dots, value labels above each dot
    // Decide which dots get a label: always first, last, best; every ~3rd for others if crowded
    const showLabel = i => i===0 || i===vals.length-1 || i===bestIdx || (vals.length<=8) || (i % Math.ceil(vals.length/6) === 0);

    const dotsAndLabels = vals.map((v,i) => {
      const cx  = toX(i).toFixed(1);
      const cy  = toY(v).toFixed(1);
      const isB = i === bestIdx;
      const isL = i === vals.length-1;

      // Dot
      let dot = '';
      if (isB)      dot = `<circle cx="${cx}" cy="${cy}" r="5.5" fill="#f59e0b" stroke="#fff" stroke-width="2"/>`;
      else if (isL) dot = `<circle cx="${cx}" cy="${cy}" r="4.5" fill="#0e9e7e" stroke="#fff" stroke-width="2"/>`;
      else          dot = `<circle cx="${cx}" cy="${cy}" r="2.8" fill="#0e9e7e" stroke="#fff" stroke-width="1.5" opacity="0.75"/>`;

      // Value label above dot
      let lbl = '';
      if (showLabel(i)) {
        const lyFixed = (parseFloat(cy) - 9).toFixed(1);
        const col     = isB ? '#f59e0b' : '#0e9e7e';
        const fw      = (isB || isL) ? 'bold' : 'normal';
        // White background pill for readability
        const txt     = fmtShort(v);
        // Estimate text width to draw background rect
        const tw      = txt.length * 6 + 8;
        const rx      = (parseFloat(cx) - tw/2).toFixed(1);
        const ry      = (parseFloat(lyFixed) - 11).toFixed(1);
        lbl = `<rect x="${rx}" y="${ry}" width="${tw}" height="14" rx="4" fill="white" opacity="0.88"/>
               <text x="${cx}" y="${lyFixed}" font-size="9.5" fill="${col}" font-family="monospace" font-weight="${fw}" text-anchor="middle">${txt}</text>`;
      }
      return lbl + dot;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0e9e7e" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#0e9e7e" stop-opacity="0.01"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaPath}" fill="url(#chartGrad)"/>
      <polyline points="${linePoints}" fill="none" stroke="#0e9e7e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${dotsAndLabels}
      ${xLabels}
    </svg>`;
  }

  const chartHtml = `<div class="section-title">גרף היסטורי</div>
    <div style="background:#f9fafb;border-radius:12px;padding:16px 10px 8px;margin-bottom:28px;border:1px solid #f0f2f5;page-break-inside:avoid">
      ${buildSvgChart()}
    </div>`;

  // ── Assemble HTML ──────────────────────────────────────────
  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Heebo',sans-serif;color:#111827;background:#f1f5f9;direction:rtl;padding:20px 16px 60px}
    .page{max-width:800px;margin:0 auto;background:#fff;border-radius:20px;padding:44px 40px 52px;box-shadow:0 8px 40px rgba(0,0,0,.10)}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:3px solid #0e9e7e}
    .brand{display:flex;align-items:center;gap:14px}
    .logo{width:52px;height:52px;background:linear-gradient(135deg,#0e9e7e,#13b891);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;color:#fff;flex-shrink:0}
    .brand-text h1{font-size:1.4rem;font-weight:900;color:#111827;letter-spacing:-.03em}
    .brand-text p{font-size:.75rem;color:#6b7280;margin-top:2px}
    .header-meta{text-align:left;font-size:.78rem;color:#6b7280;line-height:2}
    .header-meta strong{color:#111827;font-weight:700}
    .hero{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;page-break-inside:avoid}
    .hero-card{padding:18px 16px;border-radius:14px;border:1.5px solid #e5e9f0}
    .hero-card.primary{background:linear-gradient(135deg,#f0fdf9,#dcfdf5);border-color:#6ee7b7}
    .hero-card.danger{background:linear-gradient(135deg,#fff5f5,#fee2e2);border-color:#fca5a5}
    .hero-card.warning{background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#fde68a}
    .hero-card.liq{background:linear-gradient(135deg,#f0fdf9,#ecfdf5);border-color:#a7f3d0}
    .hero-card.neutral{background:#f9fafb;border-color:#e5e9f0}
    .hc-label{font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:7px}
    .hc-val{font-size:1.45rem;font-weight:900;color:#111827;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
    .hero-card.primary .hc-val{color:#0e9e7e}.hero-card.danger .hc-val{color:#dc2626}.hero-card.warning .hc-val{color:#d97706}
    .stats-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:30px;page-break-inside:avoid}
    .ss-item{padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #f0f2f5}
    .ss-label{font-size:.65rem;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
    .ss-val{font-size:.95rem;font-weight:800;color:#111827}
    .section-title{font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#9ca3af;margin:28px 0 10px;display:flex;align-items:center;gap:10px}
    .section-title::after{content:"";flex:1;height:1px;background:#f0f2f5}
    table{width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden}
    th{text-align:right;padding:9px 14px;background:#f8fafc;font-weight:700;color:#374151;border-bottom:2px solid #e5e9f0;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em}
    td{padding:10px 14px;border-bottom:1px solid #f5f6f8;font-size:.84rem;color:#374151;vertical-align:middle}
    tr{page-break-inside:avoid}
    .total-row td{font-weight:800;background:linear-gradient(135deg,#f0fdf9,#ecfdf5);color:#0e9e7e;font-size:.9rem;border-top:2px solid #a7f3d0}
    .liq-section{background:#f9fafb;border-radius:12px;padding:16px 18px;margin-bottom:28px;border:1px solid #f0f2f5;page-break-inside:avoid}
    .section-title{page-break-after:avoid}
    .liq-title{font-size:.72rem;font-weight:700;color:#374151;margin-bottom:8px}
    .footer{margin-top:44px;padding-top:18px;border-top:2px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center}
    .footer-brand{display:flex;align-items:center;gap:8px;font-size:.75rem;color:#9ca3af;font-weight:600}
    .footer-logo{width:20px;height:20px;background:linear-gradient(135deg,#0e9e7e,#13b891);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:900;color:#fff}
    .footer-note{font-size:.7rem;color:#d1d5db}
    .action-bar{position:fixed;bottom:0;left:0;right:0;background:#111827;padding:12px 24px;display:flex;gap:10px;justify-content:center;align-items:center;z-index:99}
    .action-btn{padding:9px 26px;border:none;border-radius:8px;font-family:'Heebo',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;background:#0e9e7e;color:#fff;transition:opacity .15s}
    .action-btn:hover{opacity:.88}
    .action-btn.sec{background:#374151}
    @media print{
      body{background:#fff;padding:0}
      .page{box-shadow:none;border-radius:0;padding:24px 28px}
      .action-bar{display:none}
      *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    }
    @page{margin:6mm;size:A4}
  `;

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8"/>
<title>דוח פיננסי – ${dateLabel}</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>${css}</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="brand">
      <div class="logo">₪</div>
      <div class="brand-text">
        <h1>דוח פיננסי אישי</h1>
        <p>סיכום מצב נכסים ותיק פיננסי · Budgy</p>
      </div>
    </div>
    <div class="header-meta">
      <div><strong>שם:</strong> ${userName}</div>
      <div><strong>דוח לתאריך:</strong> ${dateLabel}</div>
      <div><strong>הופק:</strong> ${today}</div>
    </div>
  </div>

  <!-- HERO CARDS -->
  <div class="hero">
    <div class="hero-card primary">
      <div class="hc-label">סה"כ נכסים</div>
      <div class="hc-val">${fmt(calc.totalAssets)}</div>
      ${deltaSubHtml}${bestBadge}
    </div>
    ${card2Html}
  </div>

  <!-- STATS STRIP -->
  ${records.length >= 2 ? `
  <div class="stats-strip">
    <div class="ss-item">
      <div class="ss-label">שינוי החודש</div>
      <div class="ss-val" style="color:${growthColor}">${growthSign}${fmt(Math.abs(deltaAmt))}</div>
    </div>
    <div class="ss-item">
      <div class="ss-label">שינוי %</div>
      <div class="ss-val" style="color:${growthColor}">${growthSign}${deltaPct}%</div>
    </div>
    <div class="ss-item">
      <div class="ss-label">ממוצע חודשי</div>
      <div class="ss-val">${fmt(Math.round(avgGrowth))}</div>
    </div>
  </div>` : ''}

  <!-- LIQUIDITY SECTION -->
  <div class="liq-section">
    <div class="liq-title">ניתוח נזילות</div>
    ${liqBarHtml}
  </div>

  <!-- CHART -->
  ${chartHtml}

  <!-- ASSETS TABLE — starts on new page -->
  <div class="section-title" style="page-break-before:always;padding-top:8px">פירוט נכסים</div>
  <table>
    <thead>
      <tr>
        <th>קטגוריה / גוף מנהל</th>
        <th style="text-align:left">יתרה</th>
        <th>חלק מהתיק</th>
        <th>6 חודשים</th>
      </tr>
    </thead>
    <tbody>
      ${catRows}
      <tr class="total-row" style="page-break-inside:avoid">
        <td>סה"כ נכסים</td>
        <td style="text-align:left;font-family:'Courier New',monospace">${fmt(calc.totalAssets)}</td>
        <td>100%</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <!-- HISTORY TABLE — starts on new page -->
  <div class="section-title" style="page-break-before:always;padding-top:8px">היסטוריה — 12 חודשים אחרונים</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:right">חודש</th>
        <th style="text-align:right">סה"כ נכסים</th>
        <th style="text-align:right">משכנתא</th>
        <th style="text-align:right">שינוי</th>
      </tr>
    </thead>
    <tbody>${histRows}</tbody>
  </table>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-brand">
      <div class="footer-logo">₪</div>
      מעקב פיננסי — Budgy
    </div>
    <div class="footer-note">סודי — לשימוש אישי ויועצים מורשים בלבד</div>
  </div>

</div><!-- /page -->

<div class="action-bar">
  <button class="action-btn" onclick="window.print()">🖨️ &nbsp;הדפס / שמור PDF</button>
  <button class="action-btn sec" onclick="window.close()">← סגור</button>
</div>
</body>
</html>`;

// --- הצגת לואדר ---
  showLoader('מכין מסמך להדפסה...');

  // 1. ניקוי: מחיקת Iframe קודם אם קיים (זה מה שפותר את התקיעה באייפון בפעם השנייה)
  const existingIframe = document.getElementById('print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  // 2. יצירת Iframe נסתר לחלוטין
  const iframe = document.createElement('iframe');
  iframe.id = 'print-iframe'; // נותנים לו ID כדי שנזהה אותו בפעם הבאה
  iframe.style.position = 'fixed';
  iframe.style.right = '-10000px';
  iframe.style.bottom = '-10000px';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  // 3. הגדרת onload *לפני* כתיבת התוכן — חובה על iOS Safari!
  // ב-iOS בלחיצה השנייה, onload יכול לירות סינכרונית עם doc.close(),
  // לפני שה-handler מוגדר — מה שגורם ללואדר להישאר תקוע.
  let printDone = false;
  function triggerPrint() {
    if (printDone) return;
    printDone = true;
    setTimeout(() => {
      hideLoader();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      // ה-Iframe נשאר ברקע ויימחק בלחיצה הבאה
    }, 2500);
  }

  iframe.onload = triggerPrint;

  // Fallback: אם onload לא ירה תוך 4 שניות (iOS edge case) — מפעילים ידנית
  setTimeout(triggerPrint, 4000);

  // 4. כתיבת ה-HTML של הדוח לתוך ה-Iframe
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
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
  setTimeout(renderThemePicker, 0);
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
    const logo = inst
      ? `<img src="${logoUrl(inst.domain)}" alt="" class="cat-list-logo" onerror="this.style.display='none'"/>`
      : `<div style="width:28px;height:28px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--ink-4)">${ICONS_JS.bank}</div>`;
    const liqIcon = (() => {
      if (cat.liquid_date) {
        const d = new Date(cat.liquid_date);
        const days = Math.ceil((d - new Date()) / 86400000);
        return days > 0
          ? `<span style="font-size:.65rem;color:var(--amber,#f59e0b);font-weight:700;display:inline-flex;align-items:center;gap:2px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${days}י׳</span>`
          : `<span style="font-size:.65rem;color:var(--green);font-weight:700">✓ נזיל</span>`;
      }
      if (cat.is_liquid === false) return `<span style="font-size:.65rem;color:var(--amber,#f59e0b);font-weight:700">לא נזיל</span>`;
      return '';
    })();
    return `
    <div class="cat-item" draggable="true" data-idx="${idx}" data-id="${cat.id}"
         ondragstart="catDragStart(event,${idx})"
         ondragover="catDragOver(event)"
         ondrop="catDrop(event,${idx})"
         ondragend="catDragEnd(event)"
         onclick="if(!event.target.closest('.cat-delete')&&!event.target.closest('.drag-handle'))openCatEdit('${cat.id}')"
         style="cursor:pointer">
      <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
        <span class="drag-handle" title="גרור לשינוי סדר" onclick="event.stopPropagation()">⠿</span>
        ${logo}
        <div style="min-width:0;flex:1">
          <div style="font-size:.875rem;font-weight:600;color:var(--ink)">${cat.label}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:1px">
            ${inst ? `<span style="font-size:.72rem;color:var(--green)">${inst.name}</span>` : ''}
            ${liqIcon}
          </div>
        </div>
      </div>
      <button class="cat-delete" onclick="event.stopPropagation();deleteCategory('${cat.id}')" title="מחק">${ICONS_JS.trash}</button>
    </div>
`;
  }).join('');
}

function updateLiqLabel(catId) {
  const val = document.querySelector(`input[name="liq-${catId}"]:checked`)?.value;
  ['auto','true','false','date'].forEach(v => {
    const el = document.getElementById(`liq-${v}-${catId}`);
    if (!el) return;
    const isActive = v === val;
    const activeColor = (v === 'false' || v === 'date') ? 'var(--amber,#f59e0b)' : 'var(--green)';
    const activeBg    = (v === 'false' || v === 'date') ? 'rgba(245,158,11,.1)'  : 'rgba(14,158,126,.1)';
    el.style.borderColor = isActive ? activeColor : 'var(--border)';
    el.style.color       = isActive ? activeColor : 'var(--ink-3)';
    el.style.background  = isActive ? activeBg    : 'var(--surface2)';
  });
  // Show/hide date picker row
  const dateRow = document.getElementById(`liq-date-row-${catId}`);
  if (dateRow) dateRow.style.display = val === 'date' ? 'block' : 'none';
}

function openCatEdit(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;

  const liqAutoActive  = !cat.liquid_date && (cat.is_liquid === null || cat.is_liquid === undefined);
  const liqTrueActive  = !cat.liquid_date && cat.is_liquid === true;
  const liqFalseActive = !cat.liquid_date && cat.is_liquid === false;
  const liqDateActive  = !!cat.liquid_date;

  function liqStyle(active, color, bg) {
    return `text-align:center;padding:7px 6px;border-radius:8px;border:1.5px solid ${active ? color : 'var(--border)'};font-size:.78rem;font-weight:600;color:${active ? color : 'var(--ink-3)'};background:${active ? bg : 'var(--surface2)'};transition:all .15s`;
  }

  const daysLeft = (() => {
    if (!cat.liquid_date) return null;
    const d = new Date(cat.liquid_date);
    return isNaN(d) ? null : Math.ceil((d - new Date()) / 86400000);
  })();

  document.getElementById('cat-edit-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'cat-edit-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="direction:rtl">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 18px 12px;border-bottom:1px solid var(--border);flex-shrink:0">
        <span style="font-size:.95rem;font-weight:700;color:var(--ink)">${ICONS_JS.edit}&nbsp; עריכת קטגוריה</span>
        <button onclick="closeCatEdit()" class="chb-close">${ICONS_JS.x}</button>
      </div>

      <!-- Scrollable body -->
      <div style="overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 18px 8px;flex:1">

        <!-- Name -->
        <div style="margin-bottom:14px">
          <div class="cf-section-header" style="margin-bottom:6px">שם הקטגוריה</div>
          <input type="text" id="cat-edit-label-${id}" value="${cat.label}"
            placeholder="שם בעברית" class="form-input"
            style="direction:rtl;text-align:right;width:100%"/>
        </div>

        <!-- Category type -->
        <div style="margin-bottom:14px">
          <div class="cf-section-header" style="margin-bottom:6px">סוג קטגוריה</div>
          <button type="button" id="cat-edit-type-btn-${id}" onclick="openCatTypeForEdit('${id}')"
            class="form-input"
            style="width:100%;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:var(--surface2);text-align:right">
            <span>${cat.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <!-- Institution -->
        <div style="margin-bottom:14px">
          <div class="cf-section-header" style="margin-bottom:8px">גוף מנהל</div>
          <div id="cat-edit-inst-display-${id}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:10px;cursor:pointer"
               onclick="openInstModal('${id}')">
            ${cat.institution_id && getInstitution(cat.institution_id) ? `
              <img src="${logoUrl(getInstitution(cat.institution_id).domain)}" width="22" height="22" style="border-radius:5px;object-fit:contain" onerror="this.style.display='none'"/>
              <span style="font-size:.875rem;font-weight:600;color:var(--ink);flex:1">${getInstitution(cat.institution_id).name}</span>
            ` : `
              <span style="color:var(--ink-4);flex:1;font-size:.875rem">${ICONS_JS.bank}&nbsp; בחר גוף מנהל</span>
            `}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- Liquidity toggle -->
        <div style="margin-bottom:14px">
          <div class="cf-section-header" style="margin-bottom:8px">נזילות</div>
          <div style="display:flex;gap:6px">
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="liq-${id}" value="auto" ${liqAutoActive ? 'checked' : ''} style="display:none" onchange="updateLiqLabel('${id}')"/>
              <div class="liq-opt" id="liq-auto-${id}" style="${liqStyle(liqAutoActive,'var(--green)','rgba(14,158,126,.1)')}">אוטומטי</div>
            </label>
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="liq-${id}" value="true" ${liqTrueActive ? 'checked' : ''} style="display:none" onchange="updateLiqLabel('${id}')"/>
              <div class="liq-opt" id="liq-true-${id}" style="${liqStyle(liqTrueActive,'var(--green)','rgba(14,158,126,.1)')}">✓ נזיל</div>
            </label>
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="liq-${id}" value="false" ${liqFalseActive ? 'checked' : ''} style="display:none" onchange="updateLiqLabel('${id}')"/>
              <div class="liq-opt" id="liq-false-${id}" style="${liqStyle(liqFalseActive,'var(--amber,#f59e0b)','rgba(245,158,11,.1)')}">✗ לא נזיל</div>
            </label>
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="liq-${id}" value="date" ${liqDateActive ? 'checked' : ''} style="display:none" onchange="updateLiqLabel('${id}')"/>
              <div class="liq-opt" id="liq-date-${id}" style="${liqStyle(liqDateActive,'var(--amber,#f59e0b)','rgba(245,158,11,.1)')};display:flex;align-items:center;justify-content:center;gap:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>תאריך</div>
            </label>
          </div>
          <div id="liq-date-row-${id}" style="margin-top:10px;display:${liqDateActive ? 'block' : 'none'}">
            <div style="font-size:.72rem;color:var(--ink-4);margin-bottom:5px">הנכס יהפוך נזיל בתאריך:</div>
            <input type="date" id="liq-date-val-${id}" value="${cat.liquid_date || ''}"
              class="form-input" style="direction:ltr;text-align:left;width:100%"/>
            ${daysLeft !== null ? (daysLeft > 0
              ? `<div style="font-size:.72rem;margin-top:5px;color:var(--amber,#f59e0b);font-weight:600">נזיל בעוד ${daysLeft} ימים</div>`
              : `<div style="font-size:.72rem;margin-top:5px;color:var(--green);font-weight:600">✓ כבר נזיל (התאריך עבר)</div>`) : ''}
          </div>
        </div>

        <!-- Custom fields -->
        <div class="cf-section">
          <div class="cf-section-header">שדות נוספים</div>
          <div class="cf-fields-list" id="cf-list-${id}">
            ${renderCustomFieldItems(cat)}
          </div>
          <button class="cf-add-btn" style="margin-top:20px" onclick="showAddCustomFieldForm('${id}')">
            ${ICONS_JS.plus} הוסף שדה
          </button>
        </div>
      </div>

      <!-- Footer buttons -->
      <div style="display:flex;gap:8px;padding:12px 18px 16px;border-top:1px solid var(--border);flex-shrink:0">
        <button class="cat-edit-save-btn" style="flex:1" onclick="saveCatEdit('${id}')">${ICONS_JS.check} שמור</button>
        <button class="cat-edit-cancel-btn" style="min-width:72px" onclick="closeCatEdit()">ביטול</button>
      </div>

    </div>`;
  modal.onclick = e => { if (e.target === modal) closeCatEdit(); };
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById(`cat-edit-label-${id}`)?.focus(), 80);
}

function closeCatEdit() {
  document.getElementById('cat-edit-modal')?.remove();
}

async function saveCatEdit(id) {
  const label = document.getElementById(`cat-edit-label-${id}`)?.value.trim();
  if (!label) return showToast('⚠️ שם לא יכול להיות ריק');

  // Collect current custom fields from the DOM
  const cat = categories.find(c => c.id === id);
  const existingFields = cat?.custom_fields || [];
  const updatedFields = existingFields.map(f => {
    const valEl = document.getElementById(`cf-val-${id}-${f.id}`);
    return valEl ? { ...f, value: valEl.value } : f;
  });

  // Read liquidity setting
  const liqVal = document.querySelector(`input[name="liq-${id}"]:checked`)?.value;
  let is_liquid  = liqVal === 'true' ? true : liqVal === 'false' ? false : null;
  let liquid_date = null;
  if (liqVal === 'date') {
    const dateInput = document.getElementById(`liq-date-val-${id}`)?.value;
    liquid_date = dateInput || null;
    is_liquid   = null; // isLiquidCat handles it via liquid_date
  }

  showLoader('שומר...');
  await db.from('categories').update({ label, custom_fields: updatedFields, is_liquid, liquid_date }).eq('id',id).eq('user_id',currentUser.id);
  await loadCategories();
  hideLoader();
  closeCatEdit();
  renderCategoriesList();
  renderCurrentReport();
  showToast('✅ קטגוריה עודכנה');
}

/* ── CUSTOM FIELDS helpers ───────────────────────────── */

function renderCustomFieldItems(cat) {
  const fields = cat.custom_fields || [];
  if (!fields.length) return `<div class="cf-empty">אין שדות עדיין</div>`;
  return fields.map(f => {
    const inputType = f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text';
    const typeIcon  = f.type === 'date' ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` : f.type === 'number' ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
    return `
    <div class="cf-field-row" id="cf-row-${cat.id}-${f.id}">
      <span class="cf-field-type-icon" title="${f.type}">${typeIcon}</span>
      <span class="cf-field-label">${f.label}</span>
      <input type="${inputType}" id="cf-val-${cat.id}-${f.id}" value="${f.value || ''}"
             class="form-input cf-field-value"
             ${f.type === 'number' ? 'step="0.01"' : ''}
             style="direction:ltr;text-align:right"/>
      <button class="cf-delete-btn" onclick="deleteCustomField('${cat.id}','${f.id}')" title="מחק שדה">${ICONS_JS.trash}</button>
    </div>`;
  }).join('');
}

function showAddCustomFieldForm(catId) {
  document.getElementById('cf-add-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'cf-add-modal';
  modal.className = 'modal-overlay cat-history-overlay';
  modal.style.zIndex = '1003';
  modal.innerHTML = `
    <div class="modal-box" style="direction:rtl">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 18px 12px;border-bottom:1px solid var(--border);flex-shrink:0">
        <span style="font-size:.95rem;font-weight:700;color:var(--ink)">${ICONS_JS.plus}&nbsp; הוסף שדה</span>
        <button onclick="cancelAddCustomField()" class="chb-close">${ICONS_JS.x}</button>
      </div>
      <div style="padding:16px 18px 8px;display:flex;flex-direction:column;gap:10px">
        <div>
          <div class="cf-section-header" style="margin-bottom:6px">שם השדה</div>
          <input type="text" id="cf-new-label-modal" placeholder="למשל: דמי ניהול" class="form-input"
            style="direction:rtl;text-align:right;width:100%"/>
        </div>
        <div>
          <div class="cf-section-header" style="margin-bottom:6px">סוג השדה</div>
          <div style="display:flex;gap:6px">
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="cf-type-modal" value="number" checked style="display:none" onchange="updateCfTypeLabel()"/>
              <div class="liq-opt" id="cf-type-number" style="text-align:center;padding:9px 6px;border-radius:8px;border:1.5px solid var(--green);font-size:.78rem;font-weight:600;color:var(--green);background:rgba(14,158,126,.1);transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg> מספר
              </div>
            </label>
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="cf-type-modal" value="date" style="display:none" onchange="updateCfTypeLabel()"/>
              <div class="liq-opt" id="cf-type-date" style="text-align:center;padding:9px 6px;border-radius:8px;border:1.5px solid var(--border);font-size:.78rem;font-weight:600;color:var(--ink-3);background:var(--surface2);transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> תאריך
              </div>
            </label>
            <label style="flex:1;cursor:pointer">
              <input type="radio" name="cf-type-modal" value="text" style="display:none" onchange="updateCfTypeLabel()"/>
              <div class="liq-opt" id="cf-type-text" style="text-align:center;padding:9px 6px;border-radius:8px;border:1.5px solid var(--border);font-size:.78rem;font-weight:600;color:var(--ink-3);background:var(--surface2);transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> טקסט
              </div>
            </label>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;padding:12px 18px 16px;border-top:1px solid var(--border)">
        <button class="cat-edit-save-btn" style="flex:1" onclick="confirmAddCustomField('${catId}')">${ICONS_JS.check} הוסף</button>
        <button class="cat-edit-cancel-btn" style="min-width:72px" onclick="cancelAddCustomField()">ביטול</button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) cancelAddCustomField(); };
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('cf-new-label-modal')?.focus(), 80);
  // store catId for confirmAddCustomField
  modal.dataset.catId = catId;
}

function updateCfTypeLabel() {
  const val = document.querySelector('input[name="cf-type-modal"]:checked')?.value;
  ['number','date','text'].forEach(v => {
    const el = document.getElementById(`cf-type-${v}`);
    if (!el) return;
    const active = v === val;
    el.style.borderColor = active ? 'var(--green)' : 'var(--border)';
    el.style.color       = active ? 'var(--green)' : 'var(--ink-3)';
    el.style.background  = active ? 'rgba(14,158,126,.1)' : 'var(--surface2)';
  });
}

function cancelAddCustomField() {
  document.getElementById('cf-add-modal')?.remove();
}

async function confirmAddCustomField(catId) {
  const labelEl = document.getElementById('cf-new-label-modal');
  const type    = document.querySelector('input[name="cf-type-modal"]:checked')?.value || 'number';
  const label   = labelEl?.value.trim();
  if (!label) return showToast('⚠️ יש להזין שם לשדה');

  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  // Collect current values from DOM before mutating
  const existingFields = cat.custom_fields || [];
  const updatedExisting = existingFields.map(f => {
    const valEl = document.getElementById(`cf-val-${catId}-${f.id}`);
    return valEl ? { ...f, value: valEl.value } : f;
  });

  const newField = { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), label, type, value: '' };
  const newFields = [...updatedExisting, newField];

  showLoader('שומר...');
  await db.from('categories').update({ custom_fields: newFields }).eq('id', catId).eq('user_id', currentUser.id);
  await loadCategories();
  hideLoader();

  // Re-render only the fields list (keep panel open)
  const freshCat = categories.find(c => c.id === catId);
  const listEl   = document.getElementById(`cf-list-${catId}`);
  if (listEl && freshCat) listEl.innerHTML = renderCustomFieldItems(freshCat);

  cancelAddCustomField();
  showToast('✅ שדה נוסף');
}

async function deleteCustomField(catId, fieldId) {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  const updatedFields = (cat.custom_fields || []).filter(f => f.id !== fieldId);

  showLoader('מוחק...');
  await db.from('categories').update({ custom_fields: updatedFields }).eq('id', catId).eq('user_id', currentUser.id);
  await loadCategories();
  hideLoader();

  const freshCat = categories.find(c => c.id === catId);
  const listEl   = document.getElementById(`cf-list-${catId}`);
  if (listEl && freshCat) listEl.innerHTML = renderCustomFieldItems(freshCat);
  showToast('🗑️ שדה נמחק');
}
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
    ? `<div class="cat-item" style="cursor:pointer" onclick="openMortgageInstFromSettings()">
        <div style="display:flex;align-items:center;gap:10px;flex:1">
          <img src="${logoUrl(inst.domain)}" alt="" class="cat-list-logo" onerror="this.style.display='none'"/>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--ink)">${inst.name}</div>
            <div style="font-size:.72rem;color:var(--green)">גוף מנהל משכנתא</div>
          </div>
        </div>
        <button class="cat-delete" onclick="event.stopPropagation();clearMortgageInst()" title="הסר">${ICONS_JS.trash}</button>
      </div>`
    : `<div class="cat-item" style="cursor:pointer;justify-content:center;color:var(--ink-3);gap:8px;font-size:.875rem" onclick="openMortgageInstFromSettings()">
        ${ICONS_JS.bank} <span>בחר גוף מנהל משכנתא</span>
      </div>`;
}

function openMortgageInstFromSettings() {
  instTargetMode  = 'mortgage_settings';
  instTargetCatId = null;
  renderInstGrid(INSTITUTIONS.filter(i => i.type === 'bank'));
  const el = document.getElementById('inst-modal');
  el.style.display = 'flex';
  el.style.zIndex  = '1002';
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
/* ══ MOBILE NAV DROPDOWN ════════════════════════════ */
const NAV_ITEMS = [
  { tab:'current',    label:'דוח נוכחי',       svg:'<rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>' },
  { tab:'history',    label:'היסטוריה',          svg:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { tab:'retirement', label:'תכנון פרישה',       svg:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>' },
  { tab:'portfolio',  label:'תיק השקעות',        svg:'<circle cx="12" cy="12" r="10"/><path d="M12 2v10l6 3"/>' },
  { tab:'annual',     label:'סיכום שנתי',        svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { tab:'calendar',   label:'לוח שנה פיננסי',   svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>' },
  { tab:'settings',   label:'הגדרות',            svg:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
];

function toggleDrawer() {
  const dd = document.getElementById('nav-dropdown');
  const bd = document.getElementById('nav-dropdown-backdrop');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  if (isOpen) { closeNavDropdown(); return; }

  // current active tab
  const activeTab = document.querySelector('.bottom-nav-item.active')?.dataset?.tab
    || document.querySelector('.nav-item.active')?.dataset?.tab || 'current';

  // position below hamburger btn
  const btn = document.getElementById('hamburger-btn');
  const rect = btn.getBoundingClientRect();

  dd.innerHTML = NAV_ITEMS.map(item => {
    const isSel = item.tab === activeTab;
    const isSettings = item.tab === 'settings';
    const onClick = isSettings
      ? `closeNavDropdown();showSettings()`
      : `closeNavDropdown();setTimeout(()=>switchTab('${item.tab}',document.querySelector('[data-tab=\\'${item.tab}\\']')),80)`;
    return `<button onclick="${onClick}"
      style="display:flex;align-items:center;gap:10px;width:100%;text-align:right;padding:9px 12px;border:none;border-radius:8px;cursor:pointer;
        background:${isSel?'var(--green-light)':'transparent'};
        color:${isSel?'var(--green)':'var(--ink)'};
        font-family:var(--font);font-size:.88rem;font-weight:${isSel?'700':'500'};
        transition:background .12s;${isSettings?'border-top:1px solid var(--border);margin-top:4px;padding-top:12px':''}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:${isSel?'1':'.6'}">${item.svg}</svg>
      <span style="flex:1">${item.label}</span>
      ${isSel?`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`:''}
    </button>`;
  }).join('');

  dd.style.display = 'block';
  dd.style.top  = (rect.bottom + 6) + 'px';
  dd.style.left = rect.left + 'px';
  bd.style.display = 'block';
}

function closeNavDropdown() {
  const dd = document.getElementById('nav-dropdown');
  const bd = document.getElementById('nav-dropdown-backdrop');
  if (dd) dd.style.display = 'none';
  if (bd) bd.style.display = 'none';
}

// keep old aliases for compatibility
function closeDrawer() { closeNavDropdown(); }
function drawerSwitch(tab) { closeNavDropdown(); setTimeout(()=>switchTab(tab, document.querySelector(`[data-tab="${tab}"]`)),80); }
function updateDrawerActive() {}

function switchTab(name, btn) {
  ['current','history','retirement','portfolio','annual','calendar'].forEach(t=>{
    const p=document.getElementById(`tab-${t}`); if(p) p.style.display=t===name?'block':'none';
  });
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${name}"]`).forEach(b=>b.classList.add('active'));
  const titles={current:'דוח נוכחי',history:'היסטוריה',retirement:'תכנון פרישה',portfolio:'תיק השקעות',annual:'סיכום שנתי',calendar:'לוח שנה פיננסי'};
  const te=document.getElementById('topbar-title'); if(te) te.textContent=titles[name]||'';
  if(name==='history')    renderHistoryTab();
  if(name==='retirement') { loadRetirementSettings(); renderRetirement(); }
  if(name==='portfolio')  renderPortfolioTab();
  if(name==='annual')     renderAnnualTab();
  if(name==='calendar')   renderCalendarTab();
  // Scroll active button into view in bottom nav
  const activeBtn = document.querySelector(`.bottom-nav [data-tab="${name}"]`);
  if (activeBtn) activeBtn.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
}


/* ══ TOTAL ASSETS PIE BREAKDOWN ══════════════════════ */

// Helper: polar coords → cartesian (0° = top, clockwise)
function _abPolar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
// Helper: build a donut ring segment as SVG <path>
function _abSegPath(cx, cy, R, ri, sDeg, eDeg) {
  // Clamp to avoid degenerate full-circle (360 → 359.99)
  const e = Math.min(eDeg, sDeg + 359.99);
  const large = (e - sDeg) > 180 ? 1 : 0;
  const [x1,y1] = _abPolar(cx, cy, R,  sDeg);
  const [x2,y2] = _abPolar(cx, cy, R,  e);
  const [x3,y3] = _abPolar(cx, cy, ri, e);
  const [x4,y4] = _abPolar(cx, cy, ri, sDeg);
  return `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${large},0 ${x4},${y4} Z`;
}

// State for the currently selected segment
let _abSelIdx = -1;

function abSelectSegment(idx) {
  const seg = window._abSegData?.[idx];
  if (!seg) return;

  // Toggle off if already selected
  if (_abSelIdx === idx) { abDeselectSegment(); return; }
  _abSelIdx = idx;

  // Dim all, highlight selected
  (window._abSegData || []).forEach((s, i) => {
    const path = document.getElementById(`ab-seg-${i}`);
    if (!path) return;
    if (i === idx) {
      path.style.opacity = '1';
      path.style.filter  = 'brightness(1.25) drop-shadow(0 0 6px ' + s.color + '88)';
      path.style.transform = 'scale(1.04)';
    } else {
      path.style.opacity   = '0.35';
      path.style.filter    = '';
      path.style.transform = 'scale(1)';
    }
  });

  // Update SVG center text
  const pctVal = (seg.val / seg.total * 100).toFixed(1);
  const ct = document.getElementById('ab-center-text');
  if (ct) ct.innerHTML = `
    <text x="100" y="92" text-anchor="middle" font-family="var(--mono)" font-size="13" font-weight="800" fill="${seg.color}">${fmt(seg.val)}</text>
    <text x="100" y="110" text-anchor="middle" font-size="10" fill="var(--ink-4)">${pctVal}%</text>`;

  // Highlight matching legend row
  document.querySelectorAll('.ab-legend-row').forEach((row, i) => {
    row.style.opacity    = i === idx ? '1' : '0.45';
    row.style.background = i === idx ? 'var(--surface2)' : '';
    row.style.borderRadius = i === idx ? '8px' : '';
  });
}

function abDeselectSegment() {
  _abSelIdx = -1;
  (window._abSegData || []).forEach((s, i) => {
    const path = document.getElementById(`ab-seg-${i}`);
    if (!path) return;
    path.style.opacity   = '0.92';
    path.style.filter    = '';
    path.style.transform = 'scale(1)';
  });
  // Restore center text
  const ct = document.getElementById('ab-center-text');
  const total = window._abSegData?.[0]?.total || 0;
  if (ct && total) ct.innerHTML = `
    <text x="100" y="92" text-anchor="middle" font-family="var(--mono)" font-size="14" font-weight="800" fill="var(--ink)">${fmt(total)}</text>
    <text x="100" y="111" text-anchor="middle" font-size="10" fill="var(--ink-4)">סה"כ</text>`;
  const panel = document.getElementById('ab-info-panel');
  if (panel) panel.style.display = 'none';
  document.querySelectorAll('.ab-legend-row').forEach(row => {
    row.style.opacity    = '1';
    row.style.background = '';
    row.style.borderRadius = '';
  });
}

function showTotalAssetsBreakdown() {
  if (!records.length) return;
  _abSelIdx = -1;
  const latest = records[records.length - 1];
  const calc   = calcRecord(latest);
  const colors = ['#8b5cf6','#4f8ef7','#0e9e7e','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316','#64748b','#22c55e'];
  const items  = categories.map((cat,i) => ({ label:cat.label, val:calc[cat.key]||0, color:colors[i%colors.length] }))
    .filter(d => d.val > 0).sort((a,b) => b.val - a.val);
  const total  = items.reduce((s,d) => s+d.val, 0);

  // ── Build interactive SVG donut with <path> segments ──
  const CX=100, CY=100, R=82, RI=56; // outer radius, inner radius
  const GAP_DEG = items.length > 1 ? 1.8 : 0;
  let angleDeg = 0;
  const segData = items.map((d, i) => {
    const span   = (d.val / total) * 360;
    const sDeg   = angleDeg + GAP_DEG / 2;
    const eDeg   = angleDeg + span - GAP_DEG / 2;
    const pathD  = _abSegPath(CX, CY, R, RI, sDeg, eDeg);
    angleDeg += span;
    return { ...d, pathD, index: i, total };
  });
  window._abSegData = segData;

  const svgPaths = segData.map((seg, i) =>
    `<path id="ab-seg-${i}" d="${seg.pathD}" fill="${seg.color}" opacity=".92"
      style="cursor:pointer;transition:opacity .18s,transform .18s,filter .18s;transform-origin:${CX}px ${CY}px"
      onclick="abSelectSegment(${i})"/>`
  ).join('');

  // ── Legend rows (clickable) ─────────────────────────
  const maxVal = items[0]?.val || 1;
  const legendRows = items.map((d, i) => {
    const pct    = (d.val / total * 100).toFixed(1);
    const barPct = Math.round((d.val / maxVal) * 100);
    return `
      <div class="ab-legend-row" onclick="abSelectSegment(${i})"
        style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:10px;cursor:pointer;transition:opacity .15s,background .15s;padding-right:4px;padding-left:4px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:7px">
            <div style="width:9px;height:9px;border-radius:50%;background:${d.color};flex-shrink:0"></div>
            <span style="font-size:.83rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.label}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          <span style="font-family:var(--mono);font-size:.83rem;font-weight:700;color:var(--ink)">${fmt(d.val)}</span>
          <span style="font-size:.75rem;font-weight:700;color:var(--ink-4);min-width:38px;text-align:left">${pct}%</span>
        </div>
      </div>`;
  }).join('');

  // ── Ticker ──────────────────────────────────────────
  const SVG_PIE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`;
  const tickerItems = [
    `<span class="tkr-item">${SVG_PIE} <bdi dir="rtl" class="tkr-text">סה"כ: <strong>${fmt(total)}</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.barChart} <bdi dir="rtl" class="tkr-text">${items[0]?.label || ''}: <strong>${(items[0]?.val/total*100).toFixed(1)}%</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.breakdown} <bdi dir="rtl" class="tkr-text"><strong>${items.length}</strong> קטגוריות פעילות</bdi></span>`,
  ];
  const SEP = `<span class="tkr-sep">·</span>`;
  const LOOP_SEP = `<span class="tkr-sep tkr-loop-sep">·</span>`;
  const tickerHtml = `<div class="tkr-track" id="ab-tkr-track">${tickerItems.join(SEP) + LOOP_SEP + tickerItems.join(SEP) + LOOP_SEP}</div>`;

  // ── Build modal ─────────────────────────────────────
  document.getElementById('assets-breakdown-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'assets-breakdown-modal';
  modal.className = 'info-modal-overlay cat-history-overlay';
  modal.innerHTML = `
    <div class="modal-box">

      <div class="chb-header">
        <div class="chb-title">${ICONS_JS.barChart} פירוט סה"כ נכסים</div>
        <button onclick="document.getElementById('assets-breakdown-modal').remove()" class="chb-close">${ICONS_JS.x}</button>
      </div>

      <div class="chb-ticker-row" id="ab-ticker-row">${tickerHtml}</div>

      <!-- Interactive donut -->
      <div class="chb-top" style="display:flex;justify-content:center;padding:18px 0 14px">
        <svg width="200" height="200" viewBox="0 0 200 200" style="overflow:visible">
          <circle cx="${CX}" cy="${CY}" r="${(R+RI)/2}" fill="none" stroke="var(--border)" stroke-width="${R-RI}"/>
          ${svgPaths}
          <g id="ab-center-text" style="pointer-events:none">
            <text x="${CX}" y="92" text-anchor="middle" font-family="var(--mono)" font-size="14" font-weight="800" fill="var(--ink)">${fmt(total)}</text>
            <text x="${CX}" y="111" text-anchor="middle" font-size="10" fill="var(--ink-4)">סה"כ</text>
          </g>
        </svg>
      </div>

      <!-- Selected segment info card (hidden by default) -->
      <div id="ab-info-panel" style="display:none;margin:0 16px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;direction:rtl;animation:fadeUp .15s ease">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;align-items:center;gap:8px">
            <div id="ab-info-dot" style="width:10px;height:10px;border-radius:50%;flex-shrink:0"></div>
            <span id="ab-info-label" style="font-size:.875rem;font-weight:700;color:var(--ink)"></span>
          </div>
          <button onclick="abDeselectSegment()" class="chb-close" style="padding:2px">${ICONS_JS.x}</button>
        </div>
        <div style="display:flex;align-items:baseline;gap:10px;margin-top:7px">
          <span id="ab-info-val" style="font-family:var(--mono);font-size:1.35rem;font-weight:800;color:var(--ink)"></span>
          <span id="ab-info-pct" style="font-size:.82rem;font-weight:700;color:var(--ink-3)"></span>
        </div>
        <div style="margin-top:8px;height:4px;background:var(--border);border-radius:2px">
          <div id="ab-info-bar" style="height:4px;border-radius:2px;width:0%;transition:width .4s ease"></div>
        </div>
      </div>

      <div class="chb-history-header"><span>חלוקה לפי קטגוריה</span></div>
      <div class="chb-body">${legendRows}</div>

    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);

  // Animate ticker
  setTimeout(() => {
    const track = document.getElementById('ab-tkr-track');
    if (!track) return;
    const oneWidth = track.scrollWidth / 2;
    if (oneWidth > 0) {
      track.style.animationDuration = `${(oneWidth / 60).toFixed(2)}s`;
      track.style.animationPlayState = 'running';
    }
  }, 60);
}

/* ══ LIQUID ASSETS INFO ═══════════════════════════════ */
function showLiquidInfo() {
  if (!records.length) return;
  const latest     = records[records.length - 1];
  const calc       = calcRecord(latest);
  const liqCats    = categories.filter(c => isLiquidCat(c)  && (calc[c.key]||0) > 0);
  const nonLiqCats = categories.filter(c => !isLiquidCat(c) && (calc[c.key]||0) > 0);
  const liquid     = liqCats.reduce((s,c)    => s + (calc[c.key]||0), 0);
  const nonLiquid  = nonLiqCats.reduce((s,c) => s + (calc[c.key]||0), 0);
  const pct        = calc.totalAssets ? (liquid / calc.totalAssets * 100).toFixed(1) : '0';
  const p          = parseFloat(pct);
  const liqPct     = calc.totalAssets ? Math.round(liquid   / calc.totalAssets * 100) : 0;
  const nliqPct    = calc.totalAssets ? Math.round(nonLiquid / calc.totalAssets * 100) : 0;

  const statusBadge = p >= 15 && p <= 40 ? 'יחס נזילות תקין'
    : p < 15 ? 'נזילות נמוכה מדי' : 'נזילות גבוהה — כסף לא עובד';
  const statusColor = p >= 15 && p <= 40 ? 'var(--green)'
    : p < 15 ? 'var(--red,#ef4444)' : 'var(--amber,#f59e0b)';

  // ── Simple row: label + value only ─────────────────
  function simpleRow(cat, isLiquid) {
    const val      = calc[cat.key] || 0;
    const valColor = isLiquid ? 'var(--ink)' : 'var(--ink-2)';
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:8px">
        <span style="font-size:.875rem;color:var(--ink-2)">${cat.label}</span>
        <span style="font-family:var(--mono);font-size:.875rem;font-weight:700;color:${valColor};white-space:nowrap">${fmt(val)}</span>
      </div>`;
  }

  const liqRowsHtml    = liqCats.map(c => simpleRow(c, true)).join('')
    || `<div style="color:var(--ink-4);font-size:.875rem;padding:8px 0">אין</div>`;
  const nonLiqRowsHtml = nonLiqCats.map(c => simpleRow(c, false)).join('');

  // ── Ticker ──────────────────────────────────────────
  const SVG_DROP = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  const tickerItems = [
    `<span class="tkr-item">${SVG_DROP} <bdi dir="rtl" class="tkr-text">נזיל: <strong style="color:${statusColor}">${pct}%</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.target} <bdi dir="rtl" class="tkr-text">אידיאלי: <strong>15%–40%</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.check} <bdi dir="rtl" class="tkr-text" style="color:${statusColor}">${statusBadge}</bdi></span>`,
  ];
  const SEP      = `<span class="tkr-sep">·</span>`;
  const LOOP_SEP = `<span class="tkr-sep tkr-loop-sep">·</span>`;
  const tickerHtml = `<div class="tkr-track" id="liq-tkr-track">${tickerItems.join(SEP) + LOOP_SEP + tickerItems.join(SEP) + LOOP_SEP}</div>`;

  // ── Build modal ─────────────────────────────────────
  document.getElementById('liquid-info-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'liquid-info-modal';
  modal.className = 'info-modal-overlay cat-history-overlay';
  modal.innerHTML = `
    <div class="modal-box">

      <!-- Header -->
      <div class="chb-header">
        <div class="chb-title">${SVG_DROP} נכסים נזילים</div>
        <button onclick="document.getElementById('liquid-info-modal').remove()" class="chb-close">${ICONS_JS.x}</button>
      </div>

      <!-- Ticker -->
      <div class="chb-ticker-row">${tickerHtml}</div>

      <!-- Summary strip -->
      <div class="chb-top" style="padding:14px 20px 16px;direction:rtl">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px">
          <span style="font-family:var(--mono);font-size:2rem;font-weight:800;color:${statusColor};line-height:1">${pct}%</span>
          <span style="font-size:.85rem;color:var(--ink-3)">נזיל מהתיק</span>
        </div>
        <div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:10px">
          <div style="height:6px;border-radius:4px;background:${statusColor};width:${Math.min(liqPct,100)}%;transition:width .5s ease"></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:${statusColor};font-weight:700">${statusBadge}</span>
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--ink-3)">נזיל ${liqPct}%</span>
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--ink-3)">לא נזיל ${nliqPct}%</span>
        </div>
      </div>

      <!-- Scrollable body — single container -->
      <div class="chb-body">

        <div class="chb-history-header" style="margin:0 -20px;padding-right:20px;padding-left:20px"><span>נכסים נזילים (ניתן למשיכה מיידית)</span></div>
        ${liqRowsHtml}
        <div style="display:flex;justify-content:space-between;padding:10px 0 4px;font-size:.875rem;font-weight:700">
          <span style="color:var(--ink)">סה"כ נזיל</span>
          <span style="font-family:var(--mono);color:var(--green)">${fmt(liquid)}</span>
        </div>

        ${nonLiqRowsHtml ? `
          <div class="chb-history-header" style="margin:8px -20px 0;padding-right:20px;padding-left:20px"><span>נכסים לא נזילים</span></div>
          ${nonLiqRowsHtml}` : ''}

        <p style="font-size:.68rem;color:var(--ink-4);line-height:1.6;margin:12px 0 0">* נזיל = ניתן למשיכה תוך ימים ספורים ללא קנס.</p>
      </div>

    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);

  // Animate ticker
  setTimeout(() => {
    const track = document.getElementById('liq-tkr-track');
    if (!track) return;
    const oneWidth = track.scrollWidth / 2;
    if (oneWidth > 0) {
      track.style.animationDuration = `${(oneWidth / 60).toFixed(2)}s`;
      track.style.animationPlayState = 'running';
    }
  }, 60);
}

/* ══ GENERIC INFO MODAL ═══════════════════════════════ */
function openInfoModal(title, bodyHtml) {
  document.getElementById('info-modal-existing')?.remove();
  const modal = document.createElement('div');
  modal.id = 'info-modal-existing';
  modal.className = 'info-modal-overlay';
  modal.innerHTML = `
    <div class="info-modal-box">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 20px 14px;border-bottom:1px solid var(--border);flex-shrink:0">
        <span style="font-size:.95rem;font-weight:700;color:var(--ink)">${title}</span>
        <button onclick="document.getElementById('info-modal-existing').remove()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex">${ICONS_JS.x}</button>
      </div>
      <div style="padding:16px 20px 32px;overflow-y:auto;-webkit-overflow-scrolling:touch">${bodyHtml}</div>
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

  // Split categories into 3 groups
  const liquidCats    = categories.filter(c => !isPensionCat(c) &&  isLiquidCat(c) && (calc[c.key]||0) > 0);
  const nonLiquidCats = categories.filter(c => !isPensionCat(c) && !isLiquidCat(c) && (calc[c.key]||0) > 0);
  const pensionCats   = categories.filter(c =>  isPensionCat(c)                    && (calc[c.key]||0) > 0);

  const liquidTotal    = liquidCats.reduce((s,c)    => s + (calc[c.key]||0), 0);
  const nonLiquidTotal = nonLiquidCats.reduce((s,c) => s + (calc[c.key]||0), 0);

  // Pills
  const totalForPills = liquidTotal + nonLiquidTotal + pensionAfterTax;
  const liqPct    = totalForPills ? Math.round(liquidTotal    / totalForPills * 100) : 0;
  const nliqPct   = totalForPills ? Math.round(nonLiquidTotal / totalForPills * 100) : 0;
  const penPct    = totalForPills ? Math.round(pensionAfterTax / totalForPills * 100) : 0;

  // Simple row: label + value, no bar
  function simpleRow(label, val, valColor) {
    if (!val) return '';
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:8px">
        <span style="font-size:.875rem;color:var(--ink-2)">${label}</span>
        <span style="font-family:var(--mono);font-size:.875rem;font-weight:700;color:${valColor || 'var(--ink)'};white-space:nowrap">${fmt(val)}</span>
      </div>`;
  }

  const liquidRows    = liquidCats.map(c    => simpleRow(c.label, calc[c.key]||0, 'var(--ink)')).join('');
  const nonLiquidRows = nonLiquidCats.map(c => simpleRow(c.label, calc[c.key]||0, 'var(--ink)')).join('');
  const pensionRows   = pensionCats.map(c   => simpleRow(c.label, calc[c.key]||0, 'var(--ink)')).join('');

  // Ticker
  const SVG_TAX = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
  const tickerItems = [
    `<span class="tkr-item">${SVG_TAX} <bdi dir="rtl" class="tkr-text">שווי נקי: <strong>${fmt(netAfterTax)}</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.bank} <bdi dir="rtl" class="tkr-text">נזיל: <strong>${liqPct}%</strong></bdi></span>`,
    ...(nliqPct > 0 ? [`<span class="tkr-item">${ICONS_JS.alert} <bdi dir="rtl" class="tkr-text">לא נזיל: <strong style="color:var(--amber,#f59e0b)">${nliqPct}%</strong></bdi></span>`] : []),
    `<span class="tkr-item">${ICONS_JS.piggy} <bdi dir="rtl" class="tkr-text">פנסיה נטו: <strong>${penPct}%</strong></bdi></span>`,
    `<span class="tkr-item">${ICONS_JS.alert} <bdi dir="rtl" class="tkr-text">מס פנסיה: <strong style="color:var(--red)">− ${fmt(tax)}</strong></bdi></span>`,
  ];
  const SEP      = `<span class="tkr-sep">·</span>`;
  const LOOP_SEP = `<span class="tkr-sep tkr-loop-sep">·</span>`;
  const tickerHtml = `<div class="tkr-track" id="tax-tkr-track">${tickerItems.join(SEP) + LOOP_SEP + tickerItems.join(SEP) + LOOP_SEP}</div>`;

  document.getElementById('tax-breakdown-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'tax-breakdown-modal';
  modal.className = 'info-modal-overlay cat-history-overlay';
  modal.innerHTML = `
    <div class="modal-box">

      <!-- Header -->
      <div class="chb-header">
        <div class="chb-title">${SVG_TAX} שווי נקי אחרי מס</div>
        <button onclick="document.getElementById('tax-breakdown-modal').remove()" class="chb-close">${ICONS_JS.x}</button>
      </div>

      <!-- Ticker -->
      <div class="chb-ticker-row">${tickerHtml}</div>

      <!-- Summary strip -->
      <div class="chb-top" style="padding:14px 20px 16px;direction:rtl">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:4px">
          <span style="font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--ink);line-height:1">${fmt(netAfterTax)}</span>
        </div>
        <div style="font-size:.72rem;color:var(--ink-4);margin-bottom:10px">
          נזיל ${fmt(liquidTotal)}${nonLiquidTotal ? ` · לא נזיל ${fmt(nonLiquidTotal)}` : ''} + פנסיה נטו ${fmt(pensionAfterTax)}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--green);font-weight:700">נזיל ${liqPct}%</span>
          ${nliqPct > 0 ? `<span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--amber,#f59e0b);font-weight:700">לא נזיל ${nliqPct}%</span>` : ''}
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--amber,#f59e0b);font-weight:700">פנסיה ${penPct}%</span>
          <span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:.72rem;color:var(--red);font-weight:700">מס − ${fmt(tax)}</span>
        </div>
      </div>

      <!-- Scrollable body — single container -->
      <div class="chb-body">

        ${liquidRows ? `
          <div class="chb-history-header" style="margin:0 -20px;padding-right:20px;padding-left:20px"><span>נכסים נזילים (ללא מס)</span></div>
          ${liquidRows}
          <div style="display:flex;justify-content:space-between;padding:10px 0 4px;font-size:.875rem;font-weight:700">
            <span style="color:var(--ink)">סה"כ נזיל</span>
            <span style="font-family:var(--mono);color:var(--green)">${fmt(liquidTotal)}</span>
          </div>` : ''}

        ${nonLiquidRows ? `
          <div class="chb-history-header" style="margin:8px -20px 0;padding-right:20px;padding-left:20px"><span>נכסים לא נזילים (ללא מס)</span></div>
          ${nonLiquidRows}
          <div style="display:flex;justify-content:space-between;padding:10px 0 4px;font-size:.875rem;font-weight:700">
            <span style="color:var(--ink)">סה"כ לא נזיל</span>
            <span style="font-family:var(--mono);color:var(--amber,#f59e0b)">${fmt(nonLiquidTotal)}</span>
          </div>` : ''}

        ${pensionRows ? `
          <div class="chb-history-header" style="margin:8px -20px 0;padding-right:20px;padding-left:20px"><span>פנסיה (חייבת במס 35%)</span></div>
          ${pensionRows}
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:.875rem">
            <span style="color:var(--ink-2)">סה"כ פנסיה (ברוטו)</span>
            <span style="font-family:var(--mono);font-weight:700;color:var(--ink)">${fmt(pensionTotal)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:.875rem">
            <span style="color:var(--ink-2)">מס 35%</span>
            <span style="font-family:var(--mono);font-weight:700;color:var(--red)">− ${fmt(tax)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0 4px;font-size:.875rem;font-weight:700">
            <span style="color:var(--ink)">פנסיה נטו</span>
            <span style="font-family:var(--mono);color:var(--green)">${fmt(pensionAfterTax)}</span>
          </div>` : ''}

        <p style="font-size:.68rem;color:var(--ink-4);line-height:1.6;margin:12px 0 0">* 35% מס על משיכה מוקדמת של פנסיה. מומלץ להתייעץ עם יועץ מס.</p>
      </div>

    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);

  // Animate ticker
  setTimeout(() => {
    const track = document.getElementById('tax-tkr-track');
    if (!track) return;
    const oneWidth = track.scrollWidth / 2;
    if (oneWidth > 0) {
      track.style.animationDuration = `${(oneWidth / 60).toFixed(2)}s`;
      track.style.animationPlayState = 'running';
    }
  }, 60);
}

/* ══ PORTFOLIO TAB ════════════════════════════════════ */
function renderPortfolioTab() {
  const el = document.getElementById('portfolio-content');
  if (!el) return;
  if (!records.length) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-4)">אין נתונים</div>'; return; }

  const latest = records[records.length - 1];
  const calc   = calcRecord(latest);
  const total  = calc.totalAssets;
  const highlighted = el.dataset.highlight || '';

  const colorsRaw = { liquid:'#0e9e7e', savings:'#4f8ef7', pension:'#f59e0b', invest:'#8b5cf6' };
  const labels    = { liquid:'נזיל', savings:'חיסכון', pension:'פנסיוני', invest:'השקעות' };
  const savingKeys = ['deposit','savingsFund','hishtalmut'];

  const buckets = { liquid:0, savings:0, pension:0, invest:0 };
  categories.forEach(cat => {
    const val = calc[cat.key] || 0;
    if (!val) return;
    if (isPensionCat(cat))               buckets.pension += val;
    else if (cat.key.startsWith('invest_'))  buckets.invest  += val;
    else if (cat.key.startsWith('liquid_'))  buckets.liquid  += val;
    else if (cat.key.startsWith('savings_')) buckets.savings += val;
    else if (savingKeys.includes(cat.key))   buckets.savings += val;
    else if (isLiquidCat(cat))               buckets.liquid  += val;
    else                                     buckets.invest  += val;
  });

  const userAge  = parseInt(document.getElementById('ret-current-age')?.value) || 35;
  const ideal    = {
    liquid:  15,
    savings: Math.min(30, Math.max(10, 60 - userAge)),
    pension: Math.min(50, Math.max(20, userAge - 10)),
    invest:  0
  };
  ideal.invest = Math.max(0, 100 - ideal.liquid - ideal.savings - ideal.pension);

  // ── Interactive donut ──────────────────────────────
  const r = 88, cx = 110, cy = 110, sw = 32, circ = 2 * Math.PI * r;
  let off = 0;
  const arcs = Object.entries(buckets).map(([k, v]) => {
    if (!v) return '';
    const pct  = v / total;
    const dash = pct * circ;
    const isHL = highlighted === k;
    const op   = highlighted && !isHL ? '0.35' : '1';
    const rr   = isHL ? r : r;
    const sww  = isHL ? sw + 6 : sw;
    const arc  = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
      stroke="${colorsRaw[k]}" stroke-width="${sww}" stroke-linecap="butt" opacity="${op}"
      stroke-dasharray="${(dash - 2).toFixed(2)} ${(circ - dash + 2).toFixed(2)}"
      stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"
      style="cursor:pointer;transition:all .2s"
      onclick="portfolioHighlight('${k}')"/>`;
    off += dash;
    return arc;
  }).join('');

  const centerVal = highlighted && buckets[highlighted]
    ? buckets[highlighted] : total;
  const centerLbl = highlighted ? labels[highlighted] : 'סה"כ נכסים';

  // ── Bucket rows ────────────────────────────────────
  const rows = Object.entries(buckets).map(([k, v]) => {
    if (!v) return '';
    const pct  = total ? v / total * 100 : 0;
    const diff = pct - ideal[k];
    const ok   = Math.abs(diff) <= 5;
    const over = diff > 5;
    const statusIcon = ok
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : over
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--amber,#f59e0b)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
    const statusCol = ok ? 'var(--green)' : over ? 'var(--amber,#f59e0b)' : 'var(--red)';
    const isHL = highlighted === k;
    const op   = highlighted && !isHL ? '.4' : '1';
    return `
    <div onclick="portfolioHighlight('${k}')"
      style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:10px;cursor:pointer;
             transition:background .15s,opacity .15s;opacity:${op};
             background:${isHL ? 'var(--surface2)' : 'transparent'}"
      onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='${isHL ? 'var(--surface2)' : 'transparent'}'">
      <div style="width:10px;height:10px;border-radius:50%;background:${colorsRaw[k]};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
          <span style="font-size:.875rem;font-weight:700;color:var(--ink)">${labels[k]}</span>
          <span style="display:inline-flex;align-items:center;gap:3px;font-size:.7rem;color:${statusCol}">
            ${statusIcon}${diff > 0 ? '+' : ''}${diff.toFixed(1)}% מהמטרה (${ideal[k]}%)
          </span>
        </div>
        <div style="height:3px;background:var(--border);border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${Math.min(100, pct)}%;background:${colorsRaw[k]};border-radius:2px"></div>
        </div>
      </div>
      <div style="text-align:left;flex-shrink:0">
        <div style="font-family:var(--mono);font-size:.875rem;font-weight:700;color:var(--ink)">${fmt(v)}</div>
        <div style="font-size:.72rem;color:var(--ink-3);text-align:right">${pct.toFixed(1)}%</div>
      </div>
    </div>`;
  }).join('');

  // ── Ideal pills ────────────────────────────────────
  const pills = Object.entries(ideal).map(([k,v]) => `
    <div style="display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;background:var(--surface2);border:1px solid var(--border)">
      <div style="width:7px;height:7px;border-radius:50%;background:${colorsRaw[k]}"></div>
      <span style="font-size:.75rem;color:var(--ink-3)">${labels[k]}</span>
      <span style="font-size:.78rem;font-weight:700;font-family:var(--mono);color:var(--ink)">${v}%</span>
    </div>`).join('');

  el.innerHTML = `
    <div class="card" style="margin-bottom:14px;padding:20px">
      <div style="font-size:.68rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px">פיזור תיק ההשקעות</div>

      <!-- Donut -->
      <div style="display:flex;justify-content:center;margin-bottom:20px">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${sw}"/>
          ${arcs}
          <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="15" font-weight="800"
                fill="var(--ink)" font-family="'JetBrains Mono',monospace"
                style="pointer-events:none">${fmt(centerVal)}</text>
          <text x="${cx}" y="${cy + 11}" text-anchor="middle" font-size="10"
                fill="var(--ink-4)" font-family="'Heebo',sans-serif"
                style="pointer-events:none">${centerLbl}</text>
          ${highlighted ? `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="9"
                fill="var(--ink-4)" font-family="'Heebo',sans-serif"
                style="pointer-events:none;cursor:pointer" onclick="portfolioHighlight('')">✕ בטל סינון</text>` : ''}
        </svg>
      </div>

      <!-- Rows -->
      <div style="margin:0 -6px">${rows}</div>
    </div>

    <!-- Ideal -->
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:.68rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em">פיזור מטרה לגיל ${userAge}</div>
        <div style="font-size:.7rem;color:var(--ink-4)">לפי תכנון פרישה</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${pills}</div>
      <div style="height:1px;background:var(--border);margin-bottom:10px"></div>
      <p style="font-size:.7rem;color:var(--ink-4);line-height:1.6;margin:0">* המלצה כללית בלבד — לא ייעוץ פיננסי. עדכן גילך בטאב תכנון פרישה לדיוק.</p>
    </div>`;
}

function portfolioHighlight(key) {
  const el = document.getElementById('portfolio-content');
  if (!el) return;
  el.dataset.highlight = el.dataset.highlight === key ? '' : key;
  renderPortfolioTab();
}

/* ══ ANNUAL SUMMARY TAB ══════════════════════════════ */
function renderCalendarTab() {
  const el = document.getElementById('calendar-content');
  if (!el) return;

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ── Collect events ────────────────────────────────────
  const latestRec  = records.length ? [...records].sort((a,b)=>new Date(a.record_date)-new Date(b.record_date)).at(-1) : null;
  const latestCalc = latestRec ? calcRecord(latestRec) : null;
  const firstRec   = records.length ? [...records].sort((a,b)=>new Date(a.record_date)-new Date(b.record_date))[0] : null;

  const events = [];

  // 1. liquid_date events (deposit maturities / fund unlock dates)
  categories.forEach(cat => {
    if (!cat.liquid_date) return;
    const d = new Date(cat.liquid_date);
    const isPension = cat.key === 'savingsFund' || cat.key === 'pensionFund';
    const currentVal = latestCalc?.[cat.key] || 0;
    // progress: from first record date to liquid_date
    const startMs = firstRec ? new Date(firstRec.record_date).getTime() : today.getTime();
    const endMs   = d.getTime();
    const progress = endMs > startMs ? Math.min(100, Math.max(0, (today.getTime()-startMs)/(endMs-startMs)*100)) : 0;
    events.push({
      date: d, label: cat.label, type: isPension ? 'fund' : 'deposit',
      title: isPension ? `משיכת ${cat.label}` : `פקיעת ${cat.label}`,
      currentVal, progress, catKey: cat.key,
      icon: isPension
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    });
  });

  // 2. custom_fields with type==='date'
  const calIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  categories.forEach(cat => {
    (cat.custom_fields || []).forEach(f => {
      if (f.type !== 'date' || !f.value) return;
      const d = new Date(f.value);
      if (isNaN(d)) return;
      const currentVal = latestCalc?.[cat.key] || 0;
      const startMs = firstRec ? new Date(firstRec.record_date).getTime() : today.getTime();
      const endMs   = d.getTime();
      const progress = endMs > startMs ? Math.min(100, Math.max(0, (today.getTime()-startMs)/(endMs-startMs)*100)) : 0;
      events.push({
        date: d, label: cat.label, type: 'custom',
        title: `${f.label} — ${cat.label}`,
        currentVal, progress, catKey: cat.key,
        icon: calIcon,
      });
    });
  });

  // 3. Monthly update reminder
  if (records.length) {
    const lastDate  = new Date(latestRec.record_date);
    const nextUpdate = new Date(lastDate.getFullYear(), lastDate.getMonth()+1, 1);
    const daysSinceLast = Math.round((today - lastDate) / (1000*60*60*24));
    events.push({
      date: nextUpdate, label: 'עדכון חודשי', type: 'reminder',
      title: `תזכורת — עדכון ${nextUpdate.toLocaleDateString('he-IL',{month:'long',year:'numeric'})}`,
      currentVal: latestCalc?.totalAssets || 0, progress: Math.min(100, daysSinceLast/30*100),
      catKey: null,
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    });
  }

  // ── Sort and compute days diff ───────────────────────
  events.sort((a,b) => a.date - b.date);
  const withDays = events.map(ev => {
    const diffMs   = ev.date - today;
    const days     = Math.round(diffMs / (1000*60*60*24));
    const isPast   = days < 0;
    const isSoon   = days >= 0 && days <= 30;
    const color    = isPast   ? 'var(--ink-4)'
                   : isSoon   ? 'var(--amber,#f59e0b)'
                   : ev.type === 'reminder' ? '#4f8ef7'
                   : 'var(--green)';
    let daysLabel;
    if (days === 0)       daysLabel = 'היום';
    else if (days === 1)  daysLabel = 'מחר';
    else if (days === -1) daysLabel = 'אתמול';
    else if (days < 0)   daysLabel = `לפני ${Math.abs(days)} ימים`;
    else if (days < 30)  daysLabel = `בעוד ${days} ימים`;
    else if (days < 365) daysLabel = `בעוד ${Math.round(days/30)} חודשים`;
    else                 daysLabel = `בעוד ${(days/365).toFixed(1)} שנים`;
    return { ...ev, days, isPast, isSoon, color, daysLabel };
  });

  // ── Group by month ───────────────────────────────────
  const groups = {};
  withDays.forEach(ev => {
    const key = `${ev.date.getFullYear()}-${ev.date.getMonth()}`;
    if (!groups[key]) groups[key] = { label: ev.date.toLocaleDateString('he-IL',{month:'long',year:'numeric'}), items:[] };
    groups[key].items.push(ev);
  });

  if (!withDays.length) {
    el.innerHTML = `<div style="padding:60px 24px;text-align:center;color:var(--ink-4)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;margin-bottom:12px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <div style="font-size:.95rem;font-weight:600;color:var(--ink-3);margin-bottom:6px">אין אירועים בלוח השנה</div>
      <div style="font-size:.82rem">הגדר תאריכי פקיעה לפיקדונות<br/>דרך עריכת קטגוריה</div>
    </div>`;
    return;
  }

  // give every event a unique id for toggling
  withDays.forEach((ev,i) => { ev.uid = `cal-ev-${i}`; });

  const rowHtml = (ev, showDate=false) => {
    const hasVal     = ev.currentVal > 0 && ev.type !== 'reminder';
    const showExpand = ev.type === 'custom' && ev.catKey;
    const catFields  = showExpand
      ? (categories.find(c=>c.key===ev.catKey)?.custom_fields||[]).filter(f=>f.value)
      : [];

    const chevron = showExpand && catFields.length ? `
      <svg id="${ev.uid}-chv" width="14" height="14" viewBox="0 0 16 16" fill="none"
        style="flex-shrink:0;transition:transform .2s;color:var(--ink-4)">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>` : '';

    // progress bar — CSS gradient trick avoids RTL direction issues
    const progressBar = ev.progress != null ? `
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <span style="font-size:.68rem;color:var(--ink-4);font-weight:600">התקדמות לתאריך</span>
          <span style="font-size:.7rem;font-weight:800;color:${ev.color}">${Math.round(ev.progress)}%</span>
        </div>
        <div style="height:5px;border-radius:99px;background:linear-gradient(to left,${ev.color} ${ev.progress}%,var(--border) ${ev.progress}%)"></div>
      </div>` : '';

    const expandedBody = showExpand && catFields.length ? `
      <div id="${ev.uid}-body" style="display:none;padding:0 16px 14px 16px">
        <div style="border-top:1px solid var(--border);padding-top:14px">
          ${catFields.map(f => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:.75rem;color:var(--ink-4)">${f.label}</span>
              <span style="font-size:.78rem;font-weight:700;color:var(--ink);font-family:${f.type==='number'?'var(--mono)':'var(--font)'}">${
                f.type==='date' ? new Date(f.value).toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})
                : f.type==='number' ? Number(f.value).toLocaleString('he-IL')
                : f.value
              }</span>
            </div>`).join('')}
        </div>
      </div>` : '';

    const toggleAttr = showExpand && catFields.length
      ? `onclick="(()=>{const b=document.getElementById('${ev.uid}-body'),c=document.getElementById('${ev.uid}-chv');const op=b.style.display==='none';b.style.display=op?'block':'none';if(c)c.style.transform=op?'rotate(180deg)':'rotate(0deg)'})()"`
      : '';
    const headerCursor = showExpand && catFields.length ? 'cursor:pointer;' : '';

    return `
    <div style="border-radius:14px;background:var(--surface2);border:1px solid var(--border);margin-bottom:10px;overflow:hidden">
      <div ${toggleAttr} style="${headerCursor}padding:14px 16px">
        <!-- top row: icon + title + badge+date column on same line -->
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:10px;background:${ev.color}20;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${ev.color}">
            ${ev.icon}
          </div>
          <div style="flex:1;min-width:0;display:flex;align-items:center;gap:5px">
            <span style="font-size:${ev.title.length<18?'.88rem':ev.title.length<26?'.78rem':ev.title.length<34?'.7rem':'.62rem'};font-weight:700;color:${ev.isPast?'var(--ink-3)':'var(--ink)'}${ev.isPast?';opacity:.5':''};flex:1;white-space:nowrap">${ev.title}</span>
            ${chevron}
          </div>
          <div style="flex-shrink:0;text-align:center">
            <div style="padding:3px 9px;border-radius:99px;background:${ev.color}18;border:1px solid ${ev.color}33${showDate?';margin-bottom:3px':''}">
              <span style="font-size:.7rem;font-weight:800;color:${ev.color};white-space:nowrap">${ev.daysLabel}</span>
            </div>
            ${showDate?`<div style="font-size:.68rem;color:var(--ink-4);white-space:nowrap">${ev.date.toLocaleDateString('he-IL',{day:'numeric',month:'short'})}</div>`:''}
          </div>
        </div>
        ${hasVal ? `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:7px 11px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
          <span style="font-size:.7rem;color:var(--ink-4);font-weight:600">שווי נוכחי</span>
          <span style="font-family:var(--mono);font-size:.88rem;font-weight:800;color:${ev.isPast?'var(--ink-3)':'var(--ink)'}">${fmt(ev.currentVal)}</span>
        </div>` : ''}
        ${progressBar}
      </div>
      ${expandedBody}
    </div>`; };

  const groupsHtml = (filterPast) => {
    const filtered = withDays.filter(ev => filterPast ? ev.isPast : !ev.isPast);
    if (!filtered.length) return `<div style="padding:30px;text-align:center;color:var(--ink-4);font-size:.85rem">אין אירועים</div>`;
    const grps = {};
    filtered.forEach(ev => {
      const key = `${ev.date.getFullYear()}-${ev.date.getMonth()}`;
      if (!grps[key]) grps[key] = { items:[] };
      grps[key].items.push(ev);
    });
    return Object.values(grps).map(g => {
      const label = g.items.length === 1
        ? g.items[0].date.toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})
        : g.items[0].date.toLocaleDateString('he-IL',{month:'long',year:'numeric'});
      return `
      <div style="margin-bottom:20px">
        <div style="font-size:.72rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)">${label}</div>
        ${g.items.map(ev => rowHtml(ev, g.items.length > 1)).join('')}
      </div>`;
    }).join('');
  };

  // summary strip
  const upcoming = withDays.filter(e=>!e.isPast).length;
  const overdue  = withDays.filter(e=>e.isPast).length;

  const btnStyle = (active) =>
    `flex:1;min-width:0;padding:14px 16px;background:var(--surface2);border-radius:12px;` +
    `border:${active?'1.5px solid var(--green)':'1px solid var(--border)'};cursor:pointer;text-align:right;` +
    `transition:border .15s;`;

  el.innerHTML = `
    <div style="display:flex;gap:10px;margin-bottom:16px">
      <button id="cal-btn-upcoming" onclick="calFilter(false)"
        style="${btnStyle(true)}">
        <div style="font-size:.7rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">קרובים</div>
        <div style="font-family:var(--mono);font-size:1.4rem;font-weight:800;color:var(--green)">${upcoming}</div>
      </button>
      <button id="cal-btn-past" onclick="calFilter(true)"
        style="${btnStyle(false)}">
        <div style="font-size:.7rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">עברו</div>
        <div style="font-family:var(--mono);font-size:1.4rem;font-weight:800;color:var(--ink-3)">${overdue}</div>
      </button>
    </div>
    <div class="card" style="padding:16px" id="cal-events-panel">
      ${groupsHtml(false)}
    </div>`;

  // store events on the element for calFilter
  el._calWithDays = withDays;
  el._calRowHtml  = rowHtml;
}

function calFilter(showPast) {
  const el = document.getElementById('calendar-content');
  if (!el?._calWithDays) return;
  const withDays = el._calWithDays;
  const rowHtml  = el._calRowHtml;

  const btnUpcoming = document.getElementById('cal-btn-upcoming');
  const btnPast     = document.getElementById('cal-btn-past');
  const panel       = document.getElementById('cal-events-panel');

  const activeStyle   = 'flex:1;min-width:0;padding:14px 16px;background:var(--surface2);border-radius:12px;border:1.5px solid var(--green);cursor:pointer;text-align:right;';
  const inactiveStyle = 'flex:1;min-width:0;padding:14px 16px;background:var(--surface2);border-radius:12px;border:1px solid var(--border);cursor:pointer;text-align:right;';

  if (btnUpcoming) btnUpcoming.style.cssText = showPast ? inactiveStyle : activeStyle;
  if (btnPast)     btnPast.style.cssText     = showPast ? activeStyle   : inactiveStyle;

  const filtered = withDays.filter(ev => showPast ? ev.isPast : !ev.isPast);
  if (!filtered.length) { panel.innerHTML = `<div style="padding:30px;text-align:center;color:var(--ink-4);font-size:.85rem">אין אירועים</div>`; return; }
  const grps = {};
  filtered.forEach(ev => {
    const key = `${ev.date.getFullYear()}-${ev.date.getMonth()}`;
    if (!grps[key]) grps[key] = { items:[] };
    grps[key].items.push(ev);
  });
  panel.innerHTML = Object.values(grps).map(g => {
    const label = g.items.length === 1
      ? g.items[0].date.toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})
      : g.items[0].date.toLocaleDateString('he-IL',{month:'long',year:'numeric'});
    return `
    <div style="margin-bottom:20px">
      <div style="font-size:.72rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)">${label}</div>
      ${g.items.map(ev => rowHtml(ev, g.items.length > 1)).join('')}
    </div>`;
  }).join('');
}

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
    if (!entry) return `<div style="padding:10px 6px;border-radius:8px;background:var(--surface2);border:1px dashed var(--border);text-align:center">
      <div style="font-size:.78rem;font-family:var(--font);font-weight:600;color:var(--ink-3)">${m}</div>
      <div style="font-size:.72rem;color:var(--ink-4);margin-top:2px">—</div></div>`;
    const idx = calcs.indexOf(entry);
    const isBest  = idx === bestIdx;
    const isWorst = idx === worstIdx && worstDelta < 0;
    let deltaHtml = '';
    if (idx > 0) {
      const d = calcs[idx].c.totalAssets - calcs[idx-1].c.totalAssets;
      const p = calcs[idx-1].c.totalAssets ? (d/calcs[idx-1].c.totalAssets*100).toFixed(1) : null;
      if (p) deltaHtml = `<div style="font-size:.72rem;color:${d>=0?'var(--green)':'var(--red)'}">${d>=0?'+':''}${p}%</div>`;
    }
    const border = isBest ? '1.5px dashed var(--green)' : isWorst ? '1.5px dashed var(--red)' : '1px dashed var(--border)';
    return `<div style="padding:10px 6px;border-radius:8px;background:var(--surface2);border:${border};text-align:center">
      <div style="font-size:.78rem;font-family:var(--font);font-weight:600;color:var(--ink-3);display:flex;align-items:center;justify-content:center;gap:3px">${m}${isBest?`<svg width="10" height="10" viewBox="0 0 24 24" fill="var(--green)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`:isWorst?`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`:''}</div>
      <div style="font-size:.82rem;font-family:var(--mono);font-weight:700;color:var(--ink);margin-top:3px">${(entry.c.totalAssets/1000).toFixed(0)}K</div>
      ${deltaHtml}</div>`;
  }).join('');

  const SVG_UP    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
  const SVG_DOWN  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`;
  const SVG_STAR  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--green)" stroke="none" style="flex-shrink:0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const SVG_WARN  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--yellow, #f59e0b)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const SVG_AVG   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
  const SVG_INFO  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const SVG_FAST  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  const SVG_SLEEP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="8" y1="6" x2="16" y2="6"/><line x1="10" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="16" y2="18"/></svg>`;
  const SVG_TARGET= `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

  const insights = [];
  if (growth > 0) insights.push([SVG_UP,   `גדלת ב-${fmt(growth)} השנה — צמיחה של ${gPct}%`]);
  else            insights.push([SVG_DOWN,  `ירידה של ${fmt(Math.abs(growth))} השנה`]);
  if (bestIdx > 0)  insights.push([SVG_STAR, `החודש הטוב: ${mName(calcs[bestIdx].r.record_date)} (+${fmt(bestDelta)})`]);
  if (worstIdx > 0 && worstDelta < 0) insights.push([SVG_WARN, `החודש הקשה: ${mName(calcs[worstIdx].r.record_date)} (${fmt(worstDelta)})`]);
  const avgM = calcs.length > 1 ? growth/(calcs.length-1) : 0;
  if (avgM > 0) insights.push([SVG_AVG, `ממוצע חודשי: +${fmt(avgM)}`]);
  if (yr.length < 6) insights.push([SVG_INFO, `יש לך ${yr.length} חודשים מתועדים השנה בלבד`]);

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
      insights.push([SVG_FAST,  `הקטגוריה שצמחה הכי מהר: ${fastestCat.label} (+${fastestPct.toFixed(1)}%)`]);
    if (sleepyCat && Math.abs(sleepyPct) < 2)
      insights.push([SVG_SLEEP, `הקטגוריה הישנה ביותר: ${sleepyCat.label} — כמעט ללא שינוי (${sleepyPct >= 0 ? '+' : ''}${sleepyPct.toFixed(1)}%)`]);
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
      insights.push([SVG_TARGET, `אם המגמה תמשך — תגיע ל-${milLabel} ב${targetMonth} ${targetYear} (${monthsNeeded} חודשים)`]);
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
          <div style="font-size:.75rem;font-family:var(--font);font-weight:600;color:var(--ink-3);margin-bottom:6px">פתיחה</div>
          <div style="font-family:var(--mono);font-weight:700;color:var(--ink);font-size:.9rem">${fmt(first)}</div>
        </div>
        <div style="padding:14px;background:var(--surface2);border-radius:10px;text-align:center">
          <div style="font-size:.75rem;font-family:var(--font);font-weight:600;color:var(--ink-3);margin-bottom:6px">סגירה</div>
          <div style="font-family:var(--mono);font-weight:700;color:var(--ink);font-size:.9rem">${fmt(last)}</div>
        </div>
        <div style="padding:14px;background:var(--surface2);border-radius:10px;text-align:center;border:1.5px dashed ${growth>=0?'var(--green)':'var(--red)'}">
          <div style="font-size:.75rem;font-family:var(--font);font-weight:600;color:var(--ink-3);margin-bottom:6px">גידול</div>
          <div style="font-family:var(--mono);font-weight:800;color:${growth>=0?'var(--green)':'var(--red)'};font-size:.9rem">${growth>=0?'+':''}${gPct}%</div>
        </div>
      </div>
      <div class="section-header" style="margin-bottom:10px;font-size:.7rem">12 חודשים</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${monthGrid}</div>
    </div>
    <div class="card" style="padding:16px">
      <div style="font-size:.78rem;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">תובנות</div>
      ${insights.map(([icon, text])=>`<div style="padding:9px 0;border-bottom:1px solid var(--border);font-size:.875rem;color:var(--ink-2);line-height:1.5;display:flex;align-items:center;gap:8px">${icon}<span>${text}</span></div>`).join('')}
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
let catHistoryChart = null;

function openCatHistory(catKey, catLabel) {
  const panel = document.getElementById('cat-history-panel');
  const title = document.getElementById('cat-history-title');
  const body  = document.getElementById('cat-history-body');
  if (!panel) return;

  const isMortgage = catKey === '_mortgage';
  const cat = categories.find(c => c.key === catKey);
  const inst = cat?.institution_id ? getInstitution(cat.institution_id) : null;

  const instHtml = inst
    ? `<img src="${logoUrl(inst.domain)}" width="18" height="18" style="border-radius:4px;object-fit:contain;margin-right:4px" onerror="onInstLogoErr(this)"/> <span style="font-size:.78rem;color:var(--green);font-weight:600">${inst.name}</span>`
    : '';

  title.innerHTML = `${ICONS_JS.trending} <span>${catLabel}</span> ${instHtml}`;

  const sorted = [...records].sort((a,b) => new Date(a.record_date)-new Date(b.record_date));
  const allRecords = sorted; // show all months

  if (allRecords.length < 2) {
    body.innerHTML = '<div style="text-align:center;color:var(--ink-4);font-size:.875rem;padding:24px 0">אין מספיק נתונים היסטוריים</div>';
    document.getElementById('cat-history-insights').innerHTML = '';
    panel.style.display = 'flex';
    return;
  }

  const labels = [], values = [];
  allRecords.forEach(r => {
    labels.push(new Date(r.record_date).toLocaleDateString('he-IL', { month: 'short', year: '2-digit' }));
    values.push(isMortgage ? (r.mortgage_balance || 0) : ((r.values || {})[catKey] || 0));
  });

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const isPos = values[values.length-1] >= values[0];
  const lineColor = isMortgage ? '#ef4444' : (isPos ? '#0e9e7e' : '#ef4444');

  if (catHistoryChart) { catHistoryChart.destroy(); catHistoryChart = null; }

  const first = values[0], last = values[values.length-1];
  const totalDelta = last - first;
  const totalPct = first > 0 ? (totalDelta/first*100).toFixed(1) : null;
  const maxVal = Math.max(...values);
  const avgVal = values.reduce((s,v)=>s+v,0)/values.length;

  const insightColor = (pos) => pos ? 'var(--green)' : 'var(--red)';
  const SVG_UP   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
  const SVG_DOWN = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`;
  const SVG_AVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
  const SVG_PEAK = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

  // LTR-safe currency format for ticker
  const fmtT = v => '₪' + Math.round(Math.abs(v)).toLocaleString('he-IL');

  const ins = [];
  if (totalPct) {
    const pos = !isMortgage ? totalDelta >= 0 : totalDelta <= 0;
    ins.push([pos ? SVG_UP : SVG_DOWN,
      `שינוי כולל: <strong style="color:${insightColor(pos)}">${totalDelta>=0?'+':''}${fmtT(totalDelta)} (${totalDelta>=0?'+':''}${totalPct}%)</strong>`]);
  }
  ins.push([SVG_AVG, `ממוצע: <strong>${fmtT(Math.round(avgVal))}</strong>`]);
  if (maxVal > 0) ins.push([SVG_PEAK, `שיא: <strong>${fmtT(maxVal)}</strong>`]);

  // ── Build unified plain-text ticker (insights + custom fields) ──
  const tickerItems = ins.map(([icon, text]) =>
    `<span class="tkr-item">${icon} <bdi dir="rtl" class="tkr-text">${text}</bdi></span>`
  );

  // Append liquid_date countdown if set
  if (cat?.liquid_date) {
    const ld   = new Date(cat.liquid_date);
    const now0 = new Date();
    if (!isNaN(ld)) {
      const daysLeft = Math.ceil((ld - now0) / 86400000);
      const SVG_CAL = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      if (daysLeft > 0) {
        tickerItems.push(`<span class="tkr-item">${SVG_CAL} <bdi dir="rtl" class="tkr-text">נזיל בעוד: <strong style="color:#d97706">${daysLeft} ימים</strong></bdi></span>`);
      } else {
        tickerItems.push(`<span class="tkr-item">${SVG_CAL} <bdi dir="rtl" class="tkr-text"><strong style="color:var(--green)">✓ כבר נזיל</strong></bdi></span>`);
      }
      tickerItems.push(`<span class="tkr-item">${SVG_CAL} <bdi dir="rtl" class="tkr-text">תאריך נזילות: <strong>${ld.toLocaleDateString('he-IL', { day:'numeric', month:'short', year:'numeric' })}</strong></bdi></span>`);
    }
  }

  // Append custom fields as plain items
  const customFields = cat?.custom_fields || [];
  if (customFields.length) {
    const now2 = new Date();
    customFields.forEach(f => {
      if (f.value === '' || f.value === null || f.value === undefined) return;
      let display = f.value;
      let statusCls = '';
      if (f.type === 'date' && f.value) {
        const d = new Date(f.value);
        if (!isNaN(d)) {
          display = d.toLocaleDateString('he-IL', { day:'numeric', month:'short', year:'numeric' });
          const diff = Math.ceil((d - now2) / 86400000);
          if (diff < 0)        statusCls = 'tkr-expired';
          else if (diff <= 45) statusCls = 'tkr-warn';
        }
      } else if (f.type === 'number') {
        const n = parseFloat(f.value);
        if (!isNaN(n)) display = n.toLocaleString('he-IL'); // no ₪ for management fees etc.
      }
      const color = statusCls === 'tkr-expired' ? '#dc2626'
                  : statusCls === 'tkr-warn'    ? '#d97706' : '';
      const valHtml = color
        ? `<strong style="color:${color}">${display}</strong>`
        : `<strong>${display}</strong>`;
      tickerItems.push(`<span class="tkr-item"><bdi dir="rtl" class="tkr-text">${f.label}: ${valHtml}</bdi></span>`);
    });
  }

  // Separator between items + between the two copies
  const SEP = `<span class="tkr-sep">·</span>`;
  const oneLoop = tickerItems.join(SEP);
  const LOOP_SEP = `<span class="tkr-sep tkr-loop-sep">·</span>`;
  const tickerHtml = oneLoop + LOOP_SEP + oneLoop + LOOP_SEP;

  const tickerEl = document.getElementById('cat-history-ticker');
  if (tickerEl) {
    tickerEl.innerHTML = `<div class="tkr-track" id="tkr-track-inner">${tickerHtml}</div>`;
    // Use setTimeout so DOM is fully painted before measuring
    setTimeout(() => {
      const track = document.getElementById('tkr-track-inner');
      if (!track) return;
      const oneWidth = track.scrollWidth / 2;   // exact width of one copy
      if (oneWidth <= 0) return;
      const duration = oneWidth / 60;           // 80px/sec → seconds
      // translateX(-50%) = -oneWidth (relative to element, not container)
      // direction:ltr on both container+track ensures left=start, right=end
      track.style.animationDuration = `${duration.toFixed(2)}s`;
      track.style.animationPlayState = 'running';
    }, 60);
  }

  let rows = '';
  for (let i = allRecords.length - 1; i >= 0; i--) {
    const cur  = allRecords[i], prev = i > 0 ? allRecords[i-1] : null;
    const curVal  = isMortgage ? (cur.mortgage_balance||0)  : ((cur.values||{})[catKey]||0);
    const prevVal = prev ? (isMortgage ? (prev.mortgage_balance||0) : ((prev.values||{})[catKey]||0)) : null;
    const dateLabel = new Date(cur.record_date).toLocaleDateString('he-IL', { year:'numeric', month:'long' });
    let deltaHtml = '';
    if (prevVal === null) {
      deltaHtml = `<span style="font-size:.78rem;color:var(--ink-4)">—</span>`;
    } else if (prevVal > 0) {
      const delta = curVal - prevVal;
      const pct   = (delta/prevVal*100).toFixed(1);
      const pos   = isMortgage ? delta<=0 : delta>=0;
      deltaHtml = `<span style="font-size:.78rem;font-weight:700;color:${insightColor(pos)};font-family:var(--mono)">${delta>=0?'+':''}${pct}%</span>`;
    } else if (curVal>0 && prevVal===0) {
      deltaHtml = `<span style="font-size:.78rem;font-weight:700;color:var(--green);font-family:var(--font)">חדש</span>`;
    } else {
      deltaHtml = `<span style="font-size:.78rem;color:var(--ink-4)">—</span>`;
    }
    const chartIdx = i;
    const hoverAttrs = window.matchMedia('(hover: hover)').matches
      ? `onmouseenter="highlightChartPoint(${chartIdx})" onmouseleave="clearChartHighlight()"`
      : '';
    rows += `
    <div class="chb-hist-row chb-hist-row-edit"
      data-record-id="${cur.id}"
      data-cur-val="${curVal}"
      data-prev-val="${prevVal ?? 0}"
      ${hoverAttrs}
      ${!isMortgage ? `
        data-cat-id="${cat?.id||''}"
        data-cat-key="${catKey}"
        data-cat-label="${catLabel.replace(/"/g,'&quot;').replace(/'/g,'&#39;')}"
        onclick="openQuickCatEntryFromRow(this)"` : `
        onclick="openQuickMortgageEntry(this)"`}
      style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:.875rem;cursor:pointer">
      <span style="color:var(--ink-3)">${dateLabel}</span>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-family:var(--mono);font-size:.82rem;color:var(--ink-2)" class="blur-text">${fmt(curVal)}</span>
        ${deltaHtml}
        <span class="chb-edit-hint">${ICONS_JS.edit}</span>
      </div>
    </div>`;
  }
  body.innerHTML = rows;

  // Show panel FIRST so canvas gets real dimensions, then draw chart
  panel.style.display = 'flex';
  setTimeout(() => {
    applyBlur();
    const canvasEl = document.getElementById('cat-history-chart');
    if (canvasEl) {
      // Force canvas dimensions explicitly for iOS Safari
      canvasEl.width  = canvasEl.offsetWidth  || 400;
      canvasEl.height = 180;
      const ctx2 = canvasEl.getContext('2d');
      if (ctx2) {
        const grad = ctx2.createLinearGradient(0, 0, 0, 180);
        grad.addColorStop(0, lineColor + '33');
        grad.addColorStop(1, lineColor + '00');
        catHistoryChart = new Chart(ctx2, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              data: values,
              borderColor: lineColor,
              backgroundColor: grad,
              fill: true, tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: lineColor,
              pointBorderColor: isDark ? '#1f2937' : '#ffffff',
              pointBorderWidth: 2, borderWidth: 2.5,
              pointHoverRadius: 0,
            }]
          },
          options: {
            animation: { duration:400, easing:'easeOutQuart' },
            responsive: true, maintainAspectRatio: false,
            interaction: { mode:'index', intersect:false, axis:'x' },
            plugins: { legend:{ display:false }, tooltip:{ enabled:false } },
            scales: {
              x: { grid:{display:false}, ticks:{color:tickColor,font:{size:11,family:"'Heebo',sans-serif",weight:'600'}} },
              y: { grid:{color:gridColor}, border:{display:false},
                   ticks:{color:tickColor,font:{size:10,family:"'JetBrains Mono',monospace",weight:'600'},
                          callback:v=>Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K':v} }
            }
          },
          plugins: [crosshairPlugin]
        });
      }
    }
  }, 32);
}

function closeCatHistory() {
  const panel = document.getElementById('cat-history-panel');
  if (panel) panel.style.display = 'none';
  if (catHistoryChart) { catHistoryChart.destroy(); catHistoryChart = null; }
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


/* ══ QUICK CATEGORY VALUE ENTRY ══════════════════════ */


function openQuickMortgageEntry(el) {
  const d        = el.dataset;
  const recordId = d.recordId;
  const curVal   = parseFloat(d.curVal) || 0;
  const prevVal  = parseFloat(d.prevVal) || 0;

  const targetRecord = records.find(r => r.id === recordId);
  if (!targetRecord) return showToast('⚠️ לא נמצאה הרשומה');

  const dateLabel  = new Date(targetRecord.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  const mortInstId = localStorage.getItem('mortgage_inst_v1') || targetRecord.values?._mortgage_inst;
  const mortInst   = mortInstId ? getInstitution(mortInstId) : null;

  const logoHtml = mortInst
    ? `<img src="${logoUrl(mortInst.domain)}" alt="${mortInst.name}" style="width:48px;height:48px;border-radius:12px;object-fit:contain;margin-bottom:4px;display:block" onerror="this.style.display='none'"/>`
    : `<div style="color:var(--red);margin-bottom:4px"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`;
  const instSubHtml = mortInst
    ? `<div class="wz-step-sub" style="color:var(--green)">${mortInst.name}</div>`
    : `<div class="wz-step-sub">ללא גוף מנהל</div>`;

  const prevHint = prevVal
    ? `<div class="wz-prev-hint" style="color:var(--ink-3);display:flex;align-items:center;justify-content:center;gap:4px;font-family:var(--font);font-size:.8rem">${ICONS_JS.clock} חודש שעבר: <span style="font-family:var(--mono);font-weight:600">${fmt(prevVal)}</span></div>`
    : '';

  document.getElementById('quick-mortgage-modal')?.remove();
  const modal = document.createElement('div');
  modal.id        = 'quick-mortgage-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '1200';
  modal.innerHTML = `
    <div class="wz-card">
      <div class="wz-header">
        <span style="font-size:.9rem;font-weight:700;color:var(--ink)">${dateLabel}</span>
        <button onclick="document.getElementById('quick-mortgage-modal').remove()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex">${ICONS_JS.x}</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:8px 24px 4px;display:flex;flex-direction:column;align-items:center;text-align:center">
        <div class="wz-step-icon">${logoHtml}</div>
        <div class="wz-step-title">יתרת משכנתא</div>
        ${instSubHtml}
        <div class="wz-amount-wrap">
          <span class="wz-currency">₪</span>
          <input type="number" id="quick-mortgage-input" class="form-input wz-amount-input"
            value="${curVal || ''}" placeholder="0" inputmode="numeric"
            onkeydown="if(event.key==='Enter')saveQuickMortgageEntry('${recordId}')"/>
        </div>
        ${prevHint}
      </div>
      <div class="wz-footer">
        <button class="wz-btn-secondary" onclick="document.getElementById('quick-mortgage-modal').remove()">ביטול</button>
        <button class="wz-btn-primary" style="display:flex;align-items:center;justify-content:center;gap:7px"
          onclick="saveQuickMortgageEntry('${recordId}')">
          שמור ${ICONS_JS.save}
        </button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    const inp = document.getElementById('quick-mortgage-input');
    if (!inp) return;
    inp.readOnly = true;
    inp.focus();
    inp.readOnly = false;
    inp.select();
  });
}

async function saveQuickMortgageEntry(recordId) {
  const target = records.find(r => r.id === recordId);
  if (!target) return;
  const val = parseFloat(document.getElementById('quick-mortgage-input')?.value || 0) || 0;
  showLoader('שומר...');
  const { error } = await db.from('monthly_records')
    .update({ mortgage_balance: val })
    .eq('id', target.id)
    .eq('user_id', currentUser.id);
  hideLoader();
  if (error) return showToast('שגיאה: ' + error.message);
  document.getElementById('quick-mortgage-modal')?.remove();
  await loadRecords();
  renderCurrentReport();
  showToast('✅ עודכן!');
}

function openQuickCatEntryFromRow(el) {
  const d = el.dataset;
  openQuickCatEntry(d.catId, d.catKey, d.catLabel, parseFloat(d.curVal)||0, d.recordId, parseFloat(d.prevVal)||0);
}

function openQuickCatEntry(catId, catKey, catLabel, currentVal, recordId, prevValOverride) {
  if (!records.length) return showToast('⚠️ אין חודש קיים — הוסף חודש קודם');

  // Use the specified record or fall back to latest
  const targetRecord = recordId ? records.find(r => r.id === recordId) : records[records.length - 1];
  if (!targetRecord) return showToast('⚠️ לא נמצאה הרשומה');

  const dateLabel = new Date(targetRecord.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
  const cat       = categories.find(c => c.id === catId);
  const inst      = cat?.institution_id ? getInstitution(cat.institution_id) : null;

  // Logo / icon — same as wizard step
  const logoHtml = inst
    ? `<img src="${logoUrl(inst.domain)}" alt="${inst.name}" style="width:48px;height:48px;border-radius:12px;object-fit:contain;margin-bottom:4px;display:block" onerror="this.style.display='none'"/>`
    : `<div style="color:var(--ink-3);margin-bottom:4px">${getCatSvg(cat || {key:catKey})}</div>`;
  const instSubHtml = inst
    ? `<div class="wz-step-sub" style="color:var(--green)">${inst.name}</div>`
    : `<div class="wz-step-sub">ללא גוף מנהל</div>`;

  // Previous month hint: use override if provided, otherwise find previous record
  let prevHint = '';
  const prevVal = prevValOverride != null ? prevValOverride : (() => {
    const idx = records.findIndex(r => r.id === targetRecord.id);
    if (idx > 0) return (records[idx - 1].values || {})[catKey] || 0;
    return 0;
  })();
  if (prevVal) {
    prevHint = `<div class="wz-prev-hint" style="color:var(--ink-3);display:flex;align-items:center;justify-content:center;gap:4px;font-family:var(--font);font-size:.8rem">${ICONS_JS.clock} חודש שעבר: <span style="font-family:var(--mono);font-weight:600">${fmt(prevVal)}</span></div>`;
  }

  document.getElementById('quick-cat-modal')?.remove();
  const modal = document.createElement('div');
  modal.id    = 'quick-cat-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '1200';
  modal.innerHTML = `
    <div class="wz-card">
      <div class="wz-header">
        <span style="font-size:.9rem;font-weight:700;color:var(--ink)">${dateLabel}</span>
        <button onclick="document.getElementById('quick-cat-modal').remove()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);display:flex">${ICONS_JS.x}</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:8px 24px 4px;display:flex;flex-direction:column;align-items:center;text-align:center">
        <div class="wz-step-icon">${logoHtml}</div>
        <div class="wz-step-title">${catLabel}</div>
        ${instSubHtml}
        <div class="wz-amount-wrap">
          <span class="wz-currency">₪</span>
          <input type="number" id="quick-cat-input" class="form-input wz-amount-input"
            value="${currentVal || ''}" placeholder="0" inputmode="numeric"
            onkeydown="if(event.key==='Enter')saveQuickCatEntry('${catId}','${catKey}')"/>
        </div>
        ${prevHint}
      </div>
      <div class="wz-footer">
        <button class="wz-btn-secondary" onclick="document.getElementById('quick-cat-modal').remove()">ביטול</button>
        <button class="wz-btn-primary" style="display:flex;align-items:center;justify-content:center;gap:7px"
          onclick="saveQuickCatEntry('${catId}','${catKey}','${targetRecord.id}')">
          שמור ${ICONS_JS.save}
        </button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    const inp = document.getElementById('quick-cat-input');
    if (!inp) return;
    inp.readOnly = true;          // trick iOS into not scrolling on focus
    inp.focus();
    inp.readOnly = false;
    inp.select();
  });
}

async function saveQuickCatEntry(catId, catKey, recordId) {
  const target = recordId ? records.find(r => r.id === recordId) : records[records.length - 1];
  if (!target) return;
  const val       = parseFloat(document.getElementById('quick-cat-input')?.value || 0) || 0;
  const newValues = { ...(target.values || {}), [catKey]: val };
  showLoader('שומר...');
  const { error } = await db.from('monthly_records')
    .update({ values: newValues })
    .eq('id', target.id)
    .eq('user_id', currentUser.id);
  hideLoader();
  if (error) return showToast('שגיאה: ' + error.message);
  document.getElementById('quick-cat-modal')?.remove();
  await loadRecords();
  renderCurrentReport();
  showToast('✅ עודכן!');
}

function openAddCatFromMain() {
  const modal = document.getElementById('settings-modal');
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
  showSettings('categories');
  setTimeout(() => {
    toggleCatNameDropdown();
    requestAnimationFrame(() => {
      modal.style.transition = 'opacity .18s';
      modal.style.opacity = '1';
      modal.style.pointerEvents = '';
      setTimeout(() => { modal.style.transition = ''; }, 200);
    });
  }, 60);
}

let _lastTouchTime = 0;
document.addEventListener('touchstart', () => { _lastTouchTime = Date.now(); }, { passive: true });

function toggleMonthPicker() {
  const dd = document.getElementById('month-picker-dropdown');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  dd.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closePicker(e) {
        if (!dd.contains(e.target) && e.target.id !== 'month-picker-btn') {
          dd.style.display = 'none';
          document.removeEventListener('click', closePicker);
        }
      });
    }, 0);
  }
}

function selectRecord(idx) {
  currentRecordIndex = idx === records.length - 1 ? -1 : idx;
  const dd = document.getElementById('month-picker-dropdown');
  if (dd) dd.style.display = 'none';
  renderCurrentReport();
}

function navigateRecord(dir) {
  const cur = currentRecordIndex < 0 ? records.length - 1 : currentRecordIndex;
  const next = cur + dir;
  if (next < 0 || next >= records.length) return;
  currentRecordIndex = next;
  renderCurrentReport();
}

function highlightChartPoint(idx) {
  if (Date.now() - _lastTouchTime < 500) return; // ignore mouseenter fired by iOS touch
  if (!catHistoryChart) return;
  catHistoryChart.setActiveElements([{datasetIndex:0, index:idx}]);
  catHistoryChart.update('none');
}
function clearChartHighlight() {
  if (!catHistoryChart) return;
  catHistoryChart.setActiveElements([]);
  catHistoryChart.update('none');
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

/* ══ VIEW MODE (grid / list) ════════════════════════════ */
function applyViewMode(mode) {
  viewMode = mode;
  const toggle = document.getElementById('list-view-toggle');
  if (toggle) toggle.checked = (mode === 'list');
  renderCurrentReport();
}

async function toggleViewMode(isListView) {
  const mode = isListView ? 'list' : 'grid';
  applyViewMode(mode);
  if (currentUser) {
    const { data } = await db.auth.updateUser({ data: { view_mode: mode } });
    if (data?.user) currentUser = data.user;
  }
}

function syncViewModeFromCloud() {
  if (!currentUser) return;
  const mode = currentUser.user_metadata?.view_mode || 'grid';
  applyViewMode(mode);
}

/* ══ NAV STYLE (floating / classic) ════════════════════ */
function applyNavStyle(style) {
  navStyle = style;
  document.body.setAttribute('data-nav', style);
  const toggle = document.getElementById('nav-style-toggle');
  if (toggle) toggle.checked = (style === 'floating');
}

async function toggleNavStyle(isFloating) {
  const style = isFloating ? 'floating' : 'classic';
  applyNavStyle(style);
  if (currentUser) {
    const { data } = await db.auth.updateUser({ data: { nav_style: style } });
    if (data?.user) currentUser = data.user;
  }
}

function syncNavStyleFromCloud() {
  if (!currentUser) return;
  const style = currentUser.user_metadata?.nav_style || 'floating';
  applyNavStyle(style);
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
