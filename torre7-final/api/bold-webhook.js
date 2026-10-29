/* ==========================================================
   Notificaciones de Bold (webhook) — Vercel: /api/bold-webhook
   ----------------------------------------------------------
   Bold avisa aquí cada pago aprobado, rechazado o anulado.
   Antes de creerle, se verifica la firma: HMAC-SHA256 del cuerpo
   (en base64) con la llave secreta, comparada con el encabezado
   «x-bold-signature». Si la firma no coincide, se rechaza.
   Configurar en Bold → Integraciones → Webhooks la dirección:
     https://<tu-proyecto>.vercel.app/api/bold-webhook
   Los pagos verificados quedan en los registros de Vercel
   (Deployments → Functions → Logs) con su referencia T7-...
   ========================================================== */
const crypto = require("node:crypto");

async function cuerpoCrudo(req) {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  let raw = "";
  for await (const parte of req) { raw += parte; if (raw.length > 100000) break; }
  return raw;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
  const secreta = process.env.BOLD_SECRET_KEY || "";
  const raw = await cuerpoCrudo(req);
  const recibida = String(req.headers["x-bold-signature"] || "");
  const esperada = crypto.createHmac("sha256", secreta).update(Buffer.from(raw, "utf8").toString("base64")).digest("hex");
  const valida = recibida.length === esperada.length && crypto.timingSafeEqual(Buffer.from(recibida), Buffer.from(esperada));
  if (!secreta || !valida) {
    console.warn("Webhook con firma inválida: se ignora.");
    res.statusCode = 401; return res.end();
  }
  let ev = {}; try { ev = JSON.parse(raw); } catch {}
  const d = ev.data || {};
  console.log(JSON.stringify({
    evento: "bold_" + String(ev.type || "desconocido").toLowerCase(),
    referencia: d.metadata?.reference || d.reference || d.order_id || null,
    pago: d.payment_id || ev.subject || null,
    monto: d.amount?.total ?? d.amount ?? null,
    medio: d.payment_method || null,
    fecha: ev.time || new Date().toISOString()
  }));
  res.statusCode = 200; res.setHeader("Content-Type", "application/json"); res.end('{"ok":true}');
};
