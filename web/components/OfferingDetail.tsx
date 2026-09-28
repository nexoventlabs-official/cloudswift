"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import TemplateMedia, { toneForCategory } from "@/components/TemplateMedia";
import type { OfferingItem } from "@/lib/catalog";
import styles from "@/app/solutions/[slug]/SolutionDetail.module.css";
import local from "./OfferingDetail.module.css";

export default function OfferingDetail({
  item,
  category,
  basePath,
  related,
}: {
  item: OfferingItem;
  category: string;
  basePath: string;
  related: (OfferingItem & { category?: string })[];
}) {
  return (
    <>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <motion.p
              className={styles.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {category}
            </motion.p>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <Link href="/contact" className={styles.visitBtn}>
                book a consultation <span>↗</span>
              </Link>
            </motion.div>
          </div>

          <div className={styles.heroRight}>
            <motion.div
              className={
                item.imageFit === "contain"
                  ? local.heroImageContain
                  : local.heroImage
              }
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <TemplateMedia
                src={item.image}
                alt={item.title}
                fit={item.imageFit}
                tone={toneForCategory(category, item.title)}
                title={item.image ? undefined : item.title}
                sizes="560px"
                priority
              />
            </motion.div>
          </div>
        </section>

        <section className={local.content}>
          <p className={local.lead}>{item.desc}</p>
          {item.detailedContent && (
            <p className={local.body}>{item.detailedContent}</p>
          )}

          {item.capabilities.length > 0 && (
            <div className={local.block}>
              <h2>Capabilities</h2>
              <ul>
                {item.capabilities.map((c, i) => (
                  <li key={i}>
                    <strong>{c}</strong>
                    {item.capabilityDescs?.[c] && (
                      <p style={{ margin: "4px 0 0", opacity: 0.75 }}>
                        {item.capabilityDescs[c]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.steps.length > 0 && (
            <div className={local.block}>
              <h2>How we deliver</h2>
              <ol>
                {item.steps.map((s, i) => (
                  <li key={i}>
                    <strong>{s}</strong>
                    {item.stepDescs?.[s] && (
                      <p style={{ margin: "4px 0 0", opacity: 0.75 }}>
                        {item.stepDescs[s]}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className={local.tags}>
              {item.tags.map((t) => (
                <span key={t} className={local.tag}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className={local.related}>
              <h2>Related offerings</h2>
              <div className={local.relatedList}>
                {related.map((r) => (
                  <Link key={r.id} href={r.href ?? `${basePath}/${r.id}`} className={local.relatedLink}>
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
