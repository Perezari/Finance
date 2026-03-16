/* ============================================================
   SUPABASE CLIENT
   ============================================================ */
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================================
   STATE
   ============================================================ */
let currentUser  = null;
let categories   = [];
let records      = [];
let blurActive   = false;
let mainChart    = null;

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  showLoader('מאמת...');
  try {
    const { data: { session } } = await db.auth.getSession();
    if (session?.user) {
      currentUser = session.user;
      await loadApp();
    } else {
      showScreen('auth');
    }
  } catch (e) {
    console.error(e);
    showScreen('auth');
  }

  db.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await loadApp();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      records = []; categories = [];
      showScreen('auth');
    }
  });

  hideLoader();
}

async function loadApp() {
  showLoader('טוען נתונים...');
  await Promise.all([loadCategories(), loadRecords()]);
  renderCurrentReport();
  showScreen('app');

  const emailEl = document.getElementById('user-email-display');
  if (emailEl && currentUser) emailEl.textContent = currentUser.email;

  hideLoader();
}

/* ============================================================
   AUTH
   ============================================================ */
async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showAuthMsg('יש למלא אימייל וסיסמה', false);

  showLoader('מכנס...');
  const { error } = await db.auth.signInWithPassword({ email, password });
  hideLoader();
  if (error) return showAuthMsg(translateError(error.message), false);
}

async function handleRegister() {
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!email || !password) return showAuthMsg('יש למלא אימייל וסיסמה', false);
  if (password.length < 6)  return showAuthMsg('הסיסמה חייבת לכלול לפחות 6 תווים', false);

  showLoader('יוצר חשבון...');
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  });
  hideLoader();

  if (error) return showAuthMsg(translateError(error.message), false);

  // Create default categories for the new user
  if (data?.user) await createDefaultCategories(data.user.id);

  showAuthMsg('✅ נשלח אימייל אישור! בדוק את תיבת הדואר שלך.', true);
}

async function handleMagicLink() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) return showAuthMsg('הכנס כתובת אימייל קודם', false);

  showLoader('שולח...');
  const { error } = await db.auth.signInWithOtp({ email });
  hideLoader();

  if (error) return showAuthMsg(translateError(error.message), false);
  showAuthMsg('✅ קישור כניסה נשלח לאימייל שלך!', true);
}

async function handleLogout() {
  closeSettings();
  await db.auth.signOut();
}

function translateError(msg) {
  const map = {
    'Invalid login credentials': 'אימייל או סיסמה שגויים',
    'Email not confirmed':       'יש לאשר את כתובת האימייל קודם',
    'User already registered':   'המשתמש כבר רשום. נסה להיכנס.',
  };
  return map[msg] || msg;
}

function switchAuthTab(tab) {
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
  document.querySelectorAll('.auth-tab').forEach((btn, i) => {
    btn.classList.toggle('active',
      (i === 0 && tab === 'login') || (i === 1 && tab === 'register')
    );
  });
  hideAuthMsg();
}

/* ============================================================
   CATEGORIES
   ============================================================ */
const DEFAULT_CATEGORIES = [
  { key: 'cash',        label: 'מזומן',           icon: '💵', order_index: 0 },
  { key: 'currentAcc',  label: 'עו"ש',            icon: '🏦', order_index: 1 },
  { key: 'deposit',     label: 'פיקדון / חסכון',  icon: '🏛️', order_index: 2 },
  { key: 'savingsFund', label: 'קרן השתלמות',     icon: '📈', order_index: 3 },
  { key: 'pensionFund', label: 'פנסיה',           icon: '🧓', order_index: 4 },
];

async function createDefaultCategories(userId) {
  const cats = DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: userId }));
  const { error } = await db.from('categories').insert(cats);
  if (error) console.error('createDefaultCategories:', error);
}

