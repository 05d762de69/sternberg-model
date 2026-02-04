// triangle.js (REPLACE. New interactivity: hover highlights clipped regions + text reveals.
// Lovers mode: slider changes circle radii to reflect weights.)

const nerdsTab = document.getElementById("nerdsTab");
const loversTab = document.getElementById("loversTab");

const modeHint = document.getElementById("modeHint");
const timelineControls = document.getElementById("timelineControls");
const milestoneBar = document.getElementById("milestoneBar");

const slider = document.getElementById("timeline");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const milestoneTitle = document.getElementById("milestoneTitle");
const milestoneText = document.getElementById("milestoneText");
const milestoneMeta = document.getElementById("milestoneMeta");

// Base circles and clip circles (must stay in sync)
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

// Highlight rects
const hl = {
  I: document.getElementById("hlI"),
  P: document.getElementById("hlP"),
  C: document.getElementById("hlC"),
  IP: document.getElementById("hlIP"),
  IC: document.getElementById("hlIC"),
  PC: document.getElementById("hlPC"),
  IPC: document.getElementById("hlIPC"),
};

// Explanation groups
const txt = {
  I: document.getElementById("txtI"),
  P: document.getElementById("txtP"),
  C: document.getElementById("txtC"),
  IP: document.getElementById("txtIP"),
  IC: document.getElementById("txtIC"),
  PC: document.getElementById("txtPC"),
  IPC: document.getElementById("txtIPC"),
};

// Region hit elements
const regionEls = Array.from(document.querySelectorAll(".region-hit"));

function setActiveRegion(regionKey){
  Object.keys(hl).forEach((k) => (hl[k].style.opacity = "0"));
  Object.keys(txt).forEach((k) => (txt[k].style.opacity = "0"));

  if (!regionKey) return;

  if (hl[regionKey]) hl[regionKey].style.opacity = "1";
  if (txt[regionKey]) txt[regionKey].style.opacity = "1";
}

regionEls.forEach((el) => {
  el.addEventListener("mouseenter", () => setActiveRegion(el.dataset.region));
  el.addEventListener("mouseleave", () => setActiveRegion(null));
  el.addEventListener("focus", () => setActiveRegion(el.dataset.region));
  el.addEventListener("blur", () => setActiveRegion(null));
});

// Make hit regions big, simple, and aligned with clip areas.
// For MVP, we use invisible rectangles clipped to each region. This keeps hover precise and fast.
function setRegionHitToClip(elId, clipId){
  const el = document.getElementById(elId);
  el.setAttribute("d", "M0 0 H720 V520 H0 Z");
  el.setAttribute("clip-path", `url(#${clipId})`);
}

setRegionHitToClip("regI", "clipI");
setRegionHitToClip("regP", "clipP");
setRegionHitToClip("regC", "clipC");
setRegionHitToClip("regIP", "clipIP");
setRegionHitToClip("regIC", "clipIC");
setRegionHitToClip("regPC", "clipPC");
setRegionHitToClip("regIPC", "clipIPC");

// --- Mode toggle ---
function setMode(mode){
  const nerds = mode === "nerds";

  nerdsTab.classList.toggle("is-active", nerds);
  loversTab.classList.toggle("is-active", !nerds);

  nerdsTab.setAttribute("aria-selected", String(nerds));
  loversTab.setAttribute("aria-selected", String(!nerds));

  timelineControls.hidden = nerds;
  milestoneBar.hidden = nerds;

  modeHint.textContent = nerds
    ? "Hover regions to reveal meaning"
    : "Move the slider. The circles resize with our timeline.";

  const lede = document.getElementById("lede");
  lede.textContent = nerds
    ? "Hover the diagram. The explanations live inside it."
    : "Same diagram. But now it’s ours.";

  setActiveRegion(null);
}

nerdsTab.addEventListener("click", () => setMode("nerds"));
loversTab.addEventListener("click", () => setMode("lovers"));

