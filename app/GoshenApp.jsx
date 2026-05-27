'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@sanity/client";

// ─── CONFIGURATION SANITY CLIENT ─────────────────────────────────
// Ces variables d'environnement Next.js pointeront vers ton projet Sanity.
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "votre_project_id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-27",
  useCdn: true,
});

// ─── CHARGEMENT DES COMPOSANTS GRAPHLOQ (REQUÊTES OPTIMISÉES) ──────
const QUERIES = {
  slides: `*[_type == "slide"] | order(_createdAt asc) {
    type,
    "src": select(type == "video" => video.asset->url, image.asset->url),
    "poster": poster.asset->url,
    label, title, sub
  }`,
  animals: `*[_type == "animal"] | order(_createdAt asc) {
    name, desc, "img": img.asset->url, emoji
  }`,
  products: `*[_type == "product"] | order(_createdAt asc) {
    id, category, "img": img.asset->url, name, price, priceDisplay, tag, badge, color, description, notice, whatsappOnly, priceUnit,
    options[]{ value, label, extra }, optionPrices, defaultOption
  }`
};

// ─── CONSTANTES ET DESIGN SYSTEM CONTROLE DES COULEURS ─────────────
const C = {
  green: "#0B2A1D", terra: "#C86B45", gray: "#F4F6F5",
  white: "#FFFFFF", charcoal: "#111111", wave: "#1A9FFF", whatsapp: "#25D366",
};

