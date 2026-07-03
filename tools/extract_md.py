#!/usr/bin/env python3
"""
extract_md.py — one-off migration helper.

Reads the legacy self-contained module pages in html-export/*.html, extracts the
embedded Markdown (the <script type="text/markdown" id="src"> block) verbatim into
content/<slug>.md, and builds content/manifest.json describing course/module order
and display labels (parsed from the legacy index.html so ordering/labels are
preserved exactly).

Run from the repo root:  python3 tools/extract_md.py
Idempotent: re-running overwrites content/*.md and content/manifest.json.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "html-export"
OUT_DIR = ROOT / "content"

MD_RE = re.compile(
    r'<script[^>]*type="text/markdown"[^>]*id="src"[^>]*>(.*?)</script>',
    re.DOTALL,
)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.DOTALL)
CRUMB_RE = re.compile(r'<span class="crumb">(.*?)</span>', re.DOTALL)

# One <section class="course"> ... </section> per course in the legacy index.
SECTION_RE = re.compile(
    r'<section class="course">\s*<h2>(.*?)</h2>(.*?)</section>',
    re.DOTALL,
)
CARD_RE = re.compile(
    r'<a class="card" href="([^"]+)">\s*'
    r'<span class="num">(.*?)</span>\s*'
    r'<span class="t">(.*?)</span>\s*</a>',
    re.DOTALL,
)


def clean(text: str) -> str:
    return html.unescape(text).strip()


def extract_markdown(path: Path) -> str:
    raw = path.read_text(encoding="utf-8")
    m = MD_RE.search(raw)
    if not m:
        raise SystemExit(f"No markdown <script id=src> found in {path.name}")
    # The markdown block is stored verbatim (only < > & of literal HTML would be
    # entity-encoded, but these pages store raw markdown, so no unescaping).
    return m.group(1).strip("\n") + "\n"


def extract_meta(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    title = TITLE_RE.search(raw)
    crumb = CRUMB_RE.search(raw)
    return {
        "title": clean(title.group(1)) if title else "",
        "crumb": clean(crumb.group(1)) if crumb else "",
    }


def course_id_from_slug(slug: str) -> str:
    # slug like "curso-1-fundamentos__modulo-01-..." or "especial__..."
    return slug.split("__", 1)[0]


def build_manifest() -> dict:
    index_html = (SRC_DIR / "index.html").read_text(encoding="utf-8")
    courses = []
    for h2, body in SECTION_RE.findall(index_html):
        modules = []
        for href, num, title in CARD_RE.findall(body):
            slug = href[:-5] if href.endswith(".html") else href
            modules.append(
                {"slug": slug, "num": clean(num), "title": clean(title)}
            )
        if not modules:
            continue
        cid = course_id_from_slug(modules[0]["slug"])
        courses.append({"id": cid, "name": clean(h2), "modules": modules})
    return {"courses": courses}


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    manifest = build_manifest()

    slugs_in_manifest = [
        m["slug"] for c in manifest["courses"] for m in c["modules"]
    ]
    written = 0
    for slug in slugs_in_manifest:
        path = SRC_DIR / f"{slug}.html"
        if not path.exists():
            raise SystemExit(f"Manifest references missing file: {path.name}")
        md = extract_markdown(path)
        meta = extract_meta(path)
        (OUT_DIR / f"{slug}.md").write_text(md, encoding="utf-8")
        # fold crumb into manifest for the module hero breadcrumb
        for c in manifest["courses"]:
            for m in c["modules"]:
                if m["slug"] == slug:
                    m["crumb"] = meta["crumb"]
        written += 1

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # sanity: every module html (except index) should be represented
    module_files = sorted(
        p.stem for p in SRC_DIR.glob("*.html") if p.stem != "index"
    )
    missing = set(module_files) - set(slugs_in_manifest)
    if missing:
        print("WARNING — module files not in manifest:", sorted(missing))

    print(f"Extracted {written} markdown files into {OUT_DIR}")
    print(f"Courses: {len(manifest['courses'])}")
    for c in manifest["courses"]:
        print(f"  {c['id']:32s} {len(c['modules'])} módulos — {c['name']}")


if __name__ == "__main__":
    main()
