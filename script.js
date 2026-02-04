// script.js (update: landing page only needs the "What's this?" toggle now)

const peekBtn = document.getElementById("peekBtn");
const panel = document.getElementById("panel");

function toggle(el){
  el.hidden = !el.hidden;
}

if (peekBtn && panel){
  peekBtn.addEventListener("click", () => toggle(panel));
}
