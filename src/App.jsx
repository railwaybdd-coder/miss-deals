import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { PanierProvider } from './context/PanierContext'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import Catalogue from './pages/Catalogue'
import ProduitDetail from './pages/ProduitDetail'
import Contact from './pages/Contact'
import Panier from './pages/Panier'
import Admin from './pages/Admin'

/* ─── SVG Flower décoratif ─── */
export function FlowerSVG({ size = 28, style = {}, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 40 40"
      className={className} style={{ display: 'inline-block', ...style }}
    >
      <ellipse cx="20" cy="9"  rx="5" ry="9"  fill="var(--petal1)" opacity="0.88"/>
      <ellipse cx="20" cy="31" rx="5" ry="9"  fill="var(--petal1)" opacity="0.88"/>
      <ellipse cx="9"  cy="20" rx="9" ry="5"  fill="var(--petal2)" opacity="0.88"/>
      <ellipse cx="31" cy="20" rx="9" ry="5"  fill="var(--petal2)" opacity="0.88"/>
      <ellipse cx="11.5" cy="11.5" rx="5" ry="9" transform="rotate(-45 11.5 11.5)" fill="var(--petal3)" opacity="0.78"/>
      <ellipse cx="28.5" cy="11.5" rx="5" ry="9" transform="rotate(45 28.5 11.5)"  fill="var(--petal3)" opacity="0.78"/>
      <ellipse cx="11.5" cy="28.5" rx="5" ry="9" transform="rotate(45 11.5 28.5)"  fill="var(--petal1)" opacity="0.78"/>
      <ellipse cx="28.5" cy="28.5" rx="5" ry="9" transform="rotate(-45 28.5 28.5)" fill="var(--petal1)" opacity="0.78"/>
      <circle cx="20" cy="20" r="6" fill="var(--gold)"/>
    </svg>
  )
}

/* ─── Séparateur fleuri ─── */
function FlowerDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 0 28px' }}>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,200,220,0.4))' }}/>
      <FlowerSVG size={20} className="deco-flower" />
      <FlowerSVG size={14} className="deco-flower-fast" style={{ animationDelay: '0.6s' }} />
      <FlowerSVG size={20} className="deco-flower" style={{ animationDelay: '1.2s' }} />
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,200,220,0.4))' }}/>
    </div>
  )
}

/* ─── Icônes footer ─── */
const IcoWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IcoPin = () => (
  <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IcoMail = () => (
  <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IcoInstagram = () => (
  <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IcoArrow = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ─── Footer ─── */
function Footer() {
  const navLinks = [
    { label: 'Catalogue', href: '/catalogue' },
    { label: 'Contact',   href: '/contact' },
    { label: 'Panier',    href: '/panier' },
  ]

  return (
    <footer style={{
      background: 'linear-gradient(135deg, hsl(335,75%,45%), hsl(310,55%,50%))',
      marginTop: 80,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        /* ── Footer responsive layout ── */
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          padding: 44px 20px 28px;
        }
        @media (min-width: 640px) {
          .footer-inner { padding: 56px 40px 32px; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr 1fr;
            gap: 40px;
          }
        }

        .footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        @media (min-width: 640px) {
          .footer-nav-links { align-items: flex-start; }
        }

        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        @media (min-width: 640px) {
          .footer-contact-items { align-items: flex-start; }
        }

        .footer-socials {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .footer-socials { justify-content: flex-start; }
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
          padding-top: 24px;
          margin-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .footer-link {
          color: rgba(255,255,255,0.62);
          text-decoration: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer-link:hover { color: white; }

        .footer-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.22s, transform 0.22s;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          background: rgba(255,255,255,0.24);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Orbs déco */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -80, left: -40, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}/>

      <div className="footer-inner">
        <FlowerDivider />

        <div className="footer-grid">

          {/* ── Brand ── */}
          <div>
            <p className="font-script" style={{ fontSize: 34, color: 'white', marginBottom: 8, lineHeight: 1 }}>
              Miss Deals
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontFamily: 'Josefin Sans', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              Tendance & Style · Sénégal
            </p>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 12, fontFamily: 'Josefin Sans', lineHeight: 1.7, maxWidth: 240, margin: '0 auto' }}>
              La boutique en ligne de mode féminine tendance au Sénégal. Livraison offerte partout.
            </p>
            {/* Socials */}
            <div className="footer-socials" style={{ marginTop: 18 }}>
              <a href="https://wa.me/221675014485" target="_blank" rel="noreferrer" className="footer-social-btn" title="WhatsApp">
                <IcoWhatsApp />
              </a>
              <a href="#" className="footer-social-btn" title="Instagram">
                <IcoInstagram />
              </a>
            </div>
          </div>

          {/* ── Navigation ── */}
          <div>
            <p style={{ color: 'white', fontSize: 9, fontFamily: 'Josefin Sans', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>
              Navigation
            </p>
            <div className="footer-nav-links">
              {navLinks.map(({ label, href }) => (
                <a key={href} href={href} className="footer-link">
                  <IcoArrow /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <p style={{ color: 'white', fontSize: 9, fontFamily: 'Josefin Sans', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>
              Contact
            </p>
            <div className="footer-contact-items">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.62)', fontSize: 12, fontFamily: 'Josefin Sans' }}>
                <IcoPin /> Dakar, Sénégal
              </span>
              <a href="https://wa.me/221675014485" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.62)', fontSize: 12, fontFamily: 'Josefin Sans', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'white'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.62)'}
              >
                <IcoWhatsApp /> WhatsApp
              </a>
            </div>
          </div>

          {/* ── CTA livraison ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 18,
              padding: '18px 20px',
              textAlign: 'center',
              width: '100%',
            }}>
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p style={{ color: 'white', fontFamily: 'Josefin Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                Livraison Offerte
              </p>
              <p style={{ color: 'rgba(255,255,255,0.60)', fontFamily: 'Josefin Sans', fontSize: 10 }}>
                Partout au Sénégal
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 10, letterSpacing: '0.1em', fontFamily: 'Josefin Sans', textTransform: 'uppercase' }}>
            © 2026 Miss Deals — Tous droits réservés
          </p>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontFamily: 'Josefin Sans' }}>
            La boutique tendance du Sénégal
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Layout avec Navbar ─── */
function WithNav({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

/* ─── App racine ─── */
export default function App() {
  return (
    <PanierProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"               element={<Shop />} />
          <Route path="/catalogue"      element={<WithNav><Catalogue /></WithNav>} />
          <Route path="/produit/:id"    element={<WithNav><ProduitDetail /></WithNav>} />
          <Route path="/contact"        element={<WithNav><Contact /></WithNav>} />
          <Route path="/panier"         element={<WithNav><Panier /></WithNav>} />
          <Route path="/admin"          element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </PanierProvider>
  )
}