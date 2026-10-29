/* ==========================================================
   CONFIGURACIÓN DE LA PASARELA DE PAGO (un solo lugar)
   endpoint: dirección de la función de servidor de Bold.
   - Si el sitio se publica en Vercel: "/api/bold-checkout"
   - Si el sitio sigue en GitHub Pages: la dirección completa de la
     función en Vercel, p. ej. "https://torre7-pagos.vercel.app/api/bold-checkout"
   Vacío = la pasarela aún no está activa (la página lo avisa).
   Los precios y las llaves de Bold NO van aquí: van en el servidor.
   ========================================================== */
window.TORRE7_PAGOS = {
  endpoint: "" // PENDIENTE
};
