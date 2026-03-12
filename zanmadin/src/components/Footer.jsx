// ══════════════════════════════════════════════
// Footer.jsx — GSAP | Near-Black Slate
// ══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/logo.png";
import { NAV_LINKS, CONTACT_INFO } from "../data";
import "../styles/Footer.css";

gsap.registerPlugin(ScrollTrigger);

const SERVICES_LIST = ["Birthday Surprises", "Romantic Setups", "Diaspora Delivery", "Event Spaces", "Office Planning"];
const SOCIALS = ["📘", "📸", "▶️", "💬"];

export default function Footer({ onNav }) {
  const footerRef = useRef(null);
  const nlRef     = useRef(null);
  const gridRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(nlRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: nlRef.current, start: "top 90%", toggleActions: "play none none none" }
        }
      );

      gsap.fromTo([...gridRef.current.children],
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 90%", toggleActions: "play none none none" }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-bg" />
      <div className="footer-bg-blob" />

      <div className="container footer-inner">
        {/* Newsletter */}
        <div ref={nlRef} className="footer-newsletter">
          <div className="footer-nl-text">
            <div className="footer-nl-title">🎁 Get Surprise Ideas & Offers</div>
            <div className="footer-nl-sub">Join our list for celebration tips & exclusive deals.</div>
          </div>
          <div className="footer-nl-form">
            <input className="footer-nl-input" placeholder="your@email.com" type="email" />
            <button className="footer-nl-btn">Subscribe →</button>
          </div>
        </div>

        {/* Main grid */}
        <div ref={gridRef} className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-row" onClick={() => onNav("Home")}>
              <img src={logo} alt="Zanmadin" className="footer-logo" />
              <div>
                <div className="footer-brand-name">
                  <div className="znav-name">ZANMADIN</div>
                </div>
                <div className="footer-brand-tag">Celebrate Beautifully</div>
              </div>
            </div>
            <p className="footer-desc">
              Zanmadin delivers gifts and organizes surprise experiences in Addis Ababa, helping families, friends and loved ones, near and far create emotional, memorable moments since 2021.
            </p>
            <div className="footer-socials">
              {SOCIALS.map((icon, i) => (
                <div key={i} className="footer-social">{icon}</div>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="footer-col-title">Navigate</div>
            {NAV_LINKS.map(link => (
              <div key={link} className="footer-link" onClick={() => onNav(link)}>
                <span className="footer-link-dot" />{link}
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <div className="footer-col-title">Services</div>
            {SERVICES_LIST.map(s => (
              <div key={s} className="footer-link">
                <span className="footer-link-dot" />{s}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>
            {CONTACT_INFO.map((c, i) => (
              <div key={i} className="footer-contact-item">
                <span className="footer-contact-icon">{c.icon}</span>
                <span>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} Zanmadin · Made for <span className="footer-heart">💚</span> One
          </div>
          <div className="footer-bottom-links">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <span key={l} className="footer-bottom-link">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
