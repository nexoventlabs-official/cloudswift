"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import Loader from "@/components/Loader";
import s from "../panel.module.css";

type Field = { key: string; label: string; type: "image" | "link"; aspectRatio?: string };
type Asset = { key: string; url?: string; type: string };

type Group = { group: string; note?: string; items: Field[] };

const GROUPS: Group[] = [
  {
    group: "Requirement Picker Flow (V2)",
    note: "Flow 4577730929132224 — the first screen. The 8:1 banner renders inside the Flow; the message header sits above it in the chat.",
    items: [
      { key: "welcome_header", label: "Requirement Picker — message header", type: "image", aspectRatio: "original" },
      { key: "welcome_banner", label: "Requirement Picker — in-flow banner (8:1)", type: "image", aspectRatio: "8:1" },
    ],
  },
  {
    group: "Requirement Icons (1:1)",
    note: "One per requirement option. Used for message headers and in-flow artwork per requirement — upload square images.",
    items: [
      { key: "icon_migration",     label: "Cloud Migration (1:1)",      type: "image", aspectRatio: "1:1" },
      { key: "icon_managed_cloud", label: "Managed Cloud (1:1)",        type: "image", aspectRatio: "1:1" },
      { key: "icon_finops",        label: "Cloud Cost / FinOps (1:1)",  type: "image", aspectRatio: "1:1" },
      { key: "icon_security",      label: "Security / Compliance (1:1)",type: "image", aspectRatio: "1:1" },
      { key: "icon_m365",          label: "Microsoft 365 (1:1)",        type: "image", aspectRatio: "1:1" },
      { key: "icon_ai",            label: "AI / Automation (1:1)",      type: "image", aspectRatio: "1:1" },
      { key: "icon_other",         label: "Something else (1:1)",       type: "image", aspectRatio: "1:1" },
    ],
  },
  {
    group: "Qualification Flow (V2)",
    note: "Flow 4992071007786916 — Q1→Q2→Q3→Q4 in one form. Q4's question changes with the selected requirement.",
    items: [
      { key: "qualify_header", label: "Qualification — message header", type: "image", aspectRatio: "original" },
    ],
  },
  {
    group: "Message Headers",
    note: "Header images on the journey's chat messages.",
    items: [
      { key: "a1_header", label: "Requirement confirmed — Continue / Talk to specialist", type: "image", aspectRatio: "original" },
      { key: "hot_lead_header", label: "High Priority — contact details", type: "image", aspectRatio: "original" },
      { key: "h2_header", label: "High Priority — Book / Callback / Chat", type: "image", aspectRatio: "original" },
      { key: "nurture_header", label: "Nurture — checklist / resource", type: "image", aspectRatio: "original" },
      { key: "thank_you_header", label: "Self-Serve — guide", type: "image", aspectRatio: "original" },
      { key: "x1_header", label: "“Didn’t catch that” prompt", type: "image", aspectRatio: "original" },
      { key: "resume_header", label: "Drop-off resume nudge", type: "image", aspectRatio: "original" },
    ],
  },
  {
    group: "Legacy / unused",
    note: "From the V1 flow — no longer sent by the V2 journey. Safe to delete.",
    items: [
      { key: "calendly_header", label: "V1 — Calendly / book a call", type: "image", aspectRatio: "original" },
      { key: "n1_header", label: "V1 — nurture resources", type: "image", aspectRatio: "original" },
      { key: "general_header", label: "V1 — follow-up message", type: "image", aspectRatio: "original" },
      { key: "icon_azure", label: "V1 — Azure row icon", type: "image", aspectRatio: "1:1" },
      { key: "icon_managed", label: "V1 — Managed cloud row icon", type: "image", aspectRatio: "1:1" },
    ],
  },
];

export default function FlowImagesPage() {
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const r = await adminApi.get("/assets");
      const map: Record<string, Asset> = {};
      (r.data || []).forEach((a: Asset) => (map[a.key] = a));
      setAssets(map);
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function flash(m: string) { setToast(m); setTimeout(() => setToast(""), 2500); }

  async function upload(f: Field, file: File) {
    setBusy(f.key);
    try {
      const fd = new FormData();
      fd.append("key", f.key);
      fd.append("label", f.label);
      fd.append("type", f.type);
      fd.append("group", "flow");
      fd.append("aspectRatio", f.aspectRatio || "original");
      fd.append("file", file);
      await adminApi.postForm("/assets", fd);
      flash(`Uploaded ${f.label}`);
      await load();
    } catch (e) { flash("Failed: " + (e as Error).message); }
    setBusy("");
  }
  async function remove(key: string) {
    if (!confirm("Delete this image?")) return;
    await adminApi.del(`/assets/${key}`);
    setAssets((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  return (
    <div>
      <div className={s.h1}>Flow Images</div>
      <div className={s.sub}>Images used inside the WhatsApp flow. Hosted on Cloudinary.</div>
      {loading && <Loader />}
      {!loading && GROUPS.map((g) => (
        <div key={g.group}>
          <div className={s.grpTitle}>{g.group}</div>
          {g.note && (
            <div className={s.muted} style={{ fontSize: "0.78rem", margin: "-6px 0 12px", maxWidth: 760, lineHeight: 1.5 }}>
              {g.note}
            </div>
          )}
          <div className={s.assetGrid}>
            {g.items.map((f) => {
              const cur = assets[f.key];
              const ratio = f.aspectRatio === "8:1" ? "8 / 1" : f.aspectRatio === "1:1" ? "1 / 1" : undefined;
              return (
                <div key={f.key} className={s.assetCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "0.82rem" }}>{f.label}</strong>
                    {f.aspectRatio && f.aspectRatio !== "original" && <span className={`${s.badge} ${s.new}`}>{f.aspectRatio}</span>}
                  </div>
                  <div className={s.assetPrev} style={{ aspectRatio: ratio, minHeight: ratio ? undefined : 110, maxHeight: 220 }}>
                    {cur?.url ? <img src={cur.url} alt={f.label} /> : <span className={s.muted} style={{ fontSize: "0.78rem" }}>No image</span>}
                  </div>
                  <div className={s.row}>
                    <label className={s.btn} style={{ cursor: "pointer", flex: 1, textAlign: "center" }}>
                      {busy === f.key ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(f, file); }} />
                    </label>
                    {cur?.url && <button className={s.btnGhost} onClick={() => remove(f.key)}>✕</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {toast && <div className={s.toast}>{toast}</div>}
    </div>
  );
}
