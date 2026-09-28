"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./GridBackground.module.css";

/** Optional section glows (hero aurora / mesh). */
export default function GridBackground({
  parallax = true,
  mesh = false,
  hero = false,
  subtle = false,
}: {
  parallax?: boolean;
  mesh?: boolean;
  hero?: boolean;
  subtle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax ? ["-8%", "10%"] : ["0%", "0%"]
  );

  if (!mesh && !hero && !subtle) return null;

  return (
    <div
      className={`${styles.root} ${hero ? styles.hero : ""} ${subtle ? styles.subtle : ""}`}
      ref={ref}
      aria-hidden
    >
      <div className={styles.bloom} />
      {mesh ? (
        <motion.div className={styles.mesh} style={{ y }}>
          <Image
            src="/images/gradient-mesh.png"
            alt=""
            fill
            unoptimized
            className={styles.meshImg}
            sizes="100vw"
          />
        </motion.div>
      ) : null}
      {hero || subtle ? (
        <motion.div
          className={hero ? styles.heroGlow : styles.subtleGlow}
          style={{ y }}
        >
          <Image
            src="/images/hero-gradient.png"
            alt=""
            fill
            unoptimized
            className={styles.heroImg}
            sizes="100vw"
          />
        </motion.div>
      ) : null}
    </div>
  );
}
