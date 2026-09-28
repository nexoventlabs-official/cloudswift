"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import Loader from "@/components/Loader";
import s from "../panel.module.css";

type Stats = {
  totalLeads: number; hotLeads: number; warmLeads: number; coldLeads: number;
  wonLeads: number; newToday: number; totalConvs: number; unreadConvs: number; totalMessages: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminApi.get("/admin/stats").then((r) => setStats(r.stats)).catch((e) => setErr(e.message));
  }, []);

  const cards = stats
    ? [
        { n: stats.totalLeads, l: "Total Leads" },
        { n: stats.hotLeads, l: "Hot Leads" },
        { n: stats.warmLeads, l: "Warm Leads" },
        { n: stats.coldLeads, l: "Cold Leads" },
        { n: stats.newToday, l: "New Today" },
        { n: stats.wonLeads, l: "Won" },
        { n: stats.totalConvs, l: "Conversations" },
        { n: stats.unreadConvs, l: "Unread" },
        { n: stats.totalMessages, l: "Messages" },
      ]
    : [];

  return (
    <div>
      <div className={s.h1}>Dashboard</div>
      <div className={s.sub}>Live overview of your WhatsApp lead pipeline.</div>
      {err && <p className={s.muted}>Could not load stats: {err}</p>}
      {!stats && !err && <Loader />}
      <div className={s.cards}>
        {cards.map((c) => (
          <div key={c.l} className={s.statCard}>
            <div className={s.statNum}>{c.n}</div>
            <div className={s.statLabel}>{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
