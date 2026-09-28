"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";
import styles from "./SplitWords.module.css";

export default function SplitWords({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (mounted && reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className={styles.word}>
          <motion.span
            className={styles.inner}
            initial={{ y: "115%", opacity: 0, filter: "blur(10px)" }}
            whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.028,
              ease: easeOut,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
