"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import SparkleIcon from "@/components/SparkleIcon";
import {
  industriesSolutionsData,
  industriesTopBannerConfig,
  IndustrySolutionData,
} from "@/lib/industriesSolutionsData";
import styles from "./IndustriesTwoColumnLayout.module.css";

export default function IndustriesTwoColumnLayout({
  initialIndustryId,
}: {
  initialIndustryId?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    initialIndustryId || null
  );

  const activeIndustry: IndustrySolutionData | undefined = activeId
    ? industriesSolutionsData.find((item) => item.id === activeId) ||
      industriesSolutionsData[0]
    : undefined;

  const handleSelectIndustry = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToGrid = () => {
    setActiveId(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          {/* Top Banner / Hero Strip with Diagonal Ribbon Graphic (Quarter Viewport Height) */}
          <div className={styles.topBannerStrip}>
            <div className={styles.bannerRibbonBg} aria-hidden>
              <svg
                className={styles.ribbonSvg}
                viewBox="0 0 1200 450"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ribbonGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0078d4" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#00c6ff" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#9ae8ff" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a2a5e" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#0078d4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00c6ff" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                <path
                  d="M-50 400 Q 300 240, 600 320 T 1250 80 L 1250 0 L -50 0 Z"
                  fill="url(#ribbonGrad2)"
                  opacity="0.5"
                />
                <path
                  d="M-50 440 C 250 300, 480 120, 840 220 C 1020 280, 1140 160, 1250 80 L 1250 160 C 1120 260, 980 360, 800 290 C 500 180, 260 380, -50 490 Z"
                  fill="url(#ribbonGrad1)"
                />
                <path
                  d="M-50 260 Q 400 380, 900 140 T 1250 220"
                  stroke="#9ae8ff"
                  strokeWidth="2.5"
                  strokeOpacity="0.45"
                />
              </svg>
            </div>

            <div className={styles.bannerLeft}>
              <span className={styles.bannerBadge}>
                <SparkleIcon /> {industriesTopBannerConfig.badge}
              </span>
              <p className={styles.bannerTagline}>
                {industriesTopBannerConfig.tagline}
              </p>
            </div>

            <div className={styles.singleBannerImageWrap}>
              <img
                src={industriesTopBannerConfig.image}
                alt="Enterprise Industry Architecture"
                className={styles.singleBannerImg}
                loading="eager"
              />
            </div>
          </div>

          {/* Header Area (Preserved) */}
          <div className={styles.hero}>
            <div className={styles.heroBadge}>
              <span className="section-badge">
                <SparkleIcon /> INDUSTRY SOLUTIONS
              </span>
            </div>
            <h1 className={styles.heroTitle}>Industries We Serve</h1>
            <p className={styles.heroDesc}>
              Technology architectures, cloud modernization, and secure managed platforms
              shaped around the operating realities of your industry.
            </p>
          </div>

          {/* ============================================================
             LANDING VIEW: 8-INDUSTRY IMAGE CARD GRID (AVANADE STYLE)
             ============================================================ */}
          <div className={styles.landingGrid}>
            {industriesSolutionsData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.05, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/industries/${item.id}`}
                  className={styles.industryCard}
                  data-cursor="view"
                >
                  <div className={styles.industryCardImgWrap}>
                    <img
                      src={item.image}
                      alt={`${item.industryName} industry solutions`}
                      className={styles.industryCardImg}
                      loading="lazy"
                    />
                    <div className={styles.industryCardOverlay} aria-hidden />
                  </div>

                  <div className={styles.industryCardContent}>
                    <h2 className={styles.industryCardTitle}>
                      {item.industryName}
                    </h2>
                    <span className={styles.industryCardCta}>
                      Find out more <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
