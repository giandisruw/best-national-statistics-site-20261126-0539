// NusaStat charts — dependency-free SVG, built with the DOM API.
//
// Every chart is an <svg> assembled node by node (no string templates), so
// the browser, not a parser, owns the markup. Three shapes cover the site:
// a trend line with an area fill, horizontal bars, and a ring (donut).
// Colours are the site's own palette; nothing is fetched.

const SVGNS = "http://www.w3.org/2000/svg";

// Small helper: make an SVG element, set its attributes, append children.
function svgEl(name, attrs, children) {
  const node = document.createElementNS(SVGNS, name);
  for (const [key, value] of Object.entries(attrs || {})) {
    node.setAttribute(key, String(value));
  }
  for (const child of children || []) node.appendChild(child);
  return node;
}

function svgText(x, y, content, attrs) {
  const node = svgEl("text", { x, y, ...(attrs || {}) });
  node.textContent = content;
  return node;
}

// Format a plotted value the way the old charts labelled it: one decimal,
// with a trailing ".0" dropped, unless the caller asks for two decimals.
function plotLabel(value, decimals) {
  const fixed = value.toFixed(decimals === 2 ? 2 : 1);
  return decimals === 2 ? fixed : fixed.replace(/\.0$/, "");
}

// A line chart with a soft area fill under it.
//
// values: numbers, one per year in `years`. Options:
//   decimals — label precision (1 or 2); unit — text after the last label;
//   floor, ceiling — fixed y-axis ends (when given, the axis is stable
//   across the 10-year / 5-year range buttons).
function drawTrend(values, years, options) {
  const opts = options || {};
  const decimals = opts.decimals || 1;
  const width = 520;
  const height = 250;
  const padLeft = 34;
  const padRight = 12;
  const padTop = 26;
  const padBottom = 30;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  let low = opts.floor !== undefined ? opts.floor : Math.min(...values);
  let high = opts.ceiling !== undefined ? opts.ceiling : Math.max(...values);
  const span = high - low || 1;
  low -= span * 0.12;
  high += span * 0.12;
  const yFor = (v) => padTop + innerH - ((v - low) / (high - low)) * innerH;
  const xFor = (i) =>
    padLeft + (values.length === 1 ? innerW / 2 : (i / (values.length - 1)) * innerW);

  const root = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": opts.label || "Trend chart",
  });

  // Horizontal gridlines at round-number ticks: pick a step from 1, 2, 5 or
  // 10 (times a power of ten) near a quarter of the plotted span, so the
  // labels read 0, 2, 4, 6 — never two gridlines rounding to the same label.
  const rawStep = (high - low) / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const scaled = rawStep / magnitude;
  const nice = scaled <= 1 ? 1 : scaled <= 2.5 ? 2 : scaled <= 5 ? 5 : 10;
  const step = nice * magnitude;
  const tickText = (v) => (step >= 1 ? String(Math.round(v)) : v.toFixed(1));
  for (let v = Math.ceil(low / step) * step; v <= high + 1e-9; v += step) {
    const y = yFor(v);
    root.appendChild(
      svgEl("line", { x1: padLeft, x2: width - padRight, y1: y, y2: y, class: "grid" }),
    );
    root.appendChild(
      svgText(padLeft - 6, y + 3, tickText(v), {
        class: "axis",
        "text-anchor": "end",
      }),
    );
  }

  const points = values.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`);
  const area = [
    `${padLeft},${yFor(low) + innerH * 0}`,
    ...points,
    `${xFor(values.length - 1).toFixed(1)},${padTop + innerH}`,
    `${padLeft},${padTop + innerH}`,
  ];
  root.appendChild(
    svgEl("polygon", { points: area.join(" "), class: "area" }),
  );
  root.appendChild(
    svgEl("polyline", {
      points: points.join(" "),
      class: "line",
      fill: "none",
    }),
  );
  values.forEach((v, i) => {
    root.appendChild(
      svgEl("circle", { cx: xFor(i), cy: yFor(v), r: 3, class: "dot" }),
    );
    // End labels anchor inward so they never collide with the y-axis
    // labels (first point) or run past the chart edge (last point).
    const anchor = i === 0 ? "start" : i === values.length - 1 ? "end" : "middle";
    const lx = i === 0 ? xFor(i) + 5 : i === values.length - 1 ? xFor(i) - 5 : xFor(i);
    root.appendChild(
      svgText(lx, yFor(v) - 8, plotLabel(v, decimals), {
        class: "point-label",
        "text-anchor": anchor,
      }),
    );
  });
  years.forEach((year, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      root.appendChild(
        svgText(xFor(i), height - 8, String(year), {
          class: "axis",
          "text-anchor": "middle",
        }),
      );
    }
  });
  return root;
}

// Horizontal bars: rows are [label, value]. Values print at the bar end.
function drawBars(rows, options) {
  const opts = options || {};
  const decimals = opts.decimals === undefined ? 1 : opts.decimals;
  const rowH = 34;
  const labelW = 92;
  const width = 520;
  const height = rows.length * rowH + 8;
  const max = Math.max(...rows.map((row) => row[1]));
  const root = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": opts.label || "Bar chart",
  });
  const palette = ["#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#115e59", "#134e4a"];
  rows.forEach(([name, value], i) => {
    const y = 8 + i * rowH;
    const barW = ((width - labelW - 64) * value) / max;
    root.appendChild(
      svgText(labelW - 8, y + 15, name, { class: "bar-label", "text-anchor": "end" }),
    );
    root.appendChild(
      svgEl("rect", {
        x: labelW,
        y: y + 2,
        width: Math.max(barW, 2),
        height: 18,
        rx: 3,
        fill: palette[i % palette.length],
      }),
    );
    root.appendChild(
      svgText(labelW + barW + 6, y + 15, plotLabel(value, decimals) + (opts.suffix || ""), {
        class: "bar-value",
      }),
    );
  });
  return root;
}

// A ring chart (donut) drawn as stroked circle arcs. parts are
// [label, percent]. Returns the svg; the caller renders the legend.
function drawRing(parts, options) {
  const opts = options || {};
  const size = 220;
  const radius = 84;
  const thick = 34;
  const circ = 2 * Math.PI * radius;
  const root = svgEl("svg", {
    viewBox: `0 0 ${size} ${size}`,
    role: "img",
    "aria-label": opts.label || "Share chart",
  });
  const palette = ["#0f766e", "#0284c7", "#d97706", "#4f46e5", "#65a30d", "#94a3b8"];
  let offset = 0;
  parts.forEach(([name, share], i) => {
    const len = (share / 100) * circ;
    const arc = svgEl("circle", {
      cx: size / 2,
      cy: size / 2,
      r: radius,
      fill: "none",
      stroke: palette[i % palette.length],
      "stroke-width": thick,
      "stroke-dasharray": `${Math.max(len - 1.5, 0)} ${circ - len + 1.5}`,
      "stroke-dashoffset": -offset,
      transform: `rotate(-90 ${size / 2} ${size / 2})`,
    });
    root.appendChild(arc);
    offset += len;
  });
  const centre = svgEl("text", {
    x: size / 2,
    y: size / 2 - 2,
    class: "ring-total",
    "text-anchor": "middle",
  });
  centre.textContent = "100%";
  root.appendChild(centre);
  root.appendChild(
    svgText(size / 2, size / 2 + 20, "of GDP", {
      class: "ring-sub",
      "text-anchor": "middle",
    }),
  );
  return root;
}

window.NusaCharts = { drawTrend, drawBars, drawRing };
