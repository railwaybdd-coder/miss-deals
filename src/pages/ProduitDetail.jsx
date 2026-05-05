import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { usePanier } from '../context/PanierContext'
import ProduitCard from '../components/ProduitCard'
import { FlowerSVG } from '../App'

const TAILLES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COULEURS = ['Noir', 'Blanc', 'Gris', 'Beige', 'Kaki']

const fcfa = (prix) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(prix) + ' F CFA'

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

const IcoBack = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
  </svg>
)
const IcoCheck = () => (
  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IcoBag = () => (
  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IcoTruck = () => (
  <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const IcoShield = () => (
  <svg width="14" height="14" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IcoRefresh = () => (
  <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)
const IcoError = () => (
  <svg width="14" height="14" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

export default function ProduitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ajouterAuPanier } = usePanier()

  const [produit, setProduit]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [taille, setTaille]         = useState(null)
  const [couleur, setCouleur]       = useState(null)
  const [added, setAdded]           = useState(false)
  const [imgLoaded, setImgLoaded]   = useState(false)
  const [error, setError]           = useState('')
  const [similaires, setSimilaires] = useState([])
  const [activeImg, setActiveImg]   = useState(0)

  useEffect(() => {
    setTaille(null); setCouleur(null); setAdded(false); setError('')
    setLoading(true); setActiveImg(0); setImgLoaded(false)
    supabase.from('produits').select('*').eq('id', id).single().then(({ data }) => {
      setProduit(data)
      setLoading(false)
      if (data?.categorie) {
        supabase.from('produits').select('*').eq('categorie', data.categorie).neq('id', id).limit(4)
          .then(({ data: sim }) => { if (sim) setSimilaires(sim) })
      }
    })
  }, [id])

  const handleAdd = () => {
    if (!taille)  { setError('Veuillez sélectionner une taille');  return }
    if (!couleur) { setError('Veuillez sélectionner une couleur'); return }
    setError('')
    ajouterAuPanier({ ...produit, taille, couleur })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ borderRadius: 20, background: '#f5edf3', aspectRatio: '3/4', maxHeight: 340, marginBottom: 24 }} className="shimmer" />
      {[80, 50, 70].map((w, i) => (
        <div key={i} className="shimmer" style={{ height: 16, width: `${w}%`, borderRadius: 8, marginBottom: 16 }} />
      ))}
    </div>
  )

  if (!produit) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <FlowerSVG size={44} className="deco-flower" style={{ opacity: 0.35, marginBottom: 16 }} />
      <p style={{ fontFamily: 'Josefin Sans', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Produit introuvable.</p>
    </div>
  )

  const images = parseImages(produit)
  const imgSrc = images[activeImg] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=85'
  const estEpuise = produit.stock === 0
  const stockFaible = produit.stock > 0 && produit.stock < 5

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          margin-bottom: 60px;
        }
        @media (min-width: 768px) {
          .detail-grid { grid-template-columns: repeat(2, 1fr); gap: 56px; }
        }

        .catalogue-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) {
          .catalogue-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (min-width: 1024px) {
          .catalogue-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        /* Sélecteurs taille / couleur */
        .sel-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 9px 16px;
          border-radius: 8px;
          border: 1.5px solid #e2c8d6;
          background: white;
          color: #6b3a56;
          cursor: pointer;
          transition: all 0.18s;
        }
        .sel-btn:hover { border-color: #d63a7a; color: #d63a7a; }
        .sel-btn.active {
          background: #d63a7a;
          border-color: #d63a7a;
          color: white;
        }

        /* Prix bloc — plein écran mobile */
        .detail-prix-bloc {
          background: linear-gradient(135deg, #fff0f8, #fce8f4);
          border: 2px solid #f2cfe0;
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 20px;
        }
        .detail-prix-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b07898;
          margin: 0 0 4px;
        }
        .detail-prix-chiffre {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 9vw, 54px);
          font-weight: 700;
          color: #c42170;
          line-height: 1;
          margin: 0;
        }
        .detail-prix-devise {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #d4589a;
          letter-spacing: 0.1em;
          margin: 4px 0 0;
        }

        /* Avantages */
        .avantage-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          background: white;
          border: 1.5px solid #f0e6ed;
          border-radius: 10px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          color: #6b3a56;
          font-weight: 600;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* Bouton principal */
        .btn-add-panier {
          width: 100%;
          padding: 17px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
        }
        .btn-add-panier.normal {
          background: #d63a7a;
          color: white;
        }
        .btn-add-panier.normal:hover { background: #b82e65; }
        .btn-add-panier.normal:active { transform: scale(0.98); }
        .btn-add-panier.success { background: #16a34a; color: white; }
        .btn-add-panier.epuise { background: #d6c0cc; color: #8a6070; cursor: not-allowed; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 14px', position: 'relative', zIndex: 1 }}>

        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)', fontFamily: 'Josefin Sans', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28 }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--rose)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <IcoBack /> Retour au catalogue
        </button>

        <div className="detail-grid">

          {/* ── Colonne image ── */}
          <div>
            <div style={{
              borderRadius: 20, overflow: 'hidden',
              background: '#fdf0f6',
              position: 'relative',
              aspectRatio: '3/4',
              marginBottom: images.length > 1 ? 10 : 0,
              boxShadow: '0 20px 60px rgba(190,60,120,0.16)',
            }}>
              <img
                src={imgSrc}
                alt={produit.nom}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  background: '#fffafd',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.5s',
                  display: 'block',
                }}
              />
              {/* Badge catégorie */}
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: 999, padding: '5px 14px' }}>
                <span style={{ fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3a1028' }}>{produit.categorie}</span>
              </div>
              {stockFaible && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#d63a7a', borderRadius: 999, padding: '5px 12px' }}>
                  <span style={{ fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, color: 'white', letterSpacing: '0.08em' }}>Dernières pièces</span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                {images.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => { setActiveImg(i); setImgLoaded(false) }}
                    style={{
                      width: 64, height: 64, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      border: i === activeImg ? '2.5px solid #d63a7a' : '2px solid #f0e6ed',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Colonne infos ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <FlowerSVG size={14} className="deco-flower" />
              <div className="accent-line line-accent-anim" />
            </div>

            <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{produit.categorie}</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(22px,5vw,38px)', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.08, marginBottom: 20 }}>
              {produit.nom}
            </h1>

            {/* ── Prix — zone vedette ── */}
            <div className="detail-prix-bloc">
              <p className="detail-prix-label">Prix</p>
              <p className="detail-prix-chiffre">
                {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(produit.prix)}
              </p>
              <p className="detail-prix-devise">Francs CFA (FCFA)</p>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--text-body)', marginBottom: 22, fontFamily: 'Josefin Sans', letterSpacing: '0.03em' }}>
              {produit.description || 'Pièce premium de la collection Miss Deals. Coupe soignée, matières de qualité, finitions impeccables.'}
            </p>

            {/* Avantages */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
              <div className="avantage-badge"><IcoTruck /> Livraison offerte</div>
              <div className="avantage-badge"><IcoShield /> Qualité garantie</div>
              <div className="avantage-badge"><IcoRefresh /> Retour 30j</div>
            </div>

            <div style={{ height: 1, background: '#f0e6ed', marginBottom: 20 }} />

            {/* Taille */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 700 }}>
                Taille {taille && <span style={{ color: '#d63a7a', marginLeft: 6 }}>→ {taille}</span>}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TAILLES.map(t => (
                  <button key={t} onClick={() => setTaille(t)} className={`sel-btn${taille === t ? ' active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Couleur */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 700 }}>
                Couleur {couleur && <span style={{ color: '#d63a7a', marginLeft: 6 }}>→ {couleur}</span>}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COULEURS.map(c => (
                  <button key={c} onClick={() => setCouleur(c)} className={`sel-btn${couleur === c ? ' active' : ''}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff1f2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                <IcoError />
                <span style={{ fontFamily: 'Josefin Sans', fontSize: 11, color: '#dc2626', fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* Bouton principal */}
            <button
              onClick={handleAdd}
              disabled={estEpuise}
              className={`btn-add-panier${added ? ' success' : estEpuise ? ' epuise' : ' normal'}`}
            >
              {added ? (
                <><IcoCheck /> Ajouté au panier !</>
              ) : estEpuise ? 'Article épuisé' : (
                <><IcoBag /> Ajouter au panier</>
              )}
            </button>

            {stockFaible && (
              <p style={{ textAlign: 'center', fontFamily: 'Josefin Sans', fontSize: 11, color: '#d63a7a', marginTop: 10, fontWeight: 700, letterSpacing: '0.06em' }}>
                ⚠ Plus que {produit.stock} article{produit.stock > 1 ? 's' : ''} disponible{produit.stock > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {similaires.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <FlowerSVG size={14} className="deco-flower" />
              <div className="accent-line" style={{ width: 24, flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>Du même univers</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: 'var(--text-heading)' }}>Vous aimerez aussi</h2>
              </div>
            </div>
            <div className="catalogue-grid">
              {similaires.map((p, i) => {
                const imgs = parseImages(p)
                return <ProduitCard key={p.id} produit={{ ...p, image_url: imgs[0] || p.image_url }} index={i} />
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}