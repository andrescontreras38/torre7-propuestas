/* ==========================================================
   Torre 7 Soluciones Integrales — versión Motion
   GSAP + ScrollTrigger + Lenis + Three.js
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
if (!hasGSAP) root.classList.add("no-gsap", "is-ready");
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

const main = $("#contenido");
const footer = $("#footer");

/* ==========================================================
   1. Scroll suave (Lenis) + anclas
   ========================================================== */
let lenis = null;
if (hasGSAP && window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    document.body.classList.remove("nav-open");
    if (lenis) lenis.scrollTo(el, { offset: id === "#inicio" ? 0 : -10, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
});

/* pie de página que se revela */
const sizeFooter = () => { if (hasGSAP) main.style.marginBottom = `${footer.offsetHeight}px`; };
sizeFooter();
addEventListener("resize", sizeFooter);

/* menú móvil */
const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
  if (lenis) open ? lenis.stop() : lenis.start();
});
$$("#nav a").forEach((a) => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); if (lenis) lenis.start(); }));

/* ==========================================================
   2. Utilidades de texto
   ========================================================== */
const splitChars = (el) => {
  if (el.classList.contains("grad")) return [el];      // los degradados se animan completos
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word" style="display:inline-block;white-space:nowrap">${[...w].map((c) => `<span class="char">${c}</span>`).join("")}</span>`).join(" ");
  return $$(".char", el);
};
const splitWords = (el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="word">${w}</span>`).join(" ");
  return $$(".word", el);
};

/* ==========================================================
   3. Partículas 3D: el 7 del logo
   ========================================================== */
const particles = (() => {
  const canvas = $("#gl");
  if (!window.THREE || !canvas) return null;
  const isSmall = innerWidth < 760;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 10;

  // dibuja los dos 7 del logo en un lienzo y toma sus píxeles
  const S = 360, cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const cx = cv.getContext("2d");
  const seven = (dx, dy, fill) => {
    const P = [[.10, .04], [.98, .04], [.98, .15], [.52, .98], [.26, .98], [.66, .24], [.04, .24]];
    cx.beginPath();
    P.forEach(([x, y], i) => { const X = (x * .78 + dx) * S, Y = (y * .86 + dy) * S; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); });
    cx.closePath(); cx.fillStyle = fill; cx.fill();
  };
  const gGreen = cx.createLinearGradient(0, 0, S, S); gGreen.addColorStop(0, "#3ddc84"); gGreen.addColorStop(1, "#0b6b38");
  const gAmber = cx.createLinearGradient(0, 0, S * .6, S); gAmber.addColorStop(0, "#fff16a"); gAmber.addColorStop(.4, "#ffc21a"); gAmber.addColorStop(1, "#ff6a1a");
  seven(.17, .04, gGreen);
  seven(.05, .10, gAmber);
  const data = cx.getImageData(0, 0, S, S).data;
  const step = isSmall ? 5 : 3;
  const home = [], cols = [];
  for (let y = 0; y < S; y += step) for (let x = 0; x < S; x += step) {
    const i = (y * S + x) * 4;
    if (data[i + 3] > 140) {
      home.push((x / S - .5) * 6.4 + (Math.random() - .5) * .03, -(y / S - .5) * 6.4 + (Math.random() - .5) * .03, (Math.random() - .5) * .35);
      cols.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
    }
  }
  const N = home.length / 3;
  // polvo de estrellas alrededor
  const DUST = isSmall ? 260 : 700;
  for (let d = 0; d < DUST; d++) {
    const r = 4 + Math.random() * 6, a = Math.random() * Math.PI * 2, b = (Math.random() - .5) * Math.PI;
    home.push(Math.cos(a) * Math.cos(b) * r, Math.sin(b) * r * .6, Math.sin(a) * Math.cos(b) * r - 2);
    const warm = Math.random() > .5;
    cols.push(warm ? 1 : .4, warm ? .75 : .9, warm ? .3 : .55);
  }
  const total = home.length / 3;
  const H = new Float32Array(home);
  const pos = new Float32Array(total * 3);
  const start = new Float32Array(total * 3);
  for (let i = 0; i < total; i++) {
    const r = 9 + Math.random() * 8, a = Math.random() * Math.PI * 2, b = (Math.random() - .5) * Math.PI;
    start[i * 3] = Math.cos(a) * Math.cos(b) * r; start[i * 3 + 1] = Math.sin(b) * r; start[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r - 4;
  }
  pos.set(reduce ? H : start);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(cols), 3));

  // punto redondo y suave
  const dot = document.createElement("canvas"); dot.width = dot.height = 64;
  const dc = dot.getContext("2d"); const rg = dc.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(.45, "rgba(255,255,255,.85)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  dc.fillStyle = rg; dc.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: isSmall ? .085 : .075, map: new THREE.CanvasTexture(dot), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group(); group.add(points); scene.add(group);

  const state = { assemble: reduce ? 1 : 0, explode: 0, mx: 9, my: 9, tmx: 9, tmy: 9, rotY: 0, visible: true };
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const wide = w / h > 1.1;
    group.position.set(wide ? 3.3 : 0, wide ? .3 : 1.7, 0);
    group.scale.setScalar(wide ? .92 : .74);
  };
  resize(); addEventListener("resize", resize);

  if (fine) {
    addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      const vh = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z, vw = vh * camera.aspect;
      state.tmx = (nx * vw / 2 - group.position.x) / group.scale.x;
      state.tmy = (ny * vh / 2 - group.position.y) / group.scale.y;
    });
  }
  new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; }).observe(canvas);

  let t = 0;
  const tick = () => {
    if (!state.visible) return;
    t += .016;
    state.mx += (state.tmx - state.mx) * .12; state.my += (state.tmy - state.my) * .12;
    const A = state.assemble, E = state.explode;
    for (let i = 0; i < total; i++) {
      const k = i * 3, isDust = i >= N;
      let hx = H[k], hy = H[k + 1], hz = H[k + 2];
      if (!isDust) {
        hx += Math.sin(t * 1.2 + hy * 2) * .02; hy += Math.cos(t * 1.1 + hx * 2) * .02;
        // explosión al hacer scroll
        if (E > 0) { const f = 1 + E * 2.2; hx *= f; hy *= f; hz = hz * f + E * (Math.sin(i) * 6); }
        // el ratón empuja las partículas
        const dx = hx - state.mx, dy = hy - state.my, d2 = dx * dx + dy * dy;
        if (d2 < 1.3) { const f = (1.3 - d2) * .9; hx += dx * f; hy += dy * f; hz += f * 1.4; }
      } else {
        hx += Math.sin(t * .2 + i) * .3; hy += Math.cos(t * .25 + i) * .2;
      }
      const tx = start[k] + (hx - start[k]) * A, ty = start[k + 1] + (hy - start[k + 1]) * A, tz = start[k + 2] + (hz - start[k + 2]) * A;
      pos[k] += (tx - pos[k]) * .085; pos[k + 1] += (ty - pos[k + 1]) * .085; pos[k + 2] += (tz - pos[k + 2]) * .085;
    }
    geo.attributes.position.needsUpdate = true;
    state.rotY += ((fine ? state.mx * .04 : Math.sin(t * .4) * .18) - state.rotY) * .05;
    group.rotation.y = state.rotY + Math.sin(t * .3) * .08;
    group.rotation.x = Math.sin(t * .25) * .06;
    mat.opacity = 1 - E * .7;
    renderer.render(scene, camera);
  };
  if (hasGSAP) gsap.ticker.add(tick);
  else { const loop = () => { tick(); requestAnimationFrame(loop); }; loop(); }
  if (reduce) { state.visible = true; tick(); }
  return state;
})();

/* ==========================================================
   4. Precarga + entrada del hero
   ========================================================== */
const heroIntro = () => {
  if (!hasGSAP) return;
  const tl = gsap.timeline();
  $$(".hero__title .chars").forEach((el, i) => {
    const parts = splitChars(el);
    tl.from(parts, { yPercent: 115, rotate: 6, duration: 1.1, ease: "expo.out", stagger: .025 }, i * .12);
  });
  tl.from(".hero .split-up", { y: 30, opacity: 0, duration: .9, ease: "power3.out", stagger: .1 }, .35);
  tl.from(".header > *", { y: -30, opacity: 0, duration: .8, ease: "power3.out", stagger: .06 }, .2);
  if (particles) gsap.to(particles, { assemble: 1, duration: 2.6, ease: "expo.out" });
};
if (hasGSAP && !reduce) {
  const count = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => { root.classList.add("is-ready"); ScrollTrigger.refresh(); } });
  tl.from(".loader__word span", { yPercent: 110, duration: .8, ease: "expo.out", stagger: .05 })
    .to(count, { v: 100, duration: 1.5, ease: "power2.inOut", onUpdate: () => { $("#loaderNum").textContent = Math.round(count.v); $("#loaderBar").style.width = `${count.v}%`; } }, .2)
    .to(".loader__inner", { y: -40, opacity: 0, duration: .5, ease: "power2.in" })
    .to(".loader__panel", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=.15")
    .add(heroIntro, "-=.7");
} else {
  root.classList.add("is-ready");
  if (particles) particles.assemble = 1;
}

/* ==========================================================
   5. Cursor y botones magnéticos
   ========================================================== */
if (fine && hasGSAP && !reduce) {
  root.classList.add("has-cursor");
  const cur = $("#cursor"), label = $("#cursorLabel");
  const xDot = gsap.quickTo(".cursor__dot", "x", { duration: .1 }), yDot = gsap.quickTo(".cursor__dot", "y", { duration: .1 });
  const xRing = gsap.quickTo(".cursor__ring", "x", { duration: .45, ease: "power3" }), yRing = gsap.quickTo(".cursor__ring", "y", { duration: .45, ease: "power3" });
  addEventListener("pointermove", (e) => { xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("a, button, summary, [data-cursor]");
    cur.classList.toggle("is-hover", !!el);
    const txt = el && el.dataset.cursor;
    cur.classList.toggle("is-label", !!txt); label.textContent = txt || "";
  });
  $$("[data-magnet]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: "elastic.out(1, .4)" }));
  });
}

/* ==========================================================
   6. Animaciones con scroll
   ========================================================== */
if (hasGSAP && !reduce) {
  /* color de fondo que cambia por sección */
  const bgSecs = $$("[data-bg]");
  let bgNow = "";
  const syncBg = () => {
    const mid = innerHeight * .5;
    const sec = bgSecs.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    if (sec && sec.dataset.bg !== bgNow) { bgNow = sec.dataset.bg; gsap.to(main, { backgroundColor: bgNow, duration: .7, ease: "power2.out", overwrite: "auto" }); }
  };
  ScrollTrigger.addEventListener("refresh", syncBg);
  if (lenis) lenis.on("scroll", syncBg); else addEventListener("scroll", syncBg, { passive: true });

  /* el hero se aleja y las partículas explotan */
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom top", scrub: true,
    onUpdate: (self) => { if (particles) particles.explode = self.progress; }
  });
  gsap.to(".hero__content", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 20%", scrub: true } });

  /* manifiesto que se ilumina palabra por palabra */
  const mWords = splitWords($("#manifesto"));
  gsap.to(mWords, { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top 70%", end: "bottom 60%", scrub: true } });

  /* títulos que aparecen por palabras */
  $$(".reveal-lines").forEach((el) => {
    const w = splitWords(el);
    gsap.from(w, { yPercent: 60, opacity: 0, rotate: 3, duration: 1, ease: "expo.out", stagger: .04, scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  gsap.utils.toArray(".kicker, .lead").forEach((el) => {
    gsap.from(el, { y: 24, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  /* cinta que responde a la velocidad del scroll */
  const rows = [{ el: $("#velo1"), x: 0, dir: -1 }, { el: $("#velo2"), x: -50, dir: 1 }];
  let vel = 0;
  gsap.ticker.add((time, dt) => {
    const v = lenis ? lenis.velocity : 0;
    vel += (v - vel) * .1;
    rows.forEach((r) => {
      r.x += r.dir * (.02 + Math.abs(vel) * .012) * (dt / 16);
      if (r.x <= -50) r.x += 50; if (r.x > 0) r.x -= 50;
      gsap.set(r.el, { xPercent: r.x, skewX: gsap.utils.clamp(-12, 12, -vel * .6) });
    });
  });

  /* tarjetas apiladas */
  const sc = $$(".scard");
  sc.forEach((card, i) => {
    const img = $("img", card);
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true } });
    gsap.from($(".scard__img", card), { clipPath: "inset(100% 0 0 0)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 80%" } });
    gsap.from($$(".scard__text > *", card), { y: 40, opacity: 0, duration: .9, ease: "power3.out", stagger: .07, scrollTrigger: { trigger: card, start: "top 75%" } });
    const next = sc[i + 1];
    if (next) gsap.to(card, { scale: .9, filter: "brightness(.55)", ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top 90px", scrub: true } });
  });

  /* servicios en horizontal */
  const track = $("#hzTrack");
  const dist = () => track.scrollWidth - innerWidth;
  const hzTween = gsap.to(track, {
    x: () => -dist(), ease: "none",
    scrollTrigger: { trigger: ".hz", start: "top top", end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true,
      onUpdate: (self) => { $("#hzBar").style.width = `${self.progress * 100}%`; } }
  });
  $$(".hcard").forEach((c) => {
    gsap.from(c, { rotate: 6, y: 80, opacity: .2, ease: "none", scrollTrigger: { trigger: c, containerAnimation: hzTween, start: "left 100%", end: "left 60%", scrub: true } });
  });

  /* método fijo con anillo */
  const steps = $$("#methodSteps li"), num = $("#methodNum"), ring = $("#ringBar");
  ScrollTrigger.create({
    trigger: ".method", start: "top top", end: "+=260%", pin: true, scrub: true,
    onUpdate: (self) => {
      const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
      steps.forEach((s, i) => s.classList.toggle("is-on", i === idx));
      num.textContent = String(idx + 1).padStart(2, "0");
      ring.style.strokeDashoffset = 565.5 * (1 - self.progress);
    }
  });

  /* membresías que entran en 3D */
  gsap.from(".plan", { rotateX: -35, y: 120, opacity: 0, duration: 1.2, ease: "expo.out", stagger: .12, transformOrigin: "50% 100%", scrollTrigger: { trigger: ".plans", start: "top 80%" } });

  /* galería con parallax */
  $$(".gallery__col").forEach((col) => {
    const s = +col.dataset.speed;
    gsap.fromTo(col, { y: -s }, { y: s, ease: "none", scrollTrigger: { trigger: ".gallery", start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* contacto y pie */
  $$(".contact__title .chars").forEach((el, i) => {
    gsap.from(splitChars(el), { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: .03, delay: i * .1, scrollTrigger: { trigger: ".contact", start: "top 70%" } });
  });
  gsap.from(".footer__giant", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".contact", start: "bottom bottom", end: () => `bottom+=${footer.offsetHeight} bottom`, scrub: true } });

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
} else {
  $$("#methodSteps li").forEach((s) => s.classList.add("is-on"));
}

/* inclinación 3D de las membresías */
if (fine && hasGSAP && !reduce) {
  $$("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 14, duration: .5, ease: "power2.out" });
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: .9, ease: "elastic.out(1, .5)" }));
  });
}

/* ==========================================================
   7. Contacto y formulario
   ========================================================== */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad || pend}</li>`;
if (CONTACTO.correo) { const m = $("#mailLink"); m.href = `mailto:${CONTACTO.correo}`; m.textContent = CONTACTO.correo; }
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
