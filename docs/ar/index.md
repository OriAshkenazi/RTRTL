---
title: "الحق في الكتابة بالاتجاه الصحيح"
description: "الحق في الكتابة بالاتجاه الصحيح. مهارة مفتوحة المصدر تساعد وكيل الذكاء الاصطناعي على التعامل مع النصوص من اليمين إلى اليسار والنصوص المختلطة بوضوح منذ المسودة الأولى."
lang: ar
dir: rtl
url: https://rtrtl.org/ar/
---

الاتجاه الصحيح، منذ المسودة الأولى

# الحق في الكتابة بالاتجاه الصحيح.

مهارة مفتوحة المصدر تساعد وكيل الذكاء الاصطناعي على كتابة نصوص عربية ومختلطة واضحة منذ المسودة الأولى.

[ثبّتوا RTRTL](https://rtrtl.org/ar/#install) · مجانية · مفتوحة المصدر · MIT

كما يقرؤه قرّاؤكم

قفزات القارئ إلى الوراء **0**

## المحاذاة إلى اليمين لا تكفي.

تحدد المحاذاة موضع الفقرة على الصفحة. ويحدد الاتجاه ترتيب القراءة. أما الخط فيحدد شكل الحروف. يحتاج النص المختلط الاتجاهات إلى العناصر الثلاثة.

[اقرؤوا المهارة](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/SKILL.md)

PRJ07: خطة عمل باللغة العربية

فرق القياس: -12.50 mm.

اكتمل الفحص (QA-17) بنجاح.

تُقرأ العربية من اليمين إلى اليسار، وتحتفظ الرموز والقيم بترتيبها الداخلي. يظل النص الأصلي دون تغيير.

```html
<p lang="ar" dir="rtl">
  فرق القياس: <bdi dir="ltr">-12.50 mm</bdi>.
</p>
```

## حدّدوا الاتجاه. حافظوا على النص.

### حدّدوا الاتجاه أولاً.

اختاروا اتجاه الفقرة قبل عرضها. حافظوا على النص الأصلي وعلى الرموز والروابط والقيم الرقمية.

### تعاملوا مع النص المختلط.

استخدموا إعدادات الاتجاه المضمّنة في الصيغة للحفاظ على ترتيب قراءة العبارات الإنجليزية والقيم التي تحمل إشارة زائد أو ناقص.

### تحققوا من النتيجة النهائية.

افحصوا التطبيق أو الملف الذي سيستخدمه جمهوركم. راجعوا التنسيق والنص الأصلي، واختبروا البحث والنسخ كلّاً على حدة.

## اختاروا الصيغة.

دليل أساسي موجز. وتفاصيل إضافية للصيغة التي تستخدمونها.

- [Web وReact](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/web.md): اتجاه الصفحة · النص المختلط · التخطيطات المتجاوبة · اختُبر في المتصفح
- [Word](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/word.md): اتجاه الفقرة · المحاذاة · إعدادات الخطوط · اختُبر التصدير إلى PDF
- [PowerPoint](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/powerpoint.md): نص قابل للتحرير · اتجاه الفقرة · الخطوط · اختُبر التصدير إلى PDF
- [Excel](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/excel.md): اتجاه الورقة · الخلايا الرقمية · النص المختلط · اختُبر التصدير إلى PDF
- [PDF](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/pdf.md): تضمين الخطوط · تخطيط النص · استخراج النص · رُوجع إخراج PDF
- [صيغ أخرى](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md): WPF · الرسوميات · LaTeX · النص العادي · الترجمة النصية · لم تُختبر كلها

أُجريت الاختبارات حتى الآن على مجموعة صغيرة من أمثلة اللغة العبرية في البيئات المذكورة في ملاحظات التوافق. تتطلب اللغات والتطبيقات والإصدارات الأخرى اختبارات منفصلة. [اطّلعوا على نتائج الاختبارات وحدودها](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md)

## طلب واحد. اتجاه أفضل.

اطلبوا من وكيل الذكاء الاصطناعي تثبيت RTRTL في Codex أو Claude Code أو Antigravity أو أي وكيل برمجة آخر يدعم المهارات. توفر المهارة إرشادات أساسية وتفاصيل إضافية للصيغة التي تختارونها.

[دليل التثبيت](https://github.com/OriAshkenazi/RTRTL/blob/main/INSTALL.md)

Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for an Arabic and mixed Arabic/English compatibility check. Report any unverified behavior.

لا تتطلب المهارة حساباً منفصلاً أو مفتاح API. يخضع التثبيت لصلاحيات وكيل الذكاء الاصطناعي وإعدادات مجلد المهارات لديه. بعد التثبيت، اتبعوا تعليمات وكيلكم لتحميل المهارة أو إعادة تحميلها.

## شاركوا خبرتكم. ساعدونا على التحسّن.

اختبروا RTRTL باللغة التي تستخدمونها وتُكتب من اليمين إلى اليسار. أضيفوا إرشادات لصيغة أخرى، أو أصلحوا مشكلة في العرض، أو حسّنوا الوثائق. شاركوا مثالاً صغيراً قابلاً لإعادة الإنتاج، وسجّلوا اللغة ونظام الكتابة والخطوط والبيئة التي اختبرتموها.

[ساهموا على GitHub](https://github.com/OriAshkenazi/RTRTL/blob/main/CONTRIBUTING.md) · [اقترحوا تحسيناً أو أبلغوا عن خطأ](https://github.com/OriAshkenazi/RTRTL/issues/new/choose)

- صيغ إضافية
- اختبارات توافق اللغات
- إصلاحات العرض
- إمكانية الوصول
- وثائق أوضح

## The right to right to left

[ترخيص MIT](https://github.com/OriAshkenazi/RTRTL/blob/main/LICENSE) · [اعتمادات الموقع بالعبرية](https://rtrtl.org/he/credits.html) · [المصدر](https://github.com/OriAshkenazi/RTRTL)

الحق في الكتابة بالاتجاه الصحيح. منذ البداية.
