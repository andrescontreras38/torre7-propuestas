/* Hero a ancho completo con varias diapositivas: rota solo cada 6 s, se pausa al
   pasar el cursor, se mueve con flechas, puntos, teclado y deslizando el dedo. */
(() => {
  const hero = document.querySelector(".hf");
  if (!hero) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slides = [...hero.querySelectorAll(".hf__slide")];
  const dots = [...hero.querySelectorAll(".hf__dots button")];
  const now = document.getElementById("hfNow");
  const DUR = 6000;
  let i = 0, timer = null;

  /* títulos palabra por palabra (la animación la hace el CSS al activarse la diapositiva) */
  slides.forEach((sl) => {
    const t = sl.querySelector(".hf__title");
    let n = 0;
    const partir = (nodo) => [...nodo.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w"; w.style.setProperty("--wi", n++); w.textContent = p; f.appendChild(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1) partir(c);
    });
    const texto = t.textContent.replace(/\s+/g, " ").trim();
    partir(t);
    t.setAttribute("aria-label", texto);
  });

  const barra = () => dots.forEach((d, k) => {
    const sel = k === i;
    d.setAttribute("aria-selected", String(sel));
    const b = d.querySelector("i"); b.style.setProperty("--dur", DUR / 1000 + "s");
  });
  const go = (k) => {
    const next = (k + slides.length) % slides.length;
    if (next === i) return;
    slides[i].classList.remove("is-on"); slides[i].setAttribute("aria-hidden", "true");
    i = next;
    slides[i].classList.add("is-on"); slides[i].removeAttribute("aria-hidden");
    if (now) now.textContent = String(i + 1).padStart(2, "0");
    barra();
  };
  const iniciar = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), DUR); }; /* también con movimiento reducido: solo cambia con un fundido suave */
  dots.forEach((d, k) => d.addEventListener("click", () => { go(k); iniciar(); }));
  document.getElementById("hfPrev").addEventListener("click", () => { go(i - 1); iniciar(); });
  document.getElementById("hfNext").addEventListener("click", () => { go(i + 1); iniciar(); });
  hero.addEventListener("pointerenter", () => clearInterval(timer));
  hero.addEventListener("pointerleave", iniciar);
  hero.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { go(i - 1); iniciar(); } if (e.key === "ArrowRight") { go(i + 1); iniciar(); } });
  let x0 = null;
  hero.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); iniciar(); } x0 = null; }, { passive: true });
  barra(); iniciar();
})();
