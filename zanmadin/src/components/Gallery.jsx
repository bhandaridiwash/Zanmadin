// ══════════════════════════════════════════════
// Gallery.jsx — GSAP ScrollTrigger | Rich Charcoal
// ══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY } from "../data";
import "../styles/Gallery.css";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef([]);
  const ctaRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header */
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" }
        }
      );

      /* Cards — each from different direction */
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const fromX = i % 2 === 0 ? -40 : 40;
        gsap.fromTo(card,
          { opacity: 0, y: 40, x: fromX, scale: 0.94, rotateZ: i % 2 === 0 ? -2 : 2 },
          {
            opacity: 1, y: 0, x: 0, scale: 1, rotateZ: 0,
            duration: 0.7, ease: "power3.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" }
          }
        );
      });

      /* CTA */
      gsap.fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 90%", toggleActions: "play none none none" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="gallery">
      <div className="container">
        <div ref={headerRef} className="center">
          <span className="sec-label">Our Work</span>
          <h2 className="sec-title">A Gallery of Emotions</h2>
          <p className="sec-sub">Each setup is a story. Every detail, hand-crafted with love.</p>
          <div className="sec-bar" />
        </div>

        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className={`gal-card${i === 0 ? " large" : ""}`}
              style={{ background: g.grad }}
            >
              <div className="gal-overlay" />
              <div className="gal-spot">✨ Featured</div>
              <span className="gal-emoji">{g.emoji}</span>
              <span className="gal-label">{g.label}</span>
              <span className="gal-hover-label">View Setup →</span>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="gallery-cta">
          <button className="btn btn-green btn-lg"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}>
            📸 Get Your Own Setup
          </button>
        </div>
      </div>
    </section>
  );
}
