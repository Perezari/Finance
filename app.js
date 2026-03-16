/* ── SUPABASE ──────────────────────────────────────── */
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── STATE ─────────────────────────────────────────── */
let currentUser  = null;
let categories   = [];
let records      = [];
let blurActive   = false;
let mainChart    = null;
let retChart     = null;
let editMode     = false; // true when editing existing record

/* ── INIT ──────────────────────────────────────────── */
async function init() {
  showLoader('מאמת...');
  let appLoaded = false;
  try {
    const { data: { session } } = await db.auth.getSession();
    if (session?.user) { currentUser = session.user; appLoaded = true; await loadApp(); }
    else showScreen('auth');
  } catch(e) { console.error(e); showScreen('auth'); }

  db.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session && !appLoaded) {
      currentUser = session.user; appLoaded = true; await loadApp();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null; appLoaded = false; records = []; categories = [];
      showScreen('auth');
    }
  });
  hideLoader();
}

async function loadApp() {
  showLoader('טוען נתונים...');
  await Promise.all([loadCategories(), loadRecords()]);
  loadRetirementSettings();
  renderCurrentReport();
  updateUserUI();
  showScreen('app');
  hideLoader();
}

function updateUserUI() {
  if (!currentUser) return;
  const email   = currentUser.email || '';
  const name    = currentUser.user_metadata?.full_name || email;
  const initial = (name[0] || '?').toUpperCase();
  ['user-email-display','user-email-display2'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = email;
  });
  const av = document.getElementById('user-avatar-char');
  if (av) av.textContent = initial;
}

/* ── AUTH ──────────────────────────────────────────── */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-password').value;
  if (!email || !pw) return showAuthMsg('יש למלא אימייל וסיסמה', false);
  showLoader('מכנס...');
  const { error } = await db.auth.signInWithPassword({ email, password: pw });
  hideLoader();
  if (error) showAuthMsg(translateError(error.message), false);
}

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

async function handleLogout() { closeSettings(); await db.auth.signOut(); }

function translateError(msg) {
  return ({ 'Invalid login credentials':'אימייל או סיסמה שגויים',
             'Email not confirmed':'יש לאשר את האימייל קודם',
             'User already registered':'משתמש כבר קיים – נסה להיכנס' })[msg] || msg;
}

function switchAuthTab(tab) {
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
  document.querySelectorAll('.auth-tab').forEach((b,i) =>
    b.classList.toggle('active', (i===0&&tab==='login')||(i===1&&tab==='register')));
  hideAuthMsg();
}

/* ── CATEGORIES ────────────────────────────────────── */
const DEFAULT_CATEGORIES = [
  { key:'cash',        label:'מזומן',         icon:'💵', order_index:0 },
  { key:'currentAcc',  label:'עו"ש',          icon:'🏦', order_index:1 },
  { key:'deposit',     label:'פיקדון/חסכון',  icon:'🏛️', order_index:2 },
  { key:'savingsFund', label:'קרן השתלמות',   icon:'📈', order_index:3 },
  { key:'pensionFund', label:'פנסיה',         icon:'🧓', order_index:4 },
];

async function createDefaultCategories(userId) {
  await db.from('categories').insert(DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: userId })));
}

async function loadCategories() {
  const { data } = await db.from('categories').select('*').order('order_index');
  categories = data || [];
  if (!categories.length) {
    await createDefaultCategories(currentUser.id);
    const { data: fresh } = await db.from('categories').select('*').order('order_index');
    categories = fresh || [];
  }
}

async function addCategory() {
  const key   = document.getElementById('new-cat-key').value.trim();
  const label = document.getElementById('new-cat-label').value.trim();
  const icon  = document.getElementById('new-cat-icon').value.trim() || '💰';
  if (!key || !label)                      return alert('נא למלא מזהה ושם');
  if (!/^[a-zA-Z0-9_]+$/.test(key))       return alert('מזהה – אנגלית בלבד');
  if (categories.find(c => c.key === key)) return alert('מזהה זה כבר קיים');
  showLoader('מוסיף...');
  await db.from('categories').insert({ user_id: currentUser.id, key, label, icon, order_index: categories.length });
  await loadCategories(); hideLoader();
  renderCategoriesList(); renderDynamicFields();
  showToast('✅ קטגוריה נוספה');
  ['new-cat-key','new-cat-label','new-cat-icon'].forEach(id => document.getElementById(id).value = '');
}

