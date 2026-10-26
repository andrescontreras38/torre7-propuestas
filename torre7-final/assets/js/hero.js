/* Hero a ancho completo: fotos que rotan cada 6 s con barra de progreso
   y título que entra palabra por palabra. */
(() => {
  const hero = document.querySelector(".hf");
  if (!hero) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fotos = [...hero.querySelectorAll(".hf__photos img")];
  const dots = [...hero.querySelectorAll(".hf__dots button")];
  let i = 0, timer;

  const t = hero.querySelector(".hf__title");
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
  hero.addEventListener("pointerenter", () => clearInterval(timer));
  hero.addEventListener("pointerleave", iniciar);
  iniciar();
})();
