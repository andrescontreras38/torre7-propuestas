/* ==========================================================
   Blog — muestra los artículos de BLOG_POSTS (blog-datos.js)
   ========================================================== */
(() => {
  const POSTS = window.BLOG_POSTS || (typeof BLOG_POSTS !== "undefined" ? BLOG_POSTS : []);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const minutes = (p) => Math.max(1, Math.ceil(p.contenido.join(" ").replace(/<[^>]+>/g, " ").split(/\s+/).length / 180));
  const meta = (p) => `<div class="post-meta"><span class="post-cat">${esc(p.categoria)}</span><span>·</span><span>${minutes(p)} min de lectura</span>${p.fecha ? `<span>·</span><span>${esc(p.fecha)}</span>` : ""}${p.ejemplo ? '<span class="post-badge">Borrador de ejemplo</span>' : ""}</div>`;
  const card = (p) => `
    <a class="post-card" href="blog.html#${encodeURIComponent(p.slug)}">
      <div class="post-card__img"><img src="${esc(p.imagen)}" alt="" loading="lazy" width="1600" height="1000"></div>
      <div class="post-card__body">${meta(p)}<h3>${esc(p.titulo)}</h3><p>${esc(p.resumen)}</p><span class="post-card__more">Leer artículo →</span></div>
    </a>`;
  const refresh = () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };

  /* ---------- sección en la página de inicio ---------- */
  const home = document.getElementById("blogHome");
  if (home) {
    home.innerHTML = POSTS.length ? POSTS.slice(0, 3).map(card).join("") : '<p class="blog-empty">Muy pronto publicaremos nuestros primeros artículos.</p>';
    refresh();
  }

  /* ---------- página del blog ---------- */
  const app = document.getElementById("blogApp");
  if (!app) return;
  const baseTitle = document.title;
  let cat = "Todas";
  const cats = ["Todas", ...new Set(POSTS.map((p) => p.categoria))];

  const renderList = () => {
    const list = POSTS.filter((p) => cat === "Todas" || p.categoria === cat);
    app.innerHTML = `
      <header>
        <p class="blog-pill">Blog</p>
        <h1 class="blog-title">Ideas para fortalecer tu organización</h1>
        <p class="blog-lead">Artículos sobre gestión de proyectos, fortalecimiento organizacional, formación, investigación e innovación para organizaciones sociales y ESAL.</p>
      </header>
      ${cats.length > 2 ? `<div class="blog-filters" role="tablist" aria-label="Filtrar por tema">${cats.map((c) => `<button type="button" role="tab" data-cat="${esc(c)}" aria-selected="${c === cat}">${esc(c)}</button>`).join("")}</div>` : '<div style="height:32px"></div>'}
      <div class="blog-grid">${list.length ? list.map(card).join("") : '<p class="blog-empty">Muy pronto publicaremos nuestros primeros artículos.</p>'}</div>`;
    document.title = baseTitle;
    app.querySelectorAll(".blog-filters button").forEach((b) => b.addEventListener("click", () => { cat = b.dataset.cat; renderList(); }));
  };

  const renderPost = (p) => {
    app.innerHTML = `
      <article class="article">
        <a class="article__back" href="blog.html">← Todos los artículos</a>
        ${meta(p)}
        <h1>${esc(p.titulo)}</h1>
        <p class="article__lead">${esc(p.resumen)}</p>
        <figure class="article__img"><img src="${esc(p.imagen)}" alt="" width="1600" height="900"></figure>
        <div class="article__body">${p.contenido.map((c) => (/^\s*</.test(c) ? c : `<p>${c}</p>`)).join("\n")}</div>
        <p class="post-meta" style="margin-top:28px">Por ${esc(p.autor || "Equipo Torre 7")}</p>
        <div class="article__cta">
          <p>¿Quieres apoyo para tu organización?</p>
          <a class="blog-more" href="index.html#contacto">Solicita una asesoría →</a>
        </div>
      </article>`;
    document.title = `${p.titulo} | Blog Torre 7`;
  };

  const route = () => {
    const slug = decodeURIComponent(location.hash.slice(1));
    const p = POSTS.find((x) => x.slug === slug);
    p ? renderPost(p) : renderList();
    window.scrollTo(0, 0);
  };
  addEventListener("hashchange", route);
  route();
})();
