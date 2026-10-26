/* ==========================================================
   Genera las páginas estáticas del blog para SEO y GEO.

   Uso (desde la carpeta torre7-final):
     node tools/build-blog.mjs                 → páginas con noindex (versión de propuesta)
     node tools/build-blog.mjs --indexable     → páginas indexables (cuando el sitio se publique)
     node tools/build-blog.mjs --base=https://torre7.com.co/   → dominio real

   Lee los artículos de assets/js/blog-nuevos.js y blog-datos.js y crea:
     blog/<slug>.html   una página por artículo, con HTML completo (sin depender de JavaScript),
                        metadatos, Open Graph y datos estructurados JSON-LD
                        (BlogPosting, BreadcrumbList y FAQPage)
     sitemap.xml        mapa del sitio
     robots.txt         reglas para rastreadores (incluye los de IA)
     llms.txt           resumen del sitio y de sus artículos para asistentes de IA
   ========================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const INDEXABLE = process.argv.includes("--indexable");
const BASE = (arg("base") || "https://andrescontreras38.github.io/torre7-propuestas/torre7-final/").replace(/\/?$/, "/");
const ORG = "Torre 7 Soluciones Integrales S.A.S.";

/* ---------- carga de los datos ---------- */
const ctx = vm.createContext({});
for (const f of ["blog-nuevos.js", "blog-datos.js"]) {
  const code = fs.readFileSync(path.join(root, "assets/js", f), "utf8").replace(/^const (\w+) =/m, "var $1 =");
  vm.runInContext(code, ctx, { filename: f });
}
const POSTS = ctx.BLOG_POSTS;

