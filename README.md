# RTRTL — Right to RTL

**Give RTL text the right direction, from the first draft.**

**הזכות לכתוב בכיוון הנכון.**

An open-source skill for **Codex, Claude Code, Antigravity and any other coding agent that supports skills**. It helps your AI agent handle right-to-left and mixed-direction text. It starts with short core instructions and adds guidance for the format you are using. Current tested guidance focuses on Hebrew.

**[Explore the website](https://rtrtl.org/) · [Install](INSTALL.md) · [Contribute](CONTRIBUTING.md) · [Compatibility & limits](COMPATIBILITY.md)**

## Install with your AI agent

Choose your coding agent in the [website’s installation section](https://rtrtl.org/?lang=en#install) for a tailored prompt, or paste this generic prompt:

```text
Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for Hebrew and mixed Hebrew/English content.
```

Use the skills directory and loading instructions for your coding agent. The [installation guide](INSTALL.md) covers Codex, Claude Code, Antigravity and other agents that support skills. See [manual installation](INSTALL.md) for an offline, standard-library Python copier that refuses to overwrite existing files. Installing the skill does not install renderer dependencies or launch Office.

## What it changes

- Write logical Unicode text and preserve exact identifiers, punctuation and typed data.
- Set paragraph direction explicitly; keep direction, alignment and fonts separate.
- Isolate whole LTR phrases and values using native format controls where supported.
- Verify directional arrows against their meaning, rendered appearance and interaction behavior.
- Verify the actual consumer and requested exports, with source, appearance and search/copy treated separately.

For an ordinary Hebrew reply, apply the core directly. No browsing, test corpus or application launch is needed. For artifacts, read one relevant adapter, implement direction before rendering and check the affected output. Extra formats and full-corpus reruns are reserved for real conversion or qualification work.

## Use it

```text
Use $rtrtl to write this Hebrew report as editable Word content, preserving English codes and signed quantities. Verify the requested Word/PDF output.
```

The [skill](skills/rtrtl/SKILL.md) stays framework-independent. Adapters explain HTML/React, Word, PowerPoint, Excel, PDF, native UI, graphics, LaTeX and text/subtitles. Some guides include tested examples; others still need checks in the target application. [Read the scope](COMPATIBILITY.md) before making compatibility claims.

## Verify and develop

```sh
python -m unittest discover -s tests -v
python scripts/validate.py
node --check docs/assets/app.js
node --check skills/rtrtl/scripts/check_browser.cjs
node tests/test_locale.cjs
node tests/test_install_prompt.cjs
node tests/test_language_picker.cjs
```

Optional renderer checks and dependencies are documented in [reproducible checks](skills/rtrtl/references/reproducible-checks.md). Generate only the selected format. The website is static HTML/CSS/JS in `docs/`; preview it with `python -m http.server 8765 --directory docs`. GitHub Pages publishes `main:/docs`.

The website has English, Hebrew and Arabic editions. Its initial language uses the browser’s configured time zone: Israel opens Hebrew; other time zones open English. An unavailable time zone falls back to Hebrew. A saved manual choice takes priority, and direct language links remain available. This is a local preference heuristic, not physical location detection: no location permission, geolocation API, IP lookup or third-party request is used. `?lang=en`, `?lang=he` and `?lang=ar` choose explicitly, including when browser storage is blocked.

## Contributions welcome

Bring your stack, renderer fix, font guidance, clearer documentation or small reproducible test case. Compatibility tests for your target RTL language are especially welcome: record its language and writing system, fonts, environment, results and limits. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [issue templates](https://github.com/OriAshkenazi/RTRTL/issues/new/choose). Report enough evidence for the next person to reproduce your result. Current tested guidance focuses on Hebrew; results do not automatically transfer to other languages.

Skill and website code: [MIT](LICENSE). Website fonts: SIL OFL 1.1; [credits](docs/credits.html).

Interactive UI strings live in `docs/assets/i18n.js`; all three editions share `app.js` and the language picker. Main page copy stays in static localized HTML so page direction and sharing metadata are available before JavaScript.
