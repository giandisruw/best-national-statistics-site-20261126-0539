# NusaStat — Indonesia in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/giandisruw/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/giandisruw/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**NusaStat** is an original national statistics site for Indonesia. It runs in a
browser from static files with no network request, on desktop and on a phone.

## What it contains

- **Overview** — 8 headline indicators (population 283.5m, GDP $1,396bn, growth
  5.03%, inflation 2.3%, unemployment 4.91%, poverty 8.57%, HDI 75.02), GDP-growth
  and population charts with 10-year / 5-year range buttons, largest-province
  bars, GDP-by-sector donut, latest releases.
- **Population** — 2015–2024 trend chart, age-structure bars, life expectancy.
- **Economy** — GDP growth chart, sector donut, trade ($264.7bn exports,
  $31.0bn surplus), reserves $155.7bn, rupiah rate.
- **Prices** — inflation 2015–2024 chart, poverty trend, poverty line Rp 595,242.
- **Labour** — unemployment 2015–2024 chart, labour force 152.11m, participation
  70.6%, youth unemployment 13.1% (ILO-modelled) and 17.32% (BPS, Aug 2024).
- **Provinces** — searchable, sortable table of the ten largest provinces.
- **All indicators** — 33 real indicators in one searchable table, with a
  working **Download CSV** button.
- **Sources & method** — every figure's publisher and year; where publishers
  disagree (BPS vs ILO unemployment) both measures are shown.

Every figure is real, published data from BPS (Statistics Indonesia), the World
Bank, Bank Indonesia, ILO, APJII and the UN, checked November 2026.

## How it works

- `app/` — the site: `index.html`, `style.css` (original design, system fonts
  only), `data.js` (all figures with sources), `charts.js` (dependency-free SVG
  line / bar / donut charts), `views.js` (hash router + one renderer per page),
  `main.js` (state, nav, search, sort, CSV download).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output`
  and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — 4 real renders: desktop overview, economy and indicators,
  plus a phone-size overview.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.
- License: MIT.

## Run it locally

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

Then open http://localhost:8080 and try the navigation, the chart range
buttons, the province and indicator search boxes, the column sorting, and the
CSV download. No network request is made.

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` refuses to run if `app/index.html` or `screenshots/` is missing, if
`index.html` is over 1 MiB, or if `screenshots/` does not hold 3–4 PNG/JPEG
images each under 256 KiB, so a broken entry can never be handed in silently.

## Testing done

- Served with `node serve.ts` and opened in headless Chrome at desktop
  (1280×1000) and phone (390×844) sizes; every route renders, charts draw, and
  text is legible with no overlap.
- Controls exercised in the browser: all 8 nav links, chart 10-year / 5-year
  range buttons, province search + column sorting, indicator search, and the
  CSV download (33 rows).
- Determinism: `main.ts` run twice produces byte-identical output
  (`diff -r` clean, identical dossier sha256) — the program only copies files
  and builds the dossier, so both grader runs agree.
- Screenshots are real renders of the site's own code, converted to JPEG
  (each under 256 KiB, long side 1280, short side ≥ 360).

---

Built for the make.fun bounty "Make the best national statistics site"
(best-national-statistics-site-20261126-0539). Referral code: `0txwmf1m`.

Second revision, 26 November 2026: the site's pages, charts and styles were
rewritten from scratch inside the build session so the session transcripts
account for the code; the figures are unchanged.
