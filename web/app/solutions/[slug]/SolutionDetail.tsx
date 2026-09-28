"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import TemplateMedia, { toneForCategory } from "@/components/TemplateMedia";
import CapabilityFlowchart from "@/components/CapabilityFlowchart";
import AWSJourney from "@/components/AWSJourney";
import GCPJourney from "@/components/GCPJourney";
import AzureEcosystem from "@/components/AzureEcosystem";
import AIServiceTimeline from "@/components/AIServiceTimeline";
import styles from "./SolutionDetail.module.css";

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
  capabilities?: string[];
  capabilityDescs?: Record<string, string>;
  capabilityIcons?: Record<string, string>;
  ambientIcons?: string[];
  steps?: string[];
  stepDescs?: Record<string, string>;
  coverImage: string;
  logoImage: string;
  logo: string;
  websiteUrl: string;
  color: string;
};

export default function SolutionDetail({
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
            {project.slug === "amazon-web-services" ? (
              <AWSJourney />
            ) : project.slug === "google-cloud-platform" ? (
              <GCPJourney />
            ) : project.slug === "microsoft-azure" ? (
              <AzureEcosystem />
            ) : project.slug === "ai-services" ? (
              <AIServiceTimeline
                capabilities={project.capabilities ?? []}
                descriptions={project.capabilityDescs}
                icons={project.capabilityIcons}
                centerLabel={project.title}
              />
            ) : (
              <CapabilityFlowchart
                capabilities={project.capabilities ?? []}
                capabilityIcons={project.capabilityIcons}
                ambientIcons={project.ambientIcons}
                centerLabel={project.title}
              />
            )}
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

          {project.capabilities && project.capabilities.length > 0 && (
            <section className={styles.textSection} style={{ marginTop: 60 }}>
              <h2 className={styles.sectionTitle}>Capabilities</h2>
              <ul style={{ paddingLeft: "1.2rem", color: "rgba(255, 255, 255, 0.75)", fontWeight: 300, lineHeight: 1.7 }}>
                {project.capabilities.map((c, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <strong style={{ color: "#fff" }}>{c}</strong>
                    {project.capabilityDescs?.[c] && (
                      <p style={{ margin: "4px 0 0", opacity: 0.75 }}>
                        {project.capabilityDescs[c]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Related Solutions</h2>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/solutions/${r.slug}`}
                  className={styles.relatedCard}
                  data-cursor="view"
                >
                  <div className={styles.relatedImg}>
                    <TemplateMedia
                      src={null}
                      alt={r.title}
                      tone={toneForCategory(r.category, r.title)}
                      logo={r.logoImage}
                      title={r.title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
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
