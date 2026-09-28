/**
 * OfferingsMarquee — Homepage "Our Offerings" section
 * Positioned right after the PlatformOrbit (STACK diagram) section.
 *
 * ─────────────────────────────────────────────
 * EDIT CARD CONTENT HERE — one entry per card.
 * Fields: badge, icon key, heading, description,
 *         trustLine, ctaText, subText, link
 * ─────────────────────────────────────────────
 */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SparkleIcon from "@/components/SparkleIcon";
import styles from "./OfferingsMarquee.module.css";
import { easeOut, viewOnce } from "@/lib/motion";

/* ──────────────────────────────────────────────────────────
   DATA CONFIG — edit badges, headings, descriptions etc. here
   without touching layout or animation code.
   ────────────────────────────────────────────────────────── */
export interface OfferingCard {
  badge: string;
  icon: OfferingIconKey;
  heading: string;
  description: string;
  trustLine: string;
  ctaText: string;
  subText: string;
  link: string;
}

export type OfferingIconKey =
  | "clock"
  | "brain"
  | "cloud"
  | "bar-chart"
  | "network"
  | "arrows"
  | "clipboard"
  | "gift"
  | "architect";

export const OFFERINGS: OfferingCard[] = [
  {
    badge: "QUICK START",
    icon: "clock",
    heading: "Talk with an expert in 30 minutes",
    description: "Quick consultation to explore your cloud challenges and goals",
    trustLine: "★★★★★ 98% find it valuable",
    ctaText: "Book my session →",
    subText: "30-min call · No charge",
    link: "/contact",
  },
  {
    badge: "GO SMARTER",
    icon: "brain",
    heading: "Unlock your AI potential",
    description: "Expert guidance on AI implementation and automation strategies",
    trustLine: "★★★★★ Clients report 35% efficiency gains",
    ctaText: "Book my AI consult →",
    subText: "Strategy session · 2-hour workshop",
    link: "/contact",
  },
  {
    badge: "GET CLARITY",
    icon: "cloud",
    heading: "See your full cloud picture",
    description: "Comprehensive evaluation of your current cloud environment",
    trustLine: "★★★★★ 450+ assessments completed",
    ctaText: "Start assessment →",
    subText: "Results in 5–10 business days",
    link: "/contact",
  },
  {
    badge: "SAVE MORE",
    icon: "bar-chart",
    heading: "Find where you're overspending",
    description: "Quick review of your cloud spend and savings opportunities",
    trustLine: "★★★★★ Clients save 27% on average",
    ctaText: "Check my cloud cost →",
    subText: "Quick scan · Results in 48 hours",
    link: "/contact",
  },
  {
    badge: "GET INSIGHTS",
    icon: "network",
    heading: "Know your infrastructure deep dive",
    description: "In-depth analysis of your current infrastructure setup",
    trustLine: "★★★★★ Architects with 15+ years experience",
    ctaText: "Request my review →",
    subText: "Detailed report · 3–5 business days",
    link: "/contact",
  },
  {
    badge: "PLAN AHEAD",
    icon: "arrows",
    heading: "Map your migration path",
    description: "Plan and strategize your cloud migration journey",
    trustLine: "★★★★★ 200+ successful migrations",
    ctaText: "Plan my migration →",
    subText: "Consultation call · 45 minutes",
    link: "/contact",
  },
  {
    badge: "GET READY",
    icon: "clipboard",
    heading: "Know if you are ready to move",
    description: "Assess your organisation readiness for cloud migration",
    trustLine: "★★★★★ 89% move forward within 90 days",
    ctaText: "Check my readiness →",
    subText: "Self-paced · Results instantly",
    link: "/contact",
  },
  {
    badge: "LIMITED OFFER",
    icon: "gift",
    heading: "Start your cloud journey today",
    description: "Special introductory engagement for new clients",
    trustLine: "★★★★★ Includes strategy session + audit",
    ctaText: "Claim my offer →",
    subText: "Limited time · New clients only",
    link: "/contact",
  },
  {
    badge: "TALK TO AN ARCHITECT",
    icon: "architect",
    heading: "Design your cloud architecture",
    description: "Work directly with a senior architect to blueprint your ideal cloud setup",
    trustLine: "★★★★★ Tier-3 engineers, 15-min SLA",
    ctaText: "Meet an architect →",
    subText: "60-min deep-dive · No obligation",
    link: "/contact",
  },
];