async function loadCategories() {
  const { data, error } = await db
    .from('categories').select('*').order('order_index');
  if (error) { console.error(error); return; }
  categories = data || [];

  if (categories.length === 0) {
    await createDefaultCategories(currentUser.id);
    const { data: fresh } = await db
      .from('categories').select('*').order('order_index');
    categories = fresh || [];
  }
}

async function addCategory() {
  const key   = document.getElementById('new-cat-key').value.trim();
  const label = document.getElementById('new-cat-label').value.trim();
  const icon  = document.getElementById('new-cat-icon').value.trim() || '💰';

  if (!key || !label)                       return alert('נא למלא מזהה ושם');
  if (!/^[a-zA-Z0-9_]+$/.test(key))        return alert('המזהה חייב להיות באנגלית, ללא רווחים');
  if (categories.find(c => c.key === key))  return alert('מזהה זה כבר קיים');

  showLoader('מוסיף...');
  const { error } = await db.from('categories').insert({
    user_id: currentUser.id, key, label, icon,
    order_index: categories.length
  });
  hideLoader();

  if (error) { alert('שגיאה: ' + error.message); return; }

  await loadCategories();
  renderCategoriesList();
  renderDynamicFields();
  showToast('✅ קטגוריה נוספה');

  document.getElementById('new-cat-key').value   = '';
  document.getElementById('new-cat-label').value = '';
  document.getElementById('new-cat-icon').value  = '';
}

async function deleteCategory(id) {
  if (!confirm('למחוק קטגוריה זו?')) return;
  showLoader('מוחק...');
  await db.from('categories').delete().eq('id', id).eq('user_id', currentUser.id);
  await loadCategories();
  hideLoader();
  renderCategoriesList();
  renderDynamicFields();
  showToast('🗑️ קטגוריה נמחקה');
}

/* ============================================================
   RECORDS
   ============================================================ */
async function loadRecords() {
  const { data, error } = await db
    .from('monthly_records').select('*')
    .order('record_date', { ascending: true });
  if (error) { console.error(error); return; }
  records = data || [];
}

async function submitNewRecord() {
  const date = document.getElementById('new-date').value;
  if (!date) return alert('יש לבחור תאריך');

  const values = {};
  categories.forEach(cat => {
    const el = document.getElementById(`field_${cat.key}`);
    values[cat.key] = parseFloat(el?.value || '0') || 0;
  });

  const mortgage = parseFloat(document.getElementById('new-mortgage').value || '0') || 0;
  const notes    = document.getElementById('new-notes').value.trim();

  showLoader('שומר...');
  const { error } = await db.from('monthly_records').upsert({
    user_id: currentUser.id,
    record_date: date,
    values,
    mortgage_balance: mortgage,
    notes
  }, { onConflict: 'user_id,record_date' });
  hideLoader();

  if (error) { alert('שגיאה: ' + error.message); return; }

  await loadRecords();
  renderCurrentReport();
  renderHistoryTab();

  // Reset form
  document.getElementById('new-date').value     = '';
  document.getElementById('new-mortgage').value = '';
  document.getElementById('new-notes').value    = '';
  categories.forEach(cat => {
    const el = document.getElementById(`field_${cat.key}`);
    if (el) el.value = '';
  });
  document.getElementById('add-form').style.display = 'none';

  showToast('✅ נשמר בהצלחה!');
}

async function deleteRecord(id) {
  if (!confirm('למחוק את החודש הזה? פעולה זו לא ניתנת לביטול.')) return;
  showLoader('מוחק...');
  const { error } = await db.from('monthly_records')
    .delete().eq('id', id).eq('user_id', currentUser.id);
  hideLoader();

  if (error) { alert('שגיאה: ' + error.message); return; }

  await loadRecords();
  renderCurrentReport();
  renderHistoryTab();
  document.getElementById('history-detail').style.display = 'none';
  document.getElementById('dateSelect').value = '';
  showToast('🗑️ נמחק בהצלחה');
}

/* ============================================================
   CALCULATIONS
   ============================================================ */
