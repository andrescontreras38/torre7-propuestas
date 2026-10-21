/* ==========================================================
   Torre 7 Soluciones Integrales — versión Sobria Plus
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
};

const root = document.documentElement;
root.classList.remove("no-js");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
const motion = hasGSAP && !reduce;
if (motion) { root.classList.add("anim"); gsap.registerPlugin(ScrollTrigger); }

/* ---------- desplazamiento suave ---------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: .11 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href"); const el = id.length > 1 && $(id);
  if (!el) return;
  e.preventDefault();
  document.body.classList.remove("nav-open");
  if (lenis) lenis.scrollTo(el, { offset: -76, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
});

/* ---------- encabezado: se esconde al bajar, aparece al subir ---------- */
const header = $("#header"), progress = $("#progress");
let lastY = 0;
const onScroll = () => {
  const y = scrollY;
  header.classList.toggle("is-scrolled", y > 10);
  header.classList.toggle("is-hidden", y > 400 && y > lastY && !document.body.classList.contains("nav-open"));
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
};
onScroll();
addEventListener("scroll", onScroll, { passive: true });

/* menú móvil */
const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
});

/* enlace activo según la sección visible */
const navLinks = $$('#nav a[href^="#"]');
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean).forEach((s) => io.observe(s));
}

/* ---------- títulos línea por línea ---------- */
const splitLines = (el) => {
  // envuelve palabras, mide líneas y agrupa
  const html = el.innerHTML;
  const tmp = document.createElement("div"); tmp.innerHTML = html;
  const words = [];
  tmp.childNodes.forEach((n) => {
    if (n.nodeType === 3) n.textContent.split(/\s+/).filter(Boolean).forEach((w) => words.push(document.createTextNode(w)));
    else words.push(n.cloneNode(true));
  });
  el.innerHTML = "";
  const spans = words.map((w) => { const s = document.createElement("span"); s.style.display = "inline-block"; s.appendChild(w); el.appendChild(s); el.appendChild(document.createTextNode(" ")); return s; });
  const lines = [];
  spans.forEach((s) => { const top = s.offsetTop; const l = lines.find((x) => Math.abs(x.top - top) < 4); l ? l.items.push(s) : lines.push({ top, items: [s] }); });
  el.innerHTML = lines.map((l) => `<span class="ln"><span>${l.items.map((s) => s.innerHTML).join(" ")}</span></span>`).join("");
  return $$(".ln > span", el);
};

if (motion) {
  /* entrada del inicio */
  const heroLines = splitLines($(".hero h1"));
  const tl = gsap.timeline({ delay: .1 });
  tl.from(".header__inner > *", { y: -20, opacity: 0, duration: .8, ease: "power3.out", stagger: .06 })
    .from(heroLines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .1 }, .15)
    .fromTo(".hero .fade", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .1 }, .35)
    .to(".hero__img", { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" }, .1)
    .from(".hero__img img", { scale: 1.18, duration: 1.8, ease: "expo.out" }, .25)
    .fromTo(".float", { y: 30, scale: .92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .9, ease: "back.out(1.6)", stagger: .15 }, 1);
  gsap.to(".float--a", { marginTop: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
  gsap.to(".float--b", { marginBottom: -10, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.4 });
  gsap.to(".hero__img img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* títulos de sección */
  $$(".sec .split, .contact .split").forEach((h) => {
    const lines = splitLines(h);
    gsap.from(lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: .08, scrollTrigger: { trigger: h, start: "top 88%" } });
  });
  $$(".sec .fade, .contact .fade, .sec .eyebrow").forEach((el) => {
    gsap.fromTo(el, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });
  $$(".stagger").forEach((g) => {
    gsap.fromTo(g.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .1, scrollTrigger: { trigger: g, start: "top 85%" } });
  });
  /* fotos de las líneas con barrido */
  $$(".line__img").forEach((box) => {
    gsap.from(box, { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "expo.inOut", scrollTrigger: { trigger: box, start: "top 85%" } });
  });

  /* cifras que cuentan */
  $$("[data-count]").forEach((el) => {
    const end = +el.dataset.count, from = end > 1000 ? end - 25 : 0, o = { v: from };
    gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });

  /* frase que se ilumina */
  const q = $("#quote");
  q.innerHTML = q.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  const qw = $$(".w", q);
  ScrollTrigger.create({ trigger: ".quote", start: "top 75%", end: "bottom 55%", scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * qw.length); qw.forEach((w, i) => w.classList.toggle("on", i < n)); } });

  /* pasos: línea que se dibuja */
  const steps = $$("#steps li");
  ScrollTrigger.create({ trigger: "#steps", start: "top 75%", end: "bottom 60%", scrub: .6,
    onUpdate: (s) => {
      $("#stepsFill").style.width = `${s.progress * 100}%`;
      steps.forEach((li, i) => li.classList.toggle("is-on", s.progress >= i / (steps.length - 1) - .05));
    } });
  gsap.from("#steps li", { y: 30, opacity: 0, duration: .9, ease: "power3.out", stagger: .12, scrollTrigger: { trigger: "#steps", start: "top 85%" } });

  addEventListener("load", () => ScrollTrigger.refresh());
} else {
  $$("#steps li").forEach((li) => li.classList.add("is-on"));
  const f = $("#stepsFill"); if (f) f.style.width = "100%";
}

/* ---------- servicios: acordeón + foto con fundido ---------- */
const items = $$(".acc__item");
const imgA = $(".svc-photo__a"), imgB = $(".svc-photo__b"), cap = $("#svcCap");
let front = imgA, back = imgB;
const showPhoto = (src, n) => {
  if (front.getAttribute("src") === src) return;
  back.src = src;
  back.classList.add("is-on"); front.classList.remove("is-on");
  [front, back] = [back, front];
  cap.textContent = `Servicio ${n}`;
};
items.forEach((item, i) => {
  const btn = $(".acc__btn", item);
  btn.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    items.forEach((x) => { x.classList.remove("is-open"); $(".acc__btn", x).setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); showPhoto(item.dataset.img, String(i + 1).padStart(2, "0")); }
    if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 550);
  });
});

/* ---------- contacto y formulario ---------- */
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
