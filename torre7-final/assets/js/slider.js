/* Banner deslizante de la portada: rota solo, se pausa al pasar el mouse,
   se puede deslizar con el dedo y usar con las flechas del teclado. */
(() => {
  const root = document.getElementById("slider");
  if (!root) return;
  const slides = [...root.querySelectorAll(".slide")];
  const dots = [...root.querySelectorAll(".slider__dots button")];
  const now = document.getElementById("slideNow");
  const DUR = 6000;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.style.setProperty("--dur", DUR / 1000 + "s");
  if (reduce) root.classList.add("is-static");
  let i = 0, timer = null, paused = false;

  const go = (n) => {
    const next = (n + slides.length) % slides.length;
    if (next === i) return;
    slides[i].classList.remove("is-active"); slides[i].setAttribute("aria-hidden", "true");
    dots[i].setAttribute("aria-selected", "false");
    i = next;
    slides[i].classList.add("is-active"); slides[i].removeAttribute("aria-hidden");
    // reinicia la barra de progreso del punto activo
    const bar = dots[i].querySelector("i"); bar.style.display = "none"; void bar.offsetWidth; bar.style.display = "";
    dots[i].setAttribute("aria-selected", "true");
    now.textContent = String(i + 1).padStart(2, "0");
    restart();
  };
  const restart = () => {
    clearTimeout(timer);
    if (!reduce && !paused) timer = setTimeout(() => go(i + 1), DUR);
  };
  const pause = (v) => { paused = v; root.classList.toggle("is-paused", v); v ? clearTimeout(timer) : restart(); };

  document.getElementById("slideNext").addEventListener("click", () => go(i + 1));
  document.getElementById("slidePrev").addEventListener("click", () => go(i - 1));
  dots.forEach((d, n) => d.addEventListener("click", () => go(n)));
  root.addEventListener("mouseenter", () => pause(true));
  root.addEventListener("mouseleave", () => pause(false));
  root.addEventListener("focusin", () => pause(true));
  root.addEventListener("focusout", () => pause(false));
  root.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); });
  // deslizar con el dedo
  let x0 = null;
  root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
  // no rotar mientras no se ve
  new IntersectionObserver(([en]) => { if (!en.isIntersecting) clearTimeout(timer); else if (!paused) restart(); }).observe(root);
  document.addEventListener("visibilitychange", () => { document.hidden ? clearTimeout(timer) : restart(); });
  restart();
})();
