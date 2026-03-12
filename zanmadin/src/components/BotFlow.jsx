// // ══════════════════════════════════════════════
// // BotFlow.jsx — Zanmadin AI Chat Widget
// // Flow:
// //   1. Bot chats & collects info
// //   2. Silently fires WhatsApp message to Zanmadin team
// //   3. Shows user a Confirmation Screen (package summary)
// //   4. User clicks "Confirm & Pay" → eSewa payment
// // ══════════════════════════════════════════════
// import { useState, useEffect, useRef, useCallback } from "react";
// import { gsap } from "gsap";
// import logo from "../assets/logo.png";

// // ── Config ──────────────────────────────────────
// const WHATSAPP_PHONE = "9779862699667"; // digits only, no dashes

// const PROXY_URL =
//   import.meta.env?.VITE_PROXY_URL ||
//   process.env?.REACT_APP_PROXY_URL ||
//   "http://localhost:3001/api/chat";

// // ── eSewa Config ────────────────────────────────
// // Replace with your real eSewa merchant credentials
// const ESEWA_CONFIG = {
//   merchantId: "EPAYTEST",           // your eSewa merchant code
//   successUrl: `${window.location.origin}/payment/success`,
//   failureUrl:  `${window.location.origin}/payment/failure`,
//   formAction:  "https://rc-epay.esewa.com.np/api/epay/main/v2/form", // test env
//   // Production: "https://epay.esewa.com.np/api/epay/main/v2/form"
// };

// // ── Package pricing map ─────────────────────────
// const PACKAGE_PRICES = {
//   "casual":  { label: "Casual",  price: 3999,  usd: "under $100" },
//   "standard":{ label: "Standard",price: 9999,  usd: "$100–300"   },
//   "premium": { label: "Premium", price: 24999, usd: "$300–700"   },
//   "luxury":  { label: "Luxury",  price: 59999, usd: "$700+"      },
// };

// function detectPackage(budget = "") {
//   const b = budget.toLowerCase();
//   if (b.includes("casual")  || b.includes("100"))  return PACKAGE_PRICES.casual;
//   if (b.includes("premium") || b.includes("300"))  return PACKAGE_PRICES.premium;
//   if (b.includes("luxury")  || b.includes("700"))  return PACKAGE_PRICES.luxury;
//   return PACKAGE_PRICES.standard; // default
// }

// // ── System prompt ───────────────────────────────
// const SYSTEM_PROMPT = `You are Zana, Zanmadin's warm and enthusiastic celebration assistant. Zanmadin is Addis Ababa's premier surprise experience company.

// Your personality: warm, excited, creative. Use tasteful emojis. Speak like a close friend who is an expert party planner.

// Collect through natural conversation:
// 1. Occasion type (birthday, anniversary, proposal, etc.)
// 2. Recipient's name and their relationship to the user
// 3. Date/timeline
// 4. Budget: casual (under $100) / standard ($100–300) / premium ($300–700) / luxury ($700+)
// 5. Theme or special requests

// Keep responses SHORT — 2-4 sentences. Ask ONE question at a time.

// Once you have: occasion + recipient name + budget, end with a warm closing message then output the token [READY] with JSON.

// CRITICAL RULES:
// - NEVER mention WhatsApp, sending messages, or contacting anyone
// - NEVER say "our team will reach out" or "I'll pass this along"  
// - Just give a warm excited closing like you're sealing the deal
// - The JSON must be on a new line after [READY]

// Example closing (natural, no hints):
// "Perfect! A dreamy candlelit setup for Sara on the 20th — this is going to be absolutely magical ✨ We've got everything we need to make this unforgettable! 💚"
// [READY]
// {"occasion":"Romantic Evening","recipientName":"Sara","relationship":"girlfriend","date":"March 20th","budget":"premium","theme":"candlelit roses","specialRequests":"Ethiopian coffee ceremony"}`;

// const INITIAL_CHIPS = [
//   "🎂 Birthday surprise",
//   "🌹 Romantic evening",
//   "🌍 Gift from abroad",
//   "💍 Proposal setup",
//   "🎉 Office celebration",
//   "✨ Custom experience",
// ];

// // ── Silent WhatsApp send ────────────────────────
// // Opens in a hidden iframe-like window, user never sees it
// function silentSendToWhatsApp(data) {
//   const lines = [
//     "🔔 *New Booking Request — Zanmadin Bot*",
//     "",
//     data.occasion        ? `🎊 *Occasion:* ${data.occasion}`           : null,
//     data.recipientName   ? `👤 *For:* ${data.recipientName}`           : null,
//     data.relationship    ? `💞 *Relationship:* ${data.relationship}`   : null,
//     data.date            ? `📅 *Date:* ${data.date}`                   : null,
//     data.budget          ? `💰 *Budget:* ${data.budget}`               : null,
//     data.theme           ? `🎨 *Theme:* ${data.theme}`                 : null,
//     data.specialRequests ? `✨ *Requests:* ${data.specialRequests}`    : null,
//     "",
//     `⏰ Received: ${new Date().toLocaleString()}`,
//   ].filter(Boolean);

//   const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;

//   // Open in a tiny background popup — user won't notice
//   const popup = window.open(url, "_blank", "width=1,height=1,left=-1000,top=-1000,noopener");
//   // Close immediately after opening (the WA deep link still fires)
//   if (popup) setTimeout(() => popup.close(), 2000);
// }

// // ── eSewa payment submit ────────────────────────
// function submitEsewaPayment(orderData) {
//   const pkg = detectPackage(orderData.budget);
//   const txnId = `ZAN-${Date.now()}`;

//   // Create and submit a hidden form to eSewa
//   const form = document.createElement("form");
//   form.method = "POST";
//   form.action = ESEWA_CONFIG.formAction;

//   const fields = {
//     amount:               pkg.price,
//     tax_amount:           0,
//     total_amount:         pkg.price,
//     transaction_uuid:     txnId,
//     product_code:         ESEWA_CONFIG.merchantId,
//     product_service_charge: 0,
//     product_delivery_charge: 0,
//     success_url:          ESEWA_CONFIG.successUrl,
//     failure_url:          ESEWA_CONFIG.failureUrl,
//     signed_field_names:   "total_amount,transaction_uuid,product_code",
//     // signature: generate server-side in production with HMAC-SHA256
//   };

//   Object.entries(fields).forEach(([key, val]) => {
//     const input = document.createElement("input");
//     input.type  = "hidden";
//     input.name  = key;
//     input.value = val;
//     form.appendChild(input);
//   });

//   document.body.appendChild(form);
//   form.submit();
//   document.body.removeChild(form);
// }

