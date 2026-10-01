"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TemplateMedia, { toneForCategory } from "@/components/TemplateMedia";
import type { BlogPost } from "@/lib/blogs";
import styles from "../solutions/SolutionsGrid.module.css";
import blogStyles from "./blog.module.css";

export default function BlogListing({ posts }: { posts: BlogPost[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <section className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <motion.p
              className={styles.heroYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Resources
            </motion.p>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Blog
            </motion.h1>
          </div>
          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            Migration playbooks, cost teardowns, AI rollout guides, and
            hard-won lessons from our engineering team.
          </motion.p>
        </div>

        <div className={styles.grid} ref={ref}>
          {posts.length === 0 && (
            <p className={blogStyles.empty}>
              New articles are on the way. Check back soon…
            </p>
          )}
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 100, rotate: 3 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 22,
                delay: i * 0.08,
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className={styles.card}
                data-cursor="view"
              >
                <div className={styles.cardImg}>
                  <TemplateMedia
                    src={post.coverImage}
                    alt={post.title}
                    tone={toneForCategory(post.category, post.title)}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCategory}>
                    {post.category} · {post.publishedAt}
                  </span>
                  <span className={styles.cardTitle}>{post.title}</span>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <span className={styles.cardCta}>
                    Read article <span aria-hidden>↗</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
