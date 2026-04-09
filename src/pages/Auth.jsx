import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { Field, Input, Btn } from '../components/UI';
import { Leaf, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const ROLES = ['Food Donor', 'Recipient Organization', 'Data Analyst', 'Admin'];
const ROLE_INFO = {
  'Food Donor':             { icon:'🌾', desc:'List surplus food and track donations' },
  'Recipient Organization': { icon:'🏠', desc:'Request food and manage distribution' },
  'Data Analyst':           { icon:'📊', desc:'Analyze waste trends and generate reports' },
  'Admin':                  { icon:'🛡️', desc:'Full platform oversight and management' },
};

function AuthLeft({ title, sub, items }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 60); }, []);
  return (
    <div style={{ flex:'0 0 44%', background:'linear-gradient(155deg,#061510 0%,var(--g1) 30%,var(--g2) 70%,#0F2E1C 100%)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'52px 52px 48px', opacity:vis?1:0, transform:vis?'none':'translateX(-30px)', transition:'all .7s cubic-bezier(.4,0,.2,1)' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.15) 0%,transparent 60%)', top:-100, right:-100, animation:'orb1 12s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,125,85,.2) 0%,transparent 60%)', bottom:0, left:-50, animation:'orb2 16s ease-in-out infinite' }} />
        <div style={{ position:'absolute', inset:0, opacity:.03, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'44px 44px' }} />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
        <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,var(--amber),var(--amber-l))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(245,158,11,.4)' }}><Leaf size={21} color="var(--g1)" strokeWidth={2.5} /></div>
        <div>
          <div style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'#fff', lineHeight:1 }}>FoodBridge</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.12em', marginTop:3 }}>FOOD SECURITY PLATFORM</div>
        </div>
      </div>
      <div style={{ position:'relative' }}>
        <h1 style={{ fontFamily:'var(--font-d)', fontSize:46, fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:20 }}>{title}<br /><em style={{ color:'var(--amber)', fontStyle:'italic' }}>{sub}</em></h1>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'14px 18px', background:'rgba(255,255,255,.06)', borderRadius:13, border:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(8px)', animation:`fadeUp .5s ease ${.2+i*.1}s both` }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.45)', lineHeight:1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:'relative', borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:22 }}>
        <p style={{ fontSize:13, color:'rgba(255,255,255,.35)', fontStyle:'italic', lineHeight:1.6 }}>"Every kilogram of food rescued is a meal on someone's plate."</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FORGOT PASSWORD MODAL
