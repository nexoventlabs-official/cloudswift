"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TemplateMedia, { toneForCategory } from "@/components/TemplateMedia";
import type { OfferingCategory } from "@/lib/catalog";
import styles from "@/app/solutions/SolutionsGrid.module.css";
import local from "./OfferingCatalog.module.css";

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function OfferingCatalog({
  title,
  yearLabel,
  description,
  basePath,
  categories,
  ctaLabel = "View offering",
}: {
  title: string;
  yearLabel: string;
  description: string;
  basePath: string;
  categories: OfferingCategory[];
  ctaLabel?: string;
}) {
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
              transition={{ duration: 0.7 }}
            >
              {yearLabel}
            </motion.p>

            <div className={styles.heroArrow}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path
                  d="M0 50 L50 0"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M0 0 L0 50"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {title}
            </motion.h1>
          </div>

          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            {description}
          </motion.p>
        </div>

        <nav className={local.cats} aria-label={`${title} categories`}>
          {categories.map((cat) => (
            <a
              key={cat.category}
              href={`#cat-${slugify(cat.category)}`}
              className={local.catLink}
            >
              {cat.category}
              <span className={local.catLinkCount}>{cat.items.length}</span>
            </a>
          ))}
        </nav>

        <div ref={ref}>
          {categories.map((cat, gi) => (
            <section
              key={cat.category}
              id={`cat-${slugify(cat.category)}`}
              className={local.group}
            >
              <div className={local.groupHead}>
                <div className={local.groupCopy}>
                  {cat.heading ? (
                    <>
                      <p className={local.catKicker}>
                        <span className={local.catIndex}>
                          {String(gi + 1).padStart(2, "0")}
                        </span>
                        {cat.category}
                      </p>
                      <h2 className={local.catTitle}>{cat.heading}</h2>
                      {cat.lede ? (
                        <p className={local.catLede}>{cat.lede}</p>
                      ) : null}
                    </>
                  ) : (
                    <h2 className={local.catTitle}>
                      <span className={local.catIndex}>
                        {String(gi + 1).padStart(2, "0")}
                      </span>
                      {cat.category}
                    </h2>
                  )}
                </div>
                <p className={local.catCount}>
                  {cat.items.length}{" "}
                  {cat.items.length === 1 ? "offering" : "offerings"}
                </p>
              </div>

              <div className={`${styles.grid} ${local.grid}`}>
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 100, rotate: 3 }}
                    animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 22,
                      delay: Math.min((gi * 0.12) + i * 0.06, 0.7),
                    }}
                  >
                    <Link
                      href={item.href ?? `${basePath}/${item.id}`}
                      className={styles.card}
                      data-cursor="view"
                    >
                      <div
                        className={
                          item.imageFit === "contain"
                            ? local.cardImgContain
                            : styles.cardImg
                        }
                      >
                        <TemplateMedia
                          src={item.image}
                          alt={item.title}
                          fit={item.imageFit}
                          tone={toneForCategory(cat.category, item.title)}
                          sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                      </div>
                      <div className={styles.cardBody}>
                        <span className={styles.cardCategory}>{cat.category}</span>
                        <span className={styles.cardTitle}>{item.title}</span>
                        <p className={styles.cardExcerpt}>{item.desc}</p>
                        <span className={styles.cardCta}>
                          {ctaLabel} <span aria-hidden>↗</span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
