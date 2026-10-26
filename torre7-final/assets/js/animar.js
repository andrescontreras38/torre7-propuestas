/* Animaciones de entrada, movimiento al desplazarse e inclinación de tarjetas */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-anim");

  // elementos que entran con un desplazamiento suave
  const auto = ".head, .logos > *, .feats li, .plan, .tl__item, .faq details, .nums > div, .svc-sec__head, .svc-sec__grid > *, .cta-card__copy > *, .red-esal__head, .blog-head, .lead-steps li, .tile, .ucard, .why-card, .route-box, .why-cta, .finale__inner > *";
  document.querySelectorAll(auto).forEach((el) => {
    if (el.classList.contains("reveal")) return;
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", `${Math.min(i, 6) * 0.09}s`);
    el.classList.add("a-in");
  });

  // filas de dos columnas: el texto entra escalonado
  document.querySelectorAll(".split").forEach((row) => {
    const txt = row.querySelector(".split__text");
    if (txt) [...txt.children].forEach((c, i) => c.style.setProperty("--i", i));
  });

  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    io.unobserve(en.target);
  }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".a-in, .split").forEach((el) => io.observe(el));

  // las imágenes se desplazan un poco más lento que la página
  const imgs = [...document.querySelectorAll(".split__media > img, .collage img")];
  let tick = false;
  const mover = () => {
    tick = false;
    const h = innerHeight;
    imgs.forEach((img) => {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      const p = (r.top + r.height / 2 - h / 2) / h;
      img.style.transform = `translateY(${(p * -22).toFixed(1)}px) scale(1.06)`;
    });
  };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(mover); } }, { passive: true });
  mover();

  // inclinación suave de las tarjetas con el puntero (solo con mouse)
  if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".plan, .tile--txt, .split__media--ui").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }
})();
