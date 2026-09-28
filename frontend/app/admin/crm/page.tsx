"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import Loader from "@/components/Loader";
import s from "../panel.module.css";

type Conv = { _id: string; phone: string; name?: string; company?: string; lastMessage?: string; label?: string; botPaused?: boolean; optedOut?: boolean };
type MsgMeta = {
  kind?: string;
  headerKey?: string;
  buttons?: string[];
  flowCta?: string;
  reply?: boolean;
  replyTitle?: string;
  flowSubmission?: Record<string, unknown>;
};
type Msg = { _id: string; direction: string; type?: string; body: string; createdAt: string; status?: string; meta?: MsgMeta };

export default function CrmPage() {
  const [convs, setConvs] = useState<Conv[]>([]);
  const [sel, setSel] = useState<Conv | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [assets, setAssets] = useState<Record<string, string>>({});
  const bottom = useRef<HTMLDivElement>(null);

  const loadConvs = useCallback(async () => {
    setLoadingConvs(true);
    try { const r = await adminApi.get("/crm/conversations?limit=80"); setConvs(r.data || []); } catch {}
    setLoadingConvs(false);
  }, []);
  useEffect(() => { loadConvs(); }, [loadConvs]);

  // Resolve header image keys → URLs (asset library) once
  useEffect(() => {
    (async () => {
      try {
        const r = await adminApi.get("/assets");
        const map: Record<string, string> = {};
        for (const a of r.data || []) if (a.key && a.url) map[a.key] = a.url;
        setAssets(map);
      } catch {}
    })();
  }, []);

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
      setMsgs((m) => [...m, { _id: String(Date.now()), direction: "outbound", type: "text", body: text, createdAt: new Date().toISOString() }]);
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

  function renderBubble(m: Msg) {
    const outbound = m.direction === "outbound";
    const meta = m.meta || {};
    const headerUrl = meta.headerKey ? assets[meta.headerKey] : "";

    // Inbound button/list tap → show as a reply chip
    if (!outbound && meta.reply && meta.replyTitle) {
      return (
        <div className={`${s.bubble} ${s.inbound} ${s.waMsg}`}>
          <span className={s.replyChip}>↩ {meta.replyTitle}</span>
        </div>
      );
    }

    return (
      <div className={`${s.bubble} ${outbound ? s.outbound : s.inbound} ${s.waMsg}`}>
        {headerUrl && (
          <div className={s.waHeader}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={headerUrl} alt="" />
          </div>
        )}
        {m.body && <div className={s.waBody}>{m.body}</div>}
        {meta.buttons && meta.buttons.length > 0 && (
          <div className={s.waButtons}>
            {meta.buttons.map((b, i) => (
              <span key={i} className={s.waBtn}>{b}</span>
            ))}
          </div>
        )}
        {meta.flowCta && (
          <div className={s.waButtons}>
            <span className={`${s.waBtn} ${s.waFlowBtn}`}>▸ {meta.flowCta}</span>
          </div>
        )}
      </div>
    );
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
                  <div key={m._id} className={m.direction === "outbound" ? s.rowOut : s.rowIn}>
                    {renderBubble(m)}
                  </div>
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
