import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePanier } from '../context/PanierContext'

export const fcfa = (prix) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(prix) + ' F CFA'

const IcoCart = () => (
  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IcoCheck = () => (
  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IcoEye = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function ProduitCard({ produit, index = 0 }) {
  const navigate = useNavigate()
  const { ajouterAuPanier } = usePanier()
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    if (produit.stock === 0) return
    ajouterAuPanier(produit)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const estEpuise = produit.stock === 0
  const stockFaible = produit.stock > 0 && produit.stock < 5

  return (
    <>
      <style>{`
        .pcard {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1.5px solid #f0e6ed;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.28s, transform 0.28s;
          position: relative;
        }
        .pcard:active { transform: scale(0.98); }
        @media (hover: hover) {
          .pcard:hover { box-shadow: 0 12px 40px rgba(190,60,120,0.16); transform: translateY(-3px); }
        }

        .pcard-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #fdf0f6;
        }
        .pcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
          display: block;
        }
        @media (hover: hover) {
          .pcard:hover .pcard-img { transform: scale(1.06); }
        }

        .pcard-badge-epuise {
          position: absolute;
          inset: 0;
          background: rgba(255,245,250,0.80);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pcard-badge-stock {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #d63a7a;
          color: white;
          font-size: 10px;
          font-weight: 700;
          font-family: 'Josefin Sans', sans-serif;
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.06em;
        }

        /* Bouton voir — visible sur mobile au tap, hover desktop */
        .pcard-voir-btn {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          background: rgba(30,10,20,0.58);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          opacity: 0;
          transition: opacity 0.22s;
        }
        @media (hover: hover) {
          .pcard:hover .pcard-voir-btn { opacity: 1; }
        }

        /* ── Info ── */
        .pcard-info {
          padding: 12px 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .pcard-cat {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #b07898;
          margin: 0;
        }
        .pcard-nom {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 600;
          color: #1e0815;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.25;
        }

        /* Zone prix — la vedette */
        .pcard-prix-zone {
          margin-top: auto;
          background: linear-gradient(135deg, #fff0f8, #fce8f4);
          border: 1.5px solid #f2cfe0;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .pcard-prix-chiffre {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #c42170;
          line-height: 1;
          margin: 0;
        }
        .pcard-prix-devise {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #d4589a;
          letter-spacing: 0.06em;
          margin: 2px 0 0;
        }

        .pcard-btn-cart {
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #d63a7a;
  color: white;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s, transform 0.18s;
}
.pcard-btn-cart:active { transform: scale(0.97); }
.pcard-btn-cart.added { background: #16a34a; }
.pcard-btn-cart:disabled { background: #d6c0cc; cursor: not-allowed; }

        .pcard-stock-warn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          color: #d63a7a;
          font-weight: 700;
          text-align: center;
          background: #fff0f8;
          border-radius: 8px;
          padding: 5px 8px;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div
        className={`pcard fade-up delay-${Math.min(index + 1, 8)}`}
        onClick={() => navigate(`/produit/${produit.id}`)}
      >
        {/* Image */}
        <div className="pcard-img-wrap">
          <img
            src={produit.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80'}
            alt={produit.nom}
            className="pcard-img"
            loading="lazy"
          />

          {stockFaible && !estEpuise && (
            <div className="pcard-badge-stock">Dernières pièces</div>
          )}

          {estEpuise && (
            <div className="pcard-badge-epuise">
              <span style={{ fontFamily: 'Josefin Sans', fontSize: 11, fontWeight: 700, color: '#8a5070', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Épuisé
              </span>
            </div>
          )}

          <div className="pcard-voir-btn">
            <IcoEye />
            <span style={{ fontFamily: 'Josefin Sans', fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Voir le produit
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="pcard-info">
          <div>
            <p className="pcard-cat">{produit.categorie}</p>
            <p className="pcard-nom">{produit.nom}</p>
          </div>

          {/* Prix */}
        <div className="pcard-prix-zone">
  <div>
    <p className="pcard-prix-chiffre">
      {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(produit.prix)}
    </p>
    <p className="pcard-prix-devise">F CFA</p>
  </div>
</div>

<button
  className={`pcard-btn-cart${added ? ' added' : ''}`}
  onClick={handleAdd}
  disabled={estEpuise}
  title={estEpuise ? 'Épuisé' : 'Ajouter au panier'}
>
  {added ? (
    <><IcoCheck /> Ajouté au panier !</>
  ) : estEpuise ? (
    'Épuisé'
  ) : (
    <><IcoCart /> Ajouter au panier</>
  )}
</button>

          {stockFaible && (
            <p className="pcard-stock-warn">
              ⚠ Plus que {produit.stock} disponible{produit.stock > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </>
  )
}