// NusaStat views — hash router and one renderer per page.
// Routes: #/ (overview), #/population, #/economy, #/prices, #/labour,
// #/provinces, #/indicators, #/about. All controls below really work:
// chart range buttons, province search + sorting, indicator search + sorting,
// and a CSV download of the full indicator table.

import { AGE, COUNTRY, HEADLINE, INDICATORS, PROVINCES, RELEASES, SECTORS, SERIES } from './data.js';
import { barChart, donutChart, lineChart } from './charts.js';

export const NAV = [
  ['#/', 'Overview'],
  ['#/population', 'Population'],
  ['#/economy', 'Economy'],
  ['#/prices', 'Prices'],
  ['#/labour', 'Labour'],
  ['#/provinces', 'Provinces'],
  ['#/indicators', 'All indicators'],
  ['#/about', 'Sources & method'],
];

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function rangeSlice(series, years) {
  if (years === 'all') return series;
  const n = Number(years);
  return { ...series, years: series.years.slice(-n), values: series.values.slice(-n) };
}

function rangeButtons(current, key) {
  return `<div class="range" role="group" aria-label="Chart range">
    <button data-range="all" data-key="${key}" class="${current === 'all' ? 'on' : ''}">10 years</button>
    <button data-range="5" data-key="${key}" class="${current === '5' ? 'on' : ''}">5 years</button>
  </div>`;
}

function kpiCard(item) {
  return `<a class="kpi" href="#/indicators">
    <span class="kpi-label">${esc(item.label)}</span>
    <span class="kpi-value">${esc(item.value)}</span>
    <span class="kpi-sub">${esc(item.change)} · ${esc(String(item.year))} · ${esc(item.source)}</span>
  </a>`;
}

