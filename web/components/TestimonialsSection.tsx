"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { testimonials } from "@/lib/data";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import styles from "./TestimonialsSection.module.css";
import { easeOut } from "@/lib/motion";

const rotations = [8, -7, 6];

export default function TestimonialsSection() {
  const headerRef = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const wmY = useTransform(scrollYProgress, [0, 1], [90, -120]);
  const wmScale = useTransform(scrollYProgress, [0, 1], [0.82, 1.12]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <GridBackground subtle />
      <motion.div
        className={styles.watermark}
        aria-hidden
        style={mounted && !reduce ? { x: "-50%", y: wmY, scale: wmScale } : undefined}
      >
        <Image
          src="/images/feedback-text.png"
          alt=""
          width={2722}
          height={455}
          className={styles.watermarkImg}
          sizes="(max-width: 1800px) 100vw, 1800px"
        />
      </motion.div>

      <div className={styles.header} ref={headerRef}>
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: easeOut }}
        >
            <span className="section-badge">
              <SparkleIcon /> CLIENT RESULTS
            </span>
        </motion.div>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: easeOut }}
        >
          Results teams feel after we take ownership —
          <br />
          fewer outages, clearer spend, faster response
        </motion.p>
      </div>

      <div className={styles.stack}>
        {testimonials.map((t, i) => (
          <StickyTestimonial
            key={t.id}
            testimonial={t}
            index={i}
            baseRotate={rotations[i % rotations.length]}
          />
        ))}
      </div>
    </section>
  );
}

function StickyTestimonial({
  testimonial,
  index,
  baseRotate,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
  baseRotate: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.32, 0.7, 1], [160, 0, 0, -80]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.32, 0.7, 1],
    [baseRotate + 6, baseRotate, baseRotate, baseRotate - 4]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.32, 0.7, 1],
    [0.84, 1, 1, 0.96]
  );
  const springY = useSpring(y, { stiffness: 110, damping: 22 });
  const springR = useSpring(rotate, { stiffness: 110, damping: 22 });

  return (
    <div
      className={styles.stickyPanel}
      ref={panelRef}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        className={styles.card}
        style={{ y: springY, rotate: springR, scale }}
      >
        <div className={styles.cardTop}>
          <div className={styles.clientLogo}>
            <div className={styles.logoDot} />
            <div className={styles.logoDot} style={{ opacity: 0.6 }} />
            <div className={styles.logoDot} style={{ opacity: 0.4 }} />
            <div className={styles.logoDot} style={{ opacity: 0.2 }} />
          </div>
          <span className={styles.date}>{testimonial.date}</span>
        </div>

        <p className={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</p>

        <div className={styles.author}>
          <span className={styles.authorName}>{testimonial.name}</span>
          <span className={styles.authorTitle}>{testimonial.title}</span>
        </div>
      </motion.div>
    </div>
  );
}
