import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProduitCard from '../components/ProduitCard'
import { FlowerSVG } from '../App'

function parseImages(p) {
  if (!p) return []
  if (p.images_url) {
    try {
      const arr = JSON.parse(p.images_url)
      if (Array.isArray(arr) && arr.length) return arr.filter(u => u?.startsWith('http'))
    } catch {}
  }
  return p.image_url ? [p.image_url] : []
}

/* Icônes SVG thématiques */
const Icon = {
  Star: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Zap: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Bag: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  Arrow: (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Award: (
    <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Truck: (
    <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Refresh: (
    <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.65"/>
    </svg>
  ),
  Msg: (
    <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Rocket: (
    <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  Gift: (
    <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
}

export default function Catalogue() {
  const [produits, setProduits]     = useState([])
  const [categories, setCategories] = useState([])
  const [filtre, setFiltre]         = useState('Tout')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    supabase.from('produits').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setProduits(data)
        setCategories(['Tout', ...new Set(data.map(p => p.categorie).filter(Boolean))])
      }
      setLoading(false)
    })
  }, [])

  const produitsFiltres = filtre === 'Tout' ? produits : produits.filter(p => p.categorie === filtre)
  const vedettes   = produits.filter(p => p.vedette && p.stock > 0)
  const nouveautes = [...produits].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)

  const voirTout = () => {
    setFiltre('Tout')
    setTimeout(() => document.getElementById('catalogue-complet')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const renderGrille = (liste) => (
    <div className="catalogue-grid">
      {liste.map((p, i) => {
        const imgs = parseImages(p)
        return <ProduitCard key={p.id} produit={{ ...p, image_url: imgs[0] || p.image_url }} index={i} />
      })}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', position: 'relative', overflowX: 'hidden' }}>

      <style>{`
        @keyframes floatSlow { from { transform: translate(0,0); } to { transform: translate(28px,45px); } }

        /* ── Mobile-first catalogue grid ── */
        .catalogue-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 480px) {
          .catalogue-grid { gap: 16px; }
        }
        @media (min-width: 768px) {
          .catalogue-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
          }
        }
        @media (min-width: 1100px) {
          .catalogue-grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* ── Bannière promo responsive ── */
        .promo-banner {
          flex-direction: column !important;
          align-items: flex-start !important;
          padding: 28px 24px !important;
        }
        @media (min-width: 640px) {
          .promo-banner {
            flex-direction: row !important;
            align-items: center !important;
            padding: 38px 44px !important;
          }
        }

        /* ── Pourquoi grid ── */
        .pourquoi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 768px) {
          .pourquoi-grid { grid-template-columns: repeat(4, 1fr); gap: 22px; }
        }
      `}</style>

      {/* Orbes ambiants */}
      <div style={{ position: 'fixed', top: '-5%', right: '-5%', zIndex: 0, pointerEvents: 'none', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,100,180,0.1) 0%, transparent 70%)', filter: 'blur(55px)', animation: 'floatSlow 22s infinite alternate ease-in-out' }} />
      <div style={{ position: 'fixed', top: '42%', left: '-10%', zIndex: 0, pointerEvents: 'none', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,100,225,0.09) 0%, transparent 75%)', filter: 'blur(65px)', animation: 'floatSlow 28s infinite alternate-reverse ease-in-out' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '5%', zIndex: 0, pointerEvents: 'none', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,180,220,0.05) 0%, transparent 80%)', filter: 'blur(85px)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 16px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <FlowerSVG size={16} className="deco-flower" />
            <div className="accent-line line-accent-anim" />
            <FlowerSVG size={13} className="deco-flower-fast" style={{ animationDelay: '0.8s' }} />
          </div>
          <h1 className="font-display section-title" style={{ fontSize: 'clamp(30px, 6vw, 58px)', marginBottom: 8 }}>
            Notre Collection
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 460, fontFamily: 'Josefin Sans', letterSpacing: '0.04em', lineHeight: 1.75 }}>
            Pièces tendance, qualité premium. Miss Deals, c'est le style sans compromis.
          </p>
        </div>

        {/* ── Vedettes ── */}
        {vedettes.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <p className="section-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                  {Icon.Star} Sélection Coup de Cœur
                </p>
                <h2 className="font-display section-title" style={{ fontSize: 'clamp(20px,4vw,28px)' }}>Produits Vedettes</h2>
              </div>
              <button onClick={voirTout} className="btn-outline" style={{ padding: '8px 18px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
                Tout voir {Icon.Arrow}
              </button>
            </div>
            {renderGrille(vedettes)}
          </section>
        )}

        {/* ── Nouveautés ── */}
        {nouveautes.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div className="fade-up delay-2" style={{ marginBottom: 20 }}>
              <p className="section-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                {Icon.Zap} Nouveaux Arrivages
              </p>
              <h2 className="font-display section-title" style={{ fontSize: 'clamp(20px,4vw,28px)' }}>Dernières Nouveautés</h2>
            </div>
            {renderGrille(nouveautes)}
          </section>
        )}

        {/* ── Bannière promo ── */}
        <div className="fade-up delay-2 promo-banner" style={{
          background: 'linear-gradient(135deg, var(--rose-deep), var(--mauve))',
          borderRadius: 24,
          marginBottom: 52,
          display: 'flex',
          gap: 22,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(200,80,140,0.35)',
        }}>
          {/* Cercles déco */}
          <div style={{ position: 'absolute', right: -50, top: -50, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 70, bottom: -70, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, opacity: 0.28, animation: 'bloom 5.5s ease-in-out infinite' }}>
            <FlowerSVG size={36} style={{ filter: 'brightness(10)' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 130, opacity: 0.22, animation: 'bloom 8s ease-in-out infinite 1.5s' }}>
            <FlowerSVG size={24} style={{ filter: 'brightness(10)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.52)', marginBottom: 8 }}>
              Offre Exclusive Miss Deals
            </p>
            <h3 className="font-display" style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: 'white', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              {Icon.Rocket} Livraison Offerte
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, fontFamily: 'Josefin Sans', letterSpacing: '0.04em' }}>
              Sur toutes vos commandes — Partout au Sénégal
            </p>
          </div>

          <div style={{ animation: 'float-badge 3.5s ease-in-out infinite', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 22, padding: '18px 28px', textAlign: 'center', transform: 'rotate(-2deg)', border: '1px solid rgba(255,255,255,0.32)', flexShrink: 0 }}>
            <p className="font-script" style={{ fontSize: 34, lineHeight: 1 }}>100%</p>
            <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.82, marginTop: 4 }}>GRATUITE</p>
          </div>
        </div>

        {/* ── Catalogue complet ── */}
        <section id="catalogue-complet" style={{ marginBottom: 70 }}>
          <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                {Icon.Bag} Catalogue Complet
              </p>
              <h2 className="font-display section-title" style={{ fontSize: 'clamp(20px,4vw,28px)' }}>Toute la Collection</h2>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Josefin Sans', letterSpacing: '0.08em' }}>
              {loading ? '…' : `${produitsFiltres.length} article${produitsFiltres.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filtres */}
          <div className="fade-up delay-1" style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', marginBottom: 28, paddingBottom: 6, scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFiltre(cat)} className={`filter-chip ${filtre === cat ? 'active' : ''}`}>{cat}</button>
            ))}
          </div>

          {/* Grille ou skeletons */}
          {loading ? (
            <div className="catalogue-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ borderRadius: '1.4rem', overflow: 'hidden' }}>
                  <div className="shimmer" style={{ aspectRatio: '3/4' }} />
                  <div style={{ padding: '10px 0' }}>
                    <div className="shimmer" style={{ height: 13, borderRadius: 8, marginBottom: 8 }} />
                    <div className="shimmer" style={{ height: 11, borderRadius: 8, width: '58%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : produitsFiltres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 0' }}>
              <FlowerSVG size={44} className="deco-flower" style={{ marginBottom: 16, opacity: 0.4 }} />
              <p style={{ color: 'var(--text-muted)', fontFamily: 'Josefin Sans', fontSize: 14, letterSpacing: '0.06em' }}>
                Aucun produit dans cette catégorie.
              </p>
            </div>
          ) : renderGrille(produitsFiltres)}
        </section>

        {/* ── Pourquoi Miss Deals ── */}
        <section className="fade-up" style={{ marginBottom: 70 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <FlowerSVG size={15} className="deco-flower" />
              <p className="section-label">Notre Engagement</p>
              <FlowerSVG size={15} className="deco-flower" style={{ animationDelay: '1s' }} />
            </div>
            <h2 className="font-display section-title" style={{ fontSize: 'clamp(20px,4vw,30px)' }}>
              Pourquoi choisir Miss Deals ?
            </h2>
          </div>

          <div className="pourquoi-grid">
            {[
              { icon: Icon.Award,   titre: 'Qualité Premium',  desc: 'Pièces soigneusement sélectionnées pour vous.' },
              { icon: Icon.Truck,   titre: 'Livraison Rapide',  desc: 'Expédition express, offerte au Sénégal.' },
              { icon: Icon.Refresh, titre: 'Retours Faciles',   desc: 'Retour simple et gratuit sous 30 jours.' },
              { icon: Icon.Msg,     titre: 'Support WhatsApp',  desc: 'Miss Deals vous répond 7j/7 avec le sourire.' },
            ].map((item, i) => (
              <div key={item.titre} className={`fade-up delay-${i + 1} admin-card`} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ color: 'var(--rose)', margin: '0 auto 12px', display: 'flex', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 8 }}>{item.titre}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, fontFamily: 'Josefin Sans', letterSpacing: '0.03em' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}