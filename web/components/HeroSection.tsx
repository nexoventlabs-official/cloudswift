"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { company } from "@/lib/data";
import { easeOut } from "@/lib/motion";
import GridBackground from "@/components/GridBackground";
import styles from "./HeroSection.module.css";

const cyclingWords = ["Cloud", "Azure", "Microsoft", "AI"];

const socials = [
  { href: company.socials.linkedin, label: "LinkedIn", icon: "/images/icon-linkedin.svg" },
  { href: company.socials.twitter, label: "X", icon: "/images/icon-x.svg" },
  { href: company.socials.instagram, label: "Instagram", icon: "/images/icon-instagram.svg" },
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tickerStep, setTickerStep] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const opacity = useTransform(scrollYProgress, [0, 0.45, 0.88], [1, 0.7, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 16]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const y = useSpring(yRaw, { stiffness: 90, damping: 28, mass: 0.8 });
  const scale = useSpring(scaleRaw, { stiffness: 90, damping: 28, mass: 0.8 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!tickerRef.current) return;
    const update = () => {
      if (tickerRef.current) setTickerStep(tickerRef.current.offsetHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % cyclingWords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const stageStyle = mounted && !reduce ? { y, scale, opacity, filter } : undefined;

  return (
    <section className={styles.hero} id="hero" ref={ref}>
      <GridBackground hero />
      <div className={styles.rightGlow} aria-hidden>
        <Image
          src="/images/hero-gradient.png"
          alt=""
          fill
          unoptimized
          className={styles.rightGlowImg}
          sizes="55vw"
        />
      </div>
      <div className={styles.grid} aria-hidden />

      <motion.div className={styles.stage} style={stageStyle}>
        <div className={styles.socialStack}>
          {socials.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={styles.socialLink}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{ scale: 1.08 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.7, ease: easeOut }}
            >
              <Image src={social.icon} alt="" width={32} height={32} />
            </motion.a>
          ))}
        </div>

        <div className={styles.inner}>
          <div className={styles.headline}>
            <h1 className={styles.designing}>
              <span className={styles.lineClip}>
                <motion.span
                  className={styles.lineMask}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.05, delay: 0.25, ease: easeOut }}
                >
                  Running
                </motion.span>
              </span>
            </h1>

            <div className={styles.forRow}>
              <motion.span
                className={styles.forText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.42, ease: easeOut }}
              >
                for
              </motion.span>
              <div className={styles.ticker} ref={tickerRef}>
                <motion.div
                  className={styles.tickerTrack}
                  animate={{ y: tickerStep ? -wordIndex * tickerStep : 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 28, mass: 0.9 }}
                >
                  {[...cyclingWords, cyclingWords[0]].map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className={styles.tickerWord}
                    >
                      {word}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <a
            href={company.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            Book a Free Consultation
          </a>
          <a href="/contact" className={styles.ctaSecondary}>
            Get in Touch
          </a>
        </div>
      </motion.div>
    </section>
  );
}
