"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import s from "../panel.module.css";

type Field = { key: string; label: string; type: "image" | "link"; aspectRatio?: string };
type Asset = { key: string; url?: string; type: string };

const GROUPS: { group: string; items: Field[] }[] = [
  {
    group: "Service Picker Flow",
    items: [
      { key: "welcome_header", label: "Service Picker — message header", type: "image", aspectRatio: "original" },
      { key: "welcome_banner", label: "Service Picker — in-flow banner (8:1)", type: "image", aspectRatio: "8:1" },
      { key: "icon_azure", label: "Azure — row icon (1:1)", type: "image", aspectRatio: "1:1" },
      { key: "icon_m365", label: "Microsoft 365 — row icon (1:1)", type: "image", aspectRatio: "1:1" },
      { key: "icon_managed", label: "Managed cloud — row icon (1:1)", type: "image", aspectRatio: "1:1" },
      { key: "icon_security", label: "Security — row icon (1:1)", type: "image", aspectRatio: "1:1" },
    ],
  },
  {
    group: "Message Headers",
    items: [
      { key: "a1_header", label: "Questions intro header", type: "image", aspectRatio: "original" },
      { key: "qualify_header", label: "4-question form header", type: "image", aspectRatio: "original" },
      { key: "hot_lead_header", label: "Hot lead — contact form header", type: "image", aspectRatio: "original" },
      { key: "h2_header", label: "Book / Callback / Chat header", type: "image", aspectRatio: "original" },
      { key: "calendly_header", label: "Book a call header", type: "image", aspectRatio: "original" },
      { key: "nurture_header", label: "Warm — checklist header", type: "image", aspectRatio: "original" },
      { key: "n1_header", label: "Warm — resources header", type: "image", aspectRatio: "original" },
      { key: "thank_you_header", label: "Cold — guide header", type: "image", aspectRatio: "original" },
      { key: "x1_header", label: "“Didn’t catch that” header", type: "image", aspectRatio: "original" },
      { key: "resume_header", label: "Resume nudge header", type: "image", aspectRatio: "original" },
      { key: "general_header", label: "Follow-up message header", type: "image", aspectRatio: "original" },
    ],
  },
];

export default function FlowImagesPage() {
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");

  async function load() {
    try {
      const r = await adminApi.get("/assets");
      const map: Record<string, Asset> = {};
      (r.data || []).forEach((a: Asset) => (map[a.key] = a));
      setAssets(map);
    } catch {}
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
      {GROUPS.map((g) => (
        <div key={g.group}>
          <div className={s.grpTitle}>{g.group}</div>
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
