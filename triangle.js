// triangle.js (REPLACE. Responsive improvements optimized for iPhone:
// 1) Use SVG viewBox dimensions dynamically (no hard-coded VIEW_W/H)
// 2) Tooltip width adapts to smaller screens in SVG units and stays inside bounds
// 3) Keep everything else as-is (hover behavior, smooth curves, multiline tooltip)

const nerdsTab = document.getElementById("nerdsTab");
const loversTab = document.getElementById("loversTab");
const lede = document.getElementById("lede");
const pageTitle = document.getElementById("pageTitle");

const loversControls = document.getElementById("loversControls");
const slider = document.getElementById("timeline");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const monthLabel = document.getElementById("monthLabel");

const vennSvg = document.getElementById("vennSvg");

const vennScene = document.getElementById("vennScene");
const chartScene = document.getElementById("chartScene");

const chartLines = document.getElementById("chartLines");
const chartMonths = document.getElementById("chartMonths");
const chartMarkers = document.getElementById("chartMarkers");
const chartTooltip = document.getElementById("chartTooltip");

const tipRect = document.getElementById("tipRect");
const tipMonth = document.getElementById("tipMonth");
const tipLine = document.getElementById("tipLine");
const tipText = document.getElementById("tipText");

const circleI = document.getElementById("circleI");
const circleP = document.getElementById("circleP");
const circleC = document.getElementById("circleC");

const clipI = document.getElementById("clipI_c");
const clipP = document.getElementById("clipP_c");
const clipC = document.getElementById("clipC_c");
const clipIP = document.getElementById("clipIP_c");
const clipIC = document.getElementById("clipIC_c");
const clipPC = document.getElementById("clipPC_c");
const clipIPC = document.getElementById("clipIPC_c");

// Singles
const LBL_SINGLE = {
  I: document.getElementById("lblGroupI"),
  P: document.getElementById("lblGroupP"),
  C: document.getElementById("lblGroupC"),
};

// Intersections
const LBL_REGION = {
  IP: document.getElementById("lblGroupIP"),
  IC: document.getElementById("lblGroupIC"),
  PC: document.getElementById("lblGroupPC"),
  IPC: document.getElementById("lblGroupIPC"),
};

const HL = {
  I: document.getElementById("hlI"),
  P: document.getElementById("hlP"),
  C: document.getElementById("hlC"),
  IP: document.getElementById("hlIP"),
  IC: document.getElementById("hlIC"),
  PC: document.getElementById("hlPC"),
  IPC: document.getElementById("hlIPC"),
};

const TXT = {
  I: document.getElementById("txtI"),
  P: document.getElementById("txtP"),
  C: document.getElementById("txtC"),
  IP: document.getElementById("txtIP"),
  IC: document.getElementById("txtIC"),
  PC: document.getElementById("txtPC"),
  IPC: document.getElementById("txtIPC"),
};

let MODE = "nerds";

const STATIC_WEIGHTS = { intimacy: 0.70, passion: 0.70, commitment: 0.70 };

const months = [
  {
    label: "Aug",
    weights: { intimacy: 0, passion: 0, commitment: 0 },
    story: {
      intimacy: "We didn't know each other.",
      passion: "We didn't know each other.",
      commitment: "We didn't know each other.",
    },
  },
  {
    label: "Sep",
    weights: { intimacy: 0.7, passion: 0.3, commitment: 0.55 },
    story: {
      intimacy: "First super friendly sleep overs. Big step for me. Learned to love sharing my space with you.",
      passion: "Flirty momentum. Starships. Our definitive acts of friendship. Always looking out for each other 😏",
      commitment: "You made me want to be a better friend. You showed me your standards, and I wanted nothing more than to meet them.",
    },
  },
  {
    label: "Oct",
    weights: { intimacy: 1, passion: 0.5, commitment: 0.75 },
    story: {
      intimacy: "You saw me at my lowest, and picked me up. I love cooking for you. As long as you don't help me.",
      passion: "Good times, poor Eva. Occasional guilt into all directions.",
      commitment: "Tassie Trip. Showed me that you stay. Snapped me out of my research mania lol.",
    },
  },
  {
    label: "Nov",
    weights: { intimacy: 1, passion: 0.1, commitment: 0.95 },
    story: {
      intimacy: "Here I realized that I am definitely falling for you. Just triple checking, do you REALLY have no feelings for me?",
      passion: "Our little break. Whoops. Hypocrisy discussions.",
      commitment: "Hannes + Rox Adventures. Building our little routines. Seeing the other stressed and relaxed.",
    },
  },
  {
    label: "Dec",
    weights: { intimacy: 1, passion: 0.8, commitment: 0.95 },
    story: {
      intimacy: "Sharing tent for 3 weeks. Spicy Nachos. Our first Christmas together.",
      passion: "Realizing I want to kiss you all day.",
      commitment: "I think you're my best friend.",
    },
  },
  {
    label: "Jan",
    weights: { intimacy: 1, passion: 0.9, commitment: 0.95 },
    story: {
      intimacy: "Admitting our feelings to each other. Crying on the bus because I had to leave.",
      passion: "My NYE kiss.",
      commitment: "You're my friend. I want you in my life.",
    },
  },
  {
    label: "Feb",
    weights: { intimacy: 1, passion: 0.3, commitment: 0.95 },
    story: {
      intimacy: "Talking to you on the phone anchors my day. You make me so happy.",
      passion: "Excitement through the screen. Meh.",
      commitment: "Future. Us. No flinching.",
    },
  },
];

