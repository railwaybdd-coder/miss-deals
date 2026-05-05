import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePanier } from '../context/PanierContext'
import { FlowerSVG } from '../App'

export default function Navbar() {
  const { panier } = usePanier()
  const location   = useLocation()
  const nbArticles = panier.reduce((a, p) => a + p.quantite, 0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Ferme le menu au changement de route
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Bloque le scroll body quand menu ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const active = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const navLinks = [
    { label: 'Catalogue', to: '/catalogue' },
    { label: 'Contact',   to: '/contact' },
  ]

  return (
    <>
      <style>{`
        /* ── Navbar ── */
        .navbar-blur {
          position: sticky;
          top: 0;
          z-index: 200;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        @media (min-width: 768px) {
          .navbar-inner {
            padding: 0 32px;
            height: 68px;
          }
        }

        /* Desktop links — cachés sur mobile */
        .navbar-desktop-links {
          display: none;
        }
        @media (min-width: 768px) {
          .navbar-desktop-links {
            display: flex;
            align-items: center;
            gap: 28px;
          }
        }

        /* Burger — caché sur desktop */
        .navbar-burger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 10px;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .navbar-burger:hover { background: rgba(233,91,143,0.08); }
        .navbar-burger span {
          display: block;
          height: 2px;
          border-radius: 2px;
          background: var(--rose-deep);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s, width 0.3s;
          transform-origin: center;
        }
        .navbar-burger span:nth-child(1) { width: 22px; }
        .navbar-burger span:nth-child(2) { width: 16px; }
        .navbar-burger span:nth-child(3) { width: 22px; }
        .navbar-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 22px; }
        .navbar-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); width: 22px; }

        @media (min-width: 768px) {
          .navbar-burger { display: none; }
        }

        /* Panier pill — visible desktop seulement dans la barre */
        .navbar-panier-desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .navbar-panier-desktop { display: flex; }
        }

        /* Panier icon seul — mobile (juste l'icône sans label) */
        .navbar-panier-mobile {
          display: flex;
        }
        @media (min-width: 768px) {
          .navbar-panier-mobile { display: none; }
        }

        /* ── Drawer mobile ── */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 150;
          background: rgba(50, 10, 30, 0.35);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.32s ease;
        }
        .mobile-drawer-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 160;
          width: min(320px, 85vw);
          background: var(--pearl);
          box-shadow: -8px 0 40px rgba(200,80,140,0.18);
          transform: translateX(100%);
          transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .mobile-drawer.open {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-soft);
        }

        .drawer-nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 17px 24px;
          text-decoration: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-heading);
          border-bottom: 1px solid var(--border-soft);
          transition: background 0.18s, color 0.18s;
        }
        .drawer-nav-link:hover,
        .drawer-nav-link.active-link {
          background: var(--rose-pale);
          color: var(--rose);
        }
        .drawer-nav-link.active-link {
          border-left: 3px solid var(--rose);
        }

        .drawer-panier-btn {
          margin: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: linear-gradient(135deg, var(--rose), var(--mauve));
          border-radius: 999px;
          text-decoration: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: white;
          box-shadow: 0 6px 20px rgba(233,91,143,0.30);
          transition: opacity 0.2s, transform 0.2s;
        }
        .drawer-panier-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .drawer-footer {
          margin-top: auto;
          padding: 20px 24px;
          border-top: 1px solid var(--border-soft);
        }

        /* Nav desktop link style */
        .nav-desktop-link {
          text-decoration: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding-bottom: 2px;
          border-bottom: 2px solid transparent;
          transition: all 0.22s;
        }
        .nav-desktop-link.active-link {
          font-weight: 700;
          color: var(--rose);
          border-bottom-color: var(--rose);
        }
        .nav-desktop-link:hover { color: var(--rose); }
      `}</style>

      <nav className="navbar-blur fade-down">
        <div className="navbar-inner">

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <FlowerSVG size={16} className="deco-flower" />
            <span className="font-script" style={{ fontSize: 20, color: 'var(--rose)', lineHeight: 1, whiteSpace: 'nowrap' }}>
              Miss Deals
            </span>
            <FlowerSVG size={16} className="deco-flower" style={{ animationDelay: '1s' }} />
          </Link>

          {/* ── Desktop: liens + panier ── */}
          <div className="navbar-desktop-links">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`nav-desktop-link${active(to) ? ' active-link' : ''}`}
              >
                {label}
              </Link>
            ))}

            {/* Panier pill desktop */}
            <Link to="/panier" style={{ textDecoration: 'none' }} className="navbar-panier-desktop">
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px',
                  background: 'linear-gradient(135deg, var(--rose), var(--mauve))',
                  borderRadius: 999,
                  boxShadow: '0 4px 14px rgba(233,91,143,0.32)',
                  transition: 'transform 0.22s, box-shadow 0.22s',
                  animation: nbArticles > 0 ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(233,91,143,0.45)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(233,91,143,0.32)' }}
              >
                <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span style={{ fontFamily: 'Josefin Sans', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'white', textTransform: 'uppercase' }}>
                  Panier
                </span>
                {nbArticles > 0 && (
                  <span style={{ background: 'var(--gold)', color: 'var(--noir)', borderRadius: '50%', minWidth: 17, height: 17, fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
                    {nbArticles}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* ── Mobile: icône panier + burger ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Panier icône seule */}
            <Link to="/panier" style={{ textDecoration: 'none', position: 'relative' }} className="navbar-panier-mobile">
              <div style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--rose), var(--mauve))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(233,91,143,0.30)',
                animation: nbArticles > 0 ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                position: 'relative',
              }}>
                <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {nbArticles > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: 'var(--gold)', color: 'var(--noir)',
                    borderRadius: '50%', minWidth: 16, height: 16,
                    fontSize: 8, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid white',
                  }}>
                    {nbArticles}
                  </span>
                )}
              </div>
            </Link>

            {/* Burger button */}
            <button
              className={`navbar-burger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Overlay ── */}
      <div
        className={`mobile-drawer-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Drawer ── */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">

        {/* Header drawer */}
        <div className="drawer-header">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FlowerSVG size={18} className="deco-flower" />
            <span className="font-script" style={{ fontSize: 22, color: 'var(--rose)', lineHeight: 1 }}>
              Miss Deals
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 6, borderRadius: 8, transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--rose-pale)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
            aria-label="Fermer"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Liens */}
        <nav style={{ flex: 1 }}>
          <Link to="/" className={`drawer-nav-link${location.pathname === '/' ? ' active-link' : ''}`}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Accueil
          </Link>
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`drawer-nav-link${active(to) ? ' active-link' : ''}`}
            >
              {to === '/catalogue' ? (
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              ) : (
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA Panier */}
        <Link to="/panier" className="drawer-panier-btn">
          <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Mon Panier
          {nbArticles > 0 && (
            <span style={{ background: 'var(--gold)', color: 'var(--noir)', borderRadius: '50%', minWidth: 20, height: 20, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {nbArticles}
            </span>
          )}
        </Link>

        {/* Footer drawer */}
        <div className="drawer-footer">
          <p style={{ fontFamily: 'Josefin Sans', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
            La boutique tendance du Sénégal
          </p>
        </div>
      </div>
    </>
  )
}