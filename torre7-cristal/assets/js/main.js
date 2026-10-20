/* ==========================================================
   Torre 7 Soluciones Integrales — versión Cristal
   ========================================================== */

/* ----------------------------------------------------------
   DATOS DE CONTACTO — completar los que falten.
   whatsapp: solo números con indicativo, ej. "573001234567"
   ---------------------------------------------------------- */
const CONTACTO = {
  whatsapp: "",                             // PENDIENTE
  telefono: "",                             // PENDIENTE
  correo: "torre7.colombia@gmail.com",      // correo oficial del cliente
  ciudad: "",                               // PENDIENTE
  redes: { facebook: "", instagram: "", linkedin: "" }   // PENDIENTE
};

const root = document.documentElement;
root.classList.remove("no-js");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
if (!hasGSAP) root.classList.add("no-gsap");
if (reduce) root.classList.add("reduce");
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- scroll suave ---------- */
let lenis = null;
if (hasGSAP && window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href"); const el = id.length > 1 && $(id);
  if (!el) return;
  e.preventDefault();
  document.body.classList.remove("nav-open");
  if (lenis) { lenis.start(); lenis.scrollTo(el, { offset: -20, duration: 1.3 }); }
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}));
const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
});

/* ==========================================================
   1. Escena 3D: el 7 de cristal
   ========================================================== */
const scene3d = (() => {
  const canvas = $("#gl");
  if (!window.THREE || !canvas) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, 0, 10);

  // luces
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffd9a8, .38));
  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(4, 6, 8); scene.add(key);
  const warm = new THREE.PointLight(0xff8a1f, 1.5, 30); warm.position.set(-5, -2, 5); scene.add(warm);
  const cool = new THREE.PointLight(0x3ddc84, 1.1, 30); cool.position.set(6, -3, 3); scene.add(cool);

  // forma del 7 del logo
  const P = [[.10, .04], [.98, .04], [.98, .15], [.52, .98], [.26, .98], [.66, .24], [.04, .24]];
  const shape = new THREE.Shape();
  P.forEach(([x, y], i) => { const X = x * 2.6, Y = -y * 3; i ? shape.lineTo(X, Y) : shape.moveTo(X, Y); });
  const geo = new THREE.ExtrudeGeometry(shape, { depth: .6, bevelEnabled: true, bevelThickness: .14, bevelSize: .09, bevelSegments: 8, curveSegments: 4 });
  geo.center();
  const mAmber = new THREE.MeshPhysicalMaterial({ color: 0xf29000, emissive: 0x3a1000, roughness: .14, metalness: .05, clearcoat: 1, clearcoatRoughness: .06 });
  const mGreen = new THREE.MeshPhysicalMaterial({ color: 0x0a8040, emissive: 0x002a12, roughness: .18, metalness: .05, clearcoat: 1, clearcoatRoughness: .08 });
  const seven = new THREE.Group();
  const a = new THREE.Mesh(geo, mAmber); a.position.set(-.28, -.12, .42);
  const b = new THREE.Mesh(geo, mGreen); b.position.set(.38, .26, -.42);
  seven.add(b, a);

  // objetos flotantes
  const floaters = [];
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffd98a, roughness: .08, metalness: .1, clearcoat: 1, clearcoatRoughness: .05, sheen: 1, sheenColor: new THREE.Color(0xff9a3d) });
  const add = (g, m, p, s) => { const o = new THREE.Mesh(g, m); o.position.set(...p); o.scale.setScalar(s); o.userData = { base: [...p], sp: .4 + Math.random() * .6, ph: Math.random() * 6 }; floaters.push(o); return o; };
  const world = new THREE.Group();
  world.add(seven,
    add(new THREE.SphereGeometry(1, 48, 48), glass, [-2.6, 1.6, -1], .6),
    add(new THREE.SphereGeometry(1, 48, 48), new THREE.MeshPhysicalMaterial({ color: 0xff7a1a, roughness: .2, clearcoat: 1 }), [2.1, -1.9, .8], .34),
    add(new THREE.TorusGeometry(1, .32, 32, 96), new THREE.MeshPhysicalMaterial({ color: 0xffd23f, roughness: .15, clearcoat: 1 }), [2.3, 1.9, -1.2], .42),
    add(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshPhysicalMaterial({ color: 0x3ddc84, roughness: .3, flatShading: true, clearcoat: .6 }), [-2.2, -1.8, .6], .38),
    add(new THREE.SphereGeometry(1, 48, 48), glass, [.9, 2.5, 1.4], .28)
  );
  scene.add(world);

  const st = { mx: 0, my: 0, tmx: 0, tmy: 0, scroll: 0, visible: true, intro: reduce ? 1 : 0 };
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const wide = w / h > 1.05;
    world.position.set(wide ? 3 : 0, wide ? 0 : 1.75, 0);
    world.scale.setScalar(wide ? 1 : .42);
  };
  resize(); addEventListener("resize", resize);
  if (fine) addEventListener("pointermove", (e) => { st.tmx = e.clientX / innerWidth - .5; st.tmy = e.clientY / innerHeight - .5; });
  new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; }).observe(canvas);

  let t = 0;
  const tick = () => {
    if (!st.visible) return;
    t += .016;
    st.mx += (st.tmx - st.mx) * .06; st.my += (st.tmy - st.my) * .06;
    const I = st.intro, S = st.scroll;
    seven.rotation.y = -.5 + Math.sin(t * .5) * .35 + st.mx * 1.1 + S * 2.4 + (1 - I) * -2.2;
    seven.rotation.x = .12 + Math.sin(t * .4) * .08 + st.my * .6;
    seven.position.y = Math.sin(t * .8) * .12 + S * 1.5;
    seven.scale.setScalar(.4 + I * .6 - S * .2);
    floaters.forEach((o, i) => {
      const { base, sp, ph } = o.userData;
      o.position.x = base[0] + Math.sin(t * sp + ph) * .15 - st.mx * (.6 + i * .15);
      o.position.y = base[1] + Math.cos(t * sp * 1.2 + ph) * .2 + st.my * (.5 + i * .1) + S * (1 + i * .4);
      o.rotation.x += .004 * sp; o.rotation.y += .006 * sp;
    });
    renderer.render(scene, camera);
  };
  if (hasGSAP) gsap.ticker.add(tick); else { const loop = () => { tick(); requestAnimationFrame(loop); }; loop(); }
  return st;
})();

