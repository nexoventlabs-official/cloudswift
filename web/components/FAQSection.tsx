"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/data";
import SparkleIcon from "@/components/SparkleIcon";
import GridBackground from "@/components/GridBackground";
import styles from "./FAQSection.module.css";
import { easeOut, springSnappy, viewOnce, viewRow } from "@/lib/motion";

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useRef(null);

  return (
    <section className={styles.section} ref={ref}>
      <GridBackground subtle />
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={viewOnce}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <span className="section-badge">
              <SparkleIcon /> FAQ
            </span>
          </motion.div>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={viewOnce}
            transition={{ duration: 0.85, delay: 0.08, ease: easeOut }}
          >
            Common questions before a discovery call —
            <br />
            what we do, how support works, where we serve
          </motion.p>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              className={styles.item}
              initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={viewRow}
              transition={{ ...springSnappy, delay: i * 0.04 }}
            >
              <motion.hr
                className={styles.sep}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewRow}
                transition={{ duration: 0.85, ease: easeOut }}
              />
              <div
                className={styles.itemHeader}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span className={styles.itemNum}>{faq.id}</span>
                <span className={styles.itemQuestion}>{faq.question}</span>
                <motion.span
                  className={styles.itemArrow}
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  ↓
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    className={styles.itemAnswer}
                    initial={{ height: 0, opacity: 0, filter: "blur(8px)" }}
                    animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                    exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.45, ease: easeOut }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className={styles.answerText}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <hr className={styles.sep} />
        </div>
      </div>
    </section>
  );
}
