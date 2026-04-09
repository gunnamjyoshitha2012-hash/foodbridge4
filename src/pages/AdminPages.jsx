import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Card, Empty, Btn, Badge, StatCard } from '../components/UI';
import { DonationCard, Pagination, ConfirmModal } from './DonorPages';

function fmtDate(iso) { if(!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
const ROLE_COLOR2 = { 'Food Donor':'var(--g4)', 'Recipient Organization':'#2563EB', 'Data Analyst':'#7C3AED', 'Admin':'var(--amber)' };

export function AllDonations() {
  const { state, dispatch, toast } = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmReject, setConfirmReject] = useState(null);
  const PER_PAGE = 9;

  const findReq = (donId) => state.requests.find(r => r.donationId===donId && ['pending','approved'].includes(r.status));
  const approve = (reqId) => { dispatch({ type:'APPROVE_REQUEST', id:reqId }); toast('Request approved — food in transit','success'); };
  const reject = (reqId) => { dispatch({ type:'REJECT_REQUEST', id:reqId }); toast('Request rejected','warning'); setConfirmReject(null); };
  const deliver = (reqId) => { dispatch({ type:'MARK_DELIVERED', id:reqId }); toast('Marked as delivered','success'); };

  const base = filter==='all' ? state.donations : state.donations.filter(d=>d.status===filter);
  const filtered = base.filter(d => !search || d.food.toLowerCase().includes(search.toLowerCase()) || (d.donorOrg||d.donorName||'').toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, flexWrap:'wrap', gap:14 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>All Donations</h2>
          <p style={{ fontSize:14, color:'var(--txt3)' }}>{state.donations.length} total across platform</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by food or donor..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','available','requested','in_transit','delivered','cancelled'].map(f=>(
            <button key={f} onClick={()=>{setFilter(f);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:filter===f?'var(--g3)':'var(--surface)', color:filter===f?'#fff':'var(--txt3)', transition:'all .18s' }}>{f.replace('_',' ')}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <Empty icon="📦" title="No donations here" desc="Donations appear here once food donors list surplus food."/>
        : <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
              {paginated.map((d,i) => { const req=findReq(d.id); return (
                <DonationCard key={d.id} d={d} i={i} adminView
                  onApprove={req ? ()=>approve(req.id) : null}
                  onReject={req ? ()=>setConfirmReject(req.id) : null}
                  onDeliver={req&&req.status==='approved' ? ()=>deliver(req.id) : null}/>
              );})}
            </div>
            {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
          </>
      }
      {confirmReject && <ConfirmModal title="Reject this request?" desc="This will mark the request as rejected and make the donation available again." danger onConfirm={()=>reject(confirmReject)} onClose={()=>setConfirmReject(null)}/>}
    </div>
  );
}

export function AllRequests() {
  const { state, dispatch, toast } = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmReject, setConfirmReject] = useState(null);
  const PER_PAGE = 10;

  const base = filter==='all' ? state.requests : state.requests.filter(r=>r.status===filter);
  const filtered = base.filter(r => !search || r.food.toLowerCase().includes(search.toLowerCase()) || (r.recipientOrg||r.recipientName||'').toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, flexWrap:'wrap', gap:14 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>All Requests</h2>
          <p style={{ fontSize:14, color:'var(--txt3)' }}>{state.requests.filter(r=>r.status==='pending').length} pending approval</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by food or recipient..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','pending','approved','rejected','delivered'].map(f=>(
            <button key={f} onClick={()=>{setFilter(f);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:filter===f?'var(--g3)':'var(--surface)', color:filter===f?'#fff':'var(--txt3)', transition:'all .18s', position:'relative' }}>
              {f}
              {f==='pending' && state.requests.filter(r=>r.status==='pending').length>0 && <span style={{ position:'absolute', top:-5, right:-5, width:16, height:16, borderRadius:'50%', background:'var(--red)', color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{state.requests.filter(r=>r.status==='pending').length}</span>}
            </button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <Empty icon="📋" title="No requests" desc={filter==='pending'?'No pending requests right now.':'No requests in this status.'}/>
        : <>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {paginated.map((r,i) => (
                <Card key={r.id} style={{ padding:22, animation:`fadeUp .4s ease ${i*.04}s both`, borderLeft:r.status==='pending'?'4px solid var(--amber)':r.status==='approved'?'4px solid var(--g4)':'4px solid var(--border)' }}>
                  <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'var(--blue-l)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>📋</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:10, marginBottom:8, flexWrap:'wrap', alignItems:'center' }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'var(--txt3)' }}>{r.id}</span><Badge status={r.status}/>
                      </div>
                      <h3 style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'var(--txt1)', marginBottom:6 }}>{r.food}</h3>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                        {[{ l:'From Donor', v:r.donorOrg||r.donorName },{ l:'Requested By', v:r.recipientOrg||r.recipientName },{ l:'Quantity', v:`${r.qty} ${r.unit}` },{ l:'Need By', v:fmtDate(r.needBy) }].map(item=>(
                          <div key={item.l}><div style={{ fontSize:10, color:'var(--txt3)', fontWeight:700, letterSpacing:'.05em', marginBottom:2 }}>{item.l.toUpperCase()}</div><div style={{ fontSize:12, color:'var(--txt1)', fontWeight:500 }}>{item.v}</div></div>
                        ))}
                      </div>
                      {r.notes && <p style={{ fontSize:13, color:'var(--txt3)', marginTop:10, fontStyle:'italic' }}>"{r.notes}"</p>}
                    </div>
                    <div style={{ display:'flex', gap:8, flexDirection:'column', flexShrink:0 }}>
                      {r.status==='pending' && (<><Btn onClick={()=>{ dispatch({ type:'APPROVE_REQUEST', id:r.id }); toast('Request approved!','success'); }} size="sm">✓ Approve</Btn><Btn onClick={()=>setConfirmReject(r.id)} size="sm" variant="danger">✗ Reject</Btn></>)}
                      {r.status==='approved' && <Btn onClick={()=>{ dispatch({ type:'MARK_DELIVERED', id:r.id }); toast('Marked as delivered','success'); }} size="sm">Mark Delivered</Btn>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
          </>
      }
      {confirmReject && <ConfirmModal title="Reject this request?" desc="The donation will return to available status." danger onConfirm={()=>{ dispatch({ type:'REJECT_REQUEST', id:confirmReject }); toast('Request rejected','warning'); setConfirmReject(null); }} onClose={()=>setConfirmReject(null)}/>}
    </div>
  );
}

export function UsersPage() {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = state.users.filter(u => {
    const ms = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.org||'').toLowerCase().includes(search.toLowerCase());
    const mf = roleFilter==='all' || u.role===roleFilter;
    return ms && mf;
  });
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  if (state.users.length===0) return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Registered Users</h2>
      </div>
      <Empty icon="👥" title="No users yet" desc="Users will appear here as people register on the platform."/>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }}>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:26, fontWeight:700, color:'var(--txt1)', marginBottom:4 }}>Registered Users</h2>
        <p style={{ fontSize:14, color:'var(--txt3)' }}>{state.users.length} user{state.users.length!==1?'s':''} registered</p>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name, email, or organization..." style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:'var(--r)', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-b)', outline:'none', background:'var(--surface)' }} onFocus={e=>e.target.style.borderColor='var(--g4)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','Food Donor','Recipient Organization','Data Analyst','Admin'].map(r=>(
            <button key={r} onClick={()=>{setRoleFilter(r);setPage(1);}} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)', background:roleFilter===r?'var(--g3)':'var(--surface)', color:roleFilter===r?'#fff':'var(--txt3)', transition:'all .18s' }}>{r==='all'?'All':r}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <Empty icon="🔍" title="No results" desc="Try adjusting your search or role filter."/>
        : <>
            <Card>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'var(--g9)' }}>{['User','Role','Organization','Email','Phone','Joined'].map(h=><th key={h} style={{ padding:'12px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--txt3)', letterSpacing:'.06em' }}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>
                  {paginated.map(u=>(
                    <tr key={u.id} style={{ borderTop:'1px solid var(--border)', transition:'background .15s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--g9)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'14px 18px' }}><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:34, height:34, borderRadius:10, background:`${ROLE_COLOR2[u.role]}20`, border:`1.5px solid ${ROLE_COLOR2[u.role]}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:ROLE_COLOR2[u.role], flexShrink:0 }}>{u.name[0]?.toUpperCase()}</div><div style={{ fontSize:13, fontWeight:600, color:'var(--txt1)' }}>{u.name}</div></div></td>
                      <td style={{ padding:'14px 18px' }}><span style={{ fontSize:11, fontWeight:700, color:ROLE_COLOR2[u.role], background:`${ROLE_COLOR2[u.role]}15`, padding:'4px 10px', borderRadius:20 }}>{u.role}</span></td>
                      <td style={{ padding:'14px 18px', fontSize:13, color:'var(--txt2)' }}>{u.org||'—'}</td>
                      <td style={{ padding:'14px 18px', fontSize:13, color:'var(--txt3)' }}>{u.email}</td>
                      <td style={{ padding:'14px 18px', fontSize:13, color:'var(--txt3)' }}>{u.phone||'—'}</td>
                      <td style={{ padding:'14px 18px', fontSize:13, color:'var(--txt3)' }}>{fmtDate(u.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            {totalPages>1 && <Pagination page={page} total={totalPages} onChange={setPage}/>}
          </>
      }
    </div>
  );
}
