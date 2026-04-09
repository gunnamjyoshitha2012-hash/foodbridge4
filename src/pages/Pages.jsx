import React, { useState } from 'react';
import { useStore, useStats } from '../context/store';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatCard, Card, Empty, Btn, Badge, Modal, Field, Input, Select } from '../components/UI';
import { Plus, FileText, Download } from 'lucide-react';

// Re-export everything from split files
export { DonatePage, MyDonations } from './DonorPages';
export { AvailableFood, MyRequests } from './RecipientPages';
export { AllDonations, AllRequests, UsersPage } from './AdminPages';

function fmtDate(iso) { if(!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtTime(iso) { if(!iso) return ''; return new Date(iso).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }
const tip = { borderRadius:12, border:'none', boxShadow:'var(--shadow-lg)', fontFamily:'var(--font-b)', background:'var(--surface)', color:'var(--txt1)', fontSize:13 };

/* ══════════════════════════════════════════════
   SHARED DASHBOARD
══════════════════════════════════════════════ */
export function Dashboard() {
  const { state } = useStore();
  const role = state.user?.role;
  const { myDonations, myRequests } = useStats(state);
  if (role==='Food Donor') return <DonorDashboard my={myDonations}/>;
  if (role==='Recipient Organization') return <RecipientDashboard my={myRequests}/>;
  if (role==='Data Analyst') return <div style={{ padding:'28px 32px', maxWidth:1200 }}><AnalyticsView/></div>;
  if (role==='Admin') return <AdminDashboard/>;
  return null;
}

function WelcomeBanner({ name, role, msg }) {
  return (
    <div style={{ background:'linear-gradient(135deg,var(--g1) 0%,var(--g2) 55%,var(--g3) 100%)', borderRadius:22, padding:'28px 36px', marginBottom:26, position:'relative', overflow:'hidden', animation:'fadeUp .5s ease both' }}>
      <div style={{ position:'absolute', right:-50, top:-50, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,.04)' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.1em', marginBottom:8 }}>WELCOME BACK · {role.toUpperCase()}</div>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, color:'#fff', fontWeight:700, marginBottom:8 }}>Hello, {name?.split(' ')[0]} 👋</h2>
        <p style={{ color:'rgba(255,255,255,.6)', fontSize:14 }}>{msg}</p>
      </div>
    </div>
  );
}

function RecentDonations({ donations, showDonor }) {
  return (
    <Card>
      <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--border)' }}><div style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--txt1)' }}>Recent Donations</div></div>
      <div>{donations.map((d,i) => (
        <div key={d.id} style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 22px', borderBottom:i<donations.length-1?'1px solid var(--border)':'none' }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'var(--g9)', border:'1px solid var(--g7)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>🌾</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--txt1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.food}</div>
            {showDonor && <div style={{ fontSize:12, color:'var(--txt3)' }}>{d.donorOrg||d.donorName}</div>}
            <div style={{ fontSize:11, color:'var(--txt3)' }}>{d.qty} {d.unit} · {fmtDate(d.createdAt)}</div>
          </div>
          <Badge status={d.status}/>
        </div>
      ))}</div>
    </Card>
  );
}

function RecentRequests({ requests, showDonor }) {
  return (
    <Card>
      <div style={{ padding:'20px 22px', borderBottom:'1px solid var(--border)' }}><div style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--txt1)' }}>Recent Requests</div></div>
      <div>{requests.length===0
        ? <div style={{ padding:'28px', textAlign:'center', color:'var(--txt3)', fontSize:14 }}>No requests yet</div>
        : requests.map((r,i) => (
          <div key={r.id} style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 22px', borderBottom:i<requests.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'var(--blue-l)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>📋</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--txt1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.food}</div>
              {showDonor && <div style={{ fontSize:12, color:'var(--txt3)' }}>From: {r.donorOrg||r.donorName}</div>}
              <div style={{ fontSize:11, color:'var(--txt3)' }}>{r.recipientOrg||r.recipientName} · {fmtDate(r.createdAt)}</div>
            </div>
            <Badge status={r.status}/>
          </div>
        ))
      }</div>
    </Card>
  );
}

