// // ══════════════════════════════════════════════
// // Contact.jsx — GSAP | WhatsApp AI Bot Integration
// // ══════════════════════════════════════════════
// import { useState, useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { CONTACT_INFO } from "../data";
// import "../styles/Contact.css";

// gsap.registerPlugin(ScrollTrigger);

// // ── Configuration ──────────────────────────────

// const WHATSAPP_PHONE = "9779862699667"; // 

// function buildWhatsAppURL(formData, formFilled) {
//   let text;

//   if (formFilled) {
//     // User already filled some form fields — carry that context into WhatsApp
//     const lines = [
//       `Hi Zanmadin! 🎉 I'd like to plan a celebration.`,
//       ``,
//       formData.name     ? `👤 *Name:* ${formData.name}`           : null,
//       formData.phone    ? `📞 *Contact:* ${formData.phone}`        : null,
//       formData.occasion ? `🎊 *Occasion:* ${formData.occasion}`    : null,
//       formData.message  ? `📝 *Details:* ${formData.message}`      : null,
//       ``,
//       `Please help me make this moment unforgettable! ✨`,
//     ].filter(line => line !== null);

//     text = lines.join("\n");
//   } else {
//     // Fresh start — bot-friendly opener that kicks off the guided flow
//     text = [
//       `Hi Zanmadin! 🎉`,
//       ``,
//       `I'd like to plan a special surprise for someone I love.`,
//       `Can you help me get started?`,
//     ].join("\n");
//   }

//   return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
// }

// // ── Quick-reply chips shown above the WhatsApp button ─────────────────────────
// const QUICK_CHIPS = [
//   { label: "🎂 Birthday Surprise",    text: "Hi Zanmadin! I want to plan a *Birthday Surprise* 🎂. Can you guide me through the options?" },
//   { label: "🌹 Romantic Evening",     text: "Hi Zanmadin! I'm planning a *Romantic Evening* 🌹 for my partner. What can you help me set up?" },
//   { label: "🌍 Send Gift Abroad",     text: "Hi Zanmadin! I live abroad and want to *send a surprise gift* 🌍 to my loved one back home. How does it work?" },
//   { label: "💍 Proposal Setup",       text: "Hi Zanmadin! I'm planning a *marriage proposal* 💍. I need help making it absolutely perfect!" },
//   { label: "🎉 Office Celebration",   text: "Hi Zanmadin! I'd like to arrange an *Office Celebration* 🎉. Can you tell me about your packages?" },
//   { label: "✨ Custom Experience",    text: "Hi Zanmadin! I have a unique idea and need a *Custom Experience* ✨ planned. Can we talk?" },
// ];

// export default function Contact() {
//   const [sent,       setSent]       = useState(false);
//   const [form,       setForm]       = useState({ name: "", phone: "", occasion: "", message: "" });
//   const [chipHover,  setChipHover]  = useState(null);

//   const sectionRef = useRef(null);
//   const headerRef  = useRef(null);
//   const infoRef    = useRef(null);
//   const formRef    = useRef(null);
//   const chipsRef   = useRef(null);

//   // ── Check if the user has meaningfully filled the form ──────────────────────
//   const formFilled = !!(form.name.trim() || form.occasion || form.message.trim());

//   // ── Open WhatsApp with context-aware message ─────────────────────────────────
//   const openWhatsApp = (customText = null) => {
//     const url = customText
//       ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(customText)}`
//       : buildWhatsAppURL(form, formFilled);
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSent(true);
//     // After a short delay, redirect to WhatsApp carrying the full form context
//     setTimeout(() => openWhatsApp(), 1200);
//   };

//   const handleChange = (field, val) =>
//     setForm(f => ({ ...f, [field]: val }));

