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

  /* ---------- página del blog (con barra lateral) ---------- */
  const app = document.getElementById("blogApp");
  if (!app) return;
  const baseTitle = document.title;
  let cat = "Todas", query = "";
  const norm = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const catCount = POSTS.reduce((m, p) => (m[p.categoria] = (m[p.categoria] || 0) + 1, m), {});
  const slugify = (t) => norm(t).replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const sidebar = (current, toc) => `
    <aside class="bl-side" aria-label="Barra lateral del blog">
      <div class="bl-box">
        <label class="bl-search"><span class="sr">Buscar en el blog</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="search" id="blSearch" placeholder="Buscar artículos…" value="${esc(query)}">
        </label>
      </div>
      ${toc && toc.length ? `<div class="bl-box"><h3 class="bl-h">En este artículo</h3><ol class="bl-toc">${toc.map((t) => `<li><a href="#${current.slug}" data-toc="${t.id}">${esc(t.txt)}</a></li>`).join("")}</ol></div>` : ""}
      <div class="bl-box">
        <h3 class="bl-h">Categorías</h3>
        <ul class="bl-cats">
          <li><button type="button" data-cat="Todas" aria-pressed="${!current && cat === "Todas"}"><span>Todas</span><b>${POSTS.length}</b></button></li>
          ${Object.entries(catCount).map(([c, n]) => `<li><button type="button" data-cat="${esc(c)}" aria-pressed="${!current && cat === c}"><span>${esc(c)}</span><b>${n}</b></button></li>`).join("")}
        </ul>
      </div>
      <div class="bl-box">
        <h3 class="bl-h">${current ? "Más artículos" : "Recientes"}</h3>
        <ul class="bl-recent">
          ${POSTS.filter((p) => !current || p.slug !== current.slug).slice(0, 4).map((p) => `
            <li><a href="blog.html#${encodeURIComponent(p.slug)}"><img src="${esc(p.imagen)}" alt="" loading="lazy" width="160" height="120"><span><b>${esc(p.titulo)}</b><small>${minutes(p)} min de lectura</small></span></a></li>`).join("")}
        </ul>
      </div>
      <div class="bl-cta">
        <div class="mesh mesh--card" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <p class="bl-cta__kicker">Torre 7 Proyecta</p>
        <h3>¿Quieres apoyo para tu organización?</h3>
        <p>Te acompañamos a fortalecer tu gestión con una propuesta a tu medida.</p>
        <a class="btn btn--dark btn--block" href="index.html#contacto">Solicita una asesoría →</a>
      </div>
      <div class="bl-box">
        <h3 class="bl-h">Membresías</h3>
        <ul class="bl-plans">
          <li><a href="index.html#membresias"><b>Basic</b><span>Para empezar a fortalecer la gestión</span></a></li>
          <li class="is-pop"><a href="index.html#membresias"><b>Standard</b><span>Acompañamiento periódico</span></a></li>
          <li><a href="index.html#membresias"><b>Premium</b><span>Acompañamiento integral</span></a></li>
        </ul>
      </div>
      <a class="bl-red" href="index.html#red"><span class="bl-red__ic" aria-hidden="true">✦</span><span><b>¿Tu organización es una ESAL?</b><small>Únete a nuestra Red de ESAL →</small></span></a>
    </aside>`;

  const bindSide = () => {
    const input = app.querySelector("#blSearch");
    input.addEventListener("input", () => {
      query = input.value;
      if (location.hash) { history.replaceState(null, "", "blog.html"); }
      renderList(true);
    });
    app.querySelectorAll(".bl-cats button").forEach((b) => b.addEventListener("click", () => {
      cat = b.dataset.cat; query = "";
      if (location.hash) history.replaceState(null, "", "blog.html");
      renderList(); window.scrollTo({ top: 0, behavior: "smooth" });
    }));
    app.querySelectorAll("[data-toc]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const el = document.getElementById(a.dataset.toc);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: "smooth" });
    }));
  };

  const renderList = (keepFocus) => {
    const q = norm(query.trim());
    const list = POSTS.filter((p) => (cat === "Todas" || p.categoria === cat) && (!q || norm(`${p.titulo} ${p.resumen} ${p.categoria}`).includes(q)));
    app.innerHTML = `
      <header class="bl-head">
        <p class="blog-pill">Blog</p>
        <h1 class="blog-title">Ideas para fortalecer tu organización</h1>
        <p class="blog-lead">Artículos sobre gestión de proyectos, fortalecimiento organizacional, formación, investigación e innovación para organizaciones sociales y ESAL.</p>
      </header>
      <div class="bl-layout">
        <div class="bl-main">
          ${(cat !== "Todas" || q) ? `<p class="bl-filter">Mostrando <b>${list.length}</b> ${list.length === 1 ? "artículo" : "artículos"}${cat !== "Todas" ? ` en <b>${esc(cat)}</b>` : ""}${q ? ` para “${esc(query.trim())}”` : ""} · <button type="button" id="blClear">Ver todos</button></p>` : ""}
          <div class="blog-grid bl-grid">${list.length ? list.map(card).join("") : '<p class="blog-empty">No encontramos artículos con ese criterio.</p>'}</div>
        </div>
        ${sidebar(null)}
      </div>`;
    document.title = baseTitle;
    bindSide();
    const clr = app.querySelector("#blClear");
    if (clr) clr.addEventListener("click", () => { cat = "Todas"; query = ""; renderList(); });
    if (keepFocus) { const i = app.querySelector("#blSearch"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  };

  const renderPost = (p) => {
    const toc = [];
    const body = p.contenido.map((c) => {
      const m = c.match(/^\s*<h2>(.*?)<\/h2>\s*$/i);
      if (m) { const id = "s-" + slugify(m[1]); toc.push({ id, txt: m[1].replace(/<[^>]+>/g, "").replace(/^\s*\d+[.)]\s*/, "") }); return `<h2 id="${id}">${m[1]}</h2>`; }
      return /^\s*</.test(c) ? c : `<p>${c}</p>`;
    }).join("\n");
    app.innerHTML = `
      <div class="bl-layout bl-layout--post">
        <article class="article bl-main">
          <a class="article__back" href="blog.html">← Todos los artículos</a>
          ${meta(p)}
          <h1>${esc(p.titulo)}</h1>
          <p class="article__lead">${esc(p.resumen)}</p>
          <figure class="article__img"><img src="${esc(p.imagen)}" alt="" width="1600" height="900"></figure>
          <div class="article__body">${body}</div>
          <p class="post-meta" style="margin-top:28px">Por ${esc(p.autor || "Equipo Torre 7")}</p>
          <div class="article__cta">
            <p>¿Quieres apoyo para tu organización?</p>
            <a class="blog-more" href="index.html#contacto">Solicita una asesoría →</a>
          </div>
        </article>
        ${sidebar(p, toc)}
      </div>`;
    document.title = `${p.titulo} | Blog Torre 7`;
    bindSide();
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
