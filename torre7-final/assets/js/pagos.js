/* ==========================================================
   PAGO DE MEMBRESÍAS CON BOLD (pasarela integrada)
   ----------------------------------------------------------
   pagar.html muestra los precios (del servidor) y lleva a
   checkout.html (finalizar compra). gracias.html consulta el
   estado real del pago al regresar de Bold.
   Los precios se configuran en el servidor (ver api/bold-checkout.js).
   ========================================================== */
const PAGOS = window.TORRE7_PAGOS || { endpoint: "" };   // se configura en pagos-config.js

(() => {
  const pesos = (n) => "$ " + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
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
