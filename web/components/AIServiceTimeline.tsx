"use client";

import { motion } from "framer-motion";
import styles from "./AIServiceTimeline.module.css";

type TimelineProps = {
  capabilities: string[];
  descriptions?: Record<string, string>;
  icons?: Record<string, string>;
  centerLabel: string;
};

function CapabilityIcon({ name }: { name?: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "bot") return <svg {...common}><rect x="5" y="7" width="14" height="12" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M9 16c1.6 1 4.4 1 6 0" /><path d="M2 12h3M19 12h3" /></svg>;
  if (name === "workflow") return <svg {...common}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8.5 7.5 10.5 16M15.5 7.5 13.5 16M8.5 6h7" /></svg>;
  if (name === "brain-circuit") return <svg {...common}><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3M9 8h6M9 16h6M12 8v8" /><circle cx="12" cy="12" r="1" /></svg>;
  return <svg {...common}><path d="M12 3v18M5 8h14M7 13h10M9 18h6" /><circle cx="12" cy="3" r="1.5" /><circle cx="5" cy="8" r="1.5" /><circle cx="19" cy="8" r="1.5" /></svg>;
}

export default function AIServiceTimeline({ capabilities, descriptions = {}, icons = {}, centerLabel }: TimelineProps) {
  return (
    <div className={styles.timeline} role="img" aria-label={`${centerLabel} capability timeline`}>
      <div className={styles.ambient} aria-hidden />
      <div className={styles.launchPoint}>
        <span className={styles.launchGlow} />
        <span className={styles.launchIcon}><CapabilityIcon name="brain-circuit" /></span>
        <small>{centerLabel}</small>
      </div>
      <div className={styles.track} aria-hidden><span className={styles.trackPulse} /></div>
      <div className={styles.stops}>
        {capabilities.slice(0, 4).map((capability, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <motion.article key={capability} className={`${styles.stop} ${styles[side]}`} initial={{ opacity: 0, x: side === "left" ? -22 : 22, y: 12 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}>
              <span className={styles.connector} aria-hidden />
              <span className={styles.badge}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.icon}><CapabilityIcon name={icons[capability]} /></span>
              <span className={styles.copy}><strong>{capability}</strong><small>{descriptions[capability] ?? "Cloud AI capability from strategy to production."}</small></span>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
