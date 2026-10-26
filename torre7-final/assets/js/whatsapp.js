/* ==========================================================
   Botones de contacto → WhatsApp con mensaje según la página o el servicio
   Todos los botones «Solicita asesoría», «Solicitar información», «Escríbenos»,
   membresías, programas, etc. abren WhatsApp con un mensaje ya escrito.
   - Si el botón trae data-interes (p. ej. «Membresía Standard»), el mensaje lo menciona.
   - Si no, el mensaje usa el tema de la página donde está el visitante.
   - En los artículos del blog, el mensaje cita el título del artículo.
   Para cambiar el número: NUMERO (solo dígitos, con indicativo del país).
   ========================================================== */
(() => {
  const NUMERO = "573117723689"; /* +57 311 772 3689 */
  const archivo = location.pathname.split("/").pop() || "index.html";
  const enArticulo = /\/blog\/[^/]+\.html$/.test(location.pathname);

  const PAGINAS = {
    "index.html": ["Inicio", "una asesoría inicial para mi organización"],
    "nosotros.html": ["Quiénes somos", "los servicios de Torre 7"],
    "proyecta.html": ["Torre 7 Proyecta", "fortalecimiento organizacional y gestión de proyectos"],
    "capacita.html": ["Torre 7 Capacita", "formación y programas para mi organización"],
    "innova.html": ["Torre 7 Innova", "innovación para mi organización"],
    "investiga.html": ["Torre 7 Investiga", "investigación aplicada"],
    "conecta.html": ["Torre 7 Conecta (Red de aliados)", "la Red Torre 7 y cómo registrar mi organización"],
    "blog.html": ["Blog", "asesoría para mi organización"]
  };
  const [pagina, tema] = PAGINAS[archivo] || ["sitio web", "los servicios de Torre 7"];

  const mensaje = (el) => {
    let interes = (el.dataset.interes || "").trim();
    /* el botón del portafolio de Proyecta menciona el servicio que está seleccionado */
    const servicio = el.classList.contains("svc-panel__btn") ? document.getElementById("stTitle")?.textContent.trim() : "";
    if (servicio) interes = `Torre 7 Proyecta – ${servicio}`;
    if (enArticulo) {
      const titulo = (document.querySelector("h1")?.textContent || "").trim();
      return `Hola, equipo de Torre 7. Leí el artículo «${titulo}» en su blog y quiero ${interes ? "información sobre: " + interes : "asesoría para mi organización"}.`;
    }
    return `Hola, equipo de Torre 7. Estoy en la página de ${pagina} y quiero información sobre ${interes ? ": " + interes : tema}.`.replace("sobre :", "sobre:");
  };
  const enlace = (el) => `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje(el))}`;

  const SELECTOR = 'a[href="#contacto"], a[href$="index.html#contacto"], a[data-interes]';
  const aplicar = (raiz) => raiz.querySelectorAll(SELECTOR).forEach((a) => {
    if (a.dataset.wa === "off" || a.closest("#contacto")) return;
    a.href = enlace(a);
    a.target = "_blank";
    a.rel = "noopener";
  });

  aplicar(document);
  /* al hacer clic se recalcula el enlace (por si cambió el servicio seleccionado) */
  document.addEventListener("click", (e) => {
    const a = e.target.closest(SELECTOR);
    if (a && a.dataset.wa !== "off" && !a.closest("#contacto")) a.href = enlace(a);
  }, true);
  /* contenido que se dibuja después (blog.html) */
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && aplicar(n.parentNode || n)))).observe(document.body, { childList: true, subtree: true });
})();
