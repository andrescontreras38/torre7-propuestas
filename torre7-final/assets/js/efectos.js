/* Efectos del banner y de la página: títulos palabra por palabra, luz que sigue al
   puntero, botones magnéticos, panel de servicios en el banner y brillo en tarjetas */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hover = matchMedia("(hover: hover)").matches;
  const root = document.documentElement;

  // ---------- panel de servicios dentro del banner ----------
  const lineas = [["Proyectos", "proyecta.html"], ["Formación", "capacita.html"], ["Innovación", "innova.html"], ["Investigación", "investiga.html"], ["Colabora con nosotros", "conecta.html"]];
  const actual = location.pathname.split("/").pop();
  document.querySelectorAll(".slider").forEach((s) => {
    const nav = document.createElement("nav");
    nav.className = "slider__lines";
    nav.setAttribute("aria-label", "Servicios de Torre 7");
    nav.innerHTML = `<span class="slider__lines-t">Nuestros servicios</span>` + lineas.map(([n, h], i) =>
      `<a href="${h}" style="--i:${i}"${h === actual ? ' aria-current="page"' : ""}><i></i>${n}<b aria-hidden="true">→</b></a>`).join("");
    s.appendChild(nav);
  });

  if (reduce) return;
  root.classList.add("js-fx");

  // ---------- títulos palabra por palabra ----------
  const partir = (el) => {
    let n = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w"; w.style.setProperty("--wi", n++); w.textContent = t;
            frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
      });
    };
    walk(el);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    el.classList.add("is-split");
  };
  document.querySelectorAll(".slide__title").forEach(partir);
  const titulos = [...document.querySelectorAll("main .h2, main .split__h--xl, .finale__title")].filter((t) => !t.closest(".slide"));
  titulos.forEach(partir);
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-seen");
    io.unobserve(e.target);
  }), { threshold: 0.35 });
  titulos.forEach((t) => io.observe(t));

  if (!hover) return;

  // ---------- luz que sigue al puntero en el banner ----------
  document.querySelectorAll(".slider").forEach((s) => {
    s.addEventListener("pointermove", (e) => {
      const r = s.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      s.style.setProperty("--mx", x + "px");
      s.style.setProperty("--my", y + "px");
      const dx = (x / r.width - 0.5), dy = (y / r.height - 0.5);
      s.style.setProperty("--px", (dx * -14).toFixed(1) + "px");
      s.style.setProperty("--py", (dy * -10).toFixed(1) + "px");
    });
    s.addEventListener("pointerleave", () => { s.style.setProperty("--px", "0px"); s.style.setProperty("--py", "0px"); });
  });

  // ---------- brillo que sigue al puntero en tarjetas ----------
  document.querySelectorAll(".plan, .rowc, .info, .tl__card, .nums > div, .faq details, .tile--txt").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--cx", (e.clientX - r.left) + "px");
      c.style.setProperty("--cy", (e.clientY - r.top) + "px");
    });
  });

  // ---------- botones magnéticos ----------
  document.querySelectorAll(".btn--grad, .btn--dark, .footer__cta").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.28;
      b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
})();
