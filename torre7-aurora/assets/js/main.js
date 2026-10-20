/* ==========================================================
   Torre 7 Soluciones Integrales — versión Aurora
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
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- header, progreso y botón fijo ---------- */
const header = $("#header"), progress = $("#progress"), sticky = $("#stickyCta"), contactoSec = $("#contacto");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const c = contactoSec.getBoundingClientRect();
  sticky.classList.toggle("is-on", scrollY > innerHeight * .9 && !(c.top < innerHeight && c.bottom > 0));
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
$$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- título palabra por palabra ---------- */
const title = $("#heroTitle");
(() => {
  const parts = [];
  title.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      n.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        if (/^\s+$/.test(t)) parts.push(document.createTextNode(" "));
        else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; parts.push(s); }
      });
    } else { n.classList.add("w"); parts.push(n); }
  });
  title.replaceChildren(...parts);
  title.querySelectorAll(".w").forEach((w, i) => { w.style.transitionDelay = `${i * 0.07}s`; });
  requestAnimationFrame(() => setTimeout(() => title.classList.add("is-in"), 120));
})();

/* ---------- el 7 en 3D sigue al ratón ---------- */
const seven = $("#seven");
if (finePointer && !reduceMotion) {
  $("#inicio").addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    seven.style.setProperty("--ry", `${-16 + x * 36}deg`);
    seven.style.setProperty("--rx", `${8 - y * 24}deg`);
  });
}

