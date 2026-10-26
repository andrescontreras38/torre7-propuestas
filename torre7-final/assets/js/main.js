/* ==========================================================
   Torre 7 Soluciones Integrales — versión moderna
   ========================================================== */

/* ----------------------------------------------------------
   DATOS DE CONTACTO — completar cuando el cliente los envíe.
   whatsapp: solo números con indicativo, ej. "573001234567"
   ---------------------------------------------------------- */
const CONTACTO = {
  whatsapp: "573117723689",   // +57 311 772 3689 (el mismo número está en assets/js/whatsapp.js)
  telefono: "+57 311 772 3689",
  correo: "torre7.colombia@gmail.com",     // correo oficial del cliente
  ciudad: "",     // PENDIENTE, ej. "Medellín, Colombia"
  redes: { facebook: "", instagram: "", linkedin: "" }   // PENDIENTE
};

document.documentElement.classList.remove("no-js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- header y menú ---------- */
const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 10);
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

/* ---------- recomendaciones ---------- */
const RUTAS = {
  ordenar:    { t: "Diagnóstico y fortalecimiento organizacional", d: "Capacidades, necesidades y oportunidades de mejora, con recomendaciones priorizadas.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos", q: "Queremos ordenar y fortalecer la gestión de nuestra organización." },
  planear:    { t: "Planeación estratégica y organizacional", d: "Objetivos, prioridades, estrategias e indicadores, con plan de acción y seguimiento.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos", q: "Necesitamos un plan estratégico con objetivos e indicadores." },
  proyecto:   { t: "Formulación y estructuración de proyectos", d: "Perfil de proyecto, marco lógico, presupuesto y cronograma, según el alcance acordado.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos", q: "Queremos formular un proyecto a partir de una idea que tenemos." },
  financiar:  { t: "Financiación y cooperación", d: "Matriz de oportunidades, criterios de elegibilidad y hoja de ruta para postular. No garantiza financiación.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos", q: "Buscamos oportunidades de financiación y cooperación para nuestra organización." },
  medir:      { t: "Seguimiento, evaluación e impacto", d: "Indicadores, instrumentos de seguimiento, matrices de resultados e informes.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos", q: "Queremos medir los resultados y el impacto de lo que hacemos." },
  formar:     { t: "Torre 7 Capacita", d: "Cursos, talleres y programas a la medida. Presencial, virtual o combinada.", i: "Torre 7 Capacita – Formación", q: "Queremos formar a nuestro equipo en gestión de proyectos, planeación e indicadores." },
  innovar:    { t: "Torre 7 Innova", d: "Ideación, cocreación, mejora de procesos y diseño de iniciativas piloto.", i: "Torre 7 Innova – Innovación", q: "Queremos innovar en nuestros procesos o soluciones." },
  investigar: { t: "Torre 7 Investiga", d: "Diagnósticos, estudios, análisis y sistematización de experiencias.", i: "Torre 7 Investiga – Investigación aplicada", q: "Necesitamos investigar o sistematizar una experiencia." },
  continuo:   { t: "Membresía Standard o Premium", d: "Asesoría individual, hoja de ruta y revisión periódica de avances.", i: "Membresía Standard", q: "Buscamos un acompañamiento continuo para nuestra organización." }
};
// palabras clave para adivinar la necesidad a partir del texto libre
const CLAVES = [
  ["financiar", /financ|recurs|fondo|cooperaci|donaci|convocatoria/],
  ["proyecto", /proyecto|formular|marco l[oó]gico|propuesta/],
  ["planear", /plan|estrat|objetiv/],
  ["medir", /medir|indicador|impacto|evalua|seguimiento|resultado/],
  ["formar", /form|capacit|taller|curso|equipo/],
  ["innovar", /innova|proceso|idea|cocrea/],
  ["investigar", /investig|estudio|sistematiz|diagn[oó]stico de|caracteriz|encuesta/],
  ["continuo", /membres|continu|acompa[nñ]amiento|mentor/],
  ["ordenar", /orden|gesti[oó]n|fortalec|diagn[oó]stico|organiza/]
];

