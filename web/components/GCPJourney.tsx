"use client";

import { motion } from "framer-motion";
import styles from "./GCPJourney.module.css";

type JourneyStop = {
  title: string;
  description: string;
  icon: "kubernetes" | "data" | "ai" | "cloud";
  side: "left" | "right";
  enterX: number;
  enterY: number;
  tilt: number;
  depth: number;
};

const journeyStops: JourneyStop[] = [
  {
    title: "GKE (Kubernetes)",
    description: "Run secure, resilient containers with managed Kubernetes at scale.",
    icon: "kubernetes",
    side: "left",
    enterX: -76,
    enterY: -58,
    tilt: -3,
    depth: 2,
  },
  {
    title: "BigQuery",
    description: "Turn enterprise data into fast, actionable insight with analytics.",
    icon: "data",
    side: "right",
    enterX: 76,
    enterY: -42,
    tilt: 3,
    depth: 1,
  },
  {
    title: "AI/ML Services",
    description: "Build intelligent products with Google Cloud AI and automation.",
    icon: "ai",
    side: "left",
    enterX: -68,
    enterY: 48,
      tilt: -2,
    depth: 3,
  },
  {
    title: "Cloud Run",
    description: "Deploy containerized applications without managing infrastructure.",
    icon: "cloud",
    side: "right",
    enterX: 68,
    enterY: 58,
      tilt: 2,
    depth: 2,
  },
];

function StopIcon({ icon }: { icon: JourneyStop["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (icon === "kubernetes") {
    return <svg {...common}><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" /><path d="m12 6 4.5 2.5v6L12 17l-4.5-2.5v-6L12 6ZM4.5 6.5 12 11l7.5-4.5M12 11v6" /></svg>;
  }
  if (icon === "data") {
    return <svg {...common}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
  }
  if (icon === "ai") {
    return <svg {...common}><path d="M9 3v3M15 3v3M6 9H3M21 9h-3M6 15H3M21 15h-3M9 21v-3M15 21v-3" /><rect x="6" y="6" width="12" height="12" rx="3" /><circle cx="10" cy="11" r="1" /><circle cx="14" cy="11" r="1" /><path d="M9 14c1.7 1.2 4.3 1.2 6 0" /></svg>;
  }
  return <svg {...common}><path d="M5.5 17.5A4.5 4.5 0 0 1 7 8.8 5.5 5.5 0 0 1 17.6 10a4 4 0 0 1 1 7.5H5.5Z" /><path d="M12 12v7M9.5 16.5 12 19l2.5-2.5" /></svg>;
}

export default function GCPJourney() {
  return (
    <div className={styles.map} role="img" aria-label="Google Cloud Platform capability map">
      <div className={styles.mapGlow} aria-hidden />
      <div className={styles.connectors} aria-hidden>
        <span className={styles.connectorOne} />
        <span className={styles.connectorTwo} />
        <span className={styles.connectorThree} />
        <span className={styles.connectorFour} />
      </div>
      <div className={styles.platforms}>
        {journeyStops.map((stop, index) => (
          <motion.article
            key={stop.title}
            className={styles.platform}
            style={{ zIndex: stop.depth }}
            initial={{ opacity: 0, x: stop.enterX, y: stop.enterY, rotate: stop.tilt * 1.8, scale: 0.78 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: stop.tilt, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 17, mass: 0.8, delay: 0.42 + index * 0.13 }}
          >
            <span className={styles.platformIcon}><StopIcon icon={stop.icon} /></span>
            <span className={styles.platformContent}>
              <strong className={styles.platformTitle}>{stop.title}</strong>
              <span className={styles.platformDescription}>{stop.description}</span>
            </span>
          </motion.article>
        ))}
      </div>
      <div className={styles.hub}>
        <span className={styles.hubContent}>
          <strong className={styles.hubMark}>GCP</strong>
          <span className={styles.hubLabel}>cloud platform</span>
          <span className={styles.hubStatus}>connected services</span>
        </span>
      </div>
    </div>
  );
}
