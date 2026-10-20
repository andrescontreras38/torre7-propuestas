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

/* ---------- header al hacer scroll ---------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- menú móvil ---------- */
const burger = document.getElementById("burger");
const setMenu = (open) => {
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- animaciones de entrada ---------- */
const reveals = document.querySelectorAll(".reveal");
// pequeño escalonado entre hermanos
reveals.forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* ---------- datos de contacto ---------- */
const icons = {
  wa: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>'
};
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;

const data = document.getElementById("contactData");
data.innerHTML = `
  <li><span class="ic">${icons.wa}</span><div><small>WhatsApp</small>${
    CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</div></li>
  <li><span class="ic">${icons.mail}</span><div><small>Correo</small>${
    CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</div></li>
  <li><span class="ic">${icons.pin}</span><div><small>Ubicación</small>${
    CONTACTO.ciudad ? `<strong>${CONTACTO.ciudad}</strong>` : pend}</div></li>`;

const fc = document.getElementById("footerContact");
const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
fc.innerHTML = [
  CONTACTO.whatsapp && `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  CONTACTO.correo && `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>`,
  CONTACTO.ciudad && `<span>${CONTACTO.ciudad}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].filter(Boolean).join("") || '<a href="#contacto">Escríbenos</a>';

const waFloat = document.getElementById("waFloat");
if (CONTACTO.whatsapp) {
  waFloat.href = waLink("Hola Torre 7, quiero solicitar una asesoría inicial.");
  waFloat.target = "_blank";
  waFloat.rel = "noopener";
}

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- botones de membresía preseleccionan el interés ---------- */
const interes = document.getElementById("interes");
document.querySelectorAll("[data-interes]").forEach((btn) => {
  btn.addEventListener("click", () => { interes.value = btn.dataset.interes; });
});

/* ---------- formulario -> WhatsApp (o correo) ---------- */
const form = document.getElementById("form");
const msg = document.getElementById("formMsg");
const submitBtn = form.querySelector("button[type=submit]");
if (!CONTACTO.whatsapp && CONTACTO.correo) submitBtn.firstChild.textContent = "Enviar solicitud por correo ";

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

/* ==========================================================
   Interacciones avanzadas
   ========================================================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- barra de progreso de lectura ---------- */
const progress = document.getElementById("progress");
const onProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
onProgress();
addEventListener("scroll", onProgress, { passive: true });

/* ---------- contadores animados ---------- */
const counters = document.querySelectorAll("[data-count]");
const runCounter = (el) => {
  const end = +el.dataset.count;
  const start = end > 1000 ? end - 40 : 0;   // 2035 cuenta desde 1995
  const t0 = performance.now(), dur = 1400;
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if (!reduceMotion && "IntersectionObserver" in window) {
  const co = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
  }), { threshold: .6 });
  counters.forEach((c) => co.observe(c));
}

/* ---------- frase que se ilumina palabra por palabra ---------- */
document.querySelectorAll(".scrub").forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  const words = el.querySelectorAll(".w");
  const update = () => {
    const r = el.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * .85 - r.top) / (r.height + innerHeight * .35), 0), 1);
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  };
  update();
  addEventListener("scroll", update, { passive: true });
});

/* ---------- método: paso activo en el scroll dividido ---------- */
const steps = document.querySelectorAll(".step");
const stepNow = document.getElementById("stepNow");
const stepBar = document.getElementById("stepBar");
const setStep = () => {
  let active = steps[0];
  steps.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * .55) active = s; });
  steps.forEach((s) => s.classList.toggle("is-active", s === active));
  stepNow.textContent = active.dataset.step;
  stepBar.style.width = `${(+active.dataset.step / steps.length) * 100}%`;
};
setStep();
addEventListener("scroll", setStep, { passive: true });

/* ---------- brillo que sigue al cursor ---------- */
if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".line-card, .plan, .service").forEach((card) => {
    const g = document.createElement("span");
    g.className = "glow"; g.setAttribute("aria-hidden", "true");
    card.prepend(g);
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- encuentra tu ruta (cuestionario de 2 pasos) ---------- */
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
const q2 = document.getElementById("routeQ2");
const rBox = document.getElementById("routeResult");
document.querySelectorAll(".chips-select").forEach((group) => {
  group.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    routeSel[group.dataset.group] = b.dataset.v;
    if (group.dataset.group === "tipo") q2.removeAttribute("aria-disabled");
    if (group.dataset.group === "necesidad") routeSel.necesidadTxt = b.textContent.trim();
    if (routeSel.tipo && routeSel.necesidad) {
      const r = RUTAS[routeSel.necesidad];
      document.getElementById("rTitle").textContent = r.t;
      document.getElementById("rText").textContent = r.d;
      rBox.hidden = false;
    }
  });
});
document.getElementById("rCta").addEventListener("click", () => {
  const r = RUTAS[routeSel.necesidad]; if (!r) return;
  interes.value = r.i;
  const ta = form.querySelector("textarea[name=mensaje]");
  if (!ta.value.trim()) ta.value = `Somos ${routeSel.tipo} y necesitamos ${routeSel.necesidadTxt}. Nos interesa: ${r.t}.`;
});
