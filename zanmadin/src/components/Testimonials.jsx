// ══════════════════════════════════════════════
// Testimonials.jsx — GSAP | Velvety Midnight
// ══════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "../data";
import "../styles/Testimonials.css";

gsap.registerPlugin(ScrollTrigger);

const STAT_DATA = [
  { val:"500+", lbl:"Surprises Delivered" },
  { val:"4.9★", lbl:"Average Rating"      },
  { val:"3+",   lbl:"Years of Joy"         },
  { val:"100%", lbl:"Hearts Touched"       },
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef([]);
  const statsRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" }
        }
      );

      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0, rotateX: 10 },
        {
          y: 0, opacity: 1, rotateX: 0,
          stagger: 0.15, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current[0], start: "top 80%", toggleActions: "play none none none" }
        }
      );

      if (statsRef.current) {
        gsap.fromTo([...statsRef.current.children],
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.4)",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none" }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="testimonials">
      <div className="tes-bg">
        <div className="tes-bg-c1" />
        <div className="tes-bg-c2" />
        <div className="tes-bg-dots" />
      </div>

      <div className="container">
        <div ref={headerRef} className="center" style={{ position:"relative", zIndex:2 }}>
          <span className="sec-label">Client Love</span>
          <h2 className="sec-title light">They Trusted Us With Their Heart</h2>
          <p className="sec-sub" style={{ color:"rgba(255,255,255,0.55)", margin:"14px auto 0" }}>
            Real stories. Real moments. Real tears of joy.
          </p>
          <div className="sec-bar" />
        </div>

        <div className="tes-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className={`tes-card${i === activeIdx ? " active-card" : ""}`}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <div className="tes-quote-mark">"</div>
              <div className="tes-stars">{"★".repeat(t.stars)}</div>
              <p className="tes-text">"{t.text}"</p>
              <div className="tes-author">
                <span className="tes-avatar">{t.avatar}</span>
                <div>
                  <div className="tes-name">{t.name}</div>
                  <div className="tes-location">📍 {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tes-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`tes-dot${i === activeIdx ? " active" : ""}`} onClick={() => setActiveIdx(i)} />
          ))}
        </div>

        <div ref={statsRef} className="tes-stats-row">
          {STAT_DATA.map(s => (
            <div key={s.lbl} className="tes-stat">
              <div className="tes-stat-val">{s.val}</div>
              <div className="tes-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
