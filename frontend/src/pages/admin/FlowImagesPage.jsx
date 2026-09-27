import React, { useEffect, useState } from 'react';
import { api } from '../../adminApi.js';
import Loader from './Loader.jsx';

// Flow asset slots — every key here is actually used by the WhatsApp bot.
const ASSET_FIELDS = [
  {
    group: 'Service Picker Flow',
    items: [
      { key: 'welcome_header',  label: 'Service Picker — message header (ad reply)', type: 'image', aspectRatio: 'original' },
      { key: 'welcome_banner',  label: 'Service Picker — in-flow banner (8:1)',      type: 'image', aspectRatio: '8:1' },
      { key: 'icon_azure',      label: 'Azure migration — row icon (1:1)',           type: 'image', aspectRatio: '1:1' },
      { key: 'icon_m365',       label: 'Microsoft 365 — row icon (1:1)',             type: 'image', aspectRatio: '1:1' },
      { key: 'icon_managed',    label: 'Managed cloud — row icon (1:1)',             type: 'image', aspectRatio: '1:1' },
      { key: 'icon_security',   label: 'Security — row icon (1:1)',                  type: 'image', aspectRatio: '1:1' },
    ]
  },
  {
    group: 'Message Headers',
    items: [
      { key: 'a1_header',       label: 'Questions intro header (Continue / Talk to a person)', type: 'image', aspectRatio: 'original' },
      { key: 'qualify_header',  label: '4-question form header',                      type: 'image', aspectRatio: 'original' },
      { key: 'hot_lead_header', label: 'Hot lead — contact form header',              type: 'image', aspectRatio: 'original' },
      { key: 'h2_header',       label: 'Book / Callback / Chat header',               type: 'image', aspectRatio: 'original' },
      { key: 'calendly_header', label: 'Book a call header',                          type: 'image', aspectRatio: 'original' },
      { key: 'nurture_header',  label: 'Warm — checklist header',                     type: 'image', aspectRatio: 'original' },
      { key: 'n1_header',       label: 'Warm — “send resources?” header',             type: 'image', aspectRatio: 'original' },
      { key: 'thank_you_header',label: 'Cold — guide header',                         type: 'image', aspectRatio: 'original' },
      { key: 'x1_header',       label: '“Didn’t catch that” prompt header',           type: 'image', aspectRatio: 'original' },
      { key: 'resume_header',   label: 'Resume nudge header (drop-off)',              type: 'image', aspectRatio: 'original' },
    ]
  },
];

