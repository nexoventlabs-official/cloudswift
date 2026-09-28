"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("cs_admin_token") : null;
    router.replace(token ? "/admin/blogs" : "/admin/login");
  }, [router]);
  return null;
}
