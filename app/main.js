// NusaStat bootstrap — hash router, nav highlighting and working controls.
// State lives here: the current route, chart ranges, and the two search boxes.
// Every control re-renders from state, so a link, a search or a sort always
// shows exactly what it says. No network request is ever made.

import { NAV, downloadCSV, render } from './views.js';

const state = {
  route: '/',
  range: { growth: 'all', population: 'all' },
  provinceQuery: '',
  provinceSort: 'population',
  indicatorQuery: '',
};

const app = document.getElementById('app');
const nav = document.querySelector('.top nav');

function routeFromHash() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1) || '/';
  return path.startsWith('/') ? path : '/' + path;
}

function paintNav() {
  const current = state.route === '/' ? '#/' : '#' + state.route;
  nav.innerHTML = NAV.map(([href, label]) =>
    `<a href="${href}" class="${href === current ? 'on' : ''}">${label}</a>`).join('');
}

function paint() {
  paintNav();
  app.innerHTML = render(state);
  restoreFocus();
}

// After a re-render caused by typing in a search box, put the caret back
// where it was so typing never loses focus.
let focusTarget = null;
function restoreFocus() {
  if (!focusTarget) return;
  const el = document.getElementById(focusTarget.id);
  if (el) {
    el.focus();
    const pos = focusTarget.pos;
    try { el.setSelectionRange(pos, pos); } catch { /* number inputs etc. */ }
  }
  focusTarget = null;
}

function rerender(keepFocusId) {
  if (keepFocusId) {
    const el = document.getElementById(keepFocusId);
    focusTarget = el ? { id: keepFocusId, pos: el.selectionStart ?? el.value.length } : null;
  }
  paint();
}

window.addEventListener('hashchange', () => {
  state.route = routeFromHash();
  state.provinceQuery = '';
  state.indicatorQuery = '';
  window.scrollTo(0, 0);
  paint();
});

app.addEventListener('click', (event) => {
  const rangeBtn = event.target.closest('[data-range]');
  if (rangeBtn) {
    state.range[rangeBtn.dataset.key] = rangeBtn.dataset.range;
    rerender();
    return;
  }
  const sortBtn = event.target.closest('[data-sort]');
  if (sortBtn) {
    state.provinceSort = sortBtn.dataset.sort;
    rerender();
    return;
  }
  if (event.target.id === 'csv-btn') {
    downloadCSV();
  }
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'prov-search') {
    state.provinceQuery = event.target.value;
    rerender('prov-search');
  } else if (event.target.id === 'ind-search') {
    state.indicatorQuery = event.target.value;
    rerender('ind-search');
  }
});

state.route = routeFromHash();
paint();
