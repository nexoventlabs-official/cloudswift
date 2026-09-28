"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import Footer from "@/components/Footer";
import styles from "./ProjectsGrid.module.css";

export default function ProjectsGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <section className={styles.page}>
        <div className={styles.watermark} aria-hidden>
          <Image
            src="/images/ECLkLg5RgPNIpuszaIwR2Zv0.png"
            alt=""
            width={2642}
            height={553}
            className={styles.watermarkImg}
            sizes="(max-width: 1800px) 100vw, 1800px"
          />
        </div>

        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <motion.p
              className={styles.heroYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              (2016-25©)
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
              Projects
            </motion.h1>
          </div>

          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            From motion branding to title sequences, to dynamic 3D and crafted
            2D animation, this selection reflects my broad range of projects.
          </motion.p>
        </div>

        <div className={styles.grid} ref={ref}>
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 100, rotate: 3 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 22,
                delay: i * 0.08,
              }}
            >
              <Link href={`/projects/${project.slug}`} className={styles.card} data-cursor="view">
                <div className={styles.cardImg}>
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className={styles.cover}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={styles.logoWrap}>
                    <Image
                      src={project.logoImage}
                      alt={project.title}
                      width={240}
                      height={70}
                      className={styles.logoImg}
                    />
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className={styles.cardCategory}>{project.category}</span>
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
