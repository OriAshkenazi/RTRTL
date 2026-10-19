# RTRTL hosting and deployment

## Target architecture and current state

GitHub (`main`) remains the source of truth. The target is Cloudflare Workers Static Assets serving only `docs/`, with no application Worker script. Wrangler is pinned in the repository and needs Node.js 22 or newer. `.github/workflows/validate.yml` runs the required checks. A successful `push` validation for `main` triggers the serialized production deployment workflow, which checks out the exact SHA from that validation run. Pull requests, including forks, never receive production credentials. The migration is not live until the staged deployment passes and DNS and account settings have been cut over and verified; until then, GitHub Pages remains production.

The manual staging workflow accepts a full commit SHA already pushed to this repository, runs the required checks on that exact SHA, and deploys it to `rtrtl-site-staging`. Use `https://staging.rtrtl.org` for staging; the generated `workers.dev` hostname is also available once Cloudflare activates its certificate. Both staging hostnames are excluded from search indexing by `_headers`. Custom domains are managed in Cloudflare separately from the deployment credentials. Review staging before routing production traffic.

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
