/* ==========================================================
   Torre 7 Soluciones Integrales — versión Sobria
   ========================================================== */

/* ----------------------------------------------------------
   DATOS DE CONTACTO — completar los que falten.
   whatsapp: solo números con indicativo, ej. "573001234567"
   ---------------------------------------------------------- */
const CONTACTO = {
  whatsapp: "",                             // PENDIENTE
  telefono: "",                             // PENDIENTE
  correo: "torre7.colombia@gmail.com",      // correo oficial del cliente
  ciudad: "",                               // PENDIENTE
};

const $ = (s) => document.querySelector(s);

/* menú móvil */
const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", open);
  burger.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => {
  document.body.classList.remove("nav-open");
  burger.setAttribute("aria-expanded", "false");
}));

/* datos de contacto */
const pend = '<span class="pending">Por confirmar</span>';
const waLink = (txt) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(txt)}`;
$("#contactData").innerHTML = `
  <li><small>Correo</small>${CONTACTO.correo ? `<a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a>` : pend}</li>
  <li><small>WhatsApp</small>${CONTACTO.whatsapp ? `<a href="${waLink("Hola Torre 7, quiero más información.")}" target="_blank" rel="noopener">${CONTACTO.telefono || "+" + CONTACTO.whatsapp}</a>` : pend}</li>
  <li><small>Ubicación</small>${CONTACTO.ciudad || pend}</li>`;
$("#year").textContent = new Date().getFullYear();

/* formulario */
const form = $("#form"), msg = $("#formMsg"), interes = $("#interes");
form.querySelector("button[type=submit]").textContent = CONTACTO.whatsapp ? "Enviar solicitud por WhatsApp" : "Enviar solicitud por correo";
document.addEventListener("click", (e) => { const el = e.target.closest("[data-interes]"); if (el) interes.value = el.dataset.interes; });
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.closest(".field").classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = "Por favor completa los campos marcados."; return; }
  const d = Object.fromEntries(new FormData(form));
  const texto = `Hola Torre 7, quiero solicitar información.\n\n*Nombre:* ${d.nombre}\n*Organización:* ${d.organizacion}\n*Correo:* ${d.correo}\n*Teléfono:* ${d.telefono || "-"}\n*Interés:* ${d.interes}\n\n${d.mensaje}`;
  if (CONTACTO.whatsapp) {
    window.open(waLink(texto), "_blank", "noopener");
    msg.textContent = "¡Gracias! Te abrimos WhatsApp para enviar tu solicitud.";
  } else if (CONTACTO.correo) {
    location.href = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent("Solicitud: " + d.interes)}&body=${encodeURIComponent(texto.replace(/\*/g, ""))}`;
    msg.textContent = "¡Gracias! Abrimos tu correo para enviar la solicitud.";
  }
});
