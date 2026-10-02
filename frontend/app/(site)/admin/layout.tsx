"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/adminApi";
import { useAdminNotifications } from "@/lib/adminNotify";
import s from "./panel.module.css";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/crm", label: "CRM / Chats" },
  { href: "/admin/flow-images", label: "Flow Images" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/blogs", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    if (!getToken()) { router.replace("/admin/login"); return; }
    setReady(true);
  }, [pathname, isLogin, router]);

  // Live notifications (sound + desktop + toast + unread badge). Only polls
  // once authenticated and off the login page.
  const notifyEnabled = ready && !isLogin;
  const { totalUnread, toast, muted, setMuted } = useAdminNotifications(notifyEnabled);

  if (isLogin) return <>{children}</>;
  if (!ready) return null;

  return (
    <div className={s.wrap}>
      <aside className={s.sidebar}>
        <div className={s.brand}>
          CloudSwift
          <small>Admin</small>
        </div>
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/admin/dashboard" && pathname?.startsWith(n.href));
          const showBadge = n.href === "/admin/crm" && totalUnread > 0;
          return (
            <Link key={n.href} href={n.href} className={`${s.navLink} ${active ? s.navActive : ""}`}>
              <span>{n.label}</span>
              {showBadge && <span className={s.navBadge}>{totalUnread > 99 ? "99+" : totalUnread}</span>}
            </Link>
          );
        })}
        <div className={s.sideSpacer} />
        <button
          className={s.soundToggle}
          type="button"
          onClick={() => setMuted(!muted)}
          title={muted ? "Unmute notification sound" : "Mute notification sound"}
        >
          {muted ? "🔕 Sound off" : "🔔 Sound on"}
        </button>
        <button className={s.logout} type="button" onClick={logout}>Log out</button>
      </aside>
      <div className={s.content}>{children}</div>

      {toast && (
        <div className={s.toast} onClick={() => router.push("/admin/crm")} role="button" tabIndex={0}>
          <div className={s.toastIcon}>💬</div>
          <div className={s.toastBody}>
            <strong>{toast.title}</strong>
            <span>{toast.body}</span>
          </div>
        </div>
      )}
    </div>
  );
}
