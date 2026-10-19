# RTRTL — Right to RTL

**Give Hebrew the right direction, from the first draft.**

**הזכות לכתוב בכיוון הנכון.**

An open-source AI skill for readable Hebrew and mixed Hebrew/English content. A compact core teaches direction, alignment, logical Unicode order and safe LTR scopes. Format-specific adapters cover web, Office, PDF and more, loaded only when needed.

**[Explore the website](https://oriashkenazi.github.io/RTRTL/) · [Install](INSTALL.md) · [Contribute](CONTRIBUTING.md) · [Compatibility & limits](COMPATIBILITY.md)**

## Install with your AI agent

Paste into Codex:

```text
Use $skill-installer to install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl. Preserve any existing local skill edits. Verify that SKILL.md and its relative references are installed. Then use $rtrtl for Hebrew and mixed Hebrew/English content.
```

If it does not appear, start a new turn or restart Codex. For another skill-capable agent, use its configured skill directory; there is no universal installation location. See [manual installation](INSTALL.md) for an offline, standard-library Python copier that refuses to overwrite existing files. Installing the skill does not install renderer dependencies or launch Office.

## What it changes

- Write logical Unicode text and preserve exact identifiers, punctuation and typed data.
- Set paragraph direction explicitly; keep direction, alignment and fonts separate.
- Isolate whole LTR phrases and values using native format controls where supported.
- Verify the actual consumer and requested exports, with source, appearance and search/copy treated separately.

For an ordinary Hebrew reply, apply the core directly. No browsing, test corpus or application launch is needed. For artifacts, read one relevant adapter, implement direction before rendering and check the affected output. Extra formats and full-corpus reruns are reserved for real conversion or qualification work.

## Use it

```text
Use $rtrtl to write this Hebrew report as editable Word content, preserving English codes and signed quantities. Verify the requested Word/PDF output.
```

The [skill](skills/rtrtl/SKILL.md) stays framework-independent. Adapters explain HTML/React, Word, PowerPoint, Excel, PDF, native UI, graphics, LaTeX and text/subtitles. Some are tested recipes; others are guidance pending target-specific qualification. [Read the scope](COMPATIBILITY.md) before making compatibility claims.

## Verify and develop

```sh
python -m unittest discover -s tests -v
python scripts/validate.py
node --check docs/assets/app.js
node tests/test_locale.cjs
```

Optional renderer checks and dependencies are documented in [reproducible checks](skills/rtrtl/references/reproducible-checks.md). Generate only the selected format. The website is static HTML/CSS/JS in `docs/`; preview it with `python -m http.server 8765 --directory docs`. GitHub Pages publishes `main:/docs`.

The website has full English and Hebrew editions. Its initial language uses the browser’s configured time zone: Israel opens Hebrew; other time zones open English. An unavailable time zone falls back to Hebrew. A saved manual choice takes priority, and direct language links remain available. This is a local preference heuristic, not physical location detection: no location permission, geolocation API, IP lookup or third-party request is used. `?lang=en` and `?lang=he` choose explicitly, including when browser storage is blocked.

## Contributions welcome

Bring your stack, renderer fix, font guidance, clearer documentation or small reproducible test case. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [issue templates](https://github.com/OriAshkenazi/RTRTL/issues/new/choose). Report the actual environment, evidence and limitations so the next person can reproduce your result. More languages are welcome with explicit language-specific evidence; current guidance focuses on Hebrew.

Skill and website code: [MIT](LICENSE). Website fonts: SIL OFL 1.1; [credits](docs/credits.html). No private conversation history is included.
