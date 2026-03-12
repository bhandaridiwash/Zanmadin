// ══════════════════════════════════════════════
// CTABanner.jsx — GSAP | Vibrant Emerald
// ══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/CTABanner.css";

gsap.registerPlugin(ScrollTrigger);

const FLOAT_EMOJIS = [
  { e:"🎂", style:{ top:"12%",    left:"6%",   fontSize:"2.2rem", animationDelay:"0s"   }},
  { e:"🌹", style:{ top:"65%",    left:"4%",   fontSize:"1.6rem", animationDelay:"1s"   }},
  { e:"✨", style:{ top:"20%",    right:"8%",  fontSize:"1.4rem", animationDelay:"0.7s" }},
  { e:"🎁", style:{ bottom:"18%", right:"5%",  fontSize:"2rem",   animationDelay:"1.5s" }},
  { e:"💚", style:{ bottom:"10%", left:"12%",  fontSize:"1.3rem", animationDelay:"0.3s" }},
  { e:"⭐", style:{ top:"8%",     right:"20%", fontSize:"1.2rem", animationDelay:"1.2s" }},
];

export default function CTABanner({ onNav }) {
  const sectionRef = useRef(null);
  const tagRef     = useRef(null);
  const headRef    = useRef(null);
  const subRef     = useRef(null);
  const btnsRef    = useRef(null);
  const emojisRef  = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" }
      });

      tl.fromTo(emojisRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.6, stagger: 0.08, duration: 0.5, ease: "back.out(1.7)" }
      )
      .fromTo(tagRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.2"
      )
      .fromTo(headRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" },
        "-=0.3"
      )
      .fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(btnsRef.current.children,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 },
        "-=0.3"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cta-banner">
      <div className="cta-bg-el cta-bg-1" />
      <div className="cta-bg-el cta-bg-2" />
      <div className="cta-bg-el cta-bg-3" />
      <div className="cta-bg-el cta-bg-4" />
      <div className="cta-shimmer" />

      {FLOAT_EMOJIS.map((f, i) => (
        <span key={i} ref={el => emojisRef.current[i] = el} className="cta-emoji" style={f.style}>{f.e}</span>
      ))}

      <div className="cta-inner">
        <div ref={tagRef} className="cta-tag">🎉 Ready to create magic?</div>
        <h2 ref={headRef} className="cta-h">
          Let's Build a Moment<br />They'll Never Forget
        </h2>
        <p ref={subRef} className="cta-sub">
          Whether you're in Addis Ababa or on the other side of the world —
          Zanmadin makes every celebration extraordinary.
        </p>
        <div ref={btnsRef} className="cta-btns">
          <button className="btn-cta-white" onClick={() => onNav("Contact")}>✨ Plan a Surprise</button>
          <button className="btn-cta-outline" onClick={() => onNav("Gallery")}>View Our Work →</button>
        </div>
      </div>
    </section>
  );
}
