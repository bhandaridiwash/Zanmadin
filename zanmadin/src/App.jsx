// ══════════════════════════════════════════════
// App.jsx — Zanmadin Root + GSAP Page Loader
// ══════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import TrustStrip   from "./components/TrustStrip";
import Services     from "./components/Services";
import About        from "./components/About";
import Gallery      from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import CTABanner    from "./components/CTABanner";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";
import BotFlow      from "./components/BotFlow";

/* ── Page Loader ── */
function Loader({ done }) {
  const loaderRef = useRef(null);
  const barRef    = useRef(null);
  const textRef   = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: "power2.inOut", transformOrigin: "left" }
    )
    .fromTo(textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.2
    )
    .to(loaderRef.current,
      { yPercent: -100, duration: 0.8, ease: "expo.inOut", delay: 0.1 },
      ">"
    )
    .call(done, [], "<0.4");
  }, [done]);

  return (
    <div ref={loaderRef} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#050d18",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:24,
    }}>
      <div ref={textRef} style={{
        fontFamily:"'Cormorant Garamond', serif",
        fontSize:"2rem", color:"#fff", letterSpacing:"6px", fontWeight:700,
      }}>
        ZANMADIN
      </div>
      <div style={{ width:200, height:2, background:"rgba(255,255,255,0.1)", borderRadius:2, overflow:"hidden" }}>
        <div ref={barRef} style={{
          height:"100%", width:"100%",
          background:"linear-gradient(90deg, #c9a227, #f0d878)",
          transformOrigin:"left", transform:"scaleX(0)",
        }} />
      </div>
      <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.3)", letterSpacing:"3px", textTransform:"uppercase" }}>
        Celebrate Beautifully
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav]   = useState("Home");
  const [showLoader, setShowLoader] = useState(true);

  const handleNav = (section) => {
    setActiveNav(section);
    const el = document.getElementById(section.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {showLoader && <Loader done={() => setShowLoader(false)} />}
      <Navbar       active={activeNav}  onNav={handleNav} />
      <Hero                             onNav={handleNav} />
      <TrustStrip />
      <Services />
      <About />
      <Gallery />
      <Testimonials />
      <CTABanner                        onNav={handleNav} />
      <Contact />
      <Footer                           onNav={handleNav} />
      <BotFlow />
    </div>
  );
}
