"use client";

import { motion } from "framer-motion";
import styles from "./AWSJourney.module.css";

type JourneyStop = {
  title: string;
  description: string;
  icon: "compute" | "lambda" | "security" | "database";
  side: "left" | "right";
};

const journeyStops: JourneyStop[] = [
  {
    title: "EC2 & S3",
    description: "Scale compute and storage around the work your business needs.",
    icon: "compute",
    side: "left",
  },
  {
    title: "Serverless (Lambda)",
    description: "Ship event-driven features without managing the underlying servers.",
    icon: "lambda",
    side: "right",
  },
  {
    title: "AWS Security",
    description: "Protect identities, workloads, and data with security built in.",
    icon: "security",
    side: "left",
  },
  {
    title: "Database Services",
    description: "Design resilient data foundations for performance and growth.",
    icon: "database",
    side: "right",
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

  if (icon === "compute") {
    return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>;
  }
  if (icon === "lambda") {
    return <svg {...common}><path d="m7 3 5.5 18M12 3h3l5 18h-3M5 21l5-9" /></svg>;
  }
  if (icon === "security") {
    return <svg {...common}><path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
  }
  return <svg {...common}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
}

export default function AWSJourney() {
  return (
    <div className={styles.journey} role="img" aria-label="Amazon Web Services capability journey">
      <div className={styles.journeyGlow} aria-hidden />
      <div className={styles.launch} aria-hidden>
        <span className={styles.launchIcon}>↑</span>
        <span className={styles.launchLabel}>AWS capability journey</span>
      </div>
      <div className={styles.track} aria-hidden><span className={styles.trackLight} /></div>
      <div className={styles.stops}>
        {journeyStops.map((stop, index) => (
          <motion.article
            key={stop.title}
            className={`${styles.stop} ${styles[stop.side]}`}
            initial={{ opacity: 0, x: stop.side === "left" ? -18 : 18, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.stopMarker}><StopIcon icon={stop.icon} /></span>
            <span className={styles.stopCopy}>
              <span className={styles.stopNumber}>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stop.title}</strong>
              <span>{stop.description}</span>
            </span>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
