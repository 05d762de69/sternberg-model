// triangle.js (cleaned + structured. Hover works. Lovers-only slider. Circles resize with milestones.)

/* ---------------------------
   DOM
--------------------------- */

const nerdsTab = document.getElementById("nerdsTab");
const loversTab = document.getElementById("loversTab");
const lede = document.getElementById("lede");

const loversControls = document.getElementById("loversControls");
const slider = document.getElementById("timeline");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const milestoneTitle = document.getElementById("milestoneTitle");
const milestoneText = document.getElementById("milestoneText");
const milestoneMeta = document.getElementById("milestoneMeta");

// Base circles
const circleI = document.getElementById("circleI");
const circleP = document.getElementById("circleP");
const circleC = document.getElementById("circleC");

// Clip circles (must stay in sync with base circles)
const clipI = document.getElementById("clipI_c");
const clipP = document.getElementById("clipP_c");
const clipC = document.getElementById("clipC_c");

const clipIP = document.getElementById("clipIP_c");
const clipIC = document.getElementById("clipIC_c");
const clipPC = document.getElementById("clipPC_c");
const clipIPC = document.getElementById("clipIPC_c");

// Highlight overlays + hover text groups
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

/* ---------------------------
   Data (edit these)
--------------------------- */

const milestones = [
  {
    title: "A starting point",
    text: "Replace this with your first moment.",
    weights: { intimacy: 0.78, passion: 0.18, commitment: 0.55 },
  },
  {
    title: "We became a team",
    text: "Replace this with a team moment.",
    weights: { intimacy: 0.80, passion: 0.22, commitment: 0.65 },
  },
  {
    title: "Romantic energy arrived",
    text: "Replace this with the pull moment.",
    weights: { intimacy: 0.82, passion: 0.42, commitment: 0.70 },
  },
  {
    title: "Long distance, still us",
    text: "Replace this with the distance moment.",
    weights: { intimacy: 0.85, passion: 0.55, commitment: 0.78 },
  },
  {
    title: "The outlook",
    text: "Replace this with your outlook.",
    weights: { intimacy: 0.88, passion: 0.62, commitment: 0.86 },
  },
];

/* ---------------------------
   Geometry + mapping
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

/* ---------------------------
   Hover behavior
--------------------------- */

function clearRegion() {
  Object.values(HL).forEach((el) => (el.style.opacity = "0"));
  Object.values(TXT).forEach((el) => (el.style.opacity = "0"));
}

function showRegion(key) {
  clearRegion();
  if (!key) return;
  if (HL[key]) HL[key].style.opacity = "1";
  if (TXT[key]) TXT[key].style.opacity = "1";
}

hitEls.forEach((el) => {
  el.addEventListener("mouseenter", () => showRegion(el.dataset.region));
  el.addEventListener("mouseleave", () => showRegion(null));
});

/* ---------------------------
   Mode toggle
--------------------------- */

function setMode(mode) {
  const nerds = mode === "nerds";

  nerdsTab.classList.toggle("is-active", nerds);
  loversTab.classList.toggle("is-active", !nerds);

  nerdsTab.setAttribute("aria-selected", String(nerds));
  loversTab.setAttribute("aria-selected", String(!nerds));

  if (loversControls) loversControls.hidden = nerds;

  if (lede) {
    lede.textContent = nerds
      ? "Hover the diagram. The explanations live inside it."
      : "Move the slider. The diagram reshapes with our timeline.";
  }

  clearRegion();

  if (!nerds && slider) {
    setIdx(parseInt(slider.value, 10));
  }
}

if (nerdsTab) nerdsTab.addEventListener("click", () => setMode("nerds"));
if (loversTab) loversTab.addEventListener("click", () => setMode("lovers"));

/* ---------------------------
   Circle updates
--------------------------- */

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

  // Clip circles used in intersections (must match the partner circle radius)
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
   Timeline (lovers mode)
--------------------------- */

function pickAutoRegion(w) {
  const hasI = w.intimacy > 0.55;
  const hasP = w.passion > 0.45;
  const hasC = w.commitment > 0.55;

  if (hasI && hasP && hasC) return "IPC";
  if (hasI && hasC) return "IC";
  if (hasI && hasP) return "IP";
  if (hasP && hasC) return "PC";

  if (w.intimacy >= w.passion && w.intimacy >= w.commitment) return "I";
  if (w.passion >= w.intimacy && w.passion >= w.commitment) return "P";
  return "C";
}

function setIdx(idx) {
  if (!slider) return;

  const max = milestones.length - 1;
  const i = Math.max(0, Math.min(max, idx));

  slider.max = String(max);
  slider.value = String(i);

  const m = milestones[i];

  if (milestoneTitle) milestoneTitle.textContent = m.title;
  if (milestoneText) milestoneText.textContent = m.text;
  if (milestoneMeta) milestoneMeta.textContent = `Milestone ${i + 1} of ${milestones.length}`;

  applyCircles(m.weights);

  // Subtle cue in lovers mode
  showRegion(pickAutoRegion(m.weights));
}

/* wiring */
if (slider) {
  slider.addEventListener("input", (e) => setIdx(parseInt(e.target.value, 10)));
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => setIdx(parseInt(slider.value, 10) - 1));
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => setIdx(parseInt(slider.value, 10) + 1));
}

/* ---------------------------
   Init
--------------------------- */

clearRegion();
applyCircles(milestones[0].weights);
setMode("nerds");
setIdx(0);
