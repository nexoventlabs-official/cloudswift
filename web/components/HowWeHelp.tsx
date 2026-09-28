"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import styles from "./ServicesSection.module.css";
import { easeOut, springSnappy, viewOnce, viewRow } from "@/lib/motion";

const steps = [
  {
    id: "01",
    title: "Migrate",
    description:
      "Discovery-first cloud and Microsoft migrations — landing zones, wave plans, and cutovers your team can trust.",
  },
  {
    id: "02",
    title: "Secure",
    description:
      "Identity, monitoring, backups, and SOC-aligned operations so risk drops while compliance stays audit-ready.",
  },
  {
    id: "03",
    title: "Operate",
    description:
      "24/7 managed Azure, AWS, GCP, M365, and AI — 99.97% uptime SLA and 15-minute critical response.",
  },
];

export default function HowWeHelp() {
  const ref = useRef(null);

  return (
    <section className={styles.section} ref={ref} id="how-we-help">
      <GridBackground subtle />
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewOnce}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <span className="section-badge">
            <SparkleIcon /> HOW WE HELP
          </span>
        </motion.div>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewOnce}
          transition={{ duration: 0.85, delay: 0.08, ease: easeOut }}
        >
          Cloud complexity slows growth. We take ownership of the stack
          <br />
          so your team ships product — not firefighting tickets.
        </motion.p>

        <div className={styles.list}>
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              className={styles.serviceRow}
              initial={{ opacity: 0, y: 56, x: -28, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
              viewport={viewRow}
              transition={{ ...springSnappy, delay: i * 0.04 }}
            >
              <motion.hr
                className={styles.sep}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewRow}
                transition={{ duration: 0.9, ease: easeOut }}
              />
              <div className={styles.rowContent}>
                <div className={styles.titleWrap}>
                  <span className={styles.title}>{step.title}</span>
                  <sup className={styles.num}>{step.id}</sup>
                </div>
                <p className={styles.desc}>{step.description}</p>
              </div>
            </motion.div>
          ))}
          <hr className={styles.sep} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewOnce}
          transition={{ duration: 0.7, ease: easeOut }}
          style={{ marginTop: 32 }}
        >
          <Link href="/contact" className="link-btn">
            talk through your environment <span className="arrow">↗</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
