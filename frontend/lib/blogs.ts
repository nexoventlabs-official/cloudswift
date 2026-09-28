/**
 * Blog data now lives in the CloudSwift backend (MongoDB).
 * These helpers fetch from the backend API — no local file storage.
 */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  published: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const BACKEND = (process.env.BACKEND_API_BASE ?? "https://cloudswift.onrender.com/api").replace(/\/$/, "");

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BACKEND}/blog`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${BACKEND}/blog/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return undefined;
    return (await res.json()) as BlogPost;
  } catch {
    return undefined;
  }
}
