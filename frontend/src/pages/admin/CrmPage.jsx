import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../adminApi.js';
import { SERVER_ORIGIN, ADMIN_TOKEN_KEY } from '../../config.js';
import Loader from './Loader.jsx';
import { io } from 'socket.io-client';

const LABEL_COLOR = { none:'#64748b', hot:'#ef4444', warm:'#f59e0b', cold:'#94a3b8', won:'#22c55e', follow_up:'#8b5cf6' };

export default function CrmPage() {
  const [convs, setConvs]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply]     = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [labelFilter, setLabelFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const [toast, setToast]     = useState('');
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  async function loadConvs() {
    try {
      const params = new URLSearchParams({ limit: 80 });
      if (labelFilter !== 'all') params.set('label', labelFilter);
      if (search) params.set('search', search);
      const res = await api.get(`/crm/conversations?${params}`);
      setConvs(res.data || []);
    } catch {}
    finally { setLoading(false); }
  }

  async function loadMessages(phone) {
    setMsgLoading(true);
    try {
      const res = await api.get(`/crm/conversations/${phone}/messages`);
      setMessages(res.data || []);
      setConvs(prev => prev.map(c => c.phone === phone ? { ...c, unreadCount:0 } : c));
    } catch {}
    finally { setMsgLoading(false); }
  }

  // Socket for live messages
  useEffect(() => {
    const socket = io(SERVER_ORIGIN, { auth: { token: localStorage.getItem(ADMIN_TOKEN_KEY) } });
    socketRef.current = socket;
    socket.on('new_message', (msg) => {
      if (msg.direction === 'inbound') {
        setConvs(prev => prev.map(c => c.phone === msg.phone ? { ...c, lastMessage: msg.body, unreadCount: c.unreadCount + 1 } : c));
        if (selected?.phone === msg.phone) {
          setMessages(prev => [...prev, msg]);
        }
      }
    });
    return () => socket.disconnect();
  }, [selected]);

  useEffect(() => { loadConvs(); }, [search, labelFilter]);

  useEffect(() => {
    if (selected) loadMessages(selected.phone);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply('');
    try {
      await api.post(`/crm/conversations/${selected.phone}/send`, { message: text });
      setMessages(prev => [...prev, { _id: Date.now(), direction:'outbound', type:'text', body: text, createdAt: new Date() }]);
      setConvs(prev => prev.map(c => c.phone === selected.phone ? { ...c, lastMessage: text } : c));
    } catch (e) {
      setToast('Failed: ' + e.message);
      setTimeout(() => setToast(''), 3000);
    }
    setSending(false);
  }

  async function setLabel(phone, label) {
    await api.patch(`/crm/conversations/${phone}`, { label });
    setConvs(prev => prev.map(c => c.phone === phone ? { ...c, label } : c));
    if (selected?.phone === phone) setSelected(s => ({ ...s, label }));
  }

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'Inter,system-ui,sans-serif', overflow:'hidden' }}>

      {/* Conversations list */}
      <div style={{ width:320, borderRight:'1px solid #1e293b', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'16px 16px 0', borderBottom:'1px solid #1e293b' }}>
          <div style={{ color:'#f1f5f9', fontWeight:800, fontSize:16, marginBottom:12 }}>Conversations</div>
          <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
          <div style={{ display:'flex', gap:6, paddingBottom:12, overflowX:'auto' }}>
            {['all','hot','warm','cold','won','follow_up'].map(l => (
              <button key={l} onClick={() => setLabelFilter(l)}
                style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', background: labelFilter === l ? '#2563eb' : '#1e293b', color: labelFilter === l ? '#fff' : '#94a3b8', border: `1px solid ${labelFilter === l ? '#2563eb' : '#334155'}` }}>
                {l.replace('_',' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {loading ? <Loader /> : convs.length === 0 ? (
            <div style={{ textAlign:'center', color:'#64748b', padding:32 }}>No conversations</div>
          ) : convs.map(conv => (
            <div key={conv._id} onClick={() => setSelected(conv)}
              style={{ padding:'12px 16px', borderBottom:'1px solid #1e293b', cursor:'pointer', background: selected?.phone === conv.phone ? '#1e293b' : 'transparent', display:'flex', gap:12 }}>
              {/* Avatar */}
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#1e3a5f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, position:'relative' }}>
                {(conv.name || conv.phone)[0]?.toUpperCase()}
                {conv.unreadCount > 0 && (
                  <div style={{ position:'absolute', top:-3, right:-3, background:'#ef4444', color:'#fff', borderRadius:'50%', width:16, height:16, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </div>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <div style={{ color:'#f1f5f9', fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{conv.name || conv.phone}</div>
                  <div style={{ color:'#475569', fontSize:11, flexShrink:0, marginLeft:4 }}>{conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}</div>
                </div>
                <div style={{ color:'#64748b', fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{conv.lastMessage || 'No messages'}</div>
                {conv.label && conv.label !== 'none' && (
                  <span style={{ color: LABEL_COLOR[conv.label], fontSize:10, fontWeight:700 }}>● {conv.label.replace('_',' ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      {!selected ? (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'#334155' }}>
          <div style={{ fontSize:48 }}>💬</div>
          <div style={{ color:'#64748b', fontSize:16 }}>Select a conversation</div>
        </div>
      ) : (
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div>
              <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:16 }}>{selected.name || selected.phone}</div>
              <div style={{ color:'#64748b', fontSize:12 }}>{selected.phone} {selected.company ? `· ${selected.company}` : ''}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <select value={selected.label || 'none'} onChange={e => setLabel(selected.phone, e.target.value)} style={selStyle}>
                <option value="none">No label</option>
                <option value="hot">🔴 Hot</option>
                <option value="warm">🟡 Warm</option>
                <option value="cold">⚪ Cold</option>
                <option value="won">✅ Won</option>
                <option value="follow_up">🟣 Follow Up</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:8 }}>
            {msgLoading ? <Loader /> : messages.map((m, i) => (
              <div key={m._id || i} style={{ display:'flex', justifyContent: m.direction === 'outbound' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'70%', padding:'10px 14px', borderRadius: m.direction === 'outbound' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.direction === 'outbound' ? '#2563eb' : '#1e293b',
                  color:'#f1f5f9', fontSize:13, lineHeight:1.55,
                  border: m.direction === 'inbound' ? '1px solid #334155' : 'none',
                  whiteSpace:'pre-wrap', wordBreak:'break-word',
                }}>
                  {m.body}
                  <div style={{ color: m.direction === 'outbound' ? 'rgba(255,255,255,0.5)' : '#475569', fontSize:10, marginTop:4, textAlign:'right' }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                    {m.direction === 'outbound' && ` · ${m.status || 'sent'}`}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && !msgLoading && <div style={{ textAlign:'center', color:'#475569', marginTop:40 }}>No messages yet</div>}
            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          <div style={{ padding:'12px 20px', borderTop:'1px solid #1e293b', display:'flex', gap:10, flexShrink:0 }}>
            {toast && <div style={{ position:'fixed', bottom:80, right:20, background:'#ef4444', color:'#fff', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:700 }}>{toast}</div>}
            <textarea
              placeholder="Type a message…"
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              rows={2}
              style={{ flex:1, padding:'10px 14px', background:'#1e293b', border:'1px solid #334155', borderRadius:10, color:'#f1f5f9', fontSize:13, resize:'none', outline:'none', fontFamily:'inherit' }}
            />
            <button onClick={sendMessage} disabled={sending || !reply.trim()}
              style={{ padding:'10px 20px', background: sending ? '#1e40af' : '#2563eb', border:0, borderRadius:10, color:'#fff', fontWeight:700, fontSize:13, cursor: sending ? 'not-allowed' : 'pointer', alignSelf:'flex-end' }}>
              {sending ? '…' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = { width:'100%', padding:'9px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit', marginBottom:10 };
const selStyle = { padding:'7px 10px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:12, cursor:'pointer', outline:'none' };
