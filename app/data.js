// NusaStat data — real, verifiable public statistics for Indonesia.
// Every figure carries its source and year. Sources: BPS (Statistics Indonesia),
// World Bank (WDI), IMF, Bank Indonesia, APJII. Figures were checked against
// those publishers' 2024 releases in November 2026; see the About page.

export const COUNTRY = {
  name: 'Indonesia',
  tagline: 'Indonesia in numbers — population, economy, prices, work and regions.',
  updated: 'Figures as published for 2024 (latest full year), checked November 2026.',
};

// Headline indicators shown on the overview page.
export const HEADLINE = [
  { id: 'population', label: 'Population', value: '283.5m', change: '+1.0% a year', year: 2024, source: 'BPS' },
  { id: 'gdp', label: 'GDP (nominal)', value: '$1,396bn', change: 'Rp 22,139 trillion', year: 2024, source: 'BPS / World Bank' },
  { id: 'gdp-capita', label: 'GDP per capita', value: '$4,960', change: '$16,448 in PPP terms', year: 2024, source: 'BPS / World Bank' },
  { id: 'growth', label: 'Real GDP growth', value: '5.03%', change: '5.05% in 2023', year: 2024, source: 'BPS' },
  { id: 'inflation', label: 'Inflation (CPI, avg)', value: '2.3%', change: '3.7% in 2023', year: 2024, source: 'World Bank' },
  { id: 'unemployment', label: 'Open unemployment', value: '4.91%', change: '5.32% in Aug 2023', year: 'Aug 2024', source: 'BPS' },
  { id: 'poverty', label: 'Poverty rate', value: '8.57%', change: '24.06m people', year: 'Sep 2024', source: 'BPS' },
  { id: 'hdi', label: 'Human Development Index', value: '75.02', change: 'up from 74.39 in 2023', year: 2024, source: 'BPS' },
];

// Annual series (World Bank WDI unless noted).
export const SERIES = {
  gdpGrowth: {
    title: 'Real GDP growth, % per year',
    source: 'World Bank, World Development Indicators',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [4.9, 5.0, 5.1, 5.2, 5.0, -2.1, 3.7, 5.3, 5.0, 5.0],
    unit: '%',
  },
  population: {
    title: 'Population, millions',
    source: 'World Bank estimate; BPS mid-2024 estimate is 283.5m',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [258.4, 261.6, 264.7, 267.7, 270.6, 273.5, 276.4, 279.1, 282.1, 285.1],
    unit: 'm',
  },
  inflation: {
    title: 'Consumer-price inflation, % per year (period average)',
    source: 'World Bank, World Development Indicators',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [6.4, 3.5, 3.8, 3.3, 2.8, 2.0, 1.6, 4.1, 3.7, 2.3],
    unit: '%',
  },
  unemployment: {
    title: 'Open unemployment rate, % of labour force (BPS)',
    source: 'BPS (Statistics Indonesia), Sakernas',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [6.2, 5.6, 5.5, 5.3, 5.3, 7.1, 6.5, 5.9, 5.3, 4.9],
    unit: '%',
  },
  poverty: {
    title: 'Poverty rate, % of population (BPS, September)',
    source: 'BPS (Statistics Indonesia)',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [11.13, 10.86, 10.64, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
    unit: '%',
  },
};

// Ten largest provinces, BPS 2024 mid-year estimates.
export const PROVINCES = [
  { rank: 1, name: 'West Java', population: 49.94, share: 17.6 },
  { rank: 2, name: 'East Java', population: 41.81, share: 14.7 },
  { rank: 3, name: 'Central Java', population: 37.89, share: 13.4 },
  { rank: 4, name: 'North Sumatra', population: 16.36, share: 5.8 },
  { rank: 5, name: 'Banten', population: 12.43, share: 4.4 },
  { rank: 6, name: 'Jakarta', population: 10.56, share: 3.7 },
  { rank: 7, name: 'South Sulawesi', population: 9.46, share: 3.3 },
  { rank: 8, name: 'Lampung', population: 9.24, share: 3.3 },
  { rank: 9, name: 'South Sumatra', population: 8.84, share: 3.1 },
  { rank: 10, name: 'Riau', population: 7.05, share: 2.5 },
];

// GDP by sector, % of GDP, BPS 2024.
export const SECTORS = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture, forestry & fishing', share: 11.9 },
  { name: 'Construction', share: 10.0 },
  { name: 'Mining & quarrying', share: 7.3 },
  { name: 'All other sectors', share: 39.1 },
];

// Age structure, 2024 (World Bank / UN).
export const AGE = [
  { group: '0–14 years', share: 24.6 },
  { group: '15–24 years', share: 16.9 },
  { group: '25–54 years', share: 42.6 },
  { group: '55–64 years', share: 8.6 },
  { group: '65+ years', share: 7.3 },
];

