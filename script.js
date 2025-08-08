const FinanceApp = {
  currentView: 'current',
  historyData: [],
  dynamicCategories: [],
  categoriesLoaded: false,

  init() {
    this.loadCategories();
  },

  safeNumber(val) {
    return Number(val) || 0;
  },

  createItem(label, value, extraClass = '', style = '') {
    const div = document.createElement('div');
    div.className = `item ${extraClass}`.trim();
    div.innerHTML = `<strong>${label}:</strong> <span class="blur-text" style="${style}">${value}</span>`;
    return div;
  },

  loadCategories() {
    const script = document.createElement('script');
    script.src = CONFIG.categoriesUrl;
    script.onerror = () => console.error("שגיאה בטעינת קטגוריות.");
    document.body.appendChild(script);

    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = (res) => this.handleCategoriesResponse(res);
  },

  generateDynamicInputs() {
    const container = document.getElementById('dynamic-fields');
    container.innerHTML = '';
    this.dynamicCategories.forEach(cat => {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-group';
      wrapper.innerHTML = `
        <label>${cat.icon || ''} ${cat.label}: 
          <input type="number" id="new_${cat.id}" />
        </label>
      `;
      container.appendChild(wrapper);
    });
  },

  handleCategoriesResponse(response) {
    try {
      const rows = response.table?.rows || [];
      const dataRows = rows.slice(1);

      this.dynamicCategories = dataRows.map(row => {
        const id = row.c[0]?.v;
        const label = row.c[1]?.v;
        const icon = row.c[2]?.v;
        return { id, label, icon };
      }).filter(item => item.id);

      this.categoriesLoaded = true;
      this.generateDynamicInputs();
      this.loadCurrentReport();
    } catch (err) {
      console.error("❌ שגיאה בעיבוד הקטגוריות:", err);
    }
  },

  loadCurrentReport() {
    const currentReportScript = document.createElement('script');
    currentReportScript.src = CONFIG.currentReportUrl;
    currentReportScript.onerror = () => {
      document.getElementById('container').innerHTML = '<p class="error">שגיאה בטעינת הדוח הנוכחי.</p>';
    };
    document.body.appendChild(currentReportScript);

    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = (res) => this.parseGoogleSheetsData(res);
  },

  setActiveTab(selectedButton) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    selectedButton.classList.add('active');
  },

  showCurrentReport() {
    this.currentView = 'current';
    document.getElementById('current-view').style.display = 'block';
    document.getElementById('history-view').style.display = 'none';
    this.setActiveTab(document.querySelector('.tab-button:nth-child(1)'));
  },

  showHistory() {
    this.currentView = 'history';
    document.getElementById('current-view').style.display = 'none';
    document.getElementById('history-view').style.display = 'block';
    this.setActiveTab(document.querySelector('.tab-button:nth-child(2)'));
    if (this.historyData.length === 0) {
      this.loadHistoryData();
    }
  },

  renderCard(data, containerId = 'container') {
    const card = document.createElement('div');
    card.className = 'card blur-data';

    // תאריך
    card.appendChild(this.createItem('📅 דוח אחרון', data.lastDate || data.date || ''));

    // קטגוריות דינמיות
    this.dynamicCategories.forEach(cat => {
      card.appendChild(this.createItem(
        `${cat.icon || ''} ${cat.label}`,
        this.formatCurrency(this.safeNumber(data[cat.id]))
      ));
    });

    // נכסים נזילים
    const liquidAssets = ['cash', 'currentAcc', 'savingsFund']
      .map(k => this.safeNumber(data[k]))
      .reduce((a, b) => a + b, 0);
    const liquidPercent = data.totalAssets
      ? ((liquidAssets / this.safeNumber(data.totalAssets)) * 100).toFixed(1) + '%'
      : '0%';
    card.appendChild(this.createItem('💧 נכסים נזילים',
      `${this.formatCurrency(liquidAssets)} (${liquidPercent})`
    ));

    // סה"כ נכסים
    card.appendChild(this.createItem('📈 סה"כ נכסים',
      this.formatCurrency(this.safeNumber(data.totalAssets)),
      'highlighted'
    ));

    // צמיחה
    card.appendChild(this.createItem('📈 צמיחה', this.formatCurrency(this.safeNumber(data.growth))));

    // אחוז צמיחה עם צבע
    const growthPercent = typeof data.growthPercentRaw === 'number'
      ? (data.growthPercentRaw * 100).toFixed(2) + '%'
      : data.growthPercentRaw || '0%';
    const growthColor = data.growthPercentRaw > 0 ? '#27ae60' :
      data.growthPercentRaw < 0 ? '#e74c3c' : '#000';
    card.appendChild(this.createItem('📈 אחוז צמיחה', growthPercent, '', `font-weight: bold; color: ${growthColor}`));

    // צמיחה ממוצעת
    if (data.avgGrowth !== undefined) {
      card.appendChild(this.createItem('📈 צמיחה ממוצעת', this.formatCurrency(this.safeNumber(data.avgGrowth)), 'avg-growth'));
    }

    // תאריך שיא
    if (data.peakGrowthDate) {
      card.appendChild(this.createItem('📅 תאריך שיא', data.peakGrowthDate, 'avg-growth'));
    }

    // הערות
    if (data.notes) {
      const notesDiv = document.createElement('div');
      notesDiv.className = 'item notes highlighted-yellow';
      notesDiv.textContent = data.notes; // הגנה מפני XSS
      if (!data.notes.includes('✔️')) notesDiv.classList.add('negative');
      card.appendChild(notesDiv);
    }

    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.appendChild(card);
  },

  formatCurrency(value) {
    return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
  },

  parseGoogleSheetsData(response) {
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
      };
      this.renderCard(data, 'container');
      document.getElementById('loader').style.display = 'none';
    } catch {
      document.getElementById('container').innerHTML = '<p class="error">שגיאה בטעינת נתוני הדוח הנוכחי.</p>';
    }
  },

  parseHistoryData(response) {
    try {
      const rows = response.table.rows;
      this.historyData = rows.map(row => {
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
      this.populateDateSelect();
    } catch {
      document.getElementById('history-view').innerHTML = '<p class="error">שגיאה בטעינת היסטוריית הדוחות.</p>';
    }
  },

  populateDateSelect() {
    const select = document.getElementById('dateSelect');
    select.innerHTML = '<option value="" disabled selected>בחר תאריך</option>';
    this.historyData.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = item.date;
      select.appendChild(option);
    });
  },

  onDateChange() {
    const select = document.getElementById('dateSelect');
    const idx = select.value;
    if (idx !== '') {
      const data = this.historyData[idx];
      if (data) {
        const historyCard = document.getElementById('history-card');
        historyCard.style.display = 'block';
        historyCard.innerHTML = '';
        this.renderCard(data, 'history-card');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ מחק חודש';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => this.deleteSelectedMonth(idx);
        historyCard.appendChild(deleteBtn);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.className = 'close-button';
        closeBtn.onclick = () => {
          historyCard.style.display = 'none';
          select.value = '';
        };
        historyCard.appendChild(closeBtn);
      }
    }
  },

  loadHistoryData() {
    const script = document.createElement('script');
    script.src = CONFIG.historyReportUrl;
    script.onerror = () => {
      document.getElementById('history-view').innerHTML = '<p class="error">שגיאה בטעינת היסטוריית הדוחות.</p>';
    };
    document.body.appendChild(script);

    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = (res) => this.parseHistoryData(res);
  },

  toggleForm() {
    const form = document.getElementById('new-entry-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  },

  submitNewEntry() {
    document.getElementById('loader').style.display = 'flex';
    const sendBtn = document.querySelector("#new-entry-form button[onclick='FinanceApp.submitNewEntry()']");
    sendBtn.disabled = true;
    sendBtn.textContent = "טוען...";

    const date = document.getElementById('newDate').value;
    const sheetName = "מעקב חסכונות";
    const params = new URLSearchParams({ date, sheetName, callback: "FinanceApp.handleResponse" });

    this.dynamicCategories.forEach(cat => {
      const input = document.getElementById(`new_${cat.id}`);
      const value = input ? input.value : '';
      params.append(cat.id, encodeURIComponent(value || 0));
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
  },

  handleResponse(response) {
    const loader = document.getElementById('loader');
    const loaderAnim = loader.querySelector('.loader-animation');
    const checkmark = loader.querySelector('.loader-checkmark');
    const crossmark = loader.querySelector('.loader-cross');
    const loaderText = document.getElementById('loader-text');
    const sendBtn = document.querySelector("#new-entry-form button[onclick='FinanceApp.submitNewEntry()']");

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

      this.toggleForm();
      this.loadHistoryData();
      this.loadCurrentReport();
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
  },

  deleteSelectedMonth(selectedIndex) {
    if (!selectedIndex || !this.historyData[selectedIndex]) return;
    if (!confirm('האם אתה בטוח שברצונך למחוק את החודש שנבחר?')) return;

    const dateToDelete = this.historyData[selectedIndex].date;
    const sheetName = "מעקב חסכונות";
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    const params = new URLSearchParams({
      date: dateToDelete,
      sheetName,
      callback: 'FinanceApp.handleDeleteResponse'
    });

    const script = document.createElement('script');
    script.src = CONFIG.DeleteMonth + '?' + params.toString();
    script.onerror = () => {
      loader.style.display = 'none';
      console.error('אירעה שגיאה בשליחת בקשת המחיקה.');
    };
    document.body.appendChild(script);
  },

  handleDeleteResponse(response) {
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
        const select = document.getElementById('dateSelect');
        const selectedIndex = select.value;
        this.historyData.splice(selectedIndex, 1);
        this.populateDateSelect();
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
};

FinanceApp.init();