"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/adminApi";
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
          return (
            <Link key={n.href} href={n.href} className={`${s.navLink} ${active ? s.navActive : ""}`}>
              {n.label}
            </Link>
          );
        })}
        <div className={s.sideSpacer} />
        <button className={s.logout} type="button" onClick={logout}>Log out</button>
      </aside>
      <div className={s.content}>{children}</div>
    </div>
  );
}
