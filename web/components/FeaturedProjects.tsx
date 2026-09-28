"use client";
import { useRef } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import styles from "./FeaturedProjects.module.css";

/** Edit topic imagery, names, definitions, or links here. */
export const topics = [
  {
    slug: "amazon-web-services",
    image: "/images/brand/aws.svg",
    name: "AWS",
    definition: "Cloud infrastructure, migration, and managed services on Amazon Web Services.",
    href: "/solutions/amazon-web-services",
  },
  {
    slug: "google-cloud-platform",
    image: "/images/brand/gcp.svg",
    name: "GCP",
    definition: "Scalable cloud solutions and data services on Google Cloud Platform.",
    href: "/solutions/google-cloud-platform",
  },
  {
    slug: "microsoft-azure",
    image: "/images/brand/azure.svg",
    name: "Azure",
    definition: "Enterprise-grade cloud infrastructure and services on Microsoft Azure.",
    href: "/solutions/microsoft-azure",
  },
  {
    slug: "ai-services",
    image: "/images/cs/services/ai.webp",
    name: "AI Services",
    definition: "AI-driven automation, intelligent workflows, and machine learning solutions.",
    href: "/ai-services",
  },
] as const;

export default function FeaturedProjects() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className={styles.section}>
      <GridBackground subtle />
      <div className={styles.header} ref={headerRef}>
        <div className={styles.headerLeft}>
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-badge">
              <SparkleIcon /> WHAT WE RUN
            </span>
          </motion.div>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Platforms we migrate and manage day-to-day —
            <br />
            AWS, GCP, Azure, and AI Services — connected to one operating model
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Link href="/solutions" className="link-btn">
            see all solutions <span className="arrow">↗</span>
          </Link>
        </motion.div>
      </div>

      <div className={styles.stack}>
        {topics.map((topic, i) => (
          <StickyProjectCard
            key={topic.slug}
            topic={topic}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

function StickyProjectCard({
  topic,
  index,
}: {
  topic: (typeof topics)[number];
  index: number;
}) {
  const isFullImage = topic.slug === "ai-services";

  return (
    <div
      className={`${styles.topicRow} ${index % 2 ? styles.topicRowReverse : ""}`}
    >
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, x: index % 2 ? 90 : -90, scale: 0.94 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, delay: index * 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={topic.href}
          className={styles.cardLink}
          data-cursor="view"
        >
          <div className={styles.cardFace}>
            {isFullImage ? (
              <>
                <Image
                  src={topic.image}
                  alt={topic.name}
                  fill
                  className={styles.fullBgImage}
                  sizes="(max-width: 809px) 100vw, 560px"
                />
                <div className={styles.fullImageOverlay} aria-hidden />
              </>
            ) : (
              <>
                <div
                  className={styles.glow}
                  style={{ background: "radial-gradient(ellipse at 50% 38%, rgba(77, 190, 255, 0.32) 0%, transparent 58%), radial-gradient(ellipse at 80% 80%, rgba(21, 68, 125, 0.9) 0%, #0a1a38 70%)" }}
                  aria-hidden
                />
                <div className={styles.orb} aria-hidden />

                <div className={styles.logoStage}>
                  <Image src={topic.image} alt="" width={220} height={120} className={styles.logo} />
                </div>
              </>
            )}

            <div className={styles.caption}>
              <span className={styles.cardTitle}>{topic.name}</span>
              <span className={styles.cardCategory}>Explore service</span>
            </div>
          </div>
        </Link>
      </motion.div>
      <motion.p
        className={styles.definition}
        initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.16 + 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {topic.definition}
      </motion.p>
    </div>
  );
}
