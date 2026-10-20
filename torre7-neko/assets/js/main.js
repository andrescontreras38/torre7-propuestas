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
  redes: { facebook: "", instagram: "", linkedin: "" }   // PENDIENTE
};

document.documentElement.classList.remove("no-js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- header + hero que se encoge ---------- */
const header = $("#header");
const hero = $("#inicio");
const frame = $("#heroFrame");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 30);
  const r = hero.getBoundingClientRect();
  const p = Math.min(Math.max(-r.top / (innerHeight * .7), 0), 1);
  frame.style.setProperty("--p", reduceMotion ? 1 : p.toFixed(3));
};
onScroll();
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

const burger = $("#burger");
const setMenu = (open) => {
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- servicios (acordeón) ---------- */
const svcItems = [...document.querySelectorAll(".svc__item")];
svcItems.forEach((item) => {
  const btn = item.querySelector(".svc__row");
  btn.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    svcItems.forEach((x) => { x.classList.remove("is-open"); x.querySelector(".svc__row").setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
  });
});

/* ---------- líneas con pestañas ---------- */
const LINEAS = [
  { img: "assets/img/proyecta.webp", alt: "Integrantes de una organización social trabajando juntos",
    lead: "Fortalecimiento organizacional y gestión de proyectos. La línea central de nuestra propuesta de valor.",
    items: ["Diagnóstico y fortalecimiento organizacional", "Planeación estratégica y formulación de proyectos", "Financiación, seguimiento y sostenibilidad", "Membresías Basic, Standard y Premium"],
    link: "#servicios", linkTxt: "Ver servicios" },
  { img: "assets/img/capacita.webp", alt: "Facilitadora orientando un taller de formación",
    lead: "Formación y desarrollo de capacidades para equipos de organizaciones sociales. Presencial, virtual o combinada.",
    items: ["Cursos y talleres para equipos", "Formación en gestión de proyectos, planeación e indicadores", "Programas formativos a la medida", "Guías y materiales de aprendizaje"],
    link: "#contacto", linkTxt: "Solicitar información", interes: "Torre 7 Capacita – Formación" },
  { img: "assets/img/innova.webp", alt: "Equipo en un taller de ideación con notas adhesivas",
    lead: "Innovación y transformación organizacional, con soluciones ajustadas a los recursos y necesidades de cada organización.",
    items: ["Diagnóstico de oportunidades de innovación", "Diseño de soluciones y mejora de procesos", "Talleres de ideación y cocreación", "Diseño y documentación de iniciativas piloto"],
    link: "#contacto", linkTxt: "Solicitar información", interes: "Torre 7 Innova – Innovación" },
  { img: "assets/img/investiga.webp", alt: "Entrevista de investigación aplicada",
    lead: "Investigación aplicada y generación de conocimiento para decidir con información.",
    items: ["Diagnósticos y caracterizaciones", "Diseño de estudios e instrumentos de investigación", "Análisis de información cualitativa y cuantitativa", "Sistematización de experiencias e informes técnicos"],
    link: "#contacto", linkTxt: "Solicitar información", interes: "Torre 7 Investiga – Investigación aplicada" }
];
const tabImg = $("#tabImg"), tabPanel = $("#tabPanel"), tabLink = $("#tabLink");
let tabCurrent = 0;
const renderTab = (i) => {
  const l = LINEAS[i];
  $("#tabLead").textContent = l.lead;
  $("#tabList").innerHTML = l.items.map((t) => `<li>${t}</li>`).join("");
  tabLink.href = l.link;
  $("#tabLinkTxt").textContent = l.linkTxt;
  tabLink.dataset.interes = l.interes || "";
  tabImg.src = l.img; tabImg.alt = l.alt;
};
renderTab(0);
document.querySelectorAll(".tabs button").forEach((b) => {
  b.addEventListener("click", () => {
    const i = +b.dataset.tab; if (i === tabCurrent) return;
    document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    tabImg.classList.add("is-out"); tabPanel.classList.add("is-out");
    setTimeout(() => { renderTab(i); tabImg.classList.remove("is-out"); tabPanel.classList.remove("is-out"); }, 250);
    tabCurrent = i;
  });
});

/* ---------- animaciones de entrada ---------- */
const reveals = document.querySelectorAll(".sec .title, .sec .sub, .svc__item, .qcard, .why__item, .plan, .steps li, .feature-card, .route__box, .faq details, .closing .form");
reveals.forEach((el) => {
  el.classList.add("reveal");
  const sibs = [...el.parentElement.children];
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.07}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* ---------- datos de contacto ---------- */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
$("#contactData").innerHTML = [
  CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">WhatsApp ${CONTACTO.telefono}</a>` : `<span>WhatsApp: ${pend}</span>`,
  CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : `<span>Correo: ${pend}</span>`,
  CONTACTO.ciudad ? `<span>${CONTACTO.ciudad}</span>` : `<span>Ubicación: ${pend}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].join("");
if (CONTACTO.correo) $("#talkLine").textContent = CONTACTO.correo;
$("#year").textContent = new Date().getFullYear();

/* ---------- botones que preseleccionan el interés ---------- */
const interes = $("#interes");
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-interes]");
  if (el && el.dataset.interes) interes.value = el.dataset.interes;
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
document.querySelectorAll(".chips").forEach((group) => {
  group.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    routeSel[group.dataset.group] = b.dataset.v;
    if (group.dataset.group === "necesidad") routeSel.necesidadTxt = b.textContent.trim();
    const r = RUTAS[routeSel.necesidad];
    if (r) { $("#rTitle").textContent = r.t; $("#rText").textContent = r.d; $("#routeResult").hidden = false; }
  });
});

/* ---------- formulario -> WhatsApp (o correo) ---------- */
const form = $("#form");
const msg = $("#formMsg");
const submitBtn = form.querySelector("button[type=submit]");
if (!CONTACTO.whatsapp && CONTACTO.correo) submitBtn.firstChild.textContent = "Enviar solicitud por correo ";

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