function DonorDashboard({ my }) {
  const { state } = useStore();
  return (
    <div style={{ padding:'28px 32px', maxWidth:1200 }}>
      <WelcomeBanner name={state.user?.name} role="Food Donor" msg="List your surplus food below and help fight waste."/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:28 }} className="grid-4">
        <StatCard label="My Listings" value={my.length} icon="📦" delay={0}/>
        <StatCard label="Delivered" value={my.filter(d=>d.status==='delivered').length} icon="✅" color="var(--g4)" delay={.07}/>
        <StatCard label="In Transit" value={my.filter(d=>d.status==='in_transit').length} icon="🚛" color="var(--amber)" delay={.14}/>
        <StatCard label="Available Now" value={my.filter(d=>d.status==='available').length} icon="🟢" color="var(--g5)" delay={.21}/>
      </div>
      {my.length===0
        ? <Empty icon="🌾" title="No donations yet" desc="Click 'List Donation' in the sidebar to add your first surplus food listing."/>
        : <RecentDonations donations={my.slice(0,5)}/>}
    </div>
  );
}

function RecipientDashboard({ my }) {
  const { state } = useStore();
  return (
    <div style={{ padding:'28px 32px', maxWidth:1200 }}>
      <WelcomeBanner name={state.user?.name} role="Recipient Organization" msg="Browse available food and submit requests for your community."/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:28 }} className="grid-4">
        <StatCard label="My Requests" value={my.length} icon="📋" delay={0}/>
        <StatCard label="Pending" value={my.filter(r=>r.status==='pending').length} icon="⏳" color="var(--amber)" delay={.07}/>
        <StatCard label="Approved" value={my.filter(r=>r.status==='approved').length} icon="✅" color="var(--g4)" delay={.14}/>
        <StatCard label="Delivered" value={my.filter(r=>r.status==='delivered').length} icon="🏠" color="var(--g5)" delay={.21}/>
      </div>
      {my.length===0
        ? <Empty icon="🏠" title="No requests yet" desc="Go to 'Available Food' to browse current donations and submit a request."/>
        : <RecentRequests requests={my.slice(0,5)} showDonor/>}
    </div>
  );
}

function AdminDashboard() {
  const { state } = useStore();
  const { totalKg, delivered, inTransit, available, pending } = useStats(state);
  const hasData = state.donations.length > 0 || state.users.length > 0;
  return (
    <div style={{ padding:'28px 32px', maxWidth:1300 }}>
      <WelcomeBanner name={state.user?.name} role="Admin" msg="Full platform overview — all donations, requests and users."/>
      {!hasData && (
        <div style={{ background:'var(--g9)', border:'1px solid var(--g7)', borderRadius:18, padding:'24px 28px', marginBottom:28, display:'flex', gap:16, alignItems:'flex-start' }}>
          <span style={{ fontSize:28 }}>👋</span>
          <div>
            <div style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--g1)', marginBottom:6 }}>Getting started</div>
            <p style={{ fontSize:14, color:'var(--txt3)', lineHeight:1.7 }}>The platform is empty. Invite <strong>Food Donors</strong> to register and list their surplus food. Once donations are listed, Recipients can request them and you'll see all activity here.</p>
          </div>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:28 }} className="grid-4">
        <StatCard label="Total Donations" value={state.donations.length} icon="📦" delay={0}/>
        <StatCard label="Kg Delivered" value={`${totalKg.toFixed(0)} kg`} icon="✅" color="var(--g4)" delay={.07}/>
        <StatCard label="Pending Requests" value={pending} icon="⏳" color="var(--amber)" delay={.14}/>
        <StatCard label="Registered Users" value={state.users.length} icon="👥" color="var(--blue)" delay={.21}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22, marginBottom:22 }}>
        <RecentDonations donations={state.donations.slice(0,5)} showDonor/>
        <RecentRequests requests={state.requests.slice(0,5)} showDonor/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ANALYTICS VIEW (with date range filter)