// // ── Parse / strip handoff ───────────────────────
// function parseHandoff(text) {
//   if (!text.includes("[READY]")) return null;
//   try {
//     const m = text.match(/\[READY\]\s*(\{[\s\S]*?\})/);
//     return m ? JSON.parse(m[1]) : null;
//   } catch { return null; }
// }
// function stripHandoff(text) {
//   return text.replace(/\[READY\][\s\S]*$/, "").trim();
// }

// const ts = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // ── Inject CSS keyframes once ───────────────────
// function injectKF() {
//   if (document.getElementById("zan-kf")) return;
//   const s = document.createElement("style");
//   s.id = "zan-kf";
//   s.textContent = `
//     @keyframes zanPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.18);opacity:0}}
//     @keyframes zanBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
//     @keyframes zanFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
//     @keyframes zanCheck{from{stroke-dashoffset:50}to{stroke-dashoffset:0}}
//     @keyframes zanSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
//     @keyframes zanPop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
//   `;
//   document.head.appendChild(s);
// }

// // ══════════════════════════════════════════════
// // CONFIRMATION SCREEN
// // ══════════════════════════════════════════════
// function ConfirmationScreen({ data, onConfirm, onBack }) {
//   const pkg = detectPackage(data.budget);
//   const [confirming, setConfirming] = useState(false);

//   const fields = [
//     { icon: "🎊", label: "Occasion",      value: data.occasion },
//     { icon: "👤", label: "Person's Name", value: data.recipientName },
//     { icon: "💞", label: "Relationship",  value: data.relationship },
//     { icon: "📅", label: "Date",          value: data.date },
//     { icon: "🎨", label: "Theme",         value: data.theme },
//     { icon: "✨", label: "Special Requests", value: data.specialRequests },
//   ].filter(f => f.value);

//   const handleConfirm = () => {
//     setConfirming(true);
//     setTimeout(() => onConfirm(data, pkg), 800);
//   };

//   return (
//     <div style={{
//       flex: 1, overflowY: "auto", display: "flex",
//       flexDirection: "column", animation: "zanFadeUp .4s ease",
//     }}>
//       {/* Top */}
//       <div style={{
//         padding: "20px 18px 14px",
//         background: "linear-gradient(135deg,#1a3a2a,#122b1e)",
//         borderBottom: "1px solid rgba(45,106,79,.3)",
//         textAlign: "center",
//       }}>
//         {/* Animated checkmark */}
//         <div style={{ marginBottom: 10 }}>
//           <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation: "zanPop .5s ease" }}>
//             <circle cx="26" cy="26" r="24" fill="none" stroke="#52b788" strokeWidth="2.5" opacity=".3"/>
//             <circle cx="26" cy="26" r="24" fill="none" stroke="#52b788" strokeWidth="2.5"
//               strokeDasharray="150" strokeDashoffset="0" style={{ animation: "zanCheck .6s ease .2s both" }}/>
//             <polyline points="16,27 23,34 36,20" fill="none" stroke="#52b788" strokeWidth="3"
//               strokeLinecap="round" strokeLinejoin="round"
//               strokeDasharray="50" style={{ animation: "zanCheck .5s ease .5s both" }}/>
//           </svg>
//         </div>
//         <div style={{ fontSize: 16, fontWeight: 700, color: "#b7e4c7", marginBottom: 4 }}>
//           Almost there! 🎉
//         </div>
//         <div style={{ fontSize: 12, color: "rgba(149,213,178,.6)" }}>
//           Review your celebration details before paying
//         </div>
//       </div>

//       {/* Order summary */}
//       <div style={{ padding: "14px 16px", flex: 1, overflowY: "auto" }}>

//         {/* Fields */}
//         <div style={{
//           background: "rgba(45,106,79,.1)",
//           border: "1px solid rgba(45,106,79,.25)",
//           borderRadius: 12, overflow: "hidden", marginBottom: 12,
//         }}>
//           {fields.map((f, i) => (
//             <div key={f.label} style={{
//               display: "flex", alignItems: "flex-start", gap: 10,
//               padding: "10px 14px",
//               borderBottom: i < fields.length - 1 ? "1px solid rgba(45,106,79,.15)" : "none",
//             }}>
//               <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
//               <div>
//                 <div style={{ fontSize: 10, color: "rgba(149,213,178,.55)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
//                   {f.label}
//                 </div>
//                 <div style={{ fontSize: 13, color: "#d4edda", fontWeight: 500 }}>{f.value}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Package + Price box */}
//         <div style={{
//           background: "linear-gradient(135deg,rgba(212,175,55,.12),rgba(212,175,55,.06))",
//           border: "1px solid rgba(212,175,55,.35)",
//           borderRadius: 12, padding: "14px 16px", marginBottom: 14,
//         }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <div style={{ fontSize: 11, color: "rgba(212,175,55,.6)", textTransform: "uppercase", letterSpacing: ".06em" }}>
//                 Package
//               </div>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#d4af37", marginTop: 2 }}>
//                 {pkg.label} Experience
//               </div>
//               <div style={{ fontSize: 11, color: "rgba(212,175,55,.5)", marginTop: 2 }}>
//                 {pkg.usd}
//               </div>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <div style={{ fontSize: 11, color: "rgba(212,175,55,.6)", textTransform: "uppercase", letterSpacing: ".06em" }}>
//                 Total
//               </div>
//               <div style={{ fontSize: 22, fontWeight: 800, color: "#d4af37", marginTop: 2 }}>
//                 NPR {pkg.price.toLocaleString()}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Note */}
//         <div style={{
//           fontSize: 11, color: "rgba(149,213,178,.4)",
//           textAlign: "center", marginBottom: 14, lineHeight: 1.6,
//         }}>
//           🔒 Secure payment via eSewa · Your details are safe
//         </div>

//         {/* Action buttons */}
//         <button
//           onClick={handleConfirm}
//           disabled={confirming}
//           style={{
//             width: "100%", padding: "14px",
//             background: confirming
//               ? "rgba(82,183,136,.3)"
//               : "linear-gradient(135deg,#60d394,#2d9b6a)",
//             border: "none", borderRadius: 12,
//             color: confirming ? "rgba(255,255,255,.5)" : "#fff",
//             fontSize: 15, fontWeight: 700, cursor: confirming ? "default" : "pointer",
//             fontFamily: "inherit", marginBottom: 10,
//             transition: "all .3s",
//             boxShadow: confirming ? "none" : "0 6px 20px rgba(45,106,79,.4)",
//             display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//           }}
//         >
//           {confirming ? (
//             <>
//               <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"zanSpin .8s linear infinite" }} />
//               Redirecting to eSewa...
//             </>
//           ) : (
//             "✅ Confirm & Pay with eSewa →"
//           )}
//         </button>