/* ---------- utilidades ---------- */
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const plain = (h) => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const norm = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slugify = (t) => norm(plain(t)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const words = (p) => plain([p.respuesta, ...p.contenido, ...(p.faq || []).flatMap((f) => [f.q, f.a])].filter(Boolean).join(" ")).split(" ").length;
const minutes = (p) => Math.max(1, Math.ceil(words(p) / 180));
const iso = (p) => p.fechaISO || "2026-10-26";
const abs = (rel) => BASE + rel.replace(/^\//, "");

/* los enlaces del contenido se escriben desde la raíz del sitio; en blog/ se ajustan */
const fixLinks = (html) => html.replace(/href='([^']+)'/g, (m, h) => {
  if (/^(https?:|mailto:|#)/.test(h)) return `href="${h}"`;
  return h.startsWith("blog/") ? `href="${h.slice(5)}"` : `href="../${h}"`;
});

const render = (p) => {
  const toc = [];
  const body = p.contenido.map((c) => {
    const m = c.match(/^\s*<h2>(.*?)<\/h2>\s*$/i);
    if (m) {
      const id = "s-" + slugify(m[1]);
      toc.push({ id, txt: plain(m[1]).replace(/^\d+[.)]\s*/, "") });
      return `<h2 id="${id}">${m[1]}</h2>`;
    }
    return /^\s*</.test(c) ? fixLinks(c) : `<p>${fixLinks(c)}</p>`;
  }).join("\n");
  const faq = p.faq?.length ? `
        <section class="article__faq" id="preguntas-frecuentes" aria-labelledby="faqT">
          <h2 id="faqT">Preguntas frecuentes</h2>
          ${p.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n          ")}
        </section>` : "";
  if (p.faq?.length) toc.push({ id: "preguntas-frecuentes", txt: "Preguntas frecuentes" });
  const related = POSTS.filter((x) => x.slug !== p.slug)
    .sort((a, b) => (b.categoria === p.categoria) - (a.categoria === p.categoria)).slice(0, 3);

  const url = abs(`blog/${p.slug}.html`);
  const ld = [{
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: p.titulo, description: p.resumen, image: abs(p.imagen),
    datePublished: iso(p), dateModified: iso(p), inLanguage: "es-CO",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: ORG, url: BASE },
    publisher: { "@type": "Organization", name: ORG, logo: { "@type": "ImageObject", url: abs("assets/img/logo-h.png") } },
    articleSection: p.categoria, wordCount: words(p),
    about: p.categoria
  }, {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [["Inicio", BASE], ["Blog", abs("blog.html")], [p.titulo, url]].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item }))
  }];
  if (p.faq?.length) ld.push({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  });
  const robots = INDEXABLE && !p.ejemplo ? "index, follow, max-snippet:-1, max-image-preview:large" : "noindex, nofollow";

  return `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="${robots}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.titulo)} | Blog Torre 7</title>
  <meta name="description" content="${esc(p.resumen)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Torre 7 Soluciones Integrales">
  <meta property="og:title" content="${esc(p.titulo)}">
  <meta property="og:description" content="${esc(p.resumen)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${abs(p.imagen)}">
  <meta property="article:published_time" content="${iso(p)}">
  <meta property="article:section" content="${esc(p.categoria)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="../assets/img/favicon.png">
  <link rel="stylesheet" href="../assets/css/styles.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/blog.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/legal.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/blog-lateral.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/premium.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/delicado.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/minimal.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/efectos.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/corporativo.css?v=202610261200">
  <link rel="stylesheet" href="../assets/css/articulo.css?v=202610261200">
${ld.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body style="--bp-top-bg: rgba(255,255,255,.92); --bp-top-bg-solid: #fff; --bp-top-ink: #141414; --bp-top-line: rgba(20,20,19,.1);">

<header class="bp-top">
  <div class="blog-wrap bp-top__in">
    <a href="../index.html" class="bp-logo" aria-label="Torre 7 Soluciones Integrales - inicio"><img src="../assets/img/logo-h.png" alt="Torre 7 Soluciones Integrales" width="451" height="152"></a>
    <nav class="bp-nav" aria-label="Principal">
      <a href="../index.html" class="bp-hide">Inicio</a>
      <a href="../blog.html" aria-current="page">Blog</a>
      <a href="../index.html#contacto" class="bp-btn">Solicita asesoría</a>
    </nav>
  </div>
</header>

<main class="blog-page" data-theme="light" style="--b-head: 'Bebas Neue', Impact, 'Arial Narrow', sans-serif; --b-head-w: 400; --b-title-ls: .01em;">
  <div class="blog-wrap">
    <article class="article" itemscope itemtype="https://schema.org/BlogPosting">
      <nav class="article__crumbs" aria-label="Ruta de navegación"><a href="../index.html">Inicio</a><span>/</span><a href="../blog.html">Blog</a><span>/</span><span aria-current="page">${esc(p.categoria)}</span></nav>
      <div class="post-meta"><span class="post-cat">${esc(p.categoria)}</span><span>·</span><span>${minutes(p)} min de lectura</span><span>·</span><time datetime="${iso(p)}" itemprop="datePublished">${esc(p.fecha || "26 de octubre de 2026")}</time>${p.ejemplo ? '<span class="post-badge">Borrador de ejemplo</span>' : ""}</div>
      <h1 itemprop="headline">${esc(p.titulo)}</h1>
      <p class="article__lead">${esc(p.resumen)}</p>
      ${p.respuesta ? `<aside class="article__brief" aria-label="Respuesta breve"><b>En breve</b><p>${esc(p.respuesta)}</p></aside>` : ""}
      <figure class="article__img"><img src="../${p.imagen}" alt="${esc(p.imagenAlt || p.titulo)}" width="1600" height="900" fetchpriority="high"></figure>
      <nav class="article__toc" aria-label="En este artículo"><b>En este artículo</b><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.txt)}</a></li>`).join("")}</ol></nav>
      <div class="article__body" itemprop="articleBody">
