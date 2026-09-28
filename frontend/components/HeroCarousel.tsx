"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import { easeOut } from "@/lib/motion";
import styles from "./HeroCarousel.module.css";

/**
 * ============================================================================
 * SLIDES CONFIGURATION (EDIT IMAGE PATHS & CONTENT HERE)
 * ============================================================================
 * You can edit the image path, heading, description, or CTA link for each
 * slide directly in the array below. You can use root-relative paths like
 * "/images/cs/services/1st.webp" or "public/images/cs/services/1st.webp".
 * ============================================================================
 */
export interface CarouselSlide {
  image: string;
  heading: string;
  tag: string;
  statBadge: string;
  description: string;
  cta: string;
  href: string;
}

export const slides: CarouselSlide[] = [
  {
    image: "/images/cs/services/1st.webp",
    heading: "450 Enterprises We Support",
    tag: "Enterprise Scale",
    statBadge: "450+",
    description:
      "From high-growth innovators to mission-critical global leaders, we deliver 24/7 managed cloud operations, proactive cost optimization, and resilient multi-cloud infrastructure.",
    cta: "Learn more",
    href: "/services",
  },
  {
    image: "/images/cs/services/2nd.webp",
    heading: "200 Cloud Migrations Done",
    tag: "Proven Track Record",
    statBadge: "200+",
    description:
      "Seamless workload migrations across Microsoft Azure, AWS, GCP, and Oracle Cloud with zero unplanned downtime, robust landing zones, and rapid time-to-value.",
    cta: "Learn more",
    href: "/managed-cloud",
  },
  {
    image: "/images/cs/services/minthree.webp",
    heading: "15 Min Critical Response",
    tag: "Mission-Critical SLA",
    statBadge: "15 Min",
    description:
      "Guaranteed SLA-backed 15-minute response times with dedicated tier-3 cloud architects, automated incident containment, and 24/7/365 active monitoring.",
    cta: "Learn more",
    href: "/contact",
  },
  {
    image: "/images/cs/services/4th.webp",
    heading: "87% First-Call Fix",
    tag: "Support Excellence",
    statBadge: "87%",
    description:
      "Industry-leading first-contact resolution powered by deep multi-cloud engineering expertise, unified full-stack observability, and intelligent runbook automation.",
    cta: "Learn more",
    href: "/contact",
  },
];

/**
 * Helper to ensure image paths starting with "public/" work seamlessly in Next.js
 */
function normalizeImageSrc(src: string): string {
  if (!src) return "";
  if (src.startsWith("public/")) return "/" + src.slice(7);
  if (src.startsWith("public\\")) return "/" + src.slice(7).replace(/\\/g, "/");
  return src;
}

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex];
  const nextIndex = (currentIndex + 1) % totalSlides;
  const nextSlide = slides[nextIndex];

  const goToSlide = useCallback(
    (index: number, newDirection?: number) => {
      setDirection(newDirection !== undefined ? newDirection : index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Continuous automatic slide progression (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [goToNext, currentIndex]);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(document.activeElement)
      ) {
        if (e.key === "ArrowRight") {
          goToNext();
        } else if (e.key === "ArrowLeft") {
          goToPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Framer motion text variants
  const textVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 16 : -16,
      filter: "blur(4px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.38,
        ease: easeOut,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -16 : 16,
      filter: "blur(4px)",
      transition: {
        duration: 0.25,
        ease: easeOut,
      },
    }),
  };

  return (
    <section className={styles.sectionWrapper} aria-label="Enterprise Proven Track Record">
      <GridBackground subtle />

      {/* Section Header with Badge */}
      <div className={styles.header}>
        <div className="section-badge">
          <SparkleIcon /> PROVEN PERFORMANCE
        </div>
        <h2 className={styles.sectionTitle}>
          Trusted by enterprises to migrate, secure, and run critical workloads
        </h2>
      </div>

      {/* Main Carousel Frame (Avanade-Style Hero Container) */}
      <div
        ref={containerRef}
        className={styles.carouselContainer}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="CloudSwift Enterprise Highlights"
      >
        {/* Right Side / Background Hero Visual Canvas (Fixed Aspect & Layout) */}
        <div className={styles.visualCanvas} aria-hidden="true">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.heading}
                className={`${styles.imageWrapper} ${isActive ? styles.activeImage : styles.inactiveImage}`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scale(1)" : "scale(1.04)",
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <Image
                  src={normalizeImageSrc(slide.image)}
                  alt={slide.heading}
                  fill
                  priority={index === 0 || index === 1}
                  className={styles.slideImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                />
                <div className={styles.imageOverlay} />
              </div>
            );
          })}
        </div>

        {/* Left Side: Avanade-Style Floating White Text Card */}
        <div className={styles.textCard}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.cardContent}
            >
              {/* Category Kicker Badge */}
              <div className={styles.kickerRow}>
                <span className={styles.kickerBadge}>
                  <span className={styles.kickerDot} />
                  {currentSlide.tag}
                </span>
                <span className={styles.statPill}>{currentSlide.statBadge}</span>
              </div>

              {/* Heading */}
              <h3 className={styles.cardHeading}>{currentSlide.heading}</h3>

              {/* Description */}
              <p className={styles.cardDescription}>{currentSlide.description}</p>

              {/* CTA Link */}
              <div className={styles.ctaWrapper}>
                <Link href={currentSlide.href} className={styles.ctaButton}>
                  <span>{currentSlide.cta}</span>
                  <svg
                    className={styles.ctaArrow}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation Controls (Arrows & Progress Indicator Bars) */}
          <div className={styles.controlsBar}>
            {/* Arrow Buttons */}
            <div className={styles.arrowControls}>
              <button
                onClick={goToPrev}
                className={styles.navButton}
                aria-label="Previous slide"
                title="Previous slide"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className={styles.navButton}
                aria-label="Next slide"
                title="Next slide"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Progress Indicator Bars / Dots */}
            <div
              className={styles.progressBarRow}
              role="tablist"
              aria-label="Carousel slide indicators"
            >
              {slides.map((slide, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={slide.heading}
                    onClick={() => goToSlide(index)}
                    className={`${styles.progressSegment} ${isActive ? styles.activeSegment : ""}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${index + 1}: ${slide.heading}`}
                  >
                    <div className={styles.progressTrack}>
                      <div
                        key={isActive ? `active-${currentIndex}` : `inactive-${index}`}
                        className={styles.progressFill}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom-Right "Up Next" Floating Preview Card */}
        <div
          className={styles.upNextCard}
          onClick={goToNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToNext();
            }
          }}
          aria-label={`Up next: ${nextSlide.heading}. Click to advance.`}
        >
          <div className={styles.upNextHeader}>
            <span className={styles.upNextLabel}>UP NEXT</span>
            <div className={styles.upNextArrowWrap}>
              <span className={styles.upNextCount}>
                0{nextIndex + 1}/0{totalSlides}
              </span>
              <svg
                className={styles.upNextArrow}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
          <div className={styles.upNextTitle}>{nextSlide.heading}</div>
          <div className={styles.upNextTag}>{nextSlide.tag}</div>
        </div>
      </div>
    </section>
  );
}
