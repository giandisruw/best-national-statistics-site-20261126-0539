// NusaStat figures — every number on the site lives here, in one place.
//
// Layout note: figures are kept as plain rows and series so a page can use
// them without any other module. A row is
//   [name, value as shown, year as shown, publisher]
// and a series is a list of values for the years 2015..2024 in order.
// All figures are real published data, checked November 2026; the publishers
// and years travel with each figure so nothing is ever shown unsourced.

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// The 33-indicator table, in the order the table shows it.
const INDICATORS = [
  ["Population", "283.5 million", "2024", "BPS"],
  ["Population growth", "1.0% per year", "2024", "World Bank"],
  ["Median age", "30 years", "2024", "UN World Population Prospects"],
  ["Fertility rate", "2.13 births per woman", "2023", "World Bank"],
  ["Life expectancy, men", "69.0 years", "2023", "World Bank"],
  ["Life expectancy, women", "73.3 years", "2023", "World Bank"],
  ["Population aged under 15", "24.6%", "2024", "World Bank"],
  ["Population aged 65 and over", "7.3%", "2024", "World Bank"],
  ["GDP, nominal", "$1,396.3 billion", "2024", "World Bank / BPS"],
  ["GDP, PPP", "$4,663 billion", "2024", "World Bank"],
  ["GDP per capita, nominal", "$4,960", "2024", "BPS"],
  ["GDP per capita, PPP", "$16,448", "2024", "World Bank"],
  ["Real GDP growth", "5.03%", "2024", "BPS"],
  ["GNI per capita (Atlas method)", "$4,910", "2024", "World Bank"],
  ["Inflation, consumer prices (average)", "2.3%", "2024", "World Bank"],
  ["Inflation, December year-on-year", "1.57%", "2024", "BPS"],
  ["Labour force", "152.11 million people", "Aug 2024", "BPS"],
  ["Employed", "144.64 million people", "Aug 2024", "BPS"],
  ["Labour-force participation rate", "70.6%", "Aug 2024", "BPS"],
  ["Open unemployment rate", "4.91%", "Aug 2024", "BPS"],
  ["Youth unemployment rate (15–24)", "13.1%", "2024", "ILO / World Bank"],
  ["Youth unemployment rate, BPS (15–24)", "17.32%", "Aug 2024", "BPS"],
  ["Poverty rate", "8.57%", "Sep 2024", "BPS"],
  ["People in poverty", "24.06 million", "Sep 2024", "BPS"],
  ["Poverty line", "Rp 595,242 per person/month", "Sep 2024", "BPS"],
  ["Gini coefficient", "0.381", "Sep 2024", "BPS"],
  ["Human Development Index", "75.02", "2024", "BPS"],
  ["Exports of goods", "$264.7 billion", "2024", "BPS"],
  ["Imports of goods", "$233.7 billion", "2024", "BPS"],
  ["Trade balance (goods)", "+$31.0 billion surplus", "2024", "BPS"],
  ["Foreign-exchange reserves", "$155.7 billion", "Dec 2024", "Bank Indonesia"],
  ["Rupiah, average vs US dollar", "Rp 15,850 per US$", "2024", "Bank Indonesia"],
  ["Internet users", "221.6 million", "2024", "APJII"],
];

// The eight headline cards on the overview: [label, big value, small note].
const HEADLINES = [
  ["Population", "283.5m", "+1.0% a year · 2024 · BPS"],
  ["GDP (nominal)", "$1,396bn", "Rp 22,139 trillion · 2024 · BPS / World Bank"],
  ["GDP per capita", "$4,960", "$16,448 in PPP terms · 2024 · BPS / World Bank"],
  ["Real GDP growth", "5.03%", "5.05% in 2023 · 2024 · BPS"],
  ["Inflation (CPI, avg)", "2.3%", "3.7% in 2023 · 2024 · World Bank"],
  ["Open unemployment", "4.91%", "5.32% in Aug 2023 · Aug 2024 · BPS"],
  ["Poverty rate", "8.57%", "24.06m people · Sep 2024 · BPS"],
  ["Human Development Index", "75.02", "up from 74.39 in 2023 · 2024 · BPS"],
];

