'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";

const C = {
  green: "#0B2A1D", terra: "#C86B45", gray: "#F4F6F5",
  white: "#FFFFFF", charcoal: "#111111", wave: "#1A9FFF", whatsapp: "#25D366",
};

const SLIDES = [
  { type: "image", src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80", label: "La Ferme · Adzopé", title: "Des terres vivantes,\nune promesse durable.", sub: "Région de la Mé — Côte d'Ivoire" },
  { type: "video", src: "https://videos.pexels.com/video-files/4812205/4812205-hd_1920_1080_30fps.mp4", poster: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80", label: "Canards de Barbarie", title: "Nos canards en liberté,\nchaque matin.", sub: "Élevage extensif semi-libre · Goshen Agrofarm" },
  { type: "image", src: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80", label: "Canards · Élevage", title: "L'excellence commence\npar la liberté.", sub: "Canards de Barbarie — viande maigre & savoureuse" },
  { type: "video", src: "https://videos.pexels.com/video-files/5733304/5733304-uhd_2560_1440_25fps.mp4", poster: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80", label: "Paysage · Matin", title: "Récolté à l'aube,\nlivré à Abidjan le soir.", sub: "Fraîcheur absolue · La Navette Goshen" },
  { type: "image", src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80", label: "Poulets Kuroiler", title: "Le Kuroiler Gastronomique,\nchair d'exception.", sub: "Élevés au grain — Traçabilité totale Goshen OS" },
  { type: "video", src: "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4", poster: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1600&q=80", label: "Le Potager Frais", title: "Du sol fertile de la Mé\nà votre assiette.", sub: "Cultures de précision — Zéro intrant chimique" },
  { type: "image", src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1600&q=80", label: "Maraîchage · Adzopé", title: "Des légumes vivants,\ncueillis à la commande.", sub: "Potager Goshen — Salades, courgettes, concombres" },
  { type: "image", src: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=1600&q=80", label: "Moutons Balami", title: "Le Mouton Balami d'Élite,\nle prestige à l'état pur.", sub: "Race sélectionnée · Sur réservation WhatsApp" },
];

const ANIMALS = [
  { name: "Poulet Kuroiler", desc: "Chair ferme, élevé au grain", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", emoji: "🐔" },
  { name: "Canard de Barbarie", desc: "Semi-liberté, viande maigre", img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", emoji: "🦆" },
  { name: "Mouton Balami", desc: "Race bouchère premium", img: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=600&q=80", emoji: "🐑" },
  { name: "Potager Frais", desc: "Salades, manioc, gingembre", img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80", emoji: "🌿" },
];

const PRODUCTS = [
  { id: "kuroiler", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", name: "Poulet Kuroiler Gastronomique", price: 6500, tag: "Best-seller", color: "#c86b45", description: "Élevé au grain sur notre ferme d'Adzopé. Chair ferme, saveur authentique, traçabilité totale.", options: [{ value: "vivant", label: "Vivant" }, { value: "pret", label: "Prêt-à-cuire", extra: "+500 CFA" }], optionPrices: { vivant: 0, pret: 500 }, defaultOption: "pret", priceUnit: "par poulet" },
  { id: "canard", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", name: "Canard de Barbarie", price: 8500, badge: "Premium", color: "#1a5c8a", description: "Élevage extensif en semi-liberté. Viande dense, maigre et savoureuse.", options: [{ value: "vivant", label: "Vivant" }, { value: "pret", label: "Prêt-à-cuire", extra: "+800 CFA" }], optionPrices: { vivant: 0, pret: 800 }, defaultOption: "vivant", priceUnit: "par canard" },
  { id: "mouton", category: "L'Élevage d'Exception", img: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=600&q=80", name: "Mouton Balami d'Élite", priceDisplay: "À partir de 250 000 CFA", price: 250000, badge: "Sur devis", color: "#6b4c1a", description: "Race sélectionnée pour sa qualité bouchère. Cotation selon gabarit et poids vif.", whatsappOnly: true, priceUnit: "cotation selon gabarit" },
  { id: "salade", category: "Le Potager Frais", img: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80", name: "Salade Feuille de Chêne", price: 1200, color: "#2a7a3a", description: "Cultivée sous serre à Adzopé, récoltée à la commande. Feuilles croquantes.", notice: "💡 Garantie Goshen : Récolté à la commande, trié et lavé à l'eau propre filtrée.", priceUnit: "/ 3 têtes" },
  { id: "manioc", category: "Le Potager Frais", img: "https://images.unsplash.com/photo-1629218437561-8b1c35c7a3dc?w=600&q=80", name: "Manioc Frais de la Mé", price: 2500, badge: "Terroir", color: "#3a6b1a", description: "Manioc premium de la région de la Mé. Récolte hebdomadaire, fraîcheur garantie.", priceUnit: "/ 5 kg" },
  { id: "gingembre", category: "Le Potager Frais", img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80", name: "Gingembre Ultra-Aromatique", price: 3500, color: "#8b6914", description: "Cultivé naturellement sur les terres fertiles d'Adzopé. Huiles essentielles exceptionnelles.", options: [{ value: "frais", label: "Frais" }, { value: "seche", label: "Séché & Prêt" }], defaultOption: "frais", priceUnit: "/ kg" },
];

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── STYLES ───────────────────────────────────────────────────────
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
    .btn-wave { background: ${C.wave}; color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 15px; font-weight: 600; width: 100%; border: none; cursor: pointer; transition: all 0.25s; }
    .btn-wave:hover { filter: brightness(1.1); box-shadow: 0 8px 24px rgba(26,159,255,0.35); }
    .btn-wa { background: ${C.whatsapp}; color: #fff; padding: 16px 24px; border-radius: 16px; font-size: 15px; font-weight: 600; width: 100%; border: none; cursor: pointer; transition: all 0.25s; }
    .btn-wa:hover { filter: brightness(1.1); box-shadow: 0 8px 24px rgba(37,211,102,0.35); }

    /* CARDS */
    .card { border-radius: 20px; overflow: hidden; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 20px 56px rgba(11,42,29,0.12); }
    .product-card { background: #fff; border-radius: 18px; overflow: hidden; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(11,42,29,0.1); }
    .product-img-wrap { position: relative; overflow: hidden; height: 200px; }
    .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(.4,0,.2,1); }
    .product-card:hover .product-img-wrap img { transform: scale(1.06); }
    .animal-card { border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; }
    .animal-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(.4,0,.2,1); display: block; }
    .animal-card:hover img { transform: scale(1.07); }
    .animal-overlay { position: absolute; inset: 0; transition: background 0.35s; }
    .animal-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 18px; }

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
    .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 12px; border-radius: 100px; border: 1.5px solid #ddd; font-size: 13px; transition: all 0.2s; user-select: none; }
    .radio-opt.selected { border-color: ${C.green}; background: rgba(11,42,29,0.06); color: ${C.green}; font-weight: 600; }
    .qty-btn { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #ddd; background: #fff; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .qty-btn:hover { border-color: ${C.green}; color: ${C.green}; }
    .os-ticker { overflow: hidden; white-space: nowrap; }
    .os-ticker-inner { display: inline-flex; gap: 48px; animation: ticker 30s linear infinite; }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fadeUp 0.35s forwards; }

    /* ── RESPONSIVE ─────────────────────────────────── */
    /* grid helpers */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
    .grid-13-1 { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }

    @media (max-width: 767px) {
      .grid-2, .grid-3, .grid-2-1, .grid-13-1 { grid-template-columns: 1fr !important; }
      .hide-mobile { display: none !important; }
      .slide-content { padding: 28px 18px 24px; }
      .slide-arrows { padding: 0 8px; }
      .arrow-btn { width: 36px; height: 36px; font-size: 16px; }
      .page-pad { padding: 76px 16px 40px !important; }
      .section-pad { padding: 48px 16px 0 !important; }
      .bento-pad { padding: 0 16px !important; }
      .card-pad { padding: 22px !important; }
      .logistics-block { flex-direction: column !important; gap: 24px !important; padding: 28px 20px !important; }
      .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .b2b-hero-inner { flex-direction: column !important; gap: 12px !important; }
      .shop-banner { height: 160px !important; }
      .shop-banner-pad { padding: 24px 24px !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
      .animal-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
      .animal-grid > div { grid-column: auto !important; grid-row: auto !important; height: 180px !important; }
      .os-metrics { grid-template-columns: 1fr 1fr !important; }
      .prod-row { grid-template-columns: 1fr !important; }
      .b2b-grid { grid-template-columns: 1fr !important; }
      .contact-form-grid { grid-template-columns: 1fr !important; }
      .contact-form-grid > div[style*="grid-column"] { grid-column: 1 !important; }
      .drawer-footer-btns { gap: 8px; }
    }
    @media (min-width: 768px) {
      .slide-content { padding: 56px 64px; }
      .page-pad { padding: 88px 24px 48px; }
      .section-pad { padding: 64px 0 0; }
      .bento-pad { padding: 0 24px; }
      .card-pad { padding: 36px; }
      .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
      .os-metrics { grid-template-columns: 1fr 1fr 1fr; }
    }
  `}</style>
);

// ─── CART HOOK ────────────────────────────────────────────────────
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

// ─── SLIDESHOW ────────────────────────────────────────────────────
function Slideshow({ setPage }) {
  const [cur, setCur] = useState(0);
  const videoRefs = useRef({});
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCur(idx);
  }, []);
  const next = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo]);
  const prev = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length), [cur, goTo]);

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
      {SLIDES.map((s, i) => (
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
          {String(cur + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
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
            <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>{SLIDES[cur].label}</span>
          </div>
          <h1 className="slide-title">{SLIDES[cur].title}</h1>
          <p className="slide-sub">{SLIDES[cur].sub}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" style={{ background: "#fff", color: C.green, fontWeight: 700, fontSize: 14 }} onClick={() => setPage("shop")}>
              Découvrir la Boutique →
            </button>
            <button className="btn btn-outline" style={{ borderColor: "rgba(200,107,69,0.7)", color: C.terra, fontSize: 14 }} onClick={() => setPage("b2b")}>
              Espace B2B
            </button>
          </div>
          <div className="slide-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={`dot${i === cur ? " active" : ""}`} onClick={() => goTo(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────
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
      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="serif" style={{ fontSize: 18, color: "#fff" }}>Goshen</div>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</button>
        </div>
        {pages.map(p => (
          <div key={p.id} className="mobile-nav-link" onClick={() => navTo(p.id)}>{p.label}</div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 16, fontSize: 15 }} onClick={() => { setDrawerOpen(true); setMenuOpen(false); }}>
          🛒 Panier {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </div>

      <nav className={`navbar${scrolled || page !== "home" ? " scrolled" : ""}`}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", gap: 20 }}>
          <div onClick={() => setPage("home")} style={{ cursor: "pointer", lineHeight: 1 }}>
            <div className="serif brand-name" style={{ fontSize: 19, fontWeight: 600, color: C.green, transition: "color 0.3s" }}>Goshen</div>
            <div className="mono" style={{ fontSize: 8, letterSpacing: "0.15em", color: C.terra, textTransform: "uppercase" }}>Agrofarm · Adzopé</div>
          </div>
          <div style={{ flex: 1 }} />
          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: "flex", gap: 24 }}>
            {pages.map(p => (
              <span key={p.id} className={`nav-link${page === p.id ? " active" : ""}`} style={{ color: C.charcoal }} onClick={() => setPage(p.id)}>{p.label}</span>
            ))}
          </div>
          <button className="btn btn-primary cart-btn" style={{ fontSize: 13, padding: "9px 16px", position: "relative" }} onClick={() => setDrawerOpen(true)}>
            🛒 <span className="hide-mobile">Panier</span>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, width: 19, height: 19, background: C.terra, color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(true)} className="hide-desktop" style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 22, color: scrolled || page !== "home" ? "#fff" : C.green, padding: "4px" }}>
            ☰
          </button>
        </div>
      </nav>

      {/* Show hamburger on mobile via inline */}
      <style>{`
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .hide-desktop { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hide-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── CHECKOUT DRAWER ──────────────────────────────────────────────
function CheckoutDrawer({ open, onClose, items, updateQty, remove, total }) {
  const waMessage = () => {
    const lines = items.map(i => `• ${i.name}${i.option ? ` (${i.option})` : ""} × ${i.qty} = ${(i.price * i.qty).toLocaleString()} CFA`).join("\n");
    const msg = `Bonjour Goshen Agrofarm 🌿\n\nJe souhaite valider ma commande :\n\n${lines}\n\n*TOTAL : ${total.toLocaleString()} CFA*\n\nMerci de confirmer ma livraison.`;
    return `https://wa.me/2250000000000?text=${encodeURIComponent(msg)}`;
  };
  return (
    <>
      <div className={`drawer-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`drawer${open ? " open" : ""}`}>
        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(11,42,29,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <span className="serif" style={{ fontSize: 20, fontWeight: 600, flex: 1, color: C.green }}>Votre Commande</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#999", padding: "4px" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p style={{ fontSize: 14 }}>Votre panier est vide.</p>
            </div>
          ) : items.map(item => (
            <div key={item.key} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 10, display: "flex", gap: 10, alignItems: "center" }}>
              {item.img && <img src={item.img} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                {item.option && <div style={{ fontSize: 11, color: "#888" }}>{item.option}</div>}
                <div style={{ fontSize: 13, color: C.terra, fontWeight: 700, marginTop: 2 }}>{item.price.toLocaleString()} CFA</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button className="qty-btn" onClick={() => updateQty(item.key, -1)}>−</button>
                <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.key, 1)}>+</button>
              </div>
              <button onClick={() => remove(item.key)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 16, padding: "4px", flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "14px 16px 24px", borderTop: "1px solid rgba(11,42,29,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span className="serif" style={{ fontSize: 17 }}>Total estimé</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: C.green }}>{total.toLocaleString()} <span style={{ fontSize: 13 }}>CFA</span></span>
            </div>
            <div className="drawer-footer-btns" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-wave">🌊 Payer {total.toLocaleString()} CFA avec Wave</button>
              <p style={{ fontSize: 11, color: "#888", textAlign: "center" }}>Paiement sécurisé. Idéal pour bloquer immédiatement votre lot pour la prochaine Navette.</p>
              <a href={waMessage()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-wa">💬 Confirmer & Valider sur WhatsApp</button>
              </a>
              <p style={{ fontSize: 11, color: "#888", textAlign: "center" }}>Recommandé pour planifier des découpes spécifiques ou vos horaires précis à Abidjan.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ANIMAL GALLERY ───────────────────────────────────────────────
function AnimalGallery({ setPage }) {
  const [active, setActive] = useState(null);
  return (
    <div className="section-pad">
      <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="tag" style={{ color: C.terra, marginBottom: 6 }}>Notre Cheptel & Potager</div>
            <h2 className="serif" style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 300, color: C.green }}>La ferme en <em>images</em></h2>
          </div>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setPage("shop")}>Voir la boutique →</button>
        </div>

        {/* Desktop: bento grid. Mobile: 2-col simple grid */}
        <div className="animal-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "240px 240px", gap: 10 }}>
          {ANIMALS.map((a, i) => (
            <div key={a.name} className="animal-card"
              style={{
                gridColumn: i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : "2 / 4",
                gridRow: i === 0 ? "1 / 3" : i === 3 ? "2" : "1",
              }}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
            >
              <img src={a.img} alt={a.name} />
              <div className="animal-overlay" style={{ background: active === i ? "linear-gradient(to top, rgba(11,42,29,0.92) 0%, rgba(11,42,29,0.15) 60%)" : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
              <div className="animal-info">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: i === 0 ? 24 : 18 }}>{a.emoji}</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: i === 0 ? 18 : 14 }}>{a.name}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 1.45 }}>{a.desc}</p>
                {active === i && (
                  <div className="fade-up" style={{ marginTop: 8 }}>
                    <button className="btn" style={{ background: C.terra, color: "#fff", fontSize: 12, padding: "7px 14px" }} onClick={() => setPage("shop")}>Commander →</button>
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

// ─── OS BLOCK ─────────────────────────────────────────────────────
function OsBlock() {
  const [metrics, setMetrics] = useState([
    { label: "Temp. Élevage", value: "26.4°C", status: "optimal", icon: "🌡️" },
    { label: "Humidité Serre", value: "72%", status: "optimal", icon: "💧" },
    { label: "Hydratation Sol", value: "84%", status: "ok", icon: "🌱" },
    { label: "Stock Poulets", value: "342 unités", status: "live", icon: "🐔" },
    { label: "Proch. Récolte", value: "Demain 05h30", status: "live", icon: "⏰" },
    { label: "Proch. Navette", value: "Mercredi 18h", status: "scheduled", icon: "🚐" },
  ]);
  useEffect(() => {
    const iv = setInterval(() => {
      setMetrics(prev => prev.map((m, i) => {
        if (i === 0) return { ...m, value: `${(26 + Math.random() * 0.8).toFixed(1)}°C` };
        if (i === 1) return { ...m, value: `${Math.floor(70 + Math.random() * 5)}%` };
        if (i === 2) return { ...m, value: `${Math.floor(82 + Math.random() * 4)}%` };
        return m;
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  const statusColor = s => ({ optimal: "#4ade80", ok: C.terra, live: "#60a5fa", scheduled: "#a78bfa" }[s]);

  return (
    <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto", marginTop: 14 }}>
      <div className="grid-2-1">
        <div className="card" style={{ background: C.gray, border: "1px solid rgba(11,42,29,0.1)", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div className="pulse-dot" />
            <span className="tag">Goshen OS — Dashboard Temps Réel</span>
          </div>
          <h2 className="serif" style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 400, marginBottom: 10, color: C.green }}>
            Propulsé par <em>Goshen Agrofarm OS</em>
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: "#555", marginBottom: 20 }}>
            Notre système d'exploitation propriétaire monitore chaque paramètre en temps réel — de l'alimentation animale au suivi hydrique des cultures.
          </p>
          <div className="os-metrics" style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            {metrics.map(m => (
              <div key={m.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: `1px solid ${statusColor(m.status)}20`, transition: "all 0.5s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor(m.status), flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.04em" }}>{m.label}</span>
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{m.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: `${C.green}08`, borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${C.green}` }}>
            <p className="mono" style={{ fontSize: 11, color: C.green }}>⚡ Récolté le matin à Adzopé → Livré le soir à Abidjan</p>
          </div>
        </div>

        <div className="card" style={{ background: C.terra, padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>♻️</div>
            <div className="tag" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>Économie Circulaire</div>
            <h3 className="serif" style={{ fontSize: "clamp(22px,3vw,28px)", color: "#fff", fontWeight: 300, lineHeight: 1.2, marginBottom: 12 }}>Cycle 100%<br /><em>Intégré</em></h3>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.75 }}>
              Rien ne se perd, tout enrichit la terre. Les matières organiques de notre élevage nourrissent naturellement le sol de notre potager.
            </p>
          </div>
          <div style={{ marginTop: 20, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>🚫🧪</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Zéro intrant chimique agressif.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTION ROW ───────────────────────────────────────────────
function ProductionRow({ setPage }) {
  const items = [
    { side: "elevage", tag: C.terra, tagLabel: "Élevage d'Exception", title: "Le Cheptel de Prestige", list: [
      { img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&q=70", name: "Poulet Kuroiler Gastronomique", desc: "Chair ferme élevée au grain" },
      { img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=80&q=70", name: "Canard de Barbarie", desc: "Élevage extensif, viande dense" },
      { img: "https://images.unsplash.com/photo-1574068468507-7c8fd9b5ab8a?w=80&q=70", name: "Mouton Balami d'Exception", desc: "Race bouchère premium" },
    ]},
    { side: "potager", tag: C.green, tagLabel: "Le Potager Frais", title: "Cultures de Précision", list: [
      { img: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&q=70", name: "Manioc frais de la Mé", desc: "Vivrier d'exception — récolte hebdo" },
      { img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=80&q=70", name: "Gingembre ultra-aromatique", desc: "Séché ou frais — origine contrôlée" },
      { img: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&q=70", name: "Salades & Maraîcher", desc: "Courgettes, concombres, salades" },
    ]},
  ];
  return (
    <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto", marginTop: 14 }}>
      <div className="grid-2 prod-row">
        {items.map(col => (
          <div key={col.side} className="card card-pad" style={{ background: "#fff", border: "1px solid rgba(11,42,29,0.07)" }}>
            <div className="tag" style={{ color: col.tag, marginBottom: 10 }}>{col.tagLabel}</div>
            <h3 className="serif" style={{ fontSize: "clamp(20px,2.5vw,24px)", color: C.green, marginBottom: 16, fontWeight: 400 }}>{col.title}</h3>
            {col.list.map(a => (
              <div key={a.name} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f0f0", alignItems: "center" }}>
                <img src={a.img} alt={a.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{a.desc}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop: 18, fontSize: 13 }} onClick={() => setPage("shop")}>Commander →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGISTICS BLOCK ──────────────────────────────────────────────
function LogisticsBlock() {
  return (
    <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto", marginTop: 14 }}>
      <div className="card logistics-block" style={{ background: C.green, padding: "44px 48px", display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div className="tag" style={{ color: "rgba(200,107,69,0.8)", marginBottom: 10 }}>Logistique Premium</div>
          <h3 className="serif" style={{ fontSize: "clamp(26px,4vw,38px)", color: "#fff", fontWeight: 300, marginBottom: 12 }}>
            La Navette <em style={{ color: C.terra }}>Goshen</em>
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8 }}>
            Livraison premium à domicile sur tout Abidjan les <strong style={{ color: "#fff" }}>Mercredis et Samedis</strong> — caissons isothermes, dernier kilomètre à moto. Retrait Click & Collect à Adzopé tous les jours.
          </p>
        </div>
        <div style={{ display: "grid", gap: 10, minWidth: 230 }}>
          {[
            { icon: "🚐", label: "Mercredi & Samedi", sub: "Livraison tout Abidjan" },
            { icon: "🧊", label: "Caissons isothermes", sub: "Fraîcheur garantie" },
            { icon: "🏍️", label: "Dernier km à moto", sub: "Partout à Abidjan" },
            { icon: "📦", label: "Click & Collect", sub: "Adzopé — 7j/7 gratuit" },
          ].map(l => (
            <div key={l.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{l.icon}</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>{l.label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{l.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── OS TICKER ────────────────────────────────────────────────────
function OsTicker() {
  return (
    <div className="bento-pad" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 14, paddingBottom: 40 }}>
      <div style={{ background: C.green, borderRadius: 10, padding: "9px 0", overflow: "hidden" }}>
        <div className="os-ticker">
          <div className="os-ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
                GOSHEN OS v2.4.1 &nbsp;•&nbsp; ÉLEVAGE NOMINAL &nbsp;•&nbsp; NAVETTE MERCREDI 18H &nbsp;•&nbsp; STOCK : 342 POULETS · 18 CANARDS · 6 MOUTONS &nbsp;•&nbsp; MÉTÉO ADZOPÉ : 28°C &nbsp;•&nbsp; BIOSÉCURITÉ ACTIVE &nbsp;•&nbsp; excellence@goshenagrofarm.com &nbsp;•&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      <Slideshow setPage={setPage} />
      <AnimalGallery setPage={setPage} />
      <OsBlock />
      <ProductionRow setPage={setPage} />
      <LogisticsBlock />
      <OsTicker />
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [option, setOption] = useState(product.defaultOption || null);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const currentPrice = option && product.optionPrices ? product.price + (product.optionPrices[option] || 0) : product.price;
  const handleAdd = () => { onAdd({ ...product, price: currentPrice, option }); setAdded(true); setTimeout(() => setAdded(false), 1800); };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {!imgLoaded && (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${product.color}18, ${product.color}28)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
            {product.category === "L'Élevage d'Exception" ? "🐾" : "🌿"}
          </div>
        )}
        <img src={product.img} alt={product.name} onLoad={() => setImgLoaded(true)} style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%)" }} />
        {product.badge && <div style={{ position: "absolute", top: 12, right: 12 }}><span className="badge badge-white">{product.badge}</span></div>}
        {product.tag && <div style={{ position: "absolute", top: 12, left: 12 }}><span className="badge" style={{ background: C.terra, color: "#fff" }}>{product.tag}</span></div>}
      </div>
      <div style={{ padding: "18px 18px 20px" }}>
        <div className="tag" style={{ color: C.terra, marginBottom: 5 }}>{product.category}</div>
        <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 7, lineHeight: 1.35 }}>{product.name}</h4>
        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, marginBottom: 12 }}>{product.description}</p>
        {product.options && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
            {product.options.map(opt => (
              <div key={opt.value} className={`radio-opt${option === opt.value ? " selected" : ""}`} onClick={() => setOption(opt.value)}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", border: `2px solid ${option === opt.value ? C.green : "#ddd"}`, background: option === opt.value ? C.green : "transparent", display: "inline-block", flexShrink: 0 }} />
                {opt.label}{opt.extra && <span style={{ color: C.terra, fontWeight: 700 }}> {opt.extra}</span>}
              </div>
            ))}
          </div>
        )}
        {product.notice && (
          <div style={{ background: `${C.green}08`, borderRadius: 9, padding: "9px 11px", marginBottom: 12, fontSize: 12, color: C.green, lineHeight: 1.6 }}>{product.notice}</div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.green }}>{product.priceDisplay || `${currentPrice.toLocaleString()} CFA`}</div>
            {product.priceUnit && <div style={{ fontSize: 10, color: "#aaa" }}>{product.priceUnit}</div>}
          </div>
          {product.whatsappOnly ? (
            <a href={`https://wa.me/2250000000000?text=${encodeURIComponent(`Bonjour, je souhaite avoir une vidéo et valider l'achat d'un ${product.name}. Merci!`)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn" style={{ background: C.whatsapp, color: "#fff", fontSize: 12, padding: "9px 14px" }}>💬 WhatsApp</button>
            </a>
          ) : (
            <button className="btn btn-primary" style={{ fontSize: 13, padding: "9px 18px", background: added ? "#4ade80" : C.green }} onClick={handleAdd}>
              {added ? "✓ Ajouté !" : "Ajouter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────
function ShopPage({ onAdd }) {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const filters = ["Tous", "L'Élevage d'Exception", "Le Potager Frais"];
  const filtered = activeFilter === "Tous" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
  return (
    <div className="page-pad" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="shop-banner" style={{ borderRadius: 20, overflow: "hidden", marginBottom: 28, position: "relative", height: 200 }}>
        <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80" alt="Ferme Goshen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,42,29,0.88) 0%, rgba(11,42,29,0.4) 70%, transparent 100%)" }} />
        <div className="shop-banner-pad" style={{ position: "absolute", inset: 0, padding: "32px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="tag" style={{ color: "rgba(200,107,69,0.9)", marginBottom: 6 }}>Boutique en ligne</div>
          <h1 className="serif" style={{ fontSize: "clamp(22px,4vw,46px)", fontWeight: 300, color: "#fff", marginBottom: 6 }}>Nos Produits <em>d'Exception</em></h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Traçabilité totale · Récolté à Adzopé · Livré à Abidjan</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className="btn" style={{ background: activeFilter === f ? C.green : "#fff", color: activeFilter === f ? "#fff" : C.charcoal, border: `1.5px solid ${activeFilter === f ? C.green : "#e0e0e0"}`, fontSize: 12, padding: "9px 16px" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    </div>
  );
}

// ─── B2B PAGE ─────────────────────────────────────────────────────
function B2BPage() {
  const [form, setForm] = useState({ company: "", type: "", volume: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    const msg = `Bonjour Goshen Agrofarm 🌿\n\n*Demande B2B*\n\nEntreprise: ${form.company}\nType: ${form.type}\nVolume: ${form.volume}\nTél: ${form.phone}\n\n${form.message}\n\nMerci.`;
    window.open(`https://wa.me/2250000000000?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };
  return (
    <div className="page-pad" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="shop-banner" style={{ borderRadius: 20, overflow: "hidden", marginBottom: 28, position: "relative", height: 200 }}>
        <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80" alt="B2B" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,42,29,0.92) 0%, rgba(11,42,29,0.6) 100%)" }} />
        <div className="shop-banner-pad b2b-hero-inner" style={{ position: "absolute", inset: 0, padding: "32px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="tag" style={{ color: "rgba(200,107,69,0.8)", marginBottom: 6 }}>Partenaires Professionnels</div>
            <h1 className="serif" style={{ fontSize: "clamp(22px,4vw,46px)", fontWeight: 300, color: "#fff" }}>L'Espace B2B <em>Goshen</em></h1>
          </div>
          <div className="mono hide-mobile" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textAlign: "right" }}>
            CHEFS · HÔTELS · MAQUIS<br />TRAITEURS · ÉPICERIES FINES
          </div>
        </div>
      </div>

      <div className="b2b-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#555", marginBottom: 20 }}>
            Chefs étoilés, Maquis haut de gamme, traiteurs de prestige et hôtels de luxe à Abidjan : votre partenaire agricole de confiance.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {[
              { icon: "📊", img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&q=70", title: "Régularité Garantie", desc: "Approvisionnement planifié par Goshen OS avec forecasting et stocks dédiés." },
              { icon: "🔬", img: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=80&q=70", title: "Biosécurité Totale", desc: "Protocoles stricts à chaque étape. Traçabilité totale." },
              { icon: "🔗", img: null, title: "Traçabilité QR Code", desc: "QR code d'origine sur chaque bon de livraison." },
              { icon: "🧾", img: null, title: "Facturation Corporate", desc: "Factures avec numéro TVA conformes aux exigences comptables." },
            ].map(p => (
              <div key={p.title} style={{ display: "flex", gap: 14, padding: "15px 16px", background: "#fff", borderRadius: 14, border: "1px solid rgba(11,42,29,0.06)" }}>
                {p.img ? <img src={p.img} alt={p.title} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: 44, height: 44, borderRadius: 10, background: `${C.green}0a`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>}
                <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: C.green }}>{p.title}</div><div style={{ fontSize: 12, color: "#777", lineHeight: 1.55 }}>{p.desc}</div></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: C.green, padding: "20px 22px" }}>
            <div className="tag" style={{ color: "rgba(200,107,69,0.8)", marginBottom: 5 }}>Contact direct</div>
            <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
              📧 <span style={{ color: C.terra }}>excellence@goshenagrofarm.com</span><br />💬 WhatsApp professionnel disponible
            </p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid rgba(11,42,29,0.07)" }}>
          <h2 className="serif" style={{ fontSize: "clamp(18px,2.5vw,24px)", color: C.green, marginBottom: 5 }}>Demander notre Grille Tarifaire</h2>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Notre équipe vous répond sous 24h.</p>
          {sent ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <h3 className="serif" style={{ fontSize: 20, color: C.green }}>Message envoyé !</h3>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { key: "company", label: "NOM DE L'ENTREPRISE *", placeholder: "Ex : Hôtel Ivoire, Maquis La Terrasse..." },
                { key: "phone", label: "TÉLÉPHONE ACHETEUR DIRECT *", placeholder: "+225 XX XX XX XX" },
                { key: "volume", label: "VOLUME MENSUEL ESTIMÉ", placeholder: "Ex : 50 poulets/mois..." },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>TYPE D'ACTIVITÉ *</label>
                <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  <option>Restaurant / Maquis haut de gamme</option>
                  <option>Hôtel de luxe</option>
                  <option>Traiteur / Catering</option>
                  <option>Chef cuisinier indépendant</option>
                  <option>Supermarché / Épicerie fine</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>MESSAGE COMPLÉMENTAIRE</label>
                <textarea className="form-input" rows={3} placeholder="Précisez vos besoins..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <button className="btn btn-primary" style={{ fontSize: 14, padding: "14px", borderRadius: 14, width: "100%" }} onClick={handleSubmit}>
                Demander la Grille & Planifier une Visite →
              </button>
              <p style={{ fontSize: 10, color: "#aaa", textAlign: "center" }}>Redirige vers WhatsApp pour finaliser.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LOGISTICS PAGE ───────────────────────────────────────────────
function LogisticsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", subject: "Commande / Livraison" });
  const [sent, setSent] = useState(false);
  return (
    <div className="page-pad" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="tag" style={{ color: C.terra, marginBottom: 6 }}>Logistique & Contact</div>
        <h1 className="serif" style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 300, color: C.green }}>Trouver & <em>Nous Contacter</em></h1>
      </div>

      <div className="grid-13-1 contact-grid" style={{ marginBottom: 16 }}>
        <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 360 }}>
          <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80" alt="Ferme" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,42,29,0.95) 0%, rgba(11,42,29,0.4) 55%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
            <div className="tag" style={{ color: "rgba(200,107,69,0.8)", marginBottom: 10 }}>Nos sites</div>
            {[
              { emoji: "🌱", label: "Ferme Goshen", city: "Adzopé, Région de la Mé", note: "Production · Visite sur RDV" },
              { emoji: "🏬", label: "Hub Logistique", city: "Deux-Plateaux Vallons, Abidjan", note: "Transit · Livraisons Mer & Sam" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", gap: 12, marginBottom: 10, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", backdropFilter: "blur(4px)" }}>
                <span style={{ fontSize: 22 }}>{l.emoji}</span>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{l.label} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 11 }}>· {l.city}</span></div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 1 }}>{l.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "📧", label: "Email professionnel", value: "excellence@goshenagrofarm.com", link: "mailto:excellence@goshenagrofarm.com" },
            { icon: "💬", label: "WhatsApp direct", value: "+225 XX XX XX XX", link: "https://wa.me/2250000000000" },
            { icon: "📞", label: "Téléphone ferme", value: "+225 XX XX XX XX", link: "tel:+225XXXXXXXX" },
          ].map(c => (
            <div key={c.label} className="card" style={{ background: "#fff", padding: "18px 20px", border: "1px solid rgba(11,42,29,0.06)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
              <div className="tag" style={{ marginBottom: 3 }}>{c.label}</div>
              <a href={c.link} style={{ fontWeight: 700, fontSize: 14, color: C.green, textDecoration: "none", wordBreak: "break-all" }}>{c.value}</a>
            </div>
          ))}
          <div className="card" style={{ background: C.terra, padding: "18px 20px" }}>
            <div className="tag" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>La Navette Goshen</div>
            {["🗓 Livraisons : Mercredis & Samedis", "📦 Click & Collect : 7j/7 à Adzopé", "🧊 Transport isotherme inclus", "🏍️ Dernier km à moto · Abidjan"].map(t => (
              <div key={t} style={{ color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: "#fff", padding: "32px 24px", border: "1px solid rgba(11,42,29,0.06)" }}>
        <h2 className="serif" style={{ fontSize: "clamp(20px,3vw,26px)", color: C.green, marginBottom: 20 }}>Envoyer un Message</h2>
        {sent ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
            <p className="serif" style={{ fontSize: 20, color: C.green }}>Message reçu. Merci !</p>
          </div>
        ) : (
          <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { key: "name", label: "NOM COMPLET", placeholder: "Jean-Baptiste Koné" },
              { key: "email", label: "EMAIL", placeholder: "jb.kone@email.com" },
              { key: "phone", label: "TÉLÉPHONE", placeholder: "+225 XX XX XX XX" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>{f.label}</label>
                <input className="form-input" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>SUJET</label>
              <select className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option>Commande / Livraison</option><option>Partenariat B2B</option><option>Visite de la ferme</option><option>Autre demande</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>MESSAGE</label>
              <textarea className="form-input" rows={4} placeholder="Décrivez votre demande..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button className="btn btn-primary" style={{ fontSize: 14, padding: "14px 28px", borderRadius: 14 }} onClick={() => setSent(true)}>
                Envoyer le Message →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: C.green, padding: "40px 16px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gap: 32, marginBottom: 32 }}>
          <div>
            <div className="serif" style={{ fontSize: 22, color: "#fff", marginBottom: 3 }}>Goshen Agrofarm</div>
            <div className="mono" style={{ fontSize: 8, color: C.terra, letterSpacing: "0.18em", marginBottom: 14 }}>ADZOPÉ · CÔTE D'IVOIRE</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: 300 }}>
              De notre ferme à votre table : l'excellence agro-pastorale durable à Adzopé. Une agriculture de précision au service de la gastronomie ivoirienne.
            </p>
          </div>
          <div>
            <div className="tag" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Navigation</div>
            {[["home", "Accueil"], ["shop", "Boutique"], ["b2b", "Espace B2B"], ["logistics", "Contact"]].map(([id, label]) => (
              <div key={id} style={{ marginBottom: 10, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)" }}
                onClick={() => setPage(id)}
                onMouseOver={e => e.currentTarget.style.color = C.terra}
                onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >{label}</div>
            ))}
          </div>
          <div>
            <div className="tag" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Contact</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 2 }}>
              <div>📧 excellence@goshenagrofarm.com</div>
              <div>💬 WhatsApp sur commande</div>
              <div>📍 Adzopé, Région de la Mé</div>
              <div>🚐 Livraisons Mer. & Sam. · Abidjan</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em" }}>© 2025 GOSHEN AGROFARM — OS v2.4.1</span>
          <span className="mono" style={{ fontSize: 9, color: "rgba(200,107,69,0.5)", letterSpacing: "0.08em" }}>TERROIR & TECHNOLOGIE</span>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items, add, remove, updateQty, total, count } = useCart();
  const navTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <Styles />
      <Navbar page={page} setPage={navTo} cartCount={count} setDrawerOpen={setDrawerOpen} />
      <CheckoutDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={items} updateQty={updateQty} remove={remove} total={total} />
      <main>
        {page === "home" && <HomePage setPage={navTo} />}
        {page === "shop" && <ShopPage onAdd={(p) => { add(p); setDrawerOpen(true); }} />}
        {page === "b2b" && <B2BPage />}
        {page === "logistics" && <LogisticsPage />}
      </main>
      <Footer setPage={navTo} />
    </>
  );
}
