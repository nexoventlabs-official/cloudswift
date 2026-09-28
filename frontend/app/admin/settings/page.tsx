"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import s from "../panel.module.css";

type Setting = { key: string; value: string; label: string; group: string; inputType: string; description?: string };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get("/settings").then((r) => {
      const list: Setting[] = r.data || [];
      setSettings(list);
      const map: Record<string, string> = {};
      list.forEach((x) => (map[x.key] = x.value || ""));
      setValues(map);
    }).catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    try {
      await adminApi.put("/settings", values);
      setToast("Settings saved");
    } catch (e) {
      setToast("Save failed: " + (e as Error).message);
    }
    setSaving(false);
    setTimeout(() => setToast(""), 2500);
  }

  const groups = [...new Set(settings.map((x) => x.group))];

  return (
    <div>
      <div className={s.headRow}>
        <div>
          <div className={s.h1}>Settings</div>
          <div className={s.sub}>System configuration. Changes take effect immediately.</div>
        </div>
        <button className={s.btn} onClick={save} disabled={saving}>{saving ? "Saving…" : "Save all"}</button>
      </div>

      {groups.map((g) => (
        <div key={g} style={{ marginBottom: 26, maxWidth: 640 }}>
          <div className={s.grpTitle} style={{ marginTop: 0 }}>{g}</div>
          {settings.filter((x) => x.group === g).map((x) => (
            <div key={x.key} style={{ marginBottom: 14 }}>
              <label className={s.muted} style={{ display: "block", marginBottom: 6, color: "#e6edf6" }}>{x.label}</label>
              {x.inputType === "textarea" ? (
                <textarea className={s.textarea} value={values[x.key] || ""} onChange={(e) => setValues({ ...values, [x.key]: e.target.value })} />
              ) : (
                <input className={s.input} value={values[x.key] || ""} onChange={(e) => setValues({ ...values, [x.key]: e.target.value })} />
              )}
              <div className={s.muted} style={{ fontSize: "0.72rem", marginTop: 3, fontFamily: "monospace" }}>{x.key}</div>
            </div>
          ))}
        </div>
      ))}
      {settings.length === 0 && <p className={s.muted}>Loading…</p>}
      {toast && <div className={s.toast}>{toast}</div>}
    </div>
  );
}
