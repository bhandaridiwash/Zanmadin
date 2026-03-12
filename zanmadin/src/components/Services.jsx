// ══════════════════════════════════════════════
// Services.jsx — GSAP ScrollTrigger | Warm White
// ══════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "../data";
import "../styles/Services.css";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const [hovered, setHovered] = useState(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header */
      gsap.fromTo(headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" }
        }
      );

      /* Cards stagger */
      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0, scale: 0.93 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: { amount: 0.5, grid: [2, 3], from: "start" },
          duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current[0], start: "top 80%", toggleActions: "play none none none" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="services">
      <div className="container">
        <div ref={headerRef} className="center">
          <span className="sec-label">What We Do</span>
          <h2 className="sec-title">Every Celebration, Perfected</h2>
          <p className="sec-sub">From intimate romance to grand surprises — we design every moment with heart.</p>
          <div className="sec-bar" />
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="srv-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="srv-glow"
                style={{ background: `radial-gradient(ellipse 80% 80% at 0% 0%, ${s.color}, transparent 70%)` }}
              />
              <div className="srv-icon-wrap"
                style={{ background: hovered === i ? s.color : "var(--green-light)" }}
              >
                {s.icon}
                <span className="srv-num">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="srv-title">{s.title}</h3>
              <p className="srv-desc">{s.desc}</p>
              <div className="srv-arrow">Learn more <span>→</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