export default function FlowImagesPage() {
  const [assets, setAssets]     = useState({});
  const [busy, setBusy]         = useState('');
  const [toast, setToast]       = useState({ msg:'', ok:true });
  const [filterGroup, setFilterGroup] = useState('All');
  const [loading, setLoading]   = useState(true);

  async function loadAssets() {
    try {
      const res = await api.get('/assets');
      const map = {};
      (res.data || []).forEach(a => (map[a.key] = a));
      setAssets(map);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { loadAssets(); }, []);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg:'', ok:true }), 4000);
  }

  async function uploadFile(field, file) {
    setBusy(field.key);
    try {
      const form = new FormData();
      form.append('key',         field.key);
      form.append('label',       field.label);
      form.append('type',        field.type);
      form.append('group',       field.group);
      form.append('aspectRatio', field.aspectRatio || 'original');
      form.append('file',        file);
      await api.postForm('/assets', form);
      showToast(`✅ Uploaded "${field.label}"`);
      await loadAssets();
    } catch (e) {
      showToast(`❌ ${e.message}`, false);
    }
    setBusy('');
  }

  async function saveLink(field, url) {
    setBusy(field.key);
    try {
      await api.post('/assets', { key: field.key, label: field.label, type: 'link', group: field.group || 'Links', url });
      showToast(`✅ Saved "${field.label}"`);
      await loadAssets();
    } catch (e) {
      showToast(`❌ ${e.message}`, false);
    }
    setBusy('');
  }

  async function deleteAsset(key) {
    if (!window.confirm('Delete this asset?')) return;
    try {
      await api.delete(`/assets/${key}`);
      showToast('Deleted');
      setAssets(prev => { const n = { ...prev }; delete n[key]; return n; });
    } catch (e) { showToast(`❌ ${e.message}`, false); }
  }

  if (loading) return <Loader />;

  const allGroups = ['All', ...ASSET_FIELDS.map(s => s.group)];

  return (
    <div style={{ padding:28, fontFamily:'Inter,system-ui,sans-serif', maxWidth:1100, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>Admin · Assets</div>
        <div style={{ color:'#f1f5f9', fontSize:22, fontWeight:800, marginBottom:4 }}>Flow Images & Assets</div>
        <div style={{ color:'#64748b', fontSize:14 }}>Upload images, PDFs, and links used inside WhatsApp flow messages. All images hosted on Cloudinary CDN.</div>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div style={{ background: toast.ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border:`1px solid ${toast.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: toast.ok ? '#4ade80' : '#f87171', padding:'11px 16px', borderRadius:8, marginBottom:20, fontWeight:600, fontSize:13 }}>
          {toast.msg}
        </div>
      )}

      {/* Group filter */}
      <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
        {allGroups.map(g => (
          <button key={g} onClick={() => setFilterGroup(g)}
            style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', background: filterGroup === g ? '#2563eb' : '#1e293b', color: filterGroup === g ? '#fff' : '#94a3b8', border:`1px solid ${filterGroup === g ? '#2563eb' : '#334155'}` }}>
            {g}
          </button>
        ))}
      </div>

      {/* Asset sections */}
      {ASSET_FIELDS
        .filter(s => filterGroup === 'All' || s.group === filterGroup)
        .map(section => (
          <div key={section.group} style={{ marginBottom:36 }}>
            <div style={{ color:'#94a3b8', fontSize:12, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:16, paddingBottom:10, borderBottom:'1px solid #1e293b' }}>
              {section.group}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
              {section.items.map(field => {
                const current = assets[field.key];
                const isBusy  = busy === field.key;
                const ratio   = field.aspectRatio || 'original';
                const isWide  = ratio === '8:1';
                const isSquare = ratio === '1:1';

                return (
                  <div key={field.key} style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:10, padding:16, display:'flex', flexDirection:'column', gap:12 }}>
                    {/* Label row */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:13 }}>{field.label}</div>
                      {field.type === 'image' && (
                        <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20, background:'#0f172a', color:'#2563eb', border:'1px solid #1e3a5f' }}>{ratio}</span>
                      )}
                    </div>

                    {/* Preview */}
                    {field.type === 'image' && (
                      <div style={{
                        background:'#0f172a', borderRadius:8, overflow:'hidden', border:'1px solid #334155',
                        width:'100%',
                        aspectRatio: isWide ? '8 / 1' : isSquare ? '1 / 1' : undefined,
                        minHeight: (isWide || isSquare) ? undefined : 120,
                        maxHeight: isSquare ? 260 : undefined,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        {current?.url ? (
                          <img src={current.url} alt={field.label} style={{
                            width:'100%', height:'100%',
                            objectFit: ratio === 'original' ? 'contain' : 'cover',
                            ...(ratio === 'original' ? { maxHeight:220 } : {}),
                          }} />
                        ) : (
                          <div style={{ color:'#475569', fontSize:12, padding:16, textAlign:'center' }}>No image uploaded</div>
                        )}
                      </div>
                    )}

                    {field.type === 'pdf' && current?.url && (
                      <a href={current.url} target="_blank" rel="noreferrer" style={{ color:'#2563eb', fontSize:13, fontWeight:600, textDecoration:'none', background:'#1e3a5f22', border:'1px solid #1e3a5f', borderRadius:7, padding:'8px 12px', display:'block', textAlign:'center' }}>
                        📄 View Current PDF
                      </a>
                    )}

                    {/* Actions */}
                    {field.type === 'link' ? (
                      <div style={{ display:'flex', gap:8 }}>
                        <input
                          id={`link_${field.key}`}
                          defaultValue={current?.url || ''}
                          placeholder="https://…"
                          style={{ flex:1, padding:'9px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:13, outline:'none' }}
                        />
                        <button
                          disabled={isBusy}
                          onClick={() => saveLink({ ...field, group: section.group }, document.getElementById(`link_${field.key}`).value)}
                          style={saveBtn(isBusy)}>
                          {isBusy ? '…' : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display:'flex', gap:8 }}>
                        <input type="file" id={`file_${field.key}`} accept={field.type === 'pdf' ? 'application/pdf' : 'image/*'} style={{ display:'none' }}
                          onChange={e => e.target.files[0] && uploadFile({ ...field, group: section.group }, e.target.files[0])} />
                        <button disabled={isBusy} onClick={() => document.getElementById(`file_${field.key}`).click()} style={{ ...saveBtn(isBusy), flex:1 }}>
                          {isBusy ? 'Uploading…' : `Upload ${field.type === 'pdf' ? 'PDF' : 'Image'}`}
                        </button>
                        {current?.url && (
                          <button onClick={() => deleteAsset(field.key)} style={{ padding:'9px 12px', background:'#ef444422', border:'1px solid #ef444444', borderRadius:8, color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:700 }}>✕</button>
                        )}
                      </div>
                    )}

                    {current?.updatedAt && (
                      <div style={{ color:'#475569', fontSize:11 }}>Updated {new Date(current.updatedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Guidelines */}
      <div style={{ background:'#1e293b', border:'1px solid #1e3a5f', borderRadius:10, padding:20, marginTop:12 }}>
        <div style={{ color:'#2563eb', fontWeight:700, fontSize:14, marginBottom:10 }}>Upload Guidelines</div>
        <ul style={{ margin:0, paddingLeft:20, color:'#94a3b8', fontSize:13, lineHeight:1.8 }}>
          <li><strong>In-flow banner (8:1):</strong> Recommended 1600 × 200px — shown inside the service picker</li>
          <li><strong>Row icons (1:1):</strong> Recommended 400 × 400px — one per service</li>
          <li><strong>Message headers (original ratio):</strong> Min 800px wide, max 5MB — shown above chat messages</li>
          <li>All images are auto-optimised and served via Cloudinary CDN</li>
        </ul>
      </div>
    </div>
  );
}

const saveBtn = (disabled) => ({
  padding:'9px 16px', background: disabled ? '#1e3a5f' : '#2563eb', border:0, borderRadius:8,
  color:'#fff', fontWeight:700, fontSize:12, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace:'nowrap',
});
