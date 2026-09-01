import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { API_BASE_URL, ADMIN_TOKEN_KEY } from '../../config.js';

import LeadsPage       from './LeadsPage.jsx';
import CrmPage         from './CrmPage.jsx';
import FlowImagesPage  from './FlowImagesPage.jsx';
import TemplatesPage   from './TemplatesPage.jsx';
import SettingsPage    from './SettingsPage.jsx';
import DashboardPage   from './DashboardPage.jsx';

// ── Login screen ─────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [u, setU]   = useState('');
  const [p, setP]   = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res  = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem(ADMIN_TOKEN_KEY, json.token);
        onLogin();
      } else {
        setErr(json.message || 'Login failed');
      }
    } catch {
      setErr('Cannot reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background:'#0f172a', fontFamily:'Inter,system-ui,sans-serif' }}>
      <form onSubmit={submit} style={{ width:380, padding:40, background:'#1e293b', border:'1px solid #334155', borderRadius:16, boxShadow:'0 24px 48px rgba(0,0,0,0.4)' }}>
        {/* Logo area */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:52, height:52, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius:14, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <span style={{ color:'#fff', fontSize:24, fontWeight:800 }}>☁</span>
          </div>
          <div style={{ color:'#f1f5f9', fontSize:22, fontWeight:700 }}>CloudSwift</div>
          <div style={{ color:'#2563eb', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginTop:2 }}>Admin Panel</div>
        </div>

        {err && (
          <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', padding:'10px 14px', borderRadius:8, marginBottom:18, fontSize:13, fontWeight:600 }}>
            {err}
          </div>
        )}

        <input
          placeholder="Username"
          value={u}
          onChange={e => setU(e.target.value)}
          style={inputStyle}
          autoComplete="username"
        />
        <input
          placeholder="Password"
          type="password"
          value={p}
          onChange={e => setP(e.target.value)}
          style={inputStyle}
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width:'100%', padding:'13px 16px', background: loading ? '#1e40af' : '#2563eb', color:'#fff', border:0, borderRadius:10, fontWeight:700, fontSize:14, letterSpacing:'0.5px', cursor: loading ? 'not-allowed' : 'pointer', marginTop:4, transition:'background 0.2s' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'12px 14px', marginBottom:14,
  background:'#0f172a', border:'1px solid #334155',
  borderRadius:9, color:'#f1f5f9', fontSize:14,
  boxSizing:'border-box', outline:'none',
  fontFamily:'Inter,system-ui,sans-serif',
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { to:'/admin/dashboard', label:'Dashboard',   icon:'📊' },
  { to:'/admin/leads',     label:'Leads',        icon:'🔴' },
  { to:'/admin/crm',       label:'Conversations',icon:'💬' },
  { to:'/admin/flow-images',label:'Flow Images', icon:'🖼️' },
  { to:'/admin/templates', label:'Templates',    icon:'📝' },
  { to:'/admin/settings',  label:'Settings',     icon:'⚙️' },
];

// ── Main layout ───────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(ADMIN_TOKEN_KEY));

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw', overflow:'hidden', background:'#0f172a', fontFamily:'Inter,system-ui,sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width:230, height:'100vh', position:'sticky', top:0,
        background:'#0f172a', borderRight:'1px solid #1e293b',
        display:'flex', flexDirection:'column', padding:'20px 12px',
        boxSizing:'border-box', flexShrink:0, overflowY:'auto',
      }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32, paddingLeft:6 }}>
          <div style={{ width:34, height:34, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>☁</div>
          <div>
            <div style={{ color:'#f1f5f9', fontWeight:800, fontSize:14, letterSpacing:'0.5px' }}>CloudSwift</div>
            <div style={{ color:'#2563eb', fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>ADMIN</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderRadius:9, marginBottom:4,
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#2563eb' : 'transparent',
                textDecoration:'none', fontWeight: isActive ? 700 : 500,
                fontSize:13, transition:'all 0.15s',
              })}
            >
              <span style={{ fontSize:15 }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => { localStorage.removeItem(ADMIN_TOKEN_KEY); setAuthed(false); }}
          style={{ background:'transparent', color:'#64748b', border:'1px solid #334155', borderRadius:9, padding:'10px 12px', cursor:'pointer', width:'100%', fontWeight:600, fontSize:12, textTransform:'uppercase', letterSpacing:'1px', marginTop:16 }}
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, height:'100vh', overflowY:'auto', background:'#0f172a', color:'#f1f5f9', minWidth:0, boxSizing:'border-box' }}>
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"   element={<DashboardPage />} />
          <Route path="leads"       element={<LeadsPage />} />
          <Route path="crm"         element={<CrmPage />} />
          <Route path="flow-images" element={<FlowImagesPage />} />
          <Route path="templates"   element={<TemplatesPage />} />
          <Route path="settings"    element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
