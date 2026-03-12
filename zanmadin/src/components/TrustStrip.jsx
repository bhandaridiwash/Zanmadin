// ══════════════════════════════════════════════
// TrustStrip.jsx — Warm Ivory Scrolling Strip
// ══════════════════════════════════════════════
import { TRUST_ITEMS } from "../data";
import "../styles/TrustStrip.css";

export default function TrustStrip() {
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS];
  return (
    <div className="trust">
      <div className="trust-track">
        <div className="trust-items-wrap">
          {doubled.map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <span className="trust-text">{item.text}</span>
              {i < doubled.length - 1 && <span className="trust-dot" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
