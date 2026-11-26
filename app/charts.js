// NusaStat charts — small, dependency-free SVG chart builders.
// Every chart is drawn from the data in data.js; nothing is fetched.

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.ceil(min / size) * size;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += size) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

// Line chart with labelled axes, gridlines and a dot on every point.
export function lineChart(series, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 260;
  const padL = 44, padR = 14, padT = 14, padB = 30;
  const years = series.years;
  const values = series.values;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min > 0 && min / max > 0.6) min = Math.max(0, min - (max - min) * 0.5);
  if (min === max) { min -= 1; max += 1; }
  const ticks = niceTicks(min, max, 4);
  const lo = Math.min(min, ticks[0]);
  const hi = Math.max(max, ticks[ticks.length - 1]);
  const x = (i) => padL + (i * (w - padL - padR)) / (years.length - 1);
  const y = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${padL},${y(lo)} ${points} ${x(values.length - 1).toFixed(1)},${y(lo)}`;
  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(series.title)}" class="chart">`;
  out += `<polygon points="${area}" fill="rgba(13,148,136,.12)"/>`;
  for (const t of ticks) {
    out += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>`;
    out += `<text x="${padL - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${t}</text>`;
  }
  out += `<polyline points="${points}" fill="none" stroke="#0d9488" stroke-width="2.5" stroke-linejoin="round"/>`;
  values.forEach((v, i) => {
    out += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#0f766e" stroke="#fff" stroke-width="1.5"/>`;
    // First label reads left-to-right from its point, last label ends at its
    // point, so no label is clipped by the chart's edge; a white halo keeps
    // each label legible where it crosses a gridline.
    const anchor = i === 0 ? 'start' : i === values.length - 1 ? 'end' : 'middle';
    const lx = i === 0 ? x(i) + 4 : i === values.length - 1 ? x(i) - 4 : x(i);
    out += `<text x="${lx}" y="${y(v) - 9}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="#134e4a" style="paint-order:stroke" stroke="#fff" stroke-width="3">${v}</text>`;
    if (i % 2 === 0 || years.length <= 6) {
      out += `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#64748b">${years[i]}</text>`;
    }
  });
  out += '</svg>';
  return out;
}

// Horizontal bar chart, one bar per row, value at the end of each bar.
export function barChart(rows, opts = {}) {
  const w = opts.width || 640;
  const rowH = 34;
  const h = Math.max(120, rows.length * rowH + 16);
  const padL = opts.labelWidth || 150;
  const padR = 64;
  const max = Math.max(...rows.map((r) => r.value));
  const palette = ['#0d9488', '#0ea5a5', '#14b8a6', '#2dd4bf', '#0f766e', '#115e59', '#155e75', '#0369a1', '#1d4ed8', '#4338ca'];
  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Bar chart')}" class="chart">`;
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    const bw = ((w - padL - padR) * row.value) / max;
    const color = palette[i % palette.length];
    out += `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12" fill="#334155">${esc(row.label)}</text>`;
    out += `<rect x="${padL}" y="${y}" width="${Math.max(2, bw).toFixed(1)}" height="20" rx="4" fill="${color}"/>`;
    out += `<text x="${padL + bw + 8}" y="${y + 15}" font-size="12" font-weight="600" fill="#0f172a">${row.display}</text>`;
  });
  out += '</svg>';
  return out;
}

// Donut chart with a centre total and a legend list beside it.
export function donutChart(slices, opts = {}) {
  const size = opts.size || 220;
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, ir = r * 0.62;
  const total = slices.reduce((s, p) => s + p.share, 0);
  const palette = ['#0d9488', '#0ea5e9', '#f59e0b', '#6366f1', '#84cc16', '#94a3b8'];
  let angle = -90;
  let paths = '';
  slices.forEach((s, i) => {
    const a0 = (angle * Math.PI) / 180;
    const a1 = (((angle + (s.share / total) * 360)) * Math.PI) / 180;
    const large = s.share / total > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${ir} ${ir} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${palette[i % palette.length]}"/>`;
    angle += (s.share / total) * 360;
  });
  const legend = slices
    .map((s, i) => `<li><span class="swatch" style="background:${palette[i % palette.length]}"></span>${esc(s.name)} — <strong>${s.share}%</strong></li>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.title || 'Share chart')}" class="donut">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="#0f172a">${total.toFixed(0)}%</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#64748b">of GDP</text></svg><ul class="legend">${legend}</ul></div>`;
}
