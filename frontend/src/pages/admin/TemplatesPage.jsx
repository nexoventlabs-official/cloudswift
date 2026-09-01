import React, { useEffect, useState } from 'react';
import { api } from '../../adminApi.js';
import Loader from './Loader.jsx';

const FLOW_STEPS = [
  'flow1_first_response','flow2_q1','flow2_q2','flow2_q3',
  'hot_sales_brief','hot_prospect_confirm','pre_call_brief',
  'post_call_followup','nurture_d3','nurture_d7','nurture_d21',
  'cold_exit','custom',
];
const STATUSES = ['Draft','Active','Archived'];

const blank = { slug:'', name:'', flowStep:'custom', body:'', isMetaApproved:false, metaTemplateName:'', metaLanguage:'en', status:'Draft', buttons:[], notes:'' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null); // null | template object
  const [form, setForm]           = useState(blank);
  const [toast, setToast]         = useState('');
  const [saving, setSaving]       = useState(false);

  async function load() {
    try {
      const res = await api.get('/admin/templates');
      setTemplates(res.data || []);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function showToast(m) { setToast(m); setTimeout(() => setToast(''), 3500); }

  function openNew() {
    setEditing('new');
    setForm({ ...blank });
  }

  function openEdit(t) {
    setEditing(t._id);
    setForm({ ...t, buttons: t.buttons || [] });
  }

  function closeEditor() { setEditing(null); }

  async function save() {
    if (!form.slug || !form.name || !form.body) return showToast('Slug, Name, and Body are required');
    setSaving(true);
    try {
      if (editing === 'new') {
        const res = await api.post('/admin/templates', form);
        setTemplates(prev => [res.data, ...prev]);
        showToast('✅ Template created');
      } else {
        const res = await api.put(`/admin/templates/${editing}`, form);
        setTemplates(prev => prev.map(t => t._id === editing ? res.data : t));
        showToast('✅ Template updated');
      }
      closeEditor();
    } catch (e) {
      showToast('❌ ' + e.message);
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.delete(`/admin/templates/${id}`);
      setTemplates(prev => prev.filter(t => t._id !== id));
      if (editing === id) closeEditor();
      showToast('Deleted');
    } catch (e) { showToast('❌ ' + e.message); }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <Loader />;

  return (
    <div style={{ padding:28, fontFamily:'Inter,system-ui,sans-serif', maxWidth:1100, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
        <div>
          <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>Admin · Templates</div>
          <div style={{ color:'#f1f5f9', fontSize:22, fontWeight:800 }}>WhatsApp Templates</div>
        </div>
        <button onClick={openNew} style={primaryBtn}>+ New Template</button>
      </div>

      {toast && (
        <div style={{ background: toast.startsWith('❌') ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)', border:`1px solid ${toast.startsWith('❌') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: toast.startsWith('❌') ? '#f87171' : '#4ade80', padding:'10px 16px', borderRadius:8, marginBottom:20, fontWeight:600, fontSize:13 }}>
          {toast}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns: editing ? '1fr 420px' : '1fr', gap:20 }}>
        {/* Table */}
        <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#0f172a' }}>
                {['Name','Slug','Flow Step','Status','Meta','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', color:'#64748b', fontWeight:700, textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t._id} style={{ borderTop:'1px solid #1e293b', background: editing === t._id ? '#1e3a5f22' : 'transparent' }}>
                  <td style={{ padding:'12px 14px', color:'#f1f5f9', fontWeight:600 }}>{t.name}</td>
                  <td style={{ padding:'12px 14px', color:'#64748b', fontFamily:'monospace', fontSize:12 }}>{t.slug}</td>
                  <td style={{ padding:'12px 14px', color:'#94a3b8', fontSize:12 }}>{t.flowStep?.replace(/_/g,' ')}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ background: t.status==='Active' ? '#22c55e22' : t.status==='Draft' ? '#f59e0b22' : '#94a3b822', color: t.status==='Active' ? '#4ade80' : t.status==='Draft' ? '#fbbf24' : '#94a3b8', borderRadius:5, padding:'2px 8px', fontWeight:700, fontSize:11 }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px', color: t.isMetaApproved ? '#4ade80' : '#475569', fontSize:12 }}>{t.isMetaApproved ? '✅ Approved' : '—'}</td>
                  <td style={{ padding:'12px 14px', display:'flex', gap:8 }}>
                    <button onClick={() => openEdit(t)} style={ghostBtn}>Edit</button>
                    <button onClick={() => remove(t._id)} style={dangerBtn}>Delete</button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr><td colSpan={6} style={{ padding:32, textAlign:'center', color:'#64748b' }}>No templates yet. Click "+ New Template" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Editor panel */}
        {editing && (
          <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:20, height:'fit-content', position:'sticky', top:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:16 }}>{editing === 'new' ? 'New Template' : 'Edit Template'}</div>
              <button onClick={closeEditor} style={{ background:'transparent', border:'1px solid #334155', borderRadius:6, color:'#94a3b8', cursor:'pointer', padding:'4px 10px', fontSize:12 }}>✕</button>
            </div>

            {[
              { label:'Slug (unique key)',  key:'slug',             type:'text',  placeholder:'e.g. flow1_first_response' },
              { label:'Display Name',       key:'name',             type:'text',  placeholder:'e.g. Flow 1 — First Response' },
              { label:'Meta Template Name', key:'metaTemplateName', type:'text',  placeholder:'e.g. cloudswift_welcome (if approved)' },
              { label:'Language Code',      key:'metaLanguage',     type:'text',  placeholder:'en' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}

            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Flow Step</label>
              <select value={form.flowStep} onChange={e => set('flowStep', e.target.value)} style={inputStyle}>
                {FLOW_STEPS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Message Body <span style={{ color:'#475569' }}>(use {'{{name}}'} for variables)</span></label>
              <textarea
                value={form.body}
                onChange={e => set('body', e.target.value)}
                rows={8}
                placeholder="Hi {{name}} — thanks for reaching out to CloudSwift…"
                style={{ ...inputStyle, resize:'vertical' }}
              />
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Notes (internal)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <input type="checkbox" id="metaApproved" checked={!!form.isMetaApproved} onChange={e => set('isMetaApproved', e.target.checked)} style={{ width:16, height:16, accentColor:'#2563eb' }} />
              <label htmlFor="metaApproved" style={{ color:'#94a3b8', fontSize:13 }}>Meta-approved template</label>
            </div>

            <button onClick={save} disabled={saving} style={{ ...primaryBtn, width:'100%', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create Template' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const primaryBtn = { padding:'10px 20px', background:'#2563eb', border:0, borderRadius:9, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' };
const ghostBtn   = { padding:'6px 12px', background:'transparent', border:'1px solid #334155', borderRadius:6, color:'#94a3b8', fontSize:12, cursor:'pointer', fontWeight:600 };
const dangerBtn  = { padding:'6px 12px', background:'transparent', border:'1px solid #ef444444', borderRadius:6, color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:600 };
const labelStyle = { display:'block', color:'#94a3b8', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 };
const inputStyle = { width:'100%', padding:'10px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
