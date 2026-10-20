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

/* ----------------------------------------------------------
   FRASES DEL INICIO — cambian al hacer scroll.
   Basadas en el documento del cliente.
   ---------------------------------------------------------- */
const FRASES = [
  { v: "transforma", t: "propósitos en soluciones sostenibles", tag: "Misión" },
  { v: "escucha", t: "antes de proponer", tag: "Comprendemos" },
  { v: "comprende", t: "cada realidad particular", tag: "Quiénes somos" },
  { v: "fortalece", t: "a las organizaciones sociales", tag: "Torre 7 Proyecta" },
  { v: "desarrolla", t: "capacidades en los equipos", tag: "Torre 7 Capacita" },
  { v: "innova", t: "con los recursos de cada organización", tag: "Torre 7 Innova" },
  { v: "genera", t: "conocimiento aplicado", tag: "Torre 7 Investiga" }
];

document.documentElement.classList.remove("no-js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- barra superior ---------- */
const topBar = $("#top");
const onTop = () => topBar.classList.toggle("is-scrolled", scrollY > 40);
onTop();
addEventListener("scroll", onTop, { passive: true });

/* ---------- inicio: frases, línea de tiempo y formas ---------- */
const intro = $("#inicio");
const phrase = $("#phrase");
const tagText = $("#tagText");
const timeline = $("#timeline");
const shapesBox = $("#shapes");

timeline.innerHTML = FRASES.map(() => "<i></i>").join("");
const dots = [...timeline.children];

// formas diagonales (el "7" de la marca), 3 por frase, en posiciones fijas
const COLORS = ["#f7b100", "#eb7707", "#00663c", "#222222", "#3fae49"];
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const spots = [];
for (let i = 0; i < FRASES.length * 3; i++) {
  let x, y;
  do { x = 6 + rnd() * 88; y = 12 + rnd() * 76; }
  while (innerWidth < 700 ? (y > 20 && y < 80) : (x > 24 && x < 76 && y > 26 && y < 74)); // deja libre el título
  spots.push({ x, y });
}
shapesBox.innerHTML = spots.map((p, i) => {
  const w = 26 + Math.round(rnd() * 46);
  const c = COLORS[i % COLORS.length];
  const kind = rnd() > .45 ? "fill" : "line";
  const r = Math.round(rnd() * 40 - 20);
  return `<span class="shape shape--${kind}" data-g="${i % FRASES.length}" style="left:${p.x}%;top:${p.y}%;--w:${w}px;--c:${c};--r:${r}deg"></span>`;
}).join("");
const shapes = [...shapesBox.children];

let current = -1;
const showPhrase = (i) => {
  if (i === current) return;
  const f = FRASES[i];
  const apply = () => {
    phrase.innerHTML = `<em>${f.v}</em> ${f.t}`;
    tagText.textContent = `Nº ${String(i + 1).padStart(2, "0")} · ${f.tag}`;
    phrase.classList.remove("is-out");
  };
  if (current === -1 || reduceMotion) apply();
  else { phrase.classList.add("is-out"); setTimeout(apply, 220); }
  dots.forEach((d, k) => { d.classList.toggle("is-on", k === i); d.classList.toggle("is-done", k < i); });
  shapes.forEach((s) => s.classList.toggle("is-on", +s.dataset.g === i));
  current = i;
};
const onIntro = () => {
  const r = intro.getBoundingClientRect();
  const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), .999);
  showPhrase(Math.floor(p * FRASES.length));
};
onIntro();
addEventListener("scroll", onIntro, { passive: true });

// leve movimiento de las formas con el ratón
if (!reduceMotion && matchMedia("(hover: hover)").matches) {
  intro.addEventListener("pointermove", (e) => {
    const dx = (e.clientX / innerWidth - .5) * 18, dy = (e.clientY / innerHeight - .5) * 18;
    shapesBox.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  shapesBox.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
}

/* ---------- animaciones de entrada ---------- */
const reveals = document.querySelectorAll(".reveal");
reveals.forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.07}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
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

/* ---------- índice de líneas: imagen que sigue al cursor ---------- */
const preview = $("#indexPreview");
if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("#linesIndex a").forEach((a) => {
    a.addEventListener("pointerenter", () => { preview.src = a.dataset.img; preview.classList.add("is-on"); });
    a.addEventListener("pointerleave", () => preview.classList.remove("is-on"));
    a.addEventListener("pointermove", (e) => { preview.style.left = `${e.clientX + 170}px`; preview.style.top = `${e.clientY}px`; });
  });
}

/* ---------- método: paso activo ---------- */
const steps = document.querySelectorAll(".step");
const stepNow = $("#stepNow");
const stepDots = $("#stepDots");
stepDots.innerHTML = [...steps].map(() => "<i></i>").join("");
const sDots = [...stepDots.children];
const setStep = () => {
  let idx = 0;
  steps.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .55) idx = i; });
  steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
  sDots.forEach((d, i) => { d.classList.toggle("is-on", i === idx); d.classList.toggle("is-done", i < idx); });
  stepNow.textContent = steps[idx].dataset.step;
};
setStep();
addEventListener("scroll", setStep, { passive: true });

/* ---------- datos de contacto ---------- */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>WhatsApp</small><div>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</div></li>
  <li><small>Correo</small><div>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</div></li>
  <li><small>Ubicación</small><div>${CONTACTO.ciudad ? `<strong>${CONTACTO.ciudad}</strong>` : pend}</div></li>`;

const redes = Object.entries(CONTACTO.redes).filter(([, url]) => url);
$("#footerContact").innerHTML = [
  CONTACTO.whatsapp && `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">WhatsApp</a>`,
  CONTACTO.correo && `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>`,
  CONTACTO.ciudad && `<span>${CONTACTO.ciudad}</span>`,
  ...redes.map(([n, url]) => `<a href="${url}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`)
].filter(Boolean).join("");

const waFloat = $("#waFloat");
if (CONTACTO.whatsapp) {
  waFloat.href = waLink("Hola Torre 7, quiero solicitar una asesoría inicial.");
  waFloat.target = "_blank";
  waFloat.rel = "noopener";
}
$("#year").textContent = new Date().getFullYear();

/* ---------- botones de membresía preseleccionan el interés ---------- */
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
const q2 = $("#routeQ2");
const rBox = $("#routeResult");
document.querySelectorAll(".chips-select").forEach((group) => {
  group.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    routeSel[group.dataset.group] = b.dataset.v;
    if (group.dataset.group === "tipo") q2.removeAttribute("aria-disabled");
    if (group.dataset.group === "necesidad") routeSel.necesidadTxt = b.textContent.trim();
    if (routeSel.tipo && routeSel.necesidad) {
      const r = RUTAS[routeSel.necesidad];
      $("#rTitle").textContent = r.t;
      $("#rText").textContent = r.d;
      rBox.hidden = false;
    }
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
  if (!ta.value.trim()) ta.value = `Somos ${routeSel.tipo} y necesitamos ${routeSel.necesidadTxt}. Nos interesa: ${r.t}.`;
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
