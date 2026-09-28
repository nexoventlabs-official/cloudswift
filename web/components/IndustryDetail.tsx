"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import SparkleIcon from "@/components/SparkleIcon";
import type { Industry } from "@/lib/industries";
import {
  findIndustrySolution,
  IndustrySolutionData,
} from "@/lib/industriesSolutionsData";
import styles from "./IndustryDetail.module.css";

export default function IndustryDetail({ industry }: { industry: Industry }) {
  const solutionData: IndustrySolutionData | undefined = findIndustrySolution(
    industry.id
  );

  const heroImg = solutionData?.heroImage || industry.image || "/images/cs/services/manufacturing.webp";
  const revolutionHeading =
    solutionData?.revolutionHeading || `Accelerate the ${industry.title} revolution`;
  const revolutionParagraphs =
    solutionData?.revolutionParagraphs || industry.overview;
  const revolutionImg =
    solutionData?.revolutionImage || industry.image || "/images/cs/services/system integration service- resized.webp";

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Top Nav / Breadcrumbs & Back to all industries */}
          <div className={styles.topNav}>
            <Link href="/industries" className={styles.backBtn}>
              <span aria-hidden>&larr;</span> Back to all industries
            </Link>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/industries">Industries</Link>
              <span>/</span>
              <span className={styles.breadcrumbActive}>{industry.title}</span>
            </div>
          </div>

          {/* 1. HERO BANNER WITH OVERLAID BOTTOM-LEFT CARD */}
          <motion.div
            className={styles.heroBannerWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={heroImg}
              alt={`${industry.title} digital transformation`}
              className={styles.heroBannerImg}
              loading="eager"
            />
            <div className={styles.heroBannerOverlay} aria-hidden />

            <motion.div
              className={styles.heroOverlayCard}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className={styles.heroOverlayBadge}>
                <SparkleIcon /> {industry.title.toUpperCase()} SOLUTIONS
              </span>
              <h1 className={styles.heroOverlayTitle}>{industry.title}</h1>
              <p className={styles.heroOverlayDesc}>{industry.desc}</p>
              <div className={styles.heroOverlayActions}>
                <Link href="/contact" className={styles.primaryBtn}>
                  Talk to an expert <span aria-hidden>&rarr;</span>
                </Link>
                <a href="#solutions" className={styles.secondaryBtn}>
                  Explore solutions <span aria-hidden>&darr;</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* 2. SECTION NAVIGATION ROW */}
          <nav className={styles.sectionNavRow} aria-label="Section Navigation">
            <a href="#overview" className={styles.sectionNavLink}>
              Overview
            </a>
            <a href="#solutions" className={styles.sectionNavLink}>
              Solutions &amp; Capabilities
            </a>
            <a href="#impact" className={styles.sectionNavLink}>
              Enterprise Impact
            </a>
          </nav>

          {/* 3. ACCELERATE THE REVOLUTION SECTION */}
          <section id="overview" className={styles.revolutionSection}>
            <div className={styles.revolutionGrid}>
              <div className={styles.revolutionLeft}>
                <div className={styles.sectionKicker}>
                  <SparkleIcon />
                  <span>OPERATING CONTEXT</span>
                </div>
                <h2 className={styles.revolutionHeading}>{revolutionHeading}</h2>
                <div className={styles.revolutionParagraphs}>
                  {revolutionParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className={styles.revolutionRight}>
                <div className={styles.revolutionImgCard}>
                  <img
                    src={revolutionImg}
                    alt={`${industry.title} ecosystem`}
                    className={styles.revolutionImg}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. OUR SOLUTIONS TWO-COLUMN SECTION */}
          <section id="solutions" className={styles.solutionsSection}>
            <div className={styles.twoColSection}>
              {/* Left Column */}
              <div className={styles.twoColLeft}>
                <div className={styles.sectionKicker}>
                  <SparkleIcon />
                  <span>CAPABILITIES</span>
                </div>
                <h2 className={styles.twoColHeading}>
                  {solutionData ? solutionData.heading : `Our ${industry.title} solutions`}
                </h2>
                <h3 className={styles.twoColSubHeading}>
                  {solutionData ? solutionData.subHeading : industry.solutionsIntro}
                </h3>

                <ul className={styles.twoColSubTopics}>
                  {(solutionData?.subTopics || industry.capabilities).map((topic, i) => (
                    <li key={i} className={styles.subTopicRow}>
                      <span className={styles.subTopicDot} aria-hidden />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.twoColCtaWrap}>
                  <Link href="/contact" className={styles.consultLink}>
                    Talk to a {industry.title} architect <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Right Column */}
              <div className={styles.twoColRight}>
                <h3 className={styles.rightSubHeadingTitle}>
                  {solutionData ? solutionData.subHeading : industry.solutionsIntro}
                </h3>

                <div className={styles.cardsStack}>
                  {(solutionData?.cards || []).map((card) => (
                    <Link
                      key={card.id}
                      href={card.href}
                      className={styles.horizontalCard}
                      data-cursor="view"
                    >
                      <div className={styles.cardThumb}>
                        <img
                          src={card.image}
                          alt={card.title}
                          className={styles.cardThumbImg}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <h4 className={styles.cardHeading}>
                          {card.title}
                        </h4>
                        <p className={styles.cardDescription}>{card.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. ENTERPRISE IMPACT & PROOF POINTS */}
          <section id="impact" className={styles.metricsSection}>
            <div className={styles.sectionKicker}>
              <SparkleIcon />
              <span>ENTERPRISE IMPACT</span>
            </div>
            <h2 className={styles.twoColHeading}>Our industry expertise</h2>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>99.97%</span>
                <span className={styles.metricLabel}>
                  Production SLA uptime across mission-critical {industry.title.toLowerCase()} workloads
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>15 min</span>
                <span className={styles.metricLabel}>
                  Critical response time SLA with 24/7/365 global monitoring
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>100%</span>
                <span className={styles.metricLabel}>
                  Regulatory &amp; compliance alignment (SOC 2, ISO 27001, DPDP, CERT-In)
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>450+</span>
                <span className={styles.metricLabel}>
                  Enterprises supported across India, the Middle East, and North America
                </span>
              </div>
            </div>
          </section>

          {/* 6. CALL TO ACTION */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaLeft}>
                <p className={styles.ctaEyebrow}>GET STARTED</p>
                <h2 className={styles.ctaTitle}>
                  Ready to transform your {industry.title.toLowerCase()} technology?
                </h2>
                <p className={styles.ctaDesc}>
                  Connect with our industry architects to design a resilient, compliant, and scalable foundation tailored to your business goals.
                </p>
              </div>
              <Link href="/contact" className={styles.ctaBtn}>
                Start a conversation <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}