// --- Lovers mode timeline data (edit these) ---
const milestones = [
  {
    title: "A starting point",
    text: "Replace this with the moment you realized: this feels safe. this feels real.",
    weights: { intimacy: 0.78, passion: 0.18, commitment: 0.55 },
  },
  {
    title: "We became a team",
    text: "A small moment where commitment showed up without needing the word.",
    weights: { intimacy: 0.80, passion: 0.22, commitment: 0.65 },
  },
  {
    title: "Romantic energy arrived",
    text: "The first time it felt like more than closeness. It felt like pull.",
    weights: { intimacy: 0.82, passion: 0.42, commitment: 0.70 },
  },
  {
    title: "Long distance, still us",
    text: "Distance didn’t delete it. It clarified it.",
    weights: { intimacy: 0.85, passion: 0.55, commitment: 0.78 },
  },
  {
    title: "The outlook",
    text: "We keep choosing this. With plans. With play. With patience.",
    weights: { intimacy: 0.88, passion: 0.62, commitment: 0.86 },
  },
];

// Circle geometry. Centers are fixed. Radii vary with weights.
const centers = {
  I: { cx: 280, cy: 295 },
  P: { cx: 440, cy: 215 },
  C: { cx: 520, cy: 330 },
};

// Radius mapping. Keep overlaps stable by keeping a base and scaling gently.
const R_BASE = 165;
const R_MIN = 120;
const R_MAX = 210;

// Soft mapping. Weight in [0,1] maps to radius range.
function weightToRadius(w){
  const x = Math.max(0, Math.min(1, w));
  const r = R_MIN + (R_MAX - R_MIN) * x;
  // Blend toward base for stability
  return 0.55 * R_BASE + 0.45 * r;
}

function applyCircles({ intimacy, passion, commitment }){
  const rI = weightToRadius(intimacy);
  const rP = weightToRadius(passion);
  const rC = weightToRadius(commitment);

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

  // Clip circles used by highlight regions
  clipI.setAttribute("cx", centers.I.cx);
  clipI.setAttribute("cy", centers.I.cy);
  clipI.setAttribute("r", rI);

  clipP.setAttribute("cx", centers.P.cx);
  clipP.setAttribute("cy", centers.P.cy);
  clipP.setAttribute("r", rP);

  clipC.setAttribute("cx", centers.C.cx);
  clipC.setAttribute("cy", centers.C.cy);
  clipC.setAttribute("r", rC);

  // Pairwise and triple clips need matching radii too
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

function setIdx(idx){
  const max = milestones.length - 1;
  const i = Math.max(0, Math.min(max, idx));

  slider.max = String(max);
  slider.value = String(i);

  const m = milestones[i];
  milestoneTitle.textContent = m.title;
  milestoneText.textContent = m.text;
  milestoneMeta.textContent = `Milestone ${i + 1} of ${milestones.length}`;

  applyCircles(m.weights);

  // In lovers mode, also auto-highlight the dominant region as a nice cue
  const w = m.weights;
  const hasI = w.intimacy > 0.55;
  const hasP = w.passion > 0.45;
  const hasC = w.commitment > 0.55;

  let region = null;
  if (hasI && hasP && hasC) region = "IPC";
  else if (hasI && hasC) region = "IC";
  else if (hasI && hasP) region = "IP";
  else if (hasP && hasC) region = "PC";
  else if (w.intimacy >= w.passion && w.intimacy >= w.commitment) region = "I";
  else if (w.passion >= w.intimacy && w.passion >= w.commitment) region = "P";
  else region = "C";

  setActiveRegion(region);
}

slider.addEventListener("input", (e) => setIdx(parseInt(e.target.value, 10)));
prevBtn.addEventListener("click", () => setIdx(parseInt(slider.value, 10) - 1));
nextBtn.addEventListener("click", () => setIdx(parseInt(slider.value, 10) + 1));

// Init
setMode("nerds");
applyCircles(milestones[0].weights);
setIdx(0);