/* ---------- bento: borde de luz que sigue al cursor ---------- */
if (finePointer) {
  $$(".cell").forEach((cell) => {
    cell.addEventListener("pointermove", (e) => {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--mx", `${e.clientX - r.left}px`);
      cell.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- animaciones de entrada ---------- */
const reveals = $$(".head, .cell, .steps li, .plan, .faq details, .contact__copy, .form, .vision__card, .chat-copy, .chat");
reveals.forEach((el) => {
  el.classList.add("reveal");
  const i = [...el.parentElement.children].indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.07}s`);
});
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* ---------- servicios: scroll horizontal ---------- */
const hs = $("#servicios"), track = $("#hsTrack"), hsBar = $("#hsBar"), hsNow = $("#hsNow");
const cards = $$("#hsTrack .scard:not(.scard--cta)");
let hsDist = 0;
const sizeHs = () => {
  if (reduceMotion) { hs.style.height = "auto"; track.style.overflowX = "auto"; return; }
  hsDist = Math.max(track.scrollWidth - innerWidth, 0);
  hs.style.height = `${innerHeight + hsDist}px`;
  onHs();
};
const onHs = () => {
  if (reduceMotion) return;
  const r = hs.getBoundingClientRect();
  const p = Math.min(Math.max(-r.top / (r.height - innerHeight || 1), 0), 1);
  track.style.transform = `translate3d(${-p * hsDist}px,0,0)`;
  hsBar.style.width = `${p * 100}%`;
  hsNow.textContent = String(Math.min(cards.length, Math.floor(p * cards.length) + 1)).padStart(2, "0");
};
addEventListener("resize", sizeHs);
addEventListener("load", sizeHs);
addEventListener("scroll", onHs, { passive: true });
sizeHs();

/* ---------- asistente tipo chat ---------- */
const RUTAS = {
  ordenar:    { t: "Diagnóstico y fortalecimiento organizacional", d: "Identificamos capacidades, necesidades y oportunidades de mejora, con recomendaciones priorizadas. Puedes complementarlo con la Membresía Basic.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  planear:    { t: "Planeación estratégica y organizacional", d: "Definimos contigo objetivos, prioridades, estrategias e indicadores, con plan de acción y esquema de seguimiento.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  proyecto:   { t: "Formulación y estructuración de proyectos", d: "Convertimos tu idea en un proyecto: perfil, marco lógico, presupuesto y cronograma, según el alcance acordado.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  financiar:  { t: "Financiación y cooperación", d: "Matriz de oportunidades, criterios de elegibilidad y hoja de ruta para postular. Ojo: no implica garantizar financiación.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  medir:      { t: "Seguimiento, evaluación e impacto", d: "Indicadores, instrumentos de seguimiento, matrices de resultados e informes.", i: "Torre 7 Proyecta – Fortalecimiento y proyectos" },
  formar:     { t: "Torre 7 Capacita", d: "Cursos, talleres y programas a la medida en gestión de proyectos, planeación e indicadores. Presencial, virtual o combinada.", i: "Torre 7 Capacita – Formación" },
  innovar:    { t: "Torre 7 Innova", d: "Diagnóstico de oportunidades, talleres de ideación y cocreación, mejora de procesos e iniciativas piloto.", i: "Torre 7 Innova – Innovación" },
  investigar: { t: "Torre 7 Investiga", d: "Diagnósticos, estudios, análisis cualitativo y cuantitativo, y sistematización de experiencias.", i: "Torre 7 Investiga – Investigación aplicada" },
  continuo:   { t: "Membresía Standard o Premium", d: "Asesoría individual, hoja de ruta y revisión periódica de avances. Si buscas mentoría integral, la Premium es para ti.", i: "Membresía Standard" }
};
const TIPOS = ["Una ESAL o fundación", "Una organización social o comunitaria", "Una empresa", "Una institución o entidad pública"];
const NECESIDADES = [
  ["ordenar", "Ordenar nuestra gestión"], ["planear", "Un plan estratégico"], ["proyecto", "Formular un proyecto"],
  ["financiar", "Buscar financiación"], ["medir", "Medir impacto"], ["formar", "Formar al equipo"],
  ["innovar", "Innovar"], ["investigar", "Investigar o sistematizar"], ["continuo", "Acompañamiento continuo"]
];
const log = $("#chatLog"), opts = $("#chatOpts");
const chatSel = { tipo: "", key: "", txt: "" };
const scrollLog = () => { log.scrollTop = log.scrollHeight; };
const addMsg = (html, who = "bot", extra = "") => {
  const m = document.createElement("div");
  m.className = `msg msg--${who} ${extra}`;
  m.innerHTML = html;
  log.appendChild(m); scrollLog();
  return m;
};
const botSay = (html, extra = "") => new Promise((res) => {
  if (reduceMotion) { addMsg(html, "bot", extra); return res(); }
  const t = addMsg('<span class="typing" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
  setTimeout(() => { t.remove(); addMsg(html, "bot", extra); res(); }, 700 + Math.min(html.length * 6, 700));
});
const setOpts = (list, onPick) => {
  opts.innerHTML = "";
  list.forEach(([val, label]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = label;
    b.addEventListener("click", () => { opts.innerHTML = ""; addMsg(label, "user"); onPick(val, label); });
    opts.appendChild(b);
  });
};
const startChat = async () => {
  log.innerHTML = ""; opts.innerHTML = "";
  await botSay("¡Hola! 👋 Soy el asistente de Torre 7.");
  await botSay("Para empezar, ¿qué tipo de organización eres?");
  setOpts(TIPOS.map((t) => [t, t]), async (tipo) => {
    chatSel.tipo = tipo.charAt(0).toLowerCase() + tipo.slice(1);
    await botSay("¡Perfecto! ¿Y qué necesita tu organización en este momento?");
    setOpts(NECESIDADES, async (key, label) => {
      chatSel.key = key; chatSel.txt = label.toLowerCase();
      const r = RUTAS[key];
      await botSay("Déjame revisar nuestras líneas de servicio…");
      await botSay(`<small>Te recomendamos</small><b>${r.t}</b>${r.d}<br><a href="#contacto" class="btn btn--grad btn--sm" id="chatGo">Continuar al formulario →</a>`, "msg--card");
      $("#chatGo").addEventListener("click", () => {
        interes.value = r.i;
        const ta = form.querySelector("textarea[name=mensaje]");
        if (!ta.value.trim()) ta.value = `Somos ${chatSel.tipo} y necesitamos ${chatSel.txt}. Nos interesa: ${r.t}.`;
      });
      setOpts([["reiniciar", "↺ Empezar de nuevo"]], () => startChat());
    });
  });
};
let chatStarted = false;
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([en], obs) => {
    if (en.isIntersecting && !chatStarted) { chatStarted = true; startChat(); obs.disconnect(); }
  }, { threshold: .35 }).observe($("#chat"));
} else { startChat(); }

/* ---------- datos de contacto ---------- */
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
].filter(Boolean).join("") || '<a href="#contacto">Escríbenos</a>';
$("#year").textContent = new Date().getFullYear();

/* ---------- formulario ---------- */
const form = $("#form"), msg = $("#formMsg"), interes = $("#interes");
const submitBtn = form.querySelector("button[type=submit]");
submitBtn.textContent = CONTACTO.whatsapp ? "Enviar solicitud por WhatsApp" : "Enviar solicitud por correo";
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-interes]");
  if (el) interes.value = el.dataset.interes;
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
