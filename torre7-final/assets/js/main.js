/* ==========================================================
   Torre 7 Soluciones Integrales — VERSIÓN FINAL
   Diseño Moderna Pro + estructura de Neko Health
   ========================================================== */

/* ----------------------------------------------------------
   DATOS DE CONTACTO — completar los que falten.
   whatsapp: solo números con indicativo, ej. "573001234567"
   ---------------------------------------------------------- */
const CONTACTO = {
  whatsapp: "",                             // PENDIENTE
  telefono: "",                             // PENDIENTE, ej. "+57 300 123 4567"
  correo: "torre7.colombia@gmail.com",      // correo oficial del cliente
  ciudad: "",                               // PENDIENTE, ej. "Medellín, Colombia"
  redes: { facebook: "", instagram: "", linkedin: "" }   // PENDIENTE
};

document.documentElement.classList.remove("no-js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- encabezado, progreso, botón fijo y foto de portada ---------- */
const header = $("#header"), progress = $("#progress"), sticky = $("#stickyCta"), contactSec = $("#contacto");
const hero = $("#inicio"), frame = $("#heroFrame");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 10);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const c = contactSec.getBoundingClientRect();
  sticky.classList.toggle("is-on", scrollY > innerHeight * .9 && !(c.top < innerHeight && c.bottom > 0));
  const r = hero.getBoundingClientRect();
  const p = reduce ? 1 : Math.min(Math.max(-r.top / (innerHeight * .65), 0), 1);
  frame.style.setProperty("--p", p.toFixed(3));
};
onScroll();
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

/* menú móvil */
const burger = $("#burger");
const setMenu = (open) => {
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
$$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* tarjetas flotantes que siguen al ratón */
if (fine && !reduce) {
  const fls = $$(".fl");
  hero.addEventListener("pointermove", (ev) => {
    const dx = ev.clientX / innerWidth - .5, dy = ev.clientY / innerHeight - .5;
    fls.forEach((f) => { const d = +f.dataset.depth; f.style.translate = `${dx * d}px ${dy * d}px`; });
  });
}

/* ---------- servicios: filas + tarjeta con brillo ---------- */
const SERVICIOS = [
  { t: "Diagnóstico y fortalecimiento organizacional", d: "Identificación de capacidades, necesidades y oportunidades de mejora.", e: ["Diagnóstico", "Matriz de oportunidades", "Recomendaciones priorizadas"] },
  { t: "Planeación estratégica y organizacional", d: "Acompañamiento en la definición de objetivos, prioridades, estrategias e indicadores.", e: ["Plan estratégico", "Plan de acción", "Matriz de indicadores", "Esquema de seguimiento"] },
  { t: "Formulación y estructuración de proyectos", d: "Transformación de necesidades e ideas en proyectos con objetivos, actividades, recursos, resultados e indicadores.", e: ["Perfil de proyecto", "Marco lógico", "Presupuesto y cronograma"] },
  { t: "Financiación y cooperación", d: "Identificación y análisis de oportunidades de financiación y cooperación pertinentes para la organización.", e: ["Matriz de oportunidades", "Criterios de elegibilidad", "Hoja de ruta para la postulación"], n: "No implica garantizar financiación ni aprobación." },
  { t: "Seguimiento, evaluación e impacto", d: "Diseño de herramientas para monitorear actividades, resultados y avances hacia los objetivos.", e: ["Indicadores", "Instrumentos de seguimiento", "Matrices de resultados e informes"] },
  { t: "Sostenibilidad organizacional", d: "Acompañamiento para identificar oportunidades de fortalecimiento y mejorar las condiciones de continuidad.", e: ["Diagnóstico de sostenibilidad", "Plan de mejora", "Recomendaciones de gestión"] }
];
const stage = $("#stage"), darkSec = $("#servicios"), rowBtns = $$("#rows button");
const renderSvc = (i) => {
  const s = SERVICIOS[i];
  $("#stNum").textContent = String(i + 1).padStart(2, "0");
  $("#stTitle").textContent = s.t;
  $("#stText").textContent = s.d;
  $("#stList").innerHTML = s.e.map((x) => `<li>${x}</li>`).join("");
  const note = $("#stNote"); note.hidden = !s.n; note.textContent = s.n || "";
};
renderSvc(0);
let svcIdx = 0, svcTimer = null, svcUser = false;
const selectSvc = (i) => {
  if (i === svcIdx) return;
  rowBtns.forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.i === i)));
  stage.classList.add("is-out");
  setTimeout(() => { renderSvc(i); stage.classList.remove("is-out"); }, 220);
  svcIdx = i;
};
rowBtns.forEach((b) => b.addEventListener("click", () => {
  svcUser = true; clearInterval(svcTimer); svcTimer = null;
  selectSvc(+b.dataset.i);
}));
if (!reduce && "IntersectionObserver" in window) {
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !svcTimer && !svcUser) svcTimer = setInterval(() => selectSvc((svcIdx + 1) % SERVICIOS.length), 4000);
    else if (!en.isIntersecting && svcTimer) { clearInterval(svcTimer); svcTimer = null; }
  }, { threshold: .35 }).observe(darkSec);
}
if (fine) darkSec.addEventListener("pointermove", (ev) => {
  const r = darkSec.getBoundingClientRect();
  darkSec.style.setProperty("--mx", `${ev.clientX - r.left}px`);
  darkSec.style.setProperty("--my", `${ev.clientY - r.top}px`);
});

