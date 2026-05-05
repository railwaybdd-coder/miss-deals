import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FlowerSVG } from '../App'

/* ─── Constantes ─── */
const STATUTS = ['en_attente','confirme','expedie','livre','annule']
const STATUT_META = {
  en_attente: { label:'En attente', color:'#b45309', bg:'#fef3c7' },
  confirme:   { label:'Confirmé',   color:'#1d4ed8', bg:'#dbeafe' },
  expedie:    { label:'Expédié',    color:'#7c3aed', bg:'#ede9fe' },
  livre:      { label:'Livré',      color:'#15803d', bg:'#dcfce7' },
  annule:     { label:'Annulé',     color:'#dc2626', bg:'#fee2e2' },
}
const FORM_VIDE = { nom:'', description:'', prix:'', categorie:'', stock:'', disponible:true, vedette:false }

const prixFCFA = (prix) =>
  new Intl.NumberFormat('fr-SN', { style:'currency', currency:'XOF', maximumFractionDigits:0 }).format(Number(prix)||0)

/* ── Upload helper ── */
async function uploadImage(file) {
  const ext  = file.name.split('.').pop().toLowerCase()
  const path = `produits/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, file, { upsert:true, contentType:file.type||'image/jpeg' })
  if (error) throw new Error('Upload échoué : ' + error.message)
  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

/* ── Toggle ── */
function Toggle({ on, onChange, label }) {
  return (
    <div className="toggle-wrap" onClick={() => onChange(!on)}>
      <div className={`toggle-track ${on?'on':''}`}><div className="toggle-thumb"/></div>
      {label && <span style={{ fontFamily:'Josefin Sans', fontSize:12, color:'var(--text-heading)', userSelect:'none' }}>{label}</span>}
    </div>
  )
}

/* ── Zone upload ── */
function UploadZone({ onFiles }) {
  const ref = useRef()
  const [drag, setDrag] = useState(false)
  const handle = (files) => {
    const valids = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (valids.length) onFiles(valids)
  }
  return (
    <div className={`upload-zone ${drag?'drag':''}`}
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}
    >
      <input ref={ref} type="file" accept="image/*" multiple onChange={e => handle(e.target.files)}/>
      <div style={{ marginBottom:10 }}>
        <FlowerSVG size={32} className="deco-flower" style={{ opacity:0.55 }}/>
      </div>
      <p style={{ fontFamily:'Josefin Sans', fontWeight:700, fontSize:12, color:'var(--text-heading)', marginBottom:5, letterSpacing:'0.06em' }}>
        Glisser des images ici
      </p>
      <p style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'0.04em' }}>ou cliquer · JPG, PNG, WEBP · Plusieurs images possibles</p>
    </div>
  )
}

export default function Admin() {
  /* Auth */
  const [session, setSession] = useState(null)
  const [email, setEmail]     = useState('')
  const [mdp, setMdp]         = useState('')
  /* Nav */
  const [onglet, setOnglet]   = useState('dashboard')
  /* Data */
  const [commandes, setCommandes] = useState([])
  const [produits, setProduits]   = useState([])
  /* UI */
  const [loadingCmd, setLoadingCmd]   = useState(true)
  const [loadingProd, setLoadingProd] = useState(true)
  const [filtreStatut, setFiltreStatut] = useState('tous')
  const [searchProd, setSearchProd]   = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [editingId, setEditingId]     = useState(null)
  const [saving, setSaving]           = useState(false)
  const [confirmDel, setConfirmDel]   = useState(null)
  /* Formulaire */
  const [form, setForm]     = useState(FORM_VIDE)
  const [images, setImages] = useState([])
  const [uploadError, setUploadError] = useState(null)

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_e, s) => setSession(s))
  }, [])
  useEffect(() => { if (session) { chargerCommandes(); chargerProduits() } }, [session])

  const chargerCommandes = async () => {
    setLoadingCmd(true)
    const { data } = await supabase.from('commandes').select('*').order('created_at', { ascending:false })
    if (data) setCommandes(data)
    setLoadingCmd(false)
  }
  const chargerProduits = async () => {
    setLoadingProd(true)
    const { data } = await supabase.from('produits').select('*').order('created_at', { ascending:false })
    if (data) setProduits(data)
    setLoadingProd(false)
  }

  const seConnecter = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password:mdp })
    if (error) alert('Erreur de connexion : ' + error.message)
  }
  const seDeconnecter = () => supabase.auth.signOut()

  const updateStatut = async (id, statut) => {
    await supabase.from('commandes').update({ statut }).eq('id', id)
    setCommandes(prev => prev.map(c => c.id===id ? { ...c, statut } : c))
  }

  const handleImageFiles = async (files) => {
    setUploadError(null)
    const news = files.map(f => ({ url:URL.createObjectURL(f), file:f, uploading:true }))
    setImages(prev => [...prev, ...news])
    for (let i = 0; i < news.length; i++) {
      try {
        const url = await uploadImage(news[i].file)
        setImages(prev => prev.map(img => img.url===news[i].url ? { url, uploading:false } : img))
      } catch (e) {
        setUploadError(e.message)
        setImages(prev => prev.filter(img => img.url!==news[i].url))
      }
    }
  }

  const ouvrirFormNouveauProduit = () => {
    setForm(FORM_VIDE); setImages([]); setEditingId(null); setUploadError(null); setShowForm(true)
  }
  const ouvrirFormEdition = (p) => {
    setForm({ nom:p.nom, description:p.description||'', prix:p.prix, categorie:p.categorie||'', stock:p.stock, disponible:p.disponible!==false, vedette:p.vedette||false })
    const imgs = (() => {
      if (p.images_url) { try { const a=JSON.parse(p.images_url); if(Array.isArray(a)) return a.map(u=>({url:u,uploading:false})) } catch{} }
      return p.image_url ? [{ url:p.image_url, uploading:false }] : []
    })()
    setImages(imgs); setEditingId(p.id); setUploadError(null); setShowForm(true)
  }

  const sauvegarderProduit = async () => {
    if (!form.nom || !form.prix) { alert('Nom et prix requis'); return }
    setSaving(true)
    const uploadedUrls = images.filter(i=>!i.uploading).map(i=>i.url)
    const payload = { nom:form.nom, description:form.description, prix:Number(form.prix), categorie:form.categorie, stock:Number(form.stock)||0, disponible:form.disponible, vedette:form.vedette, image_url:uploadedUrls[0]||null, images_url:JSON.stringify(uploadedUrls) }
    if (editingId) { await supabase.from('produits').update(payload).eq('id', editingId) }
    else { await supabase.from('produits').insert(payload) }
    setSaving(false); setShowForm(false); chargerProduits()
  }

  const supprimerProduit = async (id) => {
    await supabase.from('produits').delete().eq('id', id)
    setProduits(prev => prev.filter(p => p.id!==id))
    setConfirmDel(null)
  }

  /* ── Stats dashboard ── */
  const totalCA = commandes.filter(c=>c.statut!=='annule').reduce((a,c)=>a+(c.total||0),0)
  const nbLivre = commandes.filter(c=>c.statut==='livre').length
  const nbAttente = commandes.filter(c=>c.statut==='en_attente').length
  const produitsFiltres = produits.filter(p => p.nom?.toLowerCase().includes(searchProd.toLowerCase()))
  const commandesFiltrees = filtreStatut==='tous' ? commandes : commandes.filter(c=>c.statut===filtreStatut)

  /* ── Login ── */
  if (!session) return (
    <div style={{ minHeight:'100vh', background:'var(--background)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(233,91,143,0.1), transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(180,100,225,0.08), transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }}/>

      <div className="scale-in" style={{ background:'white', borderRadius:28, padding:'44px 40px', width:'100%', maxWidth:400, boxShadow:'0 24px 70px rgba(200,80,140,0.18)', border:'1.5px solid var(--border-soft)', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <FlowerSVG size={44} className="deco-flower" style={{ marginBottom:12, filter:'drop-shadow(0 0 14px rgba(233,91,143,0.4))' }}/>
          <h1 className="font-script" style={{ fontSize:36, color:'var(--rose)', lineHeight:1 }}>Miss Deals</h1>
          <p style={{ fontFamily:'Josefin Sans', fontSize:9, letterSpacing:'0.35em', color:'var(--text-muted)', textTransform:'uppercase', marginTop:5 }}>Espace Administration</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:7 }}>
              📧 Email
            </label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="wyl-input" placeholder="admin@missdeals.sn"/>
          </div>
          <div>
            <label style={{ fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:7 }}>
              🔒 Mot de passe
            </label>
            <input type="password" value={mdp} onChange={e=>setMdp(e.target.value)} className="wyl-input" placeholder="••••••••"
              onKeyDown={e=>e.key==='Enter'&&seConnecter()}/>
          </div>
          <button onClick={seConnecter} className="btn-primary" style={{ width:'100%', padding:'15px', fontSize:11, marginTop:6 }}>
            ✿ Se connecter
          </button>
        </div>
      </div>
    </div>
  )

  /* ── Layout admin ── */
  const navItems = [
    { id:'dashboard', label:'Dashboard', icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id:'commandes', label:'Commandes', icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
    { id:'produits',  label:'Produits',  icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--background)', display:'flex', flexDirection:'column' }}>

      {/* ── Top bar admin ── */}
      <header style={{ background:'white', borderBottom:'1.5px solid var(--border-soft)', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, boxShadow:'0 2px 16px rgba(200,80,140,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <FlowerSVG size={20} className="deco-flower"/>
          <span className="font-script" style={{ fontSize:24, color:'var(--rose)' }}>Miss Deals</span>
          <span style={{ fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', letterSpacing:'0.25em', textTransform:'uppercase', paddingLeft:8, borderLeft:'1px solid var(--border-soft)' }}>Admin</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <a href="/" target="_blank" style={{ fontFamily:'Josefin Sans', fontSize:10, color:'var(--text-muted)', textDecoration:'none', letterSpacing:'0.12em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6, transition:'color 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.color='var(--rose)'}
            onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Voir la boutique
          </a>
          <button onClick={seDeconnecter} style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:999, padding:'7px 16px', fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', cursor:'pointer', letterSpacing:'0.15em', textTransform:'uppercase', transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.borderColor='var(--rose)';e.currentTarget.style.color='var(--rose)'}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-muted)'}}>
            Déconnexion
          </button>
        </div>
      </header>

      <div style={{ display:'flex', flex:1 }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:220, background:'white', borderRight:'1.5px solid var(--border-soft)', padding:'28px 16px', flexShrink:0 }}>
          <nav style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setOnglet(item.id)}
                style={{
                  display:'flex', alignItems:'center', gap:11,
                  padding:'11px 16px', borderRadius:14, border:'none', cursor:'pointer',
                  fontFamily:'Josefin Sans', fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
                  transition:'all 0.22s',
                  background: onglet===item.id ? 'linear-gradient(135deg, var(--rose), var(--mauve))' : 'transparent',
                  color: onglet===item.id ? 'white' : 'var(--text-muted)',
                  boxShadow: onglet===item.id ? '0 6px 18px rgba(233,91,143,0.28)' : 'none',
                }}
              >
                {item.icon}
                {item.label}
                {item.id==='commandes' && nbAttente > 0 && (
                  <span style={{ marginLeft:'auto', background: onglet==='commandes'?'rgba(255,255,255,0.3)':'var(--rose)', color:'white', borderRadius:999, width:18, height:18, fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {nbAttente}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Contenu principal ── */}
        <main style={{ flex:1, padding:'32px', overflowY:'auto' }}>

          {/* ══ Dashboard ══ */}
          {onglet === 'dashboard' && (
            <div>
              <div className="fade-up" style={{ marginBottom:32 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <FlowerSVG size={16} className="deco-flower"/>
                  <div className="accent-line line-accent-anim"/>
                </div>
                <h2 className="font-display" style={{ fontSize:32, color:'var(--text-heading)' }}>Tableau de bord 💕</h2>
              </div>

              {/* Stats cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18, marginBottom:36 }}>
                {[
                  { label:'Chiffre d\'affaires', value:prixFCFA(totalCA), emoji:'💰', color:'var(--rose)' },
                  { label:'Commandes livrées', value:nbLivre, emoji:'✅', color:'#16a34a' },
                  { label:'En attente', value:nbAttente, emoji:'⏳', color:'#b45309' },
                  { label:'Total produits', value:produits.length, emoji:'🏷️', color:'var(--mauve)' },
                ].map((stat, i) => (
                  <div key={stat.label} className={`admin-card fade-up delay-${i+1}`} style={{ padding:'26px 22px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <span style={{ fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase' }}>{stat.label}</span>
                      <span style={{ fontSize:22 }}>{stat.emoji}</span>
                    </div>
                    <p className="font-display" style={{ fontSize:28, fontWeight:700, color:stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Dernières commandes */}
              <div className="admin-card fade-up delay-2" style={{ padding:'26px' }}>
                <h3 className="font-display" style={{ fontSize:20, color:'var(--text-heading)', marginBottom:20 }}>Dernières commandes</h3>
                {commandes.slice(0,5).map(c => {
                  const meta = STATUT_META[c.statut] || STATUT_META.en_attente
                  return (
                    <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid var(--border-soft)' }}>
                      <div>
                        <p className="font-display" style={{ fontSize:15, fontWeight:600, color:'var(--text-heading)' }}>{c.client_nom}</p>
                        <p style={{ fontFamily:'Josefin Sans', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em', marginTop:2 }}>{new Date(c.created_at).toLocaleDateString('fr-SN')}</p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <p className="font-script" style={{ fontSize:18, color:'var(--rose)' }}>{prixFCFA(c.total)}</p>
                        <span style={{ background:meta.bg, color:meta.color, borderRadius:999, padding:'4px 12px', fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══ Commandes ══ */}
          {onglet === 'commandes' && (
            <div>
              <div className="fade-up" style={{ marginBottom:32 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <FlowerSVG size={16} className="deco-flower"/>
                  <div className="accent-line line-accent-anim"/>
                </div>
                <h2 className="font-display" style={{ fontSize:32, color:'var(--text-heading)' }}>Commandes 🛍️</h2>
              </div>

              {/* Filtres statut */}
              <div className="fade-up delay-1" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:26 }}>
                {['tous', ...STATUTS].map(s => {
                  const meta = s==='tous' ? { label:'Toutes', color:'var(--rose)', bg:'var(--rose-pale)' } : STATUT_META[s]
                  const isActive = filtreStatut === s
                  return (
                    <button key={s} onClick={() => setFiltreStatut(s)}
                      style={{
                        padding:'8px 18px', borderRadius:999, border:'1.5px solid',
                        fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer',
                        transition:'all 0.22s',
                        borderColor: isActive ? 'transparent' : 'var(--border)',
                        background: isActive ? meta.bg : 'white',
                        color: isActive ? meta.color : 'var(--text-muted)',
                      }}>
                      {meta?.label || s} {s!=='tous'&&commandes.filter(c=>c.statut===s).length>0&&`(${commandes.filter(c=>c.statut===s).length})`}
                    </button>
                  )
                })}
              </div>

              {loadingCmd ? (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[1,2,3].map(i=><div key={i} className="shimmer" style={{ height:100, borderRadius:18 }}/>)}
                </div>
              ) : commandesFiltrees.length === 0 ? (
                <div style={{ textAlign:'center', padding:'70px 0' }}>
                  <FlowerSVG size={44} className="deco-flower" style={{ opacity:0.3, marginBottom:16 }}/>
                  <p style={{ fontFamily:'Josefin Sans', color:'var(--text-muted)', letterSpacing:'0.08em', fontSize:13 }}>Aucune commande</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
                  {commandesFiltrees.map((c, i) => {
                    const meta = STATUT_META[c.statut] || STATUT_META.en_attente
                    return (
                      <div key={c.id} className={`admin-card fade-up delay-${Math.min(i+1,6)}`} style={{ padding:'22px 26px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14 }}>
                          <div style={{ flex:1, minWidth:200 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7 }}>
                              <p className="font-display" style={{ fontSize:18, fontWeight:700, color:'var(--text-heading)' }}>{c.client_nom}</p>
                              <span style={{ background:meta.bg, color:meta.color, borderRadius:999, padding:'3px 11px', fontFamily:'Josefin Sans', fontSize:8, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>
                                {meta.label}
                              </span>
                            </div>
                            <p style={{ fontFamily:'Josefin Sans', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em', marginBottom:4 }}>
                              📞 {c.client_telephone || '—'} · 📍 {c.client_adresse || '—'}
                            </p>
                            <p style={{ fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', letterSpacing:'0.06em' }}>
                              {new Date(c.created_at).toLocaleString('fr-SN')}
                            </p>
                            {Array.isArray(c.articles) && c.articles.length > 0 && (
                              <div style={{ marginTop:10 }}>
                                {c.articles.map((a, j) => (
                                  <p key={j} style={{ fontFamily:'Josefin Sans', fontSize:10, color:'var(--text-body)', letterSpacing:'0.04em', lineHeight:1.6 }}>
                                    • {a.nom}{a.taille?` (${a.taille}/${a.couleur})`:''} ×{a.quantite} — {prixFCFA(a.prix*a.quantite)}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12 }}>
                            <p className="font-script" style={{ fontSize:26, color:'var(--rose)' }}>{prixFCFA(c.total)}</p>
                            <select
                              value={c.statut}
                              onChange={e=>updateStatut(c.id,e.target.value)}
                              style={{
                                padding:'8px 14px', borderRadius:12,
                                border:'1.5px solid var(--border)',
                                fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-heading)',
                                background:'white', cursor:'pointer', outline:'none',
                                letterSpacing:'0.1em', textTransform:'uppercase',
                              }}
                            >
                              {STATUTS.map(s => <option key={s} value={s}>{STATUT_META[s]?.label||s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ Produits ══ */}
          {onglet === 'produits' && (
            <div>
              <div className="fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <FlowerSVG size={16} className="deco-flower"/>
                    <div className="accent-line line-accent-anim"/>
                  </div>
                  <h2 className="font-display" style={{ fontSize:32, color:'var(--text-heading)' }}>Produits 🏷️</h2>
                </div>
                <button onClick={ouvrirFormNouveauProduit} className="btn-primary" style={{ padding:'12px 22px', fontSize:10, display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nouveau produit
                </button>
              </div>

              {/* Recherche */}
              <div className="fade-up delay-1" style={{ marginBottom:22 }}>
                <input
                  type="text" placeholder="🔍 Rechercher un produit…"
                  value={searchProd} onChange={e=>setSearchProd(e.target.value)}
                  className="wyl-input"
                  style={{ maxWidth:380 }}
                />
              </div>

              {/* Formulaire produit */}
              {showForm && (
                <div className="scale-in admin-card" style={{ padding:28, marginBottom:24 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
                    <h3 className="font-display" style={{ fontSize:22, color:'var(--text-heading)' }}>
                      {editingId ? 'Modifier le produit' : 'Nouveau produit'} ✿
                    </h3>
                    <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:20 }}>×</button>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginBottom:16 }}>
                    {[
                      { key:'nom', label:'Nom *', type:'text', placeholder:'Nom du produit' },
                      { key:'prix', label:'Prix (FCFA) *', type:'number', placeholder:'15000' },
                      { key:'categorie', label:'Catégorie', type:'text', placeholder:'Robe, Top, Sac…' },
                      { key:'stock', label:'Stock', type:'number', placeholder:'10' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display:'block', fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:7 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} className="wyl-input"/>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontFamily:'Josefin Sans', fontSize:9, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:7 }}>Description</label>
                    <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Description du produit…" rows={3} className="wyl-input" style={{ resize:'vertical' }}/>
                  </div>

                  <div style={{ display:'flex', gap:24, marginBottom:18, flexWrap:'wrap' }}>
                    <Toggle on={form.disponible} onChange={v=>setForm(p=>({...p,disponible:v}))} label="Disponible"/>
                    <Toggle on={form.vedette} onChange={v=>setForm(p=>({...p,vedette:v}))} label="⭐ Vedette"/>
                  </div>

                  <UploadZone onFiles={handleImageFiles}/>
                  {uploadError && <p style={{ fontFamily:'Josefin Sans', fontSize:11, color:'#dc2626', marginTop:8 }}>⚠️ {uploadError}</p>}

                  {images.length > 0 && (
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:14 }}>
                      {images.map((img, i) => (
                        <div key={i} style={{ position:'relative', width:76, height:76, borderRadius:12, overflow:'hidden', border:'1.5px solid var(--border-soft)' }}>
                          <img src={img.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:img.uploading?0.45:1 }}/>
                          {img.uploading && (
                            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.5)' }}>
                              <div style={{ width:20, height:20, border:'2px solid var(--rose)', borderTopColor:'transparent', borderRadius:'50%', animation:'spinSlow 0.8s linear infinite' }}/>
                            </div>
                          )}
                          {!img.uploading && (
                            <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))}
                              style={{ position:'absolute', top:3, right:3, width:20, height:20, borderRadius:'50%', background:'rgba(220,38,38,0.85)', border:'none', color:'white', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display:'flex', gap:10, marginTop:20 }}>
                    <button onClick={sauvegarderProduit} disabled={saving} className="btn-primary" style={{ padding:'12px 22px', fontSize:10 }}>
                      {saving ? '⏳ Sauvegarde…' : (editingId ? '✓ Modifier' : '✿ Créer le produit')}
                    </button>
                    <button onClick={()=>setShowForm(false)} className="btn-outline" style={{ padding:'12px 22px', fontSize:10 }}>Annuler</button>
                  </div>
                </div>
              )}

              {/* Grille produits */}
              {loadingProd ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
                  {[1,2,3,4].map(i=><div key={i} className="shimmer" style={{ height:300, borderRadius:18 }}/>)}
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
                  {produitsFiltres.map((p, i) => {
                    const imgUrl = (() => { if (p.images_url) { try { const a=JSON.parse(p.images_url); if(Array.isArray(a)&&a[0]) return a[0] } catch{} } return p.image_url })()
                    return (
                      <div key={p.id} className={`admin-card fade-up delay-${Math.min(i+1,6)}`} style={{ overflow:'hidden' }}>
                        <div style={{ position:'relative', aspectRatio:'3/4', background:'linear-gradient(135deg, hsl(345,70%,96%), hsl(310,50%,96%))' }}>
                          {imgUrl && <img src={imgUrl} alt={p.nom} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                          {!p.disponible && (
                            <div style={{ position:'absolute', inset:0, background:'rgba(255,240,248,0.70)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <span style={{ fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Indisponible</span>
                            </div>
                          )}
                          {p.vedette && (
                            <span style={{ position:'absolute', top:9, left:9, background:'var(--gold)', color:'white', fontFamily:'Josefin Sans', fontSize:8, fontWeight:800, padding:'3px 10px', borderRadius:999, letterSpacing:'0.1em', textTransform:'uppercase' }}>⭐ Vedette</span>
                          )}
                        </div>
                        <div style={{ padding:'14px 16px 16px' }}>
                          <p className="font-display" style={{ fontSize:15, fontWeight:600, color:'var(--text-heading)', marginBottom:4 }}>{p.nom}</p>
                          <p className="font-script" style={{ fontSize:18, color:'var(--rose)', marginBottom:3 }}>{prixFCFA(p.prix)}</p>
                          <p style={{ fontFamily:'Josefin Sans', fontSize:9, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:13 }}>Stock : {p.stock}</p>
                          <div style={{ display:'flex', gap:8 }}>
                            <button onClick={()=>ouvrirFormEdition(p)} className="btn-outline" style={{ flex:1, padding:'8px 10px', fontSize:9 }}>Modifier</button>
                            <button onClick={()=>setConfirmDel(p.id)} style={{ width:34, height:34, borderRadius:10, border:'1.5px solid #fee2e2', background:'white', cursor:'pointer', color:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                              onMouseOver={e=>e.currentTarget.style.background='#fee2e2'}
                              onMouseOut={e=>e.currentTarget.style.background='white'}>
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal confirmation suppression ── */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(50,10,30,0.55)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="scale-in" style={{ background:'white', borderRadius:22, padding:'36px 32px', maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 32px 80px rgba(200,80,140,0.25)' }}>
            <div style={{ fontSize:42, marginBottom:14 }}>🌸</div>
            <h3 className="font-display" style={{ fontSize:22, color:'var(--text-heading)', marginBottom:10 }}>Supprimer ce produit ?</h3>
            <p style={{ fontFamily:'Josefin Sans', fontSize:12, color:'var(--text-muted)', marginBottom:24, letterSpacing:'0.04em', lineHeight:1.7 }}>
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setConfirmDel(null)} className="btn-outline" style={{ flex:1, padding:'12px' }}>Annuler</button>
              <button onClick={()=>supprimerProduit(confirmDel)} style={{ flex:1, padding:'12px', background:'#dc2626', color:'white', border:'none', borderRadius:999, fontFamily:'Josefin Sans', fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}