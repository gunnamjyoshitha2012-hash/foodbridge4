import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Card, Empty, Btn, Badge, Modal, Field, Input } from '../components/UI';
import { Pagination } from './DonorPages';

function fmtDate(iso) { if(!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

export function AvailableFood() {
  const { state, dispatch, toast } = useStore();
  const available = state.donations.filter(d => d.status==='available');
  const [reqModal, setReqModal] = useState(null);
  const [form, setForm] = useState({ needBy:'', notes:'' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const categories = ['all', ...new Set(available.map(d=>d.category))];
  const filtered = available.filter(d => {
    const ms = !search || d.food.toLowerCase().includes(search.toLowerCase()) || (d.donorOrg||d.donorName||'').toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter==='all' || d.category===catFilter;
    return ms && mc;
  });
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const submit = async () => {
    const errs = {}; if(!form.needBy) errs.needBy='Please specify when you need it';
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true); await new Promise(r=>setTimeout(r,700));
    dispatch({ type:'ADD_REQUEST', payload:{ donationId:reqModal.id, needBy:form.needBy, notes:form.notes } });
    toast(`Request submitted for ${reqModal.food}`, 'success');
    setLoading(false); setReqModal(null); setForm({ needBy:'', notes:'' }); setErrors({});
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1200 }}>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Available Food</h2>
        <p style={{ fontSize:14, color:'var(--txt3)' }}>{available.length} donation{available.length!==1?'s':''} currently available</p>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by food, donor, or location..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {categories.map(c=>(
            <button key={c} onClick={()=>{setCatFilter(c);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:catFilter===c?'var(--g3)':'var(--surface)', color:catFilter===c?'#fff':'var(--txt3)', transition:'all .18s' }}>{c}</button>
          ))}
        </div>
      </div>
      {available.length===0
        ? <Empty icon="🌾" title="No donations available right now" desc="Check back soon — the platform notifies you when new donations appear."/>
        : filtered.length===0
          ? <Empty icon="🔍" title="No results" desc="Try adjusting your search or category filter."/>
          : <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
                {paginated.map((d,i) => (
                  <Card key={d.id} style={{ padding:22, animation:`fadeUp .45s ease ${i*.04}s both`, transition:'transform .2s,box-shadow .2s' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-lg)';}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--shadow)';}}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:'var(--g9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🌾</div>
                      <Badge status="available"/>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>{d.food}</h3>
                    <p style={{ fontSize:12, color:'var(--txt3)', marginBottom:14 }}>by <strong style={{ color:'var(--txt2)' }}>{d.donorOrg||d.donorName}</strong></p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                      {[{ l:'Quantity', v:`${d.qty} ${d.unit}` },{ l:'Category', v:d.category },{ l:'Expiry', v:fmtDate(d.expiry) },{ l:'Location', v:d.location }].map(item=>(
                        <div key={item.l}><div style={{ fontSize:10, color:'var(--txt3)', fontWeight:700, letterSpacing:'.05em', marginBottom:2 }}>{item.l.toUpperCase()}</div><div style={{ fontSize:12, color:'var(--txt1)', fontWeight:500 }}>{item.v}</div></div>
                      ))}
                    </div>
                    {d.notes && <p style={{ fontSize:12, color:'var(--txt3)', lineHeight:1.5, marginBottom:14, fontStyle:'italic' }}>{d.notes}</p>}
                    <Btn onClick={()=>setReqModal(d)} style={{ width:'100%' }}>Request This Food</Btn>
                  </Card>
                ))}
              </div>
              {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
            </>
      }
      {reqModal && (
        <Modal title={`Request: ${reqModal.food}`} onClose={()=>{ setReqModal(null); setForm({ needBy:'', notes:'' }); setErrors({}); }}>
          <div style={{ background:'var(--g9)', borderRadius:12, padding:'14px 16px', marginBottom:22, border:'1px solid var(--g7)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--g2)' }}>🌾 {reqModal.food} — {reqModal.qty} {reqModal.unit}</div>
            <div style={{ fontSize:12, color:'var(--txt3)', marginTop:4 }}>From: {reqModal.donorOrg||reqModal.donorName} · {reqModal.location}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18, marginBottom:28 }}>
            <Field label="WHEN DO YOU NEED IT BY? *" error={errors.needBy}>
              <Input type="date" value={form.needBy} onChange={e=>{setForm(f=>({...f,needBy:e.target.value}));setErrors(p=>({...p,needBy:''}));}} error={errors.needBy}/>
            </Field>
            <Field label="ADDITIONAL NOTES (OPTIONAL)">
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Special requirements, logistics notes..." rows={3} style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r)', border:'2px solid var(--border)', fontSize:14, outline:'none', resize:'vertical', fontFamily:'var(--font-b)', lineHeight:1.5 }}/>
            </Field>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <Btn variant="ghost" onClick={()=>setReqModal(null)} style={{ flex:1 }}>Cancel</Btn>
            <Btn loading={loading} onClick={submit} style={{ flex:2 }}>Submit Request</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function MyRequests() {
  const { state, dispatch, toast } = useStore();
  const myReqs = state.requests.filter(r => r.recipientId===state.user?.id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = myReqs.filter(r => {
    const ms = !search || r.food.toLowerCase().includes(search.toLowerCase()) || (r.donorOrg||r.donorName||'').toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==='all' || r.status===statusFilter;
    return ms && mf;
  });
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  if (myReqs.length===0) return (
    <div style={{ padding:'28px 32px' }}>
      <Empty icon="📋" title="No requests yet" desc="Browse 'Available Food' to find donations for your community."
        action={<Btn onClick={()=>dispatch({ type:'SET_PAGE', page:'available' })}>Browse Available Food</Btn>}/>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }}>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>My Requests</h2>
        <p style={{ fontSize:14, color:'var(--txt3)' }}>{myReqs.length} request{myReqs.length!==1?'s':''} total</p>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by food or donor..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','pending','approved','rejected','delivered'].map(f=>(
            <button key={f} onClick={()=>{setStatusFilter(f);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:statusFilter===f?'var(--g3)':'var(--surface)', color:statusFilter===f?'#fff':'var(--txt3)', transition:'all .18s' }}>{f}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <Empty icon="🔍" title="No results" desc="Try adjusting your search or filter."/>
        : <>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {paginated.map((r,i) => (
                <Card key={r.id} style={{ padding:22, animation:`fadeUp .4s ease ${i*.04}s both` }}>
                  <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:'var(--blue-l)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📋</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:6, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'var(--txt3)' }}>{r.id}</span><Badge status={r.status}/>
                      </div>
                      <h3 style={{ fontFamily:'var(--font-d)', fontSize:18, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>{r.food}</h3>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:8 }}>
                        {[{ l:'Qty', v:`${r.qty} ${r.unit}` },{ l:'From', v:r.donorOrg||r.donorName },{ l:'Need By', v:fmtDate(r.needBy) },{ l:'Requested', v:fmtDate(r.createdAt) },{ l:'Responded', v:r.respondedAt?fmtDate(r.respondedAt):'Awaiting...' }].map(item=>(
                          <div key={item.l}><div style={{ fontSize:10, color:'var(--txt3)', fontWeight:700, letterSpacing:'.05em', marginBottom:2 }}>{item.l.toUpperCase()}</div><div style={{ fontSize:12, color:'var(--txt1)', fontWeight:500 }}>{item.v}</div></div>
                        ))}
                      </div>
                      {r.notes && <p style={{ fontSize:13, color:'var(--txt3)', marginTop:10, fontStyle:'italic' }}>Your note: {r.notes}</p>}
                    </div>
                    <div>
                      {r.status==='approved' && <Btn onClick={()=>{ dispatch({ type:'MARK_DELIVERED', id:r.id }); toast('Delivery confirmed! Thank you.','success'); }} size="sm">✓ Confirm Delivery</Btn>}
                      {r.status==='pending' && <span style={{ fontSize:12, color:'var(--amber)', fontWeight:600 }}>⏳ Awaiting approval</span>}
                      {r.status==='delivered' && <span style={{ fontSize:12, color:'var(--g4)', fontWeight:600 }}>✅ Completed</span>}
                      {r.status==='rejected' && <span style={{ fontSize:12, color:'var(--red)', fontWeight:600 }}>✗ Rejected</span>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
          </>
      }
    </div>
  );
}