// ─── CONTENUS DE SAUVEGARDE (FALLBACKS) SI SANITY EST VIDE ─────────
const FALLBACK_SLIDES = [
  { type: "image", src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80", label: "La Ferme · Adzopé", title: "Des terres vivantes,\nune promesse durable.", sub: "Région de la Mé — Côte d'Ivoire" },
  { type: "video", src: "https://videos.pexels.com/video-files/4812205/4812205-hd_1920_1080_30fps.mp4", poster: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80", label: "Canards de Barbarie", title: "Nos canards en liberté,\nchaque matin.", sub: "Élevage extensif semi-libre · Goshen Agrofarm" },
  { type: "image", src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80", label: "Poulets Kuroiler", title: "Le Kuroiler Gastronomique,\nchair d'exception.", sub: "Élevés au grain — Traçabilité totale Goshen OS" }
];

const FALLBACK_ANIMALS = [
  { name: "Poulet Kuroiler", desc: "Chair ferme, élevé au grain", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", emoji: "🐔" },
  { name: "Canard de Barbarie", desc: "Semi-liberté, viande maigre", img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", emoji: "🦆" },
  { name: "Mouton Balami", desc: "Race bouchère premium", img: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=600&q=80", emoji: "🐑" },
  { name: "Potager Frais", desc: "Salades, manioc, gingembre", img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80", emoji: "🌿" },
];

const FALLBACK_PRODUCTS = [
  { id: "kuroiler", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", name: "Poulet Kuroiler Gastronomique", price: 6500, tag: "Best-seller", color: "#c86b45", description: "Élevé au grain sur notre ferme d'Adzopé. Chair ferme, saveur authentique.", options: [{ value: "vivant", label: "Vivant" }, { value: "pret", label: "Prêt-à-cuire", extra: "+500 CFA" }], optionPrices: { vivant: 0, pret: 500 }, defaultOption: "pret", priceUnit: "par poulet" },
  { id: "canard", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", name: "Canard de Barbarie", price: 8500, badge: "Premium", color: "#1a5c8a", description: "Élevage extensif en semi-liberté. Viande dense et savoureuse.", options: [{ value: "vivant", label: "Vivant" }, { value: "pret", label: "Prêt-à-cuire", extra: "+800 CFA" }], optionPrices: { vivant: 0, pret: 800 }, defaultOption: "vivant", priceUnit: "par canard" },
  { id: "mouton", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=600&q=80", name: "Mouton Balami d'Élite", priceDisplay: "À partir de 250 000 CFA", price: 250000, badge: "Sur devis", color: "#6b4c1a", description: "Race sélectionnée pour sa qualité bouchère. Prochainement disponible sur notre catalogue.", whatsappOnly: true, priceUnit: "selon gabarit" },
  { id: "salade", category: "Le Potager Frais", img: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80", name: "Salade Feuille de Chêne", price: 1200, color: "#2a7a3a", description: "Cultivée sous serre à Adzopé, récoltée à la commande. Feuilles croquantes.", notice: "💡 Garantie Goshen : Récolté à la commande, lavé à l'eau pure.", priceUnit: "/ 3 têtes" },
];

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── STYLES GLOBALS ──────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.gray}; color: ${C.charcoal}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    .serif { font-family: 'Cormorant Garamond', serif; }
    .mono { font-family: 'DM Mono', monospace; }

    /* SLIDESHOW */
    .slideshow { position: relative; width: 100%; height: 100svh; min-height: 500px; overflow: hidden; background: #000; }
    .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s cubic-bezier(.4,0,.2,1); }
    .slide.active { opacity: 1; }
    .slide img, .slide video { width: 100%; height: 100%; object-fit: cover; }
    .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%); }
    .slide-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 24px 32px; z-index: 2; }
    .slide-label { display: inline-flex; align-items: center; gap: 8px; background: rgba(200,107,69,0.2); border: 1px solid rgba(200,107,69,0.4); backdrop-filter: blur(8px); border-radius: 100px; padding: 5px 14px; margin-bottom: 14px; }
    .slide-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 7vw, 76px); font-weight: 300; color: #fff; line-height: 1.1; white-space: pre-line; margin-bottom: 10px; }
    .slide-sub { font-size: 13px; color: rgba(255,255,255,0.6); letter-spacing: 0.03em; margin-bottom: 24px; }
    .slide-dots { display: flex; gap: 6px; margin-top: 20px; }
    .dot { width: 24px; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.3); cursor: pointer; transition: all 0.4s; border: none; }
    .dot.active { background: ${C.terra}; width: 40px; }
    .slide-arrows { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; display: flex; justify-content: space-between; width: 100%; padding: 0 12px; pointer-events: none; }
    .arrow-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.12); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 18px; cursor: pointer; pointer-events: all; transition: all 0.25s; display: flex; align-items: center; justify-content: center; }
    .arrow-btn:hover { background: rgba(200,107,69,0.5); }
    .slide-counter { position: absolute; top: 20px; right: 20px; z-index: 3; }

    /* NAVBAR */
    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(244,246,245,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(11,42,29,0.08); transition: all 0.3s; }
    .navbar.scrolled { background: rgba(11,42,29,0.97); }
    .navbar.scrolled .nav-link { color: rgba(255,255,255,0.75) !important; }
    .navbar.scrolled .brand-name { color: #fff !important; }
    .navbar.scrolled .cart-btn { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
    .nav-link { font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; padding: 5px 0; border-bottom: 1.5px solid transparent; transition: all 0.2s; }
    .nav-link:hover, .nav-link.active { border-color: ${C.terra}; color: ${C.terra} !important; }

    /* MOBILE NAV */
    .mobile-menu { position: fixed; inset: 0; background: ${C.green}; z-index: 49; transform: translateX(-100%); transition: transform 0.35s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px; }
    .mobile-menu.open { transform: translateX(0); }
    .mobile-nav-link { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: rgba(255,255,255,0.85); cursor: pointer; transition: color 0.2s; font-weight: 300; }
    .mobile-nav-link:hover { color: ${C.terra}; }

    /* BUTTONS */
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.25s cubic-bezier(.4,0,.2,1); border: none; white-space: nowrap; }
    .btn-primary { background: ${C.green}; color: #fff; padding: 12px 24px; }
    .btn-primary:hover { background: #0f3828; transform: scale(1.03); box-shadow: 0 8px 24px rgba(11,42,29,0.3); }
    .btn-outline { background: transparent; color: ${C.terra}; padding: 11px 22px; border: 1.5px solid ${C.terra}; }
    .btn-outline:hover { background: ${C.terra}; color: #fff; }
    .btn-wave { background: ${C.wave}; color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 15px; font-weight: 600; width: 100%; border: none; cursor: pointer; transition: all 0.25s; text-align: center; }
    .btn-wave:hover { filter: brightness(1.1); box-shadow: 0 8px 24px rgba(26,159,255,0.35); }
    .btn-wa { background: ${C.whatsapp}; color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 15px; font-weight: 600; width: 100%; border: none; cursor: pointer; transition: all 0.25s; text-align: center; }
    .btn-wa:hover { filter: brightness(1.1); box-shadow: 0 8px 24px rgba(37,211,102,0.35); }

    /* CARDS */
    .card { border-radius: 20px; overflow: hidden; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 20px 56px rgba(11,42,29,0.12); }
    .product-card { background: #fff; border-radius: 18px; overflow: hidden; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; display: flex; flex-direction: column; justify-content: space-between; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(11,42,29,0.1); }
    .product-img-wrap { position: relative; overflow: hidden; height: 220px; background: #eef1ef; }
    .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(.4,0,.2,1); }
    .product-card:hover .product-img-wrap img { transform: scale(1.06); }
    .animal-card { border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; }
    .animal-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(.4,0,.2,1); display: block; }
    .animal-card:hover img { transform: scale(1.07); }
    .animal-overlay { position: absolute; inset: 0; transition: background 0.35s; }
    .animal-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 18px; z-index: 2; }

    /* DRAWER */
    .drawer-overlay { position: fixed; inset: 0; background: rgba(11,42,29,0.5); z-index: 100; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
    .drawer-overlay.open { opacity: 1; pointer-events: all; }
    .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(460px, 100vw); background: ${C.gray}; z-index: 101; transform: translateX(100%); transition: transform 0.4s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; box-shadow: -8px 0 48px rgba(11,42,29,0.2); }
    .drawer.open { transform: translateX(0); }

    /* FORMS */
    .form-input { width: 100%; padding: 12px 14px; border: 1.5px solid #e0e3e0; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: #fff; color: ${C.charcoal}; transition: border-color 0.2s, box-shadow 0.2s; outline: none; -webkit-appearance: none; }
    .form-input:focus { border-color: ${C.green}; box-shadow: 0 0 0 3px rgba(11,42,29,0.08); }

    /* MISC */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
    .badge-white { background: rgba(255,255,255,0.92); color: ${C.charcoal}; }
    .tag { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; opacity: 0.5; }
    .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; flex-shrink: 0; }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.4); } }
    .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 12px; border-radius: 100px; border: 1.5px solid #ddd; font-size: 12px; transition: all 0.2s; user-select: none; }
    .radio-opt.selected { border-color: ${C.green}; background: rgba(11,42,29,0.06); color: ${C.green}; font-weight: 600; }
    .qty-btn { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #ddd; background: #fff; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .qty-btn:hover { border-color: ${C.green}; color: ${C.green}; }
    
    /* GRIDS & PADDINGS RESPONSIVE */
    .page-pad { padding: 100px 24px 64px; maxWidth: 1280px; margin: 0 auto; width: 100%; }
    .grid-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 32px; }

    @media (max-width: 767px) {
      .hide-mobile { display: none !important; }
      .hide-desktop { display: flex !important; }
      .slide-content { padding: 28px 18px 24px; }
      .slide-arrows { padding: 0 8px; }
      .arrow-btn { width: 36px; height: 36px; font-size: 16px; }
      .page-pad { padding: 84px 16px 40px !important; }
      .section-pad { padding: 48px 16px 0 !important; }
      .bento-pad { padding: 0 16px !important; }
      .grid-products { grid-template-columns: 1fr !important; gap: 20px; }
      .animal-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; gap: 12px !important; }
      .animal-card { height: 200px !important; grid-column: auto !important; grid-row: auto !important; }
    }
  `}</style>
);

// ─── CART HOOK (LOGIQUE DU PANIER) ─────────────────────────────────
function useCart() {
  const [items, setItems] = useState([]);
  const add = (p) => setItems(prev => {
    const key = `${p.id}-${p.option || ""}`;
    const ex = prev.find(i => i.key === key);
    if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...p, key, qty: 1 }];
  });
  const remove = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const updateQty = (key, delta) => setItems(prev =>
    prev.map(i => i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0)
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, add, remove, updateQty, total, count };
}

// ─── COMPOSANT SLIDESHOW (ACCUEIL) ─────────────────────────────────
function Slideshow({ slides, setPage }) {
  const [cur, setCur] = useState(0);
  const videoRefs = useRef({});
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => setCur(idx), []);
  const next = useCallback(() => goTo((cur + 1) % slides.length), [cur, goTo, slides.length]);
  const prev = useCallback(() => goTo((cur - 1 + slides.length) % slides.length), [cur, goTo, slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  useEffect(() => {
    const vid = videoRefs.current[cur];
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
  }, [cur]);

  return (
    <div className="slideshow">
      {slides.map((s, i) => (
        <div key={i} className={`slide${i === cur ? " active" : ""}`}>
          {s.type === "video" ? (
            <video ref={el => videoRefs.current[i] = el} src={s.src} poster={s.poster} muted playsInline loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <img src={s.src} alt={s.label} loading={i < 2 ? "eager" : "lazy"} />
          )}
          <div className="slide-overlay" />
        </div>
      ))}

      <div className="slide-counter">
        <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          {String(cur + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      <div className="slide-arrows">
        <button className="arrow-btn" onClick={prev}>‹</button>
        <button className="arrow-btn" onClick={next}>›</button>
      </div>

      <div className="slide-content">
        <div>
          <div className="slide-label">
            <div className="pulse-dot" />
            <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>{slides[cur]?.label}</span>
          </div>
          <h1 className="slide-title">{slides[cur]?.title}</h1>
          <p className="slide-sub">{slides[cur]?.sub}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" style={{ background: "#fff", color: C.green, fontWeight: 700 }} onClick={() => setPage("shop")}>
              Découvrir la Boutique →
            </button>
            <button className="btn btn-outline" style={{ borderColor: "rgba(200,107,69,0.7)", color: C.terra }} onClick={() => setPage("b2b")}>
              Espace B2B
            </button>
          </div>
          <div className="slide-dots">
            {slides.map((_, i) => (
              <button key={i} className={`dot${i === cur ? " active" : ""}`} onClick={() => goTo(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT NAVBAR ─────────────────────────────────────────────
function Navbar({ page, setPage, cartCount, setDrawerOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pages = [
    { id: "home", label: "Accueil" },
    { id: "shop", label: "Boutique" },
    { id: "b2b", label: "Espace B2B" },
    { id: "logistics", label: "Contact" },
  ];

  const navTo = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="serif" style={{ fontSize: 18, color: "#fff" }}>Goshen AgroFarm</div>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 28 }}>✕</button>
        </div>
        {pages.map(p => (
          <div key={p.id} className="mobile-nav-link" onClick={() => navTo(p.id)}>{p.label}</div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setDrawerOpen(true); setMenuOpen(false); }}>
          🛒 Panier {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </div>

      <nav className={`navbar${scrolled || page !== "home" ? " scrolled" : ""}`}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyBetween: "space-between", width: "100%" }}>
          <div onClick={() => setPage("home")} style={{ cursor: "pointer", lineHeight: 1, flex: 1 }}>
            <div className="serif brand-name" style={{ fontSize: 19, fontWeight: 600, color: C.green }}>Goshen</div>
            <div className="mono" style={{ fontSize: 8, letterSpacing: "0.15em", color: C.terra }}>AgroFarm · Adzopé</div>
          </div>
          <div className="hide-mobile" style={{ display: "flex", gap: 24, marginRight: 24 }}>
            {pages.map(p => (
              <span key={p.id} className={`nav-link${page === p.id ? " active" : ""}`} style={{ color: C.charcoal }} onClick={() => setPage(p.id)}>{p.label}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-primary cart-btn" style={{ fontSize: 13, padding: "9px 16px", position: "relative" }} onClick={() => setDrawerOpen(true)}>
              🛒 <span className="hide-mobile">Panier</span>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, width: 19, height: 19, background: C.terra, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(true)} className="hide-desktop" style={{ display: "none", background: "none", border: "none", fontSize: 22, color: scrolled || page !== "home" ? "#fff" : C.green }}>
              ☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

// ─── COMPOSANT CHECKOUT DRAWER (PANIER EXTENSIBLE) ────────────────
function CheckoutDrawer({ open, onClose, items, updateQty, remove, total }) {
  const waMessage = () => {
    const lines = items.map(i => `• ${i.name}${i.option ? ` (${i.option})` : ""} × ${i.qty} = ${(i.price * i.qty).toLocaleString()} CFA`).join("\n");
    const msg = `Bonjour Goshen AgroFarm 🌿\n\nJe souhaite valider ma commande :\n\n${lines}\n\n*TOTAL ESTIMÉ : ${total.toLocaleString()} CFA*\n\nMerci de confirmer la prochaine livraison (Navette Adzopé-Abidjan).`;
    return `https://wa.me/2250700000000?text=${encodeURIComponent(msg)}`; // Remplacer par ton numéro officiel
  };

  return (
    <>
      <div className={`drawer-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`drawer${open ? " open" : ""}`}>
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(11,42,29,0.08)", display: "flex", alignItems: "center" }}>
          <span className="serif" style={{ fontSize: 20, fontWeight: 600, flex: 1, color: C.green }}>Votre Panier</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#999" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p style={{ fontSize: 14 }}>Votre panier Goshen est vide.</p>
            </div>
          ) : items.map(item => (
            <div key={item.key} style={{ background: "#fff", borderRadius: 14, padding: "12px", marginBottom: 10, display: "flex", gap: 10, alignItems: "center" }}>
              {item.img && <img src={item.img} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                {item.option && <div style={{ fontSize: 11, color: "#888" }}>{item.option}</div>}
                <div style={{ fontSize: 13, color: C.terra, fontWeight: 700, marginTop: 2 }}>{(item.price * item.qty).toLocaleString()} CFA</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button className="qty-btn" onClick={() => updateQty(item.key, -1)}>−</button>
                <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.key, 1)}>+</button>
              </div>
              <button onClick={() => remove(item.key)} style={{ background: "none", border: "none", color: "#ccc", marginLeft: 6 }}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "16px 16px 24px", borderTop: "1px solid rgba(11,42,29,0.08)", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="serif" style={{ fontSize: 17 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: C.green }}>{total.toLocaleString()} CFA</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-wave" onClick={() => alert("Redirection sécurisée vers l'API de paiement...")}>🌊 Payer immédiatement avec Wave / Mobile Money</button>
              <a href={waMessage()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-wa">💬 Valider et Planifier sur WhatsApp</button>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── COMPOSANT ANIMAL GALLERY (ACCUEIL - RÉPARÉ) ───────────────────
function AnimalGallery({ animals, setPage }) {
  const [active, setActive] = useState(null);
  return (
    <div className="section-pad" style={{ padding: "64px 0 0" }}>
      <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="tag" style={{ color: C.terra, marginBottom: 6 }}>Modèle Circulaire Intégré</div>
            <h2 className="serif" style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 300, color: C.green }}>La vie à la ferme en <em>images</em></h2>
          </div>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setPage("shop")}>Accéder au Catalogue →</button>
        </div>

        <div className="animal-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "240px 240px", gap: 10 }}>
          {animals.map((a, i) => (
            <div key={a.name} className="animal-card"
              style={{
                gridColumn: i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : "2 / 4",
                gridRow: i === 0 ? "1 / 3" : i === 3 ? "2" : "1",
              }}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
            >
              <img src={a.img} alt={a.name} />
              <div className="animal-overlay" style={{ position: "absolute", inset: 0, background: active === i ? "linear-gradient(to top, rgba(11,42,29,0.92) 0%, rgba(11,42,29,0.2) 60%)" : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />
              <div className="animal-info">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: i === 0 ? 24 : 18 }}>{a.emoji}</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: i === 0 ? 18 : 14 }}>{a.name}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 1.45 }}>{a.desc}</p>
                {active === i && (
                  <div className="fade-up" style={{ marginTop: 8 }}>
                    <button className="btn" style={{ background: C.terra, color: "#fff", fontSize: 11, padding: "5px 12px" }} onClick={() => setPage("shop")}>
                      Acheter Produits →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRODUIT INDIVIDUEL (CARD INTERACTIVE) ───────────────
function ProductCard({ product, onAddToCart }) {
  const [selectedOpt, setSelectedOpt] = useState(product.defaultOption || (product.options && product.options[0]?.value) || "");
  
  // Calcul dynamique du prix final selon l'option choisie (Vivant, Prêt-à-cuire, etc.)
  const extraPrice = product.optionPrices && product.optionPrices[selectedOpt] ? product.optionPrices[selectedOpt] : 0;
  const finalPrice = product.price + extraPrice;

  const handleAdd = () => {
    const optLabel = product.options?.find(o => o.value === selectedOpt)?.label || "";
    onAddToCart({
      id: product.id,
      name: product.name,
      img: product.img,
      price: finalPrice,
      option: optLabel
    });
  };

  const waDirectMessage = () => {
    const msg = `Bonjour Goshen AgroFarm 🌿\nJe suis intéressé par : ${product.name} (${product.priceUnit}). Merci de me donner vos disponibilités !`;
    return `https://wa.me/2250700000000?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="product-card" style={{ border: "1px solid rgba(11,42,29,0.06)", paddingBottom: 20 }}>
      <div>
        <div className="product-img-wrap">
          <img src={product.img} alt={product.name} />
          {(product.tag || product.badge) && (
            <div style={{ position: "absolute", top: 12, left: 12 }}>
              <span className="badge badge-white" style={{ background: product.color, color: "#fff" }}>
                {product.tag || product.badge}
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: "20px 20px 10px" }}>
          <span className="mono" style={{ fontSize: 11, color: C.terra, fontWeight: 500 }}>{product.category}</span>
          <h3 className="serif" style={{ fontSize: 21, color: C.green, marginTop: 4, fontWeight: 600 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: "#666", marginTop: 8, lineHeight: 1.5 }}>{product.description}</p>
          
          {product.notice && (
            <div style={{ background: `${C.gray}`, padding: "10px", borderRadius: 10, marginTop: 10, fontSize: 12, color: C.green }}>
              {product.notice}
            </div>
          )}

          {/* Sélecteur d'options (ex: Vivant vs Prêt-à-cuire) */}
          {product.options && product.options.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {product.options.map(opt => (
                <div key={opt.value} 
                  className={`radio-opt${selectedOpt === opt.value ? " selected" : ""}`}
                  onClick={() => setSelectedOpt(opt.value)}
                >
                  {opt.label} {opt.extra && <span style={{ opacity: 0.6, fontSize: 11 }}>({opt.extra})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px", marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.green }}>
              {product.whatsappOnly ? product.priceDisplay : `${finalPrice.toLocaleString()} CFA`}
            </span>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>{product.priceUnit}</span>
          </div>
        </div>

        {product.whatsappOnly ? (
          <a href={waDirectMessage()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn btn-wa" style={{ width: "100%", borderRadius: 10, padding: "12px" }}>💬 Demander une cotation</button>
          </a>
        ) : (
          <button className="btn btn-primary" style={{ width: "100%", borderRadius: 10, padding: "12px", background: C.green }} onClick={handleAdd}>
            🛒 Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}

// ─── VUE : BOUTIQUE / CATALOGUE COMPLET ───────────────────────────
function ShopView({ products, onAddToCart }) {
  const [activeCat, setActiveCat] = useState("Tous");
  const categories = ["Tous", "L'Élevage d'Exception", "Le Potager Frais"];

  const filtered = activeCat === "Tous" 
    ? products 
    : products.filter(p => p.category === activeCat);

  return (
    <div className="page-pad">
      <div style={{ textAlign: "center", marginBottom: 32, marginTop: 20 }}>
        <span className="mono" style={{ fontSize: 12, color: C.terra, letterSpacing: "0.1em" }}>PRODUCTIONS GOSHEN AGROFARM</span>
        <h1 className="serif" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: C.green, marginTop: 6 }}>Le Marché Durable & Circulaire</h1>
        <p style={{ color: "#666", fontSize: 14, marginTop: 8 }}>De nos infrastructures d'Adzopé directement à votre table à Abidjan.</p>
        
        {/* Filtres par Catégorie */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
          {categories.map(cat => (
            <button key={cat} className="btn"
              style={{
                background: activeCat === cat ? C.green : "#fff",
                color: activeCat === cat ? "#fff" : C.green,
                border: `1px solid ${C.green}`,
                padding: "8px 18px",
                fontSize: 13
              }}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-products">
        {filtered.map(prod => (
          <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

// ─── VUE : ESPACE PRO / B2B ───────────────────────────────────────
function B2BView() {
  return (
    <div className="page-pad" style={{ maxWidth: 800 }}>
      <div style={{ background: "#fff", padding: "40px 30px", borderRadius: 24, border: "1px solid rgba(11,42,29,0.06)", marginTop: 20 }}>
        <span className="mono" style={{ fontSize: 12, color: C.terra }}>PARTENARIATS CHR & AGRO-INDUSTRIELS</span>
        <h1 className="serif" style={{ fontSize: 38, color: C.green, marginTop: 6, fontWeight: 300 }}>Approvisionnement B2B Régulier</h1>
        <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6, marginTop: 12 }}>
          Vous êtes un restaurant, un hôtelier, un boucher premium ou un distributeur à Abidjan ? Goshen AgroFarm met à votre disposition des volumes contractuels standardisés basés sur le modèle Songhai (zéro intrant chimique, traçabilité totale).
        </p>

        <div style={{ margin: "24px 0", padding: "20px", background: C.gray, borderRadius: 16 }}>
          <h3 className="serif" style={{ color: C.green, fontSize: 18, marginBottom: 8 }}>Infrastructures et Capacités :</h3>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: C.charcoal, lineHeight: 1.8 }}>
            <li><b>Poulet Kuroiler :</b> Lots calibrés, abattage propre à la demande.</li>
            <li><b>Mouton Balami & Ouda :</b> Sélection rigoureuse pour événements et filières de luxe.</li>
            <li><b>Logistique dédiée :</b> Camions frigorifiques et navettes directes Adzopé-Abidjan.</li>
          </ul>
        </div>

        <h3 className="serif" style={{ color: C.green, fontSize: 20, marginTop: 20 }}>Demande de grille tarifaire grossiste</h3>
        <form style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }} onSubmit={e => { e.preventDefault(); alert("Demande envoyée ! Notre équipe commerciale vous contactera."); }}>
          <div className="grid-products" style={{ gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 0 }}>
            <input type="text" placeholder="Nom de l'établissement" className="form-input" required />
            <input type="email" placeholder="Adresse email professionnelle" className="form-input" required />
          </div>
          <textarea placeholder="Dites-nous en plus sur vos besoins mensuels (ex: 200 poulets prêts-à-cuire par semaine)..." className="form-input" style={{ minHeight: 120, resize: "none" }} required></textarea>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>Recevoir le Catalogue Pro</button>
        </form>
      </div>
    </div>
  );
}

// ─── VUE : LOGISTIQUE ET CONTACT ──────────────────────────────────
function LogisticsView() {
  return (
    <div className="page-pad" style={{ maxWidth: 900 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 20 }} className="grid-products">
        {/* Infos Logistique */}
        <div style={{ background: C.green, color: "#fff", padding: "40px 30px", borderRadius: 24 }}>
          <span className="mono" style={{ fontSize: 11, color: C.terra, letterSpacing: "0.1em" }}>TRAÇABILITÉ & NAVETTE</span>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 300, marginTop: 6, color: "#fff" }}>De la Mé à Abidjan</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 12, lineHeight: 1.6 }}>
            Notre modèle logistique s'assure qu'aucun intermédiaire ne dégrade la qualité de nos produits. Les récoltes maraîchères s'effectuent à l'aube pour une livraison le soir même.
          </p>
          
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600 }}>Ferme Principale</h4>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Route de N'Koupé, Adzopé, Côte d'Ivoire</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🚛</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600 }}>Points de Chute - Abidjan</h4>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Livraison à domicile et hubs partenaires de distribution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div style={{ background: "#fff", padding: "40px 30px", borderRadius: 24, border: "1px solid rgba(11,42,29,0.06)" }}>
          <h3 className="serif" style={{ color: C.green, fontSize: 24, fontWeight: 600 }}>Écrivez-nous</h3>
          <p style={{ fontSize: 13, color: "#666", marginTop: 4, marginBottom: 20 }}>Une question, une suggestion ou une commande sur-mesure ?</p>
          
          <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={e => { e.preventDefault(); alert("Message envoyé !"); }}>
            <input type="text" placeholder="Votre nom complet" className="form-input" required />
            <input type="tel" placeholder="Numéro WhatsApp (ex: +225...)" className="form-input" required />
            <textarea placeholder="Votre message..." className="form-input" style={{ minHeight: 100, resize: "none" }} required></textarea>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Envoyer le message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── ARCHITECTURE PRINCIPALE : GOSHEN APP (DEFAULT EXPORT) ──────────
export default function GoshenApp() {
  const [page, setPage] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cart = useCart();

  // États pour les données dynamiques Sanity
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [animals, setAnimals] = useState(FALLBACK_ANIMALS);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);

  // Synchronisation avec Sanity CMS au montage du composant
  useEffect(() => {
    sanity.fetch(QUERIES.slides)
      .then(data => { if (data && data.length > 0) setSlides(data); })
      .catch(err => console.error("Erreur de chargement Slides Sanity, utilisation des fallbacks:", err));

    sanity.fetch(QUERIES.animals)
      .then(data => { if (data && data.length > 0) setAnimals(data); })
      .catch(err => console.error("Erreur de chargement Cheptel Sanity, utilisation des fallbacks:", err));

    sanity.fetch(QUERIES.products)
      .then(data => { if (data && data.length > 0) setProducts(data); })
      .catch(err => console.error("Erreur de chargement Produits Sanity, utilisation des fallbacks:", err));
  }, []);

  return (
    <>
      <Styles />
      
      <Navbar 
        page={page} 
        setPage={setPage} 
        cartCount={cart.count} 
        setDrawerOpen={setDrawerOpen} 
      />

      {/* Switcher de page propre */}
      <main style={{ minHeight: "calc(100vh - 120px)" }}>
        {page === "home" && (
          <>
            <Slideshow slides={slides} setPage={setPage} />
            <AnimalGallery animals={animals} setPage={setPage} />
            
            {/* Section Ticker Goshen OS / Label d'innovation */}
            <div style={{ background: C.green, padding: "24px 0", marginTop: 64, color: "#fff" }} className="os-ticker">
              <div className="os-ticker-inner">
                {[...Array(4)].map((_, idx) => (
                  <span key={idx} className="mono" style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", display: "inline-flex", gap: 32 }}>
                    <span>🌾 Modèle Intégré Songhai</span> • 
                    <span>🐔 Kuroiler Haute Traçabilité</span> • 
                    <span>💧 Zéro Intrant Chimique</span> •
                    <span>📦 Prochaine Navette en cours</span>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {page === "shop" && (
          <ShopView products={products} onAddToCart={cart.add} />
        )}

        {page === "b2b" && (
          <B2BView />
        )}

        {page === "logistics" && (
          <LogisticsView />
        )}
      </main>

      {/* Tiroir Panier Global */}
      <CheckoutDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        items={cart.items} 
        updateQty={cart.updateQty} 
        remove={cart.remove} 
        total={cart.total} 
      />

      {/* Footer Minimaliste */}
      <footer style={{ background: "#fff", borderTop: "1px solid rgba(11,42,29,0.06)", padding: "40px 16px", marginTop: 64 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, fontSize: 13, color: "#666" }}>
          <div>
            <div className="serif" style={{ fontSize: 16, color: C.green, fontWeight: 600 }}>Goshen AgroFarm</div>
            <p style={{ marginTop: 4 }}>Pour une agriculture africaine innovante et souveraine.</p>
          </div>
          <div className="mono" style={{ fontSize: 11 }}>
            © {new Date().getFullYear()} Goshen AgroFarm. Adzopé - Abidjan. Tous droits réservés.
          </div>
        </div>
      </footer>
    </>
  );
}
