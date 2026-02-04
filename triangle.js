// triangle.js (REPLACE. New: no static labels, nerds static venn, lovers month slider + hover tag pills)

const nerdsTab = document.getElementById("nerdsTab");
const loversTab = document.getElementById("loversTab");
const lede = document.getElementById("lede");

const loversControls = document.getElementById("loversControls");
const slider = document.getElementById("timeline");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const monthLabel = document.getElementById("monthLabel");

// Base circles
const circleI = document.getElementById("circleI");
const circleP = document.getElementById("circleP");
const circleC = document.getElementById("circleC");

// Clip circles
const clipI = document.getElementById("clipI_c");
const clipP = document.getElementById("clipP_c");
const clipC = document.getElementById("clipC_c");

const clipIP = document.getElementById("clipIP_c");
const clipIC = document.getElementById("clipIC_c");
const clipPC = document.getElementById("clipPC_c");
const clipIPC = document.getElementById("clipIPC_c");

// Highlight overlays + hover explanation groups
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

const hitEls = Array.from(document.querySelectorAll(".hit"));

// Lovers-only tag cloud (SVG)
const tagCloud = document.getElementById("tagCloud");
const tagPills = document.getElementById("tagPills");

/* ---------------------------
   Mode
--------------------------- */

let MODE = "nerds"; // "nerds" | "lovers"
let activeRegion = null;

function setMode(mode) {
  MODE = mode;

  const nerds = mode === "nerds";
  nerdsTab.classList.toggle("is-active", nerds);
  loversTab.classList.toggle("is-active", !nerds);
  nerdsTab.setAttribute("aria-selected", String(nerds));
  loversTab.setAttribute("aria-selected", String(!nerds));

  if (loversControls) loversControls.hidden = nerds;

  if (lede) {
    lede.textContent = nerds
      ? "Hover a region to see the component or type."
      : "Aug to Feb. Hover a region to see what was there.";
  }

  // In nerds mode: make venn static and remove tag cloud
  if (nerds) {
    applyCircles(STATIC_WEIGHTS);
    clearTagCloud();
  } else {
    // in lovers mode: apply current month
    setMonthIdx(parseInt(slider.value, 10));
  }

  clearRegion();
}

/* ---------------------------
   Data
--------------------------- */

// Static “model” sizing for nerds mode
const STATIC_WEIGHTS = { intimacy: 0.70, passion: 0.70, commitment: 0.70 };

// Months Aug → Feb (7 steps). Replace weights + tags with your real story.
const months = [
  {
    label: "Aug",
    weights: { intimacy: 0.75, passion: 0.18, commitment: 0.50 },
    // tags shown only in lovers mode on hover
    tags: {
      I: ["safe", "curious", "easy"],
      P: ["spark"],
      C: ["showing up"],
      IC: ["steady", "trust"],
      IP: [],
      PC: [],
      IPC: [],
    },
  },
  {
    label: "Sep",
    weights: { intimacy: 0.78, passion: 0.22, commitment: 0.55 },
    tags: {
      I: ["voice notes", "warmth", "laughs"],
      P: ["flirty"],
      C: ["plans"],
      IC: ["reliable"],
      IP: ["pull"],
      PC: [],
      IPC: [],
    },
  },
  {
    label: "Oct",
    weights: { intimacy: 0.80, passion: 0.30, commitment: 0.60 },
    tags: {
      I: ["honest talks", "comfort"],
      P: ["anticipation", "chemistry"],
      C: ["choosing"],
      IC: ["team"],
      IP: ["romantic"],
      PC: [],
      IPC: [],
    },
  },
  {
    label: "Nov",
    weights: { intimacy: 0.82, passion: 0.40, commitment: 0.68 },
    tags: {
      I: ["being known", "support"],
      P: ["longing", "excitement"],
      C: ["us"],
      IC: ["stability"],
      IP: ["romantic"],
      PC: ["bold"],
      IPC: [],
    },
  },
  {
    label: "Dec",
    weights: { intimacy: 0.84, passion: 0.52, commitment: 0.74 },
    tags: {
      I: ["home"],
      P: ["desire", "spark"],
      C: ["future"],
      IC: ["steady"],
      IP: ["electric"],
      PC: ["commitment"],
      IPC: ["all three"],
    },
  },
  {
    label: "Jan",
    weights: { intimacy: 0.86, passion: 0.58, commitment: 0.82 },
    tags: {
      I: ["trust", "ease"],
      P: ["pull"],
      C: ["plans", "choosing"],
      IC: ["team"],
      IP: ["romance"],
      PC: ["decisions"],
      IPC: ["whole"],
    },
  },
  {
    label: "Feb",
    weights: { intimacy: 0.88, passion: 0.62, commitment: 0.86 },
    tags: {
      I: ["soft", "close"],
      P: ["heat", "spark"],
      C: ["future", "us"],
      IC: ["steady"],
      IP: ["romantic"],
      PC: ["commitment"],
      IPC: ["complete"],
    },
  },
];

