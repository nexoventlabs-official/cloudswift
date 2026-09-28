"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/lib/data";
import styles from "./Navbar.module.css";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/industries", label: "Industries" },
  { href: "/services", label: "Enterprise Services" },
  { href: "/managed-cloud", label: "Managed Cloud Services" },
  { href: "/ai-services", label: "AI Services" },
  { href: "/solutions", label: "Platform Solutions" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

const navSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 40,
  delay: 0.4,
  mass: 1,
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${menuOpen ? styles.navHidden : ""}`}
        initial={{ opacity: 0.001, y: -160 }}
        animate={{ opacity: menuOpen ? 0 : 1, y: 0 }}
        transition={navSpring}
        aria-hidden={menuOpen}
      >
        <div className={styles.navInner}>
          <Link
            href="/"
            className={styles.logo}
            aria-label={company.name}
            onClick={(event) => {
              if (window.location.pathname === "/") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src={company.logo}
              alt={company.name}
              width={240}
              height={48}
              className={styles.logoImg}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            menu
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.overlayGrain} aria-hidden />

            <div className={styles.overlayTop}>
              <button
                className={styles.closeBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 1L17 17M17 1L1 17"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </button>
            </div>

            <nav className={styles.overlayNav}>
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  className={styles.overlayRow}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 70,
                    delay: 0.06 + i * 0.04,
                  }}
                >
                  <Link
                    href={link.href}
                    className={styles.overlayLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.overlayLabel}>{link.label}</span>
                    <span className={styles.ticker} aria-hidden>
                      <span className={styles.tickerTrack}>
                        {Array.from({ length: 8 }, (_, n) => (
                          <span key={n} className={styles.tickerItem}>
                            {link.label}
                          </span>
                        ))}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className={styles.overlaySocials}>
              <a
                href={company.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
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
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <Image src="/images/icon-x.svg" alt="" width={28} height={28} />
              </a>
              <a
                href={company.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  src="/images/icon-instagram.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
