"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

type CursorMode = "default" | "view" | "link";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 500, damping: 40, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 500, damping: 40, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 810px)").matches;
    if (!(fine && wide)) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-cursor='view']")) setMode("view");
      else if (t?.closest?.("a, button, [role='button']")) setMode("link");
      else setMode("default");
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      className={`${styles.cursor} ${styles[mode]} ${visible ? styles.visible : ""}`}
      style={{ x, y }}
      aria-hidden
    >
      {mode === "view" ? <span className={styles.viewLabel}>View</span> : null}
    </motion.div>
  );
}