async function deleteCategory(id) {
  if (!confirm('למחוק קטגוריה זו?')) return;
  showLoader('מוחק...');
  await db.from('categories').delete().eq('id', id).eq('user_id', currentUser.id);
  await loadCategories(); hideLoader();
  renderCategoriesList(); renderDynamicFields();
  showToast('🗑️ נמחקה');
}

/* ── RECORDS ────────────────────────────────────────── */
async function loadRecords() {
  const { data } = await db.from('monthly_records').select('*').order('record_date', { ascending: true });
  records = data || [];
}

/* Open add form – if record passed, fill for editing */
function openAddForm(record) {
  editMode = !!record;
  const form     = document.getElementById('add-form');
  const title    = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const editId   = document.getElementById('edit-record-id');

  renderDynamicFields();
  form.style.display = 'block';

  if (record) {
    title.textContent    = '✏️ עריכת חודש';
    submitBtn.textContent = '💾 עדכן';
    editId.value         = record.id;

    // Fill date
    document.getElementById('new-date').value     = record.record_date;
    document.getElementById('new-mortgage').value = record.mortgage_balance || '';
    document.getElementById('new-notes').value    = record.notes || '';

    // Fill category fields
    const vals = record.values || {};
    categories.forEach(cat => {
      const el = document.getElementById(`field_${cat.key}`);
      if (el) el.value = vals[cat.key] || '';
    });
  } else {
    title.textContent    = '📝 הוספת חודש חדש';
    submitBtn.textContent = '💾 שמור';
    editId.value          = '';
    ['new-date','new-mortgage','new-notes'].forEach(id => document.getElementById(id).value = '');
    categories.forEach(cat => {
      const el = document.getElementById(`field_${cat.key}`); if (el) el.value = '';
    });
  }

  // Scroll form into view
  setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

async function submitRecord() {
  const date = document.getElementById('new-date').value;
  if (!date) return alert('יש לבחור תאריך');

  const values = {};
  categories.forEach(cat => {
    const el = document.getElementById(`field_${cat.key}`);
    values[cat.key] = parseFloat(el?.value || 0) || 0;
  });
  const mortgage = parseFloat(document.getElementById('new-mortgage').value || 0) || 0;
  const notes    = document.getElementById('new-notes').value.trim();
  const editId   = document.getElementById('edit-record-id').value;

  showLoader(editMode ? 'מעדכן...' : 'שומר...');

  let error;
  if (editMode && editId) {
    // Update specific record by id
    ({ error } = await db.from('monthly_records')
      .update({ record_date: date, values, mortgage_balance: mortgage, notes })
      .eq('id', editId).eq('user_id', currentUser.id));
  } else {
    ({ error } = await db.from('monthly_records').upsert(
      { user_id: currentUser.id, record_date: date, values, mortgage_balance: mortgage, notes },
      { onConflict: 'user_id,record_date' }
    ));
  }

  hideLoader();
  if (error) { alert('שגיאה: ' + error.message); return; }

  await loadRecords();
  renderCurrentReport();
  ['new-date','new-mortgage','new-notes'].forEach(id => document.getElementById(id).value = '');
  categories.forEach(cat => { const el = document.getElementById(`field_${cat.key}`); if (el) el.value = ''; });
  document.getElementById('add-form').style.display = 'none';
  document.getElementById('history-detail').style.display = 'none';
  document.getElementById('dateSelect').value = '';
  editMode = false;

  if (document.getElementById('tab-history').style.display !== 'none') renderHistoryTab();
  showToast(editMode ? '✅ עודכן!' : '✅ נשמר!');
}

async function deleteRecord(id) {
  if (!confirm('למחוק את החודש הזה?')) return;
  showLoader('מוחק...');
  await db.from('monthly_records').delete().eq('id', id).eq('user_id', currentUser.id);
  await loadRecords(); hideLoader();
  renderCurrentReport(); renderHistoryTab();
  document.getElementById('history-detail').style.display = 'none';
  document.getElementById('dateSelect').value = '';
  showToast('🗑️ נמחק');
}

/* ── CALCULATIONS ───────────────────────────────────── */
function calcRecord(r) {
  const v = r.values || {};
  const totalAssets = categories.reduce((s,c) => s + (v[c.key]||0), 0);
  const mortgage    = r.mortgage_balance || 0;
  return { totalAssets, mortgage, netWorth: totalAssets - mortgage, ...v };
}

/* ── RENDER CURRENT ─────────────────────────────────── */
function renderCurrentReport() {
  const el = document.getElementById('current-card');
  if (!records.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <p>אין נתונים עדיין</p>
        <p>עבור ל"היסטוריה" והוסף את החודש הראשון שלך</p>
      </div>`; return;
  }

  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date)
    .toLocaleDateString('he-IL', { year:'numeric', month:'long' });

  let growthSub = '', growthHtml = '';
  if (records.length >= 2) {
    const prev  = calcRecord(records[records.length - 2]);
    const delta = calc.totalAssets - prev.totalAssets;
    const pct   = prev.totalAssets ? (delta / prev.totalAssets * 100).toFixed(2) : '0.00';
    const sign  = delta >= 0 ? '+' : '';
    const cls   = delta >= 0 ? 'pos' : 'neg';
    const avg   = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length - 1);
    growthSub   = `<span class="ht-sub ${cls}">${sign}${pct}% מחודש קודם</span>`;
    growthHtml  = `
      <div class="growth-card">
        <div class="gc-header">
          <span class="gc-title">📊 נתוני צמיחה</span>
          <span class="gc-badge ${cls}">${sign}${pct}% החודש</span>
        </div>
        <div class="gc-row">
          <span class="gc-row-label">צמיחה מחודש קודם</span>
          <span class="gc-row-val ${cls} blur-text">${sign}${fmt(delta)}</span>
        </div>
        <div class="gc-row">
          <span class="gc-row-label">צמיחה ממוצעת לחודש</span>
          <span class="gc-row-val blur-text">${fmt(avg)}</span>
        </div>
      </div>`;
  }

  const liquidKeys = ['cash','currentAcc','savingsFund'];
  const liquid     = categories.filter(c => liquidKeys.includes(c.key)).reduce((s,c)=>s+(calc[c.key]||0),0);
  const liquidPct  = calc.totalAssets ? ((liquid/calc.totalAssets)*100).toFixed(1) : '0';

  const mortgageHero = calc.mortgage > 0 ? `
    <div class="hero-tile danger" style="animation-delay:.1s">
      <div class="ht-label">🏠 יתרת משכנתא</div>
      <div class="ht-value blur-text">${fmt(calc.mortgage)}</div>
    </div>
    <div class="hero-tile warning" style="animation-delay:.15s">
      <div class="ht-label">💎 שווי נקי</div>
      <div class="ht-value blur-text">${fmt(calc.netWorth)}</div>
    </div>` : '';

  const catTiles = categories.map((cat,i) => `
    <div class="cat-tile" style="animation-delay:${.05*(i+1)}s">
      <span class="ct-icon">${cat.icon}</span>
      <div class="ct-label">${cat.label}</div>
      <div class="ct-value blur-text">${fmt(calc[cat.key]||0)}</div>
    </div>`).join('');

  const notesHtml = latest.notes
    ? `<div class="notes-bar ${latest.notes.includes('✔️')?'pos':'neg'}">${latest.notes}</div>` : '';

  el.innerHTML = `
    <div class="hero-strip">
      <div class="hero-tile accent">
        <div class="ht-label">📈 סה"כ נכסים</div>
        <div class="ht-value blur-text">${fmt(calc.totalAssets)}</div>
        ${growthSub}
      </div>
      <div class="hero-tile" style="animation-delay:.05s">
        <div class="ht-label">💧 נכסים נזילים</div>
        <div class="ht-value blur-text">${fmt(liquid)}</div>
        <span class="ht-sub">${liquidPct}% מהתיק</span>
      </div>
      ${mortgageHero}
    </div>
    <div class="section-header">פירוט נכסים – ${dateLabel}</div>
    <div class="cat-grid">${catTiles}</div>
    ${growthHtml}
    ${notesHtml}`;
  applyBlur();
}

/* ── RENDER HISTORY ─────────────────────────────────── */
function renderHistoryTab() { renderChart(); populateDateSelect(); renderDynamicFields(); }

function renderChart() {
  const canvas = document.getElementById('main-chart');
  if (!canvas) return;
  if (mainChart) { mainChart.destroy(); mainChart = null; }
  if (!records.length) return;

  const labels    = records.map(r => new Date(r.record_date).toLocaleDateString('he-IL',{month:'short',year:'2-digit'}));
  const totals    = records.map(r => calcRecord(r).totalAssets);
  const mortgages = records.map(r => r.mortgage_balance||0);
  const nets      = records.map(r => calcRecord(r).netWorth);
  const hasMort   = mortgages.some(m => m > 0);

  const datasets = [{
    label:'סה"כ נכסים', data:totals, borderColor:'#0e9e7e',
    backgroundColor:'rgba(14,158,126,.08)', fill:true, tension:.4,
    pointRadius:5, pointBackgroundColor:'#0e9e7e', pointBorderColor:'#fff', pointBorderWidth:2,
  }];
  if (hasMort) {
    datasets.push({ label:'יתרת משכנתא', data:mortgages, borderColor:'#ef4444',
      backgroundColor:'transparent', fill:false, tension:.4,
      pointRadius:5, pointBackgroundColor:'#ef4444', pointBorderColor:'#fff', pointBorderWidth:2 });
    datasets.push({ label:'שווי נקי', data:nets, borderColor:'#f59e0b',
      backgroundColor:'rgba(245,158,11,.06)', fill:false, tension:.4, borderDash:[5,4],
      pointRadius:5, pointBackgroundColor:'#f59e0b', pointBorderColor:'#fff', pointBorderWidth:2 });
  }

  mainChart = new Chart(canvas, { type:'line', data:{ labels, datasets }, options: chartOptions() });
}

function populateDateSelect() {
  const sel = document.getElementById('dateSelect'); if (!sel) return;
  sel.innerHTML = '<option value="" disabled selected>בחר חודש לפירוט</option>';
  [...records].reverse().forEach(r => {
    const o = document.createElement('option');
    o.value = r.id;
    o.textContent = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
    sel.appendChild(o);
  });
}

function onDateChange() {
  const r = records.find(r => r.id === document.getElementById('dateSelect').value);
  if (r) renderDetailCard(r);
}

function renderDetailCard(record) {
  const calc      = calcRecord(record);
  const dateLabel = new Date(record.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});

  const mortRows = calc.mortgage > 0 ? `
    <div class="hd-row"><span class="hd-row-label">🏠 יתרת משכנתא</span>
      <span class="hd-row-val neg blur-text">${fmt(calc.mortgage)}</span></div>
    <div class="hd-row total-row"><span class="hd-row-label">💎 שווי נקי</span>
      <span class="hd-row-val blur-text">${fmt(calc.netWorth)}</span></div>` : '';

  const notesHtml = record.notes
    ? `<div class="notes-bar ${record.notes.includes('✔️')?'pos':'neg'}" style="margin:14px 18px">${record.notes}</div>` : '';

  const container = document.getElementById('history-detail');
  container.innerHTML = `
    <div class="hd-card">
      <div class="hd-header">
        <span class="hd-date">📅 ${dateLabel}</span>
        <div style="display:flex;gap:8px">
          <button class="edit-btn" onclick="openAddForm(${JSON.stringify(record).replace(/"/g,'&quot;')})">✏️ ערוך</button>
          <button class="delete-btn" onclick="deleteRecord('${record.id}')">🗑️ מחק</button>
        </div>
      </div>
      ${categories.map(cat => `
      <div class="hd-row"><span class="hd-row-label">${cat.icon} ${cat.label}</span>
        <span class="hd-row-val blur-text">${fmt(calc[cat.key]||0)}</span></div>`).join('')}
      <div class="hd-row total-row">
        <span class="hd-row-label" style="font-weight:700">📈 סה"כ נכסים</span>
        <span class="hd-row-val blur-text">${fmt(calc.totalAssets)}</span></div>
      ${mortRows}
    </div>${notesHtml}`;
  container.style.display = 'block';
  applyBlur();
  setTimeout(() => container.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

function renderDynamicFields() {
  const container = document.getElementById('dynamic-fields'); if (!container) return;
  container.innerHTML = categories.map(cat => `
    <div class="form-field">
      <label>${cat.icon} ${cat.label}</label>
      <input type="number" id="field_${cat.key}" placeholder="0" class="form-input"/>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════
   RETIREMENT PLANNING
