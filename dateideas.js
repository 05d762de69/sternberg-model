// dateideas.js (REPLACE. Long-distance-first filters + ideas)

const grid = document.getElementById("ideasGrid");
const meta = document.getElementById("ideasMeta");
const shuffleBtn = document.getElementById("shuffleBtn");

const deckButtons = Array.from(document.querySelectorAll(".deck-card"));
const chips = Array.from(document.querySelectorAll(".chip"));

let activeCat = "I";
let activeFilter = "all";

/*
Tags used:
  sync, async
  low
  deep
  play
  surprise
*/

const IDEAS = [
  // -------------------------
  // INTIMACY (I)
  // -------------------------
  {
    cat: "I",
    title: "Two questions, no advice",
    note: "Pick two questions each. Rule: reflect, do not solve.",
    tags: ["sync", "deep", "low"],
    time: "25–45m",
  },
  {
    cat: "I",
    title: "Parallel life. video call co-work",
    note: "You both do your thing. occasional eye contact. tiny check-ins.",
    tags: ["sync", "low"],
    time: "30–90m",
  },
  {
    cat: "I",
    title: "Voice note diary swap",
    note: "One voice note each. one moment. one feeling. one wish.",
    tags: ["async", "deep", "low"],
    time: "10–15m",
  },
  {
    cat: "I",
    title: "Memory lane. photo prompt",
    note: "Pick a prompt: first week, best laugh, weird detail. send 3 photos and the story.",
    tags: ["async", "deep"],
    time: "15–30m",
  },
  {
    cat: "I",
    title: "Read to each other",
    note: "One page each. prose, poem, or a chapter. slow and cozy.",
    tags: ["sync", "deep", "low"],
    time: "20–40m",
  },

  // -------------------------
  // PASSION (P)
  // -------------------------
  {
    cat: "P",
    title: "Flirt challenge. 10 messages",
    note: "Set a timer. 10 flirty messages each. escalating. playful rules.",
    tags: ["async", "play", "low"],
    time: "10–20m",
  },
  {
    cat: "P",
    title: "Co-watch something hot and dumb",
    note: "Pick a show or movie. comment live. no multitasking.",
    tags: ["sync", "play", "low"],
    time: "60–120m",
  },
  {
    cat: "P",
    title: "Playlist duel",
    note: "Five songs each. one sentence per song explaining why it fits you two.",
    tags: ["async", "play", "deep"],
    time: "20–35m",
  },
  {
    cat: "P",
    title: "Tiny dare roulette",
    note: "Write 8 dares each. swap. roll a die. keep it tasteful.",
    tags: ["sync", "play"],
    time: "20–45m",
  },
  {
    cat: "P",
    title: "Surprise delivery. same snack",
    note: "Send the same snack to both locations. unbox together. rate it.",
    tags: ["surprise", "sync", "play"],
    time: "20–40m",
  },

  // -------------------------
  // COMMITMENT (C)
  // -------------------------
  {
    cat: "C",
    title: "Weekly ritual blueprint",
    note: "Decide one recurring ritual until April. lock a day, duration, and backup plan.",
    tags: ["sync", "low"],
    time: "20–40m",
  },
  {
    cat: "C",
    title: "April reunion draft",
    note: "Pick top 3 priorities for the first 48 hours. book one thing. leave space for chaos.",
    tags: ["sync", "deep"],
    time: "30–60m",
  },
  {
    cat: "C",
    title: "Care package. theme box",
    note: "Choose a theme: calm, energy, study, cozy. include one handwritten note.",
    tags: ["async", "surprise", "deep"],
    time: "30–90m",
  },
  {
    cat: "C",
    title: "Shared doc. Future Us",
    note: "Create one page: rituals, places, boundaries, tiny promises. revisit monthly.",
    tags: ["async", "deep"],
    time: "25–60m",
  },
  {
    cat: "C",
    title: "Micro-budget plan",
    note: "Set a small monthly spend for long-distance joy. decide what counts.",
    tags: ["sync", "low"],
    time: "15–30m",
  },
];

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prettyCat(cat) {
  if (cat === "I") return "Intimacy";
  if (cat === "P") return "Passion";
  return "Commitment";
}

function filterIdeas() {
  const byCat = IDEAS.filter((x) => x.cat === activeCat);
  if (activeFilter === "all") return byCat;

  if (activeFilter === "sync") return byCat.filter((x) => x.tags.includes("sync"));
  if (activeFilter === "async") return byCat.filter((x) => x.tags.includes("async"));
  if (activeFilter === "low") return byCat.filter((x) => x.tags.includes("low"));
  if (activeFilter === "deep") return byCat.filter((x) => x.tags.includes("deep"));
  if (activeFilter === "play") return byCat.filter((x) => x.tags.includes("play"));
  if (activeFilter === "surprise") return byCat.filter((x) => x.tags.includes("surprise"));

  return byCat;
}

function clearNode(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

function el(tag, attrs = {}, text = "") {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, String(v)));
  if (text) n.textContent = text;
  return n;
}

function render() {
  const items = filterIdeas();
  clearNode(grid);

  const catName = prettyCat(activeCat);
  const filterName =
    activeFilter === "all" ? "All filters"
      : activeFilter === "sync" ? "Together now"
      : activeFilter === "async" ? "Send and wait"
      : activeFilter === "low" ? "Low effort"
      : activeFilter === "deep" ? "Deep talk"
      : activeFilter === "play" ? "Playful"
      : "Surprise";

  meta.textContent = `Showing ${catName}. ${filterName}.`;

  items.forEach((it) => {
    const card = el("article", { class: `idea-card idea-${it.cat.toLowerCase()}` });

    const top = el("div", { class: "idea-top" });
    const dot = el("div", { class: `idea-dot idea-dot-${it.cat.toLowerCase()}`, "aria-hidden": "true" });
    const title = el("h3", { class: "idea-title" }, it.title);

    top.appendChild(dot);
    top.appendChild(title);

    const note = el("p", { class: "idea-note" }, it.note);

    const metaRow = el("div", { class: "idea-meta" });
    metaRow.appendChild(el("span", { class: "pill" }, it.time));

    const tagRow = el("div", { class: "idea-tags" });
    it.tags.forEach((t) => tagRow.appendChild(el("span", { class: "pill pill-faint" }, t)));

    card.appendChild(top);
    card.appendChild(note);
    card.appendChild(metaRow);
    card.appendChild(tagRow);

    grid.appendChild(card);
  });

  if (items.length === 0) {
    const empty = el("div", { class: "empty" });
    empty.appendChild(el("div", { class: "empty-title" }, "No matches"));
    empty.appendChild(el("div", { class: "empty-sub" }, "Try a different filter."));
    grid.appendChild(empty);
  }
}

function setActiveCat(cat) {
  activeCat = cat;

  deckButtons.forEach((b) => {
    const on = b.dataset.cat === cat;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", String(on));
  });

  render();
}

function setActiveFilter(f) {
  activeFilter = f;

  chips.forEach((c) => {
    const on = c.dataset.filter === f;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-pressed", String(on));
  });

  render();
}

deckButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveCat(btn.dataset.cat));
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => setActiveFilter(chip.dataset.filter));
});

shuffleBtn?.addEventListener("click", () => {
  shuffleInPlace(IDEAS);
  render();
});

setActiveCat("I");
setActiveFilter("all");
