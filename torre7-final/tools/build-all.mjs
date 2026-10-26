/* ==========================================================
   Genera todo el SEO/GEO del sitio con un solo comando.

   Versión de propuesta (sin indexar, como está ahora):
     node tools/build-all.mjs

   Al publicar con el dominio real (activa la indexación):
     node tools/build-all.mjs --indexable --base=https://dominio-real/

   Ejecuta, en orden: tools/seo-paginas.mjs (inicio y servicios) y
   tools/build-blog.mjs (artículos, blog, sitemap, robots, llms.txt, feed.xml).
   ========================================================== */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
for (const s of ["seo-paginas.mjs", "build-blog.mjs"]) {
  const r = spawnSync(process.execPath, [path.join(dir, s), ...args], { stdio: "inherit" });
  if (r.status) process.exit(r.status);
}
