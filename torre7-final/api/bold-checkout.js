/* ==========================================================
   Pasarela de pago Bold — función de servidor (Vercel: /api/bold-checkout)
   ----------------------------------------------------------
   Seguridad:
   - El precio de cada plan vive solo aquí (variables de entorno):
     el navegador nunca define el monto.
   - Firma de integridad SHA-256 (orden + monto + divisa + llave secreta)
     calculada en el servidor: la llave secreta jamás llega al navegador.
   - Validación de todos los datos del comprador en el servidor.
   - Campo trampa contra bots, control de origen (CORS) y límite de
     intentos por IP.
   - Referencias únicas por compra; consulta del estado real del pago.
   - Los datos de tarjeta los recibe Bold, nunca este sitio.

   Variables de entorno (Vercel → Settings → Environment Variables):
     BOLD_API_KEY      llave de identidad de Bold (pública)
     BOLD_SECRET_KEY   llave secreta de Bold (privada: solo aquí)
     PRECIO_BASIC / PRECIO_STANDARD / PRECIO_PREMIUM   pesos, solo números
     SITIO_URL         p. ej. https://torre7.com.co  (regreso a gracias.html)
     ORIGENES          dominios autorizados, separados por coma
     BOLD_METODOS      (opcional) para el pago por link. Defecto: CREDIT_CARD,PSE

   Rutas:
     GET  /api/bold-checkout              → { configurada, planes }
     GET  /api/bold-checkout?ref=T7-...   → { estado }
     POST /api/bold-checkout {accion:"pagar", plan, comprador}   → datos firmados para el checkout de Bold
     POST /api/bold-checkout {accion:"link",  plan, comprador}   → { url } (respaldo: checkout de Bold en su página)
   ========================================================== */
const crypto = require("node:crypto");

const PLANES = {
  basic:    { nombre: "Basic",    env: "PRECIO_BASIC" },
  standard: { nombre: "Standard", env: "PRECIO_STANDARD" },
  premium:  { nombre: "Premium",  env: "PRECIO_PREMIUM" }
};
const DOCUMENTOS = ["CC", "CE", "NIT", "PP"];
const API_LINKS = "https://integrations.api.bold.co/online/link/v1";
const API_PAGOS = "https://payments.api.bold.co";

const precio = (k) => {
  const n = parseInt(String(process.env[PLANES[k].env] || "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n >= 1000 ? n : null;
};
const listaPrecios = () => Object.fromEntries(Object.entries(PLANES).map(([k, p]) => [k, { nombre: p.nombre, precio: precio(k) }]));
const nuevaReferencia = (plan) => `T7-${plan.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const limpiar = (t, max) => String(t ?? "").normalize("NFC").replace(/[<>"`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

/* ---------- límite de intentos por IP (por instancia) ---------- */
const intentos = new Map();
function demasiados(ip) {
  const ahora = Date.now(), ventana = 10 * 60 * 1000, max = 12;
  const lista = (intentos.get(ip) || []).filter((t) => ahora - t < ventana);
  lista.push(ahora); intentos.set(ip, lista);
  if (intentos.size > 5000) intentos.clear();
  return lista.length > max;
}

/* ---------- CORS ---------- */
function cors(req, res) {
  const permitidos = String(process.env.ORIGENES || "*").split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
  const origen = req.headers.origin || "";
  const todos = permitidos.includes("*");
  const ok = todos || !origen || permitidos.includes(origen);
  res.setHeader("Access-Control-Allow-Origin", todos ? "*" : (ok && origen ? origen : permitidos[0]));
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return ok;
}

function estadoBold(s) {
  switch (s) {
    case "APPROVED": case "SALE_APPROVED": return "approved";
    case "REJECTED": case "FAILED": case "SALE_REJECTED": return "declined";
    case "VOIDED": case "VOID_APPROVED": return "voided";
    case "PROCESSING": case "PENDING": return "pending";
    default: return null;
  }
}

async function leerCuerpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  let raw = "";
  for await (const parte of req) { raw += parte; if (raw.length > 20000) break; }
  try { return JSON.parse(raw || "{}"); } catch { return {}; }
}

/* ---------- validación del comprador (en el servidor, siempre) ---------- */
function validar(c = {}) {
  const d = {
    nombre: limpiar(c.nombre, 80),
    tipoDoc: limpiar(c.tipoDoc, 4).toUpperCase(),
    documento: limpiar(c.documento, 20).replace(/[^0-9A-Za-z-]/g, ""),
    organizacion: limpiar(c.organizacion, 90),
    correo: limpiar(c.correo, 120).toLowerCase(),
    celular: limpiar(c.celular, 20).replace(/[^\d+]/g, ""),
    departamento: limpiar(c.departamento, 40),
    ciudad: limpiar(c.ciudad, 50),
    direccion: limpiar(c.direccion, 120)
  };
  const err = [];
  if (d.nombre.length < 3) err.push("nombre");
  if (!DOCUMENTOS.includes(d.tipoDoc)) err.push("tipo de documento");
  if (d.documento.length < 5) err.push("número de documento");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) err.push("correo");
  if (d.celular.replace(/\D/g, "").length < 10) err.push("celular");
  if (!d.departamento) err.push("departamento");
  if (!d.ciudad) err.push("ciudad");
  if (d.direccion.length < 5) err.push("dirección");
  if (d.tipoDoc === "NIT" && !d.organizacion) err.push("razón social de la organización");
  if (c.terminos !== true || c.datos !== true) err.push("aceptación de términos y tratamiento de datos");
  return { d, err };
}