// Every indicator on the searchable Data page.
export const INDICATORS = [
  { indicator: 'Population', value: '283.5 million', year: 2024, source: 'BPS' },
  { indicator: 'Population growth', value: '1.0% per year', year: 2024, source: 'World Bank' },
  { indicator: 'Median age', value: '30 years', year: 2024, source: 'UN World Population Prospects' },
  { indicator: 'Fertility rate', value: '2.13 births per woman', year: 2023, source: 'World Bank' },
  { indicator: 'Life expectancy, men', value: '69.0 years', year: 2023, source: 'World Bank' },
  { indicator: 'Life expectancy, women', value: '73.3 years', year: 2023, source: 'World Bank' },
  { indicator: 'Population aged under 15', value: '24.6%', year: 2024, source: 'World Bank' },
  { indicator: 'Population aged 65 and over', value: '7.3%', year: 2024, source: 'World Bank' },
  { indicator: 'GDP, nominal', value: '$1,396.3 billion', year: 2024, source: 'World Bank / BPS' },
  { indicator: 'GDP, PPP', value: '$4,663 billion', year: 2024, source: 'World Bank' },
  { indicator: 'GDP per capita, nominal', value: '$4,960', year: 2024, source: 'BPS' },
  { indicator: 'GDP per capita, PPP', value: '$16,448', year: 2024, source: 'World Bank' },
  { indicator: 'Real GDP growth', value: '5.03%', year: 2024, source: 'BPS' },
  { indicator: 'GNI per capita (Atlas method)', value: '$4,910', year: 2024, source: 'World Bank' },
  { indicator: 'Inflation, consumer prices (average)', value: '2.3%', year: 2024, source: 'World Bank' },
  { indicator: 'Inflation, December year-on-year', value: '1.57%', year: 2024, source: 'BPS' },
  { indicator: 'Labour force', value: '152.11 million people', year: 'Aug 2024', source: 'BPS' },
  { indicator: 'Employed', value: '144.64 million people', year: 'Aug 2024', source: 'BPS' },
  { indicator: 'Labour-force participation rate', value: '70.6%', year: 'Aug 2024', source: 'BPS' },
  { indicator: 'Open unemployment rate', value: '4.91%', year: 'Aug 2024', source: 'BPS' },
  { indicator: 'Youth unemployment rate (15–24)', value: '13.1%', year: 2024, source: 'ILO / World Bank' },
  { indicator: 'Youth unemployment rate, BPS (15–24)', value: '17.32%', year: 'Aug 2024', source: 'BPS' },
  { indicator: 'Poverty rate', value: '8.57%', year: 'Sep 2024', source: 'BPS' },
  { indicator: 'People in poverty', value: '24.06 million', year: 'Sep 2024', source: 'BPS' },
  { indicator: 'Poverty line', value: 'Rp 595,242 per person/month', year: 'Sep 2024', source: 'BPS' },
  { indicator: 'Gini coefficient', value: '0.381', year: 'Sep 2024', source: 'BPS' },
  { indicator: 'Human Development Index', value: '75.02', year: 2024, source: 'BPS' },
  { indicator: 'Exports of goods', value: '$264.7 billion', year: 2024, source: 'BPS' },
  { indicator: 'Imports of goods', value: '$233.7 billion', year: 2024, source: 'BPS' },
  { indicator: 'Trade balance (goods)', value: '+$31.0 billion surplus', year: 2024, source: 'BPS' },
  { indicator: 'Foreign-exchange reserves', value: '$155.7 billion', year: 'Dec 2024', source: 'Bank Indonesia' },
  { indicator: 'Rupiah, average vs US dollar', value: 'Rp 15,850 per US$', year: 2024, source: 'Bank Indonesia' },
  { indicator: 'Internet users', value: '221.6 million', year: 2024, source: 'APJII' },
];

// Latest releases, newest first — dated by the month BPS actually published them.
export const RELEASES = [
  { date: 'Feb 2025', title: 'BPS: economy grew 5.03% in 2024; GDP Rp 22,139 trillion', tag: 'Economy' },
  { date: 'Jan 2025', title: 'BPS: poverty fell to 8.57% in September 2024 — 24.06m people', tag: 'Poverty' },
  { date: 'Jan 2025', title: 'BPS: exports $264.7bn in 2024; trade surplus $31.0bn', tag: 'Trade' },
  { date: 'Nov 2024', title: 'BPS: open unemployment 4.91% in August 2024, down from 5.32%', tag: 'Labour' },
  { date: 'Nov 2024', title: 'BPS: Human Development Index reached 75.02 in 2024', tag: 'People' },
];
