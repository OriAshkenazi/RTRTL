"""Check deployed static content, security headers, and routing with verified TLS."""

import argparse
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
                response = opener.open(base + path, timeout=30)
            except urllib.error.HTTPError as error:
                response = error
            with response:
                body = response.read()
                checks = {
                    "status": response.status == status,
                    "MIME": mime in response.headers.get("Content-Type", ""),
                    "content": hashlib.sha256(body).digest() == hashlib.sha256((docs / local).read_bytes()).digest(),
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
                    if response.status != status:
                        print(f"Unexpected response: server={response.headers.get('Server')}, ray={response.headers.get('CF-Ray')}, body={body[:200]!r}", flush=True)
                print(f"{response.status} {path}: {'FAIL ' + ', '.join(failed) if failed else 'PASS'}", flush=True)
        except Exception as error:
            failures.append(f"{path}: {type(error).__name__}: {error}")
            print(f"FAIL {path}: {error}", flush=True)
    if failures:
        raise SystemExit("Deployment verification failed:\n" + "\n".join(failures))
    print(f"Verified {len(paths)} deployed routes and exact file contents.")


if __name__ == "__main__":
    main()
