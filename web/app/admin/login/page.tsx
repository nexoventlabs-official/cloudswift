"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid password");
      return;
    }
    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit}>
        <p className={styles.eyebrow}>CloudSwift Admin</p>
        <h1 className={styles.title}>Sign in</h1>
        <label className={styles.label}>
          Password
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? "…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
