---
title: "RTRTL: Right to RTL"
description: "RTRTL: Right to RTL. An open-source RTL skill for Codex, Claude Code, Antigravity and any other coding agent that supports skills."
lang: en
dir: ltr
url: https://rtrtl.org/
---

RTL AND MIXED-DIRECTION TEXT

# Right to left, right from the first draft.

An open-source skill that teaches your AI agent to write right-to-left and mixed-direction text the way its readers read it.

[Install RTRTL](https://rtrtl.org/#install) · Free · Open source · MIT

As your readers read it

Reader backtracks **0**

## Right alignment isn’t enough.

Alignment positions a paragraph on the page. Direction controls reading order. Fonts determine how characters appear. Mixed-direction text needs all three.

[Read the skill](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/SKILL.md)

PRJ07: خطة عمل باللغة العربية

فرق القياس: -12.50 mm.

اكتمل الفحص (QA-17) بنجاح.

Arabic reads right to left. Codes and values keep their internal order. The original text is unchanged.

```html
<p lang="ar" dir="rtl">
  فرق القياس: <bdi dir="ltr">-12.50 mm</bdi>.
</p>
```

## Set the direction. Preserve the text.

### Set direction first.

Choose paragraph direction before rendering. Preserve the original text and keep codes, links and numeric values intact.

### Handle mixed text.

Use the format’s built-in direction controls to keep left-to-right phrases and signed values readable.

### Check the final output.

Inspect the app or file your audience will use. Check the layout and underlying text. Test search and copy behavior separately.

## Find your format.

One short core guide. Extra detail for the format you use.

- [Web & React](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/web.md): Page direction, mixed text, responsive layouts · Browser tested
- [Word](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/word.md): Paragraph direction, alignment, font settings · PDF export tested
- [PowerPoint](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/powerpoint.md): Editable text, paragraph direction, fonts · PDF export tested
- [Excel](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/excel.md): Sheet direction, numeric cells, mixed text · PDF export tested
- [PDF](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/pdf.md): Font embedding, text layout, text extraction · PDF output reviewed
- [More formats](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md): WPF, graphics, LaTeX, plain text, subtitles, video · Not all tested

Tests so far use a small set of Hebrew examples in the environments listed in the compatibility notes. Other languages, apps and versions need separate checks. [View test results and limits](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md)

## One prompt. A better direction.

Ask your AI agent to install RTRTL in Codex, Claude Code, Antigravity or any other coding agent that supports skills. The skill provides core instructions and extra guidance for your chosen format.

[Installation guide](https://github.com/OriAshkenazi/RTRTL/blob/main/INSTALL.md)

Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for Arabic and mixed Arabic/English content.

The skill needs no separate account or API key. Installation follows your AI agent’s permissions and skill-directory settings. Use your coding agent’s skill loading or reload instructions after installation.

## Bring your experience. Help RTL work everywhere.

Test RTRTL with the right-to-left language you use. Add guidance for another format, fix a rendering issue or improve the docs. Share a small reproducible example. Record the language, writing system, fonts and environment you tested.

[Contribute on GitHub](https://github.com/OriAshkenazi/RTRTL/blob/main/CONTRIBUTING.md) · [Suggest an improvement or report a bug](https://github.com/OriAshkenazi/RTRTL/issues/new/choose)

- More formats
- Language compatibility tests
- Rendering fixes
- Accessibility
- Clearer docs

## The right to right to left

[MIT license](https://github.com/OriAshkenazi/RTRTL/blob/main/LICENSE) · [Credits](https://rtrtl.org/credits.html) · [Source](https://github.com/OriAshkenazi/RTRTL)

Right to RTL. From the start.
