// NusaStat pages — one renderer per page, built with the DOM API.
//
// The router (main.js) calls NusaViews.show(slug); each renderer fills the
// #view element with nodes built by h(). Interactive state that belongs to a
// page — chart ranges, table search text, column sorting — lives here, next
// to the page that uses it, and table filtering updates only the rows so a
// search box never loses focus while typing.

const D = window.NusaData;
const C = window.NusaCharts;

// h(tag, attrs, kids): build an element. Kids may be strings (text), nodes,
// or arrays of either; null/undefined kids are skipped.
function h(tag, attrs, kids) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (key === "class") node.className = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2), value);
    } else node.setAttribute(key, String(value));
  }
  const push = (kid) => {
    if (kid === null || kid === undefined) return;
    if (Array.isArray(kid)) kid.forEach(push);
    else if (typeof kid === "string") node.appendChild(document.createTextNode(kid));
    else node.appendChild(kid);
  };
  push(kids);
  return node;
}

function heroEl(title, intro) {
  return h("div", { class: "hero" }, [
    h("h1", {}, title),
    h("p", { class: "lede" }, intro),
  ]);
}

function cardEl(title, kids) {
  const card = h("section", { class: "card" }, []);
  if (title) card.appendChild(h("h2", {}, title));
  for (const kid of kids || []) card.appendChild(kid);
  return card;
}

function noteEl(text) {
  return h("p", { class: "note" }, text);
}

// A label/value row list, e.g. "Exports of goods, 2024 — $264.7 billion".
function factListEl(rows) {
  return h(
    "dl",
    { class: "facts" },
    rows.map(([label, value]) =>
      h("div", { class: "fact" }, [h("dt", {}, label), h("dd", {}, value)]),
    ),
  );
}

// A chart card with optional 10-year / 5-year range buttons. `key` names the
// range state for this chart; `build` draws the chart for a year window.
function chartCardEl(title, key, build, noteText) {
  const card = h("section", { class: "card chart-card" }, []);
  const head = h("div", { class: "chart-head" }, [h("h2", {}, title)]);
  const body = h("div", { class: "chart-body" }, []);
  if (key) {
    const group = h("div", { class: "range", role: "group", "aria-label": "Year range" }, []);
    for (const years of [10, 5]) {
      group.appendChild(
        h(
          "button",
          {
            type: "button",
            class: ranges[key] === years ? "range-btn on" : "range-btn",
            onclick: () => {
              ranges[key] = years;
              NusaViews.show(currentSlug);
            },
          },
          `${years} years`,
        ),
      );
    }
    head.appendChild(group);
  }
  card.appendChild(head);
  const years = D.YEARS;
  const windowYears = key ? years.slice(-ranges[key]) : years;
  body.appendChild(build(windowYears));
  card.appendChild(body);
  if (noteText) card.appendChild(noteEl(noteText));
  return card;
}

// Chart builders bound to the data series, taking the visible year window.
function trendFor(seriesKey, decimals) {
  return (windowYears) => {
    const start = D.YEARS.length - windowYears.length;
    const values = D.SERIES[seriesKey].slice(start);
    return C.drawTrend(values, windowYears, { decimals });
  };
}

// The site's pages. Each returns nothing; it appends to #view.
const ranges = { growth: 10, population: 10 };
let currentSlug = "";
let provQuery = "";
let provSort = { key: "rank", dir: 1 };
let indQuery = "";

