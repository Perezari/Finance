# 🚀 מדריך הגדרה – מעקב פיננסי

## שלב 1: צור פרויקט Supabase (חינמי)

1. היכנס ל־ https://supabase.com והירשם (חינמי)
2. לחץ **"New Project"**
3. בחר שם לפרויקט, סיסמה, ואזור (Europe West מומלץ)
4. המתן ~2 דקות ליצירת הפרויקט

---

## שלב 2: צור את הטבלאות

ב-Supabase, לחץ על **SQL Editor** (בתפריט הצד) והדבק ורוץ את ה-SQL הבא:

```sql
-- טבלת קטגוריות
CREATE TABLE public.categories (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key          text NOT NULL,
  label        text NOT NULL,
  icon         text DEFAULT '💰',
  order_index  integer DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, key)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own categories"
  ON public.categories FOR ALL
  USING (auth.uid() = user_id);

-- טבלת רשומות חודשיות
CREATE TABLE public.monthly_records (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  record_date      date NOT NULL,
  values           jsonb NOT NULL DEFAULT '{}',
  mortgage_balance numeric DEFAULT 0,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(user_id, record_date)
);

ALTER TABLE public.monthly_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own records"
  ON public.monthly_records FOR ALL
  USING (auth.uid() = user_id);
```

לחץ **Run** ✅

---

## שלב 3: קבל את מפתחות ה-API

1. בתפריט Supabase, לחץ על **Settings → API**
2. העתק:
   - **Project URL** (נראה כך: `https://xxxxx.supabase.co`)
   - **anon / public key** (מפתח ציבורי ארוך)

3. פתח את הקובץ **`config.js`** ועדכן:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'; // ← שנה זה
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';              // ← שנה זה
```

---

## שלב 4: הגדר Email (כדי שהרשמה תעבוד)

ב-Supabase: **Authentication → Email Templates**

לאפשרויות מהירות, ב-**Authentication → Settings**:
- ניתן לכבות "Confirm email" כדי שלא תצטרך לאשר אימייל בכל הרשמה (טוב לפיתוח)

---

## שלב 5: העלה לאינטרנט

### אפשרות א׳ – GitHub Pages (חינמי, פשוט)
1. צור repository חדש ב-GitHub
2. העלה את כל הקבצים
3. ב-Settings → Pages → Source: בחר `main` branch
4. הכתובת תהיה: `https://yourusername.github.io/repo-name`

### אפשרות ב׳ – Netlify (חינמי, drag & drop)
1. היכנס ל-https://netlify.com
2. גרור את תיקיית הפרויקט לאתר
3. מקבל כתובת מיידית!

### אפשרות ג׳ – Vercel
```bash
npm i -g vercel
vercel
```

---

## שלב 6: התקנה כאפליקציה על האייפון

1. פתח את האתר **בספארי** (חשוב! לא Chrome)
2. לחץ על כפתור השיתוף ↑
3. בחר **"הוסף למסך הבית"**
4. הרצת האפליקציה תפתח ב-fullscreen כמו אפליקציה רגילה ✅

**נתוני כל משתמש נשמרים ב-Supabase (ענן) ומסונכרנים בין מכשירים!**

---

## 📁 מבנה הקבצים

```
finance-app/
├── index.html      ← מסך האפליקציה
├── style.css       ← עיצוב
├── app.js          ← לוגיקה
├── config.js       ← ⚠️ שנה את מפתחות ה-API כאן
└── manifest.json   ← הגדרות PWA
```

---

## ✨ פיצ'רים

| פיצ'ר | תיאור |
|--------|--------|
| 🔐 הרשמה/כניסה | כל משתמש רואה רק את הנתונים שלו |
| 📊 דוח נוכחי | מציג את החודש האחרון עם חישובים |
| 📈 גרף היסטוריה | גרף קו של נכסים, משכנתא ושווי נקי לאורך זמן |
| 🏠 מעקב משכנתא | יתרת משכנתא + חישוב שווי נקי אוטומטי |
| ➕ הוספת חודש | שמירה בענן בלחיצה |
| 🗑️ מחיקת חודש | עם אישור כפול |
| ⚙️ ניהול קטגוריות | הוסף/מחק קטגוריות נכסים |
| 🔒 מצב פרטיות | טשטוש נתונים ע"י לחיצה |
| 📱 PWA | מתקין כאפליקציה על iOS/Android |

---

## 🛟 תמיכה

אם יש שאלות, כל הקוד ברור ומתועד.
גרסה: **2.0.0**
