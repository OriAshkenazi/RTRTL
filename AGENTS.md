# Working on RTRTL

RTRTL is a portable Agent Skill with an English/Hebrew/Arabic Cloudflare Workers Static Assets site.

- `skills/rtrtl/` is the standalone skill. Keep its core short; load format guides only when needed.
- `docs/` is the static website served by the `rtrtl-site` Cloudflare Worker. GitHub remains the source repository; validated pushes to `main` deploy through `.github/workflows/deploy-production.yml`.
- `src/worker.mjs` runs only for the homepage paths listed in `wrangler.jsonc` and serves their Markdown editions for `Accept: text/markdown`; everything else is a static asset. After editing a homepage or the skill, run `python scripts/build_markdown.py` and `python scripts/build_agent_skills.py`.
- Keep site assets limited to `docs/`; `docs/.assetsignore` excludes GitHub Pages marker files. Wrangler is pinned in `package.json` and `package-lock.json`; use Node.js 22 or newer for deployment.
- Staging deployments use the manual `.github/workflows/deploy-staging.yml` workflow and the `staging` GitHub environment. Never expose Cloudflare credentials to pull-request or fork workflows.
- The `docs/_headers` file holds response headers. CSP is enforced and HSTS is on without preload; check a new script, style or font source on staging before adding it to CSP.
- Cloudflare DNS, custom domains, HTTPS/TLS, DNSSEC, WAF, Web Analytics and Email Routing are account configuration; document and verify these separately from repository changes. Preserve mail records and do not alter other zones.
- Rollback: restore the prior GitHub Pages DNS records and HTTPS behavior from the migration evidence. GitHub Pages stays published as the rollback target; the repository website link points to `https://rtrtl.org/`.
- `INSTALL.md` explains agent-specific installation. Check official host documentation before changing directory or invocation advice.
- Write canonical website copy in English first, then adapt naturally into Hebrew. English describes RTL languages generally; the Hebrew problem description focuses on Hebrew.
- Use **סקיל** and **סוכן ה־AI שלכם** in Hebrew. Preserve **הזכות לכתוב בכיוון הנכון**. Isolate complete Latin names, codes and values in Hebrew markup.
- Keep locale selection client-only: no location permissions, geolocation or IP lookup. Manual language choice wins.
- A change to the skill's guidance adds its eval cases to `evals/rtrtl/` first and runs them against the old and new skill with `scripts/run_evals.sh` (see `evals/rtrtl/README.md`). Cite guidance to primary sources, never to another skill it was found in.
- Keep compatibility claims tied to actual evidence in `COMPATIBILITY.md`. Skill-format support does not prove every renderer or export works.
- Inspect `git status` before editing. Preserve other sessions' changes. Use separate worktrees when parallel edits would overlap. Commit and publish only the reviewed scope.

Run the relevant checks before publishing:

```sh
python scripts/validate.py
python -m unittest discover -s tests -v
node tests/test_locale.cjs
node tests/test_install_prompt.cjs
node tests/test_language_picker.cjs
node tests/test_worker.cjs
node --check docs/assets/app.js
node --check skills/rtrtl/scripts/check_browser.cjs
```

Check affected English/Hebrew/Arabic screens and interactions in a browser at desktop and narrow widths. For infrastructure changes, also verify staging routes, redirects, status codes, MIME types, response headers, CSP reports and cache freshness before production cutover. For ordinary copy edits, avoid Office launches and unrelated renderer suites. Keep scratch evidence outside the public repository.
