/* ==========================================================
   FINALIZAR COMPRA (checkout.html) — membresías con Bold
   1. La persona elige el plan y escribe sus datos de facturación.
   2. Se validan aquí y de nuevo en el servidor.
   3. El servidor fija el precio y firma la orden (firma de integridad).
   4. Se abre el checkout oficial de Bold; si no carga, se usa el
      checkout de Bold en su propia página (link de pago).
   5. Bold regresa a gracias.html, que consulta el estado real.
   ========================================================== */
(() => {
  const form = document.getElementById("checkout");
  if (!form) return;
  const EP = (window.TORRE7_PAGOS || {}).endpoint || "";
  const WA = "573117723689";
  const BOLD_JS = "https://checkout.bold.co/library/boldPaymentButton.js";
  const PLAN = {
    basic:    { nombre: "Basic",    lema: "Impulsa tu gestión",        lista: ["Inscripción en la Red Torre 7 y perfil institucional básico", "Kit digital de autogestión organizacional", "Diagnóstico inicial de autogestión", "Orientación grupal periódica"] },
    standard: { nombre: "Standard", lema: "Fortalece tu organización", lista: ["Todo lo de Basic", "Ruta de fortalecimiento organizacional personalizada", "Sesión individual de orientación mensual", "Seguimiento periódico de avances*"] },
    premium:  { nombre: "Premium",  lema: "Maximiza tu impacto",       lista: ["Todo lo de Standard", "Dos sesiones individuales al mes", "Jornada trimestral presencial de fortalecimiento*", "Informe trimestral de avances*"] }
  };
  const $ = (id) => document.getElementById(id);
  const pesos = (n) => "$ " + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (plan) => `https://wa.me/${WA}?text=${encodeURIComponent(`¡Hola! Quiero comprar la membresía ${PLAN[plan].nombre} de Torre 7 Proyecta y necesito ayuda con el pago.`)}`;
  const boton = $("coGo"), msg = $("coMsg");

  // plan elegido desde pagar.html (?plan=)
  const pre = new URLSearchParams(location.search).get("plan");
  if (PLAN[pre]) form.querySelector(`input[name="plan"][value="${pre}"]`).checked = true;

  let precios = {}, activa = false;
  const cargar = EP
    ? fetch(EP, { cache: "no-store" }).then((r) => r.json()).then((d) => { precios = d.planes || {}; activa = !!d.configurada; }).catch(() => {})
    : Promise.resolve();

  const precioDe = (k) => (precios[k] && precios[k].precio) || null;
  const listo = () => activa && !!precioDe(form.plan.value);

  function resumen() {
    const k = form.plan.value, p = PLAN[k], pr = precioDe(k);
    $("sumPlan").textContent = `Membresía ${p.nombre}`;
    $("sumLema").textContent = p.lema;
    $("sumLista").innerHTML = p.lista.map((x) => `<li>${esc(x)}</li>`).join("") + '<li class="co-sum__more"><a href="proyecta.html#comparativo" target="_blank" rel="noopener">Ver todos los beneficios</a></li>';
    const txt = pr ? pesos(pr) : "Por confirmar";
    $("sumPrecio").textContent = txt; $("sumSub").textContent = txt; $("sumTotal").textContent = pr ? `${pesos(pr)} COP` : "Por confirmar";
    document.querySelectorAll("[data-precio-co]").forEach((el) => { const v = precioDe(el.dataset.precioCo); el.textContent = v ? pesos(v) : "Precio por confirmar"; });
    boton.textContent = listo() ? `Pagar ${pesos(pr)} con Bold` : "Pagar con Bold";
    if (activa && msg.classList.contains("is-info")) { msg.className = "co-msg"; msg.textContent = ""; }
    if (!activa) {
      msg.className = "co-msg is-info";
      msg.innerHTML = `La pasarela de pago en línea se está activando. Mientras tanto, <a href="${wa(k)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a> y te ayudamos a completar tu compra.`;
    }
  }
  function orgObligatoria() {
    const nit = form.tipoDoc.value === "NIT";
    form.organizacion.required = nit;
    form.querySelector("[data-org-hint]").textContent = nit ? "* (razón social)" : "(opcional)";
  }
  form.addEventListener("change", (e) => {
    if (e.target.name === "plan") resumen();
    if (e.target.name === "tipoDoc") orgObligatoria();
    const c = e.target.closest(".field, .consent"); if (c) c.classList.remove("is-invalid");
    if (msg.classList.contains("is-error") && !form.querySelector(".is-invalid")) { msg.className = "co-msg"; msg.textContent = ""; }
  });
  form.addEventListener("input", (e) => { const c = e.target.closest(".field"); if (c && c.classList.contains("is-invalid") && e.target.value.trim()) c.classList.remove("is-invalid"); });
  orgObligatoria();
  resumen();
  cargar.then(resumen);

  // ---------- validación ----------
  const reglas = {
    correo: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    celular: (v) => v.replace(/\D/g, "").length >= 10,
    documento: (v) => v.replace(/[^0-9A-Za-z]/g, "").length >= 5,
    nombre: (v) => v.trim().length >= 3,
    direccion: (v) => v.trim().length >= 5
  };
  function validar() {
    let primero = null;
    form.querySelectorAll("[required]").forEach((f) => {
      const v = f.type === "checkbox" ? f.checked : f.value.trim();
      const mal = f.type === "checkbox" ? !v : (!v || (reglas[f.name] && !reglas[f.name](f.value)));
      (f.closest(".field") || f.closest(".consent")).classList.toggle("is-invalid", mal);
      if (mal && !primero) primero = f;
    });
    if (primero) primero.focus();
    return !primero;
  }

  // ---------- librería oficial de Bold ----------
  let libreria = null;
  function cargarBold() {
    if (window.BoldCheckout) return Promise.resolve(true);
    if (libreria) return libreria;
    libreria = new Promise((ok) => {
      const s = document.createElement("script");
      s.src = BOLD_JS; s.async = true;
      s.onload = () => { let n = 0; const t = setInterval(() => { if (window.BoldCheckout || ++n > 40) { clearInterval(t); ok(!!window.BoldCheckout); } }, 100); };
      s.onerror = () => ok(false);
      document.head.appendChild(s);
    });
    return libreria;
  }

  const ocupado = (si, texto) => { boton.disabled = si; boton.textContent = texto || (listo() ? `Pagar ${pesos(precioDe(form.plan.value))} con Bold` : "Pagar con Bold"); };
  const error = (t) => { msg.className = "co-msg is-error"; msg.innerHTML = `${esc(t)} Si el problema sigue, <a href="${wa(form.plan.value)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.`; };

  async function pedir(accion) {
    const d = Object.fromEntries(new FormData(form));
    const r = await fetch(EP, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion, plan: d.plan, website: d.website || "", volver: new URL("gracias.html", location.href).href,
        comprador: { nombre: d.nombre, tipoDoc: d.tipoDoc, documento: d.documento, organizacion: d.organizacion, correo: d.correo, celular: d.celular, departamento: d.departamento, ciudad: d.ciudad, direccion: d.direccion, terminos: !!d.terminos, datos: !!d.datos }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "No pudimos iniciar el pago.");
    return j;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "co-msg"; msg.textContent = "";
    if (!validar()) { msg.className = "co-msg is-error"; msg.textContent = "Revisa los campos marcados en rojo."; return; }
    await cargar;
    if (!listo()) { resumen(); return; }
    ocupado(true, "Preparando tu pago seguro…");
    try {
      const orden = await pedir("pagar");
      if (await cargarBold()) {
        const checkout = new window.BoldCheckout({
          orderId: orden.orderId, currency: orden.currency, amount: orden.amount,
          apiKey: orden.apiKey, integritySignature: orden.integritySignature,
          description: orden.description, redirectionUrl: orden.redirectionUrl,
          customerData: JSON.stringify(orden.customerData), billingAddress: JSON.stringify(orden.billingAddress)
        });
        checkout.open();
        ocupado(false);
      } else {
        const l = await pedir("link");           // respaldo: checkout de Bold en su propia página
        location.href = l.url;
      }
    } catch (err) {
      ocupado(false);
      error(err.message);
    }
  });
})();
