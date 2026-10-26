/* Hero estilo Framer: el texto de la ventana se escribe solo y, al terminar,
   aparecen las tarjetas, las barras se llenan y las gráficas crecen. */
(() => {
  const hero = document.getElementById("inicio");
  const out = document.getElementById("hxType");
  if (!hero || !out || !hero.classList.contains("hx")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frases = [
    "Necesitamos un proyecto listo para presentar a una convocatoria",
    "Queremos ordenar y fortalecer la gestión de nuestra fundación",
    "Buscamos formar a nuestro equipo en indicadores y seguimiento"
  ];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let vivo = false;
  const encender = () => { if (!vivo) { vivo = true; hero.classList.add("is-live"); } };

  if (reduce) { out.textContent = frases[0]; encender(); return; }

  (async () => {
    let k = 0;
    while (true) {
      const f = frases[k % frases.length];
      for (let c = 1; c <= f.length; c++) { out.textContent = f.slice(0, c); await sleep(34); }
      encender();
      await sleep(3600);
      for (let c = f.length; c >= 0; c -= 2) { out.textContent = f.slice(0, Math.max(c, 0)); await sleep(14); }
      k++;
    }
  })();
})();
