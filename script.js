let currentView = 'current';
let historyData = [];
let dynamicCategories = [];
let categoriesLoaded = false;

function loadCategories() {
  const script = document.createElement('script');
  script.src = CONFIG.categoriesUrl;
  script.onerror = () => {
    console.error("שגיאה בטעינת קטגוריות.");
  };
  document.body.appendChild(script);

  window.google = window.google || {};
  window.google.visualization = window.google.visualization || {};
  window.google.visualization.Query = {
    setResponse: handleCategoriesResponse
  };
}

function generateDynamicInputs() {
  const container = document.getElementById('dynamic-fields');
  container.innerHTML = ''; // נקה שדות קודמים

  dynamicCategories.forEach(cat => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    wrapper.innerHTML = `
      <label>${cat.icon || ''} ${cat.label}: 
        <input type="number" id="new_${cat.id}" />
      </label>
    `;
    container.appendChild(wrapper);
  });
}

function handleCategoriesResponse(response) {
  console.log("תגובה מהגיליון התקבלה:", response);

  try {
    const rows = response.table?.rows || [];

    // נדלג על השורה הראשונה שהיא שורת כותרות
    const dataRows = rows.slice(1);

    dynamicCategories = dataRows.map(row => {
      const id = row.c[0]?.v;
      const label = row.c[1]?.v;
      const icon = row.c[2]?.v;

      console.log("שורה:", { id, label, icon });

      return { id, label, icon };
    }).filter(item => item.id);

    categoriesLoaded = true;
	generateDynamicInputs();
    console.log("✅ קטגוריות נטענו:", dynamicCategories);

    // נטען את הדוח הנוכחי רק אחרי שקטגוריות נטענו
    loadCurrentReport();
  } catch (err) {
    console.error("❌ שגיאה בעיבוד הקטגוריות:", err);
  }
}

function loadCurrentReport() {
  const currentReportScript = document.createElement('script');
  currentReportScript.src = CONFIG.currentReportUrl;
  currentReportScript.onerror = () => {
    document.getElementById('container').innerHTML = '<p class="error">שגיאה בטעינת הדוח הנוכחי.</p>';
  };
  document.body.appendChild(currentReportScript);

  window.google = { visualization: { Query: { setResponse: parseGoogleSheetsData } } };
}

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
  console.log('dynamicCategories:', dynamicCategories);

  const card = document.createElement('div');
  card.className = 'card';

  // שורה: תאריך
  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.innerHTML = `📅 דוח אחרון: <span>${data.lastDate || data.date || ''}</span>`;
  card.appendChild(dateDiv);

  // שורות דינמיות לפי הקטגוריות
  dynamicCategories.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'item';

    const label = `<strong>${cat.icon || ''} ${cat.label}:</strong>`;
    const value = `<span class="blur-text">${formatCurrency(data[cat.id] || 0)}</span>`;

    div.innerHTML = `${label} ${value}`;
    card.appendChild(div);
  });
  
const liquidAssets = data.cash + data.currentAcc + data.savingsFund;
const liquidPercent = data.totalAssets ? ((liquidAssets / data.totalAssets) * 100).toFixed(1) + '%' : '0%';
const liquidDiv = document.createElement('div');
liquidDiv.className = 'item';
liquidDiv.innerHTML = `<strong>💧 נכסים נזילים:</strong> <span class="blur-text">${formatCurrency(liquidAssets)} (${liquidPercent})</span>`;
card.appendChild(liquidDiv);
  
  // סה"כ נכסים
  const totalDiv = document.createElement('div');
  totalDiv.className = 'item highlighted';
  totalDiv.innerHTML = `<strong>📈 סה"כ נכסים:</strong> <span class="blur-text">${formatCurrency(data.totalAssets)}</span>`;
  card.appendChild(totalDiv);
  
  // ריק
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'item';
  emptyDiv.innerHTML = `<strong></strong><span class="blur-text"></span>`;
  card.appendChild(emptyDiv);

  // צמיחה
  const growthDiv = document.createElement('div');
  growthDiv.className = 'item';
  growthDiv.innerHTML = `<strong>📈 צמיחה:</strong> <span class="blur-text">${formatCurrency(data.growth)}</span>`;
  card.appendChild(growthDiv);

  // אחוז צמיחה בצבע
  const growthPercent = typeof data.growthPercentRaw === 'number'
    ? (data.growthPercentRaw * 100).toFixed(2) + '%'
    : data.growthPercentRaw;
  const growthColor = data.growthPercentRaw > 0 ? '#27ae60' :
                      data.growthPercentRaw < 0 ? '#e74c3c' : '#000';
  const percentDiv = document.createElement('div');
  percentDiv.className = 'item';
  percentDiv.innerHTML = `<strong>📈 אחוז צמיחה:</strong> <span class="blur-text" style="font-weight: bold; color: ${growthColor};">${growthPercent}</span>`;
  card.appendChild(percentDiv);

  // צמיחה ממוצעת אם קיימת
  if (data.avgGrowth !== undefined) {
    const avgDiv = document.createElement('div');
    avgDiv.className = 'item avg-growth';
    avgDiv.innerHTML = `<strong>📈 צמיחה ממוצעת:</strong> <span class="blur-text">${formatCurrency(data.avgGrowth)}</span>`;
    card.appendChild(avgDiv);
  }
  
    // תאריך שיא
  if (data.avgGrowth !== undefined) {
    const avgDiv = document.createElement('div');
    avgDiv.className = 'item avg-growth';
    avgDiv.innerHTML = `<strong>📅 תאריך שיא:</strong> <span class="blur-text">${data.peakGrowthDate || data.date || ''}</span>`;
    card.appendChild(avgDiv);
  }

  // הערות אם יש
  if (data.notes) {
    const notesDiv = document.createElement('div');
    notesDiv.className = 'item notes highlighted-yellow';
    notesDiv.innerHTML = `<span>${data.notes}</span>`;
    if (!data.notes.includes('✔️')) notesDiv.classList.add('negative');
    card.appendChild(notesDiv);
  }

  // הכנסת לתוך הקונטיינר
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.appendChild(card);
  