══════════════════════════════════════════════ */
function AnalyticsView() {
  const { state } = useStore();
  const [range, setRange] = useState('all');

  const now = new Date();
  const cutoff = range==='7d' ? new Date(now-7*864e5) : range==='30d' ? new Date(now-30*864e5) : range==='90d' ? new Date(now-90*864e5) : null;
  const dons = cutoff ? state.donations.filter(d => new Date(d.createdAt)>=cutoff) : state.donations;

  const cats = {};
  dons.forEach(d => { cats[d.category]=(cats[d.category]||0)+parseFloat(d.qty||0); });
  const catData = Object.entries(cats).map(([name,value],i) => ({ name, value:Math.round(value), color:['var(--g3)','var(--amber)','var(--blue)','var(--red)','#7C3AED','var(--g5)'][i%6] }));

  const statusData = [
    { name:'Available', value:dons.filter(d=>d.status==='available').length, color:'var(--g5)' },
    { name:'Requested', value:dons.filter(d=>d.status==='requested').length, color:'var(--blue)' },
    { name:'In Transit', value:dons.filter(d=>d.status==='in_transit').length, color:'var(--amber)' },
    { name:'Delivered', value:dons.filter(d=>d.status==='delivered').length, color:'var(--g3)' },
    { name:'Cancelled', value:dons.filter(d=>d.status==='cancelled').length, color:'#9CA3AF' },
  ].filter(s=>s.value>0);

  const timeline = {};
  dons.forEach(d => {
    const date = d.createdAt?.split('T')[0]; if(!date) return;
    if(!timeline[date]) timeline[date]={ date, listed:0, delivered:0 };
    timeline[date].listed++;
    if(d.status==='delivered') timeline[date].delivered++;
  });
  const timeData = Object.values(timeline).sort((a,b)=>a.date>b.date?1:-1);
  const totalKg = dons.filter(d=>d.status==='delivered').reduce((s,d)=>s+parseFloat(d.qty||0),0);

  if (dons.length===0) return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:14 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)' }}>Analytics</h2>
        <RangeToggle range={range} onChange={setRange}/>
      </div>
      <Empty icon="📊" title="No data yet" desc="Analytics populate as donors list food and recipients make requests."/>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:14 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Analytics</h2>
          <p style={{ fontSize:13, color:'var(--txt3)' }}>Live charts based on real platform activity</p>
        </div>
        <RangeToggle range={range} onChange={setRange}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:28 }} className="grid-4">
        <StatCard label="Total Donations" value={dons.length} icon="📦" delay={0}/>
        <StatCard label="Delivered (kg)" value={`${totalKg.toFixed(1)} kg`} icon="✅" color="var(--g4)" delay={.07}/>
        <StatCard label="Total Requests" value={cutoff ? state.requests.filter(r=>new Date(r.createdAt)>=cutoff).length : state.requests.length} icon="📋" color="var(--blue)" delay={.14}/>
        <StatCard label="Delivery Rate" value={dons.length>0?`${Math.round((dons.filter(d=>d.status==='delivered').length/dons.length)*100)}%`:'0%'} icon="🎯" color="var(--amber)" delay={.21}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22, marginBottom:22 }}>
        <Card style={{ padding:26 }}>
          <h3 style={{ fontFamily:'var(--font-d)', fontSize:18, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Donation Timeline</h3>
          <p style={{ fontSize:13, color:'var(--txt3)', marginBottom:22 }}>Listings vs. deliveries over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeData}>
              <defs>
                <linearGradient id="aL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--g3)" stopOpacity={.15}/><stop offset="95%" stopColor="var(--g3)" stopOpacity={0}/></linearGradient>
                <linearGradient id="aD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--amber)" stopOpacity={.15}/><stop offset="95%" stopColor="var(--amber)" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--txt3)' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'var(--txt3)' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tip}/>
              <Legend/>
              <Area type="monotone" dataKey="listed" stroke="var(--g3)" strokeWidth={2.5} fill="url(#aL)" name="Listed"/>
              <Area type="monotone" dataKey="delivered" stroke="var(--amber)" strokeWidth={2} fill="url(#aD)" name="Delivered"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:26 }}>
          <h3 style={{ fontFamily:'var(--font-d)', fontSize:18, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>By Category (kg)</h3>
          <p style={{ fontSize:13, color:'var(--txt3)', marginBottom:12 }}>Quantity donated per food category</p>
          {catData.length>0 ? (
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <ResponsiveContainer width={170} height={170}>
                <PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>{catData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{ ...tip, fontSize:12 }}/></PieChart>
              </ResponsiveContainer>
              <div style={{ flex:1 }}>{catData.map(c=>(
                <div key={c.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:9, height:9, borderRadius:3, background:c.color }}/><span style={{ fontSize:12, color:'var(--txt2)' }}>{c.name}</span></div>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--txt1)' }}>{c.value} kg</span>
                </div>
              ))}</div>
            </div>
          ) : <div style={{ padding:'20px', textAlign:'center', color:'var(--txt3)', fontSize:13 }}>No category data yet</div>}
        </Card>
      </div>
      <Card style={{ padding:26 }}>
        <h3 style={{ fontFamily:'var(--font-d)', fontSize:18, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Donation Status Breakdown</h3>
        <p style={{ fontSize:13, color:'var(--txt3)', marginBottom:24 }}>Count of donations in each status</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData} barSize={40}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/><XAxis dataKey="name" tick={{ fontSize:12, fill:'var(--txt3)' }} axisLine={false} tickLine={false}/><YAxis tick={{ fontSize:12, fill:'var(--txt3)' }} axisLine={false} tickLine={false}/><Tooltip contentStyle={tip}/><Bar dataKey="value" name="Donations" radius={[7,7,0,0]}>{statusData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar></BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function RangeToggle({ range, onChange }) {
  return (
    <div style={{ display:'flex', gap:6, background:'var(--g9)', padding:4, borderRadius:12, border:'1px solid var(--border)' }}>
      {[['7d','7 days'],['30d','30 days'],['90d','90 days'],['all','All time']].map(([v,l]) => (
        <button key={v} onClick={()=>onChange(v)} style={{ padding:'6px 14px', borderRadius:9, border:'none', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', fontWeight:range===v?700:400, background:range===v?'var(--surface)':'transparent', color:range===v?'var(--g3)':'var(--txt3)', boxShadow:range===v?'var(--shadow)':'none', transition:'all .18s' }}>{l}</button>
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  return <div style={{ padding:'28px 32px', maxWidth:1200 }}><AnalyticsView/></div>;
}

/* ══════════════════════════════════════════════
   REPORTS
══════════════════════════════════════════════ */
export function ReportsPage() {
  const { state, dispatch, toast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', type:'Waste Reduction', period:'Monthly', summary:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const myReports = state.reports.filter(r => r.analystId===state.user?.id);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title='Report title required';
    if (!form.summary.trim()) errs.summary='Summary required';
    if (Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    dispatch({ type:'ADD_REPORT', payload:form });
    toast('Report created successfully','success');
    setLoading(false); setShowModal(false);
    setForm({ title:'', type:'Waste Reduction', period:'Monthly', summary:'' }); setErrors({});
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1000 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Reports</h2>
          <p style={{ fontSize:14, color:'var(--txt3)' }}>Create and manage your waste analysis reports</p>
        </div>
        <Btn onClick={()=>setShowModal(true)}><Plus size={15}/> New Report</Btn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }} className="grid-3">
        <StatCard label="Platform Donations" value={state.donations.length} icon="📦" delay={0}/>
        <StatCard label="Delivered" value={state.donations.filter(d=>d.status==='delivered').length} icon="✅" color="var(--g4)" delay={.07}/>
        <StatCard label="Active Donors" value={new Set(state.donations.map(d=>d.donorId)).size} icon="🌾" color="var(--amber)" delay={.14}/>
      </div>
      {myReports.length===0
        ? <Empty icon="📄" title="No reports yet" desc="Create your first waste analysis report." action={<Btn onClick={()=>setShowModal(true)}>Create First Report</Btn>}/>
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {myReports.map((r,i) => (
              <Card key={r.id} style={{ padding:24, animation:`fadeUp .4s ease ${i*.04}s both` }}>
                <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ width:46, height:46, borderRadius:13, background:'var(--g9)', border:'1px solid var(--g7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--txt3)' }}>{r.id}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--g3)', background:'var(--g9)', padding:'3px 9px', borderRadius:20 }}>{r.type}</span>
                      <span style={{ fontSize:11, color:'var(--txt3)' }}>{r.period}</span>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-d)', fontSize:18, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>{r.title}</h3>
                    <p style={{ fontSize:14, color:'var(--txt3)', lineHeight:1.65 }}>{r.summary}</p>
                    <div style={{ fontSize:12, color:'var(--txt3)', marginTop:10 }}>Created {fmtDate(r.createdAt)} at {fmtTime(r.createdAt)}</div>
                  </div>
                  <Btn variant="ghost" size="sm"><Download size={14}/> Export</Btn>
                </div>
              </Card>
            ))}
          </div>
        )
      }
      {showModal && (
        <Modal title="Create New Report" onClose={()=>setShowModal(false)} width={560}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <Field label="REPORT TITLE *" error={errors.title}>
              <Input value={form.title} onChange={e=>{setForm(f=>({...f,title:e.target.value}));setErrors(p=>({...p,title:''}));}} placeholder="e.g., Q1 2025 Food Waste Reduction Analysis" error={errors.title}/>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <Field label="REPORT TYPE"><Select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{['Waste Reduction','Donation Trends','Delivery Efficiency','Donor Analysis','Recipient Impact','Regional Report'].map(t=><option key={t}>{t}</option>)}</Select></Field>
              <Field label="PERIOD"><Select value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))}>{['Weekly','Monthly','Quarterly','Annual'].map(p=><option key={p}>{p}</option>)}</Select></Field>
            </div>
            <div style={{ background:'var(--g9)', borderRadius:12, padding:'14px 18px', border:'1px solid var(--g7)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--txt3)', letterSpacing:'.06em', marginBottom:10 }}>CURRENT PLATFORM DATA</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {[{ l:'Donations', v:state.donations.length },{ l:'Delivered', v:state.donations.filter(d=>d.status==='delivered').length },{ l:'Requests', v:state.requests.length }].map(s=>(
                  <div key={s.l} style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--g3)' }}>{s.v}</div><div style={{ fontSize:11, color:'var(--txt3)' }}>{s.l}</div></div>
                ))}
              </div>
            </div>
            <Field label="ANALYSIS SUMMARY *" error={errors.summary}>
              <textarea value={form.summary} onChange={e=>{setForm(f=>({...f,summary:e.target.value}));setErrors(p=>({...p,summary:''}));}} placeholder="Write your analysis findings, trends observed, and recommendations..." rows={5} style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r)', border:`2px solid ${errors.summary?'var(--red)':'var(--border)'}`, fontSize:14, outline:'none', resize:'vertical', fontFamily:'var(--font-b)', lineHeight:1.6, color:'var(--txt1)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>{ if(!errors.summary) e.target.style.borderColor='var(--border)'; }}/>
              {errors.summary && <div style={{ fontSize:12, color:'var(--red)', marginTop:4 }}>⚠ {errors.summary}</div>}
            </Field>
            <div style={{ display:'flex', gap:12 }}>
              <Btn variant="ghost" onClick={()=>setShowModal(false)} style={{ flex:1 }}>Cancel</Btn>
              <Btn loading={loading} style={{ flex:2 }}><FileText size={15}/> Create Report</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