const centersEven = { P: { cx: 360, cy: 205 }, I: { cx: 260, cy: 330 }, C: { cx: 460, cy: 330 } };
const R_MIN = 125;
const R_MAX = 220;

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function weightToRadius(w) { const x = clamp01(w); return R_MIN + (R_MAX - R_MIN) * x; }

function applyCircles(weights) {
  const rI = weightToRadius(weights.intimacy);
  const rP = weightToRadius(weights.passion);
  const rC = weightToRadius(weights.commitment);

  circleI.setAttribute("cx", centersEven.I.cx); circleI.setAttribute("cy", centersEven.I.cy); circleI.setAttribute("r", rI);
  circleP.setAttribute("cx", centersEven.P.cx); circleP.setAttribute("cy", centersEven.P.cy); circleP.setAttribute("r", rP);
  circleC.setAttribute("cx", centersEven.C.cx); circleC.setAttribute("cy", centersEven.C.cy); circleC.setAttribute("r", rC);

  clipI.setAttribute("cx", centersEven.I.cx); clipI.setAttribute("cy", centersEven.I.cy); clipI.setAttribute("r", rI);
  clipP.setAttribute("cx", centersEven.P.cx); clipP.setAttribute("cy", centersEven.P.cy); clipP.setAttribute("r", rP);
  clipC.setAttribute("cx", centersEven.C.cx); clipC.setAttribute("cy", centersEven.C.cy); clipC.setAttribute("r", rC);

  clipIP.setAttribute("cx", centersEven.P.cx); clipIP.setAttribute("cy", centersEven.P.cy); clipIP.setAttribute("r", rP);
  clipIC.setAttribute("cx", centersEven.C.cx); clipIC.setAttribute("cy", centersEven.C.cy); clipIC.setAttribute("r", rC);
  clipPC.setAttribute("cx", centersEven.C.cx); clipPC.setAttribute("cy", centersEven.C.cy); clipPC.setAttribute("r", rC);
  clipIPC.setAttribute("cx", centersEven.C.cx); clipIPC.setAttribute("cy", centersEven.C.cy); clipIPC.setAttribute("r", rC);
}

const HL_FILL = {
  I: "rgba(120, 210, 255, 0.18)",
  P: "rgba(255, 120, 200, 0.18)",
  C: "rgba(255, 220, 120, 0.18)",
  IP: "rgba(190, 140, 255, 0.18)",
  IC: "rgba(140, 255, 220, 0.18)",
  PC: "rgba(255, 165, 120, 0.18)",
  IPC: "rgba(255, 255, 255, 0.12)",
};

function primeHighlightColors() {
  Object.keys(HL).forEach((k) => {
    const el = HL[k];
    if (!el) return;
    const v = HL_FILL[k];
    el.setAttribute("fill", v);
    el.style.fill = v;
  });
}

const REGION_COMPONENTS = {
  I: ["I"],
  P: ["P"],
  C: ["C"],
  IP: ["I", "P"],
  IC: ["I", "C"],
  PC: ["P", "C"],
  IPC: ["I", "P", "C"],
};

let activeRegion = null;

function hideAllLabels() {
  Object.values(LBL_SINGLE).forEach((g) => g && g.setAttribute("opacity", "0"));
  Object.values(LBL_REGION).forEach((g) => g && g.setAttribute("opacity", "0"));
}

function showLabelForRegionOnly(key) {
  hideAllLabels();
  if (!key) return;

  if (LBL_REGION[key]) {
    LBL_REGION[key].setAttribute("opacity", "1");
    return;
  }

  if (LBL_SINGLE[key]) LBL_SINGLE[key].setAttribute("opacity", "1");
}

