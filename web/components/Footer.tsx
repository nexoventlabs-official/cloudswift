"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { company } from "@/lib/data";
import GridBackground from "@/components/GridBackground";
import styles from "./Footer.module.css";
import { easeOut, viewOnce } from "@/lib/motion";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const scaleRaw = useTransform(scrollYProgress, [0.05, 0.85], [0.62, 1.04]);
  const yRaw = useTransform(scrollYProgress, [0.05, 0.85], [80, 0]);
  const scale = useSpring(scaleRaw, { stiffness: 70, damping: 22 });
  const y = useSpring(yRaw, { stiffness: 70, damping: 22 });

  return (
    <footer className={styles.footer} ref={ref}>
      <GridBackground hero />

      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={viewOnce}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <div className={styles.top}>
          <div className={styles.leftCol}>
            <p className={styles.brandLine}>
              Cloud, AI &amp; Managed IT Solutions Built for Modern Enterprises
            </p>

            <div className={styles.contactBlock}>
              <p className={styles.contactLabel}>Contact us</p>
              <a href={`mailto:${company.email}`} className={styles.email}>
                {company.email}
              </a>
            </div>

            <hr className={styles.sep} />

            <div className={styles.socials}>
              <a
                href={company.socials.linkedin}
                className={styles.socialIcon}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/icon-linkedin.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </a>
              <a
                href={company.socials.twitter}
                className={styles.socialIcon}
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/icon-x.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </a>
              <a
                href={company.socials.instagram}
                className={styles.socialIcon}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/icon-instagram.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </a>
            </div>

            <a
              href={company.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bookCall}
            >
              book a free consultation <span>↗</span>
            </a>
          </div>

          <div className={styles.rightCol}>
            <p className={styles.ctaLabel}>Ready to secure and scale</p>
            <h2 className={styles.ctaHeadline}>
              your enterprise cloud
              <br />
              with confidence
            </h2>
            <p className={styles.ctaTagline}>
              Speak with a senior cloud architect — no hard sell.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.bigText}
        aria-hidden
        style={mounted && !reduce ? { scale, y } : undefined}
      >
        <Image
          src="/images/lets-talk.png"
          alt=""
          width={2712}
          height={510}
          className={styles.bigTextImg}
          sizes="(max-width: 1800px) 100vw, 1800px"
        />
      </motion.div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © {company.legalName} {new Date().getFullYear()} | All Rights Reserved
        </span>
        <div className={styles.bottomLinks}>
          <Link href="/terms-of-service" className={styles.bottomLink}>
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className={styles.bottomLink}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
