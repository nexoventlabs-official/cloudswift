"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

const API = (process.env.NEXT_PUBLIC_API_BASE ?? "https://cloudswift.onrender.com/api").replace(/\/$/, "");
const TOKEN_KEY = "cs_admin_token";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok || !data?.token) {
        setError(data?.message || "Invalid username or password");
        return;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      router.push("/admin/blogs");
    } catch {
      setLoading(false);
      setError("Could not reach the server. Try again.");
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit}>
        <p className={styles.eyebrow}>CloudSwift Admin</p>
        <h1 className={styles.title}>Sign in</h1>
        <label className={styles.label}>
          Username
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
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