function clearVennHover() {
  Object.values(HL).forEach((el) => (el.style.opacity = "0"));
  Object.values(TXT).forEach((el) => (el.style.opacity = "0"));
  hideAllLabels();
  activeRegion = null;
}

function setHighlightsForRegion(key) {
  if (!key) return;
  (REGION_COMPONENTS[key] || []).forEach((k) => HL[k] && (HL[k].style.opacity = "1"));
  HL[key] && (HL[key].style.opacity = "1");
}

function showVennRegion(key) {
  if (!key) return clearVennHover();
  if (activeRegion === key) return;

  clearVennHover();
  activeRegion = key;

  setHighlightsForRegion(key);
  showLabelForRegionOnly(key);

  TXT[key] && (TXT[key].style.opacity = "1");
}

/* Responsive viewBox handling */

function getViewBox() {
  const vb = vennSvg?.viewBox?.baseVal;
  if (!vb) return { w: 720, h: 520 };
  return { w: vb.width || 720, h: vb.height || 520 };
}

function clientToSvgPoint(svg, clientX, clientY) {
  const { w: VIEW_W, h: VIEW_H } = getViewBox();
  const r = svg.getBoundingClientRect();
  return { x: ((clientX - r.left) / r.width) * VIEW_W, y: ((clientY - r.top) / r.height) * VIEW_H };
}

function getCircleGeom(el) {
  return { cx: parseFloat(el.getAttribute("cx")), cy: parseFloat(el.getAttribute("cy")), r: parseFloat(el.getAttribute("r")) };
}

function insideCircle(pt, c) {
  const dx = pt.x - c.cx;
  const dy = pt.y - c.cy;
  return dx * dx + dy * dy <= c.r * c.r;
}

function regionFromPoint(svgPt) {
  const I = getCircleGeom(circleI);
  const P = getCircleGeom(circleP);
  const C = getCircleGeom(circleC);

  const inI = insideCircle(svgPt, I);
  const inP = insideCircle(svgPt, P);
  const inC = insideCircle(svgPt, C);

  if (inI && inP && inC) return "IPC";
  if (inI && inP) return "IP";
  if (inI && inC) return "IC";
  if (inP && inC) return "PC";
  if (inI) return "I";
  if (inP) return "P";
  if (inC) return "C";
  return null;
}

/* Lovers chart bits */

const CHART = { x: 56, y: 96, w: 608, h: 320, pad: { l: 0, r: 0, t: 16, b: 44 } };
const SERIES = [
  { key: "intimacy", label: "Intimacy", color: "rgba(120, 210, 255, 0.85)" },
  { key: "passion", label: "Passion", color: "rgba(255, 120, 200, 0.85)" },
  { key: "commitment", label: "Commitment", color: "rgba(255, 220, 120, 0.85)" },
];

let chartSeries = [];
let activeMonthIdx = 0;

function yScale(v01) {
  const v = clamp01(v01);
  const top = CHART.y + CHART.pad.t;
  const bottom = CHART.y + CHART.h - CHART.pad.b;
  return bottom - v * (bottom - top);
}

function xStep() {
  const innerW = CHART.w - CHART.pad.l - CHART.pad.r;
  return months.length <= 1 ? innerW : innerW / (months.length - 1);
}

function xScaleMonth(i) {
  return (CHART.x + CHART.pad.l) + i * xStep();
}

