"use client";
import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/adminApi";
import s from "../panel.module.css";

type Lead = {
  _id: string; name: string; company: string; phone: string; email?: string;
  topic?: string; score: string; status: string; createdAt: string;
};

const scoreClass: Record<string, string> = { HOT: s.hot, WARM: s.warm, COLD: s.cold, NEW: s.new };
const STATUSES = ["New", "Contacted", "Discovery", "Proposal", "Won", "Lost", "Nurturing"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [score, setScore] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (score) params.set("score", score);
    if (search) params.set("search", search);
    try {
      const r = await adminApi.get(`/leads?${params}`);
      setLeads(r.data || []);
    } catch {}
    setLoading(false);
  }, [score, search]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    await adminApi.patch(`/leads/${id}`, { status });
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  }
  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await adminApi.del(`/leads/${id}`);
    setLeads((prev) => prev.filter((l) => l._id !== id));
  }

  return (
    <div>
      <div className={s.headRow}>
        <div>
          <div className={s.h1}>Leads</div>
          <div className={s.sub}>{leads.length} shown</div>
        </div>
        <div className={s.row}>
          <input className={s.input} style={{ width: 200 }} placeholder="Search name/phone/company" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={s.select} style={{ width: 130 }} value={score} onChange={(e) => setScore(e.target.value)}>
            <option value="">All scores</option>
            <option value="HOT">Hot</option>
            <option value="WARM">Warm</option>
            <option value="COLD">Cold</option>
            <option value="NEW">New</option>
          </select>
        </div>
      </div>

      {loading ? <p className={s.muted}>Loading…</p> : (
        <table className={s.table}>
          <thead>
            <tr><th>Name</th><th>Company</th><th>Phone</th><th>Topic</th><th>Score</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id}>
                <td>{l.name || "—"}</td>
                <td>{l.company || "—"}</td>
                <td>{l.phone}</td>
                <td>{l.topic || "—"}</td>
                <td><span className={`${s.badge} ${scoreClass[l.score] || s.new}`}>{l.score}</span></td>
                <td>
                  <select className={s.select} style={{ width: 130 }} value={l.status} onChange={(e) => setStatus(l._id, e.target.value)}>
                    {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </td>
                <td><button className={s.btnGhost} onClick={() => remove(l._id)}>Delete</button></td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={7} className={s.muted}>No leads yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