/* ==========================================================
   2. Entrada del hero
   ========================================================== */
if (hasGSAP && !reduce) {
  const tl = gsap.timeline({ delay: .15 });
  tl.from(".header__glass", { y: -80, opacity: 0, duration: 1, ease: "expo.out" })
    .from(".hero__title .ln > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .12 }, .1)
    .from(".tag, .hero__lead, .hero__ctas", { y: 30, opacity: 0, duration: .9, ease: "power3.out", stagger: .1 }, .35)
    .from(".hero__glass", { scale: .6, opacity: 0, duration: 1, ease: "back.out(1.6)", stagger: .15 }, .7);
  if (scene3d) gsap.to(scene3d, { intro: 1, duration: 2.4, ease: "expo.out", delay: .1 });
  ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", scrub: true, onUpdate: (s) => { if (scene3d) scene3d.scroll = s.progress; } });
  gsap.to(".hero__inner", { yPercent: -12, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
} else if (scene3d) scene3d.intro = 1;

/* ==========================================================
   3. Frase con imágenes que se revela
   ========================================================== */
const stmt = $("#statement");
[...stmt.childNodes].forEach((n) => {
  if (n.nodeType === 3) {
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach((tk) => {
      if (!tk) return;
      if (/^\s+$/.test(tk)) frag.appendChild(document.createTextNode(" "));
      else { const s = document.createElement("span"); s.className = "w"; s.textContent = tk; frag.appendChild(s); }
    });
    n.replaceWith(frag);
  } else if (n.classList && n.classList.contains("pic")) n.classList.add("w");
});
if (hasGSAP && !reduce) {
  gsap.to("#statement .w", { opacity: 1, stagger: .04, ease: "none", scrollTrigger: { trigger: ".statement", start: "top 75%", end: "bottom 65%", scrub: true } });
  gsap.from("#statement .pic", { width: 0, ease: "none", stagger: .2, scrollTrigger: { trigger: ".statement", start: "top 75%", end: "bottom 65%", scrub: true } });
}

/* ==========================================================
   4. Viaje 3D por las líneas
   ========================================================== */
const LINEAS = [
  { t: "Torre 7 Proyecta", d: "Fortalecimiento organizacional y gestión de proyectos. La línea central de nuestra propuesta de valor.", l: ["6 servicios", "3 membresías", "Para ESAL y organizaciones sociales"], bg: "rgba(255, 214, 120, .35)" },
  { t: "Torre 7 Capacita", d: "Formación y desarrollo de capacidades: cursos, talleres, programas a la medida y materiales de aprendizaje.", l: ["Presencial", "Virtual", "Combinada"], bg: "rgba(255, 170, 120, .32)" },
  { t: "Torre 7 Innova", d: "Innovación y transformación organizacional: ideación, cocreación, mejora de procesos e iniciativas piloto.", l: ["Ideación", "Cocreación", "Pilotos"], bg: "rgba(150, 225, 180, .35)" },
  { t: "Torre 7 Investiga", d: "Investigación aplicada y generación de conocimiento: diagnósticos, estudios, análisis y sistematización.", l: ["Diagnósticos", "Estudios", "Informes técnicos"], bg: "rgba(255, 230, 150, .35)" }
];
const tnPin = $(".tunnel__pin"), tnInfo = $(".tunnel__info"), cards = $$(".tcard");
const renderLine = (i) => {
  const L = LINEAS[i];
  $("#tnNum").textContent = String(i + 1).padStart(2, "0");
  $("#tnTitle").textContent = L.t; $("#tnDesc").textContent = L.d;
  $("#tnList").innerHTML = L.l.map((x) => `<li>${x}</li>`).join("");
  tnPin.style.background = `radial-gradient(70% 60% at 70% 50%, ${L.bg}, transparent 70%)`;
};
renderLine(0);
let lineNow = 0;
const GAP = 1500;
const placeCards = (p) => {
  const small = innerWidth < 980;
  const cam = p * (cards.length - 1) * GAP;
  cards.forEach((c, i) => {
    const z = -i * GAP + cam;
    const side = i % 2 ? 1 : -1;
    c.style.setProperty("--z", `${z}px`);
    c.style.setProperty("--x", `${small ? side * 30 : side * 120}px`);
    c.style.setProperty("--y", `${side * -20}px`);
    c.style.setProperty("--ry", `${side * -10}deg`);
    c.style.opacity = z > 0 ? clamp(1 - z / 380, 0, 1) : clamp(1 + z / (GAP * 2.6), .08, 1);
    c.style.visibility = z > 380 ? "hidden" : "visible";
    c.style.zIndex = String(100 - i);
  });
  const idx = clamp(Math.round(p * (cards.length - 1)), 0, cards.length - 1);
  if (idx !== lineNow) {
    lineNow = idx;
    tnInfo.classList.add("is-swap");
    setTimeout(() => { renderLine(idx); tnInfo.classList.remove("is-swap"); }, 220);
  }
};
placeCards(0);
if (hasGSAP && !reduce) {
  ScrollTrigger.create({ trigger: ".tunnel", start: "top top", end: "+=320%", pin: ".tunnel__pin", scrub: 1, onUpdate: (s) => placeCards(s.progress) });
}

/* ==========================================================
   5. Servicios: acordeón + foto que sigue al cursor
   ========================================================== */
const rows = $$(".srow"), peek = $("#peek");
rows.forEach((row) => {
  const btn = $(".srow__head", row);
  btn.addEventListener("click", () => {
    const open = !row.classList.contains("is-open");
    rows.forEach((r) => { r.classList.remove("is-open"); $(".srow__head", r).setAttribute("aria-expanded", "false"); });
    if (open) { row.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    setTimeout(() => hasGSAP && ScrollTrigger.refresh(), 480);
  });
  if (fine) {
    row.addEventListener("pointerenter", () => { peek.src = row.dataset.img; peek.classList.add("is-on"); });
    row.addEventListener("pointerleave", () => peek.classList.remove("is-on"));
  }
});
if (fine) {
  let px = 0, py = 0, cx = 0, cy = 0;
  addEventListener("pointermove", (e) => { px = e.clientX + 160; py = e.clientY; });
  const follow = () => { cx += (px - cx) * .14; cy += (py - cy) * .14; peek.style.left = `${cx}px`; peek.style.top = `${cy}px`; requestAnimationFrame(follow); };
  follow();
}

/* ==========================================================
   6. Método: camino que se dibuja
   ========================================================== */
const pathFg = $("#pathFg"), psteps = $$(".pstep");
const len = pathFg.getTotalLength();
pathFg.style.strokeDasharray = len; pathFg.style.strokeDashoffset = len;
const setPath = (p) => {
  pathFg.style.strokeDashoffset = len * (1 - p);
  psteps.forEach((s, i) => s.classList.toggle("is-on", p >= i / (psteps.length - 1) - .02));
};
if (hasGSAP && !reduce && innerWidth >= 980) {
  ScrollTrigger.create({ trigger: ".path", start: "top 75%", end: "bottom 45%", scrub: 1, onUpdate: (s) => setPath(s.progress) });
} else {
  setPath(1);
  if (hasGSAP && !reduce) psteps.forEach((s) => { s.classList.remove("is-on"); ScrollTrigger.create({ trigger: s, start: "top 80%", onEnter: () => s.classList.add("is-on") }); });
}

/* ==========================================================
   6b. RED DE ESAL — repositorio de organizaciones
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
const RED_GRUPOS = [
  { id: "aliado", titulo: "Aliados estratégicos" },
  { id: "esal", titulo: "Entidades sin ánimo de lucro" },
  { id: "organizacion", titulo: "Organizaciones sociales" }
];
const redGroups = $("#redGroups"), redSearch = $("#redSearch"), redFilters = $("#redFilters"), redEmpty = $("#redEmpty");
let redTipo = "todos";
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
redFilters.innerHTML = [["todos", "Todas"], ...RED_GRUPOS.map((g) => [g.id, g.titulo])]
  .map(([id, t]) => `<button type="button" role="tab" data-tipo="${id}" aria-selected="${id === "todos"}">${t}</button>`).join("");
const joinCard = '<a href="#contacto" class="org org--join" data-interes="Unirme a la Red de ESAL"><b>¿Tu organización es una ESAL?</b><small>Únete a la red →</small></a>';
const renderRed = () => {
  const q = norm(redSearch.value.trim());
  let shown = 0;
  const html = RED_GRUPOS.filter((g) => redTipo === "todos" || g.id === redTipo).map((g, gi) => {
    const items = RED_ESAL.filter((o) => o.tipo === g.id && (!q || norm(`${o.nombre} ${o.ciudad || ""}`).includes(q)));
    shown += items.length;
    if (q && !items.length) return "";
    let cards = items.map((o) => {
      const inner = `<b>${esc(o.nombre)}</b>${o.ciudad ? `<small>${esc(o.ciudad)}</small>` : ""}`;
      return o.web ? `<a class="org org--real" href="${esc(o.web)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="org org--real">${inner}</div>`;
    }).join("");
    if (!q) {
      const fill = (4 - ((items.length + 1) % 4)) % 4;   // completa la fila de 4 (con la tarjeta "Únete")
      cards += '<div class="org org--soon"><b>Próximamente</b><small>Espacio para una organización de la red</small></div>'.repeat(fill) + joinCard;
    }
    const num = String(RED_GRUPOS.indexOf(g) + 1).padStart(2, "0");
    return `<div class="red__group"><h3 class="red__gtitle"><span>${num}</span>${g.titulo}</h3><div class="red__grid">${cards}</div></div>`;
  }).join("");
  redGroups.innerHTML = html;
  redEmpty.hidden = !(q && shown === 0);
  if (hasGSAP) ScrollTrigger.refresh();
};
redFilters.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  redTipo = b.dataset.tipo;
  $$("button", redFilters).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
  renderRed();
});
redSearch.addEventListener("input", renderRed);
renderRed();

/* ==========================================================
   7. Entradas generales
   ========================================================== */
if (hasGSAP && !reduce) {
  $$(".rv").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    gsap.from($$(".w", el), { yPercent: 80, opacity: 0, rotate: 4, duration: 1, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  gsap.from(".srow", { y: 40, opacity: 0, duration: .8, ease: "power3.out", stagger: .07, scrollTrigger: { trigger: ".srows", start: "top 80%" } });
  gsap.from(".plan", { y: 100, opacity: 0, rotateX: -25, transformOrigin: "50% 100%", duration: 1.1, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: ".plans", start: "top 80%" } });
  gsap.from(".blobs i", { scale: .3, opacity: 0, duration: 1.6, ease: "expo.out", stagger: .15, scrollTrigger: { trigger: ".plans-sec", start: "top 70%" } });
  gsap.from(".vision, .faq details", { y: 40, opacity: 0, duration: .8, ease: "power3.out", stagger: .06, scrollTrigger: { trigger: ".faq", start: "top 80%" } });
  gsap.from(".red__tools, .red__group", { y: 40, opacity: 0, duration: .9, ease: "power3.out", stagger: .1, scrollTrigger: { trigger: ".red", start: "top 75%" } });
  gsap.from(".contact", { y: 80, scale: .96, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 85%" } });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
}

/* ==========================================================
   8. Contacto y formulario
   ========================================================== */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>Correo</small>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</li>
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad || pend}</li>`;
$("#year").textContent = new Date().getFullYear();

const form = $("#form"), msg = $("#formMsg"), interes = $("#interes");
form.querySelector("button[type=submit]").textContent = CONTACTO.whatsapp ? "Enviar solicitud por WhatsApp" : "Enviar solicitud por correo";
document.addEventListener("click", (e) => { const el = e.target.closest("[data-interes]"); if (el) interes.value = el.dataset.interes; });
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