══════════════════════════════════════════════ */
function ForgotModal({ onClose }) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fadeIn .2s ease' }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:'var(--surface)', borderRadius:24, padding:36, width:'100%', maxWidth:420, boxShadow:'var(--shadow-xl)', animation:'scaleIn .25s ease' }}>
        {!sent ? (
          <>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:24, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>Reset password</h2>
            <p style={{ fontSize:14, color:'var(--txt3)', marginBottom:24, lineHeight:1.6 }}>Enter your registered email and we'll send you a reset link.</p>
            <Field label="EMAIL ADDRESS">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@organization.com" />
            </Field>
            <div style={{ display:'flex', gap:10, marginTop:24 }}>
              <Btn variant="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={() => { if(email) setSent(true); }} style={{ flex:2 }}>Send Reset Link</Btn>
            </div>
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📬</div>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--txt1)', marginBottom:10 }}>Check your email</h2>
            <p style={{ fontSize:14, color:'var(--txt3)', lineHeight:1.7, marginBottom:24 }}>If <strong>{email}</strong> is registered, you'll receive a reset link shortly. (This is a demo — no email is actually sent.)</p>
            <Btn onClick={onClose} style={{ width:'100%' }}>Got it</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════ */
export function Login() {
  const { state, dispatch, toast } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('');
  const [showP, setShowP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [vis, setVis] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  // Clear store error on mount
  useEffect(() => { dispatch({ type:'CLEAR_ERROR' }); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
    if (!pass) errs.pass = 'Password required';
    if (!role) errs.role = 'Select your role';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    dispatch({ type:'LOGIN', email, pass, role });
    setLoading(false);
  };

  // Watch for login result
  useEffect(() => {
    if (state._error === 'BAD_CREDENTIALS') {
      setErrors({ form:'Incorrect email, password, or role. Please try again.' });
      dispatch({ type:'CLEAR_ERROR' });
    } else if (state.user) {
      toast(`Welcome back, ${state.user.name}!`, 'success');
      navigate('/app');
    }
  }, [state._error, state.user]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'var(--font-b)' }}>
      <AuthLeft title="Good to see" sub="you again." items={[
        { icon:'🌾', title:'Donors', desc:'Track your listed donations and their status' },
        { icon:'🏠', title:'Recipients', desc:'Manage food requests and confirm deliveries' },
        { icon:'📊', title:'Analysts', desc:'Access live waste analytics and reports' },
        { icon:'🛡️', title:'Admins', desc:'Full platform visibility and control' },
      ]} />
      <div className="auth-right" style={{ flex:1, background:'var(--surface)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'52px 48px', opacity:vis?1:0, transform:vis?'none':'translateX(30px)', transition:'all .7s cubic-bezier(.4,0,.2,1) .1s', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:440 }}>
          <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:6, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'var(--txt3)', marginBottom:40, padding:0, fontFamily:'var(--font-b)', transition:'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--g3)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--txt3)'}>
            <ArrowLeft size={14} /> Back to Home
          </button>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:38, fontWeight:700, color:'var(--txt1)', marginBottom:8, lineHeight:1.1 }}>Sign in</h2>
          <p style={{ fontSize:15, color:'var(--txt3)', marginBottom:36 }}>Access your FoodBridge dashboard</p>

          {errors.form && (
            <div style={{ fontSize:13, color:'var(--red)', marginBottom:20, padding:'12px 16px', background:'var(--red-l)', borderRadius:12, border:'1px solid rgba(239,68,68,.2)' }}>⚠ {errors.form}</div>
          )}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'var(--txt2)', display:'block', marginBottom:10, letterSpacing:'.05em' }}>YOUR ROLE</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {ROLES.map(r => (
                  <button type="button" key={r} onClick={() => { setRole(r); setErrors(p => ({ ...p, role:'' })); }} style={{ padding:'12px 10px', border:`2px solid ${role===r?'var(--g3)':'var(--border)'}`, borderRadius:'var(--r)', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'var(--font-b)', textAlign:'center', background:role===r?'var(--g9)':'transparent', color:role===r?'var(--g3)':'var(--txt3)', transition:'all .18s', lineHeight:1.3 }}>
                    <span style={{ fontSize:18, display:'block', marginBottom:4 }}>{ROLE_INFO[r].icon}</span>{r}
                  </button>
                ))}
              </div>
              {errors.role && <div style={{ fontSize:12, color:'var(--red)', marginTop:5 }}>⚠ {errors.role}</div>}
            </div>
            <Field label="EMAIL ADDRESS" error={errors.email}>
              <Input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email:'', form:'' })); }} placeholder="you@organization.com" error={errors.email} />
            </Field>
            <Field label="PASSWORD" error={errors.pass}>
              <div style={{ position:'relative' }}>
                <Input type={showP?'text':'password'} value={pass} onChange={e => { setPass(e.target.value); setErrors(p => ({ ...p, pass:'', form:'' })); }} placeholder="••••••••" error={errors.pass} style={{ paddingRight:48 }} />
                <button type="button" onClick={() => setShowP(!showP)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'var(--txt3)' }}>
                  {showP ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </Field>
            <div style={{ textAlign:'right', marginTop:-10 }}>
              <button type="button" onClick={() => setShowForgot(true)} style={{ fontSize:13, color:'var(--g4)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-b)' }}>
                Forgot password?
              </button>
            </div>
            <Btn loading={loading} size="lg" style={{ marginTop:4 }}>Sign In <ArrowRight size={17}/></Btn>
          </form>

          <div style={{ textAlign:'center', marginTop:28, paddingTop:24, borderTop:'1px solid var(--border)' }}>
            <span style={{ fontSize:14, color:'var(--txt3)' }}>No account yet? </span>
            <button onClick={() => navigate('/register')} style={{ fontSize:14, color:'var(--g3)', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Create one →</button>
          </div>
        </div>
      </div>
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   REGISTER (3-step)
══════════════════════════════════════════════ */
export function Register() {
  const { state, dispatch, toast } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showP, setShowP] = useState(false);
  const [errors, setErrors] = useState({});
  const [vis, setVis] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  useEffect(() => { dispatch({ type:'CLEAR_ERROR' }); }, []);

  const [form, setForm] = useState({ role:'', name:'', email:'', phone:'', org:'', location:'', pass:'', passC:'', agree:false });
  const upd = (k, v) => { setForm(f => ({ ...f, [k]:v })); setErrors(p => ({ ...p, [k]:'' })); };

  const validate = () => {
    const e = {};
    if (step===0 && !form.role) e.role='Select a role';
    if (step===1) {
      if (!form.name.trim()) e.name='Full name required';
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email='Valid email required';
      if (!form.phone.trim()) e.phone='Phone required';
      if ((form.role==='Food Donor'||form.role==='Recipient Organization') && !form.org.trim()) e.org='Organization name required';
    }
    if (step===2) {
      if (!form.pass || form.pass.length<6) e.pass='At least 6 characters';
      if (form.pass!==form.passC) e.passC='Passwords do not match';
      if (!form.agree) e.agree='You must agree to continue';
    }
    return e;
  };

  const next = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s+1);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    dispatch({ type:'REGISTER', payload:{ name:form.name, email:form.email, pass:form.pass, role:form.role, org:form.org, phone:form.phone, location:form.location } });
    setLoading(false);
  };

  useEffect(() => {
    if (state._error==='EMAIL_EXISTS') {
      setStep(1);
      setErrors({ email:'This email is already registered. Try signing in instead.' });
      dispatch({ type:'CLEAR_ERROR' });
    } else if (state.user && loading===false && step===2) {
      setRegisteredName(form.name);
      setDone(true);
    }
  }, [state._error, state.user]);

  const strength = (p) => { let s=0; if(p.length>=6)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s; };
  const strScore = strength(form.pass);
  const strColors = ['','var(--red)','var(--amber)','var(--g5)','var(--g3)'];
  const strLabels = ['','Weak','Fair','Good','Strong'];

  // Welcome screen
  if (done) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', fontFamily:'var(--font-b)' }}>
      <div style={{ textAlign:'center', padding:'48px 32px', maxWidth:480, animation:'fadeUp .6s ease both' }}>
        <div style={{ width:80, height:80, borderRadius:24, background:'linear-gradient(135deg,var(--g3),var(--g4))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', boxShadow:'0 16px 48px rgba(28,92,62,.3)' }}>
          <span style={{ fontSize:36 }}>🌱</span>
        </div>
        <h1 style={{ fontFamily:'var(--font-d)', fontSize:36, fontWeight:700, color:'var(--g1)', marginBottom:12, lineHeight:1.1 }}>You're all set,<br />{registeredName.split(' ')[0]}!</h1>
        <p style={{ fontSize:16, color:'var(--txt3)', lineHeight:1.7, marginBottom:36 }}>Your FoodBridge account is ready. Start making real impact — every donation you make or request you fulfil is tracked live on the platform.</p>
        <Btn size="lg" onClick={() => navigate('/app')} style={{ margin:'0 auto' }}>Go to Dashboard <ArrowRight size={17}/></Btn>
        <p style={{ fontSize:13, color:'var(--txt3)', marginTop:20 }}>Registered as: <strong style={{ color:'var(--g3)' }}>{form.role}</strong></p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'var(--font-b)' }}>
      <AuthLeft title="Join the" sub="movement." items={[
        { icon:'①', title:'Choose your role', desc:'Donor, Recipient, Analyst or Admin' },
        { icon:'②', title:'Your details', desc:'Personal & organization info' },
        { icon:'③', title:'Secure your account', desc:'Set your password' },
      ]} />
      <div className="auth-right" style={{ flex:1, background:'var(--surface)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'52px 48px', opacity:vis?1:0, transform:vis?'none':'translateX(30px)', transition:'all .7s cubic-bezier(.4,0,.2,1) .1s', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:460 }}>
          <button onClick={() => step===0 ? navigate('/') : setStep(s => s-1)} style={{ display:'flex', alignItems:'center', gap:6, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'var(--txt3)', marginBottom:36, padding:0, fontFamily:'var(--font-b)', transition:'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--g3)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--txt3)'}>
            <ArrowLeft size={14}/> {step===0?'Back to Home':'Back'}
          </button>
          {/* Step indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:40 }}>
            {[0,1,2].map(i => (
              <React.Fragment key={i}>
                <div style={{ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:i<=step?'var(--g3)':'var(--border)', color:i<=step?'#fff':'var(--txt3)', fontSize:13, fontWeight:700, flexShrink:0, boxShadow:i===step?'0 4px 14px rgba(28,92,62,.35)':'none', transition:'all .3s' }}>
                  {i<step ? <Check size={15}/> : i+1}
                </div>
                {i<2 && <div style={{ flex:1, height:2, background:i<step?'var(--g3)':'var(--border)', transition:'background .4s', minWidth:36 }}/>}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 0 — Role */}
          {step===0 && (
            <div style={{ animation:'fadeUp .35s ease both' }}>
              <h2 style={{ fontFamily:'var(--font-d)', fontSize:34, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>Choose your role</h2>
              <p style={{ fontSize:15, color:'var(--txt3)', marginBottom:28 }}>How will you use FoodBridge?</p>
              {errors.role && <div style={{ fontSize:13, color:'var(--red)', marginBottom:14, padding:'10px 14px', background:'var(--red-l)', borderRadius:10 }}>⚠ {errors.role}</div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
                {ROLES.map(r => (
                  <button type="button" key={r} onClick={() => upd('role', r)} style={{ padding:'24px 16px', border:`2px solid ${form.role===r?'var(--g3)':'var(--border)'}`, borderRadius:16, cursor:'pointer', textAlign:'center', fontFamily:'var(--font-b)', background:form.role===r?'var(--g9)':'transparent', transition:'all .2s', position:'relative', overflow:'hidden' }}
                    onMouseEnter={e => { if(form.role!==r) e.currentTarget.style.borderColor='var(--g6)'; }}
                    onMouseLeave={e => { if(form.role!==r) e.currentTarget.style.borderColor='var(--border)'; }}>
                    {form.role===r && <div style={{ position:'absolute', top:10, right:10, width:20, height:20, borderRadius:'50%', background:'var(--g3)', display:'flex', alignItems:'center', justifyContent:'center' }}><Check size={11} color="#fff"/></div>}
                    <div style={{ fontSize:30, marginBottom:10 }}>{ROLE_INFO[r].icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:form.role===r?'var(--g3)':'var(--txt1)', marginBottom:5 }}>{r}</div>
                    <div style={{ fontSize:11, color:'var(--txt3)', lineHeight:1.5 }}>{ROLE_INFO[r].desc}</div>
                  </button>
                ))}
              </div>
              <Btn onClick={next} size="lg" style={{ width:'100%' }}>Continue <ArrowRight size={17}/></Btn>
            </div>
          )}

          {/* STEP 1 — Details */}
          {step===1 && (
            <form onSubmit={e => { e.preventDefault(); next(); }} style={{ animation:'fadeUp .35s ease both', display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <h2 style={{ fontFamily:'var(--font-d)', fontSize:34, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>Your details</h2>
                <p style={{ fontSize:15, color:'var(--txt3)' }}>Tell us about yourself</p>
              </div>
              {(form.role==='Food Donor'||form.role==='Recipient Organization') && (
                <Field label="ORGANIZATION NAME" error={errors.org}>
                  <Input value={form.org} onChange={e => upd('org', e.target.value)} placeholder={form.role==='Food Donor'?'e.g., Fresh Fields Market':'e.g., Hope Shelter'} error={errors.org}/>
                </Field>
              )}
              <Field label="FULL NAME" error={errors.name}>
                <Input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Your full name" error={errors.name}/>
              </Field>
              <Field label="EMAIL ADDRESS" error={errors.email}>
                <Input type="email" value={form.email} onChange={e => upd('email', e.target.value)} placeholder="you@organization.com" error={errors.email}/>
              </Field>
              <Field label="PHONE NUMBER" error={errors.phone}>
                <Input type="tel" value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="+91 98765 43210" error={errors.phone}/>
              </Field>
              <Field label="CITY / AREA (OPTIONAL)">
                <Input value={form.location} onChange={e => upd('location', e.target.value)} placeholder="e.g., Banjara Hills, Hyderabad"/>
              </Field>
              <Btn size="lg" style={{ width:'100%', marginTop:4 }}>Continue <ArrowRight size={17}/></Btn>
            </form>
          )}

          {/* STEP 2 — Password */}
          {step===2 && (
            <form onSubmit={submit} style={{ animation:'fadeUp .35s ease both', display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <h2 style={{ fontFamily:'var(--font-d)', fontSize:34, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>Secure your account</h2>
                <p style={{ fontSize:15, color:'var(--txt3)' }}>Create a strong password</p>
              </div>
              <Field label="PASSWORD" error={errors.pass}>
                <div style={{ position:'relative' }}>
                  <Input type={showP?'text':'password'} value={form.pass} onChange={e => upd('pass', e.target.value)} placeholder="Min. 6 characters" error={errors.pass} style={{ paddingRight:48 }}/>
                  <button type="button" onClick={() => setShowP(!showP)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'var(--txt3)' }}>{showP?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                </div>
                {form.pass && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:'flex', gap:4, marginBottom:5 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<=strScore?strColors[strScore]:'var(--border)', transition:'background .3s' }}/>)}
                    </div>
                    <div style={{ fontSize:12, color:strColors[strScore], fontWeight:600 }}>{strLabels[strScore]} password</div>
                  </div>
                )}
              </Field>
              <Field label="CONFIRM PASSWORD" error={errors.passC}>
                <Input type="password" value={form.passC} onChange={e => upd('passC', e.target.value)} placeholder="Repeat password" error={errors.passC}/>
                {form.passC && form.passC===form.pass && <div style={{ fontSize:12, color:'var(--g4)', marginTop:4 }}>✓ Passwords match</div>}
              </Field>
              <div style={{ background:'var(--g9)', borderRadius:14, padding:'16px 18px', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--txt3)', letterSpacing:'.06em', marginBottom:12 }}>ACCOUNT SUMMARY</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[{ l:'Role', v:form.role },{ l:'Name', v:form.name },{ l:'Email', v:form.email },{ l:form.org?'Org':'Location', v:form.org||form.location||'—' }].map(r => (
                    <div key={r.l}><div style={{ fontSize:11, color:'var(--txt3)' }}>{r.l}</div><div style={{ fontSize:13, fontWeight:600, color:'var(--txt1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.v||'—'}</div></div>
                  ))}
                </div>
              </div>
              <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer' }}>
                <div onClick={() => upd('agree', !form.agree)} style={{ width:20, height:20, borderRadius:6, border:`2px solid ${form.agree?'var(--g3)':errors.agree?'var(--red)':'var(--border)'}`, background:form.agree?'var(--g3)':'transparent', flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
                  {form.agree && <Check size={12} color="#fff"/>}
                </div>
                <span style={{ fontSize:13, color:'var(--txt3)', lineHeight:1.6 }}>I agree to FoodBridge's <span style={{ color:'var(--g3)', fontWeight:600 }}>Terms of Service</span> and <span style={{ color:'var(--g3)', fontWeight:600 }}>Privacy Policy</span>.</span>
              </label>
              {errors.agree && <div style={{ fontSize:12, color:'var(--red)' }}>⚠ {errors.agree}</div>}
              <Btn loading={loading} size="lg" style={{ width:'100%', marginTop:4 }}>Create Account <ArrowRight size={17}/></Btn>
            </form>
          )}

          <div style={{ textAlign:'center', marginTop:24 }}>
            <span style={{ fontSize:14, color:'var(--txt3)' }}>Already have an account? </span>
            <button onClick={() => navigate('/login')} style={{ fontSize:14, color:'var(--g3)', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Sign in →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
