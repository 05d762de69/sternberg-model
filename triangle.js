// triangle.js (NEW: toggle between Nerds/Lovers + timeline-driven dot inside triangle)

// --- Mode toggle ---
const nerdsTab = document.getElementById("nerdsTab");
const loversTab = document.getElementById("loversTab");
const nerdsPane = document.getElementById("nerdsPane");
const loversPane = document.getElementById("loversPane");
const nerdRegions = document.getElementById("nerdRegions");

function setMode(mode){
  const nerds = mode === "nerds";

  nerdsTab.classList.toggle("is-active", nerds);
  loversTab.classList.toggle("is-active", !nerds);

  nerdsTab.setAttribute("aria-selected", String(nerds));
  loversTab.setAttribute("aria-selected", String(!nerds));

  nerdsPane.hidden = !nerds;
  loversPane.hidden = nerds;

  // show/hide the generic region labels
  nerdRegions.style.display = nerds ? "block" : "none";

  // small copy tweak
  const lede = document.getElementById("lede");
  lede.textContent = nerds
    ? "Three components. Different mixtures. Different kinds of love."
    : "Same triangle. But now it’s ours.";
}

nerdsTab.addEventListener("click", () => setMode("nerds"));
loversTab.addEventListener("click", () => setMode("lovers"));


// --- Milestones (edit these for your story) ---
// weights are in [0,1]. We normalize them to place a dot in the triangle.
const milestones = [
  {
    title: "A starting point",
    text: "Replace this with the moment you realized: oh. this is safe. this is real.",
    weights: { intimacy: 0.70, passion: 0.20, commitment: 0.55 },
  },
  {
    title: "We became a team",
    text: "A small moment where you felt commitment without needing the word.",
    weights: { intimacy: 0.75, passion: 0.25, commitment: 0.65 },
  },
  {
    title: "Romantic energy arrived",
    text: "The first time it felt like more than closeness. It felt like pull.",
    weights: { intimacy: 0.78, passion: 0.45, commitment: 0.70 },
  },
  {
    title: "Long distance, still us",
    text: "Distance didn’t delete it. It clarified it.",
    weights: { intimacy: 0.82, passion: 0.55, commitment: 0.80 },
  },
  {
    title: "The outlook",
    text: "The part where we keep choosing this. With plans. With play. With patience.",
    weights: { intimacy: 0.85, passion: 0.62, commitment: 0.88 },
  },
];


// --- Triangle mapping ---
// Triangle corners in SVG coordinates:
const P = { x: 260, y: 40  };  // Passion (top)
const I = { x: 60,  y: 410 };  // Intimacy (bottom-left)
const C = { x: 460, y: 410 };  // Commitment (bottom-right)

function clamp01(v){
  return Math.max(0, Math.min(1, v));
}

function normalizeWeights(w){
  const i = clamp01(w.intimacy);
  const p = clamp01(w.passion);
  const c = clamp01(w.commitment);
  const s = i + p + c;
  if (s <= 0.00001) return { i: 1/3, p: 1/3, c: 1/3 };
  return { i: i/s, p: p/s, c: c/s };
}

function baryToXY(b){
  // linear combination of corners
  const x = b.p * P.x + b.i * I.x + b.c * C.x;
  const y = b.p * P.y + b.i * I.y + b.c * C.y;
  return { x, y };
}


// --- Timeline UI ---
const slider = document.getElementById("timeline");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const milestoneTitle = document.getElementById("milestoneTitle");
const milestoneText = document.getElementById("milestoneText");
const milestoneMeta = document.getElementById("milestoneMeta");

const dot = document.getElementById("stateDot");
const halo = document.getElementById("stateHalo");
const weightsText = document.getElementById("weightsText");
const statePill = document.getElementById("statePill");

function setIdx(idx){
  const max = milestones.length - 1;
  const i = Math.max(0, Math.min(max, idx));

  slider.max = String(max);
  slider.value = String(i);

  const m = milestones[i];

  milestoneTitle.textContent = m.title;
  milestoneText.textContent = m.text;
  milestoneMeta.textContent = `Milestone ${i + 1} of ${milestones.length}`;

  const b = normalizeWeights(m.weights);
  const xy = baryToXY(b);

  dot.setAttribute("cx", String(xy.x));
  dot.setAttribute("cy", String(xy.y));
  halo.setAttribute("cx", String(xy.x));
  halo.setAttribute("cy", String(xy.y));

  weightsText.textContent =
    `Intimacy ${m.weights.intimacy.toFixed(2)} · Passion ${m.weights.passion.toFixed(2)} · Commitment ${m.weights.commitment.toFixed(2)}`;

  // MVP state label. We’ll refine this logic later.
  const label =
    (m.weights.intimacy > 0.55 && m.weights.commitment > 0.55 && m.weights.passion < 0.35)
      ? "Companionate"
      : (m.weights.intimacy > 0.55 && m.weights.passion > 0.45)
        ? "Romantic"
        : "Our mix";

  statePill.textContent = `State: ${label}`;
}

slider.addEventListener("input", (e) => setIdx(parseInt(e.target.value, 10)));

prevBtn.addEventListener("click", () => {
  setIdx(parseInt(slider.value, 10) - 1);
});

nextBtn.addEventListener("click", () => {
  setIdx(parseInt(slider.value, 10) + 1);
});


// --- Init ---
setMode("nerds");     // default view
setIdx(0);            // default milestone
