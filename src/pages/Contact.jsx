import { Icons } from '../components/Icons'

const WHATSAPP = '212675014485'

/* Animated floral SVG background element */
function FloralBg() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none"
      style={{ position:'absolute', right:-60, top:-40, opacity:.06, pointerEvents:'none', animation:'petalSpin 40s linear infinite' }}>
      {[0,45,90,135,180,225,270,315].map((r, i) => (
        <ellipse key={i} cx="110" cy="55" rx="18" ry="52"
          fill={i % 2 === 0 ? 'var(--rose)' : 'var(--mauve)'}
          transform={`rotate(${r} 110 110)`}/>
      ))}
      <circle cx="110" cy="110" r="24" fill="var(--gold)" opacity=".7"/>
    </svg>
  )
}

export default function Contact() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--background)', position:'relative', overflow:'hidden' }}>

      <style>{`@keyframes petalSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>

      {/* Ambient orb */}
      <div style={{ position:'fixed', top:'20%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(210,100,170,.08) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'72px 32px 96px', position:'relative', zIndex:1 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom:64, position:'relative' }}>
          <FloralBg/>
          <div className="accent-line line-accent-anim" style={{ width:'2rem', marginBottom:20 }}/>
          <p className="section-label" style={{ marginBottom:12 }}>Nous trouver</p>
          <h1 className="font-display section-title" style={{ fontSize:'clamp(36px,5vw,54px)' }}>
            Contactez<br/><em>Miss Deals</em>
          </h1>
          <p style={{ fontFamily:'Jost', fontSize:13, color:'var(--mist)', marginTop:16, lineHeight:1.9, fontWeight:300, maxWidth:380 }}>
            Notre équipe est à votre écoute. Écrivez-nous pour toute question sur vos commandes, tailles ou disponibilités.
          </p>
        </div>

        {/* Info items */}
        <div className="fade-up delay-1" style={{ marginBottom:52 }}>
          {[
            { icon:Icons.Pin,    label:'Localisation', value:'Dakar, Sénégal' },
            { icon:Icons.Phone,  label:'Téléphone',    value:'+221 78 XXX XX XX' },
            { icon:Icons.WhatsApp, label:'WhatsApp',   value:'Disponible 9h – 20h' },
            { icon:Icons.Clock,  label:'Horaires',     value:'Lundi – Samedi' },
          ].map((item, i) => (
            <div key={item.label}
              className={`fade-up delay-${i + 1}`}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 0', borderBottom:'1px solid var(--border-fine)', gap:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', border:'1px solid var(--border-fine)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--rose)', flexShrink:0 }}>
                  {item.icon}
                </div>
                <span style={{ fontFamily:'Jost', fontSize:11, color:'var(--mist)', letterSpacing:'.14em', textTransform:'uppercase', fontWeight:300 }}>{item.label}</span>
              </div>
              <span className="font-display" style={{ fontSize:17, fontWeight:500, fontStyle:'italic', color:'var(--ink)', textAlign:'right' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="fade-up delay-5" style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour Miss Deals, je voudrais des informations sur vos produits.')}`}
            target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, width:'100%', padding:'18px', background:'#16a34a', color:'white', textDecoration:'none', borderRadius:999, fontFamily:'Jost', fontWeight:500, fontSize:12, letterSpacing:'.14em', textTransform:'uppercase', transition:'all .25s', boxShadow:'0 8px 28px rgba(22,163,74,.28)' }}
            onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(22,163,74,.38)'; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(22,163,74,.28)'; }}
          >
            <span style={{ display:'flex' }}>{Icons.WhatsApp}</span>
            Écrire sur WhatsApp
          </a>

          <div style={{ textAlign:'center', padding:'16px', background:'white', borderRadius:16, border:'1px solid var(--border-fine)' }}>
            <p style={{ fontFamily:'Jost', fontSize:12, color:'var(--mist)', fontWeight:300, letterSpacing:'.04em' }}>
              Réponse garantie sous 24h · Paiement en FCFA
            </p>
          </div>
        </div>

        {/* Decorative separator */}
        <div className="fade-up delay-6" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:64, opacity:.35 }}>
          <div style={{ height:1, width:64, background:'linear-gradient(to right, transparent, var(--border-fine))' }}/>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="6"  rx="4" ry="6"  fill="var(--rose)"/>
            <ellipse cx="12" cy="18" rx="4" ry="6"  fill="var(--rose)" transform="rotate(180 12 12)"/>
            <ellipse cx="6"  cy="12" rx="6" ry="4"  fill="var(--mauve)"/>
            <ellipse cx="18" cy="12" rx="6" ry="4"  fill="var(--mauve)"/>
            <circle cx="12" cy="12" r="3.5" fill="var(--gold)"/>
          </svg>
          <div style={{ height:1, width:64, background:'linear-gradient(to left, transparent, var(--border-fine))' }}/>
        </div>
      </div>
    </div>
  )
}