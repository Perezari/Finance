let currentView = 'current';
let historyData = [];

function setActiveTab(selectedButton) {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  selectedButton.classList.add('active');
}

function showCurrentReport() {
  currentView = 'current';
  document.getElementById('current-view').style.display = 'block';
  document.getElementById('history-view').style.display = 'none';
  setActiveTab(document.querySelector('.tab-button:nth-child(1)'));
}

function showHistory() {
  currentView = 'history';
  document.getElementById('current-view').style.display = 'none';
  document.getElementById('history-view').style.display = 'block';
  setActiveTab(document.querySelector('.tab-button:nth-child(2)'));

  if (historyData.length === 0) {
    loadHistoryData();
  }
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
      const historyCard = document.getElementById('history-card');
      historyCard.style.display = 'block';
      historyCard.innerHTML = ''; // נקה תוכן קודם

      renderCard(data, 'history-card'); // צור כרטיס הדוח

      // כפתור מחיקה
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ מחק חודש';
      deleteBtn.className = 'delete-button';
      deleteBtn.style.marginTop = '12px';
      deleteBtn.onclick = () => deleteSelectedMonth(idx);
      historyCard.appendChild(deleteBtn);

      // כפתור סגירה משופר
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✖';
      closeBtn.className = 'close-button';
      closeBtn.onclick = () => {
        historyCard.style.display = 'none';
        select.value = ''; // איפוס הבחירה
      };

      // הוספה וסידור
      historyCard.style.position = 'relative';
      historyCard.appendChild(closeBtn);
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

function toggleForm() {
  const form = document.getElementById('new-entry-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function submitNewEntry() {
  // הצגת ה-loader
  document.getElementById('loader').style.display = 'flex';

  // השבתת כפתור השליחה למניעת לחיצות נוספות
  const sendBtn = document.querySelector("#new-entry-form button[onclick='submitNewEntry()']");
  sendBtn.disabled = true;
  sendBtn.textContent = "טוען...";

  // איסוף הערכים מהשדות
  const date = document.getElementById('newDate').value;
  const cash = document.getElementById('newCash').value;
  const currentAcc = document.getElementById('newCurrentAcc').value;
  const deposit = document.getElementById('newDeposit').value;
  const savingsFund = document.getElementById('newSavingsFund').value;
  const pensionFund = document.getElementById('newPensionFund').value;

  const sheetName = "מעקב חסכונות";

  const params = new URLSearchParams({
    date,
    cash,
    currentAcc,
    deposit,
    savingsFund,
    pensionFund,
    sheetName,
    callback: "handleResponse"
  });

  // יצירת תג script להצגת קריאה ל-GAS עם JSONP
  const script = document.createElement("script");
  script.src = "https://script.google.com/macros/s/AKfycbxUgXo-527OKTpQlq05TmgmF771MKh7T9IROe4Erl4LI-zDmUgZAzURnhanZcY3vVmm9g/exec?" + params.toString();

  // טיפול בשגיאה
  script.onerror = () => {
    alert("שגיאה בשליחת הבקשה.");
    // הסתרת ה-loader
    document.getElementById('loader').style.display = 'none';
    // אפשר שוב את הכפתור ושחזר את הטקסט
    sendBtn.disabled = false;
    sendBtn.textContent = "📤 שלח";
  };

  // הוספת התג ל-document, פעולה שמתחילה את הבקשה
  document.body.appendChild(script);
}

function showSuccessMessage(msg) {
  const messageDiv = document.getElementById('success-message');
  messageDiv.querySelector('p').textContent = msg;
  messageDiv.style.display = 'flex';
  
  // מחזירים אנימציה (מפעילים את הקלאס מחדש)
  messageDiv.style.animation = 'none';
  // טריגר רילואוד של אנימציה
  void messageDiv.offsetWidth;
  messageDiv.style.animation = null;

  // אחרי 3 שניות מוסתר אוטומטית
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

function handleResponse(response) {
  const loader = document.getElementById('loader');
  const loaderAnim = loader.querySelector('.loader-animation');
  const checkmark = loader.querySelector('.loader-checkmark');
  const crossmark = loader.querySelector('.loader-cross');
  const loaderText = document.getElementById('loader-text');
  const sendBtn = document.querySelector("#new-entry-form button[onclick='submitNewEntry()']");

  sendBtn.disabled = false;
  sendBtn.textContent = "📤 שלח";

  if (response.status === "success") {
    loaderAnim.style.display = 'none';
    checkmark.style.display = 'block';
    crossmark.style.display = 'none';
    loaderText.textContent = 'בוצע בהצלחה!';

    setTimeout(() => {
      loader.style.display = 'none';
      loaderAnim.style.display = 'block';
      checkmark.style.display = 'none';
      loaderText.textContent = 'טוען נתונים...';
    }, 1500);

    toggleForm();
    loadHistoryData();
  } else {
    loaderAnim.style.display = 'none';
    checkmark.style.display = 'none';
    crossmark.style.display = 'block';
    loaderText.textContent = 'אירעה שגיאה!';

    setTimeout(() => {
      loader.style.display = 'none';
      loaderAnim.style.display = 'block';
      crossmark.style.display = 'none';
      loaderText.textContent = 'טוען נתונים...';
    }, 1500);
  }
}

function deleteSelectedMonth(selectedIndex) {
  if (!selectedIndex || !historyData[selectedIndex]) {
    // לא מציגים כלום – פשוט לא עושים כלום
    return;
  }

  const confirmed = confirm('האם אתה בטוח שברצונך למחוק את החודש שנבחר? פעולה זו לא ניתנת לביטול.');
  if (!confirmed) return;

  const dateToDelete = historyData[selectedIndex].date;
  const sheetName = "מעקב חסכונות";

  // הצג loader
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  const params = new URLSearchParams({
    date: dateToDelete,
    sheetName,
    callback: 'handleDeleteResponse'
  });

  const script = document.createElement('script');
  script.src = 'https://script.google.com/macros/s/AKfycbxZmVixNQ5iNH9ChOCiWaio3CmO2bFUOV3_vusfgDuwPEbqlyrCEEpy9u0DDA9wZGJOdg/exec' + '?' + params.toString();

  script.onerror = () => {
    loader.style.display = 'none';
    console.error('אירעה שגיאה בשליחת בקשת המחיקה.');
    // אפשר גם להציג הודעה בתוך הכרטיס במקום alert
  };

  document.body.appendChild(script);
}

function handleDeleteResponse(response) {
  const loader = document.getElementById('loader');
  const loaderAnim = loader.querySelector('.loader-animation');
  const checkmark = loader.querySelector('.loader-checkmark');
  const crossmark = loader.querySelector('.loader-cross');
  const loaderText = document.getElementById('loader-text');

  if (response.status === 'success') {
    loaderAnim.style.display = 'none';
    checkmark.style.display = 'block';
    crossmark.style.display = 'none';
    loaderText.textContent = 'החודש נמחק בהצלחה!';

    setTimeout(() => {
      loader.style.display = 'none';
      loaderAnim.style.display = 'block';
      checkmark.style.display = 'none';
      loaderText.textContent = 'טוען נתונים...';

      // מחיקת הפריט מ-historyData ועדכון התצוגה
      const select = document.getElementById('dateSelect');
      const selectedIndex = select.value;
      historyData.splice(selectedIndex, 1);
      populateDateSelect();
      document.getElementById('history-card').style.display = 'none';
      select.value = '';
    }, 1500);

  } else {
    loaderAnim.style.display = 'none';
    checkmark.style.display = 'none';
    crossmark.style.display = 'block';
    loaderText.textContent = 'אירעה שגיאה במחיקה!';

    setTimeout(() => {
      loader.style.display = 'none';
      loaderAnim.style.display = 'block';
      crossmark.style.display = 'none';
      loaderText.textContent = 'טוען נתונים...';
    }, 1500);
  }
}