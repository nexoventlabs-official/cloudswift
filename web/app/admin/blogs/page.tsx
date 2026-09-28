"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blogs";
import { blogCategories } from "@/lib/data";
import styles from "../admin.module.css";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  category: blogCategories[0],
  author: "CloudSwift Engineering",
  coverImage: "/images/aerolink.jpg",
  published: false,
  publishedAt: new Date().toISOString().slice(0, 10),
  seoTitle: "",
  seoDescription: "",
};

export default function AdminBlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<(typeof empty & { id?: string; slug?: string }) | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/blogs?all=1");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    setPosts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function save() {
    if (!editing?.title) return;
    setError("");
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/blogs/${editing.id}` : "/api/blogs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    await load();
  }

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return;
    const data = await res.json();
    setEditing((e) => (e ? { ...e, coverImage: data.url } : e));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.top}>
        <div>
          <p className={styles.eyebrow}>CloudSwift Admin</p>
          <h1 className={styles.title}>Blog management</h1>
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} type="button" onClick={() => setEditing({ ...empty })}>
            New post
          </button>
          <Link href="/blog" className={styles.ghost}>
            View blog
          </Link>
          <button className={styles.ghost} type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {editing ? (
        <div className={styles.formGrid}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Excerpt
            <textarea
              className={styles.textarea}
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Content (markdown-ish)
            <textarea
              className={styles.textarea}
              style={{ minHeight: 280 }}
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Category
            <select
              className={styles.select}
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            >
              {blogCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Author
            <input
              className={styles.input}
              value={editing.author}
              onChange={(e) => setEditing({ ...editing, author: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Publish date
            <input
              type="date"
              className={styles.input}
              value={editing.publishedAt}
              onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Cover image URL
            <input
              className={styles.input}
              value={editing.coverImage}
              onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            Upload cover
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
          </label>
          <label className={styles.label}>
            SEO title
            <input
              className={styles.input}
              value={editing.seoTitle || ""}
              onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
            />
          </label>
          <label className={styles.label}>
            SEO description
            <input
              className={styles.input}
              value={editing.seoDescription || ""}
              onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
            />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={editing.published}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
            />
            Published
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button className={styles.btn} type="button" onClick={save}>
              Save
            </button>
            <button className={styles.ghost} type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((p) => (
            <div key={p.id} className={styles.row}>
              <div>
                <strong>{p.title}</strong>
                <div className={styles.rowMeta}>
                  {p.published ? "Published" : "Draft"} · {p.category} · {p.publishedAt}
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.ghost}
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...empty,
                      ...p,
                      seoTitle: p.seoTitle || "",
                      seoDescription: p.seoDescription || "",
                    })
                  }
                >
                  Edit
                </button>
                <button className={styles.ghost} type="button" onClick={() => remove(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
