/* Páginas legales: índice automático en la barra lateral */
(() => {
  const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const toc = document.getElementById("lgToc");
  document.querySelectorAll("#legalDoc .article__body h2").forEach((h) => {
    h.id = h.id || "s-" + norm(h.textContent);
    const li = document.createElement("li");
    li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
    li.firstChild.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - 90, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", "#" + h.id);
    });
    toc.appendChild(li);
  });
  // resalta la sección que se está leyendo
  if ("IntersectionObserver" in window) {
    const links = [...toc.querySelectorAll("a")];
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll("#legalDoc .article__body h2").forEach((h) => io.observe(h));
  }
  const d = new Date(document.lastModified);
  document.getElementById("lgDate").textContent = d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  document.getElementById("bpYear").textContent = new Date().getFullYear();
})();
