import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Field, Input, Btn, Card } from '../components/UI';
import { Eye, EyeOff, Check } from 'lucide-react';

const ROLE_COLOR = { 'Food Donor':'var(--g4)', 'Recipient Organization':'#2563EB', 'Data Analyst':'#7C3AED', 'Admin':'var(--amber)' };

export function ProfilePage() {
  const { state, dispatch, toast } = useStore();
  const user = state.user;
  const color = ROLE_COLOR[user?.role] || 'var(--g4)';
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name||'', org: user?.org||'', phone: user?.phone||'', location: user?.location||'' });
  const [passForm, setPassForm] = useState({ current:'', next:'', confirm:'' });
  const [showP, setShowP] = useState({ c:false, n:false });
  const [errors, setErrors] = useState({});
  const [passErrors, setPassErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    dispatch({ type:'UPDATE_PROFILE', payload: form });
    toast('Profile updated successfully', 'success');
    setSaving(false);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passForm.current) errs.current = 'Enter your current password';
    if (!passForm.next || passForm.next.length < 6) errs.next = 'At least 6 characters';
    if (passForm.next !== passForm.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPassErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    dispatch({ type:'UPDATE_PROFILE', payload: { pass: passForm.next } });
    toast('Password changed successfully', 'success');
    setPassForm({ current:'', next:'', confirm:'' });
    setPassErrors({});
    setSaving(false);
  };

  const initials = user?.name?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  return (
    <div style={{ padding:'28px 32px', maxWidth:780 }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>My Profile</h2>
        <p style={{ fontSize:14, color:'var(--txt3)' }}>Manage your personal information and account settings</p>
      </div>

      {/* Profile header */}
      <Card style={{ padding:'28px 32px', marginBottom:24, display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ width:72, height:72, borderRadius:20, background:`${color}20`, border:`2px solid ${color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color, flexShrink:0, fontFamily:'var(--font-d)' }}>{initials}</div>
        <div style={{ flex:1, minWidth:200 }}>
          <h3 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>{user?.name}</h3>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:12, fontWeight:700, color, background:`${color}15`, padding:'4px 12px', borderRadius:20 }}>{user?.role}</span>
            {user?.org && <span style={{ fontSize:13, color:'var(--txt3)' }}>• {user.org}</span>}
            {user?.location && <span style={{ fontSize:13, color:'var(--txt3)' }}>• {user.location}</span>}
          </div>
          <div style={{ fontSize:13, color:'var(--txt3)', marginTop:6 }}>Member since {new Date(user?.joinedAt).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {[['profile','Personal Info'],['password','Change Password'],['account','Account Stats']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding:'10px 20px', border:'none', background:'none', cursor:'pointer', fontSize:14, fontFamily:'var(--font-b)', fontWeight:tab===id?700:400, color:tab===id?'var(--g3)':'var(--txt3)', borderBottom:`2px solid ${tab===id?'var(--g3)':'transparent'}`, transition:'all .2s', marginBottom:-1 }}>{label}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab==='profile' && (
        <Card style={{ padding:32 }}>
          <form onSubmit={saveProfile} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {(user?.role==='Food Donor'||user?.role==='Recipient Organization') && (
              <Field label="ORGANIZATION NAME">
                <Input value={form.org} onChange={e => setForm(f=>({...f,org:e.target.value}))} placeholder="Your organization" />
              </Field>
            )}
            <Field label="FULL NAME" error={errors.name}>
              <Input value={form.name} onChange={e => { setForm(f=>({...f,name:e.target.value})); setErrors(p=>({...p,name:''})); }} placeholder="Your full name" error={errors.name} />
            </Field>
            <Field label="EMAIL ADDRESS">
              <Input type="email" value={user?.email} disabled style={{ opacity:.6, cursor:'not-allowed' }} />
              <div style={{ fontSize:12, color:'var(--txt3)', marginTop:4 }}>Email cannot be changed. Contact your admin if needed.</div>
            </Field>
            <Field label="PHONE NUMBER">
              <Input type="tel" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="+91 98765 43210" />
            </Field>
            <Field label="CITY / AREA">
              <Input value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))} placeholder="e.g., Banjara Hills, Hyderabad" />
            </Field>
            <Btn loading={saving} size="lg" style={{ alignSelf:'flex-start', minWidth:160 }}><Check size={16}/> Save Changes</Btn>
          </form>
        </Card>
      )}

      {/* Password Tab */}
      {tab==='password' && (
        <Card style={{ padding:32 }}>
          <form onSubmit={savePassword} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <Field label="CURRENT PASSWORD" error={passErrors.current}>
              <div style={{ position:'relative' }}>
                <Input type={showP.c?'text':'password'} value={passForm.current} onChange={e => { setPassForm(f=>({...f,current:e.target.value})); setPassErrors(p=>({...p,current:''})); }} placeholder="Your current password" error={passErrors.current} style={{ paddingRight:48 }} />
                <button type="button" onClick={() => setShowP(p=>({...p,c:!p.c}))} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'var(--txt3)' }}>{showP.c?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
            </Field>
            <Field label="NEW PASSWORD" error={passErrors.next}>
              <div style={{ position:'relative' }}>
                <Input type={showP.n?'text':'password'} value={passForm.next} onChange={e => { setPassForm(f=>({...f,next:e.target.value})); setPassErrors(p=>({...p,next:''})); }} placeholder="Min. 6 characters" error={passErrors.next} style={{ paddingRight:48 }} />
                <button type="button" onClick={() => setShowP(p=>({...p,n:!p.n}))} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'var(--txt3)' }}>{showP.n?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
            </Field>
            <Field label="CONFIRM NEW PASSWORD" error={passErrors.confirm}>
              <Input type="password" value={passForm.confirm} onChange={e => { setPassForm(f=>({...f,confirm:e.target.value})); setPassErrors(p=>({...p,confirm:''})); }} placeholder="Repeat new password" error={passErrors.confirm} />
              {passForm.confirm && passForm.confirm===passForm.next && <div style={{ fontSize:12, color:'var(--g4)', marginTop:4 }}>✓ Passwords match</div>}
            </Field>
            <Btn loading={saving} size="lg" style={{ alignSelf:'flex-start', minWidth:180 }}>Update Password</Btn>
          </form>
        </Card>
      )}

      {/* Stats Tab */}
      {tab==='account' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {user?.role==='Food Donor' && [
            { label:'Donations Listed', value:state.donations.filter(d=>d.donorId===user.id).length, icon:'📦' },
            { label:'Delivered', value:state.donations.filter(d=>d.donorId===user.id&&d.status==='delivered').length, icon:'✅' },
            { label:'In Transit', value:state.donations.filter(d=>d.donorId===user.id&&d.status==='in_transit').length, icon:'🚛' },
            { label:'Kg Contributed', value:`${state.donations.filter(d=>d.donorId===user.id&&d.status==='delivered').reduce((s,d)=>s+parseFloat(d.qty||0),0).toFixed(1)} kg`, icon:'⚖️' },
          ].map(s => (
            <Card key={s.label} style={{ padding:22, display:'flex', gap:16, alignItems:'center' }}>
              <span style={{ fontSize:32 }}>{s.icon}</span>
              <div><div style={{ fontFamily:'var(--font-d)', fontSize:28, fontWeight:700, color:'var(--g3)' }}>{s.value}</div><div style={{ fontSize:13, color:'var(--txt3)' }}>{s.label}</div></div>
            </Card>
          ))}
          {user?.role==='Recipient Organization' && [
            { label:'Requests Made', value:state.requests.filter(r=>r.recipientId===user.id).length, icon:'📋' },
            { label:'Fulfilled', value:state.requests.filter(r=>r.recipientId===user.id&&r.status==='delivered').length, icon:'✅' },
            { label:'Pending', value:state.requests.filter(r=>r.recipientId===user.id&&r.status==='pending').length, icon:'⏳' },
            { label:'Kg Received', value:`${state.donations.filter(d=>d.recipientId===user.id&&d.status==='delivered').reduce((s,d)=>s+parseFloat(d.qty||0),0).toFixed(1)} kg`, icon:'🥗' },
          ].map(s => (
            <Card key={s.label} style={{ padding:22, display:'flex', gap:16, alignItems:'center' }}>
              <span style={{ fontSize:32 }}>{s.icon}</span>
              <div><div style={{ fontFamily:'var(--font-d)', fontSize:28, fontWeight:700, color:'var(--g3)' }}>{s.value}</div><div style={{ fontSize:13, color:'var(--txt3)' }}>{s.label}</div></div>
            </Card>
          ))}
          {(user?.role==='Data Analyst'||user?.role==='Admin') && [
            { label:'Total Donations', value:state.donations.length, icon:'📦' },
            { label:'Total Requests', value:state.requests.length, icon:'📋' },
            { label:'Registered Users', value:state.users.length, icon:'👥' },
            { label:'Reports Created', value:state.reports.filter(r=>r.analystId===user.id).length, icon:'📄' },
          ].map(s => (
            <Card key={s.label} style={{ padding:22, display:'flex', gap:16, alignItems:'center' }}>
              <span style={{ fontSize:32 }}>{s.icon}</span>
              <div><div style={{ fontFamily:'var(--font-d)', fontSize:28, fontWeight:700, color:'var(--g3)' }}>{s.value}</div><div style={{ fontSize:13, color:'var(--txt3)' }}>{s.label}</div></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
