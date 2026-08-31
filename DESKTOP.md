# Budgy Desktop (Tauri)

אותה אפליקציה בדיוק כמו ב-web — אותם `index.html` / `app.js` / `style.css` —
עטופה ב-Tauri, עם יכולת אחת שדפדפן לא יכול לתת: **ייבוא משכנתא בלחיצה אחת**.

---

## למה זה קיים

Budgy ב-GitHub Pages לא יכול לקרוא מ-`mto.mizrahi-tefahot.co.il`. זה
ה-same-origin policy, וזה מה שמונע מכל אתר לגנוב נתוני בנק. בגלל המחסום הזה
גרסת ה-web צריכה או בוקמרקלט בספארי או `helper.mjs` שרץ ברקע.

באפליקציית דסקטופ המחסום נעלם: אנחנו פותחים את הבנק ב-webview **שלנו**
ומצמידים לחלון הזה `initialization_script`. הקוד שלנו רץ בתוך הדף של הבנק —
אותו origin, הסשן כבר מחובר.

**אתה עדיין מתחבר ידנית.** סיסמה ו-OTP הם שלך; שום שורת קוד כאן לא נוגעת בהם.

---

## הזרימה

1. לוחצים **ייבא נתונים מהבנק** (בבאנר או במסך פירוט המשכנתא).
2. Rust פותח חלון על אתר הבנק ומזריק אליו קורא.
3. אתה מתחבר. הקורא מנסה כל 3 שניות — הוא שורד את כל ההפניות של תהליך
   ההתחברות, כי `initialization_script` רץ מחדש בכל ניווט.
4. ברגע שהסשן חי, הוא שולף את `/Online/api/mashkanta/profile` ושולח את ה-JSON
   הגולמי ל-`record-mortgage`, שמפרסר, שומר ושולח פוש.
5. החלון נסגר, והדוח מתרענן.

## מודל האבטחה

```
חלון main  ──IPC──►  פקודות Tauri            (capability: default)
חלון bank  ──✗────►  אין לו שום capability
      └── fetch ──► Supabase (ישירות)
      └── POST  ──► 127.0.0.1:<אקראי>/result  (חד-פעמי, נסגר מיד)
```

לחלון הבנק **לא ניתנה אף הרשאת Tauri**. אם הדף הזה ייפרץ אי פעם, הוא לא יכול
לקרוא לפקודה אחת של האפליקציה. הערוץ היחיד חזרה הוא מאזין loopback על פורט
אקראי שנפתח רק בזמן ייבוא ונסגר ברגע שיש תשובה.

הסוד נשמר ב-`%APPDATA%\com.ari.budgy\config.json`. אם הוא לא קיים, האפליקציה
נופלת ל-`scraper/.env` — כך שבמחשב הזה אין מה להגדיר פעמיים.

---

## בנייה והרצה

```
dev.bat        הרצה במצב פיתוח
build.bat      exe + installer תחת src-tauri/target/release/bundle/nsis/
budgy.lnk      קיצור דרך לאפליקציה הבנויה
```

זו אותה תבנית של WolfStone Next: `VsDevCmd` לפני cargo, `.cargo/bin` ל-PATH,
ו-`.lnk` בשורש הריפו שמצביע על ה-exe.

הקבצים של ה-web נשארים בשורש ומשרתים את GitHub Pages כרגיל.
`sync-frontend.mjs` רק מעתיק אותם ל-`src-tauri/dist` לפני בנייה — **אין**
build step לאפליקציית ה-web, וזה נשאר נכון.

### למה יש wrapper ולא סתם `npm run tauri build`

(אותה בעיה בדיוק שכבר פתרת ב-WolfStone Next — ה-`dev.bat` שם מכיל את אותה
הערה על VS 18.)

במחשב הזה מותקנות כמה גרסאות Visual Studio. Rust בוחר את **החדשה ביותר**,
וב-VS 18 Community חסרות ספריות ה-x64 לגמרי (אין `VC\Tools\MSVC\<ver>\lib\x64`).
התוצאה:

```
LINK : fatal error LNK1104: cannot open file 'msvcrt.lib'
```

`find-vcvars.mjs` סורק את ההתקנות, בוחר אחת שבאמת יש בה `msvcrt.lib`
(VS 2022 Build Tools), וה-`.bat` טוען את הסביבה שלה לפני cargo.

אם תרצה לתקן את השורש: Visual Studio Installer ← VS 18 ← **Modify** ←
לסמן **Desktop development with C++**. אחרי זה ה-wrapper עדיין יעבוד.

---

## מה לא נבדק

**האם אתר הבנק בכלל נטען ב-WebView2.** ההזרקה עצמה בנויה בדיוק כמו
הבוקמרקלט שכבר עבר את שלב ה-fetch, אבל האנטי-בוט של מזרחי מול WebView2 הוא
לא-ידוע. אם ההתחברות לא עוברת שם, הדרך של `scraper/run.bat` (Playwright עם
Chrome אמיתי) ממשיכה לעבוד כרגיל — היא לא הוסרה.

---

## חלון בלי decorations

לפי הסגנון של WolfStone Next החלון נפתח עם `decorations: false` ו-`visible: false`.
אבל במקום לערום titlebar נוסף מעל Budgy, ה-`.topbar` **הקיים** של האפליקציה
הפך לאזור הגרירה, וכפתורי החלון נכנסו ל-`.topbar-actions`. שום דבר בלייאאוט
לא זז, וגרסת ה-web לא רואה מזה כלום — הכל מאחורי `html.is-tauri`.

החלון מוסתר עד ש-`app.js` קורא ל-`show()` אחרי החלת ה-theme, כך שאין הבזק של
צבעים שגויים. ב-Rust יש רשת ביטחון: אם ה-JS לא הציג תוך 5 שניות, הוא מוצג
בכל זאת.

בגלל שהכפתורים ב-RTL יושבים בצד שמאל של ה-topbar, גם כפתורי החלון שם. אם
תעדיף אותם בימין — שורה אחת ב-CSS.

---

## מבנה

```
dev.bat  build.bat  budgy.lnk
src-tauri/
  Cargo.toml
  tauri.conf.json            frontendDist -> ./dist
  capabilities/default.json  main בלבד
  windows/hooks.nsh          taskkill לפני התקנה
  src/lib.rs                 הגדרות, חלון הבנק, ההזרקה, מאזין התוצאה
  scripts/
    sync-frontend.mjs        מעתיק את קבצי ה-web ל-dist
    find-vcvars.mjs          fallback לאיתור MSVC שלם
```

**אין updater.** ב-WolfStone Next הוא קיים כי היא מופצת למחשבים אחרים; Budgy
רצה אצלך בלבד, אז אין מפתחות חתימה ואין endpoint. אם זה ישתנה — הדפוס מתועד
בסקיל `tauri-desktop-app`.