function urlRegreso(volver) {
  if (process.env.SITIO_URL) return process.env.SITIO_URL.replace(/\/+$/, "") + "/gracias.html";
  try { const v = new URL(volver); if (v.protocol === "https:" || v.hostname === "localhost") return v.origin + v.pathname; } catch {}
  return "";
}

module.exports = async function handler(req, res) {
  const permitido = cors(req, res);
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  const responder = (codigo, datos) => { res.statusCode = codigo; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(datos)); };
  if (!permitido) return responder(403, { error: "Origen no autorizado." });

  const llave = process.env.BOLD_API_KEY || "", secreta = process.env.BOLD_SECRET_KEY || "";
  const url = new URL(req.url, "http://localhost");
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();

  try {
    if (req.method === "GET") {
      const ref = url.searchParams.get("ref");
      if (!ref) return responder(200, { configurada: !!(llave && secreta), planes: listaPrecios() });
      if (!llave) return responder(503, { error: "Pasarela sin configurar." });
      if (!/^T7-[A-Z0-9-]{6,40}$/.test(ref)) return responder(400, { error: "Referencia inválida." });
      const r = await fetch(`${API_PAGOS}/v2/payment-voucher/${encodeURIComponent(ref)}`, { headers: { Authorization: `x-api-key ${llave}` } });
      if (!r.ok) return responder(200, { estado: null });
      const v = await r.json();
      return responder(200, { estado: estadoBold(v.payment_status), referencia: ref });
    }

    if (req.method !== "POST") return responder(405, { error: "Método no permitido." });
    if (demasiados(ip)) return responder(429, { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." });
    if (!llave || !secreta) return responder(503, { error: "La pasarela de pago aún no está configurada." });

    const b = await leerCuerpo(req);
    if (b.website) return responder(400, { error: "Solicitud no válida." });          // campo trampa: solo lo llenan los bots
    const plan = String(b.plan || "").toLowerCase();
    if (!PLANES[plan]) return responder(400, { error: "Plan no válido." });
    const monto = precio(plan);
    if (!monto) return responder(503, { error: `El precio de la membresía ${PLANES[plan].nombre} aún no está configurado.` });
    const { d, err } = validar(b.comprador);
    if (err.length) return responder(400, { error: `Revisa: ${err.join(", ")}.` });
    const regreso = urlRegreso(b.volver);
    if (!regreso) return responder(500, { error: "Falta configurar SITIO_URL." });

    const ref = nuevaReferencia(plan);
    const descripcion = limpiar(`Membresía ${PLANES[plan].nombre} Torre 7 Proyecta`, 100);
    const accion = b.accion === "link" ? "link" : "pagar";
    console.log(JSON.stringify({ evento: "pago_iniciado", accion, ref, plan, monto, correo: d.correo, documento: `${d.tipoDoc} ${d.documento}`, organizacion: d.organizacion }));

    if (accion === "pagar") {
      // datos firmados para el checkout oficial de Bold dentro de la página
      const firma = crypto.createHash("sha256").update(`${ref}${monto}COP${secreta}`).digest("hex");
      return responder(200, {
        apiKey: llave, orderId: ref, amount: String(monto), currency: "COP", integritySignature: firma,
        description: descripcion, redirectionUrl: `${regreso}?ref=${encodeURIComponent(ref)}`,
        customerData: { email: d.correo, fullName: d.nombre, phone: d.celular.replace(/^\+?57/, ""), dialCode: "+57", documentNumber: d.documento, documentType: d.tipoDoc },
        billingAddress: { address: d.direccion, city: d.ciudad, state: d.departamento, country: "CO" }
      });
    }

    // respaldo: link de pago de Bold (checkout en la página de Bold)
    const r = await fetch(API_LINKS, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `x-api-key ${llave}` },
      body: JSON.stringify({
        amount_type: "CLOSE",
        amount: { currency: "COP", total_amount: monto, tip_amount: 0 },   // pesos enteros, no centavos
        reference: ref,
        description: limpiar(`${descripcion} – ${d.organizacion || d.nombre}`, 100),
        callback_url: `${regreso}?ref=${encodeURIComponent(ref)}`,
        payer_email: d.correo,
        payment_methods: String(process.env.BOLD_METODOS || "CREDIT_CARD,PSE").split(",").map((s) => s.trim()).filter(Boolean)
      })
    });
    const texto = await r.text();
    let j = null; try { j = JSON.parse(texto); } catch {}
    if (!r.ok || !j?.payload?.url) {
      console.error("Bold link:", r.status, texto.slice(0, 300));
      return responder(502, { error: "No pudimos conectar con Bold. Intenta de nuevo en unos minutos." });
    }
    return responder(200, { url: j.payload.url, referencia: ref });
  } catch (e) {
    console.error(e);
    return responder(500, { error: "Ocurrió un error inesperado. Intenta de nuevo." });
  }
};
