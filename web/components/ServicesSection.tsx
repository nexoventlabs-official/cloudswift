"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/lib/data";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import styles from "./ServicesSection.module.css";
import { easeOut, springSnappy, viewOnce, viewRow } from "@/lib/motion";

export default function ServicesSection() {
  const ref = useRef(null);

  return (
    <section className={styles.section} ref={ref}>
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
            <SparkleIcon /> WHAT WE OFFER
          </span>
        </motion.div>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewOnce}
          transition={{ duration: 0.85, delay: 0.08, ease: easeOut }}
        >
          Full catalogs of how we help —
          <br />
          enterprise services, managed cloud, AI, and platforms
        </motion.p>

        <div className={styles.list}>
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              className={styles.serviceRow}
              initial={{ opacity: 0, y: 56, x: -28, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
              viewport={viewRow}
              transition={{ ...springSnappy, delay: i * 0.03 }}
            >
              <motion.hr
                className={styles.sep}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewRow}
                transition={{ duration: 0.9, ease: easeOut }}
              />
              <Link href={service.href} className={styles.rowContent}>
                <div className={styles.titleWrap}>
                  <span className={styles.title}>{service.title}</span>
                  <sup className={styles.num}>{service.id}</sup>
                </div>
                <p className={styles.desc}>{service.description}</p>
                {service.tags?.length ? (
                  <ul className={styles.tags}>
                    {service.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        #{tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </motion.div>
          ))}
          <hr className={styles.sep} />
        </div>
      </div>
    </section>
  );
}
