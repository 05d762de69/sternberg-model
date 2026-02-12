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
    title: "Talk Proust to me.",
    note: "We pick a set of questions for the other, and talk through them.",
    tags: ["sync", "deep", "low"],
    time: "45–60m",
  },
  {
    cat: "I",
    title: "Video Co-work (most German date ever)",
    note: "We do our thing. Occasional awkward eye contact.",
    tags: ["sync", "low"],
    time: "60–90m",
  },
  {
    cat: "I",
    title: "Same Hannes + Rox Adventure, two perspectives",
    note: "We pick a moment, and both describe it.",
    tags: ["async", "deep", "low"],
    time: "10–15m",
  },
  {
    cat: "I",
    title: "Memory lane.",
    note: "We send each other down memory lane with a photo for a given category.",
    tags: ["async", "deep"],
    time: "15–30m",
  },
  {
    cat: "I",
    title: "Read to each other (more like you read to me!)",
    note: "Read me a chapter of whatever. I'll do the same for you if u want.",
    tags: ["sync", "deep", "low"],
    time: "20–40m",
  },
  {
  cat: "I",
  title: "Fun with maps [NON AUTISTIC]",
  note: "Draw a little life map. Highs, lows, turning points. Explain it.",
  tags: ["sync", "deep"],
  time: "45–60m",
},
{
  cat: "I",
  title: "Sorry, I don't speak \"Rox\"",
  note: "Explain something you love in a way I would understand it.",
  tags: ["sync", "deep"],
  time: "30–45m",
},
{
  cat: "I",
  title: "Insta-Therapist.",
  note: "We take turns psychoanalyzing each other like we just read one book.",
  tags: ["sync", "deep", "play"],
  time: "20–40m",
},

  // -------------------------
  // PASSION (P)
  // -------------------------
  {
    cat: "P",
    title: "Watch something hot and dumb with me.",
    note: "I hate it, but let's watch Love Island or something crappy.",
    tags: ["sync", "play", "low"],
    time: "60–120m",
  },
  {
    cat: "P",
    title: "That's like literally so us omg",
    note: "Each pick one song. Eplain why it fits us. Yes, you may translate a French one.🙄",
    tags: ["async", "play", "deep"],
    time: "20–35m",
  },
  {
    cat: "P",
    title: "Like we're 12 again.",
    note: "Write 8 dares each. Swap. Roll a die.",
    tags: ["sync", "play"],
    time: "20–45m",
  },
  {
    cat: "P",
    title: "Can't cook for us.",
    note: "Let's cook a dish together and get wine drunk.",
    tags: ["surprise", "sync", "play"],
    time: "60-90m",
  },
  {
  cat: "P",
  title: "Speed cringe.",
  note: "5 minutes. Pretend we just met. Maximum charm (read: cringe).",
  tags: ["sync", "play"],
  time: "10–20m",
},
{
  cat: "P",
  title: "If you know your bf, which X would he choose.",
  note: "We recreate these cringe insta posts in our own categories and make the other choose.",
  tags: ["async", "play"],
  time: "20–30m",
},
{
  cat: "P",
  title: "Accidental thirst trap.",
  note: "Try to look hot while doing something deeply unsexy.",
  tags: ["sync", "play"],
  time: "15–20m",
},

  // -------------------------
  // COMMITMENT (C)
  // -------------------------
  {
    cat: "C",
    title: "13 Apr Draft",
    note: "What are top 3 priorities for our first 48 hours. Book one thing, but leave space for chaos.",
    tags: ["sync", "deep"],
    time: "30–60m",
  },
  {
    cat: "C",
    title: "Postcard from...us?!",
    note: "Let's write a postcard to us from us six months from now.",
    tags: ["async", "deep"],
    time: "15–25m",
  },
  {
    cat: "C",
    title: "Future.xlsx or .docx or whatever",
    note: "Create one doc where we dream a bit: rituals, places, boundaries, tiny promises.",
    tags: ["async", "deep"],
    time: "25–60m",
  },
  {
  cat: "C",
  title: "Fight me, bro.",
  note: "We pick a minor disagreement. Practice handling it well. (So you stop punching)",
  tags: ["sync", "deep"],
  time: "25–40m",
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