══════════════════════════════════════════════════════ */

const RET_KEY = 'ret_settings_v1';

function loadRetirementSettings() {
  try {
    const saved = localStorage.getItem(RET_KEY);
    if (saved) {
      const s = JSON.parse(saved);
      ['ret-current-age','ret-age','ret-return','ret-monthly'].forEach(id => {
        const el = document.getElementById(id);
        if (el && s[id] !== undefined) el.value = s[id];
      });
    }
  } catch(e) {}
}

function saveRetirementSettings() {
  const s = {};
  ['ret-current-age','ret-age','ret-return','ret-monthly'].forEach(id => {
    const el = document.getElementById(id); if (el) s[id] = el.value;
  });
  localStorage.setItem(RET_KEY, JSON.stringify(s));
}

function renderRetirement() {
  saveRetirementSettings();

  const currentAge  = parseInt(document.getElementById('ret-current-age').value) || 0;
  const retireAge   = parseInt(document.getElementById('ret-age').value)          || 0;
  const annualReturn = parseFloat(document.getElementById('ret-return').value)    || 0;
  const monthlySave  = parseFloat(document.getElementById('ret-monthly').value)   || 0;

  if (!currentAge || !retireAge || retireAge <= currentAge) {
    document.getElementById('ret-summary').innerHTML =
      `<div class="ret-hint">הכנס גיל נוכחי וגיל פרישה להצגת התחזית</div>`;
    return;
  }

  const yearsLeft   = retireAge - currentAge;
  const monthsLeft  = yearsLeft * 12;
  const monthlyRate = annualReturn / 100 / 12;

  // Starting point = current total assets
  const startAssets = records.length ? calcRecord(records[records.length - 1]).totalAssets : 0;

  // Average monthly organic growth from history
  let avgMonthlyGrowth = 0;
  if (records.length >= 2) {
    const first = calcRecord(records[0]).totalAssets;
    const last  = calcRecord(records[records.length - 1]).totalAssets;
    avgMonthlyGrowth = (last - first) / (records.length - 1);
  }

  // Project month by month
  const projectionMonthly = [startAssets];
  let val = startAssets;
  for (let m = 1; m <= monthsLeft; m++) {
    if (monthlyRate > 0) {
      val = val * (1 + monthlyRate) + monthlySave;
    } else {
      // No return rate – use historical avg growth + monthly savings
      val = val + avgMonthlyGrowth + monthlySave;
    }
    projectionMonthly.push(Math.max(0, val));
  }

  const projectedAmount = projectionMonthly[projectionMonthly.length - 1];

  // Build year-by-year arrays for chart
  const yearLabels     = [];
  const projByYear     = [];
  const historicalByYear = [];

  // Historical data
  records.forEach(r => {
    const d = new Date(r.record_date);
    const age = currentAge - Math.round((new Date() - d) / (365.25 * 24 * 3600 * 1000));
    yearLabels.push(`גיל ${Math.round(age)}`);
    historicalByYear.push(calcRecord(r).totalAssets);
  });

  // Projection by year
  for (let y = 0; y <= yearsLeft; y++) {
    const monthIdx = y * 12;
    const ageLabel = `גיל ${currentAge + y}`;
    if (!yearLabels.includes(ageLabel)) yearLabels.push(ageLabel);
    projByYear.push({ x: ageLabel, y: projectionMonthly[Math.min(monthIdx, projectionMonthly.length - 1)] });
  }

  // Compound interest final (for display)
  const compoundFinal = startAssets * Math.pow(1 + annualReturn/100, yearsLeft)
    + (monthlySave > 0 ? monthlySave * ((Math.pow(1 + monthlyRate, monthsLeft) - 1) / monthlyRate) : 0);

  renderRetirementSummary(projectedAmount, yearsLeft, monthlySave, annualReturn, startAssets);
  renderRetirementChart(records, projByYear, currentAge, retireAge, annualReturn);
  renderRetirementBreakdown(startAssets, projectedAmount, yearsLeft, monthlySave, annualReturn);
}

