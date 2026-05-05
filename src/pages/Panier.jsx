import { useState } from 'react'
import { usePanier } from '../context/PanierContext'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { FlowerSVG } from '../App'

const NUMERO_WHATSAPP = '221784219804'

const fcfa = (prix) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(prix) + ' F CFA'

/* Icônes */
const IcoWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IcoTrash = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
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
const IcoArrow = () => (
  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IcoLock = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function Panier() {
  const navigate = useNavigate()
  const { panier, retirerDuPanier, viderPanier, total, ajouterAuPanier } = usePanier()
  const [nom, setNom]             = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse]     = useState('')
  const [envoye, setEnvoye]       = useState(false)
  const [loading, setLoading]     = useState(false)

  const augmenter = (p) => ajouterAuPanier(p)
  const diminuer  = (p) => {
    retirerDuPanier(p.id)
    if (p.quantite > 1) {
      for (let i = 0; i < p.quantite - 1; i++) ajouterAuPanier(p)
    }
  }

  const passerCommande = async () => {
    if (!nom.trim()) { alert('Merci de renseigner votre nom'); return }
    if (panier.length === 0) return
    setLoading(true)
    const { error } = await supabase.from('commandes').insert({
      client_nom: nom, client_telephone: telephone,
      client_adresse: adresse, articles: panier, total, statut: 'en_attente',
    })
    if (error) { alert('Erreur. Réessaye.'); setLoading(false); return }
    const lignes = panier.map(p =>
      `• ${p.nom}${p.taille ? ` (${p.taille} / ${p.couleur})` : ''} ×${p.quantite} — ${fcfa(p.prix * p.quantite)}`
    ).join('\n')
    const message = `🌸 *Nouvelle commande Miss Deals*\n\n*Cliente :* ${nom}\n*Tél :* ${telephone || 'Non renseigné'}\n*Adresse :* ${adresse || 'Non précisée'}\n\n*Articles :*\n${lignes}\n\n*TOTAL : ${fcfa(total)}*\n\nMerci de votre confiance ! 🛍️`
    viderPanier(); setEnvoye(true); setLoading(false)
    window.location.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`
  }

  /* Confirmation */
  if (envoye) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ marginBottom: 20 }}>
        <FlowerSVG size={64} className="deco-flower" style={{ filter: 'drop-shadow(0 0 18px rgba(214,58,122,0.45))' }} />
      </div>
      <h2 className="font-display" style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 700, color: 'var(--text-heading)', marginBottom: 12 }}>
        Commande envoyée !
      </h2>
      <p style={{ color: 'var(--text-body)', maxWidth: 380, lineHeight: 1.85, fontFamily: 'Josefin Sans', fontSize: 13, letterSpacing: '0.04em' }}>
        Miss Deals vous contacte sur WhatsApp pour confirmer votre commande. Merci de nous faire confiance !
      </p>
      <Link to="/catalogue" className="btn-primary" style={{ marginTop: 28, padding: '14px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
        Continuer mes achats <IcoArrow />
      </Link>
    </div>
  )

  const nbArticles = panier.reduce((a, p) => a + p.quantite, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <style>{`
        .panier-wrap {
          max-width: 860px;
          margin: 0 auto;
          padding: 32px 14px 70px;
        }
        @media (min-width: 600px) {
          .panier-wrap { padding: 50px 28px 80px; }
        }

        /* Article row */
        .article-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1.5px solid #f0e6ed;
        }
        .article-img {
          width: 76px;
          height: 96px;
          object-fit: cover;
          border-radius: 14px;
          flex-shrink: 0;
          cursor: pointer;
          display: block;
          box-shadow: 0 6px 20px rgba(190,60,120,0.14);
        }
        @media (min-width: 480px) {
          .article-img { width: 88px; height: 110px; }
        }

        /* Quantité */
        .qty-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f8eff5;
          border-radius: 10px;
          overflow: hidden;
          width: fit-content;
          border: 1.5px solid #f0e6ed;
        }
        .qty-btn-v2 {
          background: none;
          border: none;
          cursor: pointer;
          width: 34px;
          height: 34px;
          font-size: 18px;
          color: #c42170;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.16s;
        }
        .qty-btn-v2:hover { background: #fce8f4; }
        .qty-val {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1e0815;
          min-width: 28px;
          text-align: center;
        }

        /* Prix article */
        .article-prix {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: #c42170;
          white-space: nowrap;
        }

        /* Récap total */
        .recap-bloc {
          background: linear-gradient(135deg, #fff0f8, #fce8f4);
          border: 2px solid #f2cfe0;
          border-radius: 16px;
          padding: 18px 20px;
          margin-top: 12px;
        }
        .recap-ligne {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .recap-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          color: #b07898;
          letter-spacing: 0.06em;
        }
        .recap-total-chiffre {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 700;
          color: #c42170;
          line-height: 1;
        }
        .recap-total-devise {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #d4589a;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        /* Formulaire */
        .form-card {
          background: white;
          border: 1.5px solid #f0e6ed;
          border-radius: 20px;
          padding: 22px 16px;
          box-shadow: 0 8px 36px rgba(190,60,120,0.09);
        }
        @media (min-width: 480px) {
          .form-card { padding: 28px 26px; border-radius: 24px; }
        }

        /* Bouton WhatsApp */
        .btn-wa {
          width: 100%;
          padding: 17px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          background: #25d366;
          color: white;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.18s;
          box-sizing: border-box;
          margin-top: 20px;
        }
        .btn-wa:hover { background: #1ebe5a; }
        .btn-wa:active { transform: scale(0.98); }
        .btn-wa:disabled { background: #9de8bb; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="panier-wrap">

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FlowerSVG size={16} className="deco-flower" />
            <div className="accent-line line-accent-anim" />
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(28px,6vw,50px)', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            Mon Panier
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, fontFamily: 'Josefin Sans', letterSpacing: '0.08em' }}>
            {panier.length === 0
              ? "Votre panier est vide pour l'instant"
              : `${nbArticles} article${nbArticles > 1 ? 's' : ''} sélectionné${nbArticles > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Panier vide */}
        {panier.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg width="70" height="70" fill="none" stroke="#d63a7a" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.4, marginBottom: 20 }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Josefin Sans', fontSize: 14, marginBottom: 26, letterSpacing: '0.06em' }}>
              Votre panier vous attend ! Découvrez nos articles tendance.
            </p>
            <Link to="/catalogue" className="btn-primary" style={{ padding: '14px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              Voir le catalogue <IcoArrow />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Articles */}
            <div>
              {panier.map((p, i) => (
                <div key={`${p.id}-${p.taille}-${p.couleur}`} className="article-row">
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                    alt={p.nom}
                    className="article-img"
                    onClick={() => navigate(`/produit/${p.id}`)}
                  />

                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p className="font-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.nom}
                    </p>
                    {(p.taille || p.couleur) && (
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, fontFamily: 'Josefin Sans', letterSpacing: '0.07em' }}>
                        {[p.taille, p.couleur].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {/* Quantité */}
                    <div className="qty-wrap">
                      <button className="qty-btn-v2" onClick={() => diminuer(p)}>−</button>
                      <span className="qty-val">{p.quantite}</span>
                      <button className="qty-btn-v2" onClick={() => augmenter(p)}>+</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p className="article-prix">
                        {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(p.prix * p.quantite)}
                      </p>
                      <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, color: '#d4589a', fontWeight: 700, letterSpacing: '0.08em', margin: 0 }}>F CFA</p>
                    </div>
                    <button
                      onClick={() => retirerDuPanier(p.id)}
                      title="Supprimer"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c8b0be', transition: 'color 0.2s, transform 0.2s', display: 'flex' }}
                      onMouseOver={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.transform = 'scale(1.2)' }}
                      onMouseOut={e => { e.currentTarget.style.color = '#c8b0be'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <IcoTrash />
                    </button>
                  </div>
                </div>
              ))}

              {/* Récapitulatif total */}
              <div className="recap-bloc">
                <div className="recap-ligne">
                  <span className="recap-label">Sous-total</span>
                  <span style={{ fontFamily: 'Josefin Sans', fontWeight: 700, fontSize: 13, color: '#3a1028' }}>
                    {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(total)} F CFA
                  </span>
                </div>
                <div className="recap-ligne" style={{ marginBottom: 14 }}>
                  <span className="recap-label">Livraison</span>
                  <span style={{ color: '#16a34a', fontFamily: 'Josefin Sans', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IcoTruck /> Offerte
                  </span>
                </div>
                <div style={{ height: 1, background: '#f2cfe0', marginBottom: 14 }} />
                <div>
                  <p style={{ fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b07898', marginBottom: 4 }}>Total à payer</p>
                  <p className="recap-total-chiffre">
                    {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(total)}
                  </p>
                  <p className="recap-total-devise">Francs CFA (FCFA)</p>
                </div>
              </div>
            </div>

            {/* Formulaire commande */}
            <div className="form-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <FlowerSVG size={20} className="deco-flower" />
                <h2 className="font-display" style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                  Vos coordonnées
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Nom */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 7 }}>
                    <svg width="13" height="13" fill="none" stroke="#d63a7a" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Nom complet *
                  </label>
                  <input type="text" placeholder="Votre prénom et nom" value={nom} onChange={e => setNom(e.target.value)} className="wyl-input" />
                </div>

                {/* Téléphone */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 7 }}>
                    <svg width="13" height="13" fill="none" stroke="#d63a7a" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 17z"/></svg>
                    Téléphone
                  </label>
                  <input type="tel" placeholder="+221 7X-XXX-XX-XX" value={telephone} onChange={e => setTelephone(e.target.value)} className="wyl-input" />
                </div>

                {/* Adresse */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 7 }}>
                    <svg width="13" height="13" fill="none" stroke="#d63a7a" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Adresse de livraison
                  </label>
                  <input type="text" placeholder="Quartier, Ville, Sénégal" value={adresse} onChange={e => setAdresse(e.target.value)} className="wyl-input" />
                </div>
              </div>

              {/* Récap commande dans le formulaire */}
              <div style={{ background: '#f8eff5', borderRadius: 12, padding: '12px 14px', marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Josefin Sans', fontSize: 11, color: '#8a5070', letterSpacing: '0.06em' }}>
                  {nbArticles} article{nbArticles > 1 ? 's' : ''}
                </span>
                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 700, color: '#c42170' }}>
                  {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(total)} <span style={{ fontSize: 12, fontFamily: 'Josefin Sans' }}>F CFA</span>
                </span>
              </div>

              {/* Bouton WhatsApp */}
              <button onClick={passerCommande} disabled={loading} className="btn-wa">
                {loading ? (
                  <>
                    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <IcoWhatsApp />
                    Commander via WhatsApp
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Josefin Sans', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <IcoLock /> Commande sécurisée · Miss Deals vous aime 🌸
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}