/* ==========================================================
   PAGOS DE MEMBRESÍAS CON BOLD
   ----------------------------------------------------------
   Cómo conectar Bold (sin tocar nada más):
   1. En el panel de Bold crea un «Link de pago» para cada plan,
      de monto fijo y que se pueda usar varias veces.
   2. En la configuración del link, como página de regreso
      (redirección) pon:  .../torre7-final/gracias.html
   3. Pega aquí el link de cada plan en «link» y su precio en
      «precio» (solo números, en pesos, sin puntos). Ej.: 250000
   Mientras un plan no tenga link, su botón abre WhatsApp para
   que Torre 7 envíe el link de pago a mano.
   ========================================================== */
const PAGOS = {
  planes: {
    basic:    { nombre: "Basic",    precio: null, link: "" },   // PENDIENTE: precio y link de Bold
    standard: { nombre: "Standard", precio: null, link: "" },   // PENDIENTE: precio y link de Bold
    premium:  { nombre: "Premium",  precio: null, link: "" }    // PENDIENTE: precio y link de Bold
  }
};

(() => {
  const pesos = (n) => "$ " + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });

  // precios en las tarjetas
  document.querySelectorAll("[data-precio]").forEach((el) => {
    const plan = PAGOS.planes[el.dataset.precio];
    if (plan && plan.precio) { el.querySelector("b").innerHTML = `${pesos(plan.precio)} <span>COP</span>`; el.classList.remove("is-pend"); }
  });

  // botones de pago: link de Bold si existe; si no, WhatsApp para pedir el link
  document.querySelectorAll(".pay-btn").forEach((a) => {
    const plan = PAGOS.planes[a.dataset.plan];
    if (!plan) return;
    if (plan.link) {
      a.href = plan.link;
      a.target = "_blank";
      a.rel = "noopener";
      a.dataset.wa = "off";
      a.textContent = "Pagar con Bold";
    } else {
      a.href = "#contacto";
      a.textContent = "Solicitar link de pago";
      a.dataset.mensaje = `¡Hola! Quiero pagar la membresía ${plan.nombre} de Torre 7 Proyecta. ¿Me pueden enviar el link de pago?`;
    }
  });

  // página de gracias: Bold regresa con el estado de la transacción en la dirección
  const done = document.getElementById("payDone");
  if (done) {
    const q = new URLSearchParams(location.search);
    const estado = (q.get("bold-tx-status") || "").toLowerCase();
    const orden = q.get("bold-order-id");
    const t = document.getElementById("payTitle"), p = document.getElementById("payText"), ref = document.getElementById("payRef");
    if (orden) { ref.hidden = false; ref.textContent = `Referencia del pago: ${orden}`; }
    if (/rejected|failed|declined/.test(estado)) {
      done.classList.add("is-error");
      t.textContent = "El pago no se completó";
      p.textContent = "Bold no pudo procesar tu pago. Puedes intentarlo de nuevo o escribirnos y te ayudamos a terminarlo.";
    } else if (/pending|processing/.test(estado)) {
      done.classList.add("is-pending");
      t.textContent = "Tu pago está en proceso";
      p.textContent = "Bold está confirmando tu pago. Cuando se apruebe te llegará el comprobante al correo y te contactaremos para activar tu membresía.";
    }
  }
})();