// עדכון טשטוש לפי blurActive אחרי הוספת הכרטיס ל-DOM
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => {
    if (blurActive) {
      c.classList.add('blur-data');
    } else {
      c.classList.remove('blur-data');
    }
  });
}

function formatCurrency(value) {
  return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
}

function parseGoogleSheetsData(response) {
  try {
    const row = response.table.rows[0].c;
    const data = {
      lastDate: row[0]?.f || 0,
      cash: row[1]?.v || 0,
      currentAcc: row[2]?.v || 0,
      deposit: row[3]?.v || 0,
      savingsFund: row[4]?.v || 0,
      pensionFund: row[5]?.v || 0,
      totalAssets: row[6]?.v || 0,
      growth: row[7]?.v || 0,
      growthPercentRaw: row[8]?.v || 0,
      peakGrowthDate: row[9]?.f || '',
      avgGrowth: row[10]?.v || 0,
      notes: row[11]?.v || '',
      notesStatus: (row[11]?.v || '').includes('✔️') ? 'positive' : 'negative'
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

loadCategories(); // ⬅️ נטען את הקטגוריות קודם

function toggleForm() {
  const form = document.getElementById('new-entry-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function submitNewEntry() {
  document.getElementById('loader').style.display = 'flex';

  const sendBtn = document.querySelector("#new-entry-form button[onclick='submitNewEntry()']");
  sendBtn.disabled = true;
  sendBtn.textContent = "טוען...";

  const date = document.getElementById('newDate').value;
  const sheetName = "מעקב חסכונות";

  const params = new URLSearchParams({ date, sheetName, callback: "handleResponse" });

  // לולאה על כל הקטגוריות כדי להוסיף את הערכים
  dynamicCategories.forEach(cat => {
    const input = document.getElementById(`new_${cat.id}`);
    const value = input ? input.value : '';
    params.append(cat.id, value || 0);
  });

  const script = document.createElement("script");
  script.src = CONFIG.AddNewMonth + params.toString();

  script.onerror = () => {
    alert("שגיאה בשליחת הבקשה.");
    document.getElementById('loader').style.display = 'none';
    sendBtn.disabled = false;
    sendBtn.textContent = "📤 שלח";
  };

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
  script.src = CONFIG.DeleteMonth + '?' + params.toString();

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

let blurActive = false; // מצב ראשוני: ללא טשטוש

const toggleIcon = document.getElementById("toggle-icon");

toggleIcon.addEventListener("click", function() {
  blurActive = !blurActive;

  // הוספת אנימציית סיבוב מהירה
  this.classList.add('spin');

  // החלפת אייקון אחרי תחילת הסיבוב (כדי שיראה חלק)
  setTimeout(() => {
    this.textContent = blurActive ? "🔒" : "🔓";
  }, 150); // מחכה קצת לפני שינוי הטקסט

  // הסרת הקלאס בסוף האנימציה כדי לאפשר הפעלה חוזרת
  this.addEventListener('animationend', () => {
    this.classList.remove('spin');
  }, { once: true });

  // הפעלת/כיבוי טשטוש בכרטיסים
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (blurActive) {
      card.classList.add('blur-data');
    } else {
      card.classList.remove('blur-data');
    }
  });
});

// מצב שמור בלוקאל סטורג'
const toggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀ מצב בהיר";
}

// לחיצה על הכפתור
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀ מצב בהיר";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙 מצב כהה";
  }
});