"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import s from "../panel.module.css";

type Template = {
  _id?: string; slug: string; name: string; flowStep: string; body: string;
  status: string; metaTemplateName?: string; notes?: string;
};

const FLOW_STEPS = [
  "flow1_first_response", "flow2_q1", "flow2_q2", "flow2_q3", "hot_sales_brief",
  "hot_prospect_confirm", "pre_call_brief", "post_call_followup", "nurture_d3",
  "nurture_d7", "nurture_d21", "cold_exit", "custom",
];
const STATUSES = ["Draft", "Active", "Archived"];

const blank: Template = { slug: "", name: "", flowStep: "custom", body: "", status: "Draft" };

export default function TemplatesPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);
  const [toast, setToast] = useState("");

  async function load() {
    try { const r = await adminApi.get("/admin/templates"); setItems(r.data || []); } catch {}
  }
  useEffect(() => { load(); }, []);
  function flash(m: string) { setToast(m); setTimeout(() => setToast(""), 2500); }

  async function save() {
    if (!editing?.name || !editing?.slug || !editing?.body) { flash("slug, name and body are required"); return; }
    try {
      if (editing._id) await adminApi.put(`/admin/templates/${editing._id}`, editing);
      else await adminApi.post("/admin/templates", editing);
      setEditing(null);
      await load();
      flash("Saved");
    } catch (e) { flash("Save failed: " + (e as Error).message); }
  }
  async function remove(id?: string) {
    if (!id || !confirm("Delete this template?")) return;
    await adminApi.del(`/admin/templates/${id}`);
    await load();
  }

  return (
    <div>
      <div className={s.headRow}>
        <div>
          <div className={s.h1}>Templates</div>
          <div className={s.sub}>{items.length} templates</div>
        </div>
        {!editing && <button className={s.btn} onClick={() => setEditing({ ...blank })}>New template</button>}
      </div>

      {editing ? (
        <div style={{ display: "grid", gap: 14, maxWidth: 680 }}>
          <div><label className={s.muted}>Name</label><input className={s.input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
          <div><label className={s.muted}>Slug</label><input className={s.input} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
          <div className={s.row}>
            <div style={{ flex: 1 }}><label className={s.muted}>Flow step</label>
              <select className={s.select} value={editing.flowStep} onChange={(e) => setEditing({ ...editing, flowStep: e.target.value })}>
                {FLOW_STEPS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}><label className={s.muted}>Status</label>
              <select className={s.select} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
          <div><label className={s.muted}>Body</label><textarea className={s.textarea} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
          <div><label className={s.muted}>Notes</label><input className={s.input} value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
          <div className={s.row}>
            <button className={s.btn} onClick={save}>Save</button>
            <button className={s.btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <table className={s.table}>
          <thead><tr><th>Name</th><th>Flow step</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t._id}>
                <td><strong>{t.name}</strong><div className={s.muted} style={{ fontSize: "0.75rem" }}>{t.slug}</div></td>
                <td>{t.flowStep}</td>
                <td><span className={`${s.badge} ${t.status === "Active" ? s.warm : s.new}`}>{t.status}</span></td>
                <td className={s.row}>
                  <button className={s.btnGhost} onClick={() => setEditing(t)}>Edit</button>
                  <button className={s.btnGhost} onClick={() => remove(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className={s.muted}>No templates yet.</td></tr>}
          </tbody>
        </table>
      )}
      {toast && <div className={s.toast}>{toast}</div>}
    </div>
  );
}
