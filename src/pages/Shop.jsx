import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePanier } from '../context/PanierContext'
import { FlowerSVG } from '../App'

const TICKER = [
  'MISS DEALS', 'NOUVELLE COLLECTION', 'QUALITÉ PREMIUM',
  'TENDANCE & GIRLY', 'LIVRAISON SÉNÉGAL', 'ÉDITION LIMITÉE',
  'BADDIE VIBES', 'STYLE INÉGALÉ', 'PAIEMENT FCFA',
]

/* ── Icônes ── */
const StarIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const HeartIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

/* ── Système de Particules (Pétales & Fleurs) ── */
function FloatingParticle({ type = 'petal', delay = 0, left = '0%' }) {
  const duration = 7 + Math.random() * 7
  const size = type === 'flower' ? 15 + Math.random() * 15 : 10 + Math.random() * 10
  
  return (
    <div style={{
      position: 'absolute',
      top: '-10%',
      left: left,
      pointerEvents: 'none',
      zIndex: 1,
      animation: `fall ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.6
    }}>
      {type === 'flower' ? (
        <div style={{ animation: `rotate ${3 + Math.random() * 3}s linear infinite` }}>
          <FlowerSVG size={size} color="#ffcada" />
        </div>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${Math.random() * 360}deg)` }}>
          <path d="M12,2C12,2 15,6 15,10C15,14 12,18 12,18C12,18 9,14 9,10C9,6 12,2 12,2" fill="#ffb6c1" />
        </svg>
      )}
    </div>
  )
}

