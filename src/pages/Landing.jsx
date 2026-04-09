import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { Leaf, ArrowRight, Package, Users, BarChart3, ShieldCheck, Github, Twitter, Mail } from 'lucide-react';

const ROLES = [
  { role:'Food Donor', icon:'🌾', color:'var(--g3)', desc:'List surplus food and coordinate pickups' },
  { role:'Recipient Organization', icon:'🏠', color:'#2563EB', desc:'Request food and manage your distribution' },
  { role:'Data Analyst', icon:'📊', color:'#7C3AED', desc:'Track trends and generate actionable reports' },
  { role:'Admin', icon:'🛡️', color:'var(--amber)', desc:'Oversee all platform activity and users' },
];
const FEATURES = [
  { icon:Package, title:'Real Donations', desc:'Donors list actual surplus food. Recipients see it live and request instantly.' },
  { icon:Users, title:'Fully Connected', desc:'Every action by one role triggers real updates for all others — zero fake data.' },
  { icon:BarChart3, title:'Live Analytics', desc:'Analysts track real waste trends based on actual platform donations.' },
  { icon:ShieldCheck, title:'Admin Control', desc:'Admins see every donation, request and delivery across the entire platform.' },
];
const TESTIMONIALS = [
  { name:'Priya Sharma', role:'Food Donor · Fresh Fields Market', text:'FoodBridge made it effortless to list our daily surplus. We\'ve connected with 3 shelters in the first month.', avatar:'PS' },
  { name:'Mohammed Irfan', role:'Recipient Org · Hope Shelter', text:'Before FoodBridge, we called donors manually. Now requests are instant and we can plan our distributions better.', avatar:'MI' },
  { name:'Ananya Reddy', role:'Data Analyst · City Municipality', text:'The live analytics dashboard has transformed how we report on food security initiatives to stakeholders.', avatar:'AR' },
];