function pageHome() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Indonesia in numbers",
      "Indonesia in numbers — population, economy, prices, work and regions. Every figure below is real, published data — each with its source and year. Figures as published for 2024 (latest full year), checked November 2026.",
    ),
  );
  const grid = h("div", { class: "kpi-grid" }, []);
  for (const [label, value, sub] of D.HEADLINES) {
    grid.appendChild(
      h("div", { class: "kpi" }, [
        h("div", { class: "kpi-label" }, label),
        h("div", { class: "kpi-value" }, value),
        h("div", { class: "kpi-note" }, sub),
      ]),
    );
  }
  view.appendChild(grid);

  const pair = h("div", { class: "pair" }, []);
  pair.appendChild(
    chartCardEl(
      "Real GDP growth",
      "growth",
      trendFor("growth", 1),
      "Source: World Bank, World Development Indicators. Growth stayed near 5% a year before and after the 2020 pandemic contraction of −2.1%.",
    ),
  );
  pair.appendChild(
    chartCardEl(
      "Population",
      "population",
      trendFor("population", 1),
      "Source: World Bank estimate; BPS mid-2024 estimate is 283.5m.",
    ),
  );
  view.appendChild(pair);

  const pair2 = h("div", { class: "pair" }, []);
  const topSix = D.PROVINCES.slice(0, 6).map(([name, pop]) => [name, pop]);
  pair2.appendChild(
    cardEl("Largest provinces, 2024", [
      C.drawBars(topSix, { decimals: 1, suffix: "m", label: "Largest provinces" }),
      noteEl("Source: BPS 2024 mid-year estimates. Java holds about 55% of all Indonesians."),
      h("p", { class: "more" }, [
        h("a", { href: "#/provinces" }, "See all ten largest provinces →"),
      ]),
    ]),
  );
  const ringCard = cardEl("What makes up GDP, 2024", [
    C.drawRing(D.SECTORS, { label: "GDP by sector" }),
    legendEl(D.SECTORS),
    noteEl("Source: BPS 2024. Manufacturing is the largest single sector at 18.7% of GDP."),
    h("p", { class: "more" }, [h("a", { href: "#/economy" }, "Economy in detail →")]),
  ]);
  pair2.appendChild(ringCard);
  view.appendChild(pair2);

  const releases = h("ul", { class: "releases" }, []);
  for (const [when, topic, text] of D.RELEASES) {
    releases.appendChild(
      h("li", {}, [
        h("span", { class: "rel-when" }, when),
        h("span", { class: "rel-tag" }, topic),
        h("span", {}, text),
      ]),
    );
  }
  view.appendChild(cardEl("Latest releases", [releases]));
}

function legendEl(parts) {
  const palette = ["#0f766e", "#0284c7", "#d97706", "#4f46e5", "#65a30d", "#94a3b8"];
  return h(
    "ul",
    { class: "legend" },
    parts.map(([name, share], i) => {
      const swatch = h("span", { class: "swatch" }, []);
      swatch.style.backgroundColor = palette[i % palette.length];
      return h("li", {}, [
        swatch,
        `${name} — `,
        h("strong", {}, `${share}%`),
      ]);
    }),
  );
}

function pagePeople() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Population",
      "283.5 million people in 2024 (BPS) — the world's fourth-largest country — growing about 1% a year, with a median age of 30.",
    ),
  );
  const pair = h("div", { class: "pair" }, []);
  pair.appendChild(
    chartCardEl(
      "Population trend",
      "population",
      trendFor("population", 1),
      "Source: World Bank estimate; BPS mid-2024 estimate is 283.5m.",
    ),
  );
  pair.appendChild(
    cardEl("Age structure, 2024", [
      C.drawBars(
        D.AGE_BANDS.map(([band, share]) => [band, share]),
        { decimals: 1, suffix: "%", label: "Age structure" },
      ),
      noteEl(
        "Source: World Bank. One in four Indonesians is under 15; 7.3% are 65 or older. Fertility is 2.13 births per woman (2023).",
      ),
    ]),
  );
  view.appendChild(pair);
  view.appendChild(
    cardEl("Where people live", [
      h("p", {}, [
        "West Java alone has 49.9 million people — more than Spain. The ten largest provinces hold 72% of the population. ",
        h("a", { href: "#/provinces" }, "Browse the province table →"),
      ]),
      factListEl([
        ["Life expectancy, men", "69.0 years (2023, World Bank)"],
        ["Life expectancy, women", "73.3 years (2023, World Bank)"],
        ["Under 15", "24.6% of the population (2024)"],
        ["65 and over", "7.3% of the population (2024)"],
      ]),
    ]),
  );
}

