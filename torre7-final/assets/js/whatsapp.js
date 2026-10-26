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

  /* Mensajes escritos como los diría una persona: cálidos, directos y sin tecnicismos.
     PAGINAS: qué dice quien escribe desde cada página cuando el botón es general. */
  const PAGINAS = {
    "index.html": "¡Hola! Estuve revisando su página web y me gustaría que me contaran cómo pueden acompañar a mi organización.",
    "nosotros.html": "¡Hola! Estuve conociendo a Torre 7 y me gustaría saber cómo podrían acompañar a mi organización.",
    "proyecta.html": "¡Hola! Estuve viendo Torre 7 Proyecta y me gustaría saber cómo pueden ayudarnos a fortalecer nuestra organización y a sacar adelante nuestros proyectos.",
    "capacita.html": "¡Hola! Estuve viendo los programas de formación de Torre 7 Capacita y me gustaría recibir más información.",
    "innova.html": "¡Hola! Me interesó Torre 7 Innova y me gustaría conversar sobre cómo innovar en mi organización.",
    "investiga.html": "¡Hola! Estuve viendo Torre 7 Investiga y me gustaría saber cómo podrían apoyarnos con una investigación.",
    "conecta.html": "¡Hola! Me gustaría saber cómo hacer parte de la Red ESAL de Torre 7.",
    "blog.html": "¡Hola! Estuve leyendo su blog y me gustaría recibir asesoría para mi organización."
  };

  /* Cuando el botón trae data-interes, se convierte en una frase natural. */
  const minus = (t) => t.charAt(0).toLowerCase() + t.slice(1);
  const frase = (interes) => {
    if (/^Asesoría inicial/i.test(interes)) return "Me gustaría agendar una asesoría inicial para mi organización.";
    if (/^Registrar mi organización/i.test(interes)) return "Quiero registrar mi organización en la Red ESAL de Torre 7. ¿Cómo es el proceso?";
    if (/^Conocer la Red de Profesionales/i.test(interes)) return "Me gustaría saber cómo hacer parte de la Red de Profesionales de Torre 7.";
    if (/^Membresía/i.test(interes)) return `Me interesa la ${minus(interes)} de Torre 7 Proyecta. ¿Me cuentan qué incluye y cómo funciona?`;
    if (/^Torre 7 Capacita/i.test(interes)) return "Me gustaría recibir información sobre los programas de formación de Torre 7 Capacita.";
    if (/^Torre 7 Investiga/i.test(interes)) return "Me gustaría recibir información sobre los servicios de investigación de Torre 7 Investiga.";
    if (/^Torre 7 Proyecta – /.test(interes)) return `Me interesa el servicio de ${minus(interes.replace(/^Torre 7 Proyecta – /, ""))} de Torre 7 Proyecta. ¿Me pueden dar más información?`;
    if (/^Torre 7 Proyecta/i.test(interes)) return "Me gustaría recibir información sobre fortalecimiento organizacional y gestión de proyectos con Torre 7 Proyecta.";
    if (/^Capacita /i.test(interes)) return `Me interesa ${interes}, de Torre 7 Capacita. ¿Me pueden dar más información?`;
    if (/^Innova /i.test(interes)) return `Me gustaría recibir información sobre el servicio de ${interes.replace(/^Innova /i, "")} de Torre 7 Innova.`;
    if (/^Investiga: /i.test(interes)) return `Me gustaría recibir información sobre ${minus(interes.replace(/^Investiga: /i, ""))} con Torre 7 Investiga.`;
    return `Me gustaría recibir información sobre ${interes}.`;
  };

  const mensaje = (el) => {
    let interes = (el.dataset.interes || "").trim();
    /* el botón del portafolio de Proyecta menciona el servicio que está seleccionado */
    const servicio = el.classList.contains("svc-panel__btn") ? document.getElementById("stTitle")?.textContent.trim() : "";
    if (servicio) interes = `Torre 7 Proyecta – ${servicio}`;
    if (enArticulo) {
      const titulo = (document.querySelector("h1")?.textContent || "").trim();
      return `¡Hola! Acabo de leer su artículo «${titulo}» y me gustaría recibir asesoría para mi organización.${interes ? " " + frase(interes) : ""}`;
    }
    if (interes) return `¡Hola! ${frase(interes)}${archivo === "index.html" ? "" : " Los vi en su página web."}`;
    return PAGINAS[archivo] || "¡Hola! Estuve revisando su página web y me gustaría que me contaran cómo pueden acompañar a mi organización.";
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
