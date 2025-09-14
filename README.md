# Personal Finance Dashboard

[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Frontend](https://img.shields.io/badge/frontend-HTML5%20%7C%20CSS3-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Backend](https://img.shields.io/badge/backend-Google%20Sheets%20%2F%20Apps%20Script-blue.svg)](https://developers.google.com/apps-script)
[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/Perezari/Finance/releases)
[![License](https://img.shields.io/badge/license-Unlicensed-lightgrey.svg)](https://choosealicense.com/no-permission/)

A simple, yet powerful web-based personal finance dashboard designed to track current financial status, historical data, and manage monthly entries. It leverages Google Sheets as a backend for easy data storage and management, providing a clear overview of assets, growth, and liquid assets. Built with a focus on privacy and user experience, this app is also a Progressive Web App (PWA) for easy installation and offline access.

✨ Features

*   **Current Financial Report:** Displays an up-to-date overview of various asset categories.
*   **Historical Data View:** Browse past financial reports by month.
*   **Dynamic Categories:** Configurable asset categories fetched directly from Google Sheets, allowing for flexible tracking.
*   **Monthly Entry Management:** Easily add new monthly financial snapshots with dynamic input fields based on your categories.
*   **Month Deletion:** Safely remove historical monthly records with a confirmation step.
*   **Sensitive Data Blur Toggle:** Toggle a blur effect (`🔒`) to instantly hide sensitive financial figures for privacy, changing to an unblurred state (`🔓`) when active.
*   **Liquid Assets Calculation:** Automatically calculates and displays liquid assets and their percentage of total assets.
*   **Growth Tracking:** Visualizes financial growth and percentage change, with color-coded indicators.
*   **Google Sheets Integration:** Uses Google Sheets as the data source and Google Apps Script for API endpoints, making data management flexible and accessible.
*   **Progressive Web App (PWA):** Installable on devices for quick access, with a custom theme and icon.
*   **Mobile-Responsive UI:** Designed for a seamless and intuitive experience across various screen sizes.
*   **Google Sheets Shortcut:** Quick access button to open the linked Google Spreadsheet directly.

📚 Tech Stack

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (Vanilla JS)
*   **Backend / Data Storage:**
    *   [Google Sheets](https://docs.google.com/spreadsheets/) (for data persistence)
    *   [Google Apps Script](https://developers.google.com/apps-script) (for API endpoints to read/write data)
*   **Styling:**
    *   [Google Fonts (Heebo)](https://fonts.google.com/specimen/Heebo)
    *   SVG (for icons)

🚀 Installation

This project is a static web application that relies on Google Sheets for its backend. Follow these steps to set it up:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Perezari/Finance.git
    cd Finance
    ```
2.  **Set up your Google Sheet:**
    *   Create a new Google Sheet in your Google Drive. You will need at least three tabs/worksheets:
        *   `Current Report`: For the latest financial snapshot (e.g., one row of current data).
        *   `History`: To store historical monthly data (each row represents a month's data).
        *   `Categories`: To define your dynamic asset categories. This sheet should have columns like `ID`, `Label`, `Icon` (e.g., `cash`, `Cash`, `💰`).
    *   The `script.js` expects specific column headers/IDs for data parsing. Ensure your sheet structure aligns with these (e.g., `cash`, `currentAcc`, `deposit`, `savingsFund`, `pensionFund`, `totalAssets`, `growth`, `growthPercentRaw`, `peakGrowthDate`, `notes`). The `Categories` sheet will dynamically create input fields in the form, so ensure those IDs are present in your `Current Report` and `History` sheets.

3.  **Deploy Google Apps Script for API Endpoints:**
    *   Go to `Extensions > Apps Script` in your Google Sheet.
    *   You will need to write or adapt Google Apps Script functions to:
        *   Serve data from your `Current Report`, `History`, and `Categories` sheets as JSONP.
        *   Handle `AddNewMonth` requests to add new rows to your `History` sheet.
        *   Handle `DeleteMonth` requests to remove rows from your `History` sheet.
    *   **Example Apps Script (`Code.gs`):**
        ```javascript
        function doGet(e) {
          const sheetName = e.parameter.sheet || "Current Report";
          const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
          const range = sheet.getDataRange();
          const values = range.getValues();

          const data = {
            table: {
              cols: [],
              rows: []
            }
          };

          // Headers (first row) for dynamic category mapping
          if (values.length > 0) {
            values[0].forEach(header => {
              data.table.cols.push({ id: header, label: header, type: 'number' }); // Adjust type as needed
            });

            // Data rows (slice(1) to skip headers)
            values.slice(1).forEach(row => {
              data.table.rows.push({ c: row.map(cell => ({ v: cell, f: typeof cell === 'object' && cell.getDisplayValue ? cell.getDisplayValue() : cell })) });
            });
          }

          const callback = e.parameter.callback;
          return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)})`)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        }

        function AddNewMonth(e) {
          const historySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("History");
          const categoriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Categories");
          const headers = categoriesSheet.getRange(1, 1, 1, categoriesSheet.getLastColumn()).getValues()[0]; // Get category IDs
          const newRow = [];

          // Assuming 'Date' is the first column
          newRow.push(e.parameter.date ? new Date(e.parameter.date) : ''); // Parse date string to Date object

          // Populate values based on dynamic categories
          headers.slice(1).forEach(headerId => { // Skip 'ID' header if present in categories, adjust indexing
            newRow.push(parseFloat(e.parameter[headerId] || 0));
          });
          
          // Add remaining calculated fields if necessary, or let client-side handle
          // This example is simplified. A real impl would get the current/previous month total assets etc.
          // For simplicity, sum up the input values for 'totalAssets' for now
          const totalAssets = newRow.slice(1).reduce((sum, val) => sum + val, 0); 
          newRow.push(totalAssets); // Example: totalAssets

          historySheet.appendRow(newRow); // Append to history

          return ContentService.createTextOutput(`handleResponse({status: "success", message: "Month added successfully!"})`)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        }

        function DeleteMonth(e) {
          const historySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("History");
          const dateToDelete = e.parameter.date; // Date as string 'YYYY-MM-DD'
          const values = historySheet.getDataRange().getValues();
          
          for (let i = values.length - 1; i >= 0; i--) {
            const rowDate = Utilities.formatDate(new Date(values[i][0]), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "yyyy-MM-dd");
            if (rowDate === dateToDelete) {
              historySheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
              return ContentService.createTextOutput(`handleDeleteResponse({status: "success", message: "Month deleted successfully!"})`)
                .setMimeType(ContentService.MimeType.JAVASCRIPT);
            }
          }
          return ContentService.createTextOutput(`handleDeleteResponse({status: "error", message: "Date not found."})`)
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
        ```
    *   Deploy your Apps Script as a web app. Go to `Deploy > New deployment`.
        *   Select type `Web app`.
        *   "Execute as:" should be `Me`.
        *   "Who has access:" should be `Anyone`.
        *   Copy the generated "Web app URL".
    *   Update the `config.js` file in your cloned repository with the new URLs and the `gid` (Google Sheet ID) for each specific sheet (Current Report, History, Categories).
        ```javascript
        const CONFIG = {
          currentReportUrl: "YOUR_WEB_APP_URL_FOR_CURRENT_REPORT_SHEET?tqx=out:jsonp&gid=YOUR_GID_FOR_CURRENT_REPORT",
          historyReportUrl: "YOUR_WEB_APP_URL_FOR_HISTORY_SHEET?tqx=out:jsonp&gid=YOUR_GID_FOR_HISTORY",
          categoriesUrl: "YOUR_WEB_APP_URL_FOR_CATEGORIES_SHEET?tqx=out:jsonp&gid=YOUR_GID_FOR_CATEGORIES",
          AddNewMonth: "YOUR_ADD_NEW_MONTH_WEB_APP_URL",
          DeleteMonth: 'YOUR_DELETE_MONTH_WEB_APP_URL'
        };
        ```
        (Note: For `currentReportUrl`, `historyReportUrl`, `categoriesUrl`, you can directly use the Gviz API endpoint as shown in the original `config.js` if your sheet is publicly accessible. For `AddNewMonth` and `DeleteMonth`, you need Apps Script web app URLs.)

4.  **Serve the application:**
    Due to browser [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) restrictions when fetching data from local files, you might need to serve the `Finance` directory via a local web server (e.g., Python's `http.server`, Node.js `serve`, or [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)) for full functionality.

    ```bash
    # Example using Python (if Python is installed)
    cd Finance
    python -m http.server 8000
    # Then navigate to http://localhost:8000/index.html in your web browser.
    ```
    If you host it on GitHub Pages or similar, this step is automatically handled.

▶️ Usage

*   **Viewing Reports:**
    *   The "דוח נוכחי 📊" (Current Report) tab displays your latest financial overview.
    *   Switch to "היסטוריה 🕒" (History) to browse past monthly reports using the date dropdown.
*   **Adding New Entries:**
    *   In the "היסטוריה" tab, click "➕ הוסף חודש חדש" to reveal the form.
    *   Enter the date and values for each dynamic category (e.g., Cash, Current Account, etc.).
    *   Click "📤 שלח" to submit the new monthly entry to your Google Sheet. A loader will appear, followed by a success/error message.
*   **Deleting Entries:**
    *   In the "היסטוריה" tab, select a month from the dropdown.
    *   Click "🗑️ מחק חודש" to remove that month's data from your Google Sheet. A confirmation prompt will appear.
*   **Blurring Sensitive Data:**
    *   Click the "🔒" icon next to the main title "דוח פיננסי" to toggle blurring of financial figures for privacy. The icon will change to "🔓" when unblurred.
*   **Accessing Google Sheet:**
    *   Click the Google Sheets icon (`<svg>`) in the top right corner to quickly open your linked Google Spreadsheet for direct data management.

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📝 License

This project is currently unlicensed. It is recommended to choose an open-source license like the [MIT License](https://opensource.org/licenses/MIT) to encourage contributions and define how others can use your code.