// Where to place tag pills for each region (SVG coordinates)
const TAG_ANCHOR = {
  I: { x: 130, y: 250 },
  P: { x: 360, y: 120 },
  C: { x: 510, y: 400 },
  IP: { x: 285, y: 220 },
  IC: { x: 325, y: 350 },
  PC: { x: 500, y: 250 },
  IPC: { x: 370, y: 285 },
};

/* ---------------------------
   Geometry
--------------------------- */

const centers = {
  I: { cx: 280, cy: 295 },
  P: { cx: 440, cy: 215 },
  C: { cx: 520, cy: 330 },
};

const R_BASE = 165;
const R_MIN = 120;
const R_MAX = 215;

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function weightToRadius(w) {
  const x = clamp01(w);
  const r = R_MIN + (R_MAX - R_MIN) * x;
  return 0.55 * R_BASE + 0.45 * r;
}

function applyCircles(weights) {
  const rI = weightToRadius(weights.intimacy);
  const rP = weightToRadius(weights.passion);
  const rC = weightToRadius(weights.commitment);

  // Base circles
  circleI.setAttribute("cx", centers.I.cx);
  circleI.setAttribute("cy", centers.I.cy);
  circleI.setAttribute("r", rI);

  circleP.setAttribute("cx", centers.P.cx);
  circleP.setAttribute("cy", centers.P.cy);
  circleP.setAttribute("r", rP);

  circleC.setAttribute("cx", centers.C.cx);
  circleC.setAttribute("cy", centers.C.cy);
  circleC.setAttribute("r", rC);

  // Clip circles (singletons)
  clipI.setAttribute("cx", centers.I.cx);
  clipI.setAttribute("cy", centers.I.cy);
  clipI.setAttribute("r", rI);

  clipP.setAttribute("cx", centers.P.cx);
  clipP.setAttribute("cy", centers.P.cy);
  clipP.setAttribute("r", rP);

  clipC.setAttribute("cx", centers.C.cx);
  clipC.setAttribute("cy", centers.C.cy);
  clipC.setAttribute("r", rC);

  // Intersection helper circles
  clipIP.setAttribute("cx", centers.P.cx);
  clipIP.setAttribute("cy", centers.P.cy);
  clipIP.setAttribute("r", rP);

  clipIC.setAttribute("cx", centers.C.cx);
  clipIC.setAttribute("cy", centers.C.cy);
  clipIC.setAttribute("r", rC);

  clipPC.setAttribute("cx", centers.C.cx);
  clipPC.setAttribute("cy", centers.C.cy);
  clipPC.setAttribute("r", rC);

  clipIPC.setAttribute("cx", centers.C.cx);
  clipIPC.setAttribute("cy", centers.C.cy);
  clipIPC.setAttribute("r", rC);
}

/* ---------------------------
   Hover: highlights + explanations + lovers tags
--------------------------- */

