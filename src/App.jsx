import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/store';
import { Toasts } from './components/UI';
import { Sidebar, Header } from './components/Layout';
import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import { ProfilePage } from './pages/ProfilePage';
import {
  Dashboard, DonatePage, MyDonations,
  AvailableFood, MyRequests,
  AnalyticsPage, ReportsPage,
  AllDonations, AllRequests, UsersPage,
} from './pages/Pages';

const PAGE_COMPONENTS = {
  'dashboard':     <Dashboard />,
  'donate':        <DonatePage />,
  'my-donations':  <MyDonations />,
  'available':     <AvailableFood />,
  'my-requests':   <MyRequests />,
  'analytics':     <AnalyticsPage />,
  'reports':       <ReportsPage />,
  'all-donations': <AllDonations />,
  'all-requests':  <AllRequests />,
  'users':         <UsersPage />,
  'profile':       <ProfilePage />,
};

const PAGE_TITLES = {
  dashboard:'Dashboard', donate:'List a Donation', 'my-donations':'My Donations',
  available:'Available Food', 'my-requests':'My Requests', analytics:'Analytics',
  reports:'Reports', 'all-donations':'All Donations', 'all-requests':'All Requests',
  users:'Users', profile:'My Profile',
};

function ProtectedRoute({ children }) {
  const { state } = useStore();
  if (!state.user) return <Navigate to="/login" replace />;
  return children;
}

function AppShell() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync URL path → state page
  useEffect(() => {
    const seg = location.pathname.replace('/app/', '').replace('/app', '') || 'dashboard';
    if (PAGE_COMPONENTS[seg] && seg !== state.page) {
      dispatch({ type:'SET_PAGE', page: seg });
    }
  }, [location.pathname]);

  // Sync state page → URL
  useEffect(() => {
    const desired = state.page === 'dashboard' ? '/app' : `/app/${state.page}`;
    if (location.pathname !== desired) navigate(desired, { replace: true });
    const label = PAGE_TITLES[state.page] || 'Dashboard';
    document.title = `${label} — FoodBridge`;
  }, [state.page]);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <Header />
        <main style={{ flex:1, overflowY:'auto' }}>
          {PAGE_COMPONENTS[state.page] || <Dashboard />}
        </main>
      </div>
    </div>
  );
}

function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
      <Route path="/app/:page" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <RouterApp />
        <Toasts />
      </StoreProvider>
    </BrowserRouter>
  );
}
