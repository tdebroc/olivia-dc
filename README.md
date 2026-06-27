# The Oliviata Catalog

A static website built as a fun + professional farewell tribute to **Olivia Phan**, leaving Kering after 5 years as Head of Metadata & Data Catalog. The site mimics a real Data Catalog UI — domains, marketplace, glossary, governance — and re-frames Olivia's personality and contributions through data-catalog vocabulary.

**Live site:** https://tdebroc.github.io/olivia-dc/

## Structure

Site lives in `docs/` (GitHub Pages serves from `main` branch, `/docs` folder):

- `index.html` — home: real Kering HQ photo hero (Hôpital Laennec) + global search + useful links + tribute gallery
- `marketplace.html` — Oliviata Product Marketplace: Data Catalog, Governance Foundations, Data Product Marketplace, PO Booster, Talk with Data, A Great Team
- `glossary.html` — personality traits as humorous certified terms (Elegance, Multiculturality, Hospitality, Connection, Smile, Conviction…)
- `domains.html` — data domains incl. a "personal domain" feature
- `governance.html` — policies (POL-001 Care Before Compliance, POL-002 Connect Everything, POL-003 Always Ship an Idea, POL-005 Stay Courageous Keep the Smile) + Chief Data Steward block
- `assets/style.css` — dark luxury theme, gold accents, Cormorant Garamond + Inter
- `assets/app.js` — client-side search index + easter eggs (click brand mark, type "olivia")
- `assets/kering-hero.svg` — original SVG hero, now unused, kept as fallback
- `assets/img/` — real photos (kering-hq, olivia-profile, olivia-smile, olivia-team, olivia-dinner-group, olivia-mentor, olivia-petanque)

## The speech

`speech-olivia.md` — ~6-7 min French farewell speech to deliver while navigating the site, with `[ ]` navigation cues, humor, easter-egg tips, and variantes (short / more emotional / more humorous).

## Tone constraint

Work context — religious references intentionally kept out. The original "Faith" glossary term was renamed **Conviction**.

## Source material (not in repo)

`olivia phan resume.pdf` and `pictures/` are gitignored. Resume was extracted via `pdftotext` (poppler). Photos were web-renamed and copied into `docs/assets/img/`; originals removed.

## Easter eggs

- Click the gold **O** brand mark in the top bar
- Type `olivia` anywhere on the page → "👑 Chief Data Steward mode unlocked"
- Press `/` to focus search; arrows + Enter to navigate results

## Local preview

No build step. Open `docs/index.html` directly, or:

```sh
cd docs && python3 -m http.server 8000
```

Then visit http://localhost:8000.
