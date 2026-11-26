// NusaStat boot — navigation and routing.
//
// The site is one page with hash routes (#/, #/population, ...). This file
// owns only the shell around the pages: it builds the navigation bar from
// the route list, reads the hash into a page slug, and asks NusaViews to
// render that page. Everything a page shows lives in views.js; everything
// a page shows numbers with lives in data.js.

const NAV = [
  ["", "Overview"],
  ["population", "Population"],
  ["economy", "Economy"],
  ["prices", "Prices"],
  ["labour", "Labour"],
  ["provinces", "Provinces"],
  ["indicators", "All indicators"],
  ["about", "Sources & method"],
];

// Build the top navigation once, from the same route list the router uses,
// so a link and its page can never drift apart.
function buildNav() {
  const nav = document.getElementById("nav");
  nav.replaceChildren();
  for (const [slug, label] of NAV) {
    const link = document.createElement("a");
    link.href = `#/${slug}`;
    link.textContent = label;
    link.dataset.slug = slug;
    nav.appendChild(link);
  }
}

// The slug is whatever follows "#/" in the address bar; "#/" and a bare
// "#" both mean the overview, and an unknown slug falls back to it too.
function slugFromHash() {
  const hash = window.location.hash || "";
  const slug = hash.replace(/^#\/?/, "");
  return Object.prototype.hasOwnProperty.call(window.NusaViews.ROUTES, slug)
    ? slug
    : "";
}

function markActive(slug) {
  for (const link of document.querySelectorAll("#nav a")) {
    if (link.dataset.slug === slug) link.classList.add("active");
    else link.classList.remove("active");
  }
}

function route() {
  const slug = slugFromHash();
  window.NusaViews.show(slug);
  markActive(slug);
}

// The scripts load at the end of <body>, so the shell is already parsed.
buildNav();
route();
window.addEventListener("hashchange", route);