export default function Shop() {
  const navigate = useNavigate()
  const { panier } = usePanier()
  const nbArticles = panier.reduce((a, p) => a + p.quantite, 0)
  const heroRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const move = (e) => {
      if (!heroRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 15
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      heroRef.current.style.transform = `translate(${x}px,${y}px)`
    }
    window.addEventListener('mousemove', move)
    setTimeout(() => setLoaded(true), 100)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const tItems = [...TICKER, ...TICKER, ...TICKER].map((t, i) => (
    <span key={i} style={{
      padding: '0 30px', fontSize: 10, letterSpacing: '0.3em',
      fontFamily: 'Josefin Sans', color: '#d484a5',
      fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex',
      alignItems: 'center', gap: 20, textTransform: 'uppercase',
    }}>
      {t}
      <StarIcon size={10} color="#ffc1e3" />
    </span>
  ))

  return (
    <div style={{ 
      minHeight:'100vh', 
      background:'#fff9fb', 
      position:'relative', 
      overflow:'hidden', 
      display:'flex', 
      flexDirection:'column' 
    }}>

      <style>{`
        @keyframes shopTicker { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @keyframes shine { 0% { left: -100%; } 100% { left: 100%; } }
        
        /* Lévitation du titre */
        @keyframes levitate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* Chute des pétales */
        @keyframes fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; }
        }

        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .shop-cta-primary {
          background: #ff85a2; border: none; color: white;
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 16px 32px; border-radius: 50px; cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 133, 162, 0.3);
          position: relative; overflow: hidden;
        }
        .shop-cta-primary::after {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 3s infinite;
        }
        .shop-cta-primary:active { transform: scale(0.95); }

        .shop-cta-secondary {
          background: white; border: 1px solid #ffcada; color: #ff85a2;
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 600; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 20px; border-radius: 50px; cursor: pointer;
          transition: all 0.2s ease; flex: 1;
        }
        
        .social-orb {
          width: 38px; height: 38px; border-radius: 50%;
          background: white; border: 1px solid #fce4ec;
          display: flex; align-items: center; justify-content: center;
          color: #ff85a2; transition: all 0.2s;
        }

        .bg-circle {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
        }
      `}</style>

      {/* ── Background Elements ── */}
      <div ref={heroRef} style={{ position:'absolute', inset:0, zIndex:0 }}>
        <div className="bg-circle" style={{ top:'-10%', right:'-10%', width: 400, height: 400, background:'#fff0f5' }} />
        <div className="bg-circle" style={{ bottom:'5%', left:'-5%', width: 300, height: 300, background:'#fff3f8' }} />
      </div>

      {/* ── Pluie de Pétales et Fleurs ── */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle 
          key={i} 
          type={i % 3 === 0 ? 'flower' : 'petal'} 
          left={`${Math.random() * 100}%`} 
          delay={Math.random() * 10} 
        />
      ))}

      {/* ── Top bar ── */}
      <div style={{ position:'relative', zIndex:20, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px' }}>
        <div style={{ opacity: loaded ? 1 : 0, transition:'opacity 0.8s', fontFamily:'Great Vibes', fontSize:24, color:'#ff85a2' }}>
          Miss Deals
        </div>
        <button
          onClick={() => navigate('/panier')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#d484a5', fontFamily:'Josefin Sans', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {nbArticles > 0 && <span style={{ fontWeight:800 }}>({nbArticles})</span>}
        </button>
      </div>

      {/* ── Hero Content ── */}
      <div style={{ position:'relative', zIndex:20, flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 24px', textAlign:'center' }}>

        <div style={{ opacity: loaded ? 0.8 : 0, transition:'opacity 1s ease', marginBottom:15 }}>
          <FlowerSVG size={40} color="#ffcada" />
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition:'all 0.8s ease', marginBottom:10 }}>
          <span style={{ fontFamily:'Josefin Sans', fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'#d484a5' }}>
            Boutique Tendance · Sénégal
          </span>
        </div>

        {/* TITRE PRINCIPAL AVEC LÉVITATION */}
        <div style={{ 
          opacity: loaded ? 1 : 0, 
          transition: 'all 1s ease 0.2s', 
          marginBottom: 20,
          animation: 'levitate 4s ease-in-out infinite' // Activation de la lévitation ici
        }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'Great Vibes, cursive',
            fontSize: 'clamp(70px, 18vw, 130px)', // Un peu plus grand pour l'impact
            background: 'linear-gradient(180deg, #ff85a2 0%, #ffcada 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            padding: '10px 0',
            filter: 'drop-shadow(0 5px 15px rgba(255,133,162,0.1))'
          }}>
            Miss Deals
          </h1>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition:'opacity 0.8s ease 0.4s', marginBottom:25, display:'flex', gap:15, justifyContent:'center' }}>
          <HeartIcon size={18} color="#ffb6c1" />
          <StarIcon size={18} color="#ff85a2" />
          <HeartIcon size={18} color="#ffb6c1" />
        </div>

        <div style={{ opacity: loaded ? 0.8 : 0, transform: loaded ? 'translateY(0)' : 'translateY(15px)', transition:'all 0.8s ease 0.5s', marginBottom:40 }}>
          <p style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:'18px', color:'#7a5c68', margin:0 }}>
            Style, Tendance & Douceur
          </p>
        </div>

        {/* Boutons CTA */}
        <div style={{ opacity: loaded ? 1 : 0, transition:'opacity 1s ease 0.6s', display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:300 }}>
          <button className="shop-cta-primary" onClick={() => navigate('/catalogue')}>
            Découvrir la Collection
          </button>
          <div style={{ display:'flex', gap:10 }}>
            <button className="shop-cta-secondary" onClick={() => navigate('/catalogue')}>Catalogue</button>
            <button className="shop-cta-secondary" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }} onClick={() => navigate('/panier')}>
              Panier <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div style={{ position:'relative', zIndex:20, borderTop:'1px solid #fce4ec', borderBottom:'1px solid #fce4ec', padding:'12px 0', overflow:'hidden', background:'rgba(255,255,255,0.8)', backdropFilter:'blur(5px)' }}>
        <div style={{ display:'inline-flex', animation:'shopTicker 30s linear infinite', whiteSpace:'nowrap' }}>
          {tItems}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ position:'relative', zIndex:20, display:'flex', flexDirection:'column', alignItems:'center', padding:'30px 24px', gap:15 }}>
        <div style={{ display:'flex', gap:15 }}>
          <a href="#" className="social-orb">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="#" className="social-orb">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34l-.02-8.43a8.18 8.18 0 004.78 1.52V5.02a4.85 4.85 0 01-1-.33z"/></svg>
          </a>
        </div>
        <p style={{ fontSize:9, letterSpacing:'0.1em', color:'#d484a5', textAlign:'center', fontFamily:'Josefin Sans', textTransform:'uppercase', margin:0 }}>
          © 2026 Miss Deals · Dakar, Sénégal
        </p>
      </div>
    </div>
  )
}