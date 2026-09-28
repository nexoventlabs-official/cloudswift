"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./AzureEcosystem.module.css";

type Capability = {
  id: string;
  title: string;
  detail: string;
  icon: "ai" | "compute" | "containers" | "devops" | "security" | "cloud";
  position: "upperLeft" | "top" | "upperRight" | "right" | "lowerLeft" | "bottom";
};

const capabilities: Capability[] = [
  { id: "ai", title: "Azure AI Services", detail: "AI, Machine Learning & intelligent applications", icon: "ai", position: "upperLeft" },
  { id: "compute", title: "Virtual Machines & Scale Sets", detail: "Compute • scalable virtual infrastructure", icon: "compute", position: "top" },
  { id: "containers", title: "Azure Kubernetes Service", detail: "Container orchestration • cloud-native workloads", icon: "containers", position: "upperRight" },
  { id: "devops", title: "Azure DevOps", detail: "CI/CD pipelines • build and deploy", icon: "devops", position: "right" },
  { id: "security", title: "Security & Compliance", detail: "Protected perimeter • identity and governance", icon: "security", position: "lowerLeft" },
  { id: "cloud", title: "Cloud Infrastructure", detail: "Networking • storage and platform services", icon: "cloud", position: "bottom" },
];

function CapabilityIcon({ icon }: { icon: Capability["icon"] }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (icon === "ai") return <svg {...common}><path d="M9 3v3M15 3v3M6 9H3M21 9h-3M6 15H3M21 15h-3M9 21v-3M15 21v-3" /><rect x="6" y="6" width="12" height="12" rx="3" /><circle cx="10" cy="11" r="1" /><circle cx="14" cy="11" r="1" /><path d="M9 14c1.7 1.2 4.3 1.2 6 0" /></svg>;
  if (icon === "security") return <svg {...common}><path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
  if (icon === "containers") return <svg {...common}><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" /><path d="m5 7 7 4 7-4M12 11v10" /></svg>;
  if (icon === "devops") return <svg {...common}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8.5 7.5 10.5 16M15.5 7.5 13.5 16M8.5 6h7" /></svg>;
  if (icon === "cloud") return <svg {...common}><path d="M5.5 17.5A4.5 4.5 0 0 1 7 8.8 5.5 5.5 0 0 1 17.6 10a4 4 0 0 1 1 7.5H5.5Z" /><path d="M12 12v7M9.5 16.5 12 19l2.5-2.5" /></svg>;
  return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5M9 1v3M15 1v3M9 20v3M15 20v3" /></svg>;
}

const connectorPaths = [
  "M44 45 C36 37 28 30 18 24",
  "M50 43 C50 34 48 25 45 14",
  "M57 46 C67 40 77 33 86 25",
  "M59 53 C69 55 79 59 89 66",
  "M43 54 C34 59 25 66 15 73",
  "M49 58 C48 68 48 78 47 89",
];

export default function AzureEcosystem() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`${styles.architecture} ${active ? styles.isActive : ""}`} role="img" aria-label="Microsoft Azure cloud architecture">
      <div className={styles.grid} aria-hidden />
      <div className={styles.ambientGlow} aria-hidden />
      <svg className={styles.connectors} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {connectorPaths.map((path, index) => <path key={path} d={path} className={styles.connector} style={{ ["--delay" as string]: `${0.38 + index * 0.1}s` }} />)}
      </svg>

      <div className={styles.core}>
        <span className={styles.coreHalo} />
        <span className={styles.coreMark}>A</span>
        <strong>Microsoft Azure</strong>
        <small>ACTIVE CLOUD ENVIRONMENT</small>
      </div>

      <div className={styles.nodes}>
        {capabilities.map((capability, index) => (
          <Link key={capability.id} href="/solutions/microsoft-azure" className={`${styles.node} ${styles[capability.position]}`} style={{ ["--delay" as string]: `${0.72 + index * 0.14}s` }}>
            <span className={styles.nodeIcon}><CapabilityIcon icon={capability.icon} /></span>
            <span className={styles.nodeCopy}><strong>{capability.title}</strong><small>{capability.detail}</small></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
