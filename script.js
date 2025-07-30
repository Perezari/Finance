let currentView = 'current';
let historyData = [];

function showCurrentReport() {
  currentView = 'current';
  document.getElementById('current-view').style.display = 'block';
  document.getElementById('history-view').style.display = 'none';
  document.querySelectorAll('.nav-button')[0].classList.add('active');
  document.querySelectorAll('.nav-button')[1].classList.remove('active');
}

function showHistory() {
  currentView = 'history';
  document.getElementById('current-view').style.display = 'none';
  document.getElementById('history-view').style.display = 'block';
  document.querySelectorAll('.nav-button')[0].classList.remove('active');
  document.querySelectorAll('.nav-button')[1].classList.add('active');

  if (historyData.length === 0) {
    loadHistoryData();
  }
}

function renderCard(data, containerId = 'container') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const growthPercentFormatted = typeof data.growthPercentRaw === 'number'
    ? (data.growthPercentRaw * 100).toFixed(2) + '%'
    : data.growthPercentRaw;

  let growthColor = '#000';
  if (typeof data.growthPercentRaw === 'number') {
    if (data.growthPercentRaw > 0) growthColor = '#27ae60';
    else if (data.growthPercentRaw < 0) growthColor = '#e74c3c';
  }

  const notesClass = data.notesStatus === 'positive' ? '' : 'negative';

  const innerHTML = `
    <div class="date">📅 תאריך שיא: ${data.peakGrowthDate || data.date}</div>
    <div class="item"><strong>💰 מזומן:</strong> ${formatCurrency(data.cash)}</div>
    <div class="item"><strong>🏦 עו"ש:</strong> ${formatCurrency(data.currentAcc)}</div>
    <div class="item"><strong>🏛️ פקדון (4%):</strong> ${formatCurrency(data.deposit)}</div>
    <div class="item"><strong>🎓 קרן השתלמות:</strong> ${formatCurrency(data.savingsFund)}</div>
    <div class="item"><strong>🛡️ קרן פנסיה:</strong> ${formatCurrency(data.pensionFund)}</div>
    <div class="item"><strong>📈 סה"כ נכסים:</strong> ${formatCurrency(data.totalAssets)}</div>
    <div class="item"><strong>📈 צמיחה:</strong> ${formatCurrency(data.growth)}</div>
    <div class="item"><strong>📈 אחוז צמיחה:</strong> <span style="color:${growthColor}; font-weight: bold;">${growthPercentFormatted}</span></div>
    ${data.avgGrowth !== undefined ? `<div class="item"><strong>📈 צמיחה ממוצעת:</strong> ${formatCurrency(data.avgGrowth)}</div>` : ''}
    ${data.notes ? `<div class="item notes ${notesClass}">${data.notes}</div>` : ''}
  `;

  container.innerHTML = `<div class="card">${innerHTML}</div>`;
}

function formatCurrency(value) {
  return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
}

function parseGoogleSheetsData(response) {
  try {
    const row = response.table.rows[0].c;
    const data = {
      cash: row[0]?.v || 0,
      currentAcc: row[1]?.v || 0,
      deposit: row[2]?.v || 0,
      savingsFund: row[3]?.v || 0,
      pensionFund: row[4]?.v || 0,
      totalAssets: row[5]?.v || 0,
      growth: row[6]?.v || 0,
      growthPercentRaw: row[7]?.v || 0,
      peakGrowthDate: row[8]?.f || '',
      avgGrowth: row[9]?.v || 0,
      notes: row[10]?.v || '',
      notesStatus: (row[10]?.v || '').includes('✔️') ? 'positive' : 'negative'
    };
    renderCard(data, 'container');
  } catch (err) {
    document.getElementById('container').innerHTML = '<p class="error">שגיאה בטעינת נתוני הדוח הנוכחי.</p>';
  }
}

function parseHistoryData(response) {
  try {
    const rows = response.table.rows;
    historyData = rows.map(row => {
      const c = row.c;
      return {
        date: c[0]?.f || c[0]?.v || '',
        cash: c[1]?.v || 0,
        currentAcc: c[2]?.v || 0,
        deposit: c[3]?.v || 0,
        savingsFund: c[4]?.v || 0,
        pensionFund: c[5]?.v || 0,
        totalAssets: c[6]?.v || 0,
        growth: c[7]?.v || 0,
        growthPercentRaw: c[8]?.v || 0
      };
    });
    populateDateSelect();
  } catch (err) {
    document.getElementById('history-view').innerHTML = '<p class="error">שגיאה בטעינת היסטוריית הדוחות.</p>';
  }
}

function populateDateSelect() {
  const select = document.getElementById('dateSelect');
  select.innerHTML = '<option value="" disabled selected>בחר תאריך</option>';
  historyData.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = item.date;
    select.appendChild(option);
  });
}

function onDateChange() {
  const select = document.getElementById('dateSelect');
  const idx = select.value;
  if (idx !== '') {
    const data = historyData[idx];
    if (data) {
      document.getElementById('history-card').style.display = 'block';
      renderCard(data, 'history-card');
    }
  }
}

function loadHistoryData() {
  const script = document.createElement('script');
  script.src = CONFIG.historyReportUrl;
  script.onerror = () => {
    document.getElementById('history-view').innerHTML = '<p class="error">שגיאה בטעינת היסטוריית הדוחות.</p>';
  };
  document.body.appendChild(script);

  window.google = { visualization: { Query: { setResponse: parseHistoryData } } };
}

// טעינת הדוח הנוכחי ברגע שנטען הדף
const currentReportScript = document.createElement('script');
currentReportScript.src = CONFIG.currentReportUrl;
currentReportScript.onerror = () => {
  document.getElementById('container').innerHTML = '<p class="error">שגיאה בטעינת הדוח הנוכחי.</p>';
};
document.body.appendChild(currentReportScript);

window.google = { visualization: { Query: { setResponse: parseGoogleSheetsData } } };