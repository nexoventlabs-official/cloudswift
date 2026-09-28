"use client";

import { useEffect, useRef, useState } from "react";

/** Match Platform Solutions: keep the network moving unless the tab is hidden or motion is reduced. */
export function useVisualPlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return { ref, playing: tabVisible && !reduce };
}
