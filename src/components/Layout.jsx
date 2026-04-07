import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useStats } from '../context/store';
import { Leaf, LayoutDashboard, Package, ClipboardList, BarChart3, Users, LogOut, ChevronLeft, ChevronRight, Bell, X, CheckCircle, UserCircle } from 'lucide-react';

const NAV = {
  'Food Donor':             [{ id:'dashboard', label:'Dashboard', icon:LayoutDashboard },{ id:'donate', label:'List Donation', icon:Package },{ id:'my-donations', label:'My Donations', icon:ClipboardList }],
  'Recipient Organization': [{ id:'dashboard', label:'Dashboard', icon:LayoutDashboard },{ id:'available', label:'Available Food', icon:Package },{ id:'my-requests', label:'My Requests', icon:ClipboardList }],
  'Data Analyst':           [{ id:'dashboard', label:'Dashboard', icon:LayoutDashboard },{ id:'analytics', label:'Analytics', icon:BarChart3 },{ id:'reports', label:'Reports', icon:ClipboardList }],
  'Admin':                  [{ id:'dashboard', label:'Dashboard', icon:LayoutDashboard },{ id:'all-donations', label:'All Donations', icon:Package },{ id:'all-requests', label:'All Requests', icon:ClipboardList },{ id:'users', label:'Users', icon:Users },{ id:'analytics', label:'Analytics', icon:BarChart3 }],
};
const ROLE_COLOR = { 'Food Donor':'var(--g4)', 'Recipient Organization':'#2563EB', 'Data Analyst':'#7C3AED', 'Admin':'var(--amber)' };