//         <button
//           onClick={onBack}
//           style={{
//             width: "100%", padding: "11px",
//             background: "transparent",
//             border: "1px solid rgba(45,106,79,.35)",
//             borderRadius: 12, color: "rgba(149,213,178,.6)",
//             fontSize: 13, cursor: "pointer", fontFamily: "inherit",
//             transition: "all .2s",
//           }}
//           onMouseEnter={(e) => { e.currentTarget.style.background="rgba(45,106,79,.15)"; e.currentTarget.style.color="#95d5b2"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(149,213,178,.6)"; }}
//         >
//           ← Edit details
//         </button>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════
// // STYLES
// // ══════════════════════════════════════════════
// const S = {
//   launcher: (open) => ({
//     position: "fixed", bottom: 28, right: 28,
//     width: 60, height: 60, borderRadius: "50%",
//     background: open
//       ? "linear-gradient(135deg,#1a3a2a,#0d1f15)"
//       : "linear-gradient(135deg,#2d6a4f,#1b4332)",
//     boxShadow: open
//       ? "0 4px 20px rgba(0,0,0,.4)"
//       : "0 6px 28px rgba(45,106,79,.55),0 0 0 8px rgba(45,106,79,.12)",
//     border: "none", cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 9999, transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
//     transform: open ? "scale(.92)" : "scale(1)",
//   }),
//   pulse: {
//     position: "absolute", inset: -8, borderRadius: "50%",
//     border: "2px solid rgba(45,106,79,.35)",
//     animation: "zanPulse 2s ease-in-out infinite", pointerEvents: "none",
//   },
//   badge: {
//     position: "absolute", top: -4, right: -4,
//     width: 20, height: 20, borderRadius: "50%",
//     background: "#d4af37", color: "#000", fontSize: 11, fontWeight: 700,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     border: "2px solid #0a1a0f", zIndex: 1,
//   },
//   win: (open) => ({
//     position: "fixed", bottom: 104, right: 28,
//     width: 380, maxWidth: "calc(100vw - 40px)",
//     height: 580, maxHeight: "calc(100vh - 130px)",
//     background: "linear-gradient(180deg,#0d1f15,#081510)",
//     borderRadius: 20,
//     boxShadow: "0 24px 80px rgba(0,0,0,.7),0 0 0 1px rgba(45,106,79,.25)",
//     display: "flex", flexDirection: "column", overflow: "hidden",
//     zIndex: 9998, transformOrigin: "bottom right",
//     opacity: open ? 1 : 0,
//     transform: open ? "scale(1) translateY(0)" : "scale(.85) translateY(20px)",
//     pointerEvents: open ? "all" : "none",
//     transition: "all .35s cubic-bezier(.34,1.2,.64,1)",
//   }),
//   hdr: {
//     padding: "14px 18px",
//     background: "linear-gradient(135deg,#1a3a2a,#122b1e)",
//     borderBottom: "1px solid rgba(45,106,79,.3)",
//     display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
//   },
//   av: {
//     width: 40, height: 40, borderRadius: "50%",
//     background: "linear-gradient(135deg,#2d6a4f,#1b4332)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     flexShrink: 0, boxShadow: "0 0 0 3px rgba(45,106,79,.3)",
//     position: "relative", overflow: "hidden",
//   },
//   dot: {
//     position: "absolute", bottom: 2, right: 2,
//     width: 9, height: 9, borderRadius: "50%",
//     background: "#52b788", border: "2px solid #0d1f15",
//   },
//   closeBtn: {
//     width: 30, height: 30, borderRadius: "50%",
//     background: "rgba(255,255,255,.06)", border: "none", cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     color: "#94a3b8", fontSize: 15, transition: "all .2s", flexShrink: 0,
//   },
//   msgs: {
//     flex: 1, overflowY: "auto", padding: "14px 13px",
//     display: "flex", flexDirection: "column", gap: 10,
//   },
//   row: (bot) => ({
//     display: "flex",
//     justifyContent: bot ? "flex-start" : "flex-end",
//     alignItems: "flex-end", gap: 7,
//   }),
//   mini: {
//     width: 26, height: 26, borderRadius: "50%",
//     background: "linear-gradient(135deg,#2d6a4f,#1b4332)",
//     flexShrink: 0, overflow: "hidden",
//   },
//   bbl: (bot) => ({
//     maxWidth: "80%", padding: "9px 13px",
//     borderRadius: bot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
//     fontSize: 13.5, lineHeight: 1.6,
//     color: bot ? "#d4edda" : "#fff",
//     background: bot
//       ? "linear-gradient(135deg,#1a3a2a,#152e21)"
//       : "linear-gradient(135deg,#2d6a4f,#1b4332)",
//     border: bot ? "1px solid rgba(45,106,79,.3)" : "none",
//     boxShadow: bot ? "0 2px 10px rgba(0,0,0,.3)" : "0 2px 10px rgba(45,106,79,.3)",
//     wordBreak: "break-word",
//   }),
//   ts: { fontSize: 10, color: "rgba(255,255,255,.28)", marginTop: 3, textAlign: "right" },
//   typing: {
//     display: "flex", alignItems: "center", gap: 4, padding: "11px 15px",
//     background: "linear-gradient(135deg,#1a3a2a,#152e21)",
//     border: "1px solid rgba(45,106,79,.3)",
//     borderRadius: "16px 16px 16px 4px", width: "fit-content",
//   },
//   tdot: (i) => ({
//     width: 6, height: 6, borderRadius: "50%", background: "#52b788",
//     animation: `zanBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
//   }),
//   chips: {
//     padding: "7px 13px 3px", display: "flex", flexWrap: "wrap",
//     gap: 6, flexShrink: 0,
//   },
//   chip: {
//     padding: "6px 11px", borderRadius: 999,
//     background: "rgba(45,106,79,.18)", border: "1px solid rgba(45,106,79,.4)",
//     color: "#95d5b2", fontSize: 12, cursor: "pointer", transition: "all .2s",
//     fontFamily: "inherit", lineHeight: 1, whiteSpace: "nowrap",
//   },
//   inp: {
//     padding: "11px 13px", borderTop: "1px solid rgba(45,106,79,.2)",
//     display: "flex", gap: 8, alignItems: "flex-end",
//     background: "rgba(0,0,0,.25)", flexShrink: 0,
//   },
//   ta: {
//     flex: 1, background: "rgba(45,106,79,.1)",
//     border: "1px solid rgba(45,106,79,.3)", borderRadius: 13,
//     padding: "8px 12px", color: "#e8f5e9", fontSize: 13.5,
//     resize: "none", outline: "none", fontFamily: "inherit",
//     lineHeight: 1.5, maxHeight: 90, overflow: "auto",
//     caretColor: "#52b788", transition: "border-color .2s",
//   },
//   send: (on) => ({
//     width: 36, height: 36, borderRadius: "50%",
//     background: on ? "linear-gradient(135deg,#2d6a4f,#1b4332)" : "rgba(45,106,79,.15)",
//     border: "none", cursor: on ? "pointer" : "default",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     flexShrink: 0, transition: "all .2s",
//     boxShadow: on ? "0 3px 12px rgba(45,106,79,.4)" : "none",
//   }),
//   foot: {
//     textAlign: "center", fontSize: 10, color: "rgba(255,255,255,.18)",
//     padding: "5px 0 9px", flexShrink: 0,
//   },
// };