${body}
      </div>${faq}
      <p class="article__author">Por <b>${esc(p.autor || "Equipo Torre 7")}</b> · ${ORG} · Actualizado el <time datetime="${iso(p)}">${esc(p.fecha || "26 de octubre de 2026")}</time></p>
      <p class="article__note">Este contenido es orientativo y no reemplaza la asesoría jurídica, contable o tributaria. Verifica la normativa vigente antes de tomar decisiones.</p>
      <div class="article__cta">
        <p>¿Quieres apoyo para tu organización?</p>
        <a class="blog-more" href="../index.html#contacto">Solicita una asesoría →</a>
      </div>
    </article>
    <section class="article__related" aria-labelledby="relT">
      <h2 id="relT">Sigue leyendo</h2>
      <div class="blog-grid">
        ${related.map((r) => `<a class="post-card" href="${r.slug}.html"><div class="post-card__img"><img src="../${r.imagen}" alt="" loading="lazy" width="1600" height="1000"></div><div class="post-card__body"><div class="post-meta"><span class="post-cat">${esc(r.categoria)}</span><span>·</span><span>${minutes(r)} min de lectura</span></div><h3>${esc(r.titulo)}</h3><p>${esc(r.resumen)}</p><span class="post-card__more">Leer artículo →</span></div></a>`).join("\n        ")}
      </div>
    </section>
  </div>
</main>

<footer class="bp-foot">
  <div class="blog-wrap"><span>© <span id="bpYear">2026</span> ${ORG}</span><span class="lg-foot"><a href="../privacidad.html">Datos personales</a> <a href="../terminos.html">Términos</a> <a href="../cookies.html">Cookies</a></span></div>
</footer>
<script>document.getElementById("bpYear").textContent = new Date().getFullYear();</script>
</body>
</html>
`;
};

/* ---------- escritura ---------- */
fs.mkdirSync(path.join(root, "blog"), { recursive: true });
for (const p of POSTS) fs.writeFileSync(path.join(root, "blog", `${p.slug}.html`), render(p));

const pages = ["", "nosotros.html", "proyecta.html", "capacita.html", "innova.html", "investiga.html", "conecta.html", "blog.html"];
const urls = [...pages.map((x) => [abs(x), "2026-10-26"]), ...POSTS.map((p) => [abs(`blog/${p.slug}.html`), iso(p)])];
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);

const ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];
fs.writeFileSync(path.join(root, "robots.txt"), INDEXABLE
  ? `User-agent: *\nAllow: /\n\n${ai.map((b) => `User-agent: ${b}\nAllow: /\n`).join("\n")}\nSitemap: ${abs("sitemap.xml")}\n`
  : `# Versión de propuesta: sin indexar. Al publicar el sitio, ejecuta: node tools/build-blog.mjs --indexable\nUser-agent: *\nDisallow: /\n`);

fs.writeFileSync(path.join(root, "llms.txt"), `# Torre 7 Soluciones Integrales S.A.S.

> Empresa colombiana que diseña y desarrolla soluciones integrales para fortalecer organizaciones, con especial atención a las entidades sin ánimo de lucro (ESAL) y las organizaciones sociales: gestión de proyectos, fortalecimiento organizacional, formación, investigación aplicada e innovación.

## Líneas de servicio
- [Torre 7 Proyecta](${abs("proyecta.html")}): fortalecimiento organizacional y gestión de proyectos; membresías Basic, Standard y Premium.
- [Torre 7 Capacita](${abs("capacita.html")}): formación y desarrollo de capacidades.
- [Torre 7 Innova](${abs("innova.html")}): innovación y transformación organizacional.
- [Torre 7 Investiga](${abs("investiga.html")}): investigación aplicada y generación de conocimiento.
- [Torre 7 Conecta](${abs("conecta.html")}): red de aliados, organizaciones y profesionales.
- [Quiénes somos](${abs("nosotros.html")})

## Blog: guías para organizaciones sociales y ESAL
${POSTS.filter((p) => !p.ejemplo).map((p) => `- [${p.titulo}](${abs(`blog/${p.slug}.html`)}): ${p.resumen}`).join("\n")}
`);

console.log(`${POSTS.length} artículos → blog/*.html · sitemap.xml · robots.txt · llms.txt (${INDEXABLE ? "indexable" : "noindex"})`);
