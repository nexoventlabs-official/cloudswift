import React, { useEffect, useState } from 'react';
import { api } from '../../adminApi.js';
import { SERVER_ORIGIN } from '../../config.js';
import Loader from './Loader.jsx';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [values, setValues]     = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  async function load() {
    try {
      const res = await api.get('/settings');
      const s   = res.data || [];
      setSettings(s);
      const map = {};
      s.forEach(item => (map[item.key] = item.value || ''));
      setValues(map);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try {
      await api.put('/settings', values);
      setToast('✅ Settings saved');
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setToast('❌ ' + e.message);
      setTimeout(() => setToast(''), 4000);
    }
    setSaving(false);
  }

  function set(key, val) { setValues(prev => ({ ...prev, [key]: val })); }

  if (loading) return <Loader />;

  // Group settings
  const groups = [...new Set(settings.map(s => s.group))];

  return (
    <div style={{ padding:28, fontFamily:'Inter,system-ui,sans-serif', maxWidth:760, margin:'0 auto' }}>
      <div style={{ marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>Admin · Config</div>
          <div style={{ color:'#f1f5f9', fontSize:22, fontWeight:800 }}>Settings</div>
          <div style={{ color:'#64748b', fontSize:14, marginTop:4 }}>System-wide configuration. Changes take effect immediately.</div>
        </div>
        <button onClick={save} disabled={saving} style={{ padding:'11px 24px', background: saving ? '#1e40af' : '#2563eb', border:0, borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : 'Save All'}
        </button>
      </div>

      {toast && (
        <div style={{ background: toast.startsWith('❌') ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)', border:`1px solid ${toast.startsWith('❌') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: toast.startsWith('❌') ? '#f87171' : '#4ade80', padding:'11px 16px', borderRadius:8, marginBottom:24, fontWeight:600, fontSize:13 }}>
          {toast}
        </div>
      )}

      {groups.map(group => {
        const groupSettings = settings.filter(s => s.group === group);
        return (
          <div key={group} style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:24, marginBottom:20 }}>
            <div style={{ color:'#2563eb', fontWeight:700, fontSize:14, marginBottom:20, paddingBottom:12, borderBottom:'1px solid #334155' }}>{group}</div>
            {groupSettings.map(s => (
              <div key={s.key} style={{ marginBottom:20 }}>
                <label style={{ display:'block', color:'#f1f5f9', fontWeight:600, fontSize:14, marginBottom:4 }}>{s.label}</label>
                {s.description && <div style={{ color:'#64748b', fontSize:12, marginBottom:8 }}>{s.description}</div>}
                {s.inputType === 'textarea' ? (
                  <textarea
                    value={values[s.key] || ''}
                    onChange={e => set(s.key, e.target.value)}
                    rows={4}
                    style={inputStyle}
                    placeholder={`Enter ${s.label}…`}
                  />
                ) : s.inputType === 'toggle' ? (
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <input
                      type="checkbox"
                      checked={values[s.key] === 'true'}
                      onChange={e => set(s.key, e.target.checked ? 'true' : 'false')}
                      style={{ width:18, height:18, accentColor:'#2563eb', cursor:'pointer' }}
                    />
                    <span style={{ color:'#94a3b8', fontSize:13 }}>{values[s.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                  </div>
                ) : (
                  <input
                    type={s.inputType === 'url' ? 'url' : s.inputType === 'phone' ? 'tel' : 'text'}
                    value={values[s.key] || ''}
                    onChange={e => set(s.key, e.target.value)}
                    style={inputStyle}
                    placeholder={
                      s.inputType === 'url'   ? 'https://…' :
                      s.inputType === 'phone' ? '919XXXXXXXXX' :
                      `Enter ${s.label}…`
                    }
                  />
                )}
                <div style={{ color:'#475569', fontSize:11, marginTop:4, fontFamily:'monospace' }}>key: {s.key}</div>
              </div>
            ))}
          </div>
        );
      })}

      {/* WhatsApp webhook info card */}
      <div style={{ background:'#1e293b', border:'1px solid #1e3a5f', borderRadius:12, padding:24, marginTop:8 }}>
        <div style={{ color:'#2563eb', fontWeight:700, fontSize:14, marginBottom:14 }}>WhatsApp Webhook Setup</div>
        <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.8 }}>
          <div style={{ marginBottom:8 }}>Configure these in <strong style={{ color:'#f1f5f9' }}>Meta Business → WhatsApp → Configuration</strong>:</div>
          <div style={{ background:'#0f172a', borderRadius:8, padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:'#e2e8f0', marginBottom:8 }}>
            Callback URL: <span style={{ color:'#60a5fa' }}>{SERVER_ORIGIN}/api/whatsapp/webhook</span>
          </div>
          <div style={{ background:'#0f172a', borderRadius:8, padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:'#e2e8f0' }}>
            Verify Token: <span style={{ color:'#60a5fa' }}>cloudswift_whatsapp_verify_2026</span>
          </div>
          <div style={{ marginTop:12, color:'#64748b', fontSize:12 }}>
            Subscribe to: <strong>messages</strong> field in Webhooks panel.
          </div>
        </div>
      </div>

      {/* Save button bottom */}
      <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end' }}>
        <button onClick={save} disabled={saving} style={{ padding:'12px 32px', background: saving ? '#1e40af' : '#2563eb', border:0, borderRadius:10, color:'#fff', fontWeight:700, fontSize:15, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}

const inputStyle = { width:'100%', padding:'11px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:9, color:'#f1f5f9', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,system-ui,sans-serif' };
