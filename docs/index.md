---
title: "RTRTL — Right to RTL"
description: "RTRTL — Right to RTL. An open-source RTL skill for Codex, Claude Code, Antigravity and any other coding agent that supports skills."
lang: en
dir: ltr
url: https://rtrtl.org/
---

THE CHALLENGE: READABLE RIGHT-TO-LEFT TEXT

Many languages are written from right to left. When your AI agent combines right-to-left and left-to-right text with numbers, codes and punctuation, the reading order can break. Right alignment alone does not fix text direction.

# Give RTL text the right direction.

RTRTL is an open-source skill for Codex, Claude Code, Antigravity and any other coding agent that supports skills. It helps your AI agent handle text direction from the first draft.

[Install with your AI agent](https://rtrtl.org/#install) · Free and open source. MIT licensed.

## Right alignment isn’t enough.

Alignment positions a paragraph on the page. Direction controls reading order. Fonts determine how characters appear. Mixed-direction text needs all three.

[Read the skill](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/SKILL.md)

PRJ07 — תוכנית עבודה בעברית

הפרש המדידה: -12.50 mm.

הבדיקה הושלמה (QA-17) בהצלחה.

Hebrew reads right to left. Codes and values keep their internal order. The original text is unchanged.

```html
<p lang="he" dir="rtl">
  הפרש המדידה: <bdi dir="ltr">-12.50 mm</bdi>.
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

- [Web & React](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/web.md): Page direction · mixed text · responsive layouts · Browser tested
- [Word](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/word.md): Paragraph direction · alignment · font settings · PDF export tested
- [PowerPoint](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/powerpoint.md): Editable text · paragraph direction · fonts · PDF export tested
- [Excel](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/excel.md): Sheet direction · numeric cells · mixed text · PDF export tested
- [PDF](https://github.com/OriAshkenazi/RTRTL/blob/main/skills/rtrtl/references/pdf.md): Font embedding · text layout · text extraction · PDF output reviewed
- [More formats](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md): WPF · graphics · LaTeX · plain text · subtitles · Not all tested

Tests so far use a small set of Hebrew examples in the environments listed in the compatibility notes. Other languages, apps and versions need separate checks. [View test results and limits](https://github.com/OriAshkenazi/RTRTL/blob/main/COMPATIBILITY.md)

## One prompt. A better direction.

Ask your AI agent to install RTRTL in Codex, Claude Code, Antigravity or any other coding agent that supports skills. The skill provides core instructions and extra guidance for your chosen format.

[Installation guide](https://github.com/OriAshkenazi/RTRTL/blob/main/INSTALL.md)

Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for Hebrew and mixed Hebrew/English content.

The skill needs no separate account or API key. Installation follows your AI agent’s permissions and skill-directory settings. Use your coding agent’s skill loading or reload instructions after installation.

## Bring your experience. Help RTL work everywhere.

Test RTRTL with the right-to-left language you use. Add guidance for another format, fix a rendering issue or improve the docs. Share a small reproducible example. Record the language, writing system, fonts and environment you tested.

[Contribute on GitHub](https://github.com/OriAshkenazi/RTRTL/blob/main/CONTRIBUTING.md) · [Suggest an improvement or report a bug](https://github.com/OriAshkenazi/RTRTL/issues/new/choose)

- More formats
- Language compatibility tests
- Rendering fixes
- Accessibility
- Clearer docs

Right to RTL. From the start.

[MIT license](https://github.com/OriAshkenazi/RTRTL/blob/main/LICENSE) · [Credits](https://rtrtl.org/credits.html) · [Source](https://github.com/OriAshkenazi/RTRTL)
