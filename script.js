const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
document.getElementById("year").textContent = new Date().getFullYear();

let current = "All";
let visible = [];
let index = 0;

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderFilters() {
  const cats = ["All", ...new Set(PHOTOS.map(p => p.category).filter(Boolean))];
  filtersEl.innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.textContent = c;
    if (c === current) b.classList.add("active");
    b.onclick = () => { current = c; renderFilters(); renderGrid(); };
    filtersEl.appendChild(b);
  });
}

function renderGrid() {
  visible = PHOTOS.filter(p => current === "All" || p.category === current);
  grid.innerHTML = "";
  visible.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img loading="lazy" src="${esc(p.file)}" alt="${esc(p.title)}"><div class="label">${esc(p.title)}</div>`;
    card.onclick = () => open(i);
    grid.appendChild(card);
  });
}

function show() {
  const p = visible[index];
  lbImg.src = p.file;
  lbImg.alt = p.title;
  const details = [p.date, p.camera, p.optics, p.exposure].filter(Boolean).map(esc).join(" · ");
  lbCap.innerHTML = `<strong>${esc(p.title)}</strong>${details}${p.notes ? "<br>" + esc(p.notes) : ""}`;
}
function open(i) { index = i; show(); lb.hidden = false; document.body.style.overflow = "hidden"; }
function close() { lb.hidden = true; document.body.style.overflow = ""; }
function step(d) { index = (index + d + visible.length) % visible.length; show(); }

document.getElementById("close").onclick = close;
document.getElementById("prev").onclick = () => step(-1);
document.getElementById("next").onclick = () => step(1);
lb.addEventListener("click", e => { if (e.target === lb) close(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

renderFilters();
renderGrid();
