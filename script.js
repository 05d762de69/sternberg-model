// script.js

const startBtn = document.getElementById("startBtn");
const peekBtn = document.getElementById("peekBtn");
const panel = document.getElementById("panel");
const afterStart = document.getElementById("afterStart");
const card = document.querySelector(".card");

function toggle(el){
  el.hidden = !el.hidden;
}

peekBtn.addEventListener("click", () => {
  toggle(panel);
  if (!panel.hidden) {
    afterStart.hidden = true;
    startBtn.focus();
  }
});

startBtn.addEventListener("click", () => {
  try {
    localStorage.setItem("ourTriangle_started", "true");
    localStorage.setItem("ourTriangle_startedAt", new Date().toISOString());
  } catch (_) {}

  panel.hidden = true;

  card.classList.add("fade-out");

  window.setTimeout(() => {
    card.classList.remove("fade-out");
    afterStart.hidden = false;

    startBtn.disabled = true;
    startBtn.style.opacity = "0.7";
    startBtn.textContent = "Act 1 is coming…";
  }, 220);
});
