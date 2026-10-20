/* ==========================================================
   RED DE ESAL — repositorio de organizaciones
   ----------------------------------------------------------
   Para agregar una organización, copia una línea dentro de
   RED_ESAL y cambia los datos. Ejemplo:
   { nombre: "Fundación Ejemplo", tipo: "esal", ciudad: "Medellín", web: "https://..." },
   tipo puede ser: "aliado", "esal" u "organizacion".
   La web es opcional (si se deja "", la tarjeta no es enlace).
   ========================================================== */
const RED_ESAL = [
  // PENDIENTE: agregar aquí las organizaciones reales de la red
];

(() => {
  const sec = document.getElementById("red");
  if (!sec) return;
  const GRUPOS = [
    { id: "aliado", titulo: "Aliados estratégicos" },
    { id: "esal", titulo: "Entidades sin ánimo de lucro" },
    { id: "organizacion", titulo: "Organizaciones sociales" }
  ];
  const groupsEl = sec.querySelector("#redGroups"), search = sec.querySelector("#redSearch"),
        filters = sec.querySelector("#redFilters"), empty = sec.querySelector("#redEmpty");
  let tipo = "todos";
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  filters.innerHTML = [["todos", "Todas"], ...GRUPOS.map((g) => [g.id, g.titulo])]
    .map(([id, t]) => `<button type="button" role="tab" data-tipo="${id}" aria-selected="${id === "todos"}">${t}</button>`).join("");
  const join = '<a href="#contacto" class="red-org red-org--join" data-red-join><b>¿Tu organización es una ESAL?</b><small>Únete a la red →</small></a>';

  const render = () => {
    const q = norm(search.value.trim());
    let shown = 0;
    groupsEl.innerHTML = GRUPOS.filter((g) => tipo === "todos" || g.id === tipo).map((g) => {
      const items = RED_ESAL.filter((o) => o.tipo === g.id && (!q || norm(`${o.nombre} ${o.ciudad || ""}`).includes(q)));
      shown += items.length;
      if (q && !items.length) return "";
      let cards = items.map((o) => {
        const inner = `<b>${esc(o.nombre)}</b>${o.ciudad ? `<small>${esc(o.ciudad)}</small>` : ""}`;
        return o.web ? `<a class="red-org red-org--real" href="${esc(o.web)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="red-org red-org--real">${inner}</div>`;
      }).join("");
      if (!q) cards += '<div class="red-org red-org--soon"><b>Próximamente</b><small>Espacio para una organización de la red</small></div>'.repeat((4 - ((items.length + 1) % 4)) % 4) + join;
      const num = String(GRUPOS.indexOf(g) + 1).padStart(2, "0");
      return `<div class="red-esal__group"><h3 class="red-esal__gtitle"><span>${num}</span>${g.titulo}</h3><div class="red-esal__grid">${cards}</div></div>`;
    }).join("");
    empty.hidden = !(q && shown === 0);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    tipo = b.dataset.tipo;
    filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    render();
  });
  search.addEventListener("input", render);
  // "Únete a la red" deja el formulario listo
  sec.addEventListener("click", (e) => {
    if (!e.target.closest("[data-red-join]")) return;
    const sel = document.getElementById("interes");
    if (sel) sel.value = "Unirme a la Red de ESAL";
    const ta = document.querySelector("#form textarea[name=mensaje]");
    if (ta && !ta.value.trim()) ta.value = "Queremos que nuestra organización haga parte de la Red de ESAL de Torre 7.";
  });
  render();

  // entrada suave
  const els = sec.querySelectorAll(".red-in");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }), { threshold: .15 });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("is-in"));
})();
