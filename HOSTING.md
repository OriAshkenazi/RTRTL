# RTRTL hosting and deployment

## Architecture and current state

GitHub (`main`) remains the source of truth. Cloudflare Workers Static Assets serves only `docs/`, with no application Worker script. Wrangler is pinned in the repository and needs Node.js 22 or newer. `.github/workflows/validate.yml` runs the required checks. A successful `push` validation for `main` triggers the serialized production deployment workflow, which checks out the exact SHA from that validation run. Pull requests, including forks, never receive production credentials. Production moved to Cloudflare on 2026-10-19 after staging validation. Both `rtrtl.org` and `www.rtrtl.org` are proxied Worker custom domains; HTTPS `www` permanently redirects to the apex with path and query preserved. HTTP first redirects to HTTPS. GitHub Pages is retained temporarily as a rollback option and no longer receives domain traffic. Each production deployment runs public route, content, MIME and security-header checks, with bounded retries for edge propagation.

The staging workflow runs on pushes to `cloudflare-workers-migration`; manual dispatch also accepts a full commit SHA already pushed to this repository, runs the required checks on that exact SHA, and deploys it to `rtrtl-site-staging`. Use `https://staging.rtrtl.org` for staging; the generated `workers.dev` hostname is also available once Cloudflare activates its certificate. Both staging hostnames are excluded from search indexing by `_headers`. Custom domains are managed in Cloudflare separately from the deployment credentials. Review staging before routing production traffic.

## One-time GitHub configuration

Create protected GitHub environments named `staging` and `production`. Add a `CLOUDFLARE_API_TOKEN` secret to each environment and a `CLOUDFLARE_ACCOUNT_ID` variable to each. Use separate least-privilege API tokens scoped to the RTRTL Cloudflare account; the tokens need only the Workers deployment permissions required by Wrangler. Do not place token values in the repository, logs or local evidence. Configure environment reviewers if the repository plan supports the desired gate. Do not enable any paid service or upgrade.

Install and authenticate Wrangler locally with the official `npx wrangler login` flow when interactive access is available. For deployment, use `npm ci` and the pinned CLI. The local OAuth session is for account inspection and setup; CI uses environment secrets.

## Staging and production cutover

1. Run the repository checks and deploy the reviewed commit to staging.
2. Check all English, Hebrew and Arabic pages, credits pages, picker and language persistence, query parameters, install prompts, copy actions, fonts, MIME types, sitemap, and real 404 status.
3. Check response security headers and CSP in report-only mode. Allow the Cloudflare Web Analytics beacon in CSP only after its hostname and runtime requests are verified; then verify analytics does not change client-side locale selection.
4. Before DNS cutover, attach production Worker custom domains for `rtrtl.org` and `www.rtrtl.org`, set minimum TLS 1.2 with TLS 1.3 enabled, enforce HTTPS, and create a permanent `www` to apex redirect that preserves path and query. Add HSTS only after production HTTPS verification; do not preload.
5. Keep the existing GitHub Pages DNS values and settings in the private migration evidence. Replace only the website records during cutover; preserve MX, SPF, DKIM, DMARC and unrelated records. Keep Pages available for rollback until production is verified.
6. Enable DNSSEC and the Free Managed WAF Ruleset; leave blanket AI blocking, Bot Fight Mode, country blocks, Under Attack Mode and aggressive rate limits off. `robots.txt` allows public search and AI crawler access.
7. Add cookie-free Cloudflare Web Analytics and verify beacon delivery and locale behavior. Configure only `hello@rtrtl.org` forwarding to the already-approved destination, using Cloudflare's supported MX, SPF and DKIM records plus a suitable DMARC policy. Check for an existing SPF record before adding one. Do not enable catch-all or imply outbound sending as `hello@rtrtl.org`.
8. Verify certificates, HTTPS and www/HTTP redirects, all content and query behavior, cache freshness, security headers/CSP, DNSSEC, WAF, analytics and the rollback path. Record email routing as configured, destination-verified and delivery-tested only to the degree each has actually been checked.

## Rollback

Until production verification is complete, preserve the prior GitHub Pages custom-domain setup and its four apex A records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) plus the `www` CNAME to `oriashkenazi.github.io`. To roll back, restore those web records and the previous Pages production settings while leaving mail and unrelated DNS records untouched. Keep the Cloudflare Worker deployment available for investigation; do not remove the zone or registered domain.

## Operational controls

Workers Static Assets supplies MIME types and default browser revalidation (`Cache-Control: public, max-age=0, must-revalidate` with ETags). Keep HTML and changing JS/CSS on revalidation. Add immutable browser caching only when filenames contain a content fingerprint. Cloudflare account-level settings and dashboard-created resources must be recorded in private operational evidence, not committed as credentials.

## Verified account configuration (2026-10-19)

DNSSEC is active. Cloudflare's Free Managed WAF Ruleset and HTTP DDoS protection are active. Minimum TLS is 1.2, TLS 1.3 is enabled, encryption mode is Full (strict), and Always Use HTTPS is enabled. HSTS starts at one month with includeSubDomains and preload disabled. Keep valid HTTPS available during any rollback until cached HSTS expires.

The production-only, cookie-free Web Analytics script loaded successfully and its RUM endpoint returned HTTP 204 in a real browser. CSP is enforced after browser checks showed no violations with the policy in report-only mode. Locale selection remains client-only. Search and AI crawler policies allow access; Bot Fight Mode and catch-all email are disabled.

`hello@rtrtl.org` forwards to the owner's verified destination. MX, SPF, Cloudflare DKIM and reject-policy DMARC are configured. This establishes inbound forwarding only; delivery to the destination inbox still requires an end-to-end email test. The private operational evidence records the destination and account identifiers.

The first production deployment passed all 14 original smoke routes against committed Git blobs, including all three language pages and the real 404; the smoke checker now also covers the analytics loader. Desktop and narrow-width interactions were checked locally. Public staging passed checks on GitHub's runner; this machine's network filter blocked browsing the staging hostname. Production was accessible in the browser.
