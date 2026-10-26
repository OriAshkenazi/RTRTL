---
title: "הזכות לכתוב בכיוון הנכון"
description: "הזכות לכתוב בכיוון הנכון. סקיל בקוד פתוח לכתיבה קריאה בעברית ובטקסט מעורב כבר מהטיוטה הראשונה."
lang: he
dir: rtl
url: https://rtrtl.org/he/
---

פחות תיקונים. יותר עברית.

# הזכות לכתוב בכיוון הנכון.

RTRTL הוא סקיל בקוד פתוח שנותן לסוכן ה־AI שלכם הנחיות לעברית קריאה כבר מהטיוטה הראשונה.

[התקינו את RTRTL](https://rtrtl.org/he/#install) · חופשי לשימוש · קוד פתוח · MIT

כך הקוראים שלכם קוראים

קפיצות אחורה של הקורא **0**

## יישור לימין לא מספיק.

היישור קובע היכן הפסקה ממוקמת בעמוד. הכיוון קובע את סדר הקריאה. הגופן קובע כיצד האותיות מוצגות. טקסט שמשלב עברית ואנגלית דורש התייחסות לשלושתם.

[לקריאת הסקיל](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/SKILL.md)

PRJ07: תוכנית עבודה בעברית

הפרש המדידה: -12.50 mm.

הבדיקה הושלמה (QA-17) בהצלחה.

העברית נקראת מימין לשמאל והקודים והערכים שומרים על הסדר הפנימי שלהם. טקסט המקור אינו משתנה.

```html
<p lang="he" dir="rtl">
  הפרש המדידה: <bdi dir="ltr">-12.50 mm</bdi>.
</p>
```

## מגדירים כיוון. שומרים על המקור.

### מגדירים כיוון מראש.

מגדירים את כיוון הפסקה לפני יצירת התצוגה. שומרים על הטקסט המקורי. משאירים קודים, קישורים וערכים מספריים ללא שינוי.

### משלבים עברית ואנגלית.

משתמשים בהגדרות הכיווניות של הפורמט כדי לשמור על סדר הקריאה של ביטויים באנגלית ומספרים עם סימן פלוס או מינוס.

### בודקים את התוצאה.

בודקים את הקובץ או היישום שבהם ישתמשו בפועל. בוחנים בנפרד את המראה, הטקסט, החיפוש וההעתקה.

## בחרו את הפורמט.

הנחיות בסיס קצרות. פירוט נוסף לפי הפורמט שבו עובדים.

- [Web ו־React](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/web.md): כיוון העמוד, טקסט מעורב, תצוגה בנייד · נבדק בדפדפן
- [Word](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/word.md): כיוון הפסקה, יישור, הגדרות גופנים · ייצוא ל־PDF נבדק
- [PowerPoint](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/powerpoint.md): טקסט ניתן לעריכה, כיוון הפסקה, גופנים · ייצוא ל־PDF נבדק
- [Excel](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/excel.md): כיוון הגיליון, תאים מספריים, טקסט מעורב · ייצוא ל־PDF נבדק
- [PDF](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/pdf.md): הטמעת גופנים, פריסת טקסט, חילוץ טקסט · תוצרי הייצוא נבדקו
- [פורמטים נוספים](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md): WPF, גרפיקה, LaTeX, טקסט פשוט, כתוביות, וידאו · לא הכול נבדק

הבדיקות נערכו על אוסף קטן של דוגמאות בעברית בסביבות המפורטות בתיעוד התאימות. לכל תוכנה וגרסה נדרשת בדיקה נפרדת. [לתוצאות הבדיקות ולמגבלות](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md)

## פרומפט אחד. כיוון טוב יותר.

בקשו מסוכן ה־AI שלכם להתקין את RTRTL ב־Codex, ב־Claude Code, ב־Antigravity או בכל סוכן תכנות אחר שתומך בסקילים. הסקיל כולל הנחיות בסיס ומדריכים לפי פורמט.

[מדריך ההתקנה](https://github.com/OriAshkenazi/RTRTL/blob/main/INSTALL.md)

Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for Hebrew and mixed Hebrew/English content.

הסקיל אינו דורש חשבון נפרד או מפתח API. ההתקנה כפופה להרשאות ולהגדרות של סוכן ה־AI שלכם. לאחר ההתקנה פעלו לפי הוראות טעינת הסקילים של סוכן ה־AI שלכם.

## שתפו מהניסיון שלכם. עזרו לנו להשתפר.

עזרו לבדוק את הסקיל בשפות הנכתבות מימין לשמאל. נשמח גם להנחיות לפורמטים נוספים, לתיקוני תצוגה ולשיפורים בתיעוד. צרפו דוגמה קטנה שאפשר לשחזר וציינו את השפה, הכתב, הגופנים וסביבת הבדיקה.

[תרומה ב־GitHub](https://github.com/OriAshkenazi/RTRTL/blob/main/CONTRIBUTING.md) · [הצעת שיפור או דיווח על תקלה](https://github.com/OriAshkenazi/RTRTL/issues/new/choose)

- פורמטים נוספים
- בדיקות תאימות לפי שפת היעד
- תיקוני תצוגה
- נגישות
- תיעוד ברור יותר

## The right to right to left

[רישיון MIT](https://github.com/OriAshkenazi/RTRTL/blob/main/LICENSE) · [קרדיטים](https://rtrtl.org/he/credits.html) · [קוד המקור](https://github.com/OriAshkenazi/RTRTL)

הזכות לכתוב בכיוון הנכון. מההתחלה.
