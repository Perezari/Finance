# Budgy — מעקב פיננסי · CLAUDE.md

## סקירת הפרויקט
PWA למעקב פיננסי אישי בעברית (RTL), ממשק חשוך עם תמיכה ב-dark mode, backend על Supabase.  
**שפת UI**: עברית בלבד. כל טקסט למשתמש בעברית.

## Stack
| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | Vanilla JS + HTML + CSS — **ללא build step, ללא framework** |
| Backend | Supabase (Auth + PostgreSQL) |
| Charts | Chart.js 4.4 |
| PDF | html2pdf.js 0.10 |
| Fonts | Outfit (UI), Heebo (עברית), JetBrains Mono (מספרים) |
| Hosting | GitHub Pages |

## מבנה קבצים
```
index.html   — markup כל המסכים + script tags
style.css    — כל ה-CSS, כולל dark mode ו-responsive
app.js       — כל ה-JS: state, Supabase calls, render functions
manifest.json
icon.png
```
**אין** קבצים נפרדים לקומפוננטות. הכל בשלושת הקבצים הללו.

---

## CSS — כללים קריטיים

### משתני צבע — אסור hardcode!
כל הצבעים דרך CSS variables. אף פעם לא ערכי hex ישירות בתכונות כמו `background`, `box-shadow`, `border-color`:

```css
/* ✅ נכון */
background: var(--green);
box-shadow: var(--shadow-green);

/* ❌ אסור */
background: #0e9e7e;
box-shadow: 0 6px 24px rgba(14,158,126,.25);
```

### מערכת גוונים (COLOR_THEMES)
יש 5 גוונים: `green`, `blue`, `purple`, `rose`, `amber`.  
`applyColorTheme(themeId)` מעדכן את **כל** 7 המשתנים הבאים:

| CSS Variable | תפקיד |
|---|---|
| `--green` | צבע ראשי (כפתורים, הדגשות) |
| `--green-mid` | צבע gradient שני (בהיר יותר) |
| `--green-dark` | צבע gradient ראשון (כהה יותר) |
| `--green-light` | רקע עדין (rgba 12%) |
| `--green-glow` | glow / focus ring (rgba 18%) |
| `--green-shadow-sm` | צל קטן על כפתורים (rgba 50%) |
| `--shadow-green` | צל רגיל על כרטיסיות (rgba 25%) |

**כשמוסיפים רכיב עם צל או gradient בגוון הראשי — חובה להשתמש בכל אלה.**

### Gradients — תמיד CSS vars
```css
/* ✅ נכון — לוגו, כרטיסיות accent, כפתורים ראשיים */
background: linear-gradient(135deg, var(--green-dark), var(--green));

/* ❌ אסור */
background: linear-gradient(135deg, #0b7a62, #0e9e7e);
```

### Dark mode
מחלקה `[data-theme="dark"]` על `<html>`. כפילות בקריאות לצבעים:
```css
/* Light */
.my-el { background: var(--surface); }
/* Dark override */
[data-theme="dark"] .my-el { background: var(--surface-dark, #1a1d24); }
```

### RTL
- `direction: rtl` על `html, body`
- מרחקים: `margin-right` / `padding-right` (לא left) עבור רכיבים RTL
- `text-align: right` כברירת מחדל

### Breakpoints
- Mobile: `max-width: 768px`
- Desktop only: class `.desktop-only` / `.mobile-only`
- Navigation: mobile = floating bottom nav, desktop = sidebar קבועה

### קידומת `chb-`
קומפוננטות modal משותפות (header כהה, body, footer) משתמשות בקידומת `chb-`.  
כל ה-modals חייבים לשמור על אותו design language: header כהה (`--ink-2`/`--surface2`), ללא gradient צבעוני בheader.

---

## JavaScript — כללים קריטיים

### State גלובלי
```js
let currentUser   = null;   // Supabase user object
let categories    = [];     // מ-Supabase, sorted
let records       = [];     // מ-Supabase, sorted by date
let blurActive    = false;  // hide values mode
let mainChart     = null;   // Chart.js instance
let retChart      = null;
let yvyChart      = null;
let editMode      = false;
let viewMode      = 'grid'; // 'grid' | 'list'
let navStyle      = 'floating'; // 'floating' | 'classic'
let currentRecordIndex = -1; // -1 = latest record
```

### Supabase
```js
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```
הגדרות SUPABASE_URL ו-SUPABASE_ANON_KEY מוגדרות לפני app.js (ב-index.html או קובץ config).

