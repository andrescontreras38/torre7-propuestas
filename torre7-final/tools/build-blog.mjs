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
const V = new Date().toISOString().replace(/\D/g, "").slice(0, 12); /* versión de CSS/JS: evita que el navegador use copias viejas */

/* ---------- carga de los datos ---------- */
const ctx = vm.createContext({});
for (const f of ["blog-nuevos.js", "blog-datos.js", "blog-seo.js"]) {
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

/* ---------- barra lateral (misma que blog.html) ---------- */
const catCount = POSTS.reduce((m, p) => (m[p.categoria] = (m[p.categoria] || 0) + 1, m), {});
const sidebar = (p, toc) => `
      <aside class="bl-side" aria-label="Barra lateral del blog">
        <div class="bl-box">
          <form action="../blog.html" method="get" role="search"><label class="bl-search"><span class="sr">Buscar en el blog</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input type="search" name="q" placeholder="Buscar artículos…"></label></form>
        </div>
        ${toc.length ? `<div class="bl-box"><h3 class="bl-h">En este artículo</h3><ol class="bl-toc">${toc.map((t) => `<li><a href="#${t.id}">${esc(t.txt)}</a></li>`).join("")}</ol></div>` : ""}
        <div class="bl-box">
          <h3 class="bl-h">Categorías</h3>
          <ul class="bl-cats">
            <li><a href="../blog.html"><span>Todas</span><b>${POSTS.length}</b></a></li>
            ${Object.entries(catCount).map(([c, n]) => `<li><a href="../blog.html?cat=${encodeURIComponent(c)}"${c === p.categoria ? ' aria-current="true"' : ""}><span>${esc(c)}</span><b>${n}</b></a></li>`).join("")}
          </ul>
        </div>
        <div class="bl-box">
          <h3 class="bl-h">Más artículos</h3>
          <ul class="bl-recent">
            ${POSTS.filter((x) => x.slug !== p.slug).slice(0, 4).map((x) => `<li><a href="${x.slug}.html"><img src="../${x.imagen}" alt="" loading="lazy" width="160" height="120"><span><b>${esc(x.titulo)}</b><small>${minutes(x)} min de lectura</small></span></a></li>`).join("")}
          </ul>
        </div>
        <div class="bl-cta">
          <p class="bl-cta__kicker">Torre 7 Proyecta</p>
          <h3>¿Quieres apoyo para tu organización?</h3>
          <p>Te acompañamos a fortalecer tu gestión con una propuesta a tu medida.</p>
          <a class="btn btn--dark btn--block" href="../index.html#contacto">Solicita una asesoría →</a>
        </div>
        <div class="bl-box">
          <h3 class="bl-h">Membresías</h3>
          <ul class="bl-plans">
            <li><a href="../proyecta.html#membresias"><b>Basic</b><span>Impulsa tu gestión</span></a></li>
            <li class="is-pop"><a href="../proyecta.html#membresias"><b>Standard</b><span>Fortalece tu organización</span></a></li>
            <li><a href="../proyecta.html#membresias"><b>Premium</b><span>Maximiza tu impacto</span></a></li>
          </ul>
        </div>
        <a class="bl-red" href="../conecta.html"><span class="bl-red__ic" aria-hidden="true">✦</span><span><b>¿Tu organización es una ESAL?</b><small>Regístrala gratis en la Red Torre 7 →</small></span></a>
      </aside>`;

const render = (p) => {
  const toc = [];
  const body = p.contenido.map((c) => {
    const m = c.match(/^\s*<h2>(.*?)<\/h2>\s*$/i);
    if (m) {
      const id = "s-" + slugify(m[1]);
      toc.push({ id, txt: plain(m[1]).replace(/^\d+[.)]\s*/, "") });
      return `<h2 id="${id}">${m[1]}</h2>`;
    }
    return /^\s*</.test(c) ? fixLinks(c).replace(/<table>/g, '<div class="article__table"><table>').replace(/<\/table>/g, '</table></div>') : `<p>${fixLinks(c)}</p>`;
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
  const desc = p.descripcion || p.resumen;
  const titleSeo = p.tituloSeo || p.titulo;
  const fuentes = p.fuentes?.length ? `
      <section class="article__sources" aria-labelledby="srcT">
        <h2 id="srcT">Para profundizar</h2>
        <ul>${p.fuentes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul>
      </section>` : "";
  const ld = [{
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: p.titulo, alternativeHeadline: titleSeo, description: desc,
    image: { "@type": "ImageObject", url: abs(p.imagen), caption: p.imagenAlt || p.titulo },
    thumbnailUrl: abs(p.imagen),
    datePublished: iso(p), dateModified: iso(p), inLanguage: "es-CO",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "Blog", name: "Blog Torre 7 Soluciones Integrales", url: abs("blog.html") },
    author: { "@type": "Organization", name: ORG, url: BASE },
    publisher: { "@type": "Organization", name: ORG, logo: { "@type": "ImageObject", url: abs("assets/img/logo-h.png") } },
    articleSection: p.categoria, wordCount: words(p),
    keywords: [p.categoria, "ESAL", "organizaciones sociales", "Colombia"].join(", "),
    about: [{ "@type": "Thing", name: p.categoria }, { "@type": "Thing", name: "Entidades sin ánimo de lucro (ESAL)" }],
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".article__brief p"] }
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
  <title>${esc(titleSeo)} | Torre 7</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es-CO" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <link rel="alternate" type="application/rss+xml" title="Blog Torre 7" href="../feed.xml">
  <meta name="author" content="${esc(p.autor || "Equipo Torre 7")}">
  <meta name="theme-color" content="#0b5c33">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Torre 7 Soluciones Integrales">
  <meta property="og:title" content="${esc(p.titulo)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${abs(p.imagen)}">
  <meta property="og:image:alt" content="${esc(p.imagenAlt || p.titulo)}">
  <meta property="article:published_time" content="${iso(p)}">
  <meta property="article:modified_time" content="${iso(p)}">
  <meta property="article:section" content="${esc(p.categoria)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.titulo)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${abs(p.imagen)}">
  <link rel="preload" href="../assets/fonts/BebasNeue.otf" as="font" type="font/otf" crossorigin>
  <link rel="preload" href="../assets/fonts/DINPro-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="icon" type="image/png" href="../assets/img/favicon.png">
  <link rel="stylesheet" href="../assets/css/styles.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/blog.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/legal.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/blog-lateral.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/premium.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/delicado.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/minimal.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/efectos.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/corporativo.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/articulo.css?v=202610261300">
  <link rel="stylesheet" href="../assets/css/textos.css?v=202610261300">
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
    <div class="bl-layout bl-layout--post">
    <article class="article bl-main" itemscope itemtype="https://schema.org/BlogPosting">
      <nav class="article__crumbs" aria-label="Ruta de navegación"><a href="../index.html">Inicio</a><span>/</span><a href="../blog.html">Blog</a><span>/</span><span aria-current="page">${esc(p.categoria)}</span></nav>
      <div class="post-meta"><span class="post-cat">${esc(p.categoria)}</span><span>·</span><span>${minutes(p)} min de lectura</span><span>·</span><time datetime="${iso(p)}" itemprop="datePublished">${esc(p.fecha || "26 de octubre de 2026")}</time>${p.ejemplo ? '<span class="post-badge">Borrador de ejemplo</span>' : ""}</div>
      <h1 itemprop="headline">${esc(p.titulo)}</h1>
      <p class="article__lead">${esc(p.resumen)}</p>
      ${p.respuesta ? `<aside class="article__brief" aria-label="Respuesta breve"><b>En breve</b><p>${esc(p.respuesta)}</p></aside>` : ""}
      <figure class="article__img"><img src="../${p.imagen}" alt="${esc(p.imagenAlt || p.titulo)}" width="1600" height="900" fetchpriority="high" decoding="async"></figure>
      <nav class="article__toc" aria-label="En este artículo"><b>En este artículo</b><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.txt)}</a></li>`).join("")}</ol></nav>
      <div class="article__body" itemprop="articleBody">
${body}
      </div>${faq}${fuentes}
      <p class="article__author">Por <b>${esc(p.autor || "Equipo Torre 7")}</b> · ${ORG} · Actualizado el <time datetime="${iso(p)}">${esc(p.fecha || "26 de octubre de 2026")}</time></p>
      <p class="article__note">Este contenido es orientativo y no reemplaza la asesoría jurídica, contable o tributaria. Verifica la normativa vigente antes de tomar decisiones.</p>
      <div class="article__cta">
        <p>¿Quieres apoyo para tu organización?</p>
        <a class="blog-more" href="../index.html#contacto">Solicita una asesoría →</a>
      </div>
    </article>
    ${sidebar(p, toc)}
    </div>
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
<script src="../assets/js/whatsapp.js?v=${V}" defer></script>
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

/* ---------- llms-full.txt: todos los artículos en texto plano (Markdown) para asistentes de IA ---------- */
const md = (html) => html
  .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n").replace(/<li>(.*?)<\/li>/gi, "- $1\n").replace(/<\/tr>/gi, "\n")
  .replace(/<\/t[dh]>/gi, " | ").replace(/<a [^>]*href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/gi, "$2")
  .replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
fs.writeFileSync(path.join(root, "llms-full.txt"), `# Torre 7 Soluciones Integrales S.A.S. — Blog completo\n\n> Guías prácticas para ESAL y organizaciones sociales en Colombia. Contenido orientativo: verifica la normativa vigente antes de decidir sobre temas legales o tributarios.\n\n` +
  POSTS.filter((p) => !p.ejemplo).map((p) => `# ${p.titulo}\n\nURL: ${abs(`blog/${p.slug}.html`)}\nCategoría: ${p.categoria}\nFecha: ${iso(p)}\n\n${p.respuesta ? `**En breve:** ${p.respuesta}\n\n` : ""}${p.contenido.map(md).join("\n\n")}\n\n${p.faq?.length ? `## Preguntas frecuentes\n\n${p.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}\n` : ""}`).join("\n---\n\n"));

/* ---------- feed.xml (RSS) ---------- */
const xml = (t) => esc(t).replace(/'/g, "&apos;");
fs.writeFileSync(path.join(root, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>Blog Torre 7 Soluciones Integrales</title>\n<link>${abs("blog.html")}</link>\n<description>Guías prácticas para ESAL y organizaciones sociales en Colombia.</description>\n<language>es-CO</language>\n${POSTS.filter((p) => !p.ejemplo).map((p) => `<item><title>${xml(p.titulo)}</title><link>${abs(`blog/${p.slug}.html`)}</link><guid>${abs(`blog/${p.slug}.html`)}</guid><pubDate>${new Date(iso(p) + "T12:00:00-05:00").toUTCString()}</pubDate><category>${xml(p.categoria)}</category><description>${xml(p.descripcion || p.resumen)}</description></item>`).join("\n")}\n</channel></rss>\n`);

/* ---------- blog.html: contenido visible sin JavaScript + datos estructurados ---------- */
const bf = path.join(root, "blog.html");
let bh = fs.readFileSync(bf, "utf8");
const real = POSTS.filter((p) => !p.ejemplo);
const listHtml = `<!--ssr:start-->
    <header class="bl-head"><p class="blog-pill">Blog</p><h1 class="blog-title">Ideas para fortalecer tu organización</h1><p class="blog-lead">Guías prácticas para ESAL y organizaciones sociales en Colombia: planeación, proyectos, indicadores, presupuesto, financiación, sostenibilidad y gobierno.</p></header>
    <ul class="blog-ssr">${POSTS.map((p) => `<li><a href="blog/${p.slug}.html"><b>${esc(p.titulo)}</b></a> <span>${esc(p.categoria)}</span><p>${esc(p.descripcion || p.resumen)}</p></li>`).join("")}</ul>
    <!--ssr:end-->`;
bh = bh.replace(/<!--ssr:start-->[\s\S]*?<!--ssr:end-->/, "").replace(/(<div class="blog-wrap" id="blogApp">)\s*(<\/div>)?/, (m, a, b) => `${a}\n    ${listHtml}\n  ${b || ""}`);
const blogLd = [{
  "@context": "https://schema.org", "@type": "CollectionPage", name: "Blog Torre 7 Soluciones Integrales", url: abs("blog.html"), inLanguage: "es-CO",
  description: "Guías prácticas para ESAL y organizaciones sociales en Colombia.",
  mainEntity: { "@type": "ItemList", itemListElement: real.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`blog/${p.slug}.html`), name: p.titulo })) }
}, { "@context": "https://schema.org", "@type": "Blog", name: "Blog Torre 7 Soluciones Integrales", url: abs("blog.html"), inLanguage: "es-CO", publisher: { "@type": "Organization", name: ORG, url: BASE } }];
bh = bh.replace(/<!--blogseo:start-->[\s\S]*?<!--blogseo:end-->\n?/, "").replace("</head>", `<!--blogseo:start-->
  <link rel="canonical" href="${abs("blog.html")}">
  <link rel="alternate" hreflang="es-CO" href="${abs("blog.html")}">
  <link rel="alternate" hreflang="x-default" href="${abs("blog.html")}">
  <link rel="alternate" type="application/rss+xml" title="Blog Torre 7" href="feed.xml">
  <meta property="og:type" content="website"><meta property="og:locale" content="es_CO"><meta property="og:site_name" content="Torre 7 Soluciones Integrales">
  <meta property="og:title" content="Blog para ESAL y organizaciones sociales | Torre 7"><meta property="og:url" content="${abs("blog.html")}">
  <meta property="og:description" content="Guías prácticas para ESAL y organizaciones sociales en Colombia: planeación, proyectos, indicadores, presupuesto, financiación, sostenibilidad y gobierno.">
  <meta property="og:image" content="${abs("assets/img/portada.webp")}">
  <meta name="twitter:card" content="summary_large_image">
${blogLd.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<!--blogseo:end-->
</head>`);
bh = bh.replace(/<title>[^<]*<\/title>/, "<title>Blog para ESAL y organizaciones sociales | Torre 7</title>")
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="Guías prácticas para ESAL y organizaciones sociales en Colombia: planeación, proyectos, indicadores, presupuesto, financiación, sostenibilidad y gobierno.">`)
  .replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${INDEXABLE ? "index, follow, max-snippet:-1, max-image-preview:large" : "noindex, nofollow"}">`);
fs.writeFileSync(bf, bh);

console.log(`${POSTS.length} artículos → blog/*.html · sitemap.xml · robots.txt · llms.txt (${INDEXABLE ? "indexable" : "noindex"})`);
