// ══════════════════════════════════════════════
// Navbar.jsx — GSAP Enhanced | Midnight Navy
// ══════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import logo from "../assets/logo.png";
import { NAV_LINKS } from "../data";
import "../styles/Navbar.css";

export default function Navbar({ active, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const ctaRef = useRef(null);
  const brandRef = useRef(null);

  /* ── Mount animation ── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(brandRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(linksRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
      "-=0.3"
    )
    .fromTo(ctaRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      "-=0.2"
    );
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleNav = (link) => {
    onNav(link);
    setMenuOpen(false);
  };

  return (
    <>
      <nav ref={navRef} className={`znav${scrolled ? " scrolled" : ""}`}>
        <div ref={brandRef} className="znav-brand" onClick={() => handleNav("Home")}>
          <div className="znav-logo-wrap">
            <img src={logo} alt="Zanmadin Logo" className="znav-logo" />
          </div>
          <div className="znav-brand-text">
            <div className="znav-name">ZANMADIN</div>
            <div className="znav-tagline">Celebrate Beautifully</div>
          </div>
        </div>

        <div className="znav-links">
          {NAV_LINKS.map((link, i) => (
            <span
              key={link}
              ref={el => linksRef.current[i] = el}
              className={`znav-link${active === link ? " active" : ""}`}
              onClick={() => handleNav(link)}
            >
              {link}
            </span>
          ))}
          <button ref={ctaRef} className="znav-cta" onClick={() => handleNav("Contact")}>
            ✨ Plan a Surprise
          </button>
        </div>

        <button
          className="znav-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? "translateX(8px)" : "none" }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="znav-drawer">
          {NAV_LINKS.map(link => (
            <div
              key={link}
              className={`znav-drawer-link${active === link ? " active" : ""}`}
              onClick={() => handleNav(link)}
            >
              {link}
            </div>
          ))}
          <button className="znav-cta" onClick={() => handleNav("Contact")}>
            ✨ Plan a Surprise
          </button>
        </div>
      )}
    </>
  );
}
