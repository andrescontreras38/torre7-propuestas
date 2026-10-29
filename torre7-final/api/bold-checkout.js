/* ==========================================================
   Función de servidor para cobrar las membresías con Bold
   (Vercel: se publica sola en /api/bold-checkout)
   ----------------------------------------------------------
   Crea el pago en Bold en el momento de la compra (API «Link de
   pagos») y devuelve la dirección del checkout seguro de Bold.
   Los precios viven aquí, en el servidor: nadie puede cambiarlos
   desde el navegador.

   Variables de entorno (Vercel → Settings → Environment Variables):
     BOLD_API_KEY       llave de identidad de Bold (panel Bold → Integraciones → Llaves)
     PRECIO_BASIC       precio en pesos, solo números. Ej.: 150000
     PRECIO_STANDARD    "
     PRECIO_PREMIUM     "
     SITIO_URL          dirección del sitio, ej. https://torre7.com.co (para volver a gracias.html)
     ORIGENES           (opcional) dominios que pueden usar la función, separados por coma
     BOLD_METODOS       (opcional) medios de pago. Por defecto: CREDIT_CARD,PSE

   Rutas:
     GET  /api/bold-checkout            → precios configurados
     GET  /api/bold-checkout?ref=XXXX   → estado de un pago (approved | pending | declined | voided)
     POST /api/bold-checkout            → { plan, nombre, correo, organizacion, volver } → { url, referencia }
   ========================================================== */
const PLANES = {
  basic:    { nombre: "Basic",    env: "PRECIO_BASIC" },
  standard: { nombre: "Standard", env: "PRECIO_STANDARD" },
  premium:  { nombre: "Premium",  env: "PRECIO_PREMIUM" }
};
const API_LINKS = "https://integrations.api.bold.co/online/link/v1";
const API_PAGOS = "https://payments.api.bold.co";

const precio = (clave) => {
  const n = parseInt(String(process.env[PLANES[clave].env] || "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const listaPrecios = () => Object.fromEntries(Object.entries(PLANES).map(([k, p]) => [k, { nombre: p.nombre, precio: precio(k) }]));
const referencia = (plan) => `T7-${plan.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const limpiar = (t, max) => String(t || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

function cors(req, res) {
  const permitidos = String(process.env.ORIGENES || "*").split(",").map((s) => s.trim()).filter(Boolean);
  const origen = req.headers.origin || "";
  const ok = permitidos.includes("*") || permitidos.includes(origen);
  res.setHeader("Access-Control-Allow-Origin", permitidos.includes("*") ? "*" : (ok ? origen : permitidos[0] || ""));
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  for await (const parte of req) raw += parte;
  try { return JSON.parse(raw || "{}"); } catch { return {}; }
}

module.exports = async function handler(req, res) {
  const permitido = cors(req, res);
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  const responder = (codigo, datos) => { res.statusCode = codigo; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(datos)); };
  if (!permitido) return responder(403, { error: "Origen no permitido." });

  const llave = process.env.BOLD_API_KEY || "";
  const url = new URL(req.url, "http://localhost");

  try {
    if (req.method === "GET") {
      const ref = url.searchParams.get("ref");
      if (!ref) return responder(200, { configurada: !!llave, planes: listaPrecios() });
      if (!llave) return responder(503, { error: "Pasarela sin configurar." });
      if (!/^T7-[A-Z0-9-]{6,40}$/.test(ref)) return responder(400, { error: "Referencia inválida." });
      const r = await fetch(`${API_PAGOS}/v2/payment-voucher/${encodeURIComponent(ref)}`, { headers: { Authorization: `x-api-key ${llave}` } });
      if (!r.ok) return responder(200, { estado: null });
      const v = await r.json();
      return responder(200, { estado: estadoBold(v.payment_status), referencia: ref });
    }

    if (req.method === "POST") {
      if (!llave) return responder(503, { error: "La pasarela de pago aún no está configurada." });
      const b = await leerCuerpo(req);
      const plan = String(b.plan || "").toLowerCase();
      if (!PLANES[plan]) return responder(400, { error: "Plan no válido." });
      const monto = precio(plan);
      if (!monto) return responder(503, { error: `El precio de la membresía ${PLANES[plan].nombre} aún no está configurado.` });
      const nombre = limpiar(b.nombre, 80), correo = limpiar(b.correo, 120), org = limpiar(b.organizacion, 80);
      if (!nombre || !/^\S+@\S+\.\S+$/.test(correo)) return responder(400, { error: "Escribe tu nombre y un correo válido." });

      // a dónde vuelve la persona después de pagar
      let base = process.env.SITIO_URL ? process.env.SITIO_URL.replace(/\/+$/, "") + "/gracias.html" : "";
      if (!base && b.volver) { try { const v = new URL(b.volver); if (/^https?:$/.test(v.protocol)) base = v.origin + v.pathname; } catch {} }
      if (!base) return responder(500, { error: "Falta configurar SITIO_URL." });

      const ref = referencia(plan);
      const r = await fetch(API_LINKS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `x-api-key ${llave}` },
        body: JSON.stringify({
          amount_type: "CLOSE",
          amount: { currency: "COP", total_amount: monto, tip_amount: 0 },   // Bold usa pesos enteros, no centavos
          reference: ref,
          description: limpiar(`Membresía ${PLANES[plan].nombre} Torre 7 Proyecta – ${org || nombre}`, 100),
          callback_url: `${base}?ref=${encodeURIComponent(ref)}`,
          payment_methods: String(process.env.BOLD_METODOS || "CREDIT_CARD,PSE").split(",").map((s) => s.trim()).filter(Boolean)
        })
      });
      const texto = await r.text();
      let j = null; try { j = JSON.parse(texto); } catch {}
      if (!r.ok || !j?.payload?.url) {
        const msg = j?.errors?.[0]?.errors || j?.errors?.[0]?.message || j?.message || `Bold respondió ${r.status}`;
        console.error("Bold:", msg, texto.slice(0, 300));
        return responder(502, { error: "No pudimos conectar con Bold. Intenta de nuevo en unos minutos." });
      }
      console.log("Pago creado", ref, plan, monto, correo);
      return responder(200, { url: j.payload.url, referencia: ref });
    }

    return responder(405, { error: "Método no permitido." });
  } catch (e) {
    console.error(e);
    return responder(500, { error: "Ocurrió un error inesperado. Intenta de nuevo." });
  }
};
