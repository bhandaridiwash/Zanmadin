// ══════════════════════════════════════════════
// Hero.jsx — GSAP Enhanced | Deep Midnight
// ══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import logo from "../assets/logo.png";
import { STATS } from "../data";
import "../styles/Hero.css";

const TAGS = ["🎂 Birthdays", "🌹 Romance", "🌍 Diaspora", "🎉 Events"];

const SPARKS = [
  { w:8,  h:8,  top:"15%", left:"20%",  delay:"0s"   },
  { w:5,  h:5,  top:"75%", left:"18%",  delay:"0.8s" },
  { w:6,  h:6,  top:"20%", right:"18%", delay:"1.4s" },
  { w:10, h:10, top:"65%", right:"15%", delay:"0.5s" },
];

export default function Hero({ onNav }) {
  const sectionRef = useRef(null);
  const badgesRef = useRef([]);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);
  const statsRef = useRef([]);
  const visualRef = useRef(null);
  const chipsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.5 });

      /* Badges stagger */
      tl.fromTo(badgesRef.current,
        { y: 20, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6 }
      )
      /* Headline word-by-word feel */
      .fromTo(headlineRef.current,
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.9, ease: "expo.out" },
        "-=0.2"
      )
      /* Sub text */
      .fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      )
      /* Buttons */
      .fromTo(btnsRef.current?.children ? [...btnsRef.current.children] : [],
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 },
        "-=0.3"
      )
      /* Stats */
      .fromTo(statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        "-=0.2"
      )
      /* Visual */
      .fromTo(visualRef.current,
        { x: 80, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "expo.out" },
        0.6
      )
      /* Chips */
      .fromTo(chipsRef.current,
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, stagger: 0.15, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.4"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-grid-pattern" />
        <div className="hero-noise" />
        <div className="hero-bg-circle hero-bg-c1" />
        <div className="hero-bg-circle hero-bg-c2" />
        <div className="hero-bg-circle hero-bg-c3" />
      </div>

      <div className="hero-inner">
        {/* ── Left ── */}
        <div>
          <div className="hero-badge-row">
            {TAGS.map((t, i) => (
              <span key={t} ref={el => badgesRef.current[i] = el} className="hero-badge">{t}</span>
            ))}
          </div>

          <h1 ref={headlineRef} className="hero-headline">
            We Craft
            <em>Unforgettable</em>
            Moments.
          </h1>

          <p ref={subRef} className="hero-sub">
            Busy at work? Living abroad? No space or ideas?<br />
            Zanmadin transforms ordinary days into extraordinary memories
            for the people you love most.
          </p>

          <div ref={btnsRef} className="hero-btns">
            <button className="btn btn-gold btn-lg" onClick={() => onNav("Contact")}>
              ✨ Plan a Surprise
            </button>
            <button className="btn btn-ghost-white btn-lg" onClick={() => onNav("Services")}>
              Our Services →
            </button>
          </div>

          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div key={s.label} ref={el => statsRef.current[i] = el} className="hero-stat">
                <span className="hero-stat-val">{s.value}</span>
                <span className="hero-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Visual ── */}
        <div ref={visualRef} className="hero-visual">
          <div className="hero-ring hero-ring-1" />
          <div className="hero-ring hero-ring-2" />
          <div className="hero-ring hero-ring-3" />

          {SPARKS.map((s, i) => (
            <div key={i} className="hero-spark" style={{
              width: s.w, height: s.h,
              top: s.top, left: s.left, right: s.right,
              animationDelay: s.delay,
            }} />
          ))}

          <img src={logo} alt="Zanmadin" className="hero-logo" />

          <div ref={el => chipsRef.current[0] = el} className="hero-chip"
            style={{ top:"6%", right:"-4%", animationDelay:"0.5s" }}>
            <div className="hero-chip-val">500+</div>
            <div className="hero-chip-lbl">Smiles Created</div>
          </div>
          <div ref={el => chipsRef.current[1] = el} className="hero-chip hero-chip-gold"
            style={{ bottom:"12%", left:"-6%", animationDelay:"1.2s" }}>
            <div className="hero-chip-val">⭐ 4.9</div>
            <div className="hero-chip-lbl">Client Rating</div>
          </div>
          <div ref={el => chipsRef.current[2] = el} className="hero-chip hero-chip-dark"
            style={{ bottom:"38%", right:"-12%", animationDelay:"0.9s" }}>
            <div className="hero-chip-val">🌍 Diaspora Ready</div>
            <div className="hero-chip-lbl">Worldwide delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}