function calcRecord(record) {
  const vals = record.values || {};
  const totalAssets = categories.reduce((sum, cat) => sum + (vals[cat.key] || 0), 0);
  const mortgage    = record.mortgage_balance || 0;
  const netWorth    = totalAssets - mortgage;
  return { totalAssets, mortgage, netWorth, ...vals };
}

/* ============================================================
   RENDER CURRENT REPORT
   ============================================================ */
function renderCurrentReport() {
  const container = document.getElementById('current-card');
  if (!records.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <p style="font-weight:700;font-size:1rem;margin-bottom:6px;">אין נתונים עדיין</p>
        <p style="font-size:0.85rem;color:var(--text-muted);">עבור ל"היסטוריה" והוסף את החודש הראשון שלך</p>
      </div>`;
    return;
  }

  const latest    = records[records.length - 1];
  const calc      = calcRecord(latest);
  const d         = new Date(latest.record_date);
  const dateLabel = d.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });

  // Growth
  let growthHtml = '';
  if (records.length >= 2) {
    const prev        = calcRecord(records[records.length - 2]);
    const growth      = calc.totalAssets - prev.totalAssets;
    const pct         = prev.totalAssets ? (growth / prev.totalAssets * 100).toFixed(2) : 0;
    const color       = growth >= 0 ? 'var(--success)' : 'var(--danger)';
    const sign        = growth >= 0 ? '+' : '';
    const avgGrowth   = (calc.totalAssets - calcRecord(records[0]).totalAssets) / (records.length - 1);

    growthHtml = `
      <div class="report-divider"></div>
      <div class="report-item">
        <span class="item-label">📊 צמיחה מחודש קודם</span>
        <span class="item-value blur-text" style="color:${color}">${sign}${formatCurrency(growth)} (${sign}${pct}%)</span>
      </div>
      <div class="report-item">
        <span class="item-label">📈 צמיחה ממוצעת</span>
        <span class="item-value blur-text">${formatCurrency(avgGrowth)}</span>
      </div>`;
  }

  // Liquid assets
  const liquidKeys = ['cash', 'currentAcc', 'savingsFund'];
  const liquid     = categories
    .filter(c => liquidKeys.includes(c.key))
    .reduce((s, c) => s + (calc[c.key] || 0), 0);
  const liquidPct  = calc.totalAssets ? ((liquid / calc.totalAssets) * 100).toFixed(1) : '0';

  const mortgageHtml = calc.mortgage > 0 ? `
    <div class="report-item mortgage">
      <span class="item-label">🏠 יתרת משכנתא</span>
      <span class="item-value blur-text" style="color:var(--danger);">${formatCurrency(calc.mortgage)}</span>
    </div>` : '';

  const netWorthHtml = calc.mortgage > 0 ? `
    <div class="report-total net-worth">
      <span>💎 שווי נקי</span>
      <span class="blur-text">${formatCurrency(calc.netWorth)}</span>
    </div>` : '';

  const notesHtml = latest.notes ? `
    <div class="report-notes ${latest.notes.includes('✔️') ? 'positive' : 'negative'}">
      ${latest.notes}
    </div>` : '';

  container.innerHTML = `
    <div class="report-date">📅 דוח אחרון: ${dateLabel}</div>
    <div class="report-items">
      ${categories.map(cat => `
        <div class="report-item">
          <span class="item-label">${cat.icon} ${cat.label}</span>
          <span class="item-value blur-text">${formatCurrency(calc[cat.key] || 0)}</span>
        </div>`).join('')}
      <div class="report-item subtle">
        <span class="item-label">💧 נכסים נזילים</span>
        <span class="item-value blur-text">${formatCurrency(liquid)} (${liquidPct}%)</span>
      </div>
    </div>
    <div class="report-divider"></div>
    ${mortgageHtml}
    <div class="report-total">
      <span>📈 סה"כ נכסים</span>
      <span class="blur-text">${formatCurrency(calc.totalAssets)}</span>
    </div>
    ${netWorthHtml}
    ${growthHtml}
    ${notesHtml}`;

  applyBlur();
}

/* ============================================================
   RENDER HISTORY TAB
   ============================================================ */
function renderHistoryTab() {
  renderChart();
  populateDateSelect();
  renderDynamicFields();
}

function renderChart() {
  const canvas = document.getElementById('main-chart');
  if (!canvas) return;

  if (mainChart) { mainChart.destroy(); mainChart = null; }

  if (records.length === 0) {
    canvas.style.display = 'none';
    return;
  }
  canvas.style.display = 'block';

  const labels      = records.map(r => {
    const d = new Date(r.record_date);
    return d.toLocaleDateString('he-IL', { month: 'short', year: '2-digit' });
  });
  const totalAssets = records.map(r => calcRecord(r).totalAssets);
  const mortgages   = records.map(r => r.mortgage_balance || 0);
  const netWorths   = records.map(r => calcRecord(r).netWorth);
  const hasMortgage = mortgages.some(m => m > 0);

  const datasets = [{
    label: 'סה"כ נכסים',
    data: totalAssets,
    borderColor: '#16a085',
    backgroundColor: 'rgba(22,160,133,0.08)',
    fill: true, tension: 0.4, pointRadius: 4,
    pointBackgroundColor: '#16a085',
  }];

  if (hasMortgage) {
    datasets.push({
      label: 'יתרת משכנתא',
      data: mortgages,
      borderColor: '#e74c3c',
      backgroundColor: 'transparent',
      fill: false, tension: 0.4, pointRadius: 4,
      pointBackgroundColor: '#e74c3c',
    });
    datasets.push({
      label: 'שווי נקי',
      data: netWorths,
      borderColor: '#f39c12',
      backgroundColor: 'rgba(243,156,18,0.05)',
      fill: false, tension: 0.4, pointRadius: 4,
      borderDash: [5, 4],
      pointBackgroundColor: '#f39c12',
    });
  }

  mainChart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Heebo', sans-serif", size: 11 },
            color: '#6b7e90', padding: 12, boxWidth: 14
          }
        },
        tooltip: {
          rtl: true,
          titleFont:  { family: "'Heebo', sans-serif" },
          bodyFont:   { family: "'Heebo', sans-serif" },
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: {
            font: { family: "'Heebo', sans-serif", size: 10 },
            color: '#6b7e90',
            callback: v => {
              if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1) + 'M₪';
              if (Math.abs(v) >= 1000)    return (v / 1000).toFixed(0) + 'K₪';
              return v + '₪';
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { family: "'Heebo', sans-serif", size: 10 },
            color: '#6b7e90'
          }
        }
      }
    }
  });
}

function populateDateSelect() {
  const select = document.getElementById('dateSelect');
  select.innerHTML = '<option value="" disabled selected>בחר חודש לפירוט</option>';
  [...records].reverse().forEach(r => {
    const d    = new Date(r.record_date);
    const label = d.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });
    const opt  = document.createElement('option');
    opt.value   = r.id;
    opt.textContent = label;
    select.appendChild(opt);
  });
}

function onDateChange() {
  const id     = document.getElementById('dateSelect').value;
  const record = records.find(r => r.id === id);
  if (!record) return;
  renderDetailCard(record);
}

function renderDetailCard(record) {
  const calc     = calcRecord(record);
  const d        = new Date(record.record_date);
  const dateLabel = d.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });

  const mortgageHtml = calc.mortgage > 0 ? `
    <div class="report-item mortgage">
      <span class="item-label">🏠 יתרת משכנתא</span>
      <span class="item-value blur-text" style="color:var(--danger)">${formatCurrency(calc.mortgage)}</span>
    </div>
    <div class="report-total net-worth">
      <span>💎 שווי נקי</span>
      <span class="blur-text">${formatCurrency(calc.netWorth)}</span>
    </div>` : '';

  const notesHtml = record.notes ? `
    <div class="report-notes ${record.notes.includes('✔️') ? 'positive' : 'negative'}">
      ${record.notes}
    </div>` : '';

  const container = document.getElementById('history-detail');
  container.innerHTML = `
    <div class="detail-header">
      <span class="detail-date">📅 ${dateLabel}</span>
      <button class="delete-btn" onclick="deleteRecord('${record.id}')">🗑️ מחק</button>
    </div>
    <div class="report-items">
      ${categories.map(cat => `
        <div class="report-item">
          <span class="item-label">${cat.icon} ${cat.label}</span>
          <span class="item-value blur-text">${formatCurrency(calc[cat.key] || 0)}</span>
        </div>`).join('')}
    </div>
    <div class="report-divider"></div>
    <div class="report-total">
      <span>📈 סה"כ נכסים</span>
      <span class="blur-text">${formatCurrency(calc.totalAssets)}</span>
    </div>
    ${mortgageHtml}
    ${notesHtml}`;
  container.style.display = 'block';
  applyBlur();
}

function renderDynamicFields() {
  const container = document.getElementById('dynamic-fields');
  if (!container) return;
  container.innerHTML = categories.map(cat => `
    <div class="form-row">
      <label>${cat.icon} ${cat.label}</label>
      <input type="number" id="field_${cat.key}" placeholder="0" class="form-input"/>
    </div>`).join('');
}

/* ============================================================
   SETTINGS
   ============================================================ */
function showSettings() {
  renderCategoriesList();
  document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function closeSettingsOutside(e) {
  if (e.target === document.getElementById('settings-modal')) closeSettings();
}

function renderCategoriesList() {
  document.getElementById('categories-list').innerHTML = categories.map(cat => `
    <div class="cat-item">
      <span>${cat.icon} ${cat.label} <span style="color:var(--text-muted);font-size:0.8rem">(${cat.key})</span></span>
      <button class="cat-delete" onclick="deleteCategory('${cat.id}')">✕</button>
    </div>`).join('');
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
function switchTab(name, btn) {
  document.getElementById('tab-current').style.display = name === 'current' ? 'block' : 'none';
  document.getElementById('tab-history').style.display = name === 'history' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (name === 'history') renderHistoryTab();
}

function toggleAddForm() {
  const form = document.getElementById('add-form');
  const open = form.style.display === 'none' || !form.style.display;
  form.style.display = open ? 'block' : 'none';
  if (open) renderDynamicFields();
}

/* ============================================================
   BLUR TOGGLE
   ============================================================ */
function toggleBlur() {
  blurActive = !blurActive;
  document.getElementById('blur-btn').textContent = blurActive ? '🔒' : '🔓';
  applyBlur();
}

function applyBlur() {
  const val = blurActive ? 'blur(5px)' : 'none';
  document.querySelectorAll('.blur-text').forEach(el => {
    el.style.filter     = val;
    el.style.userSelect = blurActive ? 'none' : 'text';
  });
}

/* ============================================================
   UI UTILITIES
   ============================================================ */
function formatCurrency(value) {
  return (value || 0).toLocaleString('he-IL', {
    style: 'currency', currency: 'ILS', maximumFractionDigits: 0
  });
}

function showScreen(name) {
  document.getElementById('auth-screen').style.display = name === 'auth' ? 'flex' : 'none';
  document.getElementById('app-screen').style.display  = name === 'app'  ? 'flex' : 'none';
}

function showLoader(text = 'טוען...') {
  document.getElementById('loader-text').textContent = text;
  document.getElementById('loader').style.display    = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

function showAuthMsg(msg, success) {
  const el = document.getElementById('auth-message');
  el.textContent = msg;
  el.className = 'auth-message ' + (success ? 'success' : 'error');
  el.style.display = 'block';
}

function hideAuthMsg() {
  document.getElementById('auth-message').style.display = 'none';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================================
   START
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);