// // ══════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════
// export default function BotFlow() {
//   const [open,       setOpen]       = useState(false);
//   const [messages,   setMessages]   = useState([]);
//   const [input,      setInput]      = useState("");
//   const [loading,    setLoading]    = useState(false);
//   const [showChips,  setShowChips]  = useState(true);
//   const [unread,     setUnread]     = useState(1);
//   const [started,    setStarted]    = useState(false);
//   const [proxyError, setProxyError] = useState(false);
//   // "chat" | "confirm"
//   const [screen,     setScreen]     = useState("chat");
//   const [orderData,  setOrderData]  = useState(null);

//   const bottomRef   = useRef(null);
//   const inputRef    = useRef(null);
//   const launcherRef = useRef(null);

//   useEffect(() => { injectKF(); }, []);

//   useEffect(() => {
//     if (!launcherRef.current) return;
//     gsap.fromTo(launcherRef.current,
//       { scale: 0, opacity: 0 },
//       { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 2.5 }
//     );
//   }, []);

//   useEffect(() => {
//     if (open && !started) {
//       setStarted(true);
//       setUnread(0);
//       setMessages([{
//         id: Date.now(), role: "assistant", time: ts(),
//         text: "Hey there! 👋 I'm Zana, your Zanmadin celebration guide.\n\nWhat kind of magic are we creating today? 🎉",
//       }]);
//     }
//     if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 400); }
//   }, [open, started]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const sendMessage = useCallback(async (text) => {
//     const userText = (text || input).trim();
//     if (!userText || loading) return;

//     setInput("");
//     setShowChips(false);
//     setProxyError(false);

//     const userMsg = { id: Date.now(), role: "user", text: userText, time: ts() };
//     setMessages((prev) => [...prev, userMsg]);
//     setLoading(true);

//     const history = [...messages, userMsg].map((m) => ({
//       role: m.role === "assistant" ? "assistant" : "user",
//       content: stripHandoff(m.text),
//     }));

//     try {
//       const res = await fetch(PROXY_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history, max_tokens: 1000 }),
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || `HTTP ${res.status}`);
//       }

//       const data      = await res.json();
//       const rawText   = data.content?.map((b) => b.text || "").join("") || "";
//       const handoff   = parseHandoff(rawText);
//       const cleanText = stripHandoff(rawText);

//       setMessages((prev) => [...prev, {
//         id: Date.now() + 1, role: "assistant",
//         text: cleanText, time: ts(),
//       }]);

//       // ── Handoff triggered ──────────────────────
//       if (handoff) {
//         // 1. Silently fire WhatsApp to Zanmadin team (background)
//         silentSendToWhatsApp(handoff);

//         // 2. Short delay then show confirmation screen to user
//         setTimeout(() => {
//           setOrderData(handoff);
//           setScreen("confirm");
//         }, 1400);
//       }

//     } catch (err) {
//       console.error("[BotFlow]", err.message);
//       const isConn = err.message.includes("Failed to fetch") || err.message.includes("NetworkError");
//       if (isConn) setProxyError(true);
//       setMessages((prev) => [...prev, {
//         id: Date.now() + 1, role: "assistant", time: ts(),
//         text: isConn
//           ? "⚠️ Proxy server not running. Start it with `node server.js` — or reach us on WhatsApp directly! 💚"
//           : `⚠️ ${err.message}`,
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   }, [input, loading, messages]);

//   const handleKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const handleConfirmPay = (data, pkg) => {
//     submitEsewaPayment(data);
//   };

//   const handleBack = () => {
//     setScreen("chat");
//   };

//   const headerTitle = screen === "confirm" ? "Order Summary" : "Zana · Zanmadin";
//   const headerSub   = screen === "confirm" ? "Confirm your celebration" : "Online · Replies instantly";

//   return (
//     <>
//       {/* ── Chat Window ── */}
//       <div style={S.win(open)} role="dialog" aria-label="Zanmadin chat assistant">

//         {/* Header */}
//         <div style={S.hdr}>
//           <div style={S.av}>
//             <img src={logo} alt="Zanmadin"
//               style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//             <div style={S.dot} />
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize:14, fontWeight:700, color:"#e8f5e9", letterSpacing:".02em" }}>
//               {headerTitle}
//             </div>
//             <div style={{ fontSize:11, color:"#52b788", marginTop:1, display:"flex", alignItems:"center", gap:4 }}>
//               <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block" }} />
//               {headerSub}
//             </div>
//           </div>
//           <button style={S.closeBtn} onClick={() => setOpen(false)} aria-label="Close"
//             onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,.12)"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,.06)"; }}>
//             ✕
//           </button>
//         </div>

//         {/* Proxy offline banner */}
//         {proxyError && (
//           <div style={{ padding:"7px 13px", background:"rgba(200,50,50,.12)", borderBottom:"1px solid rgba(200,50,50,.25)", fontSize:11, color:"#fca5a5", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
//             ⚠️ Proxy offline — run <code style={{ background:"rgba(0,0,0,.3)", padding:"1px 5px", borderRadius:4 }}>node server.js</code>
//           </div>
//         )}

//         {/* ── SCREEN: CHAT ── */}
//         {screen === "chat" && (
//           <>
//             <div style={S.msgs}>
//               {messages.map((msg) => (
//                 <div key={msg.id} style={S.row(msg.role === "assistant")}>
//                   {msg.role === "assistant" && (
//                     <div style={S.mini}>
//                       <img src={logo} alt="Zana"
//                         style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//                     </div>
//                   )}
//                   <div>
//                     <div style={S.bbl(msg.role === "assistant")}>
//                       {msg.text.split("\n").map((line, i, arr) => (
//                         <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
//                       ))}
//                     </div>
//                     <div style={S.ts}>{msg.time}</div>
//                   </div>
//                 </div>
//               ))}

//               {loading && (
//                 <div style={S.row(true)}>
//                   <div style={S.mini}>
//                     <img src={logo} alt="Zana"
//                       style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//                   </div>
//                   <div style={S.typing}>
//                     {[0,1,2].map((i) => <div key={i} style={S.tdot(i)} />)}
//                   </div>
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </div>

