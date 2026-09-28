"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import Loader from "@/components/Loader";
import s from "../panel.module.css";

type Conv = { _id: string; phone: string; name?: string; company?: string; lastMessage?: string; label?: string; botPaused?: boolean; optedOut?: boolean };
type Msg = { _id: string; direction: string; body: string; createdAt: string; status?: string };

export default function CrmPage() {
  const [convs, setConvs] = useState<Conv[]>([]);
  const [sel, setSel] = useState<Conv | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  const loadConvs = useCallback(async () => {
    setLoadingConvs(true);
    try { const r = await adminApi.get("/crm/conversations?limit=80"); setConvs(r.data || []); } catch {}
    setLoadingConvs(false);
  }, []);
  useEffect(() => { loadConvs(); }, [loadConvs]);

  const openConv = useCallback(async (c: Conv) => {
    setSel(c);
    setLoadingMsgs(true);
    try { const r = await adminApi.get(`/crm/conversations/${c.phone}/messages`); setMsgs(r.data || []); } catch {}
    setLoadingMsgs(false);
  }, []);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send() {
    if (!reply.trim() || !sel) return;
    const text = reply.trim();
    setReply("");
    try {
      await adminApi.post(`/crm/conversations/${sel.phone}/send`, { message: text });
      setMsgs((m) => [...m, { _id: String(Date.now()), direction: "outbound", body: text, createdAt: new Date().toISOString() }]);
      setSel((c) => (c ? { ...c, botPaused: true } : c));
      setConvs((cs) => cs.map((c) => (c.phone === sel.phone ? { ...c, botPaused: true } : c)));
    } catch {}
  }
  async function toggleBot() {
    if (!sel) return;
    const paused = !sel.botPaused;
    await adminApi.post(`/crm/conversations/${sel.phone}/bot`, { paused });
    setSel({ ...sel, botPaused: paused });
    setConvs((cs) => cs.map((c) => (c.phone === sel.phone ? { ...c, botPaused: paused } : c)));
  }

  return (
    <div className={s.crmFull}>
      <div className={s.crm}>
        <div className={s.convList}>
          {loadingConvs && <Loader />}
          {convs.map((c) => (
            <div key={c._id} className={`${s.convItem} ${sel?.phone === c.phone ? s.convActive : ""}`} onClick={() => openConv(c)}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ fontSize: "0.88rem" }}>{c.name || c.phone}</strong>
                {c.botPaused && <span className={`${s.badge} ${s.warm}`}>HUMAN</span>}
              </div>
              <div className={s.muted} style={{ fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMessage || "—"}</div>
            </div>
          ))}
          {!loadingConvs && convs.length === 0 && <div className={s.muted} style={{ padding: 16 }}>No conversations yet.</div>}
        </div>
        <div className={s.chat}>
          {!sel ? (
            <div className={s.muted} style={{ margin: "auto" }}>Select a conversation</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <strong>{sel.name || sel.phone}</strong>
                  <div className={s.muted} style={{ fontSize: "0.78rem" }}>{sel.phone} {sel.company ? `· ${sel.company}` : ""}</div>
                </div>
                <button className={s.btnGhost} onClick={toggleBot}>{sel.botPaused ? "▶ Resume bot" : "⏸ Pause bot"}</button>
              </div>
              <div className={s.msgs}>
                {loadingMsgs ? <Loader /> : msgs.map((m) => (
                  <div key={m._id} className={`${s.bubble} ${m.direction === "outbound" ? s.outbound : s.inbound}`}>{m.body}</div>
                ))}
                <div ref={bottom} />
              </div>
              <div className={s.chatBar}>
                <input className={s.input} placeholder="Type a message…" value={reply}
                  onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
                <button className={s.btn} onClick={send}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
