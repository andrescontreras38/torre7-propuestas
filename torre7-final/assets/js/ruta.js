/* ¿Por dónde empezar? Dos preguntas → servicio recomendado → WhatsApp con mensaje propio */
(() => {
  const box = document.querySelector(".route-box");
  if (!box) return;
  const RUTAS = {
    ordenar:    { t: "Diagnóstico y fortalecimiento organizacional", d: "Identificamos capacidades, necesidades y oportunidades de mejora, y te entregamos recomendaciones priorizadas. Puedes complementarlo con la Membresía Basic.", s: "el diagnóstico y fortalecimiento organizacional de Torre 7 Proyecta" },
    planear:    { t: "Planeación estratégica y sostenibilidad", d: "Definimos contigo objetivos, prioridades, estrategias e indicadores, con un plan de acción y su esquema de seguimiento.", s: "la planeación estratégica de Torre 7 Proyecta" },
    proyecto:   { t: "Formulación y gestión de proyectos", d: "Convertimos tu idea en un proyecto con objetivos, actividades, recursos, resultados e indicadores: perfil, marco lógico, presupuesto y cronograma.", s: "la formulación de proyectos de Torre 7 Proyecta" },
    financiar:  { t: "Cooperación y movilización de recursos", d: "Identificamos oportunidades pertinentes, analizamos criterios de elegibilidad y armamos la hoja de ruta para postular. No implica garantizar financiación.", s: "la cooperación y movilización de recursos de Torre 7 Proyecta" },
    medir:      { t: "Seguimiento, evaluación y gestión de resultados", d: "Diseñamos indicadores, instrumentos y tableros para monitorear actividades, resultados y avances hacia tus objetivos.", s: "el seguimiento y la evaluación de resultados de Torre 7 Proyecta" },
    formar:     { t: "Torre 7 Capacita", d: "Cursos, talleres y programas a la medida en gestión de proyectos, planeación e indicadores. Presencial, virtual o combinada.", s: "los programas de formación de Torre 7 Capacita" },
    innovar:    { t: "Torre 7 Innova", d: "Diagnóstico de oportunidades, talleres de ideación y cocreación, mejora de procesos y diseño de iniciativas piloto.", s: "los servicios de innovación de Torre 7 Innova" },
    investigar: { t: "Torre 7 Investiga", d: "Diagnósticos, caracterizaciones, diseño de instrumentos, análisis cualitativo y cuantitativo, y sistematización de experiencias.", s: "los servicios de investigación de Torre 7 Investiga" },
    continuo:   { t: "Membresía Standard o Premium", d: "Asesoría individual, hoja de ruta y revisión periódica de avances. Si necesitas mentoría más integral, la Premium es para ti.", s: "las membresías Standard y Premium de Torre 7 Proyecta" }
  };
  const sel = { tipo: "", necesidad: "", txt: "" };
  const out = document.getElementById("routeResult");
  const cta = document.getElementById("rCta");
  const pintar = () => {
    const r = RUTAS[sel.necesidad];
    if (!r) return;
    document.getElementById("rTitle").textContent = r.t;
    document.getElementById("rText").textContent = r.d;
    const quien = sel.tipo ? `Somos ${sel.tipo}` : "Estoy buscando apoyo para mi organización";
    /* mensaje propio para WhatsApp (whatsapp.js lo respeta) */
    cta.dataset.mensaje = `¡Hola! ${quien} y necesitamos ${sel.txt}. Me interesó ${r.s}. ¿Me cuentan cómo lo trabajan?`;
    out.hidden = false;
  };
  box.querySelectorAll(".route-chips").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    if (g.dataset.group === "necesidad") { sel.necesidad = b.dataset.v; sel.txt = b.textContent.trim(); }
    else sel.tipo = b.dataset.v;
    pintar();
  }));
})();