export function Sidebar() {
  const { state, dispatch, toast } = useStore();
  const navigate = useNavigate();
  const { unreadNotifs } = useStats(state);
  const items = NAV[state.user?.role] || [];
  const open = state.sidebarOpen;
  const color = ROLE_COLOR[state.user?.role] || 'var(--g4)';

  const handleLogout = () => { dispatch({ type:'LOGOUT' }); toast('Signed out successfully','info'); navigate('/'); };

  return (
    <aside style={{ width:open?252:66, minHeight:'100vh', background:'var(--g1)', display:'flex', flexDirection:'column', transition:'width .3s cubic-bezier(.4,0,.2,1)', position:'relative', flexShrink:0, zIndex:50 }}>
      {/* Logo */}
      <div style={{ padding:open?'26px 20px 22px':'26px 14px 22px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--amber),var(--amber-l))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(245,158,11,.35)' }}>
            <Leaf size={17} color="var(--g1)" strokeWidth={2.5}/>
          </div>
          {open && <div style={{ animation:'fadeIn .2s ease', overflow:'hidden' }}>
            <div style={{ fontFamily:'var(--font-d)', fontSize:17, fontWeight:700, color:'#fff', lineHeight:1, whiteSpace:'nowrap' }}>FoodBridge</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:3, letterSpacing:'.1em', whiteSpace:'nowrap' }}>FOOD SECURITY PLATFORM</div>
          </div>}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto', overflowX:'hidden' }}>
        {items.map(({ id, label, icon:Icon }) => {
          const active = state.page===id;
          return (
            <button key={id} onClick={() => dispatch({ type:'SET_PAGE', page:id })} title={!open?label:''} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:open?'10px 12px':'10px', borderRadius:11, marginBottom:3, border:'none', cursor:'pointer', background:active?'rgba(255,255,255,.1)':'transparent', color:active?'#fff':'rgba(255,255,255,.46)', transition:'all .17s', justifyContent:open?'flex-start':'center', position:'relative' }}
              onMouseEnter={e => { if(!active){ e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.color='#fff'; }}}
              onMouseLeave={e => { if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.46)'; }}}>
              {active && <div style={{ position:'absolute', left:0, top:'18%', height:'64%', width:3, borderRadius:'0 3px 3px 0', background:color }}/>}
              <Icon size={17} strokeWidth={active?2.5:1.8} style={{ flexShrink:0 }}/>
              {open && <span style={{ fontSize:13.5, fontWeight:active?600:400, whiteSpace:'nowrap' }}>{label}</span>}
              {id==='all-requests' && state.requests.filter(r=>r.status==='pending').length>0 && open && (
                <span style={{ marginLeft:'auto', background:color, color:color==='var(--amber)'?'var(--g1)':'#fff', fontSize:10, fontWeight:800, borderRadius:20, padding:'2px 7px', flexShrink:0 }}>{state.requests.filter(r=>r.status==='pending').length}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'8px 8px 20px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <button onClick={() => dispatch({ type:'TOGGLE_SIDEBAR' })} title={open?'Collapse':'Expand'} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:open?'10px 12px':'10px', borderRadius:11, border:'none', background:'transparent', cursor:'pointer', color:'rgba(255,255,255,.3)', marginBottom:4, justifyContent:open?'flex-start':'center', transition:'all .17s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.color='rgba(255,255,255,.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.3)'; }}>
          {open?<ChevronLeft size={17}/>:<ChevronRight size={17}/>}
          {open && <span style={{ fontSize:13, whiteSpace:'nowrap' }}>Collapse sidebar</span>}
        </button>
        <button onClick={handleLogout} title="Sign Out" style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:open?'10px 12px':'10px', borderRadius:11, border:'none', background:'transparent', cursor:'pointer', color:'rgba(255,255,255,.46)', marginBottom:6, justifyContent:open?'flex-start':'center', transition:'all .17s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.15)'; e.currentTarget.style.color='#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.46)'; }}>
          <LogOut size={17}/>{open && <span style={{ fontSize:13.5 }}>Sign Out</span>}
        </button>

        {/* User pill — clickable → profile */}
        <button onClick={() => dispatch({ type:'SET_PAGE', page:'profile' })} title="My Profile" style={{ width:'100%', background:state.page==='profile'?'rgba(255,255,255,.1)':'rgba(255,255,255,.06)', borderRadius:11, padding:open?'11px 12px':'9px', display:'flex', alignItems:'center', gap:9, justifyContent:open?'flex-start':'center', border:'none', cursor:'pointer', transition:'background .17s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.12)'}
          onMouseLeave={e => e.currentTarget.style.background=state.page==='profile'?'rgba(255,255,255,.1)':'rgba(255,255,255,.06)'}>
          <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:`${color}30`, border:`1.5px solid ${color}60`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:12, fontWeight:700, color }}>{state.user?.name?.[0]?.toUpperCase()}</span>
          </div>
          {open && <div style={{ overflow:'hidden', flex:1, textAlign:'left' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{state.user?.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', whiteSpace:'nowrap' }}>{state.user?.role}</div>
          </div>}
          {open && <UserCircle size={14} color="rgba(255,255,255,.3)" style={{ flexShrink:0 }}/>}
        </button>
      </div>
    </aside>
  );
}

export function Header() {
  const { state, dispatch } = useStore();
  const { unreadNotifs } = useStats(state);
  const [showNotifs, setShowNotifs] = useState(false);

  const PAGE_LABELS = {
    dashboard:'Dashboard', donate:'List a Donation', 'my-donations':'My Donations',
    available:'Available Food', 'my-requests':'My Requests', analytics:'Analytics',
    reports:'Reports', 'all-donations':'All Donations', 'all-requests':'All Requests',
    users:'Users', profile:'My Profile',
  };

  return (
    <header style={{ height:64, background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 24px', gap:16, position:'sticky', top:0, zIndex:40 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <h1 style={{ fontFamily:'var(--font-d)', fontSize:20, fontWeight:700, color:'var(--g1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{PAGE_LABELS[state.page]||'Dashboard'}</h1>
        <div style={{ fontSize:11, color:'var(--txt3)' }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
      <div style={{ background:'var(--g9)', border:'1px solid var(--g7)', borderRadius:20, padding:'5px 14px', fontSize:12, fontWeight:700, color:'var(--g3)', whiteSpace:'nowrap' }} className="desk-only">{state.user?.role}</div>
      <div style={{ position:'relative' }}>
        <button onClick={() => { setShowNotifs(!showNotifs); if(!showNotifs) dispatch({ type:'MARK_NOTIFS_READ' }); }} style={{ position:'relative', width:38, height:38, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Bell size={17} color="var(--txt1)"/>
          {unreadNotifs>0 && <span style={{ position:'absolute', top:7, right:7, width:8, height:8, borderRadius:'50%', background:'var(--red)', border:'2px solid var(--surface)' }}/>}
        </button>
        {showNotifs && (
          <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'var(--surface)', borderRadius:18, border:'1px solid var(--border)', boxShadow:'var(--shadow-xl)', padding:16, width:340, zIndex:200, animation:'scaleIn .2s ease' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ fontWeight:700, fontSize:14, color:'var(--txt1)' }}>Notifications</span>
              <button onClick={() => setShowNotifs(false)} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--txt3)' }}><X size={15}/></button>
            </div>
            {state.notifs.length===0
              ? <div style={{ textAlign:'center', padding:'32px 16px' }}>
                  <Bell size={32} color="var(--border)" style={{ display:'block', margin:'0 auto 12px' }}/>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--txt2)' }}>All caught up!</div>
                  <div style={{ fontSize:12, color:'var(--txt3)', marginTop:4 }}>No notifications yet</div>
                </div>
              : state.notifs.slice(0,8).map(n => (
                <div key={n.id} style={{ padding:'11px 0', borderBottom:'1px solid var(--border)', display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:n.type==='donation'?'var(--g4)':n.type==='delivery'?'var(--g3)':'var(--amber)', marginTop:5, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'var(--txt1)', lineHeight:1.5 }}>{n.text}</div>
                    <div style={{ fontSize:11, color:'var(--txt3)', marginTop:2 }}>{new Date(n.at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </header>
  );
}