function clearNode(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

function makeSvgEl(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}

function progressionValuesForSeriesKey(key) {
  const w0 = clamp01(months[0].weights[key]);
  const denom = Math.max(1e-6, 1 - w0);
  return months.map((m, i) => (i === 0 ? 0 : clamp01((clamp01(m.weights[key]) - w0) / denom)));
}

function pathDFromPointsSmooth(pts, tension = 1) {
  if (!pts || pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  const t = Math.max(0, Math.min(1.25, tension));
  const d = [`M ${pts[0].x} ${pts[0].y}`];

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;

    const c1x = p1.x + ((p2.x - p0.x) / 6) * t;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * t;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * t;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * t;

    d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`);
  }

  return d.join(" ");
}

function drawCursor(idx) {
  clearNode(chartMarkers);
  const top = CHART.y + CHART.pad.t;
  const bottom = CHART.y + CHART.h - CHART.pad.b;
  const x = xScaleMonth(idx);

  chartMarkers.appendChild(makeSvgEl("line", { x1: x, y1: top, x2: x, y2: bottom, class: "chart-cursor" }));

  chartSeries.forEach((s) => {
    const p = s.pts[idx];
    const ring = makeSvgEl("circle", { cx: p.x, cy: p.y, r: 7 });
    ring.setAttribute("fill", "rgba(255,255,255,0.06)");
    ring.setAttribute("stroke", s.color);
    ring.setAttribute("stroke-width", "2");
    chartMarkers.appendChild(ring);
  });
}

function renderChartToMonth(monthIdx) {
  const idx = Math.max(0, Math.min(months.length - 1, monthIdx));
  activeMonthIdx = idx;

  chartSeries.forEach((s) => {
    const visiblePts = s.pts.slice(0, idx + 1);
    s.pathEl.setAttribute("d", pathDFromPointsSmooth(visiblePts, 1));
    s.dots.forEach((c, i) => (c.style.opacity = i <= idx ? "1" : "0"));
  });

  drawCursor(idx);
}

function buildChartOnce() {
  if (!chartLines || !chartMonths || !chartMarkers) return;

  clearNode(chartLines);
  clearNode(chartMonths);
  clearNode(chartMarkers);

  const bottom = CHART.y + CHART.h - CHART.pad.b;
  months.forEach((m, i) => {
    chartMonths.appendChild(makeSvgEl("text", { x: xScaleMonth(i), y: bottom + 28, class: "chart-month", "text-anchor": "middle" }));
    chartMonths.lastChild.textContent = m.label;
  });

  chartSeries = SERIES.map((s) => {
    const prog = progressionValuesForSeriesKey(s.key);
    const pts = months.map((m, i) => ({ x: xScaleMonth(i), y: yScale(prog[i]), v: prog[i], idx: i }));

    const pathEl = makeSvgEl("path", { d: "", class: "chart-line" });
    pathEl.setAttribute("stroke", s.color);

    const dots = pts.map((p) => {
      const c = makeSvgEl("circle", { cx: p.x, cy: p.y, r: 4, class: "chart-dot" });
      c.setAttribute("fill", s.color);
      c.style.opacity = "0";
      chartLines.appendChild(c);
      return c;
    });

    chartLines.appendChild(pathEl);
    return { ...s, pts, pathEl, dots };
  });

  renderChartToMonth(activeMonthIdx);
}

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1, vy = y2 - y1;
  const wx = px - x1, wy = py - y1;
  const c1 = wx * vx + wy * vy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2);
  const b = c1 / c2;
  return Math.hypot(px - (x1 + b * vx), py - (y1 + b * vy));
}

function closestVisibleSeriesAtPoint(svgPt) {
  const left = CHART.x, right = CHART.x + CHART.w, top = CHART.y, bottom = CHART.y + CHART.h;
  if (svgPt.x < left || svgPt.x > right || svgPt.y < top || svgPt.y > bottom) return null;

  const HIT_RADIUS = 18;

  let best = null, bestD = Infinity;

  chartSeries.forEach((s) => {
    const pts = s.pts.slice(0, activeMonthIdx + 1);
    if (pts.length < 2) return;

    let dMin = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      dMin = Math.min(dMin, distPointToSegment(svgPt.x, svgPt.y, a.x, a.y, b.x, b.y));
    }

    if (dMin < bestD) { bestD = dMin; best = s; }
  });

  return bestD <= HIT_RADIUS ? best : null;
}

/* Tooltip sizing + wrapping */

const TIP = {
  W: 320,
  PAD_X: 14,
  PAD_Y: 14,
  RX: 14,
  TEXT_Y: 72,
  LINE_H: 16,
  MIN_LINES: 4,
  MAX_LINES: 7,
  MAX_CHARS_PER_LINE: 34,
};

function wrapTextSimple(text, maxChars) {
  const t = String(text || "").trim();
  if (!t) return [];

  const words = t.split(/\s+/g);
  const lines = [];
  let cur = "";

  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur.length + 1 + w.length) <= maxChars) cur += " " + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);

  return lines;
}

function setTipTextLines(lines) {
  while (tipText && tipText.firstChild) tipText.removeChild(tipText.firstChild);

  const normalized = Array.isArray(lines) ? lines.slice(0, TIP.MAX_LINES) : [];
  const want = Math.max(TIP.MIN_LINES, normalized.length);

  for (let i = 0; i < want; i++) {
    const tspan = makeSvgEl("tspan", { x: TIP.PAD_X });
    tspan.setAttribute("dy", i === 0 ? "0" : String(TIP.LINE_H));
    tspan.textContent = normalized[i] ?? "\u00A0";
    tipText.appendChild(tspan);
  }

  return want;
}

function showTooltip(series, svgPt) {
  const { w: VIEW_W, h: VIEW_H } = getViewBox();

  const m = months[activeMonthIdx];
  const raw = m.story?.[series.key] || "";

  tipMonth.textContent = m.label;
  tipLine.textContent = series.label;

  const padClamp = 12;

  // Responsive tooltip width in SVG units
  const maxW = Math.max(220, VIEW_W - (padClamp * 2));
  const W = Math.min(TIP.W, maxW);

  // Adjust wrapping to the chosen width
  const maxChars = Math.max(24, Math.floor((W / 320) * TIP.MAX_CHARS_PER_LINE));

  const lines = wrapTextSimple(raw, maxChars);
  const nLines = setTipTextLines(lines);

  const H =
    TIP.PAD_Y +
    (TIP.TEXT_Y - 0) +
    ((nLines - 1) * TIP.LINE_H) +
    TIP.PAD_Y;

  tipRect.setAttribute("width", String(W));
  tipRect.setAttribute("height", String(H));
  tipRect.setAttribute("rx", String(TIP.RX));
  tipRect.setAttribute("ry", String(TIP.RX));

  tipText.setAttribute("x", String(TIP.PAD_X));
  tipText.setAttribute("y", String(TIP.TEXT_Y));

  tipRect.setAttribute("fill", series.color.replace("0.85", "0.18"));
  tipRect.setAttribute("stroke", series.color.replace("0.85", "0.35"));

  let x = svgPt.x + 14;
  let y = svgPt.y - (H + 10);

  x = Math.max(padClamp, Math.min(VIEW_W - W - padClamp, x));
  y = Math.max(padClamp, Math.min(VIEW_H - H - padClamp, y));

  chartTooltip.setAttribute("transform", `translate(${x}, ${y})`);
  chartTooltip.setAttribute("opacity", "1");
}

function hideTooltip() { chartTooltip.setAttribute("opacity", "0"); }

function setMonthIdx(idx) {
  const max = months.length - 1;
  const i = Math.max(0, Math.min(max, idx));

  if (slider) { slider.max = String(max); slider.value = String(i); }

  const m = months[i];
  monthLabel && (monthLabel.textContent = `${months[0].label} → ${m.label}`);

  if (MODE === "lovers") renderChartToMonth(i);
  else applyCircles(STATIC_WEIGHTS);
}

slider?.addEventListener("input", (e) => setMonthIdx(parseInt(e.target.value, 10)));
prevBtn?.addEventListener("click", () => setMonthIdx(parseInt(slider.value, 10) - 1));
nextBtn?.addEventListener("click", () => setMonthIdx(parseInt(slider.value, 10) + 1));

function setMode(mode) {
  MODE = mode;
  const nerds = mode === "nerds";

  nerdsTab?.classList.toggle("is-active", nerds);
  loversTab?.classList.toggle("is-active", !nerds);
  nerdsTab?.setAttribute("aria-selected", String(nerds));
  loversTab?.setAttribute("aria-selected", String(!nerds));

  if (loversControls) {
    loversControls.hidden = nerds;
    loversControls.style.display = nerds ? "none" : "grid";
  }

  pageTitle && (pageTitle.textContent = nerds ? "Hover to reveal" : "Aug → Feb");
  lede && (lede.textContent = nerds
    ? "Hover a region to see the component or type."
    : "Slide through time. The lines grow as we did. Hover a line to read the month.");

  if (vennScene) { vennScene.style.display = nerds ? "block" : "none"; vennScene.style.pointerEvents = nerds ? "auto" : "none"; }
  if (chartScene) { chartScene.style.display = nerds ? "none" : "block"; chartScene.style.pointerEvents = nerds ? "none" : "auto"; chartScene.setAttribute("opacity", nerds ? "0" : "1"); }

  clearVennHover();
  hideTooltip();

  if (nerds) applyCircles(STATIC_WEIGHTS);
  else { buildChartOnce(); setMonthIdx(parseInt(slider?.value || "0", 10)); }
}

nerdsTab?.addEventListener("click", () => setMode("nerds"));
loversTab?.addEventListener("click", () => setMode("lovers"));

function handleSvgMove(e) {
  const p = clientToSvgPoint(vennSvg, e.clientX, e.clientY);
  if (MODE === "nerds") return showVennRegion(regionFromPoint(p));

  const s = closestVisibleSeriesAtPoint(p);
  if (!s) return hideTooltip();
  showTooltip(s, p);
}

function handleSvgLeave() {
  if (MODE === "nerds") clearVennHover();
  else hideTooltip();
}

vennSvg?.addEventListener("mousemove", handleSvgMove);
vennSvg?.addEventListener("mouseleave", handleSvgLeave);

primeHighlightColors();
applyCircles(STATIC_WEIGHTS);
setMonthIdx(parseInt(slider?.value || "0", 10));
setMode("nerds");
