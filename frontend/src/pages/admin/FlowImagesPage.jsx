import React, { useEffect, useState } from 'react';
import { api } from '../../adminApi.js';
import Loader from './Loader.jsx';

// All flow asset slots — keyed by slug, grouped for the admin UI
const ASSET_FIELDS = [
  {
    group: 'Welcome & Branding',
    items: [
      { key: 'welcome_header',     label: 'Welcome Message Header',           type: 'image', aspectRatio: 'original' },
      { key: 'welcome_banner',     label: 'Welcome Flow Banner (8:1)',         type: 'image', aspectRatio: '8:1' },
      { key: 'cloudswift_logo',    label: 'CloudSwift Logo (1:1)',             type: 'image', aspectRatio: '1:1' },
    ]
  },
  {
    group: 'Service Icons',
    items: [
      { key: 'icon_azure',         label: 'Azure Migration Icon (1:1)',        type: 'image', aspectRatio: '1:1' },
      { key: 'icon_m365',          label: 'Microsoft 365 Icon (1:1)',          type: 'image', aspectRatio: '1:1' },
      { key: 'icon_managed',       label: 'Managed Cloud Icon (1:1)',          type: 'image', aspectRatio: '1:1' },
      { key: 'icon_security',      label: 'Security Icon (1:1)',               type: 'image', aspectRatio: '1:1' },
    ]
  },
  {
    group: 'Lead Flow Images',
    items: [
      { key: 'hot_lead_header',    label: 'Hot Lead Confirmation Header',      type: 'image', aspectRatio: 'original' },
      { key: 'calendly_header',    label: 'Calendly / Book a Call Header',     type: 'image', aspectRatio: 'original' },
      { key: 'thank_you_header',   label: 'Thank You / Post-Call Header',      type: 'image', aspectRatio: 'original' },
      { key: 'nurture_header',     label: 'Nurture Sequence Header',           type: 'image', aspectRatio: 'original' },
    ]
  },
  {
    group: 'Documents & Links',
    items: [
      { key: 'case_study_pdf',     label: 'Case Study PDF',                    type: 'pdf' },
      { key: 'overview_pdf',       label: 'Managed Services Overview PDF',     type: 'pdf' },
      { key: 'pricing_pdf',        label: 'Pricing Framework PDF',             type: 'pdf' },
      { key: 'google_review_link', label: 'Google Review Link',               type: 'link' },
      { key: 'linkedin_url',       label: 'LinkedIn Company URL',              type: 'link' },
      { key: 'website_url',        label: 'Website URL',                       type: 'link' },
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
                        aspectRatio: isWide ? '8/1' : isSquare ? '1/1' : 'auto',
                        minHeight: isWide ? undefined : isSquare ? undefined : 100,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        {current?.url ? (
                          <img src={current.url} alt={field.label} style={{ width:'100%', height:'100%', objectFit: ratio === 'original' ? 'contain' : 'cover', maxHeight:200 }} />
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
          <li><strong>Welcome Banners (8:1):</strong> Recommended 1000 × 125px</li>
          <li><strong>Service Icons (1:1):</strong> Recommended 600 × 600px</li>
          <li><strong>Original ratio images:</strong> Min 800px wide, max 5MB</li>
          <li><strong>PDFs:</strong> Max 10MB — served directly from Cloudinary CDN</li>
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
