"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import SparkleIcon from "@/components/SparkleIcon";
import type { Industry } from "@/lib/industries";
import styles from "./IndustriesCatalog.module.css";

export default function IndustriesCatalog({
  industries,
}: {
  industries: Industry[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <section className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadgeWrap}>
              <motion.span
                className="section-badge"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SparkleIcon /> INDUSTRIES
              </motion.span>
              <motion.span
                className={styles.heroYear}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                {industries.length} industries we serve
              </motion.span>
            </div>

            <div className={styles.heroArrow} aria-hidden>
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
              Industries
            </motion.h1>
          </div>

          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            Technology solutions shaped around the operating realities, customers, and compliance needs of your industry.
          </motion.p>
        </div>

        <div className={styles.introSection}>
          <div className={styles.introLeft}>
            <p className={styles.introKicker}>
              <span>01</span>
              <span>/</span>
              <span>SECTOR SOLUTIONS</span>
            </p>
            <h2 className={styles.introHeading}>Explore your industry</h2>
            <p className={styles.introCopy}>
              See how our industry specialists architect, secure, and operate enterprise technology platforms to address the biggest opportunities in your sector.
            </p>
          </div>
          <p className={styles.introCount}>
            {industries.length} {industries.length === 1 ? "industry" : "industries"}
          </p>
        </div>

        <div className={styles.grid} ref={ref}>
          {industries.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: Math.min(i * 0.06, 0.6),
              }}
            >
              <Link
                href={`/industries/${item.id}`}
                className={styles.card}
                data-cursor="view"
              >
                <div className={styles.cardImg}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.title} industry solutions`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : null}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardCategory}>Industry</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardExcerpt}>{item.desc}</p>
                  <span className={styles.cardCta}>
                    Explore industry <span aria-hidden>↗</span>
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
