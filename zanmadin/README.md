# Zanmadin — GSAP Enhanced Website

## 🚀 What's New

### GSAP Animations Added
- **Page Loader** — Branded curtain loader with gold progress bar on every visit
- **Navbar** — Slides down with staggered link reveal on page load
- **Hero** — Dramatic entrance: badges stagger in, headline skews up, visual slides from right, floating chips pop in with spring
- **Services** — Cards animate in a 2×3 grid wave pattern on scroll
- **About** — Visual slides from left, text cascades from right simultaneously on scroll
- **Gallery** — Cards fan in from alternating directions with subtle rotation
- **Testimonials** — Cards flip up with 3D tilt on scroll entry
- **CTA Banner** — Emojis pop in, then headline/text/buttons cascade
- **Contact** — Info panel slides from left, form panel slides from right
- **Footer** — Columns stagger up on scroll

### Section Color Palette
| Section | Theme |
|---|---|
| Navbar | Deep midnight navy `#0a0f1e` |
| Hero | Midnight-to-forest gradient |
| Trust Strip | Warm ivory `#fdf8ee` |
| Services | Soft cream `#f8f5f0` |
| About | Deep forest `#0c1f0f` |
| Gallery | Rich charcoal `#111820` |
| Testimonials | Velvety midnight |
| CTA Banner | Vibrant emerald |
| Contact | Warm cream `#faf6ef` |
| Footer | Near-black slate `#080c12` |

### Typography Updated
- Display: **Cormorant Garamond** (elegant serif)
- Body: **DM Sans** (clean, modern)

---

## 📦 Installation

### 1. Install GSAP
```bash
npm install gsap
```

### 2. Copy Files
Replace your existing files with the new versions from this package:

**CSS files** → copy to `src/styles/`:
- `index.css` → `src/index.css`
- `Navbar.css` → `src/styles/Navbar.css`
- `Hero.css` → `src/styles/Hero.css`
- `TrustStrip.css` → `src/styles/TrustStrip.css`
- `Services.css` → `src/styles/Services.css`
- `About.css` → `src/styles/About.css`
- `Gallery.css` → `src/styles/Gallery.css`
- `Testimonials.css` → `src/styles/Testimonials.css`
- `CTABanner.css` → `src/styles/CTABanner.css`
- `Contact.css` → `src/styles/Contact.css`
- `Footer.css` → `src/styles/Footer.css`

**JSX files** → copy to `src/components/`:
- `App.jsx` → `src/App.jsx`
- `Navbar.jsx` → `src/components/Navbar.jsx`
- `Hero.jsx` → `src/components/Hero.jsx`
- `TrustStrip.jsx` → `src/components/TrustStrip.jsx`
- `Services.jsx` → `src/components/Services.jsx`
- `About.jsx` → `src/components/About.jsx`
- `Gallery.jsx` → `src/components/Gallery.jsx`
- `Testimonials.jsx` → `src/components/Testimonials.jsx`
- `CTABanner.jsx` → `src/components/CTABanner.jsx`
- `Contact.jsx` → `src/components/Contact.jsx`
- `Footer.jsx` → `src/components/Footer.jsx`

### 3. Run
```bash
npm start
```

---

## 🗂 File Structure Expected
```
src/
├── App.jsx
├── index.css
├── index.js
├── assets/
│   └── logo.png
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── TrustStrip.jsx
│   ├── Services.jsx
│   ├── About.jsx
│   ├── Gallery.jsx
│   ├── Testimonials.jsx
│   ├── CTABanner.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── styles/
│   ├── Navbar.css
│   ├── Hero.css
│   ├── TrustStrip.css
│   ├── Services.css
│   ├── About.css
│   ├── Gallery.css
│   ├── Testimonials.css
│   ├── CTABanner.css
│   ├── Contact.css
│   └── Footer.css
└── data.js
```