// Ten-year series, one value per year in YEARS.
const SERIES = {
  // Real GDP growth, percent a year (BPS / World Bank WDI).
  growth: [4.9, 5.0, 5.1, 5.2, 5.0, -2.1, 3.7, 5.3, 5.0, 5.0],
  // Population, millions (World Bank estimate; BPS mid-2024 estimate 283.5m).
  population: [258.5, 261.6, 264.7, 267.7, 270.6, 273.5, 276.4, 279.1, 282.1, 283.5],
  // Consumer-price inflation, period average, percent (World Bank WDI).
  inflation: [6.4, 3.5, 3.8, 3.3, 2.8, 2.0, 1.6, 4.1, 3.7, 2.3],
  // Poverty rate, September each year, percent (BPS).
  poverty: [11.13, 10.86, 10.64, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
  // Open unemployment rate, percent (BPS Sakernas).
  unemployment: [6.2, 5.6, 5.5, 5.3, 5.3, 7.1, 6.5, 5.9, 5.3, 4.9],
};

// Age structure, 2024: [band, share of the population in percent].
const AGE_BANDS = [
  ["0–14 years", 24.6],
  ["15–24 years", 16.9],
  ["25–54 years", 42.6],
  ["55–64 years", 8.6],
  ["65+ years", 7.3],
];

// GDP by sector, 2024: [sector, share of GDP in percent]. Sums to 100.
const SECTORS = [
  ["Manufacturing", 18.7],
  ["Wholesale & retail trade", 13.0],
  ["Agriculture, forestry & fishing", 11.9],
  ["Construction", 10.0],
  ["Mining & quarrying", 7.3],
  ["All other sectors", 39.1],
];

// Ten largest provinces, 2024 mid-year estimates (BPS):
// [province, population in millions, share of Indonesia in percent].
const PROVINCES = [
  ["West Java", 49.94, 17.6],
  ["East Java", 41.81, 14.7],
  ["Central Java", 37.89, 13.4],
  ["North Sumatra", 16.36, 5.8],
  ["Banten", 12.43, 4.4],
  ["Jakarta", 10.56, 3.7],
  ["South Sulawesi", 9.46, 3.3],
  ["Lampung", 9.24, 3.3],
  ["South Sumatra", 8.84, 3.1],
  ["Riau", 7.05, 2.5],
];

// Latest releases: [month, topic, what happened].
const RELEASES = [
  ["Feb 2025", "Economy", "BPS: economy grew 5.03% in 2024; GDP Rp 22,139 trillion"],
  ["Jan 2025", "Poverty", "BPS: poverty fell to 8.57% in September 2024 — 24.06m people"],
  ["Jan 2025", "Trade", "BPS: exports $264.7bn in 2024; trade surplus $31.0bn"],
  ["Nov 2024", "Labour", "BPS: open unemployment 4.91% in August 2024, down from 5.32%"],
  ["Nov 2024", "People", "BPS: Human Development Index reached 75.02 in 2024"],
];

// Single figures quoted in page copy (each also in INDICATORS above).
const FACTS = {
  provincesTotal: 38,
  javaShare: "about 55%",
  topTenShare: "72%",
  gdpRupiah: "Rp 22,139 trillion",
  iloUnemployment: "3.3%",
  selfEmployed: "54%",
  biTarget: "1.5–3.5%",
  hdiLastYear: "74.39",
  checked: "November 2026",
};

window.NusaData = {
  YEARS,
  INDICATORS,
  HEADLINES,
  SERIES,
  AGE_BANDS,
  SECTORS,
  PROVINCES,
  RELEASES,
  FACTS,
};
