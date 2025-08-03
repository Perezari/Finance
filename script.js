let currentView = 'current';
let historyData = [];

function showCurrentReport() {
  currentView = 'current';
  document.getElementById('current-view').style.display = 'block';
  document.getElementById('history-view').style.display = 'none';
  document.getElementById('chart-view').style.display = 'none';
  document.querySelectorAll('.nav-button')[0].classList.add('active');
  document.querySelectorAll('.nav-button')[1].classList.remove('active');
    setActiveNavButton(0);
}

function showHistory() {
  currentView = 'history';
  document.getElementById('current-view').style.display = 'none';
  document.getElementById('history-view').style.display = 'block';
  document.getElementById('chart-view').style.display = 'none'; // <-- שורה שנוספה
  document.querySelectorAll('.nav-button')[0].classList.remove('active');
  document.querySelectorAll('.nav-button')[1].classList.add('active');
  setActiveNavButton(1);

  if (historyData.length === 0) {
    loadHistoryData();
  }
}

function showChart() {
  currentView = 'chart';
  document.getElementById('current-view').style.display = 'none';
  document.getElementById('history-view').style.display = 'none';
  document.getElementById('chart-view').style.display = 'block';

  document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.nav-button')[2].classList.add('active');
  setActiveNavButton(2);

  if (historyData.length > 0) {
    renderChart();
  } else {
    loadHistoryData();
  }
}

function renderChart() {
  // מקצר תאריכים לפורמט "חודש/שנה" בעברית
  const labels = historyData.map(item =>
    new Date(item.date).toLocaleDateString('he-IL', { month: 'short', year: '2-digit' })
  ).reverse();

  const growth = historyData.map(item => item.growth).reverse();

  const trace = {
    x: labels,
    y: growth,
    type: 'bar',
    marker: {
      color: '#16a085'
    }
  };

  const layout = {
    title: 'צמיחה חודשית',
    xaxis: {
      tickangle: -45,
      automargin: true,
      tickfont: { 
        size: 10,
        family: 'Heebo, sans-serif'
      }
    },
    yaxis: {
      tickformat: ',.0f'
    },
    margin: { t: 50, l: 40, r: 20, b: 80 },
    paper_bgcolor: 'rgba(0,0,0,0)',   // רקע שקוף
    plot_bgcolor: 'rgba(0,0,0,0)',    // רקע שקוף
    font: {
      family: 'Heebo, sans-serif'
    }
  };

  const config = {
    responsive: true,
    displaylogo: false
  };

  Plotly.newPlot('plotlyChart', [trace], layout, config);
}

function downloadChart() {
  const link = document.createElement('a');
  link.href = document.getElementById('growthChart').toDataURL('image/png');
  link.download = 'growth_chart.png';
  link.click();
}

async function downloadChartAsPDF() {
  const canvas = document.getElementById('growthChart');

  // צור קנבס זמני ברזולוציה גבוהה
  const tmpCanvas = document.createElement('canvas');
  const scale = 3; // x3 רזולוציה
  tmpCanvas.width = canvas.width * scale;
  tmpCanvas.height = canvas.height * scale;

  const tmpCtx = tmpCanvas.getContext('2d');
  tmpCtx.scale(scale, scale);
  tmpCtx.drawImage(canvas, 0, 0);

  const imageData = tmpCanvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 20;
  const imgHeight = tmpCanvas.height * imgWidth / tmpCanvas.width;

  pdf.text("📈 גרף צמיחה פיננסית", pageWidth / 2, 20, { align: "center" });
  pdf.addImage(imageData, 'PNG', 10, 30, imgWidth, imgHeight);
  pdf.save('growth_chart.pdf');
}

function renderCard(data, containerId = 'container') {
  const template = document.getElementById('card-template');
  const clone = template.content.cloneNode(true);

  // הצגת שדה תאריך שיא או תאריך רגיל
  clone.querySelector('[data-field="peakGrowthDate"]').textContent = data.peakGrowthDate || data.date;

  // מילוי ערכים מספריים
  const fields = ["cash", "currentAcc", "deposit", "savingsFund", "pensionFund", "totalAssets", "growth"];
  fields.forEach(field => {
    const el = clone.querySelector(`[data-field="${field}"]`);
    if (el) el.textContent = formatCurrency(data[field]);
  });

  // אחוז צמיחה עם צבע
  const growthPercent = typeof data.growthPercentRaw === 'number'
    ? (data.growthPercentRaw * 100).toFixed(2) + '%'
    : data.growthPercentRaw;
  const growthColor = data.growthPercentRaw > 0 ? '#27ae60' :
                      data.growthPercentRaw < 0 ? '#e74c3c' : '#000';
  const percentEl = clone.querySelector('[data-field="growthPercent"]');
  percentEl.textContent = growthPercent;
  percentEl.style.color = growthColor;

  // צמיחה ממוצעת – אם יש
  if (data.avgGrowth !== undefined) {
    const avgEl = clone.querySelector('.avg-growth');
    avgEl.style.display = '';
    avgEl.querySelector('[data-field="avgGrowth"]').textContent = formatCurrency(data.avgGrowth);
  }

  // הערות – אם יש
  if (data.notes) {
    const notesEl = clone.querySelector('.notes');
    notesEl.style.display = '';
    notesEl.classList.toggle('negative', !data.notes.includes('✔️'));
    notesEl.querySelector('[data-field="notes"]').textContent = data.notes;
  }

  // הכנסת התוצאה לדף
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.appendChild(clone);
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
	document.getElementById('loader').style.display = 'none';
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
	if (currentView === 'chart') {
  renderChart();
}
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

let blurActive = true;

function toggleBlur() {
  blurActive = !blurActive;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (blurActive) {
      card.classList.add('blur-data');
      document.getElementById('blur-toggle').innerText = '🔓';
    } else {
      card.classList.remove('blur-data');
      document.getElementById('blur-toggle').innerText = '🔒';
    }
  });
}

function setActiveNavButton(index) {
  const buttons = document.querySelectorAll('.bottom-nav-button');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}