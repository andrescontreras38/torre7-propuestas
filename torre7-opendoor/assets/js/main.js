/* ==========================================================
   Torre 7 Soluciones Integrales — interacciones
   ========================================================== */

/* ----------------------------------------------------------
   DATOS DE CONTACTO — completar cuando el cliente los envíe.
   whatsapp: solo números con indicativo, ej. "573001234567"
   ---------------------------------------------------------- */
const CONTACTO = {
  whatsapp: "",   // PENDIENTE
  telefono: "",   // PENDIENTE, ej. "+57 300 123 4567"
  correo: "torre7.colombia@gmail.com",     // correo oficial del cliente
  ciudad: "",     // PENDIENTE, ej. "Medellín, Colombia"
  redes: {        // PENDIENTE: dejar "" las que no tengan
    facebook: "",
    instagram: "",
    linkedin: ""
  }
};

document.documentElement.classList.remove("no-js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- aviso superior ---------- */
$("#announceClose").addEventListener("click", () => $("#announce").classList.add("is-hidden"));

/* ---------- header ---------- */
const header = $("#header");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 10);
  document.getElementById("waFloat").classList.toggle("is-on", scrollY > innerHeight * .6);
};
onScroll();
addEventListener("scroll", onScroll, { passive: true });

const burger = $("#burger");
const setMenu = (open) => {
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- palabra que cambia ---------- */
const WORDS = ["diagnóstico", "plan estratégico", "marco lógico", "seguimiento", "presupuesto", "cronograma"];
const swapWord = $("#swapWord");
if (!reduceMotion) {
  let w = 0;
  setInterval(() => {
    swapWord.classList.add("is-out");
    setTimeout(() => { w = (w + 1) % WORDS.length; swapWord.textContent = WORDS[w]; swapWord.classList.remove("is-out"); }, 300);
  }, 2200);
}

/* ---------- carrusel ---------- */
const carousel = $("#carousel");
const step = () => carousel.querySelector(".lcard").offsetWidth + 20;
$("#prevLine").addEventListener("click", () => carousel.scrollBy({ left: -step(), behavior: "smooth" }));
$("#nextLine").addEventListener("click", () => carousel.scrollBy({ left: step(), behavior: "smooth" }));
const syncCtrl = () => {
  $("#prevLine").disabled = carousel.scrollLeft < 4;
  $("#nextLine").disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
};
carousel.addEventListener("scroll", syncCtrl, { passive: true });
addEventListener("resize", syncCtrl);
syncCtrl();

/* ---------- acordeón de servicios + tarjeta del collage ---------- */
const DELIV = [
  ["Diagnóstico", "Matriz de oportunidades", "Recomendaciones priorizadas"],
  ["Plan estratégico", "Plan de acción", "Matriz de indicadores"],
  ["Perfil de proyecto", "Marco lógico", "Presupuesto y cronograma"],
  ["Matriz de oportunidades", "Criterios de elegibilidad", "Hoja de ruta para postular"],
  ["Indicadores", "Instrumentos de seguimiento", "Matrices de resultados e informes"],
  ["Diagnóstico de sostenibilidad", "Plan de mejora", "Recomendaciones de gestión"]
];
const items = [...document.querySelectorAll("#services .acc__item")];
const note = document.querySelector(".collage__note");
const setNote = (i) => {
  note.classList.add("is-out");
  setTimeout(() => {
    $("#noteTag").textContent = `Servicio ${String(i + 1).padStart(2, "0")}`;
    $("#noteTitle").textContent = items[i].querySelector(".acc__btn").childNodes[1].textContent.trim();
    $("#noteList").innerHTML = DELIV[i].map((d) => `<li>${d}</li>`).join("");
    note.classList.remove("is-out");
  }, 200);
};
items.forEach((item, i) => {
  item.querySelector(".acc__btn").addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    items.forEach((x) => { x.classList.remove("is-open"); x.querySelector(".acc__btn").setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("is-open"); item.querySelector(".acc__btn").setAttribute("aria-expanded", "true"); setNote(i); }
  });
});

