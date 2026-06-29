# AGENTS.md

Guidance for AI coding agents (Copilot, Claude, Cursor, etc.) working in this
repository. Read this before making any change.

## Project overview

Ticketz PRO Docs is the static, multilingual documentation site published at
<https://doc.ticketz.pro>. It documents Ticketz PRO integrations, setup, billing,
and infrastructure guides.

- **Stack:** Jekyll (Kramdown + GFM) deployed through GitHub Pages.
- **Languages:** English (`en/`), Portuguese-BR (`pt-br/`), Spanish (`es/`).
  Every content page exists in all three languages and must be kept in sync.
- **Custom domain:** `doc.ticketz.pro` (see `CNAME`).
- **No build step is required locally** — GitHub Pages builds the site from the
  default branch root. There is no `package.json`, no bundler, no test suite.

## Repository layout

```
_config.yml              Jekyll configuration (title, permalink, defaults)
CNAME                    Custom domain for GitHub Pages
index.html               Language-detection landing page (redirects via JS)
README.md                Project overview and publish instructions
AGENTS.md                This file
_layouts/
  default.html           Single shared layout: sidebar nav, language switcher
assets/
  css/site.css           Site stylesheet (design tokens at :root)
  js/i18n-redirect.js    Browser-language redirect used by index.html
  examples/              Locally hosted example files (.env templates, n8n/Typebot JSON)
en/                      English content (Markdown)
pt-br/                   Portuguese (Brazil) content (Markdown)
es/                      Spanish content (Markdown)
```

Each language folder mirrors the same set of pages: `index.md` (home),
`overview.md`, `webchat.md`, `typebot-integration.md`, `expansion-variables.md`,
`integration-triggers.md`, `typebot-setup.md`, `backblaze.md`, `quickpix.md`,
`server-cluster.md`, `sidekick.md`, `whmcs.md`, `examples.md`.

## Front matter conventions

Every Markdown page must start with YAML front matter:

```yaml
---
title: Page Title            # Shown in the topbar <h1> and <title>
lang: en                     # One of: en, pt-br, es
slug: overview               # Matches the filename (without .md); used for active nav state
description: Short SEO blurb  # Falls back to site.description
---
```

- `slug` must match the filename so the sidebar highlights the active page.
- `lang` drives the sidebar labels, footer text, and language switcher state in
  `_layouts/default.html`.

## Editing rules

### 1. Keep all three languages in sync

A documentation change is **not complete** until it is applied to `en/`,
`pt-br/`, and `es/`. Do not edit one language alone unless explicitly asked.

- Translate content faithfully — do not silently drop sections, code blocks, or
  warnings between language versions.
- Preserve the same heading structure and ordering across translations so the
  sidebar and language switcher stay consistent.

### 2. Navigation lives in the layout, not in pages

The sidebar is hard-coded per language inside `_layouts/default.html`. When you
add or rename a page:

1. Create the `.md` file in **all three** language folders with matching `slug`.
2. Add the corresponding `<a>` entry in **all three** language branches of
   `_layouts/default.html` (`pt-br`, `es`, and the `else`/English branch).
3. Keep the order consistent across the three branches.

### 3. Links use Jekyll filters, not hard-coded URLs

Use the `relative_url` filter so links work with the custom domain and any
base path:

```liquid
[Text]({{ '/en/overview/' | relative_url }})
```

Never paste raw `https://doc.ticketz.pro/...` links inside content — they break
local previews and base path changes.

### 4. Example files are served locally

Example assets live under `assets/examples/` and are linked from each language's
`examples.md`. Do **not** replace local links with `raw.githubusercontent.com`
URLs — the whole point (per `README.md` and the footer note) is to avoid GitHub
raw rate limits. When adding a new example file:

1. Drop the file into `assets/examples/`.
2. Add a link entry in `en/examples.md`, `pt-br/examples.md`, and `es/examples.md`.
3. URL-encode spaces in the Liquid `relative_url` (e.g.
   `{{ '/assets/examples/Ticketz%20PRO%20Smart%20Reception%20(n8n).json' | relative_url }}`).

### 5. Styling and HTML in Markdown

- Kramdown with GFM input is enabled (`_config.yml`), so fenced code blocks and
  GitHub-flavored Markdown work as expected.
- Custom HTML components (`.hero-grid`, `.hero-card`, `.info-card`,
  `.card-grid`, `.download-note`, etc.) are defined in `assets/css/site.css`
  and may be embedded directly in Markdown. Reuse existing classes before
  inventing new ones; if you add a new class, update `site.css` and keep the
  design tokens (`:root` variables) consistent.
- Do not introduce external CSS/JS frameworks. The site is intentionally
  dependency-free.

### 6. The landing redirect

`index.html` is a standalone page (`layout: null`) whose only job is to redirect
visitors to the right language via `assets/js/i18n-redirect.js`. Only touch it
to adjust redirect logic or the fallback language list — never add content here.

## Local preview

There is no package script. To preview locally, use Jekyll directly (requires
Ruby + the `github-pages` gem):

```bash
bundle exec jekyll serve
# then open http://127.0.0.1:4000
```

If Bundler is not set up, a plain `jekyll serve` works in most environments.
The site has no tests or linters — verify changes by loading the pages in a
browser and switching between EN / PT / ES using the topbar switcher.

## Publishing

Publishing is handled by GitHub Pages from the default branch root; there is no
manual build step. See `README.md` for the deploy checklist (copy contents to
the target repo root, enable Pages, set the custom domain to `doc.ticketz.pro`).

## Do not

- Do not add `package.json`, bundlers, or build tooling — the site must stay
  buildable by stock GitHub Pages.
- Do not introduce raw GitHub URLs for example files.
- Do not edit a single language version and leave the others stale.
- Do not change `_config.yml`'s `url`/`baseurl` without coordinating the custom
  domain setup — it breaks canonical URLs and the redirect.
- Do not add new top-level folders; new content goes into the existing
  `en/`, `pt-br/`, `es/`, and `assets/` structure.