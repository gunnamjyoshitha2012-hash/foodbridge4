import React, { useState } from 'react';
import { useStore } from '../context/store';
import { CheckCircle, AlertTriangle, Info, XCircle, X, AlertCircle } from 'lucide-react';

/* ── Toast Container ── */
const TOAST_CFG = {
  success: { icon: CheckCircle, bg: '#F0FDF4', border: '#86EFAC', color: '#15803D', ic: '#22C55E' },
  error:   { icon: XCircle,    bg: '#FEF2F2', border: '#FCA5A5', color: '#DC2626', ic: '#EF4444' },
  warning: { icon: AlertTriangle, bg: '#FFFBEB', border: '#FCD34D', color: '#D97706', ic: '#F59E0B' },
  info:    { icon: Info,       bg: '#EFF6FF', border: '#93C5FD', color: '#2563EB', ic: '#3B82F6' },
};
export function Toasts() {
  const { state, dispatch } = useStore();
  return (
    <div style={{ position:'fixed', top:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
      {state.toasts.map(t => {
        const c = TOAST_CFG[t.kind] || TOAST_CFG.info;
        const Icon = c.icon;
        return (
          <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:14, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', minWidth:300, maxWidth:380, animation:'toastIn .35s cubic-bezier(.34,1.56,.64,1)', pointerEvents:'all' }}>
            <Icon size={17} color={c.ic} style={{ flexShrink:0, marginTop:1 }} />
            <span style={{ fontSize:13.5, color:c.color, flex:1, fontWeight:500 }}>{t.msg}</span>
            <button onClick={() => dispatch({ type:'TOAST_REMOVE', id:t.id })} style={{ border:'none', background:'none', cursor:'pointer', color:c.color, opacity:.5, padding:2 }}><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Modal ── */
export function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fadeIn .2s ease' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'var(--surface)', borderRadius:'var(--r-xl)', padding:36, width:'100%', maxWidth:width, boxShadow:'var(--shadow-xl)', animation:'scaleIn .25s ease', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:24, fontWeight:700, color:'var(--txt1)' }}>{title}</h2>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--txt3)', padding:4, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── FormField ── */
export function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize:12, fontWeight:700, color:'var(--txt2)', display:'block', marginBottom:7, letterSpacing:'.05em' }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:12, color:'var(--red)', marginTop:4 }}>⚠ {error}</div>}
    </div>
  );
}
export function Input({ error, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <input {...props}
      onFocus={e => { setFoc(true); props.onFocus && props.onFocus(e); }}
      onBlur={e => { setFoc(false); props.onBlur && props.onBlur(e); }}
      style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r)', border:`2px solid ${error ? 'var(--red)' : foc ? 'var(--g4)' : 'var(--border)'}`, background:'var(--surface)', fontSize:14, color:'var(--txt1)', outline:'none', transition:'border-color .2s', ...props.style }}
    />
  );
}
export function Select({ children, error, ...props }) {
  return (
    <select {...props} style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--r)', border:`2px solid ${error ? 'var(--red)' : 'var(--border)'}`, background:'var(--surface)', fontSize:14, color:'var(--txt1)', outline:'none', cursor:'pointer', ...props.style }}>
      {children}
    </select>
  );
}

/* ── Status Badge ── */
const STATUS = {
  available:   { bg:'#DCFCE7', color:'#15803D', label:'Available' },
  requested:   { bg:'#EFF6FF', color:'#2563EB', label:'Requested' },
  in_transit:  { bg:'#FEF9C3', color:'#B45309', label:'In Transit' },
  delivered:   { bg:'#F0FDF4', color:'#166534', label:'Delivered' },
  cancelled:   { bg:'#F3F4F6', color:'#6B7280', label:'Cancelled' },
  pending:     { bg:'#FEF9C3', color:'#B45309', label:'Pending' },
  approved:    { bg:'#DCFCE7', color:'#15803D', label:'Approved' },
  rejected:    { bg:'#FEE2E2', color:'#DC2626', label:'Rejected' },
};
export function Badge({ status }) {
  const s = STATUS[status] || { bg:'#F3F4F6', color:'#6B7280', label: status };
  return <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:20, whiteSpace:'nowrap', letterSpacing:'.03em' }}>{s.label}</span>;
}

/* ── Empty State ── */
export function Empty({ icon, title, desc, action }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'72px 24px', textAlign:'center' }}>
      <div style={{ fontSize:52, marginBottom:20, opacity:.35 }}>{icon}</div>
      <h3 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:700, color:'var(--txt2)', marginBottom:10 }}>{title}</h3>
      <p style={{ fontSize:14, color:'var(--txt3)', maxWidth:360, lineHeight:1.7 }}>{desc}</p>
      {action && <div style={{ marginTop:24 }}>{action}</div>}
    </div>
  );
}

/* ── Btn ── */
export function Btn({ children, onClick, variant='primary', size='md', loading, style: s, disabled }) {
  const base = { display:'flex', alignItems:'center', justifyContent:'center', gap:8, border:'none', borderRadius:'var(--r)', cursor: disabled || loading ? 'not-allowed' : 'pointer', fontFamily:'var(--font-b)', fontWeight:600, transition:'all .2s', ...s };
  const sizes = { sm:{ padding:'8px 16px', fontSize:12 }, md:{ padding:'11px 22px', fontSize:14 }, lg:{ padding:'14px 28px', fontSize:15 } };
  const variants = {
    primary:  { background:'var(--g3)', color:'#fff', boxShadow:'0 4px 14px rgba(28,92,62,.3)' },
    outline:  { background:'transparent', color:'var(--g3)', border:'2px solid var(--g4)' },
    ghost:    { background:'var(--g9)', color:'var(--g3)' },
    danger:   { background:'var(--red)', color:'#fff' },
    amber:    { background:'var(--amber)', color:'var(--g1)', boxShadow:'0 4px 14px rgba(245,158,11,.3)' },
  };
  return (
    <button onClick={disabled || loading ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], opacity: disabled ? .55 : 1 }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading ? <div style={{ width:15, height:15, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> : children}
    </button>
  );
}

/* ── Card ── */
export function Card({ children, style: s }) {
  return <div style={{ background:'var(--surface)', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', boxShadow:'var(--shadow)', ...s }}>{children}</div>;
}

/* ── Stat Card ── */
export function StatCard({ label, value, sub, color='var(--g3)', icon, delay=0 }) {
  return (
    <Card style={{ padding:22, animation:`fadeUp .5s ease ${delay}s both`, cursor:'default' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{icon}</div>
        {sub && <span style={{ fontSize:12, fontWeight:700, color:'var(--g5)', background:'var(--g9)', padding:'3px 9px', borderRadius:20 }}>{sub}</span>}
      </div>
      <div style={{ fontFamily:'var(--font-d)', fontSize:30, fontWeight:700, color, marginBottom:4, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:13, color:'var(--txt3)' }}>{label}</div>
    </Card>
  );
}