/* ---------- animaciones de entrada ---------- */
const reveals = document.querySelectorAll(".reveal");
reveals.forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* ---------- datos de contacto ---------- */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Correo</small>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad ? `<strong>${CONTACTO.ciudad}</strong>` : pend}</li>`;
const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
$("#footerContact").innerHTML = [
  CONTACTO.whatsapp && `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  CONTACTO.correo && `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>`,
  CONTACTO.ciudad && `<span>${CONTACTO.ciudad}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].filter(Boolean).join("") || '<a href="#contacto">Escríbenos</a>';
const waFloat = $("#waFloat");
if (CONTACTO.whatsapp) {
  waFloat.href = waLink("Hola Torre 7, quiero solicitar una asesoría inicial.");
  waFloat.target = "_blank"; waFloat.rel = "noopener";
}
$("#year").textContent = new Date().getFullYear();

/* ---------- botones que preseleccionan el interés ---------- */
const interes = $("#interes");
document.querySelectorAll("[data-interes]").forEach((btn) => {
  btn.addEventListener("click", () => { interes.value = btn.dataset.interes; });
});

/* ---------- encuentra tu ruta ---------- */
const RUTAS = {
  ordenar:    { t: "Diagnóstico y fortalecimiento organizacional", d: "Identificamos capacidades, necesidades y oportunidades de mejora, y te entregamos recomendaciones priorizadas. Puedes complementarlo con la Membresía Basic.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  planear:    { t: "Planeación estratégica y organizacional", d: "Definimos contigo objetivos, prioridades, estrategias e indicadores, con un plan de acción y su esquema de seguimiento.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  proyecto:   { t: "Formulación y estructuración de proyectos", d: "Convertimos tu idea en un proyecto con objetivos, actividades, recursos, resultados e indicadores: perfil, marco lógico, presupuesto y cronograma.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  financiar:  { t: "Financiación y cooperación", d: "Identificamos oportunidades pertinentes, analizamos criterios de elegibilidad y armamos la hoja de ruta para postular. No implica garantizar financiación.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  medir:      { t: "Seguimiento, evaluación e impacto", d: "Diseñamos indicadores e instrumentos para monitorear actividades, resultados y avances hacia tus objetivos.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  formar:     { t: "Torre 7 Capacita", d: "Cursos, talleres y programas a la medida en gestión de proyectos, planeación e indicadores. Presencial, virtual o combinada.", i: "Torre 7 Capacita – Formación" },
  innovar:    { t: "Torre 7 Innova", d: "Diagnóstico de oportunidades, talleres de ideación y cocreación, mejora de procesos y diseño de iniciativas piloto.", i: "Torre 7 Innova – Innovación" },
  investigar: { t: "Torre 7 Investiga", d: "Diagnósticos, caracterizaciones, diseño de instrumentos, análisis cualitativo y cuantitativo, y sistematización de experiencias.", i: "Torre 7 Investiga – Investigación aplicada" },
  continuo:   { t: "Membresía Standard o Premium", d: "Asesoría individual, hoja de ruta y revisión periódica de avances. Si necesitas mentoría estratégica e integral, la Premium es para ti.", i: "Membresía Standard" }
};
const routeSel = { tipo: null, necesidad: null, necesidadTxt: "" };
const rBox = $("#routeResult");
const showRoute = () => {
  const r = RUTAS[routeSel.necesidad]; if (!r) return;
  $("#rTitle").textContent = r.t;
  $("#rText").textContent = r.d;
  rBox.hidden = false;
};
const pick = (group, value) => {
  const g = document.querySelector(`.chips-select[data-group="${group}"]`);
  g.querySelectorAll("button").forEach((x) => {
    const on = x.dataset.v === value;
    x.setAttribute("aria-checked", String(on));
    if (on && group === "necesidad") routeSel.necesidadTxt = x.textContent.trim();
  });
  routeSel[group] = value;
};
document.querySelectorAll(".chips-select").forEach((group) => {
  group.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    pick(group.dataset.group, b.dataset.v);
    if (routeSel.necesidad) showRoute();
  });
});

/* buscador del hero -> recomendación */
$("#finder").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#finderSelect").value; if (!v) return;
  pick("necesidad", v);
  showRoute();
  $("#ruta").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});
$("#finderSelect").addEventListener("change", () => $("#finder").requestSubmit());

/* ---------- formulario -> WhatsApp (o correo) ---------- */
const form = $("#form");
const msg = $("#formMsg");
const submitBtn = form.querySelector("button[type=submit]");
if (!CONTACTO.whatsapp && CONTACTO.correo) submitBtn.textContent = "Enviar solicitud por correo";

$("#rCta").addEventListener("click", () => {
  const r = RUTAS[routeSel.necesidad]; if (!r) return;
  interes.value = r.i;
  const ta = form.querySelector("textarea[name=mensaje]");
  const quien = routeSel.tipo ? `Somos ${routeSel.tipo} y necesitamos` : "Necesitamos";
  if (!ta.value.trim()) ta.value = `${quien} ${routeSel.necesidadTxt}. Nos interesa: ${r.t}.`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.closest(".field").classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = "Por favor completa los campos marcados."; return; }

  const d = Object.fromEntries(new FormData(form));
  const texto =
`Hola Torre 7, quiero solicitar información.

*Nombre:* ${d.nombre}
*Organización:* ${d.organizacion}
*Correo:* ${d.correo}
*Teléfono:* ${d.telefono || "-"}
*Interés:* ${d.interes}

${d.mensaje}`;

  if (CONTACTO.whatsapp) {
    window.open(waLink(texto), "_blank", "noopener");
    msg.textContent = "¡Gracias! Te abrimos WhatsApp para enviar tu solicitud.";
  } else if (CONTACTO.correo) {
    location.href = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent("Solicitud: " + d.interes)}&body=${encodeURIComponent(texto.replace(/\*/g, ""))}`;
    msg.textContent = "¡Gracias! Abrimos tu correo para enviar la solicitud.";
  } else {
    msg.textContent = "Formulario en configuración: faltan los datos de contacto de Torre 7.";
  }
});