function clearRegion() {
  Object.values(HL).forEach((el) => (el.style.opacity = "0"));
  Object.values(TXT).forEach((el) => (el.style.opacity = "0"));
  activeRegion = null;
}

function showRegion(key) {
  clearRegion();
  if (!key) return;

  activeRegion = key;

  if (HL[key]) HL[key].style.opacity = "1";
  if (TXT[key]) TXT[key].style.opacity = "1";

  if (MODE === "lovers") {
    renderTagsFor(key);
  } else {
    clearTagCloud();
  }
}

hitEls.forEach((el) => {
  el.addEventListener("mouseenter", () => showRegion(el.dataset.region));
  el.addEventListener("mouseleave", () => {
    clearRegion();
    clearTagCloud();
  });
});

function clearTagCloud() {
  if (!tagCloud || !tagPills) return;
  tagCloud.setAttribute("opacity", "0");
  while (tagPills.firstChild) tagPills.removeChild(tagPills.firstChild);
}

function renderTagsFor(regionKey) {
  if (!tagCloud || !tagPills) return;

  const idx = parseInt(slider.value, 10);
  const m = months[idx];

  const tags = (m.tags && m.tags[regionKey]) ? m.tags[regionKey] : [];
  if (!tags || tags.length === 0) {
    clearTagCloud();
    return;
  }

  // Limit display to 5
  const items = tags.slice(0, 5);

  // Build pills at anchor
  const anchor = TAG_ANCHOR[regionKey] || { x: 360, y: 280 };
  const PADDING_X = 10;
  const PADDING_Y = 6;
  const GAP = 8;
  const CHAR_W = 7.1; // rough average for this font size

  // Clear existing
  while (tagPills.firstChild) tagPills.removeChild(tagPills.firstChild);

  let x = anchor.x;
  let y = anchor.y;

  items.forEach((t) => {
    const text = String(t);
    const w = Math.max(34, Math.round(text.length * CHAR_W) + 2 * PADDING_X);
    const h = 24;

    // pill rect
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("rx", "999");
    rect.setAttribute("ry", "999");
    rect.setAttribute("width", String(w));
    rect.setAttribute("height", String(h));
    rect.setAttribute("class", "tag-pill-rect");

    // pill text
    const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tx.setAttribute("x", String(x + PADDING_X));
    tx.setAttribute("y", String(y + 16));
    tx.setAttribute("class", "tag-pill-text");
    tx.textContent = text;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.appendChild(rect);
    g.appendChild(tx);
    tagPills.appendChild(g);

    // flow layout: wrap if too wide
    x += w + GAP;
    if (x > 640) {
      x = anchor.x;
      y += h + 8;
    }
  });

  tagCloud.setAttribute("opacity", "1");
}

/* ---------------------------
   Lovers timeline
--------------------------- */

function setMonthIdx(idx) {
  const max = months.length - 1;
  const i = Math.max(0, Math.min(max, idx));

  if (slider) {
    slider.max = String(max);
    slider.value = String(i);
  }

  const m = months[i];

  applyCircles(m.weights);

  if (monthLabel) {
    monthLabel.textContent = `${months[0].label} → ${m.label}`;
  }

  // If currently hovering a region, update tags immediately
  if (MODE === "lovers" && activeRegion) {
    renderTagsFor(activeRegion);
  }
}

if (slider) {
  slider.addEventListener("input", (e) => setMonthIdx(parseInt(e.target.value, 10)));
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => setMonthIdx(parseInt(slider.value, 10) - 1));
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => setMonthIdx(parseInt(slider.value, 10) + 1));
}

/* ---------------------------
   Init
--------------------------- */

setMode("nerds");
applyCircles(STATIC_WEIGHTS);
setMonthIdx(0);

if (nerdsTab) nerdsTab.addEventListener("click", () => setMode("nerds"));
if (loversTab) loversTab.addEventListener("click", () => setMode("lovers"));