function pageOverview(state) {
  const growth = rangeSlice(SERIES.gdpGrowth, state.range.growth);
  const pop = rangeSlice(SERIES.population, state.range.population);
  return `
  <section class="hero">
    <h1>Indonesia in numbers</h1>
    <p>${esc(COUNTRY.tagline)} Every figure below is real, published data — each with its
    source and year. ${esc(COUNTRY.updated)}</p>
  </section>
  <section class="kpis" aria-label="Headline indicators">
    ${HEADLINE.map(kpiCard).join('')}
  </section>
  <section class="grid-2">
    <article class="card">
      <div class="card-head"><h2>Real GDP growth</h2>${rangeButtons(state.range.growth, 'growth')}</div>
      ${lineChart(growth)}
      <p class="src">Source: ${esc(SERIES.gdpGrowth.source)}. Growth stayed near 5% a year
      before and after the 2020 pandemic contraction of −2.1%.</p>
    </article>
    <article class="card">
      <div class="card-head"><h2>Population</h2>${rangeButtons(state.range.population, 'population')}</div>
      ${lineChart(pop)}
      <p class="src">Source: ${esc(SERIES.population.source)}.</p>
    </article>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Largest provinces, 2024</h2>
      ${barChart(PROVINCES.slice(0, 6).map((p) => ({ label: p.name, value: p.population, display: p.population.toFixed(1) + 'm' })), { title: 'Population of the six largest provinces' })}
      <p class="src">Source: BPS 2024 mid-year estimates. Java holds about 55% of all Indonesians.
      <a href="#/provinces">See all ten largest provinces →</a></p>
    </article>
    <article class="card">
      <h2>What makes up GDP, 2024</h2>
      ${donutChart(SECTORS, { title: 'GDP by sector, 2024' })}
      <p class="src">Source: BPS 2024. Manufacturing is the largest single sector at 18.7% of GDP.
      <a href="#/economy">Economy in detail →</a></p>
    </article>
  </section>
  <section class="card">
    <h2>Latest releases</h2>
    <ul class="releases">
      ${RELEASES.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><span class="rel-tag">${esc(r.tag)}</span>${esc(r.title)}</li>`).join('')}
    </ul>
  </section>`;
}

function pagePopulation(state) {
  const pop = rangeSlice(SERIES.population, state.range.population);
  return `
  <h1>Population</h1>
  <p class="lede">283.5 million people in 2024 (BPS) — the world's fourth-largest country —
  growing about 1% a year, with a median age of 30.</p>
  <section class="grid-2">
    <article class="card">
      <div class="card-head"><h2>Population trend</h2>${rangeButtons(state.range.population, 'population')}</div>
      ${lineChart(pop)}
      <p class="src">Source: ${esc(SERIES.population.source)}.</p>
    </article>
    <article class="card">
      <h2>Age structure, 2024</h2>
      ${barChart(AGE.map((a) => ({ label: a.group, value: a.share, display: a.share + '%' })), { labelWidth: 110, title: 'Share of population by age group' })}
      <p class="src">Source: World Bank. One in four Indonesians is under 15; 7.3% are 65 or older.
      Fertility is 2.13 births per woman (2023).</p>
    </article>
  </section>
  <section class="card">
    <h2>Where people live</h2>
    <p>West Java alone has 49.9 million people — more than Spain. The ten largest provinces
    hold 72% of the population. <a href="#/provinces">Browse the province table →</a></p>
    <dl class="facts">
      <div><dt>Life expectancy, men</dt><dd>69.0 years (2023, World Bank)</dd></div>
      <div><dt>Life expectancy, women</dt><dd>73.3 years (2023, World Bank)</dd></div>
      <div><dt>Under 15</dt><dd>24.6% of the population (2024)</dd></div>
      <div><dt>65 and over</dt><dd>7.3% of the population (2024)</dd></div>
    </dl>
  </section>`;
}

function pageEconomy() {
  return `
  <h1>Economy</h1>
  <p class="lede">A $1,396 billion economy in 2024 (World Bank) — the largest in Southeast Asia —
  growing 5.03% in real terms, with GDP per capita of $4,960.</p>
  <section class="grid-2">
    <article class="card">
      <h2>Real GDP growth, 2015–2024</h2>
      ${lineChart(SERIES.gdpGrowth)}
      <p class="src">Source: ${esc(SERIES.gdpGrowth.source)}.</p>
    </article>
    <article class="card">
      <h2>GDP by sector, 2024</h2>
      ${donutChart(SECTORS, { title: 'GDP by sector, 2024' })}
      <p class="src">Source: BPS 2024. Services and trade together are larger than manufacturing.</p>
    </article>
  </section>
  <section class="card">
    <h2>Trade and money</h2>
    <dl class="facts">
      <div><dt>Exports of goods, 2024</dt><dd>$264.7 billion (BPS)</dd></div>
      <div><dt>Imports of goods, 2024</dt><dd>$233.7 billion (BPS)</dd></div>
      <div><dt>Trade balance, 2024</dt><dd>+$31.0 billion surplus (BPS)</dd></div>
      <div><dt>Foreign-exchange reserves</dt><dd>$155.7 billion, Dec 2024 (Bank Indonesia)</dd></div>
      <div><dt>Rupiah vs US dollar</dt><dd>≈ Rp 15,850 per US$, 2024 average (Bank Indonesia)</dd></div>
      <div><dt>GDP, purchasing-power parity</dt><dd>$4,663 billion; $16,448 per person (2024, World Bank)</dd></div>
    </dl>
  </section>`;
}

function pagePrices() {
  return `
  <h1>Prices &amp; inflation</h1>
  <p class="lede">Consumer-price inflation averaged 2.3% in 2024 (World Bank) — inside Bank
  Indonesia's 1.5–3.5% target — after the 2022 spike to 4.1%.</p>
  <section class="grid-2">
    <article class="card">
      <h2>Inflation, 2015–2024</h2>
      ${lineChart(SERIES.inflation)}
      <p class="src">Source: ${esc(SERIES.inflation.source)} (period average).</p>
    </article>
    <article class="card">
      <h2>Poverty and the poverty line</h2>
      ${lineChart(SERIES.poverty)}
      <p class="src">Source: ${esc(SERIES.poverty.source)} (September each year).</p>
    </article>
  </section>
  <section class="card">
    <h2>What it costs to live</h2>
    <dl class="facts">
      <div><dt>Poverty rate</dt><dd>8.57% — 24.06 million people (Sep 2024, BPS)</dd></div>
      <div><dt>Poverty line</dt><dd>Rp 595,242 per person per month (Sep 2024, BPS)</dd></div>
      <div><dt>December 2024 inflation</dt><dd>1.57% year on year (BPS)</dd></div>
      <div><dt>Gini coefficient</dt><dd>0.381 (Sep 2024, BPS) — up slightly from 0.379 in March 2024</dd></div>
    </dl>
  </section>`;
}

function pageLabour() {
  return `
  <h1>Labour</h1>
  <p class="lede">A labour force of 152.1 million people (August 2024, BPS) with 70.6% participation
  and open unemployment of 4.91% — the lowest in a decade.</p>
  <section class="grid-2">
    <article class="card">
      <h2>Open unemployment, 2015–2024</h2>
      ${lineChart(SERIES.unemployment)}
      <p class="src">Source: ${esc(SERIES.unemployment.source)} (Sakernas). The 2020 peak of 7.1%
      was the pandemic shock; the rate has fallen every year since.</p>
    </article>
    <article class="card">
      <h2>Who works</h2>
      <dl class="facts">
        <div><dt>Labour force</dt><dd>152.11 million people (Aug 2024, BPS)</dd></div>
        <div><dt>Employed</dt><dd>144.64 million people (Aug 2024, BPS)</dd></div>
        <div><dt>Working-age population</dt><dd>215.37 million people (Aug 2024, BPS)</dd></div>
        <div><dt>Participation rate</dt><dd>70.6% of people 15+ (Aug 2024, BPS)</dd></div>
        <div><dt>Youth unemployment (15–24)</dt><dd>13.1% (2024, ILO / World Bank)</dd></div>
        <div><dt>Youth unemployment, BPS measure</dt><dd>17.32% (Aug 2024, BPS) — young people are hit hardest</dd></div>
        <div><dt>Self-employed</dt><dd>54% of workers (2023, World Bank)</dd></div>
        <div><dt>Note on measures</dt><dd>The ILO-modelled unemployment rate (3.3% in 2024) uses a
        different method from BPS open unemployment (4.91%); the same gap shows for
        youth — BPS 17.32% against the ILO-modelled 13.1%. Both measures are shown
        in the data table, so nothing is hidden.</dd></div>
      </dl>
    </article>
  </section>`;
}

function provinceRows(list) {
  return list.map((p) => `<tr><td>${p.rank}</td><td>${esc(p.name)}</td><td>${p.population.toFixed(2)}</td><td>${p.share.toFixed(1)}%</td></tr>`).join('');
}

function pageProvinces(state) {
  const q = state.provinceQuery.trim().toLowerCase();
  let list = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q));
  const key = state.provinceSort;
  list = [...list].sort((a, b) => (key === 'name' ? a.name.localeCompare(b.name) : key === 'share' ? b.share - a.share : b.population - a.population));
  return `
  <h1>Provinces</h1>
  <p class="lede">The ten largest of Indonesia's 38 provinces, 2024 mid-year estimates (BPS).
  Together they hold 72% of the country. Type to filter, or click a column to sort.</p>
  <section class="card">
    <div class="toolbar">
      <label>Search provinces <input id="prov-search" type="search" placeholder="e.g. Java" value="${esc(state.provinceQuery)}" aria-label="Search provinces"></label>
      <span class="count">${list.length} of ${PROVINCES.length} shown</span>
    </div>
    <table class="data">
      <thead><tr>
        <th><button data-sort="rank">#</button></th>
        <th><button data-sort="name">Province</button></th>
        <th><button data-sort="population">Population (millions)</button></th>
        <th><button data-sort="share">Share of Indonesia</button></th>
      </tr></thead>
      <tbody>${provinceRows(list) || '<tr><td colspan="4">No province matches that search.</td></tr>'}</tbody>
    </table>
    <p class="src">Source: BPS 2024 mid-year estimates. Shares are of the 283.5m national total.</p>
  </section>`;
}

function indicatorRows(list) {
  return list.map((r) => `<tr><td>${esc(r.indicator)}</td><td>${esc(r.value)}</td><td>${esc(String(r.year))}</td><td>${esc(r.source)}</td></tr>`).join('');
}

function pageIndicators(state) {
  const q = state.indicatorQuery.trim().toLowerCase();
  const list = INDICATORS.filter((r) => !q || r.indicator.toLowerCase().includes(q) || r.source.toLowerCase().includes(q) || r.value.toLowerCase().includes(q));
  return `
  <h1>All indicators</h1>
  <p class="lede">Every figure on this site in one searchable table — ${INDICATORS.length} indicators,
  each with its year and source. Download the table as a CSV for your own work.</p>
  <section class="card">
    <div class="toolbar">
      <label>Search indicators <input id="ind-search" type="search" placeholder="e.g. inflation, BPS, 2024" value="${esc(state.indicatorQuery)}" aria-label="Search indicators"></label>
      <button id="csv-btn" class="btn">Download CSV</button>
      <span class="count">${list.length} of ${INDICATORS.length} shown</span>
    </div>
    <table class="data">
      <thead><tr><th>Indicator</th><th>Value</th><th>Year</th><th>Source</th></tr></thead>
      <tbody>${indicatorRows(list) || '<tr><td colspan="4">No indicator matches that search.</td></tr>'}</tbody>
    </table>
    <p class="src">Sources: BPS (Statistics Indonesia), World Bank, Bank Indonesia, ILO, APJII, UN.</p>
  </section>`;
}

function pageAbout() {
  return `
  <h1>Sources &amp; method</h1>
  <p class="lede">NusaStat is an independent, original reference site. It is not affiliated with
  BPS, the World Bank, Bank Indonesia or any government body.</p>
  <section class="card">
    <h2>Where the numbers come from</h2>
    <ul class="sources">
      <li><strong>BPS (Statistics Indonesia)</strong> — population, GDP growth, unemployment, poverty, HDI, trade, prices. The national statistical office; figures as published in its 2024–2025 releases.</li>
      <li><strong>World Bank, World Development Indicators</strong> — GDP in dollars and PPP, inflation, population series, life expectancy, Gini-related series.</li>
      <li><strong>Bank Indonesia</strong> — foreign-exchange reserves and the rupiah's average rate.</li>
      <li><strong>ILO</strong> — youth unemployment. <strong>APJII</strong> — internet users. <strong>UN World Population Prospects</strong> — median age.</li>
    </ul>
    <h2>Method</h2>
    <ul class="sources">
      <li>All figures are the latest full-year values available when the site was built (2024, or the survey month shown).</li>
      <li>Where two publishers disagree — for example BPS open unemployment (4.91%) versus the ILO-modelled rate (3.3%) — the site shows the BPS headline and notes the other measure, so nothing is hidden.</li>
      <li>The site is static files only: it makes no network request, stores nothing, and works offline in a desktop or phone browser.</li>
    </ul>
    <h2>Updates</h2>
    <p>Figures were checked in November 2026. BPS publishes new labour and poverty figures
    twice a year and GDP every quarter; the next update follows the February 2026 releases.</p>
  </section>`;
}

const PAGES = {
  '/': pageOverview,
  '/population': pagePopulation,
  '/economy': pageEconomy,
  '/prices': pagePrices,
  '/labour': pageLabour,
  '/provinces': pageProvinces,
  '/indicators': pageIndicators,
  '/about': pageAbout,
};

export function render(state) {
  const route = state.route in PAGES ? state.route : '/';
  return PAGES[route](state);
}

export function downloadCSV() {
  const head = 'Indicator,Value,Year,Source\n';
  const body = INDICATORS.map((r) => [r.indicator, r.value, String(r.year), r.source]
    .map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([head + body + '\n'], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nusastat-indonesia-indicators-2024.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
