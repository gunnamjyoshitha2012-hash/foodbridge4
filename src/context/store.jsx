import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

function hashPass(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16);
}

const LS_KEY = 'foodbridge_state_v4';
function loadState() { try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveState(s) { try { const { toasts, ...rest } = s; localStorage.setItem(LS_KEY, JSON.stringify(rest)); } catch {} }

const defaultInit = { user:null, users:[], donations:[], requests:[], reports:[], page:'dashboard', sidebarOpen:true, toasts:[], notifs:[], _error:null };
const persisted = loadState();
const init = persisted ? { ...defaultInit, ...persisted, toasts:[], _error:null } : defaultInit;

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE': return { ...state, page:action.page };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen:!state.sidebarOpen };
    case 'CLEAR_ERROR': return { ...state, _error:null };

    case 'REGISTER': {
      if (state.users.find(u => u.email.toLowerCase() === action.payload.email.toLowerCase()))
        return { ...state, _error:'EMAIL_EXISTS' };
      const user = { id:Date.now().toString(), name:action.payload.name, email:action.payload.email, passHash:hashPass(action.payload.pass), role:action.payload.role, org:action.payload.org||'', phone:action.payload.phone||'', location:action.payload.location||'', joinedAt:new Date().toISOString() };
      return { ...state, users:[...state.users, user], user, page:'dashboard', _error:null };
    }

    case 'LOGIN': {
      const found = state.users.find(u => u.email.toLowerCase()===action.email.toLowerCase() && u.role===action.role && u.passHash===hashPass(action.pass));
      if (!found) return { ...state, _error:'BAD_CREDENTIALS' };
      return { ...state, user:found, page:'dashboard', _error:null };
    }

    case 'LOGOUT': return { ...state, user:null, page:'dashboard' };

    case 'UPDATE_PROFILE': {
      const updated = { ...state.user, ...action.payload };
      if (action.payload.pass) updated.passHash = hashPass(action.payload.pass);
      delete updated.pass;
      return { ...state, user:updated, users:state.users.map(u => u.id===updated.id ? updated : u) };
    }

    case 'ADD_DONATION': {
      const d = { id:'DON-'+Date.now(), donorId:state.user.id, donorName:state.user.name, donorOrg:state.user.org, ...action.payload, status:'available', createdAt:new Date().toISOString(), requestedBy:null, requestedAt:null, approvedAt:null, deliveredAt:null, recipientId:null, recipientName:null, recipientOrg:null };
      const notif = { id:Date.now(), text:`New donation: ${d.food} (${d.qty} ${d.unit}) by ${d.donorOrg||d.donorName}`, type:'donation', at:new Date().toISOString(), read:false };
      return { ...state, donations:[d,...state.donations], notifs:[notif,...state.notifs] };
    }

    case 'CANCEL_DONATION':
      return { ...state, donations:state.donations.map(d => d.id===action.id && d.donorId===state.user.id ? { ...d, status:'cancelled' } : d) };

    case 'ADD_REQUEST': {
      const don = state.donations.find(d => d.id===action.payload.donationId);
      if (!don) return state;
      const r = { id:'REQ-'+Date.now(), recipientId:state.user.id, recipientName:state.user.name, recipientOrg:state.user.org, donationId:don.id, food:don.food, qty:don.qty, unit:don.unit, donorId:don.donorId, donorName:don.donorName, donorOrg:don.donorOrg, needBy:action.payload.needBy, notes:action.payload.notes||'', status:'pending', createdAt:new Date().toISOString(), respondedAt:null };
      const notif = { id:Date.now(), text:`${state.user.org||state.user.name} requested: ${don.food}`, type:'request', at:new Date().toISOString(), read:false };
      return { ...state, requests:[r,...state.requests], donations:state.donations.map(d => d.id===don.id ? { ...d, status:'requested', requestedBy:state.user.id, requestedAt:new Date().toISOString(), recipientId:state.user.id, recipientName:state.user.name, recipientOrg:state.user.org } : d), notifs:[notif,...state.notifs] };
    }

    case 'APPROVE_REQUEST': {
      const req = state.requests.find(r => r.id===action.id); if (!req) return state;
      return { ...state, requests:state.requests.map(r => r.id===action.id ? { ...r, status:'approved', respondedAt:new Date().toISOString() } : r), donations:state.donations.map(d => d.id===req.donationId ? { ...d, status:'in_transit', approvedAt:new Date().toISOString() } : d), notifs:[{ id:Date.now(), text:`Approved: ${req.food} → ${req.recipientOrg||req.recipientName}`, type:'approval', at:new Date().toISOString(), read:false },...state.notifs] };
    }

    case 'REJECT_REQUEST': {
      const req = state.requests.find(r => r.id===action.id); if (!req) return state;
      return { ...state, requests:state.requests.map(r => r.id===action.id ? { ...r, status:'rejected', respondedAt:new Date().toISOString() } : r), donations:state.donations.map(d => d.id===req.donationId ? { ...d, status:'available', requestedBy:null, requestedAt:null, recipientId:null, recipientName:null, recipientOrg:null } : d) };
    }

    case 'MARK_DELIVERED': {
      const req = state.requests.find(r => r.id===action.id); if (!req) return state;
      return { ...state, requests:state.requests.map(r => r.id===action.id ? { ...r, status:'delivered' } : r), donations:state.donations.map(d => d.id===req.donationId ? { ...d, status:'delivered', deliveredAt:new Date().toISOString() } : d), notifs:[{ id:Date.now(), text:`Delivered: ${req.food} → ${req.recipientOrg||req.recipientName}`, type:'delivery', at:new Date().toISOString(), read:false },...state.notifs] };
    }

    case 'ADD_REPORT': {
      const r = { id:'RPT-'+Date.now(), analystId:state.user.id, analystName:state.user.name, createdAt:new Date().toISOString(), ...action.payload };
      return { ...state, reports:[r,...state.reports] };
    }

    case 'TOAST_ADD': return { ...state, toasts:[...state.toasts, { id:action.id, msg:action.msg, kind:action.kind||'success' }] };
    case 'TOAST_REMOVE': return { ...state, toasts:state.toasts.filter(t => t.id!==action.id) };
    case 'MARK_NOTIFS_READ': return { ...state, notifs:state.notifs.map(n => ({ ...n, read:true })) };

    default: return state;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);
  useEffect(() => { saveState(state); }, [state]);
  const toast = useCallback((msg, kind='success') => {
    const id = Date.now();
    dispatch({ type:'TOAST_ADD', id, msg, kind });
    setTimeout(() => dispatch({ type:'TOAST_REMOVE', id }), 4200);
  }, []);
  return <Ctx.Provider value={{ state, dispatch, toast }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

export function useStats(state) {
  const myDonations = state.donations.filter(d => d.donorId===state.user?.id);
  const myRequests = state.requests.filter(r => r.recipientId===state.user?.id);
  const totalKg = state.donations.filter(d => d.status==='delivered').reduce((s,d) => s+parseFloat(d.qty||0), 0);
  const delivered = state.donations.filter(d => d.status==='delivered').length;
  const inTransit = state.donations.filter(d => d.status==='in_transit').length;
  const available = state.donations.filter(d => d.status==='available').length;
  const pending = state.requests.filter(r => r.status==='pending').length;
  const unreadNotifs = state.notifs.filter(n => !n.read).length;
  return { myDonations, myRequests, totalKg, delivered, inTransit, available, pending, unreadNotifs };
}
