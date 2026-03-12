// ══════════════════════════════════════════════
// server.js — Zanmadin AI Proxy (Groq + eSewa)
// Run: node server.js
// Listens on: http://localhost:3001
// ══════════════════════════════════════════════

import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import crypto   from "crypto"; // built-in Node.js — no install needed

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ───────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://zanmadin.vercel.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "2mb" }));

// ── Health check ───────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "Zanmadin Proxy (Groq + eSewa)" });
});

// ══════════════════════════════════════════════
// 1. GROQ AI CHAT
// POST /api/chat
// ══════════════════════════════════════════════
app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[Chat] ❌ GROQ_API_KEY missing");
    return res.status(500).json({ error: "GROQ_API_KEY not set in .env" });
  }

  const { system, messages, max_tokens } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required." });
  }

  const groqMessages = [
    ...(system ? [{ role: "system", content: system }] : []),
    ...messages,
  ];

  try {
    console.log(`[Chat] → Groq | messages=${groqMessages.length}`);

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      "llama-3.3-70b-versatile",
        max_tokens: max_tokens || 1000,
        messages:   groqMessages,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error(`[Chat] ❌ Groq HTTP ${upstream.status}:`, JSON.stringify(data));
      return res.status(upstream.status).json({ error: data?.error?.message || "Groq API error" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    console.log("[Chat] ✅ Groq OK");
    res.json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("[Chat] ❌ Network error:", err.message);
    res.status(502).json({ error: "Failed to reach Groq.", detail: err.message });
  }
});

// ══════════════════════════════════════════════
// 2. ESEWA PAYMENT — SIGNED ORDER
// POST /api/payment/initiate
// Body: { amount, productName, transactionUuid }
// Returns: { formAction, fields } — all signed fields
// ══════════════════════════════════════════════
app.post("/api/payment/initiate", (req, res) => {
  const secretKey  = process.env.ESEWA_SECRET_KEY;
  const merchantId = process.env.ESEWA_MERCHANT_ID;

  if (!secretKey || !merchantId) {
    console.error("[eSewa] ❌ ESEWA_SECRET_KEY or ESEWA_MERCHANT_ID missing in .env");
    return res.status(500).json({ error: "eSewa credentials not configured in .env" });
  }

  const { amount, productName, transactionUuid } = req.body;

  if (!amount || !transactionUuid) {
    return res.status(400).json({ error: "amount and transactionUuid are required." });
  }

  const totalAmount  = Number(amount);
  const taxAmount    = 0;
  const serviceCharge = 0;
  const deliveryCharge = 0;
  const grandTotal   = totalAmount + taxAmount + serviceCharge + deliveryCharge;

  // ── HMAC-SHA256 signature (server-side only) ──
  // eSewa signs: total_amount,transaction_uuid,product_code
  const signatureString = `total_amount=${grandTotal},transaction_uuid=${transactionUuid},product_code=${merchantId}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("base64");

  console.log(`[eSewa] ✅ Signed order | txn=${transactionUuid} | NPR ${grandTotal}`);

  const isProduction = process.env.NODE_ENV === "production";

  res.json({
    formAction: isProduction
      ? "https://epay.esewa.com.np/api/epay/main/v2/form"
      : "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    fields: {
      amount:                   totalAmount,
      tax_amount:               taxAmount,
      total_amount:             grandTotal,
      transaction_uuid:         transactionUuid,
      product_code:             merchantId,
      product_service_charge:   serviceCharge,
      product_delivery_charge:  deliveryCharge,
      success_url:              process.env.ESEWA_SUCCESS_URL || `${req.headers.origin}/payment/success`,
      failure_url:              process.env.ESEWA_FAILURE_URL || `${req.headers.origin}/payment/failure`,
      signed_field_names:       "total_amount,transaction_uuid,product_code",
      signature,                // ✅ generated server-side with HMAC-SHA256
    },
  });
});

// ══════════════════════════════════════════════
// 3. AI SURPRISE RECOMMENDATION
// POST /api/recommend
// Body: { occasion, recipientName, relationship, budget, theme, specialRequests }
// Returns: { recommendation } — a rich curated surprise package suggestion
// ══════════════════════════════════════════════
app.post("/api/recommend", async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY not set" });

  const { occasion, recipientName, relationship, budget, theme, specialRequests } = req.body;

  const prompt = `You are a creative surprise experience designer for Zanmadin, Addis Ababa's premier celebration company.

Based on the following customer details, suggest ONE specific, vivid surprise package. Be concrete and exciting — describe exactly what will happen, what decorations will look like, what food/drinks will be included, any special touches. Keep it to 3–5 sentences maximum.

Details:
- Occasion: ${occasion || "Special celebration"}
- For: ${recipientName || "someone special"} (${relationship || "loved one"})
- Budget: ${budget || "standard"}
- Theme/Vibe: ${theme || "elegant and heartfelt"}
- Special requests: ${specialRequests || "none"}

Respond ONLY with the recommendation text. No headers, no lists, no intro phrases like "Here is...". Just the vivid description directly.`;

  try {
    console.log(`[Recommend] → Groq | occasion=${occasion}`);

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      "llama-3.3-70b-versatile",
        max_tokens: 300,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || "Groq error" });
    }

    const recommendation = data.choices?.[0]?.message?.content?.trim() || "";
    console.log("[Recommend] ✅ Generated");
    res.json({ recommendation });

  } catch (err) {
    console.error("[Recommend] ❌", err.message);
    res.status(502).json({ error: "Failed to generate recommendation." });
  }
});

// ══════════════════════════════════════════════
// 4. WHATSAPP HANDOFF RECORD (optional logging)
// POST /api/handoff
// Logs the handoff server-side for your records
// ══════════════════════════════════════════════
app.post("/api/handoff", (req, res) => {
  const { occasion, recipientName, relationship, date, budget, theme, specialRequests } = req.body;
  console.log(`[Handoff] 📲 New request — ${occasion} for ${recipientName} | ${budget} | ${date}`);
  // You could save to a DB here in production
  res.json({ status: "logged" });
});

// ── Start ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   ✅  Zanmadin Proxy  — RUNNING              ║
║   http://localhost:${PORT}                     ║
╠══════════════════════════════════════════════╣
║  POST /api/chat              → Groq AI       ║
║  POST /api/recommend         → AI Package    ║
║  POST /api/payment/initiate  → eSewa Sign    ║
║  POST /api/handoff           → Log order     ║
║  GET  /health                → Health        ║
╚══════════════════════════════════════════════╝
  `);
});