//   // ── GSAP animations ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(headerRef.current,
//         { y: 40, opacity: 0 },
//         {
//           y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
//           scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" },
//         }
//       );
//       gsap.fromTo(infoRef.current,
//         { x: -60, opacity: 0 },
//         {
//           x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
//           scrollTrigger: { trigger: infoRef.current, start: "top 75%", toggleActions: "play none none none" },
//         }
//       );
//       gsap.fromTo(formRef.current,
//         { x: 60, opacity: 0, scale: 0.97 },
//         {
//           x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out",
//           scrollTrigger: { trigger: formRef.current, start: "top 75%", toggleActions: "play none none none" },
//         }
//       );
//       // Stagger the quick-reply chips
//       if (chipsRef.current) {
//         gsap.fromTo(
//           chipsRef.current.querySelectorAll(".wa-chip"),
//           { y: 20, opacity: 0 },
//           {
//             y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
//             stagger: 0.07,
//             scrollTrigger: { trigger: chipsRef.current, start: "top 85%", toggleActions: "play none none none" },
//           }
//         );
//       }
//     }, sectionRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} id="contact" className="contact">
//       <div className="container">

//         {/* ── Section Header ── */}
//         <div ref={headerRef}>
//           <span className="sec-label">Get In Touch</span>
//           <h2 className="sec-title">Let's Plan Something Beautiful</h2>
//           <div className="sec-bar" />
//         </div>

//         {/* ── Quick-reply chips ── */}
//         <div ref={chipsRef} className="wa-chips-section">
//           <p className="wa-chips-label">
//             💬 <strong>Start instantly on WhatsApp</strong> — tap what fits your occasion:
//           </p>
//           <div className="wa-chips">
//             {QUICK_CHIPS.map((chip, i) => (
//               <button
//                 key={i}
//                 className={`wa-chip ${chipHover === i ? "wa-chip--hover" : ""}`}
//                 onMouseEnter={() => setChipHover(i)}
//                 onMouseLeave={() => setChipHover(null)}
//                 onClick={() => openWhatsApp(chip.text)}
//                 type="button"
//                 aria-label={`Open WhatsApp for ${chip.label}`}
//               >
//                 {chip.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Main Grid ── */}
//         <div className="contact-grid">

//           {/* ── Info column ── */}
//           <div ref={infoRef}>
//             <p className="contact-intro">
//               Tell us about your loved one, the occasion, and your budget.
//               We'll take it from there — from concept to tears of joy.
//             </p>

//             <div className="contact-info-list">
//               {CONTACT_INFO.map((c, i) => (
//                 <div key={i} className="contact-info-card">
//                   <div className="contact-info-icon">{c.icon}</div>
//                   <div>
//                     <div className="contact-info-lbl">{c.label}</div>
//                     <div className="contact-info-val">{c.value}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ── WhatsApp CTA ── */}
//             <div className="whatsapp-cta-wrap">
//               <button
//                 className="whatsapp-btn"
//                 onClick={() => openWhatsApp()}
//                 type="button"
//               >
//                 <span className="whatsapp-btn-icon">
//                   {/* Official WhatsApp SVG icon */}
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
//                   </svg>
//                 </span>
//                 <span>
//                   {formFilled
//                     ? "Continue on WhatsApp with my details →"
//                     : "Chat on WhatsApp"}
//                 </span>
//               </button>

//               {/* Subtle helper text */}
//               {formFilled && (
//                 <p className="whatsapp-carry-hint">
//                   🔗 Your form details will be pre-filled in the message so our team picks up right where you left off.
//                 </p>
//               )}
//             </div>

//             {/* ── "How the bot works" mini-explainer ── */}
//             {/* <div className="bot-explainer">
//               <div className="bot-explainer-title">🤖 How our WhatsApp assistant works</div>
//               <ol className="bot-steps">
//                 <li>You send a message (or tap a chip above)</li>
//                 <li>Our AI asks a few friendly questions about your event</li>
//                 <li>It collects date, budget, recipient details &amp; preferences</li>
//                 <li>A Zanmadin team member reviews &amp; confirms within 2 hrs</li>
//                 <li>We handle <em>everything</em> — you just show up for the moment</li>
//               </ol>
//             </div> */}
//           </div>

//           {/* ── Form column ── */}
//           <div ref={formRef} className="contact-form-wrap">
//             <div className="contact-form-title">Send a Message</div>
//             <div className="contact-form-sub">
//               Or fill this form — we'll open WhatsApp with your details ready.
//             </div>