/* ──────────────────────────────────────────────────────────
   INLINE SVG ICONS — no external dependency needed.
   All paths are stroke-based (line-style) for consistency.
   ────────────────────────────────────────────────────────── */
function OfferingIcon({ type }: { type: OfferingIconKey }) {
  const shared = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "clock":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "brain":
      return (
        <svg {...shared}>
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V20" />
          <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5C5.5 4.5 4 5.6 4 7.5c0 1.4.8 2.5 2 3-.5.5-.8 1.2-.8 2C5.2 14 6.5 15 8 15" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5V20" />
          <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5c1.5 0 3 1.1 3 3 0 1.4-.8 2.5-2 3 .5.5.8 1.2.8 2C18.8 14 17.5 15 16 15" />
          <path d="M8 15a3 3 0 0 0 3 3v2" />
          <path d="M16 15a3 3 0 0 1-3 3v2" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...shared}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    case "bar-chart":
      return (
        <svg {...shared}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "network":
      return (
        <svg {...shared}>
          <rect x="16" y="16" width="6" height="6" rx="1" />
          <rect x="2" y="16" width="6" height="6" rx="1" />
          <rect x="9" y="2" width="6" height="6" rx="1" />
          <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
          <line x1="12" y1="8" x2="12" y2="12" />
        </svg>
      );
    case "arrows":
      return (
        <svg {...shared}>
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...shared}>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "gift":
      return (
        <svg {...shared}>
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      );
    case "architect":
      return (
        <svg {...shared}>
          <circle cx="12" cy="7" r="3" />
          <path d="M7 21v-2a5 5 0 0 1 10 0v2" />
          <line x1="12" y1="10" x2="12" y2="14" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      );
  }
}

/* ──────────────────────────────────────────────────────────
   SINGLE CARD COMPONENT
   ────────────────────────────────────────────────────────── */
function OfferingCardItem({ card }: { card: OfferingCard }) {
  return (
    <Link href={card.link} className={styles.card} draggable={false}>
      {/* 1 – Badge pill */}
      <span className={styles.badge}>{card.badge}</span>

      {/* 2 – Icon box with ambient float/glow animation */}
      <div className={styles.iconBox}>
        <span className={styles.iconWrap}>
          <OfferingIcon type={card.icon} />
        </span>
        <span className={styles.iconGlow} aria-hidden />
      </div>

      {/* 3 & 4 – Heading + underline accent */}
      <h3 className={styles.heading}>{card.heading}</h3>
      <span className={styles.underline} aria-hidden />

      {/* 5 – Description */}
      <p className={styles.description}>{card.description}</p>

      {/* 6 – Star trust line */}
      <p className={styles.trustLine}>{card.trustLine}</p>

      {/* 7 – CTA button */}
      <span className={styles.cta}>{card.ctaText}</span>

      {/* 8 – Sub-text */}
      <p className={styles.subText}>{card.subText}</p>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN SECTION EXPORT
   ────────────────────────────────────────────────────────── */
export default function OfferingsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const pauseMarquee = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const resumeMarquee = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  return (
    <section className={styles.section} id="offerings" aria-label="Our Offerings">
      {/* Section header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={viewOnce}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <span className="section-badge">
          <SparkleIcon /> OUR OFFERINGS
        </span>
        <h2 className={styles.sectionTitle}>Ways to Get Started</h2>
        <p className={styles.sectionSubtitle}>
          Explore quick consultations, assessments, and readiness checks tailored to your needs
        </p>
      </motion.div>

      {/* Marquee viewport — clips overflow and adds edge fades */}
      <div
        className={styles.marqueeViewport}
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
        onTouchStart={pauseMarquee}
        onTouchEnd={resumeMarquee}
      >
        <span className={styles.fadeLeft} aria-hidden />
        <span className={styles.fadeRight} aria-hidden />

        {/* Scrolling track — duplicated cards for seamless loop */}
        <div ref={trackRef} className={styles.marqueeTrack} aria-label="Offerings">
          {[...OFFERINGS, ...OFFERINGS].map((card, i) => (
            <OfferingCardItem key={`${card.badge}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