function renderRetirementSummary(projected, yearsLeft, monthlySave, annualReturn, start) {
  const growth = projected - start;
  const mult   = start > 0 ? (projected / start).toFixed(1) : '—';

  document.getElementById('ret-summary').innerHTML = `
    <div class="ret-tiles">
      <div class="ret-tile accent">
        <div class="rt-label">🎯 צבירה צפויה בפרישה</div>
        <div class="rt-value blur-text">${fmt(projected)}</div>
        <div class="rt-sub">פי ${mult} מהיום</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">⏳ שנים עד פרישה</div>
        <div class="rt-value">${yearsLeft}</div>
        <div class="rt-sub">${yearsLeft * 12} חודשים</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">📈 צמיחה כוללת צפויה</div>
        <div class="rt-value blur-text">${fmt(growth)}</div>
        <div class="rt-sub">בריבית ${annualReturn}% שנתי</div>
      </div>
      <div class="ret-tile">
        <div class="rt-label">💸 חיסכון חודשי</div>
        <div class="rt-value blur-text">${fmt(monthlySave)}</div>
        <div class="rt-sub">${fmt(monthlySave * yearsLeft * 12)} סה"כ</div>
      </div>
    </div>`;
  applyBlur();
}

function renderRetirementChart(historicalRecords, projByYear, currentAge, retireAge, annualReturn) {
  const canvas = document.getElementById('ret-chart'); if (!canvas) return;
  if (retChart) { retChart.destroy(); retChart = null; }

  // Historical points
  const histPoints = historicalRecords.map(r => {
    const d   = new Date(r.record_date);
    const age = currentAge - Math.round((new Date() - d) / (365.25 * 24 * 3600 * 1000));
    return { x: `גיל ${Math.round(age)}`, y: calcRecord(r).totalAssets };
  });

  // All unique x labels in order
  const allLabels = [];
  const seen = new Set();
  [...histPoints, ...projByYear].forEach(p => {
    if (!seen.has(p.x)) { seen.add(p.x); allLabels.push(p.x); }
  });
  // Sort by age number
  allLabels.sort((a,b) => parseInt(a.replace('גיל ','')) - parseInt(b.replace('גיל ','')));

  const opts = chartOptions();
  opts.plugins.tooltip.callbacks.label = ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw.y || ctx.raw)}`;
  opts.scales.x = {
    type: 'category',
    grid: { display:false },
    border: { color:'#e5e9f0' },
    ticks: { font:{ family:"'Outfit','Heebo',sans-serif", size:10 }, color:'#9ca3af' }
  };

  retChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: allLabels,
      datasets: [
        {
          label: 'נכסים בפועל',
          data: histPoints,
          borderColor: '#0e9e7e',
          backgroundColor: 'rgba(14,158,126,.08)',
          fill: true, tension: .4,
          pointRadius: 5, pointBackgroundColor: '#0e9e7e',
          pointBorderColor: '#fff', pointBorderWidth: 2,
        },
        {
          label: `תחזית (${annualReturn}% שנתי)`,
          data: projByYear,
          borderColor: '#4f8ef7',
          backgroundColor: 'rgba(79,142,247,.06)',
          fill: true, tension: .4,
          borderDash: [6, 4],
          pointRadius: 4, pointBackgroundColor: '#4f8ef7',
          pointBorderColor: '#fff', pointBorderWidth: 2,
        }
      ]
    },
    options: opts
  });
}

function renderRetirementBreakdown(start, projected, years, monthly, annualReturn) {
  const contributions = monthly * years * 12;
  const organicGrowth  = projected - start - contributions;

  const bars = [
    { label:'נכסים נוכחיים', value:start, color:'#0e9e7e', pct: (start/projected*100).toFixed(1) },
    { label:'חיסכון עתידי',  value:contributions, color:'#4f8ef7', pct:(contributions/projected*100).toFixed(1) },
    { label:'תשואה על השקעה', value:Math.max(0,organicGrowth), color:'#f59e0b', pct:(Math.max(0,organicGrowth)/projected*100).toFixed(1) },
  ].filter(b => b.value > 0);

  document.getElementById('ret-breakdown').innerHTML = `
    <div class="rbd-header">
      <span class="gc-title">🔍 פירוק צבירה</span>
    </div>
    ${bars.map(b => `
    <div class="rbd-row">
      <div class="rbd-info">
        <span class="rbd-dot" style="background:${b.color}"></span>
        <span class="rbd-label">${b.label}</span>
      </div>
      <div class="rbd-right">
        <div class="rbd-bar-wrap">
          <div class="rbd-bar" style="width:${b.pct}%;background:${b.color}"></div>
        </div>
        <span class="rbd-val blur-text">${fmt(b.value)}</span>
        <span class="rbd-pct">${b.pct}%</span>
      </div>
    </div>`).join('')}`;
  applyBlur();
}

/* ── CHART OPTIONS (shared) ─────────────────────────── */
function chartOptions() {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position:'bottom', labels:{
        font:{ family:"'Outfit','Heebo',sans-serif", size:11 },
        color:'#6b7280', padding:16, boxWidth:12, usePointStyle:true
      }},
      tooltip: {
        rtl:true, backgroundColor:'#111827', titleColor:'#f9fafb', bodyColor:'#9ca3af',
        borderColor:'#374151', borderWidth:1, padding:12,
        titleFont:{ family:"'Outfit',sans-serif", weight:'700' },
        bodyFont:{ family:"'JetBrains Mono',monospace", size:12 },
        callbacks:{ label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` }
      }
    },
    scales: {
      y: {
        grid:{ color:'rgba(0,0,0,.05)' }, border:{ color:'#e5e9f0' },
        ticks:{ font:{ family:"'JetBrains Mono',monospace", size:10 }, color:'#9ca3af',
          callback: v => Math.abs(v)>=1e6?(v/1e6).toFixed(1)+'M₪':Math.abs(v)>=1000?(v/1000).toFixed(0)+'K₪':v+'₪'
        }
      },
      x: {
        grid:{ display:false }, border:{ color:'#e5e9f0' },
        ticks:{ font:{ family:"'Outfit','Heebo',sans-serif", size:10 }, color:'#9ca3af' }
      }
    }
  };
}

