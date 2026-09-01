import React, { useEffect, useState } from 'react';
import { api } from '../../adminApi.js';
import Loader from './Loader.jsx';

const SCORE_COLOR = { HOT:'#ef4444', WARM:'#f59e0b', COLD:'#94a3b8', NEW:'#2563eb' };

function StatCard({ label, value, sub, color = '#2563eb', icon }) {
  return (
    <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:44, height:44, borderRadius:10, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ color:'#94a3b8', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>{label}</div>
        <div style={{ color:'#f1f5f9', fontSize:28, fontWeight:800, lineHeight:1 }}>{value ?? '—'}</div>
        {sub && <div style={{ color:'#64748b', fontSize:12, marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [s, l] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/leads?limit=8'),
      ]);
      setStats(s.stats);
      setLeads(l.data || []);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ padding:28, fontFamily:'Inter,system-ui,sans-serif', maxWidth:1200, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ color:'#64748b', fontSize:12, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>CloudSwift × Admin</div>
        <div style={{ color:'#f1f5f9', fontSize:24, fontWeight:800 }}>Dashboard</div>
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16, marginBottom:32 }}>
        <StatCard label="Total Leads"   value={stats?.totalLeads}   icon="👥" color="#2563eb" />
        <StatCard label="Hot Leads"     value={stats?.hotLeads}     icon="🔴" color="#ef4444" sub="Ready to convert" />
        <StatCard label="Warm Leads"    value={stats?.warmLeads}    icon="🟡" color="#f59e0b" sub="In nurture sequence" />
        <StatCard label="Cold Leads"    value={stats?.coldLeads}    icon="⚪" color="#94a3b8" sub="Exited cleanly" />
        <StatCard label="Won"           value={stats?.wonLeads}     icon="✅" color="#22c55e" sub="Closed deals" />
        <StatCard label="New Today"     value={stats?.newToday}     icon="📥" color="#8b5cf6" />
        <StatCard label="Conversations" value={stats?.totalConvs}   icon="💬" color="#06b6d4" />
        <StatCard label="Unread"        value={stats?.unreadConvs}  icon="🔔" color="#f59e0b" sub="Need attention" />
      </div>

      {/* Recent leads */}
      <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #334155', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:16 }}>Recent Leads</div>
          <a href="/admin/leads" style={{ color:'#2563eb', fontSize:13, fontWeight:600, textDecoration:'none' }}>View all →</a>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#0f172a' }}>
                {['Name','Phone','Company','Topic','Score','Status','Time'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', color:'#64748b', fontWeight:700, textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:'0.8px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} style={{ borderTop:'1px solid #1e293b', background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                  <td style={{ padding:'12px 16px', color:'#f1f5f9', fontWeight:600 }}>{lead.name || '—'}</td>
                  <td style={{ padding:'12px 16px', color:'#94a3b8' }}>{lead.phone}</td>
                  <td style={{ padding:'12px 16px', color:'#94a3b8' }}>{lead.company || '—'}</td>
                  <td style={{ padding:'12px 16px', color:'#94a3b8' }}>{lead.topic?.replace('_',' ') || '—'}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ background:`${SCORE_COLOR[lead.score] || '#334155'}22`, color: SCORE_COLOR[lead.score] || '#94a3b8', border:`1px solid ${SCORE_COLOR[lead.score] || '#334155'}44`, borderRadius:6, padding:'2px 8px', fontWeight:700, fontSize:11 }}>
                      {lead.score}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#94a3b8' }}>{lead.status}</td>
                  <td style={{ padding:'12px 16px', color:'#64748b', whiteSpace:'nowrap' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#64748b' }}>No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
