// Shared interactive UI translations. Page copy remains in localized static HTML.
'use strict';
const RTRTL_I18N = Object.freeze({
  en: {
    demoLanguage: 'ar', measurementLabel: 'فرق القياس: ',
    rtlNote: 'Arabic reads right to left. Codes and values keep their internal order. The original text is unchanged.',
    alignmentNote: 'The paragraph is aligned right, but its direction is left to right. Compare the heading and punctuation.',
    copySuccess: 'Copied. Paste into your AI agent’s chat.',
    copyFallback: 'Copy the selected prompt manually.', otherAgent: 'Other agent',
    usage: 'Then use {skill} for an Arabic and mixed Arabic/English compatibility check. Report any unverified behavior.'
  },
  he: {
    demoLanguage: 'he', measurementLabel: 'הפרש המדידה: ',
    rtlNote: 'העברית נקראת מימין לשמאל והקודים והערכים שומרים על הסדר הפנימי שלהם. טקסט המקור אינו משתנה.',
    alignmentNote: 'הפסקה מיושרת לימין, אך כיוונה מוגדר משמאל לימין. השוו את הכותרת ואת סימני הפיסוק.',
    copySuccess: 'הועתק. הדביקו בשיחה עם סוכן ה־AI שלכם.',
    copyFallback: 'העתיקו ידנית את הפרומפט המסומן.', otherAgent: 'סוכן אחר',
    usage: 'Then use {skill} for Hebrew and mixed Hebrew/English content.'
  },
  ar: {
    demoLanguage: 'ar', measurementLabel: 'فرق القياس: ',
    rtlNote: 'تُقرأ العربية من اليمين إلى اليسار، وتحتفظ الرموز والقيم بترتيبها الداخلي. يظل النص الأصلي دون تغيير.',
    alignmentNote: 'تُحاذى الفقرة إلى اليمين، لكن اتجاهها مضبوط من اليسار إلى اليمين. قارنوا العنوان وعلامات الترقيم.',
    copySuccess: 'تم النسخ. ألصقوا التعليمة في محادثتكم مع وكيل الذكاء الاصطناعي.',
    copyFallback: 'انسخوا التعليمة المحددة يدويًا.', otherAgent: 'وكيل آخر',
    usage: 'Then use {skill} for an Arabic and mixed Arabic/English compatibility check. Report any unverified behavior.'
  }
});