/* Intersection-observer hook for scroll animations */
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){ setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

export default function Landing() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [heroVis, setHeroVis] = useState(false);
  useEffect(() => { document.title='FoodBridge – Food Security Platform'; setTimeout(()=>setHeroVis(true),80); }, []);

  // Live stats from real data
  const totalKgDelivered = state.donations.filter(d=>d.status==='delivered').reduce((s,d)=>s+parseFloat(d.qty||0),0);
  const deliveredCount = state.donations.filter(d=>d.status==='delivered').length;
  const orgCount = new Set([...state.donations.map(d=>d.donorId),...state.requests.map(r=>r.recipientId)]).size;
  const donorCount = new Set(state.donations.map(d=>d.donorId)).size;

  const STATS = [
    { value: totalKgDelivered>0 ? `${totalKgDelivered.toFixed(0)}+ kg` : '0 kg', label:'food rescued', icon:'🥗' },
    { value: orgCount>0 ? orgCount : '—', label:'organizations active', icon:'🤝' },
    { value: deliveredCount>0 ? deliveredCount : '—', label:'deliveries completed', icon:'🚚' },
    { value: state.users.length>0 ? state.users.length : '—', label:'registered users', icon:'👥' },
  ];

  const [statsRef, statsVis] = useVisible();
  const [featRef, featVis] = useVisible();
  const [stepsRef, stepsVis] = useVisible();
  const [testiRef, testiVis] = useVisible();

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', overflowX:'hidden' }}>

      {/* NAV */}
      <nav className="nav-bar" id="top" style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(247,252,249,.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', height:68, display:'flex', alignItems:'center', padding:'0 48px', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--g2),var(--g4))', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Leaf size={18} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--g1)' }}>FoodBridge</span>
        </div>
        <div className="desk-only" style={{ display:'flex', gap:24 }}>
          {[['#features','Features'],['#how-it-works','How it works'],['#impact','Impact']].map(([href,label]) => (
            <a key={href} href={href} style={{ fontSize:14, color:'var(--txt3)', textDecoration:'none', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--g3)'} onMouseLeave={e=>e.currentTarget.style.color='var(--txt3)'}>{label}</a>
          ))}
        </div>
        <button onClick={()=>navigate('/login')} style={{ padding:'9px 20px', background:'transparent', color:'var(--txt1)', border:'1.5px solid var(--border)', borderRadius:'var(--r)', cursor:'pointer', fontSize:14, fontWeight:500, transition:'all .2s' }} onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--g4)'; e.currentTarget.style.color='var(--g3)'; }} onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--txt1)'; }}>Sign In</button>
        <button onClick={()=>navigate('/register')} style={{ padding:'9px 22px', background:'var(--g3)', color:'#fff', border:'none', borderRadius:'var(--r)', cursor:'pointer', fontSize:14, fontWeight:600, boxShadow:'0 4px 14px rgba(28,92,62,.35)', transition:'all .2s' }} onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(28,92,62,.45)'; }} onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(28,92,62,.35)'; }}>Get Started — Free</button>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'100px 48px 60px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,125,85,.1) 0%,transparent 70%)', top:-200, right:-200, animation:'orb1 14s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.08) 0%,transparent 70%)', bottom:0, left:-100, animation:'orb2 18s ease-in-out infinite' }}/>
        </div>
        <div style={{ maxWidth:860, textAlign:'center', position:'relative', opacity:heroVis?1:0, transform:heroVis?'none':'translateY(28px)', transition:'all .8s cubic-bezier(.4,0,.2,1)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(46,125,85,.1)', border:'1.5px solid rgba(46,125,85,.2)', borderRadius:100, padding:'8px 20px', marginBottom:36, fontSize:13, fontWeight:600, color:'var(--g3)' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--g4)', display:'inline-block', animation:'pulse 2s infinite' }}/>
            Live platform — your actions, your data, your impact
          </div>
          <h1 style={{ fontFamily:'var(--font-d)', fontSize:'clamp(48px,8vw,100px)', fontWeight:900, color:'var(--txt1)', lineHeight:1.02, letterSpacing:'-.02em', marginBottom:28 }}>
            Turn Surplus Food<br/>into <em style={{ color:'var(--g3)', fontStyle:'italic' }}>Real Impact.</em>
          </h1>
          <p style={{ fontSize:'clamp(15px,2vw,20px)', color:'var(--txt3)', maxWidth:580, margin:'0 auto 52px', lineHeight:1.75 }}>
            A fully connected platform where donors list real food, recipients request it, admins manage it, and analysts track the impact — all live.
          </p>
          <div className="hero-cta" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:80 }}>
            <button onClick={()=>navigate('/register')} style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 36px', background:'var(--g3)', color:'#fff', border:'none', borderRadius:16, cursor:'pointer', fontSize:16, fontWeight:700, boxShadow:'0 8px 32px rgba(28,92,62,.35)', transition:'all .25s' }} onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(28,92,62,.45)'; }} onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(28,92,62,.35)'; }}>Start Now — It's Free <ArrowRight size={18}/></button>
            <button onClick={()=>navigate('/login')} style={{ padding:'16px 36px', background:'transparent', color:'var(--txt1)', border:'2px solid var(--border)', borderRadius:16, cursor:'pointer', fontSize:16, fontWeight:600, transition:'all .25s' }} onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--g4)'; e.currentTarget.style.color='var(--g3)'; }} onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--txt1)'; }}>Sign In to Dashboard</button>
          </div>
          <div className="role-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {ROLES.map((r,i) => (
              <div key={r.role} onClick={()=>navigate('/register')} style={{ background:'var(--surface)', borderRadius:18, padding:'22px 16px', border:'1.5px solid var(--border)', cursor:'pointer', textAlign:'center', animation:`fadeUp .5s ease ${.1+i*.08}s both`, transition:'all .25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.borderColor=r.color; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--border)'; }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{r.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--txt1)', marginBottom:6 }}>{r.role}</div>
                <div style={{ fontSize:12, color:'var(--txt3)', lineHeight:1.5 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — live from real data */}
      <section id="impact" ref={statsRef} style={{ padding:'64px 48px', background:'var(--g1)' }} className="section-pad">
        <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:13, fontWeight:700, letterSpacing:'.12em', color:'rgba(255,255,255,.35)', marginBottom:48 }}>PLATFORM IMPACT</p>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {STATS.map((s,i) => (
              <div key={s.label} style={{ padding:'28px 20px', opacity:statsVis?1:0, transform:statsVis?'none':'translateY(20px)', transition:`all .5s ease ${i*.08}s` }}>
                <div style={{ fontSize:36, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontFamily:'var(--font-d)', fontSize:42, fontWeight:900, color:'var(--amber)', lineHeight:1, marginBottom:8 }}>{s.value}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featRef} className="section-pad" style={{ padding:'80px 48px', background:'var(--surface)', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:48, fontWeight:700, color:'var(--txt1)', marginBottom:14 }}>Everything <em style={{ color:'var(--g3)', fontStyle:'italic' }}>works together</em></h2>
            <p style={{ fontSize:17, color:'var(--txt3)', maxWidth:500, margin:'0 auto' }}>Every role is interconnected. No fake data. No placeholders. Just your real actions.</p>
          </div>
          <div className="feature-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22 }}>
            {FEATURES.map((f,i) => { const Icon=f.icon; return (
              <div key={f.title} style={{ display:'flex', gap:22, padding:32, background:'var(--bg)', borderRadius:20, border:'1px solid var(--border)', opacity:featVis?1:0, transform:featVis?'none':'translateY(20px)', transition:`all .5s ease ${i*.1}s`, cursor:'default' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width:50, height:50, borderRadius:14, background:'var(--g9)', border:'1px solid var(--g7)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={22} color="var(--g3)"/></div>
                <div><h3 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>{f.title}</h3><p style={{ fontSize:15, color:'var(--txt3)', lineHeight:1.7 }}>{f.desc}</p></div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={stepsRef} className="section-pad" style={{ padding:'80px 48px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:44, fontWeight:700, color:'var(--txt1)', marginBottom:14 }}>How it works</h2>
          <p style={{ fontSize:16, color:'var(--txt3)', marginBottom:56 }}>Three steps, four roles, one connected platform.</p>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { step:'01', title:'Donor lists food', desc:'A food donor registers, lists their surplus with quantity, expiry and location. Immediately visible to recipients and admins.' },
              { step:'02', title:'Recipient requests', desc:'A recipient organization sees available donations, submits a request with their need-by date. Donor or admin approves it.' },
              { step:'03', title:'Delivered & tracked', desc:'Once delivered, the recipient confirms. Analysts and admins see all data update live — impact tracked, waste reduced.' },
            ].map((s,i) => (
              <div key={s.step} style={{ background:'var(--surface)', borderRadius:20, padding:'32px 24px', border:'1px solid var(--border)', opacity:stepsVis?1:0, transform:stepsVis?'none':'translateY(20px)', transition:`all .5s ease ${i*.1}s` }}>
                <div style={{ fontFamily:'var(--font-d)', fontSize:48, fontWeight:900, color:'var(--g7)', marginBottom:16, lineHeight:1 }}>{s.step}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:'var(--txt1)', marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'var(--txt3)', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testiRef} className="section-pad" style={{ padding:'80px 48px', background:'var(--surface)', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:44, fontWeight:700, color:'var(--txt1)', marginBottom:14 }}>Voices from <em style={{ color:'var(--g3)', fontStyle:'italic' }}>the community</em></h2>
            <p style={{ fontSize:16, color:'var(--txt3)' }}>What our users say about FoodBridge</p>
          </div>
          <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={t.name} style={{ background:'var(--bg)', borderRadius:20, padding:28, border:'1px solid var(--border)', opacity:testiVis?1:0, transform:testiVis?'none':'translateY(20px)', transition:`all .5s ease ${i*.12}s` }}>
                <p style={{ fontSize:15, color:'var(--txt2)', lineHeight:1.75, marginBottom:24, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,var(--g3),var(--g4))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--txt1)' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'var(--txt3)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ padding:'60px 48px 80px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ background:'linear-gradient(135deg,var(--g1) 0%,var(--g2) 50%,var(--g3) 100%)', borderRadius:28, padding:'56px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, opacity:.04, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'24px 24px' }}/>
            <div style={{ position:'relative' }}>
              <h2 style={{ fontFamily:'var(--font-d)', fontSize:44, fontWeight:700, color:'#fff', marginBottom:14, lineHeight:1.1 }}>Ready to start?</h2>
              <p style={{ color:'rgba(255,255,255,.65)', fontSize:16, marginBottom:36, lineHeight:1.7 }}>Register your account and start making a real difference.</p>
              <button onClick={()=>navigate('/register')} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 40px', background:'var(--amber)', color:'var(--g1)', border:'none', borderRadius:14, cursor:'pointer', fontSize:16, fontWeight:700, boxShadow:'0 8px 32px rgba(0,0,0,.3)', transition:'all .25s' }} onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,.4)'; }} onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,.3)'; }}>
                Create Free Account <ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'var(--g1)', padding:'56px 48px 32px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <div className="footer-inner" style={{ maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', gap:48, marginBottom:48, flexWrap:'wrap' }}>
          <div style={{ maxWidth:280 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}><Leaf size={16} color="var(--amber)"/></div>
              <span style={{ fontFamily:'var(--font-d)', fontSize:19, color:'#fff', fontWeight:700 }}>FoodBridge</span>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.7 }}>Reducing food waste and building food security — one donation at a time.</p>
            <div className="footer-links" style={{ display:'flex', gap:14, marginTop:20 }}>
              <a href="#top" style={{ color:'rgba(255,255,255,.3)', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--amber)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}><Twitter size={17}/></a>
              <a href="#top" style={{ color:'rgba(255,255,255,.3)', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--amber)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}><Github size={17}/></a>
              <a href="#top" style={{ color:'rgba(255,255,255,.3)', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--amber)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}><Mail size={17}/></a>
            </div>
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.25)', marginBottom:20 }}>PLATFORM</p>
            {[['#features','Features'],['#how-it-works','How it works'],['#impact','For Donors'],['#impact','For Recipients']].map(([href,l]) => (
              <div key={l} style={{ marginBottom:12 }}><a href={href} style={{ fontSize:14, color:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>{l}</a></div>
            ))}
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.25)', marginBottom:20 }}>COMPANY</p>
            {['About Us','Blog','Partners','Contact'].map(l => (
              <div key={l} style={{ marginBottom:12 }}><a href="#top" style={{ fontSize:14, color:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>{l}</a></div>
            ))}
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.25)', marginBottom:20 }}>LEGAL</p>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <div key={l} style={{ marginBottom:12 }}><a href="#top" style={{ fontSize:14, color:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>{l}</a></div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:1100, margin:'0 auto', borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.25)' }}>© {new Date().getFullYear()} FoodBridge. Reducing waste, building food security.</p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.2)' }}>Made with 💚 for communities everywhere</p>
        </div>
      </footer>
    </div>
  );
}
