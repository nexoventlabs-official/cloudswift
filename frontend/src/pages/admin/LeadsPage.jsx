import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../adminApi.js';
import { SERVER_ORIGIN, ADMIN_TOKEN_KEY } from '../../config.js';
import Loader from './Loader.jsx';
import { io } from 'socket.io-client';

const SCORE_COLOR  = { HOT:'#ef4444', WARM:'#f59e0b', COLD:'#94a3b8', NEW:'#2563eb' };
const SCORE_BG     = { HOT:'#ef444422', WARM:'#f59e0b22', COLD:'#94a3b822', NEW:'#2563eb22' };
const STATUS_COLOR = { New:'#2563eb', Contacted:'#8b5cf6', Discovery:'#06b6d4', Proposal:'#f59e0b', Won:'#22c55e', Lost:'#ef4444', Nurturing:'#f59e0b' };

const TOPIC_LABEL = { azure_migration:'Azure Migration', m365:'Microsoft 365', managed_cloud:'Managed Cloud', security:'Security', other:'Other', '':'—' };
const SIZE_LABEL  = { under_100:'< 100', '100_500':'100–500', '500_2000':'500–2k', '2000_plus':'2k+', '':'—' };

export default function LeadsPage() {
  const [leads, setLeads]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ score:'', status:'', search:'' });
  const [page, setPage]     = useState(1);
  const [msg, setMsg]       = useState('');
  const [sendText, setSendText] = useState('');
  const socketRef = useRef(null);
  const LIMIT = 30;

  async function load(p = page) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (filter.score)  params.set('score', filter.score);
      if (filter.status) params.set('status', filter.status);
      if (filter.search) params.set('search', filter.search);
      const res = await api.get(`/leads?${params}`);
      setLeads(res.data || []);
      setTotal(res.total || 0);
    } catch {}
    finally { setLoading(false); }
  }

  // Socket.IO live lead alerts
  useEffect(() => {
    const socket = io(SERVER_ORIGIN, { auth: { token: localStorage.getItem(ADMIN_TOKEN_KEY) } });
    socketRef.current = socket;
    socket.on('new_lead',    (lead) => { setLeads(prev => [lead, ...prev]); flash('🔴 New lead: ' + (lead.name || lead.phone)); });
    socket.on('lead_update', (lead) => { setLeads(prev => prev.map(l => l._id === lead._id ? lead : l)); if (selected?._id === lead._id) setSelected(lead); });
    return () => socket.disconnect();
  }, []);

  useEffect(() => { load(1); setPage(1); }, [filter]);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 4000); }

  async function updateLead(id, patch) {
    try {
      const res = await api.patch(`/leads/${id}`, patch);
      setLeads(prev => prev.map(l => l._id === id ? res.data : l));
      if (selected?._id === id) setSelected(res.data);
    } catch {}
  }

  async function sendManualMessage() {
    if (!sendText.trim() || !selected) return;
    try {
      await api.post(`/leads/${selected._id}/send-message`, { message: sendText });
      setSendText('');
      flash('Message sent');
    } catch (e) { flash('Error: ' + e.message); }
  }

  async function triggerPostCall() {
    if (!selected) return;
    try {
      await api.post(`/leads/${selected._id}/post-call`);
      flash('Post-call follow-up sent');
    } catch (e) { flash('Error: ' + e.message); }
  }

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'Inter,system-ui,sans-serif', overflow:'hidden' }}>

      {/* Left panel — list */}
      <div style={{ width:460, borderRight:'1px solid #1e293b', display:'flex', flexDirection:'column', flexShrink:0 }}>
        {/* Header + filters */}
        <div style={{ padding:'20px 20px 0', borderBottom:'1px solid #1e293b' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ color:'#f1f5f9', fontWeight:800, fontSize:18 }}>Leads <span style={{ color:'#64748b', fontWeight:500, fontSize:14 }}>({total})</span></div>
            {msg && <div style={{ background:'#22c55e22', color:'#4ade80', border:'1px solid #22c55e44', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:700 }}>{msg}</div>}
          </div>

          <input
            placeholder="Search name, phone, company…"
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            style={searchInput}
          />

          <div style={{ display:'flex', gap:8, paddingBottom:14, flexWrap:'wrap' }}>
            {['', 'HOT', 'WARM', 'COLD'].map(s => (
              <button key={s} onClick={() => setFilter(f => ({ ...f, score: s }))}
                style={{ ...pill, background: filter.score === s ? (SCORE_BG[s] || '#2563eb22') : '#1e293b', color: filter.score === s ? (SCORE_COLOR[s] || '#2563eb') : '#64748b', border: `1px solid ${filter.score === s ? (SCORE_COLOR[s] || '#2563eb') : '#334155'}` }}>
                {s || 'All'}
              </button>
            ))}
            <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} style={selectStyle}>
              <option value="">All Status</option>
              {['New','Contacted','Discovery','Proposal','Won','Lost','Nurturing'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Lead list */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {loading ? <Loader /> : leads.length === 0 ? (
            <div style={{ textAlign:'center', color:'#64748b', padding:40 }}>No leads found</div>
          ) : leads.map(lead => (
            <div
              key={lead._id}
              onClick={() => { setSelected(lead); api.post(`/leads/${lead._id}/mark-seen`).catch(()=>{}); }}
              style={{ padding:'14px 20px', borderBottom:'1px solid #1e293b', cursor:'pointer', background: selected?._id === lead._id ? '#1e293b' : 'transparent', transition:'background 0.1s' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {!lead.seen && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb', flexShrink:0 }} />}
                  <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:14 }}>{lead.name || lead.phone}</div>
                </div>
                <span style={{ background: SCORE_BG[lead.score], color: SCORE_COLOR[lead.score], border:`1px solid ${SCORE_COLOR[lead.score]}44`, borderRadius:5, padding:'1px 7px', fontWeight:700, fontSize:11 }}>
                  {lead.score}
                </span>
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ color:'#64748b', fontSize:12 }}>{lead.phone}</span>
                {lead.company && <span style={{ color:'#64748b', fontSize:12 }}>· {lead.company}</span>}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:6 }}>
                <span style={{ color:'#94a3b8', fontSize:11, background:'#0f172a', borderRadius:4, padding:'2px 6px' }}>{TOPIC_LABEL[lead.topic] || '—'}</span>
                <span style={{ color: STATUS_COLOR[lead.status] || '#94a3b8', fontSize:11 }}>{lead.status}</span>
                <span style={{ color:'#475569', fontSize:11, marginLeft:'auto' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ display:'flex', justifyContent:'center', gap:12, padding:16 }}>
              <button onClick={() => { const p = Math.max(1, page-1); setPage(p); load(p); }} disabled={page===1} style={pageBtn}>← Prev</button>
              <span style={{ color:'#64748b', fontSize:13, alignSelf:'center' }}>{page} / {Math.ceil(total/LIMIT)}</span>
              <button onClick={() => { const p = page+1; setPage(p); load(p); }} disabled={page >= Math.ceil(total/LIMIT)} style={pageBtn}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div style={{ flex:1, overflowY:'auto', padding:28 }}>
        {!selected ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#334155', gap:12 }}>
            <div style={{ fontSize:48 }}>👈</div>
            <div style={{ fontSize:16, color:'#64748b' }}>Select a lead to view details</div>
          </div>
        ) : (
          <div style={{ maxWidth:640 }}>
            {/* Top row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
              <div>
                <div style={{ color:'#f1f5f9', fontSize:22, fontWeight:800, marginBottom:4 }}>{selected.name || 'Unknown'}</div>
                <div style={{ color:'#64748b', fontSize:14 }}>{selected.phone} {selected.company && `· ${selected.company}`}</div>
              </div>
              <span style={{ background: SCORE_BG[selected.score], color: SCORE_COLOR[selected.score], border:`1px solid ${SCORE_COLOR[selected.score]}44`, borderRadius:8, padding:'4px 14px', fontWeight:800, fontSize:14 }}>
                {selected.score}
              </span>
            </div>

            {/* Info cards */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
              {[
                ['Topic',    TOPIC_LABEL[selected.topic] || '—'],
                ['Company Size', SIZE_LABEL[selected.companySize] || '—'],
                ['Situation', selected.situation?.replace('_',' ') || '—'],
                ['Timeline',  selected.timeline?.replace('_',' ') || '—'],
                ['Flow Step', selected.flowStep?.replace(/_/g,' ') || '—'],
                ['Channel',   selected.channel?.replace('_',' ') || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'12px 16px' }}>
                  <div style={{ color:'#64748b', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>{k}</div>
                  <div style={{ color:'#f1f5f9', fontSize:14, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* First message */}
            {selected.firstMessage && (
              <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'14px 16px', marginBottom:16 }}>
                <div style={{ color:'#64748b', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>First Message</div>
                <div style={{ color:'#cbd5e1', fontSize:13, lineHeight:1.6, fontStyle:'italic' }}>"{selected.firstMessage}"</div>
              </div>
            )}

            {/* Admin controls */}
            <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'16px 18px', marginBottom:16 }}>
              <div style={{ color:'#94a3b8', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:12 }}>Admin Actions</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:12 }}>
                <select value={selected.status} onChange={e => updateLead(selected._id, { status: e.target.value })} style={selectStyle}>
                  {['New','Contacted','Discovery','Proposal','Won','Lost','Nurturing'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={selected.score} onChange={e => updateLead(selected._id, { score: e.target.value })} style={selectStyle}>
                  {['NEW','HOT','WARM','COLD'].map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={triggerPostCall} style={actionBtn}>📞 Send Post-Call Follow-up</button>
              </div>

              {/* Notes */}
              <textarea
                placeholder="Admin notes…"
                defaultValue={selected.notes}
                onBlur={e => updateLead(selected._id, { notes: e.target.value })}
                rows={3}
                style={{ ...searchInput, resize:'vertical', borderRadius:8, padding:'10px 12px' }}
              />
            </div>

            {/* Send WA message */}
            <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'16px 18px' }}>
              <div style={{ color:'#94a3b8', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10 }}>Send WhatsApp Message</div>
              <textarea
                placeholder="Type message to send…"
                value={sendText}
                onChange={e => setSendText(e.target.value)}
                rows={3}
                style={{ ...searchInput, resize:'vertical', borderRadius:8, padding:'10px 12px', marginBottom:10 }}
              />
              <button onClick={sendManualMessage} style={{ ...actionBtn, background:'#25D366', color:'#000' }}>💬 Send via WhatsApp</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const searchInput = { width:'100%', padding:'10px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:9, color:'#f1f5f9', fontSize:13, boxSizing:'border-box', outline:'none', fontFamily:'Inter,system-ui,sans-serif', marginBottom:10 };
const pill  = { padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', border:'1px solid #334155' };
const pageBtn = { padding:'6px 14px', background:'#1e293b', border:'1px solid #334155', borderRadius:7, color:'#94a3b8', cursor:'pointer', fontSize:12, fontWeight:600 };
const selectStyle = { padding:'8px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:13, cursor:'pointer', outline:'none' };
const actionBtn = { padding:'9px 16px', background:'#2563eb', border:0, borderRadius:8, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' };
