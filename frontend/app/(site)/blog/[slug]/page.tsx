import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import type { Metadata } from "next";
import styles from "../../solutions/SolutionsGrid.module.css";
import blogStyles from "../blog.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

function renderContent(md: string) {
  // Minimal markdown: ## headings + paragraphs + lists
  return md
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (t.startsWith("## ")) return `<h2>${t.slice(3)}</h2>`;
      if (/^\d+\.\s/m.test(t)) {
        const items = t
          .split(/\n/)
          .map((l) => l.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean)
          .map((l) => `<li>${l}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }
      if (t.startsWith("- ")) {
        const items = t
          .split(/\n/)
          .map((l) => l.replace(/^-+\s*/, "").trim())
          .filter(Boolean)
          .map((l) => `<li>${l}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${t}</p>`;
    })
    .join("");
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedBlogs())
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <section className={styles.page}>
        <article className={blogStyles.article}>
          <div className={blogStyles.meta}>
            <span>{post.category}</span>
            <span>{post.publishedAt}</span>
            <span>{post.author}</span>
          </div>
          <h1 className={blogStyles.title}>{post.title}</h1>
          <div className={blogStyles.cover}>
            <Image
              src={post.coverImage}
              alt=""
              fill
              style={{ objectFit: "cover" }}
              sizes="760px"
              priority
            />
          </div>
          <div
            className={blogStyles.body}
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {related.length > 0 && (
            <div className={blogStyles.related}>
              <h2 className={blogStyles.relatedTitle}>Related posts</h2>
              <div className={blogStyles.relatedList}>
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className={blogStyles.relatedLink}
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
      <Footer />
    </>
  );
}