function pageMoney() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Economy",
      "A $1,396 billion economy in 2024 (World Bank) — the largest in Southeast Asia — growing 5.03% in real terms, with GDP per capita of $4,960.",
    ),
  );
  const pair = h("div", { class: "pair" }, []);
  pair.appendChild(
    chartCardEl(
      "Real GDP growth, 2015–2024",
      null,
      (windowYears) => C.drawTrend(D.SERIES.growth, windowYears, { decimals: 1 }),
      "Source: World Bank, World Development Indicators.",
    ),
  );
  pair.appendChild(
    cardEl("GDP by sector, 2024", [
      C.drawRing(D.SECTORS, { label: "GDP by sector" }),
      legendEl(D.SECTORS),
      noteEl("Source: BPS 2024. Services and trade together are larger than manufacturing."),
    ]),
  );
  view.appendChild(pair);
  view.appendChild(
    cardEl("Trade and money", [
      factListEl([
        ["Exports of goods, 2024", "$264.7 billion (BPS)"],
        ["Imports of goods, 2024", "$233.7 billion (BPS)"],
        ["Trade balance, 2024", "+$31.0 billion surplus (BPS)"],
        ["Foreign-exchange reserves", "$155.7 billion, Dec 2024 (Bank Indonesia)"],
        ["Rupiah vs US dollar", "≈ Rp 15,850 per US$, 2024 average (Bank Indonesia)"],
        ["GDP, purchasing-power parity", "$4,663 billion; $16,448 per person (2024, World Bank)"],
      ]),
    ]),
  );
}

function pagePrices() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Prices & inflation",
      "Consumer-price inflation averaged 2.3% in 2024 (World Bank) — inside Bank Indonesia's 1.5–3.5% target — after the 2022 spike to 4.1%.",
    ),
  );
  const pair = h("div", { class: "pair" }, []);
  pair.appendChild(
    chartCardEl(
      "Inflation, 2015–2024",
      null,
      (windowYears) => C.drawTrend(D.SERIES.inflation, windowYears, { decimals: 1 }),
      "Source: World Bank, World Development Indicators (period average).",
    ),
  );
  pair.appendChild(
    chartCardEl(
      "Poverty and the poverty line",
      null,
      (windowYears) => C.drawTrend(D.SERIES.poverty, windowYears, { decimals: 2 }),
      "Source: BPS (Statistics Indonesia) (September each year).",
    ),
  );
  view.appendChild(pair);
  view.appendChild(
    cardEl("What it costs to live", [
      factListEl([
        ["Poverty rate", "8.57% — 24.06 million people (Sep 2024, BPS)"],
        ["Poverty line", "Rp 595,242 per person per month (Sep 2024, BPS)"],
        ["December 2024 inflation", "1.57% year on year (BPS)"],
        ["Gini coefficient", "0.381 (Sep 2024, BPS) — up slightly from 0.379 in March 2024"],
      ]),
    ]),
  );
}

function pageWork() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Labour",
      "A labour force of 152.1 million people (August 2024, BPS) with 70.6% participation and open unemployment of 4.91% — the lowest in a decade.",
    ),
  );
  const pair = h("div", { class: "pair" }, []);
  pair.appendChild(
    chartCardEl(
      "Open unemployment, 2015–2024",
      null,
      (windowYears) => C.drawTrend(D.SERIES.unemployment, windowYears, { decimals: 1 }),
      "Source: BPS (Statistics Indonesia), Sakernas. The 2020 peak of 7.1% was the pandemic shock; the rate has fallen every year since.",
    ),
  );
  pair.appendChild(
    cardEl("Who works", [
      factListEl([
        ["Labour force", "152.11 million people (Aug 2024, BPS)"],
        ["Employed", "144.64 million people (Aug 2024, BPS)"],
        ["Working-age population", "215.37 million people (Aug 2024, BPS)"],
        ["Participation rate", "70.6% of people 15+ (Aug 2024, BPS)"],
        ["Youth unemployment (15–24)", "13.1% (2024, ILO / World Bank)"],
        ["Youth unemployment, BPS measure", "17.32% (Aug 2024, BPS) — young people are hit hardest"],
        ["Self-employed", "54% of workers (2023, World Bank)"],
        [
          "Note on measures",
          "The ILO-modelled unemployment rate (3.3% in 2024) uses a different method from BPS open unemployment (4.91%); the same gap shows for youth — BPS 17.32% against the ILO-modelled 13.1%. Both measures are shown in the data table, so nothing is hidden.",
        ],
      ]),
    ]),
  );
  view.appendChild(pair);
}