//             {showChips && messages.length > 0 && (
//               <div style={S.chips}>
//                 {INITIAL_CHIPS.map((chip, i) => (
//                   <button key={i} style={S.chip} onClick={() => sendMessage(chip)}
//                     onMouseEnter={(e) => { e.currentTarget.style.background="rgba(45,106,79,.35)"; e.currentTarget.style.color="#b7e4c7"; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.background="rgba(45,106,79,.18)"; e.currentTarget.style.color="#95d5b2"; }}>
//                     {chip}
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div style={S.inp}>
//               <textarea ref={inputRef} rows={1} style={S.ta}
//                 placeholder="Type your message…" value={input} disabled={loading}
//                 onChange={(e) => {
//                   setInput(e.target.value);
//                   e.target.style.height = "auto";
//                   e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
//                 }}
//                 onKeyDown={handleKey}
//                 onFocus={(e) => { e.target.style.borderColor = "rgba(82,183,136,.6)"; }}
//                 onBlur={(e)  => { e.target.style.borderColor = "rgba(45,106,79,.3)"; }}
//               />
//               <button style={S.send(!!input.trim() && !loading)}
//                 onClick={() => sendMessage()} disabled={!input.trim() || loading} aria-label="Send">
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
//                   stroke={input.trim() && !loading ? "#95d5b2" : "rgba(82,183,136,.3)"}
//                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <line x1="22" y1="2" x2="11" y2="13"/>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//                 </svg>
//               </button>
//             </div>
//           </>
//         )}

//         {/* ── SCREEN: CONFIRM ── */}
//         {screen === "confirm" && orderData && (
//           <ConfirmationScreen
//             data={orderData}
//             onConfirm={handleConfirmPay}
//             onBack={handleBack}
//           />
//         )}

//         <div style={S.foot}>Zanmadin AI · 🔒 Secure</div>
//       </div>

//       {/* ── Launcher Button ── */}
//       <button ref={launcherRef}
//         style={{ ...S.launcher(open), opacity: 0 }}
//         onClick={() => setOpen((v) => !v)}
//         aria-label={open ? "Close chat" : "Chat with Zana"}>
//         {!open && <div style={S.pulse} />}
//         {unread > 0 && !open && <div style={S.badge}>{unread}</div>}
//         <span style={{ fontSize:22, transition:"all .3s", transform: open ? "rotate(90deg)" : "none", display:"block" }}>
//           {open ? "✕" : "💬"}
//         </span>
//       </button>
//     </>
//   );
// }

// ══════════════════════════════════════════════
// BotFlow.jsx — Zanmadin AI Chat Widget
//
// Full flow:
//   [1] Chat  → Bot collects occasion, name, budget
//   [2] Auto  → AI generates surprise recommendation
//   [3] Silent→ WhatsApp fired to Zanmadin team
//   [4] Screen→ Confirmation shown to user
//   [5] Pay   → Server-signed eSewa checkout
// ══════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import logo from "../assets/logo.png";

// ── Config ──────────────────────────────────────
const WHATSAPP_PHONE = "9779862699667"; // digits only
const BASE_URL = "http://localhost:3001";

// ── Package pricing ─────────────────────────────
const PACKAGES = {
  casual:   { label: "Casual",   priceNPR: 3999,  desc: "A warm personal touch" },
  standard: { label: "Standard", priceNPR: 9999,  desc: "Thoughtful & beautiful" },
  premium:  { label: "Premium",  priceNPR: 24999, desc: "Luxurious & unforgettable" },
  luxury:   { label: "Luxury",   priceNPR: 59999, desc: "Grand & extraordinary" },
};

function detectPackage(budget = "") {
  const b = budget.toLowerCase();
  if (b.includes("casual")  || b.includes("under") || b.includes("100")) return PACKAGES.casual;
  if (b.includes("premium") || b.includes("300"))                         return PACKAGES.premium;
  if (b.includes("luxury")  || b.includes("700"))                         return PACKAGES.luxury;
  return PACKAGES.standard;
}

// ── System prompt ───────────────────────────────
const SYSTEM_PROMPT = `You are Zana, Zanmadin's warm celebration assistant. Zanmadin is Addis Ababa's premier surprise experience company.

Personality: warm, excited, creative. Use tasteful emojis. Speak like a close friend who is an expert party planner.

Your job: Collect through natural conversation —
1. Occasion type
2. Recipient's name + relationship to user
3. Date / timeline
4. Budget: casual (under $100) / standard ($100–300) / premium ($300–700) / luxury ($700+)
5. Theme or special requests

Rules:
- Keep responses SHORT: 2–4 sentences max
- Ask ONE question at a time
- NEVER mention WhatsApp, sending data, or contacting anyone
- NEVER say "our team will reach out" or "I'll pass this on"

Once you have occasion + recipient name + budget — write a warm excited closing, then output [READY] with JSON:

[READY]
{"occasion":"Birthday Surprise","recipientName":"Sara","relationship":"girlfriend","date":"March 20","budget":"premium","theme":"roses and candlelight","specialRequests":"Ethiopian coffee ceremony"}

Only include fields you collected. Omit unknowns.`;

const INITIAL_CHIPS = [
  "🎂 Birthday surprise",
  "🌹 Romantic evening",
  "🌍 Gift from abroad",
  "💍 Proposal setup",
  "🎉 Office celebration",
  "✨ Custom experience",
];