/* ══════════════════════════════════════════════════════
   PDF / PRINT EXPORT
══════════════════════════════════════════════════════ */
function exportPDF() {
  if (!records.length) { showToast('⚠️ אין נתונים להדפסה'); return; }

  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const dateLabel = new Date(latest.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});

  let growthRows = '';
  if (records.length >= 2) {
    const prev  = calcRecord(records[records.length - 2]);
    const delta = calc.totalAssets - prev.totalAssets;
    const pct   = prev.totalAssets ? (delta/prev.totalAssets*100).toFixed(2) : '0.00';
    const avg   = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length - 1);
    growthRows = `
      <tr><td>צמיחה מחודש קודם</td><td style="color:${delta>=0?'#0e9e7e':'#ef4444'};font-weight:700">${(delta>=0?'+':'')}${fmt(delta)} (${delta>=0?'+':''}${pct}%)</td></tr>
      <tr><td>צמיחה ממוצעת לחודש</td><td>${fmt(avg)}</td></tr>`;
  }

  const mortgageRows = calc.mortgage > 0 ? `
    <tr><td>יתרת משכנתא</td><td style="color:#ef4444;font-weight:700">${fmt(calc.mortgage)}</td></tr>
    <tr class="total"><td>💎 שווי נקי</td><td>${fmt(calc.netWorth)}</td></tr>` : '';

  const historyRows = [...records].reverse().slice(0, 12).map(r => {
    const c = calcRecord(r);
    const d = new Date(r.record_date).toLocaleDateString('he-IL',{year:'numeric',month:'long'});
    return `<tr><td>${d}</td><td>${fmt(c.totalAssets)}</td>
      <td style="color:${c.mortgage>0?'#ef4444':'#9ca3af'}">${c.mortgage>0?fmt(c.mortgage):'—'}</td>
      <td style="color:#0e9e7e">${fmt(c.netWorth)}</td></tr>`;
  }).join('');

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8"/>
<title>דוח פיננסי – ${dateLabel}</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Heebo',sans-serif; color:#111827; background:#fff; padding:40px; direction:rtl; }
  .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:16px; border-bottom:3px solid #0e9e7e; }
  .header h1 { font-size:1.6rem; font-weight:800; color:#111827; }
  .header .date { font-size:.9rem; color:#6b7280; font-weight:500; }
  .logo { width:44px; height:44px; background:linear-gradient(135deg,#0e9e7e,#13b891); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:800; color:#fff; }
  .hero-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:28px; }
  .hero-box { padding:18px 16px; border-radius:12px; border:1.5px solid #e5e9f0; }
  .hero-box.main { background:#f0fdf9; border-color:#a7f3d0; }
  .hero-box .label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#6b7280; margin-bottom:6px; }
  .hero-box .val { font-size:1.4rem; font-weight:800; color:#111827; }
  .hero-box.main .val { color:#0e9e7e; }
  h2 { font-size:.85rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#9ca3af; margin:24px 0 10px; }
  table { width:100%; border-collapse:collapse; font-size:.875rem; }
  th { text-align:right; padding:10px 14px; background:#f9fafb; font-weight:600; color:#374151; border-bottom:1px solid #e5e9f0; font-size:.78rem; text-transform:uppercase; letter-spacing:.05em; }
  td { padding:11px 14px; border-bottom:1px solid #f3f4f6; color:#374151; }
  tr.total td { font-weight:700; background:#f0fdf9; color:#0e9e7e; }
  tr:last-child td { border:none; }
  .footer { margin-top:36px; padding-top:14px; border-top:1px solid #e5e9f0; text-align:center; font-size:.78rem; color:#9ca3af; }
  @media print { body { padding:20px; } }
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center;gap:12px">
    <div class="logo">₪</div>
    <div><h1>דוח פיננסי</h1><div class="date">הופק ב-${new Date().toLocaleDateString('he-IL')}</div></div>
  </div>
  <div class="date" style="text-align:left">דוח אחרון: ${dateLabel}</div>
</div>

<div class="hero-row">
  <div class="hero-box main"><div class="label">📈 סה"כ נכסים</div><div class="val">${fmt(calc.totalAssets)}</div></div>
  ${calc.mortgage > 0 ? `<div class="hero-box"><div class="label">🏠 יתרת משכנתא</div><div class="val" style="color:#ef4444">${fmt(calc.mortgage)}</div></div>
  <div class="hero-box"><div class="label">💎 שווי נקי</div><div class="val" style="color:#f59e0b">${fmt(calc.netWorth)}</div></div>`
  : `<div class="hero-box"><div class="label">💧 נכסים נזילים</div><div class="val">${fmt(calcRecord(latest)['cash']||0)}</div></div>
     <div class="hero-box"><div class="label">📅 תאריך</div><div class="val" style="font-size:1rem">${dateLabel}</div></div>`}
</div>

<h2>פירוט נכסים</h2>
<table>
<thead><tr><th>קטגוריה</th><th>סכום</th></tr></thead>
<tbody>
  ${categories.map(cat => `<tr><td>${cat.icon} ${cat.label}</td><td>${fmt(calc[cat.key]||0)}</td></tr>`).join('')}
  <tr class="total"><td>📈 סה"כ נכסים</td><td>${fmt(calc.totalAssets)}</td></tr>
  ${mortgageRows}
</tbody>
</table>

${growthRows ? `<h2>נתוני צמיחה</h2>
<table><tbody>${growthRows}</tbody></table>` : ''}

<h2>היסטוריה (12 חודשים אחרונים)</h2>
<table>
<thead><tr><th>חודש</th><th>סה"כ נכסים</th><th>משכנתא</th><th>שווי נקי</th></tr></thead>
<tbody>${historyRows}</tbody>
</table>

<div class="footer">מעקב פיננסי • הדוח נוצר אוטומטית • ${new Date().toLocaleDateString('he-IL')}</div>
<script>window.onload=()=>{window.print();}<\/script>
</body></html>`);
  win.document.close();
}

/* ── SETTINGS ───────────────────────────────────────── */
function showSettings() { renderCategoriesList(); document.getElementById('settings-modal').style.display='flex'; }
function closeSettings() { document.getElementById('settings-modal').style.display='none'; }
function closeSettingsOutside(e) { if (e.target.id==='settings-modal') closeSettings(); }

function renderCategoriesList() {
  document.getElementById('categories-list').innerHTML = categories.map(cat => `
    <div class="cat-item">
      <span>${cat.icon} ${cat.label} <span style="color:var(--ink-4);font-size:.75rem">(${cat.key})</span></span>
      <button class="cat-delete" onclick="deleteCategory('${cat.id}')">✕</button>
    </div>`).join('');
}

/* ── TAB SWITCH ─────────────────────────────────────── */
function switchTab(name, btn) {
  ['current','history','retirement'].forEach(t => {
    const p = document.getElementById(`tab-${t}`); if (p) p.style.display = t===name?'block':'none';
  });
  document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${name}"]`).forEach(b => b.classList.add('active'));
  const titles = { current:'דוח נוכחי', history:'היסטוריה', retirement:'תכנון פרישה' };
  const te = document.getElementById('topbar-title'); if (te) te.textContent = titles[name]||'';
  if (name==='history')    renderHistoryTab();
  if (name==='retirement') renderRetirement();
}

function toggleAddForm() {
  const f = document.getElementById('add-form');
  if (!f.style.display || f.style.display==='none') openAddForm(null);
  else { f.style.display='none'; editMode=false; }
}

/* ── BLUR ───────────────────────────────────────────── */
function toggleBlur() {
  blurActive = !blurActive;
  const icon = blurActive ? '🔒' : '🔓';
  ['blur-btn','blur-icon-mobile'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=icon; });
  applyBlur();
}

function applyBlur() {
  document.querySelectorAll('.blur-text').forEach(el => {
    el.style.filter     = blurActive ? 'blur(6px)' : 'none';
    el.style.userSelect = blurActive ? 'none' : 'auto';
  });
}

/* ── UTILITIES ──────────────────────────────────────── */
const fmt = v => (v||0).toLocaleString('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0});

function showScreen(n) {
  document.getElementById('auth-screen').style.display = n==='auth'?'flex':'none';
  document.getElementById('app-screen').style.display  = n==='app' ?'flex':'none';
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

document.addEventListener('DOMContentLoaded', init);
