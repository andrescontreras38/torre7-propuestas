/* Submenú «Servicios»: clic o teclado para abrir y cerrar; Esc y clic fuera lo cierran */
(() => {
  document.querySelectorAll(".nav__drop").forEach((drop) => {
    const btn = drop.querySelector(".nav__trigger");
    const set = (open) => { drop.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); set(!drop.classList.contains("is-open")); });
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); btn.focus(); } });
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) set(false); });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
    drop.querySelectorAll(".nav__menu a").forEach((a) => a.addEventListener("click", () => set(false)));
  });
})();