// ── Helpers ─────────────────────────────────────
const ts = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const uid = () => `ZAN-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

function parseHandoff(text) {
  if (!text.includes("[READY]")) return null;
  try {
    const m = text.match(/\[READY\]\s*(\{[\s\S]*?\})/);
    return m ? JSON.parse(m[1]) : null;
  } catch { return null; }
}
function stripHandoff(text) {
  return text.replace(/\[READY\][\s\S]*$/, "").trim();
}

// ── Silent WhatsApp send ────────────────────────
function silentWA(data, recommendation) {
  const lines = [
    "🔔 *New Zanmadin Booking — via AI Bot*", "",
    data.occasion        ? `🎊 *Occasion:* ${data.occasion}`         : null,
    data.recipientName   ? `👤 *For:* ${data.recipientName}`         : null,
    data.relationship    ? `💞 *Relationship:* ${data.relationship}` : null,
    data.date            ? `📅 *Date:* ${data.date}`                 : null,
    data.budget          ? `💰 *Budget:* ${data.budget}`             : null,
    data.theme           ? `🎨 *Theme:* ${data.theme}`               : null,
    data.specialRequests ? `✨ *Requests:* ${data.specialRequests}`  : null,
    recommendation ? ["", "💡 *AI Suggestion:*", recommendation] : null,
    "", `⏰ ${new Date().toLocaleString()}`,
  ].flat().filter(Boolean);

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
  const popup = window.open(url, "_blank", "width=1,height=1,left=-9999,top=-9999,noopener");
  if (popup) setTimeout(() => { try { popup.close(); } catch(_){} }, 3000);
}

// ── eSewa payment (server-signed) ───────────────
async function initiateEsewaPayment(orderData, pkg) {
  const txnId = uid();

  const res = await fetch(`${BASE_URL}/api/payment/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount:          pkg.priceNPR,
      productName:     `Zanmadin ${pkg.label} — ${orderData.occasion}`,
      transactionUuid: txnId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Payment initiation failed");
  }

  const { formAction, fields } = await res.json();

  // Build and submit a hidden form — signature came from server
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formAction;

  Object.entries(fields).forEach(([key, val]) => {
    const inp = document.createElement("input");
    inp.type = "hidden"; inp.name = key; inp.value = val;
    form.appendChild(inp);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// ── Inject keyframes once ───────────────────────
function injectKF() {
  if (document.getElementById("zan-kf")) return;
  const s = document.createElement("style");
  s.id = "zan-kf";
  s.textContent = `
    @keyframes zanPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.18);opacity:0}}
    @keyframes zanBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    @keyframes zanFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes zanSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes zanPop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    @keyframes zanShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  `;
  document.head.appendChild(s);
}

// ══════════════════════════════════════════════
// CONFIRMATION SCREEN
// ══════════════════════════════════════════════
function ConfirmScreen({ data, recommendation, onPay, onBack }) {
  const pkg = detectPackage(data.budget);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  const fields = [
    { icon:"🎊", label:"Occasion",       value: data.occasion },
    { icon:"👤", label:"Person's Name",  value: data.recipientName },
    { icon:"💞", label:"Relationship",   value: data.relationship },
    { icon:"📅", label:"Date",           value: data.date },
    { icon:"🎨", label:"Theme",          value: data.theme },
    { icon:"✨", label:"Special Requests", value: data.specialRequests },
  ].filter(f => f.value);

  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    try {
      await initiateEsewaPayment(data, pkg);
    } catch (err) {
      setPayError(err.message);
      setPaying(false);
    }
  };

  return (
    <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", animation:"zanFadeUp .35s ease" }}>

      {/* Top banner */}
      <div style={{ padding:"18px 16px 14px", background:"linear-gradient(135deg,#1a3a2a,#122b1e)", borderBottom:"1px solid rgba(45,106,79,.3)", textAlign:"center" }}>
        <div style={{ animation:"zanPop .5s ease", marginBottom:8 }}>
          <svg width="50" height="50" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="23" fill="none" stroke="rgba(82,183,136,.25)" strokeWidth="2"/>
            <circle cx="26" cy="26" r="23" fill="none" stroke="#52b788" strokeWidth="2.5"
              strokeDasharray="145" strokeLinecap="round"/>
            <polyline points="16,27 23,34 36,19" fill="none" stroke="#52b788" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:"#b7e4c7", marginBottom:3 }}>Your Celebration is Ready! 🎉</div>
        <div style={{ fontSize:11, color:"rgba(149,213,178,.55)" }}>Review and confirm to proceed with payment</div>
      </div>

      <div style={{ padding:"12px 14px", flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>

        {/* AI Recommendation box */}
        {recommendation && (
          <div style={{ padding:"12px 14px", background:"linear-gradient(135deg,rgba(212,175,55,.1),rgba(212,175,55,.05))", border:"1px solid rgba(212,175,55,.3)", borderRadius:12 }}>
            <div style={{ fontSize:10, color:"rgba(212,175,55,.6)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>
              ✨ AI Surprise Idea for You
            </div>
            <div style={{ fontSize:12.5, color:"#e8d5a0", lineHeight:1.65 }}>{recommendation}</div>
          </div>
        )}

        {/* Order fields */}
        <div style={{ background:"rgba(45,106,79,.08)", border:"1px solid rgba(45,106,79,.2)", borderRadius:12, overflow:"hidden" }}>
          {fields.map((f, i) => (
            <div key={f.label} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 13px", borderBottom: i < fields.length-1 ? "1px solid rgba(45,106,79,.12)" : "none" }}>
              <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:9.5, color:"rgba(149,213,178,.5)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:1 }}>{f.label}</div>
                <div style={{ fontSize:13, color:"#d4edda", fontWeight:500 }}>{f.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Package + Price */}
        <div style={{ background:"linear-gradient(135deg,rgba(212,175,55,.13),rgba(212,175,55,.05))", border:"1px solid rgba(212,175,55,.3)", borderRadius:12, padding:"13px 15px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(212,175,55,.55)", textTransform:"uppercase", letterSpacing:".07em" }}>Package</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#d4af37", marginTop:2 }}>{pkg.label} Experience</div>
            <div style={{ fontSize:11, color:"rgba(212,175,55,.5)", marginTop:1 }}>{pkg.desc}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"rgba(212,175,55,.55)", textTransform:"uppercase", letterSpacing:".07em" }}>Total</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#d4af37", marginTop:2, letterSpacing:"-.5px" }}>
              NPR {pkg.priceNPR.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Error */}
        {payError && (
          <div style={{ padding:"9px 12px", background:"rgba(200,50,50,.15)", border:"1px solid rgba(200,50,50,.3)", borderRadius:10, fontSize:12, color:"#fca5a5" }}>
            ⚠️ {payError}
          </div>
        )}

        {/* eSewa button */}
        <button onClick={handlePay} disabled={paying} style={{
          width:"100%", padding:"13px",
          background: paying ? "rgba(82,183,136,.25)" : "linear-gradient(135deg,#60d394,#2d9b6a)",
          border:"none", borderRadius:12,
          color: paying ? "rgba(255,255,255,.45)" : "#fff",
          fontSize:14, fontWeight:700,
          cursor: paying ? "default" : "pointer",
          fontFamily:"inherit",
          boxShadow: paying ? "none" : "0 6px 20px rgba(45,106,79,.45)",
          transition:"all .3s",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          {paying ? (
            <>
              <span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"zanSpin .7s linear infinite" }}/>
              Connecting to eSewa...
            </>
          ) : (
            <>
              <img src="https://esewa.com.np/common/images/esewa_logo.png"
                alt="eSewa" style={{ height:18, filter:"brightness(0) invert(1)" }}
                onError={(e) => { e.target.style.display="none"; }}
              />
              Pay NPR {pkg.priceNPR.toLocaleString()} with eSewa →
            </>
          )}
        </button>

        {/* Security note */}
        <div style={{ fontSize:10.5, color:"rgba(149,213,178,.35)", textAlign:"center", lineHeight:1.6 }}>
          🔒 Secure checkout · Signature verified server-side<br/>
          You will be redirected to eSewa to complete payment
        </div>

        {/* Back */}
        <button onClick={onBack} style={{
          width:"100%", padding:"10px", background:"transparent",
          border:"1px solid rgba(45,106,79,.3)", borderRadius:12,
          color:"rgba(149,213,178,.5)", fontSize:12.5, cursor:"pointer",
          fontFamily:"inherit", transition:"all .2s", marginBottom:4,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background="rgba(45,106,79,.15)"; e.currentTarget.style.color="#95d5b2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(149,213,178,.5)"; }}>
          ← Edit my details
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════
const S = {
  launcher: (open) => ({
    position:"fixed", bottom:28, right:28,
    width:60, height:60, borderRadius:"50%",
    background: open ? "linear-gradient(135deg,#1a3a2a,#0d1f15)" : "linear-gradient(135deg,#2d6a4f,#1b4332)",
    boxShadow: open ? "0 4px 20px rgba(0,0,0,.4)" : "0 6px 28px rgba(45,106,79,.55),0 0 0 8px rgba(45,106,79,.12)",
    border:"none", cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:9999, transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
    transform: open ? "scale(.92)" : "scale(1)",
  }),
  pulse: { position:"absolute", inset:-8, borderRadius:"50%", border:"2px solid rgba(45,106,79,.35)", animation:"zanPulse 2s ease-in-out infinite", pointerEvents:"none" },
  badge: { position:"absolute", top:-4, right:-4, width:20, height:20, borderRadius:"50%", background:"#d4af37", color:"#000", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #0a1a0f", zIndex:1 },
  win: (open) => ({
    position:"fixed", bottom:104, right:28,
    width:380, maxWidth:"calc(100vw - 40px)",
    height:590, maxHeight:"calc(100vh - 130px)",
    background:"linear-gradient(180deg,#0d1f15,#081510)",
    borderRadius:20,
    boxShadow:"0 24px 80px rgba(0,0,0,.7),0 0 0 1px rgba(45,106,79,.25)",
    display:"flex", flexDirection:"column", overflow:"hidden",
    zIndex:9998, transformOrigin:"bottom right",
    opacity: open ? 1 : 0,
    transform: open ? "scale(1) translateY(0)" : "scale(.85) translateY(20px)",
    pointerEvents: open ? "all" : "none",
    transition:"all .35s cubic-bezier(.34,1.2,.64,1)",
  }),
  hdr: { padding:"13px 16px", background:"linear-gradient(135deg,#1a3a2a,#122b1e)", borderBottom:"1px solid rgba(45,106,79,.3)", display:"flex", alignItems:"center", gap:11, flexShrink:0 },
  av: { width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#2d6a4f,#1b4332)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 0 3px rgba(45,106,79,.3)", position:"relative", overflow:"hidden" },
  dot: { position:"absolute", bottom:2, right:2, width:9, height:9, borderRadius:"50%", background:"#52b788", border:"2px solid #0d1f15" },
  closeBtn: { width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,.06)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:14, transition:"all .2s", flexShrink:0 },
  msgs: { flex:1, overflowY:"auto", padding:"13px 12px", display:"flex", flexDirection:"column", gap:9 },
  row: (bot) => ({ display:"flex", justifyContent: bot ? "flex-start" : "flex-end", alignItems:"flex-end", gap:7 }),
  mini: { width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#2d6a4f,#1b4332)", flexShrink:0, overflow:"hidden" },
  bbl: (bot) => ({ maxWidth:"80%", padding:"9px 13px", borderRadius: bot ? "16px 16px 16px 4px" : "16px 16px 4px 16px", fontSize:13.5, lineHeight:1.6, color: bot ? "#d4edda" : "#fff", background: bot ? "linear-gradient(135deg,#1a3a2a,#152e21)" : "linear-gradient(135deg,#2d6a4f,#1b4332)", border: bot ? "1px solid rgba(45,106,79,.3)" : "none", boxShadow: bot ? "0 2px 10px rgba(0,0,0,.3)" : "0 2px 10px rgba(45,106,79,.3)", wordBreak:"break-word" }),
  ts: { fontSize:10, color:"rgba(255,255,255,.27)", marginTop:3, textAlign:"right" },
  typing: { display:"flex", alignItems:"center", gap:4, padding:"10px 14px", background:"linear-gradient(135deg,#1a3a2a,#152e21)", border:"1px solid rgba(45,106,79,.3)", borderRadius:"16px 16px 16px 4px", width:"fit-content" },
  tdot: (i) => ({ width:6, height:6, borderRadius:"50%", background:"#52b788", animation:`zanBounce 1.2s ease-in-out ${i*.2}s infinite` }),
  chips: { padding:"6px 12px 3px", display:"flex", flexWrap:"wrap", gap:6, flexShrink:0 },
  chip: { padding:"6px 11px", borderRadius:999, background:"rgba(45,106,79,.18)", border:"1px solid rgba(45,106,79,.4)", color:"#95d5b2", fontSize:12, cursor:"pointer", transition:"all .2s", fontFamily:"inherit", lineHeight:1, whiteSpace:"nowrap" },
  inp: { padding:"10px 12px", borderTop:"1px solid rgba(45,106,79,.2)", display:"flex", gap:7, alignItems:"flex-end", background:"rgba(0,0,0,.25)", flexShrink:0 },
  ta: { flex:1, background:"rgba(45,106,79,.1)", border:"1px solid rgba(45,106,79,.3)", borderRadius:12, padding:"8px 11px", color:"#e8f5e9", fontSize:13.5, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.5, maxHeight:88, overflow:"auto", caretColor:"#52b788", transition:"border-color .2s" },
  send: (on) => ({ width:35, height:35, borderRadius:"50%", background: on ? "linear-gradient(135deg,#2d6a4f,#1b4332)" : "rgba(45,106,79,.15)", border:"none", cursor: on ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s", boxShadow: on ? "0 3px 12px rgba(45,106,79,.4)" : "none" }),
  foot: { textAlign:"center", fontSize:10, color:"rgba(255,255,255,.16)", padding:"5px 0 8px", flexShrink:0 },
};

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export default function BotFlow() {
  const [open,        setOpen]        = useState(false);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showChips,   setShowChips]   = useState(true);
  const [unread,      setUnread]      = useState(1);
  const [started,     setStarted]     = useState(false);
  const [proxyError,  setProxyError]  = useState(false);
  // "chat" | "confirm"
  const [screen,      setScreen]      = useState("chat");
  const [orderData,   setOrderData]   = useState(null);
  const [aiRec,       setAiRec]       = useState(null);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const launcherRef = useRef(null);

  useEffect(() => { injectKF(); }, []);

  useEffect(() => {
    if (!launcherRef.current) return;
    gsap.fromTo(launcherRef.current,
      { scale:0, opacity:0 },
      { scale:1, opacity:1, duration:.6, ease:"back.out(1.7)", delay:2.5 }
    );
  }, []);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setUnread(0);
      setMessages([{ id:Date.now(), role:"assistant", time:ts(),
        text:"Hey there! 👋 I'm Zana, your Zanmadin celebration guide.\n\nWhat kind of magic are we creating today? 🎉",
      }]);
    }
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 400); }
  }, [open, started]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  // ── After handoff: fetch AI recommendation ──
  const fetchRecommendation = async (data) => {
    try {
      const res = await fetch(`${BASE_URL}/api/recommend`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.recommendation || null;
    } catch { return null; }
  };

  // ── Log handoff server-side ──────────────────
  const logHandoff = (data) => {
    fetch(`${BASE_URL}/api/handoff`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  };

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setShowChips(false);
    setProxyError(false);

    const userMsg = { id:Date.now(), role:"user", text:userText, time:ts() };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: stripHandoff(m.text),
    }));

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ system:SYSTEM_PROMPT, messages:history, max_tokens:1000 }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `HTTP ${res.status}`);
      }

      const data    = await res.json();
      const rawText = data.content?.map((b) => b.text || "").join("") || "";
      const handoff = parseHandoff(rawText);
      const clean   = stripHandoff(rawText);

      setMessages((p) => [...p, { id:Date.now()+1, role:"assistant", text:clean, time:ts() }]);

      // ── Handoff triggered ──────────────────────
      if (handoff) {
        // 1. Log server-side
        logHandoff(handoff);

        // 2. Fetch AI recommendation in background
        const rec = await fetchRecommendation(handoff);
        setAiRec(rec);

        // 3. Silently open WhatsApp for team (background)
        silentWA(handoff, rec);

        // 4. Show confirmation screen to user after short delay
        setTimeout(() => {
          setOrderData(handoff);
          setScreen("confirm");
        }, 1200);
      }

    } catch (err) {
      const isConn = err.message.includes("Failed to fetch") || err.message.includes("NetworkError");
      if (isConn) setProxyError(true);
      setMessages((p) => [...p, { id:Date.now()+1, role:"assistant", time:ts(),
        text: isConn
          ? "⚠️ Proxy server not running. Start it with `node server.js` — or reach us on WhatsApp directly! 💚"
          : `⚠️ ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* ── Window ── */}
      <div style={S.win(open)} role="dialog" aria-label="Zanmadin chat">

        {/* Header */}
        <div style={S.hdr}>
          <div style={S.av}>
            <img src={logo} alt="Zanmadin" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={S.dot}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#e8f5e9", letterSpacing:".02em" }}>
              {screen === "confirm" ? "Confirm Your Order" : "Zana · Zanmadin"}
            </div>
            <div style={{ fontSize:11, color:"#52b788", marginTop:1, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block" }}/>
              {screen === "confirm" ? "Review & pay securely" : "Online · Replies instantly"}
            </div>
          </div>
          <button style={S.closeBtn} onClick={() => setOpen(false)} aria-label="Close"
            onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,.06)"; }}>✕</button>
        </div>

        {/* Proxy error banner */}
        {proxyError && (
          <div style={{ padding:"7px 13px", background:"rgba(200,50,50,.12)", borderBottom:"1px solid rgba(200,50,50,.25)", fontSize:11, color:"#fca5a5", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            ⚠️ Proxy offline — run <code style={{ background:"rgba(0,0,0,.3)", padding:"1px 5px", borderRadius:4 }}>node server.js</code>
          </div>
        )}

        {/* ── CHAT SCREEN ── */}
        {screen === "chat" && (
          <>
            <div style={S.msgs}>
              {messages.map((msg) => (
                <div key={msg.id} style={S.row(msg.role === "assistant")}>
                  {msg.role === "assistant" && (
                    <div style={S.mini}>
                      <img src={logo} alt="Zana" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    </div>
                  )}
                  <div>
                    <div style={S.bbl(msg.role === "assistant")}>
                      {msg.text.split("\n").map((l, i, a) => (
                        <span key={i}>{l}{i < a.length-1 && <br/>}</span>
                      ))}
                    </div>
                    <div style={S.ts}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={S.row(true)}>
                  <div style={S.mini}>
                    <img src={logo} alt="Zana" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <div style={S.typing}>
                    {[0,1,2].map((i) => <div key={i} style={S.tdot(i)}/>)}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {showChips && messages.length > 0 && (
              <div style={S.chips}>
                {INITIAL_CHIPS.map((c, i) => (
                  <button key={i} style={S.chip} onClick={() => sendMessage(c)}
                    onMouseEnter={(e) => { e.currentTarget.style.background="rgba(45,106,79,.35)"; e.currentTarget.style.color="#b7e4c7"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background="rgba(45,106,79,.18)"; e.currentTarget.style.color="#95d5b2"; }}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div style={S.inp}>
              <textarea ref={inputRef} rows={1} style={S.ta}
                placeholder="Type your message…" value={input} disabled={loading}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 88) + "px";
                }}
                onKeyDown={handleKey}
                onFocus={(e) => { e.target.style.borderColor="rgba(82,183,136,.6)"; }}
                onBlur={(e)  => { e.target.style.borderColor="rgba(45,106,79,.3)"; }}
              />
              <button style={S.send(!!input.trim() && !loading)}
                onClick={() => sendMessage()} disabled={!input.trim() || loading} aria-label="Send">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke={input.trim() && !loading ? "#95d5b2" : "rgba(82,183,136,.3)"}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ── CONFIRM SCREEN ── */}
        {screen === "confirm" && orderData && (
          <ConfirmScreen
            data={orderData}
            recommendation={aiRec}
            onPay={() => {}}
            onBack={() => setScreen("chat")}
          />
        )}

        <div style={S.foot}>Zanmadin AI · 🔒 Secure · Powered by Groq</div>
      </div>

      {/* ── Launcher ── */}
      <button ref={launcherRef}
        style={{ ...S.launcher(open), opacity:0 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close" : "Chat with Zana"}>
        {!open && <div style={S.pulse}/>}
        {unread > 0 && !open && <div style={S.badge}>{unread}</div>}
        <span style={{ fontSize:22, transition:"all .3s", transform: open ? "rotate(90deg)" : "none", display:"block" }}>
          {open ? "✕" : "💬"}
        </span>
      </button>
    </>
  );
}