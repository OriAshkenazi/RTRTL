"""Check deployed static content, security headers, and routing with verified TLS."""

import argparse
import difflib
import hashlib
from pathlib import Path
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url")
    parser.add_argument("--staging", action="store_true")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    docs = Path(__file__).resolve().parents[1] / "docs"
    opener = urllib.request.build_opener()
    paths = {
        "/?lang=en": (200, "text/html", "index.html"),
        "/he/": (200, "text/html", "he/index.html"),
        "/ar/": (200, "text/html", "ar/index.html"),
        "/he/index.html?lang=he": (200, "text/html", "he/index.html"),
        "/credits.html": (200, "text/html", "credits.html"),
        "/he/credits.html": (200, "text/html", "he/credits.html"),
        "/assets/analytics.js": (200, "javascript", "assets/analytics.js"),
        "/assets/app.js": (200, "javascript", "assets/app.js"),
        "/assets/locale.js": (200, "javascript", "assets/locale.js"),
        "/assets/i18n.js": (200, "javascript", "assets/i18n.js"),
        "/assets/style.css": (200, "text/css", "assets/style.css"),
        "/assets/fonts/NotoSansArabic.ttf": (200, "font/ttf", "assets/fonts/NotoSansArabic.ttf"),
        "/sitemap.xml": (200, "xml", "sitemap.xml"),
        "/robots.txt": (200, "text/plain", "robots.txt"),
        "/missing-rtrtl-smoke-page": (404, "text/html", "404.html"),
    }
    failures = []
    for path, (status, mime, local) in paths.items():
        try:
            try:
                request = urllib.request.Request(base + path, headers={
                    "User-Agent": "RTRTL-Deployment-Check/1.0 (+https://github.com/OriAshkenazi/RTRTL)",
                    "Accept": "*/*",
                })
                response = opener.open(request, timeout=30)
            except urllib.error.HTTPError as error:
                response = error
            with response:
                body = response.read()
                expected_body = (docs / local).read_bytes()
                # Git text checkout may use CRLF on Windows; binary fonts stay exact.
                actual_content = body if mime == "font/ttf" else body.replace(b"\r\n", b"\n")
                expected_content = expected_body if mime == "font/ttf" else expected_body.replace(b"\r\n", b"\n")
                checks = {
                    "status": response.status == status,
                    "MIME": mime in response.headers.get("Content-Type", ""),
                    "content": hashlib.sha256(actual_content).digest() == hashlib.sha256(expected_content).digest(),
                    "nosniff": response.headers.get("X-Content-Type-Options") == "nosniff",
                    "frame protection": response.headers.get("X-Frame-Options") == "DENY",
                    "CSP": bool(response.headers.get("Content-Security-Policy-Report-Only") or response.headers.get("Content-Security-Policy")),
                }
                if args.staging:
                    checks["noindex"] = "noindex" in response.headers.get("X-Robots-Tag", "")
                else:
                    checks["indexable"] = "noindex" not in response.headers.get("X-Robots-Tag", "")
                failed = [key for key, passed in checks.items() if not passed]
                if failed:
                    failures.append(f"{path}: {', '.join(failed)}")
                    if "content" in failed and mime == "text/html":
                        expected_lines = (docs / local).read_text(encoding="utf-8").splitlines()
                        actual_lines = body.decode("utf-8", errors="replace").splitlines()
                        difference = "\n".join(difflib.unified_diff(expected_lines, actual_lines, n=0))
                        print(f"HTML difference: {difference[:1800]}", flush=True)
                    if response.status != status:
                        print(f"Unexpected response: server={response.headers.get('Server')}, ray={response.headers.get('CF-Ray')}, body={body[:200]!r}", flush=True)
                print(f"{response.status} {path}: {'FAIL ' + ', '.join(failed) if failed else 'PASS'}", flush=True)
        except Exception as error:
            failures.append(f"{path}: {type(error).__name__}: {error}")
            print(f"FAIL {path}: {error}", flush=True)
    if failures:
        raise SystemExit("Deployment verification failed:\n" + "\n".join(failures))
    print(f"Verified {len(paths)} deployed routes and file contents (text line endings normalized).")


if __name__ == "__main__":
    main()
