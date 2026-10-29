/* ==========================================================
   SEO y GEO de las páginas principales (inicio, nosotros y los cinco servicios)

   Uso (desde la carpeta torre7-final):
     node tools/seo-paginas.mjs                       → con noindex (versión de propuesta)
     node tools/seo-paginas.mjs --indexable --base=https://dominio-real/

   Para cada página actualiza el título y la descripción, el idioma (es-CO), la
   etiqueta robots y un bloque delimitado por <!--seo:start--> … <!--seo:end-->
   con URL canónica, hreflang, Open Graph, Twitter Cards y datos estructurados
   JSON-LD (Organization, WebSite, Service, AboutPage, BreadcrumbList y FAQPage).
   Se puede ejecutar varias veces: reemplaza el bloque anterior.
   ========================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const INDEXABLE = process.argv.includes("--indexable");
const BASE = (arg("base") || "https://andrescontreras38.github.io/torre7-propuestas/torre7-final/").replace(/\/?$/, "/");
const abs = (r) => BASE + r.replace(/^\//, "");
const ORG = "Torre 7 Soluciones Integrales S.A.S.";
const ORG_ID = abs("#organizacion");
const EMAIL = "torre7.colombia@gmail.com";
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const plain = (h) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const org = {
  "@context": "https://schema.org", "@type": ["Organization", "ProfessionalService"], "@id": ORG_ID,
  name: "Torre 7 Soluciones Integrales", legalName: ORG, url: abs(""), logo: abs("assets/img/logo-h.png"), image: abs("assets/img/portada.webp"),
  email: EMAIL, telephone: "+573117723689", slogan: "Convertimos propósitos sociales en organizaciones sostenibles",
  description: "Diseñamos y desarrollamos soluciones integrales para fortalecer organizaciones, con especial atención a las entidades sin ánimo de lucro (ESAL) y las organizaciones sociales: gestión de proyectos, fortalecimiento organizacional, formación, investigación aplicada e innovación.",
  areaServed: { "@type": "Country", name: "Colombia" }, availableLanguage: "es",
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: EMAIL, telephone: "+573117723689", availableLanguage: "es" },
  knowsAbout: ["Fortalecimiento organizacional", "Gestión de proyectos sociales", "Entidades sin ánimo de lucro (ESAL)", "Formulación de proyectos", "Marco lógico", "Planeación estratégica", "Cooperación y movilización de recursos", "Seguimiento y evaluación", "Innovación social", "Investigación aplicada"]
};
const svc = (name, url, description, catalog) => ({
  "@context": "https://schema.org", "@type": "Service", name, url, description, serviceType: name,
  provider: { "@id": ORG_ID }, areaServed: { "@type": "Country", name: "Colombia" },
  audience: { "@type": "Audience", audienceType: "ESAL, organizaciones sociales, empresas, entidades públicas e instituciones" },
  ...(catalog ? { hasOfferCatalog: { "@type": "OfferCatalog", name, itemListElement: catalog.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c } })) } } : {})
});

const PAGES = {
  "index.html": {
    title: "Torre 7 Soluciones Integrales | Fortalecimiento para ESAL",
    description: "Torre 7 fortalece ESAL y organizaciones sociales en Colombia con proyectos, formación, innovación, investigación aplicada y una red de aliados.",
    image: "assets/img/portada.webp", name: "Inicio",
    ld: () => [{ ...org, hasOfferCatalog: { "@type": "OfferCatalog", name: "Servicios de Torre 7", itemListElement: [
      ["Torre 7 Proyecta", "proyecta.html", "Fortalecimiento organizacional y gestión de proyectos."],
      ["Torre 7 Capacita", "capacita.html", "Formación y desarrollo de capacidades."],
      ["Torre 7 Innova", "innova.html", "Innovación y transformación organizacional."],
      ["Torre 7 Investiga", "investiga.html", "Investigación aplicada y generación de conocimiento."],
      ["Torre 7 Conecta", "conecta.html", "Red de aliados: organizaciones, profesionales y servicios especializados."]
    ].map(([n, u, d]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n, url: abs(u), description: d } })) } },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": abs("#sitio"), url: abs(""), name: "Torre 7 Soluciones Integrales", inLanguage: "es-CO", publisher: { "@id": ORG_ID } }]
  },
  "nosotros.html": {
    title: "Quiénes somos | Torre 7 Soluciones Integrales",
    description: "Torre 7 Soluciones Integrales S.A.S.: soluciones integrales para fortalecer organizaciones, con especial atención a las ESAL y las organizaciones sociales.",
    image: "assets/img/pizarra.webp", name: "Quiénes somos",
    ld: () => [{ "@context": "https://schema.org", "@type": "AboutPage", name: "Quiénes somos", url: abs("nosotros.html"), inLanguage: "es-CO", about: { "@id": ORG_ID } }]
  },
  "proyecta.html": {
    title: "Fortalecimiento organizacional y proyectos | Torre 7",
    description: "Fortalecimiento organizacional y gestión de proyectos para organizaciones sociales y ESAL: portafolio de servicios y membresías Basic, Standard y Premium.",
    image: "assets/img/doc-proyecta.webp", name: "Torre 7 Proyecta",
    ld: () => [svc("Torre 7 Proyecta – Fortalecimiento organizacional y gestión de proyectos", abs("proyecta.html"), "Fortalecimiento organizacional y gestión de proyectos para organizaciones sociales y ESAL.",
      ["Diagnóstico y fortalecimiento institucional", "Planeación estratégica y sostenibilidad", "Formulación y gestión de proyectos", "Gestión administrativa, financiera y contable", "Cooperación y movilización de recursos", "Seguimiento, evaluación y gestión de resultados", "Membresía Basic", "Membresía Standard", "Membresía Premium"])]
  },
  "capacita.html": {
    title: "Formación para organizaciones sociales | Torre 7",
    description: "Formación virtual y desarrollo de capacidades para organizaciones sociales, empresas y entidades públicas: cursos, talleres y programas a la medida.",
    image: "assets/img/doc-capacita.webp", name: "Torre 7 Capacita",
    ld: () => [svc("Torre 7 Capacita – Formación y desarrollo de capacidades", abs("capacita.html"), "Cursos, talleres y programas de formación virtual y a la medida.", ["Capacita Abierta", "Capacita Empresarial", "Capacita Digital", "Capacita a la Medida"])]
  },
  "innova.html": {
    title: "Innovación social y organizacional | Torre 7",
    description: "Innovación integral para organizaciones, empresas y territorios: diagnóstico, talleres, diseño de soluciones e implementación de pilotos.",
    image: "assets/img/doc-innova.webp", name: "Torre 7 Innova",
    ld: () => [svc("Torre 7 Innova – Innovación y transformación organizacional", abs("innova.html"), "Diagnóstico, talleres, diseño de soluciones e implementación.", ["Innova Diagnóstico", "Innova Taller", "Innova Soluciones", "Innova Implementa"])]
  },
  "investiga.html": {
    title: "Investigación aplicada para organizaciones | Torre 7",
    description: "Investigación aplicada y generación de conocimiento: estudios, análisis de información, investigación social y territorial y evaluación de resultados.",
    image: "assets/img/doc-investiga.webp", name: "Torre 7 Investiga",
    ld: () => [svc("Torre 7 Investiga – Investigación aplicada y generación de conocimiento", abs("investiga.html"), "Estudios, análisis de información, investigación social y territorial y evaluación de resultados.")]
  },
  "conecta.html": {
    title: "Red de ESAL y aliados en Colombia | Torre 7",
    description: "Red Torre 7: conectamos entidades sin ánimo de lucro, profesionales y organizaciones aliadas. Registra gratis tu organización en el directorio.",
    image: "assets/img/doc-equipo.webp", name: "Torre 7 Conecta",
    ld: () => [svc("Torre 7 Conecta – Red de aliados", abs("conecta.html"), "Red de entidades sin ánimo de lucro, profesionales y organizaciones aliadas, con directorio y servicios especializados.", ["Entidades sin ánimo de lucro", "Profesionales aliados", "Organizaciones aliadas"])]
  }
};

for (const [file, cfg] of Object.entries(PAGES)) {
  const f = path.join(root, file);
  let h = fs.readFileSync(f, "utf8");
  const url = abs(file === "index.html" ? "" : file);

  const faqs = [...h.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map((m) => [plain(m[1]), plain(m[2])]);
  const ld = [...cfg.ld()];
  if (file !== "index.html") ld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Inicio", abs("")], [cfg.name, url]].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) });
  if (faqs.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

  const block = `<!--seo:start-->
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es-CO" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <link rel="alternate" type="application/rss+xml" title="Blog Torre 7" href="feed.xml">
  <meta name="theme-color" content="#004d2e">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Torre 7 Soluciones Integrales">
  <meta property="og:title" content="${esc(cfg.title)}">
  <meta property="og:description" content="${esc(cfg.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${abs(cfg.image)}">
  <meta property="og:image:alt" content="${esc(cfg.name)} – Torre 7 Soluciones Integrales">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(cfg.title)}">
  <meta name="twitter:description" content="${esc(cfg.description)}">
  <meta name="twitter:image" content="${abs(cfg.image)}">
  <link rel="preload" href="assets/fonts/BebasNeue.otf" as="font" type="font/otf" crossorigin>
  <link rel="preload" href="assets/fonts/DINPro-Regular.ttf" as="font" type="font/ttf" crossorigin>
${ld.map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<!--seo:end-->`;

  h = h.replace(/\s*<!--seo:start-->[\s\S]*?<!--seo:end-->/, "")
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(cfg.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(cfg.description)}">`)
    .replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${INDEXABLE ? "index, follow, max-snippet:-1, max-image-preview:large" : "noindex, nofollow"}">`)
    .replace(/<html lang="[^"]*"/, '<html lang="es-CO"')
    .replace("</head>", `  ${block}\n</head>`);
  fs.writeFileSync(f, h);
  console.log(`${file}: ${cfg.title.length} car. título · ${cfg.description.length} car. descripción · ${ld.length} bloques JSON-LD${faqs.length ? ` (${faqs.length} preguntas)` : ""}`);
}
console.log(INDEXABLE ? "→ páginas indexables" : "→ páginas con noindex");