//             {sent ? (
//               <div className="form-success">
//                 <div className="form-success-icon">🎉</div>
//                 <div className="form-success-text">
//                   Wonderful! Opening WhatsApp now so we can start planning your surprise together.
//                 </div>
//                 <button
//                   className="form-success-fallback"
//                   onClick={() => openWhatsApp()}
//                   type="button"
//                 >
//                   Open WhatsApp manually →
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} noValidate>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label className="form-label">Your Name *</label>
//                     <input
//                       className="form-input"
//                       placeholder="Ramesh Thapa"
//                       required
//                       value={form.name}
//                       onChange={e => handleChange("name", e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Phone / WhatsApp *</label>
//                     <input
//                       className="form-input"
//                       placeholder="+9779862699667"
//                       required
//                       value={form.phone}
//                       onChange={e => handleChange("phone", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Occasion Type</label>
//                   <select
//                     className="form-select"
//                     value={form.occasion}
//                     onChange={e => handleChange("occasion", e.target.value)}
//                   >
//                     <option value="">Select an occasion...</option>
//                     <option>🎂 Birthday Surprise</option>
//                     <option>🌹 Romantic Evening</option>
//                     <option>🌍 Diaspora Gift Delivery</option>
//                     <option>💍 Proposal Setup</option>
//                     <option>🎉 Event Space</option>
//                     <option>✨ Full Experience</option>
//                     <option>Other</option>
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Tell Us More</label>
//                   <textarea
//                     className="form-textarea"
//                     placeholder="Describe the moment you want to create — who it's for, the date, any special details..."
//                     value={form.message}
//                     onChange={e => handleChange("message", e.target.value)}
//                   />
//                 </div>

//                 {/* Dynamic CTA changes label once the user starts filling fields */}
//                 <button type="submit" className="form-submit">
//                   {formFilled
//                     ? "✨ Send & Open WhatsApp →"
//                     : "✨ Send My Request"}
//                 </button>

//                 <p className="form-footer-note">
//                   By submitting, you'll be redirected to WhatsApp to continue the conversation with our AI assistant.
//                 </p>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// ══════════════════════════════════════════════
// Contact.jsx — GSAP | WhatsApp AI Bot Integration
// ══════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_INFO } from "../data";
import "../styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

// ✅ FIX: wa.me requires digits ONLY — no dashes, no spaces
// Wrong:  "977-9862699667"
// Right:  "9779862699667"
const WHATSAPP_PHONE = "9779862699667";