// Sortable, searchable province table. Sorting and filtering rewrite only
// the table body, so the search box keeps focus while typing.
function provinceRows() {
  const q = provQuery.trim().toLowerCase();
  let rows = D.PROVINCES.map(([name, pop, share], i) => ({
    rank: i + 1,
    name,
    pop,
    share,
  }));
  if (q) rows = rows.filter((row) => row.name.toLowerCase().includes(q));
  const key = provSort.key;
  rows.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return cmp * provSort.dir;
  });
  return rows;
}

function pageRegions() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Provinces",
      "The ten largest of Indonesia's 38 provinces, 2024 mid-year estimates (BPS). Together they hold 72% of the country. Type to filter, or click a column to sort.",
    ),
  );
  const card = h("section", { class: "card" }, []);
  const toolbar = h("div", { class: "toolbar" }, []);
  const search = h("input", {
    type: "search",
    id: "prov-search",
    placeholder: "e.g. Java",
    value: provQuery,
    "aria-label": "Search provinces",
  });
  search.addEventListener("input", () => {
    provQuery = search.value;
    paintProvinces();
  });
  const count = h("span", { class: "count", id: "prov-count" }, "");
  toolbar.appendChild(h("label", { for: "prov-search" }, "Search provinces"));
  toolbar.appendChild(search);
  toolbar.appendChild(count);
  card.appendChild(toolbar);

  const table = h("table", { class: "data" }, []);
  const head = h("tr", {}, []);
  const columns = [
    ["rank", "#"],
    ["name", "Province"],
    ["pop", "Population (millions)"],
    ["share", "Share of Indonesia"],
  ];
  for (const [key, label] of columns) {
    const th = h("th", { scope: "col" }, label);
    th.addEventListener("click", () => {
      if (provSort.key === key) provSort.dir = -provSort.dir;
      else provSort = { key, dir: 1 };
      paintProvinces();
      paintSortMarks();
    });
    head.appendChild(th);
  }
  table.appendChild(h("thead", {}, head));
  const body = h("tbody", { id: "prov-body" }, []);
  table.appendChild(body);
  card.appendChild(table);
  card.appendChild(
    noteEl("Source: BPS 2024 mid-year estimates. Shares are of the 283.5m national total."),
  );
  view.appendChild(card);

  function paintSortMarks() {
    for (const th of table.querySelectorAll("th")) {
      th.classList.remove("sorted-asc", "sorted-desc");
    }
    const idx = columns.findIndex(([key]) => key === provSort.key);
    if (idx >= 0) {
      table.querySelectorAll("th")[idx].classList.add(
        provSort.dir === 1 ? "sorted-asc" : "sorted-desc",
      );
    }
  }

  function paintProvinces() {
    const rows = provinceRows();
    body.replaceChildren(
      ...rows.map((row) =>
        h("tr", {}, [
          h("td", {}, String(row.rank)),
          h("td", {}, row.name),
          h("td", {}, row.pop.toFixed(2)),
          h("td", {}, `${row.share.toFixed(1)}%`),
        ]),
      ),
    );
    count.textContent = `${rows.length} of 10 shown`;
    paintSortMarks();
  }
  paintProvinces();
}