/* ---------- servicios en la sección oscura ---------- */
const SERVICIOS = [
  { t: "Diagnóstico y fortalecimiento institucional", e: ["Diagnóstico organizacional", "Identificación de brechas", "Evaluación de capacidades", "Planes de mejoramiento"] },
  { t: "Planeación estratégica y sostenibilidad", e: ["Planeación estratégica", "Definición de objetivos", "Modelo de sostenibilidad", "Identificación de fuentes de ingresos", "Fortalecimiento de alianzas"] },
  { t: "Formulación y gestión de proyectos", e: ["Identificación de oportunidades", "Estructuración de proyectos", "Marco lógico", "Presupuesto", "Indicadores y seguimiento"] },
  { t: "Gestión administrativa, financiera y contable", e: ["Fortalecimiento de procesos administrativos", "Presupuestos y flujo de caja", "Organización de información financiera", "Control de gestión"], n: "Según el alcance contratado." },
  { t: "Cooperación y movilización de recursos", e: ["Identificación de convocatorias", "Análisis de requisitos", "Preparación de propuestas", "Relacionamiento con cooperantes y aliados"], n: "No implica garantizar financiación ni aprobación." },
  { t: "Seguimiento, evaluación y gestión de resultados", e: ["Diseño de indicadores", "Tableros de seguimiento", "Evaluación de avances", "Informes de gestión"] }
];
const stage = $("#stage");
const darkSec = $("#servicios");
if (stage) {
  const renderSvc = (i) => {
    const s = SERVICIOS[i];
    $("#stTitle").textContent = s.t;
    $("#stList").innerHTML = s.e.map((x) => `<li>${x}</li>`).join("");
    const note = $("#stNote");
    note.hidden = !s.n; note.textContent = s.n || "";
  };
  renderSvc(0);
  let svcIdx = 0;
  const selectSvc = (i) => {
    if (i === svcIdx) return;
    document.querySelectorAll("#svc button").forEach((x) => x.setAttribute("aria-selected", String(+x.dataset.i === i)));
    stage.classList.add("is-out");
    setTimeout(() => { renderSvc(i); stage.classList.remove("is-out"); }, 220);
    svcIdx = i;
  };
  document.querySelectorAll("#svc button").forEach((b) => b.addEventListener("click", () => {
    selectSvc(+b.dataset.i);
    // en celular el panel queda debajo de la lista: llevar a la persona hasta él
    if (innerWidth < 900) setTimeout(() => stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 240);
  }));
}
/* ---------- contadores ---------- */
const runCount = (el) => {
  const end = +el.dataset.count, start = end > 1000 ? end - 30 : 0, t0 = performance.now(), dur = 1300;
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/* ---------- animaciones de entrada ---------- */
const reveals = document.querySelectorAll(".reveal");
reveals.forEach((el) => {
  const i = [...el.parentElement.children].indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    if (en.target.dataset.count && !reduceMotion) runCount(en.target);
    io.unobserve(en.target);
  }), { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* ---------- datos de contacto ---------- */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("¡Hola! Quisiera más información sobre los servicios de Torre 7.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Correo</small>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad || pend}</li>`;
const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
$("#footerContact").innerHTML = [
  CONTACTO.whatsapp && `<a href="${waLink("¡Hola! Quisiera más información sobre los servicios de Torre 7.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  CONTACTO.correo && `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>`,
  CONTACTO.ciudad && `<span>${CONTACTO.ciudad}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].filter(Boolean).join("") || '<a href="#contacto">Escríbenos</a>';
$("#year").textContent = new Date().getFullYear();

/* ---------- formulario ---------- */
const form = $("#form");
const msg = $("#formMsg");
const interes = $("#interes");
const mensaje = form.querySelector("textarea[name=mensaje]");
const submitBtn = form.querySelector("button[type=submit]");
if (!CONTACTO.whatsapp && CONTACTO.correo) submitBtn.textContent = "Enviar solicitud por correo";

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-interes]");
  if (!el) return;
  const v = el.dataset.interes;
  // si el servicio no está en la lista, se agrega para que quede elegido
  if (![...interes.options].some((o) => o.value === v)) interes.add(new Option(v, v));
  interes.value = v;
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = f.type === "checkbox" ? !f.checked : (!f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)));
    (f.closest(".field") || f.closest(".consent")).classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = form.querySelector(".consent.is-invalid") && !form.querySelector(".field.is-invalid") ? "Para enviar la solicitud, autoriza el tratamiento de tus datos." : "Por favor completa los campos marcados."; return; }
  const d = Object.fromEntries(new FormData(form));
  const texto =
`¡Hola! Quiero solicitar información sobre Torre 7. Les dejo mis datos:

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

/* ==========================================================
   Mejoras versión PRO
   ========================================================== */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* barra de progreso + botón fijo en móvil */
const progress = $("#progress");
const stickyCta = $("#stickyCta");
const contacto = $("#contacto");
const onScrollPro = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const c = contacto.getBoundingClientRect();
  stickyCta.classList.toggle("is-on", scrollY > innerHeight * .9 && !(c.top < innerHeight && c.bottom > 0));
};
onScrollPro();
addEventListener("scroll", onScrollPro, { passive: true });

/* inclinación 3D de las tarjetas */
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".ucard").forEach((card) => {
    card.addEventListener("pointermove", (ev) => {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      card.style.setProperty("--ry", `${x * 8}deg`);
      card.style.setProperty("--rx", `${-y * 8}deg`);
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  });
}

/* luz que sigue al cursor en la sección oscura */
if (finePointer && darkSec) {
  darkSec.addEventListener("pointermove", (ev) => {
    const r = darkSec.getBoundingClientRect();
    darkSec.style.setProperty("--mx", `${ev.clientX - r.left}px`);
    darkSec.style.setProperty("--my", `${ev.clientY - r.top}px`);
  });
}

/* línea de tiempo que se llena con el scroll */
const tl = $("#timeline"), tlFill = $("#tlFill");
if (tl) {
const tlItems = [...document.querySelectorAll(".tl__item")];
const onTimeline = () => {
  const r = tl.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * .6 - r.top) / r.height, 0), 1);
  tlFill.style.height = `${p * 100}%`;
  tlItems.forEach((it) => {
    const ir = it.getBoundingClientRect();
    it.classList.toggle("is-on", ir.top + ir.height / 2 < innerHeight * .62);
  });
};
onTimeline();
addEventListener("scroll", onTimeline, { passive: true });
if (reduceMotion) tlItems.forEach((it) => it.classList.add("is-on"));
}
