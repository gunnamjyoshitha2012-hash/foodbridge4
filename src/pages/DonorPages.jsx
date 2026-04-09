import React, { useState } from 'react';
import { useStore } from '../context/store';
import { StatCard, Card, Empty, Btn, Badge, Modal, Field, Input, Select } from '../components/UI';
import { Plus } from 'lucide-react';

function fmtDate(iso) { if(!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

const CATS = ['Produce','Bakery','Dairy','Prepared Meals','Beverages','Dry Goods','Other'];
const UNITS = ['kg','liters','servings','boxes','packs'];

export function DonatePage() {
  const { state, dispatch, toast } = useStore();
  const [form, setForm] = useState({ food:'', category:'Produce', qty:'', unit:'kg', expiry:'', location:'', notes:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const upd = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(p=>({...p,[k]:''})); };

  const validate = () => {
    const e = {};
    if (!form.food.trim()) e.food='Food item name required';
    if (!form.qty||isNaN(form.qty)||parseFloat(form.qty)<=0) e.qty='Valid quantity required';
    if (!form.expiry) e.expiry='Expiry date required';
    else { const exp=new Date(form.expiry),today=new Date(); today.setHours(0,0,0,0); if(exp<today) e.expiry='Expiry cannot be in the past'; }
    if (!form.location.trim()) e.location='Pickup location required';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(); if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    dispatch({ type:'ADD_DONATION', payload:form });
    toast(`Donation listed: ${form.food} (${form.qty} ${form.unit})`, 'success');
    setDone(true); setLoading(false);
  };

  if (done) return (
    <div style={{ padding:'60px 32px', maxWidth:600, margin:'0 auto', textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:24, animation:'float 3s ease-in-out infinite' }}>🎉</div>
      <h2 style={{ fontFamily:'var(--font-d)', fontSize:36, fontWeight:700, color:'var(--g1)', marginBottom:14 }}>Donation Listed!</h2>
      <p style={{ fontSize:16, color:'var(--txt3)', marginBottom:36, lineHeight:1.7 }}>Your <strong>{form.food}</strong> ({form.qty} {form.unit}) is now visible to recipient organizations.</p>
      <div style={{ display:'flex', gap:14, justifyContent:'center' }}>
        <Btn onClick={() => { setDone(false); setForm({ food:'', category:'Produce', qty:'', unit:'kg', expiry:'', location:'', notes:'' }); }}>List Another</Btn>
        <Btn variant="ghost" onClick={() => dispatch({ type:'SET_PAGE', page:'my-donations' })}>View My Donations</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', maxWidth:700 }}>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:30, fontWeight:700, color:'var(--txt1)', marginBottom:8 }}>List a Donation</h2>
        <p style={{ fontSize:15, color:'var(--txt3)' }}>Fill in the details of the surplus food you'd like to donate.</p>
      </div>
      <Card style={{ padding:32 }}>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:22 }}>
          <Field label="FOOD ITEM NAME *" error={errors.food}>
            <Input value={form.food} onChange={e=>upd('food',e.target.value)} placeholder="e.g., Organic Tomatoes, Cooked Biryani" error={errors.food}/>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="CATEGORY *">
              <Select value={form.category} onChange={e=>upd('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</Select>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10 }}>
              <Field label="QUANTITY *" error={errors.qty}>
                <Input type="number" min="0.1" step="0.1" value={form.qty} onChange={e=>upd('qty',e.target.value)} placeholder="50" error={errors.qty}/>
              </Field>
              <Field label="UNIT">
                <Select value={form.unit} onChange={e=>upd('unit',e.target.value)}>{UNITS.map(u=><option key={u}>{u}</option>)}</Select>
              </Field>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="EXPIRY DATE *" error={errors.expiry}>
              <Input type="date" value={form.expiry} onChange={e=>upd('expiry',e.target.value)} error={errors.expiry}/>
            </Field>
            <Field label="PICKUP LOCATION *" error={errors.location}>
              <Input value={form.location} onChange={e=>upd('location',e.target.value)} placeholder="e.g., Banjara Hills, Hyderabad" error={errors.location}/>
            </Field>
          </div>
          <Field label="ADDITIONAL NOTES (OPTIONAL)">
            <textarea value={form.notes} onChange={e=>upd('notes',e.target.value)} placeholder="Storage instructions, allergen info..." rows={3} style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r)', border:'2px solid var(--border)', background:'var(--surface)', fontSize:14, color:'var(--txt1)', outline:'none', resize:'vertical', fontFamily:'var(--font-b)', lineHeight:1.5 }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
          </Field>
          <div style={{ background:'var(--g9)', borderRadius:13, padding:'14px 18px', border:'1px solid var(--g7)', display:'flex', gap:12, alignItems:'flex-start' }}>
            <span style={{ fontSize:18, flexShrink:0 }}>ℹ️</span>
            <p style={{ fontSize:13, color:'var(--txt2)', lineHeight:1.6 }}>Once listed, recipient organizations can see and request your donation. You'll be notified and can manage it from "My Donations".</p>
          </div>
          <Btn loading={loading} size="lg"><Plus size={17}/> List This Donation</Btn>
        </form>
      </Card>
    </div>
  );
}

export function MyDonations() {
  const { state, dispatch, toast } = useStore();
  const myDonations = state.donations.filter(d => d.donorId===state.user?.id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const filtered = myDonations.filter(d => {
    const matchSearch = !search || d.food.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter==='all' || d.status===statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const cancel = (id) => { dispatch({ type:'CANCEL_DONATION', id }); toast('Donation cancelled','info'); setConfirmCancel(null); };

  if (myDonations.length===0) return (
    <div style={{ padding:'28px 32px' }}>
      <Empty icon="📦" title="No donations listed yet" desc="Start by clicking 'List Donation' in the sidebar."
        action={<Btn onClick={() => dispatch({ type:'SET_PAGE', page:'donate' })}>List Your First Donation</Btn>}/>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, flexWrap:'wrap', gap:14 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>My Donations</h2>
          <p style={{ fontSize:14, color:'var(--txt3)' }}>{myDonations.length} listing{myDonations.length!==1?'s':''} total</p>
        </div>
        <Btn onClick={() => dispatch({ type:'SET_PAGE', page:'donate' })} size="sm"><Plus size={15}/> New Listing</Btn>
      </div>
      {/* Search + Filter */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by food or location..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','available','requested','in_transit','delivered','cancelled'].map(f=>(
            <button key={f} onClick={()=>{setStatusFilter(f);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:statusFilter===f?'var(--g3)':'var(--surface)', color:statusFilter===f?'#fff':'var(--txt3)', fontWeight:statusFilter===f?700:400, transition:'all .18s' }}>{f.replace('_',' ')}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <Empty icon="🔍" title="No results" desc="Try adjusting your search or filter."/>
        : <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
              {paginated.map((d,i) => <DonationCard key={d.id} d={d} i={i} onCancel={()=>setConfirmCancel(d)}/>)}
            </div>
            {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
          </>
      }
      {confirmCancel && (
        <ConfirmModal title="Cancel this listing?" desc={`Are you sure you want to cancel "${confirmCancel.food}"? This cannot be undone.`} danger onConfirm={()=>cancel(confirmCancel.id)} onClose={()=>setConfirmCancel(null)}/>
      )}
    </div>
  );
}

export function DonationCard({ d, i, onCancel, onApprove, onReject, onDeliver, adminView }) {
  const { state } = useStore();
  const [expanded, setExpanded] = useState(false);
  const isExpired = d.expiry && new Date(d.expiry)<new Date();
  const req = state.requests.find(r => r.donationId===d.id && ['pending','approved'].includes(r.status));
  return (
    <Card style={{ padding:22, animation:`fadeUp .45s ease ${i*.04}s both`, cursor:'default', transition:'transform .2s, box-shadow .2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)'; }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:'var(--g9)', border:'1px solid var(--g7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🌾</div>
        <div style={{ display:'flex', gap:6, flexDirection:'column', alignItems:'flex-end' }}>
          <Badge status={d.status}/>
          {isExpired && <span style={{ fontSize:10, fontWeight:700, color:'var(--red)', background:'var(--red-l)', padding:'3px 8px', borderRadius:20 }}>EXPIRED</span>}
        </div>
      </div>
      <h3 style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>{d.food}</h3>
      {adminView && <p style={{ fontSize:12, color:'var(--txt3)', marginBottom:8 }}>by {d.donorOrg||d.donorName}</p>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
        {[{ l:'Quantity', v:`${d.qty} ${d.unit}` },{ l:'Category', v:d.category },{ l:'Expiry', v:fmtDate(d.expiry) },{ l:'Location', v:d.location }].map(item=>(
          <div key={item.l}><div style={{ fontSize:10, color:'var(--txt3)', fontWeight:700, letterSpacing:'.05em', marginBottom:2 }}>{item.l.toUpperCase()}</div><div style={{ fontSize:12, color:'var(--txt1)', fontWeight:500 }}>{item.v}</div></div>
        ))}
      </div>
      {req && <div style={{ background:'var(--blue-l)', borderRadius:10, padding:'10px 12px', marginBottom:14, fontSize:12, color:'#1e40af' }}>📋 Request from <strong>{req.recipientOrg||req.recipientName}</strong> · Needed by {fmtDate(req.needBy)}{req.notes && <div style={{ marginTop:4, color:'#2563EB' }}>Note: {req.notes}</div>}</div>}
      {d.notes && expanded && <div style={{ background:'var(--g9)', borderRadius:10, padding:'10px 12px', marginBottom:14, fontSize:13, color:'var(--txt2)', lineHeight:1.5 }}>{d.notes}</div>}
      {d.notes && <button onClick={()=>setExpanded(!expanded)} style={{ fontSize:12, color:'var(--g4)', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:14, fontFamily:'var(--font-b)' }}>{expanded?'Hide notes ↑':'Show notes ↓'}</button>}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {onApprove && req && req.status==='pending' && (<><Btn onClick={onApprove} size="sm" style={{ flex:1 }}>✓ Approve</Btn><Btn onClick={onReject} size="sm" variant="danger" style={{ flex:1 }}>✗ Reject</Btn></>)}
        {onDeliver && req && req.status==='approved' && <Btn onClick={onDeliver} size="sm" style={{ flex:1 }}>Mark Delivered</Btn>}
        {onCancel && d.status==='available' && <Btn onClick={onCancel} size="sm" variant="outline" style={{ flex:1 }}>Cancel Listing</Btn>}
      </div>
    </Card>
  );
}

export function Pagination({ page, total, onChange }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:28 }}>
      <button onClick={()=>onChange(page-1)} disabled={page===1} style={{ padding:'8px 14px', borderRadius:'var(--r)', border:'1px solid var(--border)', background:'var(--surface)', cursor:page===1?'not-allowed':'pointer', fontSize:13, color:'var(--txt3)', opacity:page===1?.4:1 }}>← Prev</button>
      {Array.from({length:total},(_,i)=>i+1).map(p=>(
        <button key={p} onClick={()=>onChange(p)} style={{ width:36, height:36, borderRadius:'var(--r)', border:'none', background:p===page?'var(--g3)':'transparent', color:p===page?'#fff':'var(--txt3)', cursor:'pointer', fontSize:13, fontWeight:p===page?700:400 }}>{p}</button>
      ))}
      <button onClick={()=>onChange(page+1)} disabled={page===total} style={{ padding:'8px 14px', borderRadius:'var(--r)', border:'1px solid var(--border)', background:'var(--surface)', cursor:page===total?'not-allowed':'pointer', fontSize:13, color:'var(--txt3)', opacity:page===total?.4:1 }}>Next →</button>
    </div>
  );
}

export function ConfirmModal({ title, desc, onConfirm, onClose, danger }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fadeIn .2s ease' }} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ background:'var(--surface)', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'var(--shadow-xl)', animation:'scaleIn .25s ease' }}>
        <h3 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--txt1)', marginBottom:10 }}>{title}</h3>
        <p style={{ fontSize:14, color:'var(--txt3)', lineHeight:1.7, marginBottom:28 }}>{desc}</p>
        <div style={{ display:'flex', gap:10 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
          <Btn onClick={onConfirm} variant={danger?'danger':'primary'} style={{ flex:1 }}>{danger?'Yes, Cancel':'Confirm'}</Btn>
        </div>
      </div>
    </div>
  );
}