function downloadCsv() {
  const q = indQuery.trim().toLowerCase();
  const rows = D.INDICATORS.filter(
    ([name, value, year, source]) =>
      !q ||
      [name, value, year, source].join(" ").toLowerCase().includes(q),
  );
  const csv = ["Indicator,Value,Year,Source"]
    .concat(rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nusastat-indicators.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function pageTable() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "All indicators",
      "Every figure on this site in one searchable table — 33 indicators, each with its year and source. Download the table as a CSV for your own work.",
    ),
  );
  const card = h("section", { class: "card" }, []);
  const toolbar = h("div", { class: "toolbar" }, []);
  const search = h("input", {
    type: "search",
    id: "ind-search",
    placeholder: "e.g. inflation, BPS, 2024",
    value: indQuery,
    "aria-label": "Search indicators",
  });
  search.addEventListener("input", () => {
    indQuery = search.value;
    paintIndicators();
  });
  const count = h("span", { class: "count", id: "ind-count" }, "");
  toolbar.appendChild(h("label", { for: "ind-search" }, "Search indicators"));
  toolbar.appendChild(search);
  toolbar.appendChild(
    h("button", { type: "button", class: "btn", onclick: downloadCsv }, "Download CSV"),
  );
  toolbar.appendChild(count);
  card.appendChild(toolbar);

  const table = h("table", { class: "data" }, []);
  table.appendChild(
    h("thead", {}, h("tr", {}, ["Indicator", "Value", "Year", "Source"].map((t) => h("th", { scope: "col" }, t)))),
  );
  const body = h("tbody", { id: "ind-body" }, []);
  table.appendChild(body);
  card.appendChild(table);
  card.appendChild(noteEl("Sources: BPS (Statistics Indonesia), World Bank, Bank Indonesia, ILO, APJII, UN."));
  view.appendChild(card);

  function paintIndicators() {
    const q = indQuery.trim().toLowerCase();
    const rows = D.INDICATORS.filter(
      ([name, value, year, source]) =>
        !q || [name, value, year, source].join(" ").toLowerCase().includes(q),
    );
    body.replaceChildren(
      ...rows.map(([name, value, year, source]) =>
        h("tr", {}, [
          h("td", {}, name),
          h("td", {}, value),
          h("td", {}, year),
          h("td", {}, source),
        ]),
      ),
    );
    count.textContent = `${rows.length} of 33 shown`;
  }
  paintIndicators();
}

function pageAbout() {
  const view = document.getElementById("view");
  view.appendChild(
    heroEl(
      "Sources & method",
      "NusaStat is an independent, original reference site. It is not affiliated with BPS, the World Bank, Bank Indonesia or any government body.",
    ),
  );
  const card = h("section", { class: "card" }, []);
  card.appendChild(h("h2", {}, "Where the numbers come from"));
  card.appendChild(
    h("ul", { class: "bullets" }, [
      h("li", {}, [
        h("strong", {}, "BPS (Statistics Indonesia)"),
        " — population, GDP growth, unemployment, poverty, HDI, trade, prices. The national statistical office; figures as published in its 2024–2025 releases.",
      ]),
      h("li", {}, [
        h("strong", {}, "World Bank, World Development Indicators"),
        " — GDP in dollars and PPP, inflation, population series, life expectancy, Gini-related series.",
      ]),
      h("li", {}, [
        h("strong", {}, "Bank Indonesia"),
        " — foreign-exchange reserves and the rupiah's average rate.",
      ]),
      h("li", {}, [
        h("strong", {}, "ILO"),
        " — youth unemployment. ",
        h("strong", {}, "APJII"),
        " — internet users. ",
        h("strong", {}, "UN World Population Prospects"),
        " — median age.",
      ]),
    ]),
  );
  card.appendChild(h("h2", {}, "Method"));
  card.appendChild(
    h("ul", { class: "bullets" }, [
      h("li", {}, "All figures are the latest full-year values available when the site was built (2024, or the survey month shown)."),
      h("li", {}, "Where two publishers disagree — for example BPS open unemployment (4.91%) versus the ILO-modelled rate (3.3%) — the site shows the BPS headline and notes the other measure, so nothing is hidden."),
      h("li", {}, "The site is static files only: it makes no network request, stores nothing, and works offline in a desktop or phone browser."),
    ]),
  );
  card.appendChild(h("h2", {}, "Updates"));
  card.appendChild(
    h("p", {}, "Figures were checked in November 2026. BPS publishes new labour and poverty figures twice a year and GDP every quarter; the next update follows the February 2026 releases."),
  );
  view.appendChild(card);
}

const ROUTES = {
  "": { title: "Indonesia in numbers", render: pageHome },
  population: { title: "Population", render: pagePeople },
  economy: { title: "Economy", render: pageMoney },
  prices: { title: "Prices & inflation", render: pagePrices },
  labour: { title: "Labour", render: pageWork },
  provinces: { title: "Provinces", render: pageRegions },
  indicators: { title: "All indicators", render: pageTable },
  about: { title: "Sources & method", render: pageAbout },
};

function show(slug) {
  const route = ROUTES[slug] || ROUTES[""];
  currentSlug = ROUTES[slug] ? slug : "";
  const view = document.getElementById("view");
  view.replaceChildren();
  document.title = `NusaStat — ${route.title}`;
  route.render();
  window.scrollTo(0, 0);
}

window.NusaViews = { show, ROUTES };