### User metadata (נשמר ב-Supabase auth.users)
```js
currentUser.user_metadata.full_name       // שם תצוגה
currentUser.user_metadata.color_theme     // 'green'|'blue'|'purple'|'rose'|'amber'
currentUser.user_metadata.dark_mode       // 'dark'|'light'|'auto'
currentUser.user_metadata.view_mode       // 'grid'|'list'
currentUser.user_metadata.nav_style       // 'floating'|'classic'
currentUser.user_metadata.mortgage_inst   // institution id
currentUser.user_metadata.partner_email   // שיתוף חשבון
```
**העדפות משתמש נשמרות ב-Supabase, לא localStorage בלבד** (localStorage כ-cache בלבד).

### Icons
אין ספריית אייקונים. כל האייקונים SVG inline.  
אייקונים כלליים: `ICONS_JS` object.  
אייקוני קטגוריות: `CAT_SVG` object + `getCatSvg(cat)`.  
**אין emojis בממשק** — SVG בלבד.

### לוגואים של מוסדות
```js
function logoUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
```

### Render pattern
פונקציות render מחזירות HTML string ומוכנסות ל-`innerHTML`.  
לא React, לא virtual DOM — direct DOM manipulation.

### Color theme — כשמוסיפים קוד JS עם צבע ראשי
```js
// ✅ תמיד קרא את הצבע הנוכחי דרך CSS variable
const color = getComputedStyle(document.documentElement).getPropertyValue('--green').trim();

// ❌ אסור
const color = '#0e9e7e';
```

### Inline styles עם צבעי accent
```js
// ✅ נכון — CSS var בתוך style string
`style="color:var(--green);border-color:var(--green)"`

// ❌ אסור
`style="color:#0e9e7e;border-color:#0e9e7e"`
```
גם `rgba` hardcoded לצבע הראשי אסור — תמיד `var(--green-glow)` / `var(--shadow-green)` וכו'.

---

## Supabase Tables

### `categories`
| עמודה | סוג | הערה |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK to auth.users |
| key | text | מזהה ייחודי (snake_case) |
| label | text | שם לתצוגה |
| icon | text | emoji / url |
| type | text | 'liquid'/'semi'/'locked' |
| is_liquid | bool | |
| liquid_date | date | תאריך נזילות |
| institution_id | text | מזהה מ-INSTITUTIONS[] |
| mortgage_inst_id | text | |
| sort_order | int | |

### `records`
| עמודה | סוג | הערה |
|---|---|---|
| id | uuid | |
| user_id | uuid | |
| record_date | date | YYYY-MM-DD, unique per user |
| data | jsonb | `{ [categoryKey]: amount }` |

---

## Tabs (מסכי האפליקציה)
| Tab ID | תיאור |
|---|---|
| `current` | דוח נוכחי — כרטיסיות, health score |
| `history` | גרף היסטוריה + השוואת שנה מול שנה |
| `retirement` | תכנון פרישה |
| `portfolio` | תיק השקעות + breakdown |
| `annual` | סיכום שנתי |

---

## פונקציות מרכזיות

```js
init()                    // entry point — auth check
loadApp()                 // לאחר login — טעינת נתונים + render
loadCategories()          // Supabase fetch → categories[]
loadRecords()             // Supabase fetch → records[]
renderCurrentReport()     // renders tab-current
switchTab(id, el)         // מעבר בין tabs
applyColorTheme(themeId)  // עדכון כל 7 CSS vars + localStorage + Supabase
initColorTheme()          // קריאה ב-loadApp לאחר sync
showToast(msg)            // toast notification
showLoader(msg)           // fullscreen loader
hideLoader()
showScreen('auth'|'app')
openWizard()              // wizard הוספת חודש חדש
```

---

## Do & Don't

| Do ✅ | Don't ❌ |
|---|---|
| CSS vars לכל צבע accent | Hardcode ירוק (`#0e9e7e`, rgba שלו) |
| `var(--green-dark), var(--green)` ב-gradients | `#0b7a62, #0e9e7e` ב-gradients |
| SVG inline לאייקונים | Emoji בממשק |
| שמירת העדפות ב-Supabase user_metadata | localStorage בלבד לפרפ משתמש |
| `getComputedStyle` לקבלת צבע ב-JS | Hardcode hex ב-JS |
| שינויים ממוקדים ומינימליים | Rewrites רחבים |
| בדיקה שה-dark mode override מכסה CSS חדש | הנחה שהכל עובד ב-dark mode |
| RTL-aware spacing | `margin-left` / `padding-left` ברכיבים RTL |
