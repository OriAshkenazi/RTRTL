# Working on RTRTL

RTRTL is a portable Agent Skill with an English/Hebrew GitHub Pages site.

- `skills/rtrtl/` is the standalone skill. Keep its core short; load format guides only when needed.
- `docs/` is the static website. `main:/docs` deploys to GitHub Pages.
- `INSTALL.md` explains agent-specific installation. Check official host documentation before changing directory or invocation advice.
- Write canonical website copy in English first, then adapt naturally into Hebrew. English describes RTL languages generally; the Hebrew problem description focuses on Hebrew.
- Use **סקיל** and **סוכן ה־AI שלכם** in Hebrew. Preserve **הזכות לכתוב בכיוון הנכון**. Isolate complete Latin names, codes and values in Hebrew markup.
- Keep locale selection client-only: no location permissions, geolocation or IP lookup. Manual language choice wins.
- Keep compatibility claims tied to actual evidence in `COMPATIBILITY.md`. Skill-format support does not prove every renderer or export works.
- Inspect `git status` before editing. Preserve other sessions' changes. Use separate worktrees when parallel edits would overlap. Commit and publish only the reviewed scope.

Run the relevant checks before publishing:

```sh
python scripts/validate.py
python -m unittest discover -s tests -v
node tests/test_locale.cjs
node tests/test_install_prompt.cjs
node --check docs/assets/app.js
node --check skills/rtrtl/scripts/check_browser.cjs
```

Check affected English/Hebrew screens and interactions in a browser at desktop and narrow widths. For ordinary copy edits, avoid Office launches and unrelated renderer suites. Keep scratch evidence outside the public repository.
