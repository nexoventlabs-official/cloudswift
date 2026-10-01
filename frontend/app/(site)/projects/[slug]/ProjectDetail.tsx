"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import styles from "./ProjectDetail.module.css";

type Project = {
  slug: string;
  title: string;
  category: string;
  date: string;
  industry: string;
  scopeOfWork: string;
  duration: string;
  description: string;
  challenge: string;
  goal: string;
  solution: string;
  coverImage: string;
  logoImage: string;
  logo: string;
  websiteUrl: string;
  color: string;
};

export default function ProjectDetail({
  project,
  related,
}: {
  project: Project;
  related: Project[];
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
              transition={{ duration: 0.6 }}
            >
              {project.date}
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
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <Link href={project.websiteUrl} className={styles.visitBtn}>
                visit website <span>↗</span>
              </Link>
            </motion.div>
          </div>

          <div className={styles.heroRight}>
            <motion.div
              className={styles.bigLogo}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Image
                src={project.logoImage}
                alt={project.title}
                width={320}
                height={90}
                className={styles.bigLogoImg}
              />
            </motion.div>

            <motion.div
              className={styles.meta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <div className={styles.metaRow}>
                <hr className={styles.metaSep} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Industry</span>
                  <span className={styles.metaValue}>{project.industry}</span>
                </div>
              </div>
              <div className={styles.metaRow}>
                <hr className={styles.metaSep} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Scope of work</span>
                  <span className={styles.metaValue}>{project.scopeOfWork}</span>
                </div>
              </div>
              <div className={styles.metaRow}>
                <hr className={styles.metaSep} />
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Duration</span>
                  <span className={styles.metaValue}>{project.duration}</span>
                </div>
              </div>
              <hr className={styles.metaSep} />
            </motion.div>
          </div>
        </section>

        <div className={styles.cover}>
          <div className={styles.coverImg}>
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className={styles.coverPhoto}
              sizes="100vw"
              priority
            />
            <div className={styles.coverLogoOverlay}>
              <Image
                src={project.logoImage}
                alt=""
                width={220}
                height={64}
                className={styles.coverLogo}
              />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.contentGrid}>
            <section className={styles.textSection}>
              <h2 className={styles.sectionTitle}>Challenge</h2>
              <p className={styles.sectionText}>{project.challenge}</p>
            </section>
            <section className={styles.textSection}>
              <h2 className={styles.sectionTitle}>Goal</h2>
              <p className={styles.sectionText}>{project.goal}</p>
            </section>
          </div>
          <section className={styles.textSection} style={{ marginTop: 60 }}>
            <h2 className={styles.sectionTitle}>Solution</h2>
            <p className={styles.sectionText}>{project.solution}</p>
          </section>
        </div>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Related Projects</h2>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className={styles.relatedCard}
                  data-cursor="view"
                >
                  <div className={styles.relatedImg}>
                    <Image
                      src={r.coverImage}
                      alt={r.title}
                      fill
                      className={styles.relatedPhoto}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className={styles.relatedLogoOverlay}>
                      <Image
                        src={r.logoImage}
                        alt={r.title}
                        width={160}
                        height={48}
                        className={styles.relatedLogo}
                      />
                    </div>
                  </div>
                  <div className={styles.relatedInfo}>
                    <span>{r.title}</span>
                    <span className={styles.relatedCat}>{r.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