function buildWhatsAppURL(formData, formFilled) {
  let text;
  if (formFilled) {
    const lines = [
      `Hi Zanmadin! 🎉 I'd like to plan a celebration.`,
      ``,
      formData.name     ? `👤 *Name:* ${formData.name}`        : null,
      formData.phone    ? `📞 *Contact:* ${formData.phone}`     : null,
      formData.occasion ? `🎊 *Occasion:* ${formData.occasion}` : null,
      formData.message  ? `📝 *Details:* ${formData.message}`   : null,
      ``,
      `Please help me make this moment unforgettable! ✨`,
    ].filter(Boolean);
    text = lines.join("\n");
  } else {
    text = [
      `Hi Zanmadin! 🎉`,
      ``,
      `I'd like to plan a special surprise for someone I love.`,
      `Can you help me get started?`,
    ].join("\n");
  }
  // ✅ Always encodeURIComponent the text
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

const QUICK_CHIPS = [
  { label: "🎂 Birthday Surprise",  text: "Hi Zanmadin! I want to plan a *Birthday Surprise* 🎂. Can you guide me through the options?" },
  { label: "🌹 Romantic Evening",   text: "Hi Zanmadin! I'm planning a *Romantic Evening* 🌹 for my partner. What can you help me set up?" },
  { label: "🌍 Send Gift Abroad",   text: "Hi Zanmadin! I live abroad and want to *send a surprise gift* 🌍 to my loved one back home. How does it work?" },
  { label: "💍 Proposal Setup",     text: "Hi Zanmadin! I'm planning a *marriage proposal* 💍. I need help making it absolutely perfect!" },
  { label: "🎉 Office Celebration", text: "Hi Zanmadin! I'd like to arrange an *Office Celebration* 🎉. Can you tell me about your packages?" },
  { label: "✨ Custom Experience",  text: "Hi Zanmadin! I have a unique idea and need a *Custom Experience* ✨ planned. Can we talk?" },
];

export default function Contact() {
  const [sent,      setSent]      = useState(false);
  const [form,      setForm]      = useState({ name: "", phone: "", occasion: "", message: "" });
  const [chipHover, setChipHover] = useState(null);

  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const infoRef    = useRef(null);
  const formRef    = useRef(null);
  const chipsRef   = useRef(null);

  const formFilled = !!(form.name.trim() || form.occasion || form.message.trim());

  const openWhatsApp = (customText = null) => {
    const url = customText
      ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(customText)}`
      : buildWhatsAppURL(form, formFilled);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => openWhatsApp(), 1200);
  };

  const handleChange = (field, val) =>
    setForm(f => ({ ...f, [field]: val }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(infoRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: infoRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(formRef.current,
        { x: 60, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: formRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );
      if (chipsRef.current) {
        gsap.fromTo(chipsRef.current.querySelectorAll(".wa-chip"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.07,
            scrollTrigger: { trigger: chipsRef.current, start: "top 85%", toggleActions: "play none none none" } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div className="container">

        <div ref={headerRef}>
          <span className="sec-label">Get In Touch</span>
          <h2 className="sec-title">Let's Plan Something Beautiful</h2>
          <div className="sec-bar" />
        </div>

        <div ref={chipsRef} className="wa-chips-section">
          <p className="wa-chips-label">
            💬 <strong>Start instantly on WhatsApp</strong> — tap what fits your occasion:
          </p>
          <div className="wa-chips">
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={i}
                className={`wa-chip ${chipHover === i ? "wa-chip--hover" : ""}`}
                onMouseEnter={() => setChipHover(i)}
                onMouseLeave={() => setChipHover(null)}
                onClick={() => openWhatsApp(chip.text)}
                type="button"
                aria-label={`Open WhatsApp for ${chip.label}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="contact-grid">

          <div ref={infoRef}>
            <p className="contact-intro">
              Tell us about your loved one, the occasion, and your budget.
              We'll take it from there — from concept to tears of joy.
            </p>

            <div className="contact-info-list">
              {CONTACT_INFO.map((c, i) => (
                <div key={i} className="contact-info-card">
                  <div className="contact-info-icon">{c.icon}</div>
                  <div>
                    <div className="contact-info-lbl">{c.label}</div>
                    <div className="contact-info-val">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="whatsapp-cta-wrap">
              <button className="whatsapp-btn" onClick={() => openWhatsApp()} type="button">
                <span className="whatsapp-btn-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </span>
                <span>{formFilled ? "Continue on WhatsApp with my details →" : "Chat on WhatsApp"}</span>
              </button>
              {formFilled && (
                <p className="whatsapp-carry-hint">
                  🔗 Your form details will be pre-filled in the message so our team picks up right where you left off.
                </p>
              )}
            </div>
          </div>

          <div ref={formRef} className="contact-form-wrap">
            <div className="contact-form-title">Send a Message</div>
            <div className="contact-form-sub">
              Or fill this form — we'll open WhatsApp with your details ready.
            </div>

            {sent ? (
              <div className="form-success">
                <div className="form-success-icon">🎉</div>
                <div className="form-success-text">
                  Wonderful! Opening WhatsApp now so we can start planning your surprise together.
                </div>
                <button className="form-success-fallback" onClick={() => openWhatsApp()} type="button">
                  Open WhatsApp manually →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" placeholder="Ramesh Thapa" required
                      value={form.name} onChange={e => handleChange("name", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input className="form-input" placeholder="+977-9862699667" required
                      value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Occasion Type</label>
                  <select className="form-select" value={form.occasion}
                    onChange={e => handleChange("occasion", e.target.value)}>
                    <option value="">Select an occasion...</option>
                    <option>🎂 Birthday Surprise</option>
                    <option>🌹 Romantic Evening</option>
                    <option>🌍 Diaspora Gift Delivery</option>
                    <option>💍 Proposal Setup</option>
                    <option>🎉 Event Space</option>
                    <option>✨ Full Experience</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tell Us More</label>
                  <textarea className="form-textarea"
                    placeholder="Describe the moment you want to create — who it's for, the date, any special details..."
                    value={form.message} onChange={e => handleChange("message", e.target.value)} />
                </div>

                <button type="submit" className="form-submit">
                  {formFilled ? "✨ Send & Open WhatsApp →" : "✨ Send My Request"}
                </button>

                <p className="form-footer-note">
                  By submitting, you'll be redirected to WhatsApp to continue the conversation with our AI assistant.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}