/* ==========================================================
   PAGO DE MEMBRESÍAS CON BOLD (pasarela integrada)
   ----------------------------------------------------------
   El botón «Pagar con Bold» abre una ventana de compra; al
   confirmar, la función de servidor /api/bold-checkout crea el
   pago en Bold y la persona pasa al checkout seguro de Bold
   (tarjeta o PSE). Al terminar, Bold la regresa a gracias.html,
   que consulta el estado real del pago.
   Los precios se configuran en el servidor (ver api/bold-checkout.js).

   ENDPOINT: dirección de la función. Si el sitio está en Vercel
   déjalo como "/api/bold-checkout". Si el sitio sigue en GitHub
   Pages, pon la dirección completa de la función en Vercel.
   ========================================================== */
const PAGOS = {
  endpoint: "" // PENDIENTE: p. ej. "https://torre7-pagos.vercel.app/api/bold-checkout" o "/api/bold-checkout"
};

(() => {
  const WA = "573117723689";
  const pesos = (n) => "$ " + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const NOMBRES = { basic: "Basic", standard: "Standard", premium: "Premium" };
  let planes = null;            // precios que entrega el servidor
  let activa = false;           // la pasarela respondió y está configurada

  const cargar = PAGOS.endpoint
    ? fetch(PAGOS.endpoint, { cache: "no-store" }).then((r) => r.json()).then((d) => { planes = d.planes || null; activa = !!d.configurada; }).catch(() => {})
    : Promise.resolve();

  // ---------- precios en las tarjetas ----------
  cargar.then(() => {
    document.querySelectorAll("[data-precio]").forEach((el) => {
      const p = planes && planes[el.dataset.precio];
      if (p && p.precio) { el.querySelector("b").innerHTML = `${pesos(p.precio)} <span>COP</span>`; el.classList.remove("is-pend"); }
    });
  });

  // ---------- ventana de compra ----------
  const botones = document.querySelectorAll(".pay-btn");
  if (botones.length) {
    const dlg = document.createElement("dialog");
    dlg.className = "pay-modal";
    dlg.setAttribute("aria-labelledby", "payModalTitle");
    document.body.appendChild(dlg);

    const wa = (plan) => `https://wa.me/${WA}?text=${encodeURIComponent(`¡Hola! Quiero pagar la membresía ${NOMBRES[plan]} de Torre 7 Proyecta y necesito ayuda con el pago.`)}`;

    const abrir = (plan) => {
      const p = planes && planes[plan];
      const listo = activa && p && p.precio;
      dlg.innerHTML = `
        <button type="button" class="pay-modal__x" aria-label="Cerrar">×</button>
        <p class="pay-modal__kicker">Membresía Torre 7 Proyecta</p>
        <h2 class="pay-modal__title" id="payModalTitle">${NOMBRES[plan]}</h2>
        <p class="pay-modal__price">${listo ? `${pesos(p.precio)} <span>COP · pago único</span>` : "<span>Pago único</span>"}</p>
        ${listo ? `
        <form class="pay-modal__form" novalidate>
          <label class="field"><span>Nombre completo *</span><input name="nombre" required autocomplete="name"></label>
          <label class="field"><span>Correo electrónico *</span><input name="correo" type="email" required autocomplete="email"></label>
          <label class="field"><span>Organización</span><input name="organizacion" autocomplete="organization"></label>
          <label class="consent"><input type="checkbox" name="acepto" required> <span>Acepto los <a href="terminos.html#pagos" target="_blank" rel="noopener">términos y condiciones</a> y la <a href="privacidad.html" target="_blank" rel="noopener">política de tratamiento de datos</a>.</span></label>
          <button type="submit" class="btn btn--grad btn--block pay-modal__go">Continuar al pago con Bold →</button>
          <p class="pay-modal__msg" role="status" aria-live="polite"></p>
          <p class="pay-modal__safe">Pagarás en la plataforma segura de Bold con tarjeta o PSE. Torre 7 no recibe los datos de tu tarjeta.</p>
        </form>` : `
        <div class="pay-modal__off">
          <p>La pasarela de pago en línea se está activando. Muy pronto podrás pagar tu membresía aquí mismo con tarjeta o PSE.</p>
          <a class="btn btn--dark btn--block" href="${wa(plan)}" target="_blank" rel="noopener" data-wa="off">Escríbenos por WhatsApp</a>
        </div>`}`;
      dlg.querySelector(".pay-modal__x").addEventListener("click", () => dlg.close());
      const form = dlg.querySelector("form");
      if (form) form.addEventListener("submit", (e) => pagar(e, form, plan));
      dlg.showModal();
      const primero = dlg.querySelector("input");
      if (primero) primero.focus();
    };

    const pagar = async (e, form, plan) => {
      e.preventDefault();
      const msg = form.querySelector(".pay-modal__msg"), boton = form.querySelector(".pay-modal__go");
      let ok = true;
      form.querySelectorAll("[required]").forEach((f) => {
        const mal = f.type === "checkbox" ? !f.checked : (!f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)));
        (f.closest(".field") || f.closest(".consent")).classList.toggle("is-invalid", mal);
        if (mal) ok = false;
      });
      if (!ok) { msg.textContent = "Completa los campos marcados para continuar."; return; }
      const d = Object.fromEntries(new FormData(form));
      boton.disabled = true; boton.textContent = "Conectando con Bold…"; msg.textContent = "";
      try {
        const r = await fetch(PAGOS.endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, nombre: d.nombre, correo: d.correo, organizacion: d.organizacion, volver: new URL("gracias.html", location.href).href })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.url) throw new Error(j.error || "No pudimos iniciar el pago.");
        location.href = j.url;   // checkout seguro de Bold
      } catch (err) {
        boton.disabled = false; boton.textContent = "Continuar al pago con Bold →";
        msg.innerHTML = `${esc(err.message)} Si el problema sigue, <a href="${wa(plan)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.`;
      }
    };

    botones.forEach((b) => b.addEventListener("click", () => cargar.then(() => abrir(b.dataset.plan))));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });   // clic fuera cierra

    // llegar desde «Pagar en línea →» de otra página abre directamente ese plan
    const desde = location.hash.replace("#", "");
    if (NOMBRES[desde]) { const t = document.getElementById(desde); if (t) t.scrollIntoView({ block: "center" }); }
  }

  // ---------- página de gracias: estado real del pago ----------
  const done = document.getElementById("payDone");
  if (done) {
    const q = new URLSearchParams(location.search);
    const ref = q.get("ref") || q.get("bold-order-id");
    const t = document.getElementById("payTitle"), p = document.getElementById("payText"), r = document.getElementById("payRef");
    const mostrar = (estado) => {
      done.classList.remove("is-error", "is-pending");
      if (estado === "declined" || estado === "voided" || /rejected|failed/.test(estado || "")) {
        done.classList.add("is-error");
        t.textContent = "El pago no se completó";
        p.textContent = "Bold no pudo procesar tu pago. Puedes intentarlo de nuevo desde la página de membresías o escribirnos y te ayudamos.";
      } else if (estado === "pending" || /processing/.test(estado || "")) {
        done.classList.add("is-pending");
        t.textContent = "Tu pago está en proceso";
        p.textContent = "Bold está confirmando tu pago. Cuando se apruebe te llegará el comprobante al correo y te contactaremos para activar tu membresía.";
      }
    };
    if (ref) { r.hidden = false; r.textContent = `Referencia del pago: ${ref}`; }
    const directo = (q.get("bold-tx-status") || "").toLowerCase();
    if (directo) mostrar(directo);
    if (ref && PAGOS.endpoint) {
      fetch(`${PAGOS.endpoint}?ref=${encodeURIComponent(ref)}`, { cache: "no-store" }).then((x) => x.json()).then((j) => { if (j.estado) mostrar(j.estado); }).catch(() => {});
    }
  }
})();
