"""Give Material its desktop navigation layout from 768px instead of 1220px.

Material only shows the section nav as a sidebar at 1220px and up; below
that it lives in the off-canvas drawer. 768px is where our header switches
from the brand-bar hamburger to the tab row. Material's breakpoints are
fixed in its built CSS and JS, so rewrite them in the output after each
build.
fn-layout.css hides the page TOC between 768px and 1220px, and
fn-theme.js uses the same 768px breakpoint for the drawer.
"""

import logging
from pathlib import Path

log = logging.getLogger("mkdocs.hooks.material_breakpoints")

REPLACEMENTS = {
    "assets/stylesheets/main.*.min.css": [
        ("76.234375em", "47.984375em"),
        ("76.25em", "48em"),
    ],
    "assets/javascripts/bundle.*.min.js": [
        ("(min-width: 1220px)", "(min-width: 768px)"),
    ],
}


def on_post_build(config, **kwargs):
    site_dir = Path(config["site_dir"])
    for pattern, pairs in REPLACEMENTS.items():
        files = list(site_dir.glob(pattern))
        if not files:
            log.warning("No file matches %s, Material breakpoints not patched", pattern)
        for path in files:
            text = path.read_text(encoding="utf-8")
            for old, new in pairs:
                if old not in text:
                    log.warning("%s not found in %s, Material may have changed", old, path.name)
                text = text.replace(old, new)
            path.write_text(encoding="utf-8", data=text)
