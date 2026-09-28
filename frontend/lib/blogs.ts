import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

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
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "blogs.json");

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    const seed: BlogPost[] = [
      {
        id: randomUUID(),
        slug: "azure-finops-quick-wins",
        title: "Azure FinOps Quick Wins for Mid-Size Estates",
        excerpt:
          "Practical cost controls we roll out in the first 30 days of an Azure managed engagement — without slowing delivery teams.",
        content: `## Why FinOps stalls

Most Azure bills grow because nobody owns tagging, rightsizing, or idle resources.

## What we do first

1. Enforce a tagging baseline (owner, env, cost-center).
2. Rightsize obvious over-provisioned VMs and disks.
3. Turn on budgets + anomaly alerts in Cost Management.
4. Review reservations only after usage stabilizes.

## Result

Clients typically see clear visibility within two weeks and measurable savings inside the first quarter — without risky “big bang” cuts.`,
        category: "FinOps",
        author: "CloudSwift Engineering",
        coverImage: "/images/aerolink.jpg",
        published: true,
        publishedAt: "2025-11-12",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seoTitle: "Azure FinOps Quick Wins | CloudSwift",
        seoDescription:
          "Field notes on Azure cost controls CloudSwift applies in the first 30 days of managed engagements.",
      },
      {
        id: randomUUID(),
        slug: "zero-downtime-ad-migration-lessons",
        title: "Lessons From a Multi-Region Active Directory Migration",
        excerpt:
          "What actually mattered when migrating AD across many regions with near-zero disruption.",
        content: `## Context

Large directory estates fail migrations when cutover planning is vague.

## What worked

- Native Microsoft tooling over DIY scripts where possible
- Region-by-region pilots before global cutover
- Clear rollback criteria and communication windows
- Post-migration Group Policy cleanup as a deliberate phase

## Takeaway

Treat identity as a program, not a weekend project — especially across 10+ regions.`,
        category: "Cloud Migration",
        author: "CloudSwift Engineering",
        coverImage: "/images/driveon.jpg",
        published: true,
        publishedAt: "2025-09-03",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        slug: "enterprise-ai-readiness-checklist",
        title: "Enterprise AI Readiness Checklist",
        excerpt:
          "Data, security, and ops checks before you pilot ChatGPT-style assistants on company knowledge.",
        content: `## Before the pilot

- Data classification and access boundaries
- Grounding sources you can actually audit
- Human escalation paths
- Cost controls on model usage

## CloudSwift approach

We start with an AI readiness assessment, then narrow to one high-ROI agent use case — support, knowledge, or workflow — before scaling.`,
        category: "AI",
        author: "CloudSwift AI Team",
        coverImage: "/images/courto.jpg",
        published: true,
        publishedAt: "2026-01-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(DATA_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readBlogs(): Promise<BlogPost[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as BlogPost[];
}

async function writeBlogs(posts: BlogPost[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(posts, null, 2), "utf8");
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function getPublishedBlogs() {
  const posts = await readBlogs();
  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getBlogBySlug(slug: string, includeDraft = false) {
  const posts = await readBlogs();
  return posts.find(
    (p) => p.slug === slug && (includeDraft || p.published)
  );
}

export async function upsertBlog(
  input: Partial<BlogPost> & { title: string }
): Promise<BlogPost> {
  const posts = await readBlogs();
  const now = new Date().toISOString();

  if (input.id) {
    const idx = posts.findIndex((p) => p.id === input.id);
    if (idx === -1) throw new Error("Post not found");
    const updated: BlogPost = {
      ...posts[idx],
      ...input,
      title: input.title,
      slug: input.slug || posts[idx].slug,
      updatedAt: now,
    };
    posts[idx] = updated;
    await writeBlogs(posts);
    return updated;
  }

  const slug = input.slug || slugify(input.title);
  const post: BlogPost = {
    id: randomUUID(),
    slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: input.content || "",
    category: input.category || "Cloud Migration",
    author: input.author || "CloudSwift",
    coverImage: input.coverImage || "/images/aerolink.jpg",
    published: Boolean(input.published),
    publishedAt: input.publishedAt || now.slice(0, 10),
    createdAt: now,
    updatedAt: now,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  };
  posts.unshift(post);
  await writeBlogs(posts);
  return post;
}

export async function deleteBlog(id: string) {
  const posts = await readBlogs();
  const next = posts.filter((p) => p.id !== id);
  await writeBlogs(next);
}