/* ---------- líneas con pestañas ---------- */
const LINEAS = [
  { t: "Torre 7 Proyecta", b: "Línea principal", img: "assets/img/proyecta.webp", alt: "Integrantes de una organización social trabajando juntos",
    lead: "Fortalecimiento organizacional y gestión de proyectos. La línea central de nuestra propuesta de valor.",
    items: ["Diagnóstico y fortalecimiento organizacional", "Planeación estratégica y formulación de proyectos", "Financiación, seguimiento y sostenibilidad", "Membresías Basic, Standard y Premium"],
    link: "#servicios", linkTxt: "Ver servicios →" },
  { t: "Torre 7 Capacita", b: "Complementaria", img: "assets/img/capacita.webp", alt: "Facilitadora orientando un taller de formación",
    lead: "Formación y desarrollo de capacidades para equipos de organizaciones sociales. Presencial, virtual o combinada.",
    items: ["Cursos y talleres para equipos", "Formación en gestión de proyectos, planeación e indicadores", "Programas formativos a la medida", "Guías y materiales de aprendizaje"],
    link: "#contacto", linkTxt: "Solicitar información →", interes: "Torre 7 Capacita – Formación" },
  { t: "Torre 7 Innova", b: "Complementaria", img: "assets/img/innova.webp", alt: "Equipo en un taller de ideación con notas adhesivas",
    lead: "Innovación y transformación organizacional, con soluciones ajustadas a los recursos y necesidades de cada organización.",
    items: ["Diagnóstico de oportunidades de innovación", "Diseño de soluciones y mejora de procesos", "Talleres de ideación y cocreación", "Diseño y documentación de iniciativas piloto"],
    link: "#contacto", linkTxt: "Solicitar información →", interes: "Torre 7 Innova – Innovación" },
  { t: "Torre 7 Investiga", b: "Complementaria", img: "assets/img/investiga.webp", alt: "Entrevista de investigación aplicada",
    lead: "Investigación aplicada y generación de conocimiento para decidir con información.",
    items: ["Diagnósticos y caracterizaciones", "Diseño de estudios e instrumentos de investigación", "Análisis de información cualitativa y cuantitativa", "Sistematización de experiencias e informes técnicos"],
    link: "#contacto", linkTxt: "Solicitar información →", interes: "Torre 7 Investiga – Investigación aplicada" }
];
const tabImg = $("#tabImg"), tabPanel = $("#tabPanel"), tabLink = $("#tabLink");
let tabNow = 0;
const renderTab = (i) => {
  const l = LINEAS[i];
  $("#tabTitle").textContent = l.t;
  $("#tabLead").textContent = l.lead;
  $("#tabList").innerHTML = l.items.map((x) => `<li>${x}</li>`).join("");
  $("#tabBadge").textContent = l.b;
  tabLink.href = l.link; tabLink.textContent = l.linkTxt;
  if (l.interes) tabLink.dataset.interes = l.interes; else delete tabLink.dataset.interes;
  tabImg.src = l.img; tabImg.alt = l.alt;
};
renderTab(0);
$$(".f-tabs__nav button").forEach((b) => b.addEventListener("click", () => {
  const i = +b.dataset.tab; if (i === tabNow) return;
  $$(".f-tabs__nav button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
  tabImg.classList.add("is-out"); tabPanel.classList.add("is-out");
  setTimeout(() => { renderTab(i); tabImg.classList.remove("is-out"); tabPanel.classList.remove("is-out"); }, 260);
  tabNow = i;
}));

/* ---------- inclinación 3D de las frases ---------- */
if (fine && !reduce) {
  $$(".f-q").forEach((card) => {
    card.addEventListener("pointermove", (ev) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--ry", `${((ev.clientX - r.left) / r.width - .5) * 8}deg`);
      card.style.setProperty("--rx", `${-((ev.clientY - r.top) / r.height - .5) * 8}deg`);
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  });
}

/* ---------- animaciones de entrada ---------- */
const reveals = $$(".reveal");
reveals.forEach((el) => {
  const i = [...el.parentElement.children].indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
});
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add("is-in"));

/* ---------- cómo trabajamos: línea que se llena ---------- */
const tl = $("#timeline"), tlFill = $("#tlFill"), tlItems = $$(".tl__item");
const onTimeline = () => {
  const r = tl.getBoundingClientRect();
  tlFill.style.height = `${Math.min(Math.max((innerHeight * .6 - r.top) / r.height, 0), 1) * 100}%`;
  tlItems.forEach((it) => { const ir = it.getBoundingClientRect(); it.classList.toggle("is-on", reduce || ir.top + ir.height / 2 < innerHeight * .62); });
};
onTimeline();
addEventListener("scroll", onTimeline, { passive: true });

/* ---------- ¿por dónde empezar? ---------- */
const RUTAS = {
  ordenar:    { t: "Diagnóstico y fortalecimiento organizacional", d: "Identificamos capacidades, necesidades y oportunidades de mejora, y te entregamos recomendaciones priorizadas. Puedes complementarlo con la Membresía Basic.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  planear:    { t: "Planeación estratégica y organizacional", d: "Definimos contigo objetivos, prioridades, estrategias e indicadores, con un plan de acción y su esquema de seguimiento.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  proyecto:   { t: "Formulación y estructuración de proyectos", d: "Convertimos tu idea en un proyecto: perfil, marco lógico, presupuesto y cronograma, según el alcance acordado.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  financiar:  { t: "Financiación y cooperación", d: "Identificamos oportunidades pertinentes, analizamos criterios de elegibilidad y armamos la hoja de ruta para postular. No implica garantizar financiación.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  medir:      { t: "Seguimiento, evaluación e impacto", d: "Diseñamos indicadores e instrumentos para monitorear actividades, resultados y avances hacia tus objetivos.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  formar:     { t: "Torre 7 Capacita", d: "Cursos, talleres y programas a la medida en gestión de proyectos, planeación e indicadores. Presencial, virtual o combinada.", i: "Torre 7 Capacita – Formación" },
  innovar:    { t: "Torre 7 Innova", d: "Diagnóstico de oportunidades, talleres de ideación y cocreación, mejora de procesos y diseño de iniciativas piloto.", i: "Torre 7 Innova – Innovación" },
  investigar: { t: "Torre 7 Investiga", d: "Diagnósticos, caracterizaciones, diseño de instrumentos, análisis cualitativo y cuantitativo, y sistematización de experiencias.", i: "Torre 7 Investiga – Investigación aplicada" },
  continuo:   { t: "Membresía Standard o Premium", d: "Asesoría individual, hoja de ruta y revisión periódica de avances. Si necesitas mentoría estratégica e integral, la Premium es para ti.", i: "Membresía Standard" }
};
const routeSel = { tipo: null, necesidad: null, necesidadTxt: "" };
$$(".f-chips").forEach((group) => group.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  $$("button", group).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
  routeSel[group.dataset.group] = b.dataset.v;
  if (group.dataset.group === "necesidad") routeSel.necesidadTxt = b.textContent.trim();
  const r = RUTAS[routeSel.necesidad];
  if (r) { $("#rTitle").textContent = r.t; $("#rText").textContent = r.d; $("#routeResult").hidden = false; }
}));

/* ---------- contacto ---------- */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>Correo</small>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</li>
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad || pend}</li>`;
const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
$("#footerContact").innerHTML = [
  CONTACTO.correo && `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>`,
  CONTACTO.whatsapp && `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  CONTACTO.ciudad && `<span>${CONTACTO.ciudad}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].filter(Boolean).join("");
$("#year").textContent = new Date().getFullYear();

/* ---------- formulario ---------- */
const form = $("#form"), msg = $("#formMsg"), interes = $("#interes");
const mensaje = form.querySelector("textarea[name=mensaje]");
form.querySelector("button[type=submit]").textContent = CONTACTO.whatsapp ? "Enviar solicitud por WhatsApp" : "Enviar solicitud por correo";
document.addEventListener("click", (e) => { const el = e.target.closest("[data-interes]"); if (el) interes.value = el.dataset.interes; });
$("#rCta").addEventListener("click", () => {
  const r = RUTAS[routeSel.necesidad]; if (!r) return;
  interes.value = r.i;
  const quien = routeSel.tipo ? `Somos ${routeSel.tipo} y necesitamos` : "Necesitamos";
  if (!mensaje.value.trim()) mensaje.value = `${quien} ${routeSel.necesidadTxt}. Nos interesa: ${r.t}.`;
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
  const texto = `Hola Torre 7, quiero solicitar información.\n\n*Nombre:* ${d.nombre}\n*Organización:* ${d.organizacion}\n*Correo:* ${d.correo}\n*Teléfono:* ${d.telefono || "-"}\n*Interés:* ${d.interes}\n\n${d.mensaje}`;
  if (CONTACTO.whatsapp) {
    window.open(waLink(texto), "_blank", "noopener");
    msg.textContent = "¡Gracias! Te abrimos WhatsApp para enviar tu solicitud.";
  } else if (CONTACTO.correo) {
    location.href = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent("Solicitud: " + d.interes)}&body=${encodeURIComponent(texto.replace(/\*/g, ""))}`;
    msg.textContent = "¡Gracias! Abrimos tu correo para enviar la solicitud.";
  }
});
