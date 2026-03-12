// ══════════════════════════════════════════════
// About.jsx — GSAP ScrollTrigger | Deep Forest
// ══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const TAGS = ["🎂 Birthday Magic","🌹 Romantic Evenings","🌍 Diaspora Delivery","🎉 Events & Spaces","💼 Corporate Friendly"];

export default function About() {
  const sectionRef = useRef(null);
  const visualRef  = useRef(null);
  const bodyRef    = useRef(null);
  const pillsRef   = useRef([]);
  const bubblesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Visual */
      gsap.fromTo(visualRef.current,
        { x: -80, opacity: 0, scale: 0.92 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" }
        }
      );

      /* Text block */
      gsap.fromTo(bodyRef.current.children,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 75%", toggleActions: "play none none none" }
        }
      );

      /* Pills */
      gsap.fromTo(pillsRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, stagger: 0.06, duration: 0.4, ease: "back.out(2)",
          scrollTrigger: { trigger: pillsRef.current[0], start: "top 85%", toggleActions: "play none none none" }
        }
      );

      /* Stat bubbles pop */
      gsap.fromTo(bubblesRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, stagger: 0.2, duration: 0.5, ease: "back.out(2)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about">
      <div className="container">
        <div className="about-grid">

          {/* ── Visual ── */}
          <div ref={visualRef} className="about-visual">
            <div className="about-blob" />
            <div className="about-main-card">
              <div className="about-main-card-emoji">🎉</div>
              <div className="about-main-card-text">Creating Magic Since 2021</div>
            </div>
            <div className="about-side-card">
              <div className="about-side-card-emoji">🌹</div>
              <div className="about-side-card-text">With Love</div>
            </div>
            <div ref={el => bubblesRef.current[0] = el}
              className="about-stat-bubble" style={{ top:"62%", left:"10px", animationDelay:"0.7s" }}>
              <div className="about-sb-val">500+</div>
              <div className="about-sb-lbl">Happy Clients</div>
            </div>
            <div ref={el => bubblesRef.current[1] = el}
              className="about-stat-bubble" style={{ top:"50%", right:"-20px", animationDelay:"1.3s" }}>
              <div className="about-sb-val" style={{ color:"var(--gold)" }}>4.9 ⭐</div>
              <div className="about-sb-lbl">Avg Rating</div>
            </div>
          </div>

          {/* ── Text ── */}
          <div ref={bodyRef} className="about-body">
            <span className="sec-label">Our Story</span>
            <h2 className="sec-title">Born From a<br />Missed Birthday</h2>
            <div className="sec-bar" style={{ marginBottom:28 }} />
            <p>
              Zanmadin was founded when our founder, living abroad, couldn't be there for her mother's milestone birthday.
              She wanted more than a gift — she wanted <em>a moment</em>. Unable to find anyone to create it, she built the service herself.
            </p>
            <p>
              Today, we are Addis Ababa's premier surprise experience company — trusted by busy professionals, diaspora families,
              and romantic partners who want to say <em>"I love you"</em> in the most unforgettable way possible.
            </p>
            <div className="about-pills">
              {TAGS.map((t, i) => (
                <span key={t} ref={el => pillsRef.current[i] = el} className="about-pill">{t}</span>
              ))}
            </div>
            <div className="about-btns">
              <button className="btn btn-green btn-lg"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior:"smooth" })}>
                Explore Services →
              </button>
              <button className="btn btn-outline btn-lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}>
                Contact Us
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
