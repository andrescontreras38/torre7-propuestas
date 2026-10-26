/* Hero bento: fotos que rotan con barra de progreso, título palabra por palabra,
   luz que sigue al puntero y movimiento suave de la foto. */
(() => {
  const main = document.getElementById("hbMain");
  if (!main) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fotos = [...main.querySelectorAll(".hb__photos img")];
  const dots = [...main.querySelectorAll(".hb__dots button")];
  let i = 0, timer;

  /* título palabra por palabra (la animación la hace el CSS) */
  const t = main.querySelector(".hb__title");
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

  const mostrar = (k) => {
    fotos[i].classList.remove("is-on"); dots[i].setAttribute("aria-selected", "false");
    i = (k + fotos.length) % fotos.length;
    fotos[i].classList.add("is-on"); dots[i].setAttribute("aria-selected", "true");
  };
  const iniciar = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => mostrar(i + 1), 6000); };
  dots.forEach((d, k) => d.addEventListener("click", () => { mostrar(k); iniciar(); }));
  main.addEventListener("pointerenter", () => clearInterval(timer));
  main.addEventListener("pointerleave", iniciar);
  iniciar();

  if (reduce || !matchMedia("(hover: hover)").matches) return;
  main.addEventListener("pointermove", (e) => {
    const r = main.getBoundingClientRect();
    main.style.setProperty("--mx", e.clientX - r.left + "px");
    main.style.setProperty("--my", e.clientY - r.top + "px");
  });
})();
