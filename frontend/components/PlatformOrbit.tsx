"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GridBackground from "@/components/GridBackground";
import SplitWords from "@/components/SplitWords";
import { company } from "@/lib/data";
import { easeOut, viewOnce, viewRow } from "@/lib/motion";
import styles from "./PlatformOrbit.module.css";

const HUB = { x: 310, y: 300 } as const;

const platforms = [
  { id: "azure", n: "01", title: "Azure", subtitle: "Identity, landing zones, apps", logo: "/images/brand/azure.svg", href: "/solutions/microsoft-azure", x: 458, y: 96, glow: "rgba(0, 168, 255, 0.7)" },
  { id: "m365", n: "02", title: "Microsoft 365", subtitle: "Modern workplace", logo: "/images/brand/m365.svg", href: "/solutions/microsoft-365", x: 108, y: 176, glow: "rgba(255, 185, 0, 0.55)" },
  { id: "d365", n: "03", title: "Dynamics 365", subtitle: "Business apps", logo: "/images/brand/dynamics365.svg", href: "/solutions/dynamics-365", x: 148, y: 96, glow: "rgba(0, 120, 212, 0.65)" },
  { id: "pbi", n: "04", title: "Power BI", subtitle: "Live analytics", logo: "/images/brand/powerbi.svg", href: "/solutions/power-bi", x: 96, y: 312, glow: "rgba(242, 196, 48, 0.7)" },
  { id: "aws", n: "05", title: "AWS", subtitle: "Elastic workloads", logo: "/images/brand/aws.svg", href: "/solutions/amazon-web-services", x: 522, y: 272, glow: "rgba(255, 153, 0, 0.65)", wide: true },
  { id: "gcp", n: "06", title: "GCP", subtitle: "Google Cloud", logo: "/images/brand/gcp.svg", href: "/solutions/google-cloud-platform", x: 478, y: 452, glow: "rgba(66, 133, 244, 0.6)" },
  { id: "oracle", n: "07", title: "Oracle", subtitle: "Database estate", logo: "/images/brand/oracle.svg", href: "/managed-cloud/oracle-msp", x: 310, y: 508, glow: "rgba(234, 27, 34, 0.55)", wide: true },
];

function curvePath(x: number, y: number) {
  const mx = (HUB.x + x) / 2;
  const my = (HUB.y + y) / 2;
  const dx = x - HUB.x;
  const dy = y - HUB.y;
  const cx = mx - dy * 0.18;
  const cy = my + dx * 0.18;
  return `M ${HUB.x} ${HUB.y} Q ${cx} ${cy} ${x} ${y}`;
}

export default function PlatformOrbit() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className={styles.section} id="platforms">
      <GridBackground subtle />
      <div className={styles.inner}>
        <div className={styles.top}>
          <motion.p className={styles.kicker} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewOnce} transition={{ duration: 0.6, ease: easeOut }}>
            <span>Estate map</span><span className={styles.kickerDot} /><span>07 platforms</span><span className={styles.live}>live</span>
          </motion.p>
          <h2 className={styles.headline}><SplitWords text="Seven platforms, one operating model." /></h2>
          <motion.p className={styles.lede} initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={viewOnce} transition={{ duration: 0.8, delay: 0.12, ease: easeOut }}>
            Microsoft, AWS, Google Cloud, and Oracle — run as a single control plane, not seven disconnected vendors.
          </motion.p>
        </div>
        <div className={styles.board} onMouseLeave={() => setActive(null)}>
          <ol className={styles.index}>
            {platforms.map((p, i) => (
              <motion.li key={p.id} initial={{ opacity: 0, x: -24, filter: "blur(8px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={viewRow} transition={{ duration: 0.55, delay: i * 0.04, ease: easeOut }}>
                <Link href={p.href} className={`${styles.row} ${active === p.id ? styles.rowOn : ""} ${active && active !== p.id ? styles.rowDim : ""}`} onMouseEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)}>
                  <span className={styles.num}>{p.n}</span><span className={styles.rowLogo}><Image src={p.logo} alt="" width={p.wide ? 40 : 22} height={22} /></span><span className={styles.rowCopy}><span className={styles.rowTitle}>{p.title}</span><span className={styles.rowSub}>{p.subtitle}</span></span><span className={styles.rowGo}>↗</span>
                </Link>
              </motion.li>
            ))}
          </ol>
          <motion.div className={styles.map} initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }} whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }} viewport={viewOnce} transition={{ duration: 1, delay: 0.1, ease: easeOut }}>
            <span className={styles.watermark} aria-hidden>STACK</span>
            <div className={styles.radar} aria-hidden><span className={styles.ring} /><span className={styles.ring} /><span className={styles.ring} /><span className={styles.sweep} /></div>
            <svg className={styles.links} viewBox="0 0 620 600" aria-hidden>{platforms.map((p) => <path key={p.id} d={curvePath(p.x, p.y)} className={`${styles.path} ${active === p.id ? styles.pathOn : ""} ${active && active !== p.id ? styles.pathDim : ""}`} />)}</svg>
            <div className={styles.hub}><span className={styles.hubGlow} /><Image src={company.icon} alt="" width={160} height={90} className={styles.hubIcon} /><span className={styles.hubLabel}>CloudSwift</span></div>
            {platforms.map((p) => <Link key={p.id} href={p.href} className={`${styles.node} ${active === p.id ? styles.nodeOn : ""} ${active && active !== p.id ? styles.nodeDim : ""}`} style={{ left: `${(p.x / 620) * 100}%`, top: `${(p.y / 600) * 100}%`, ["--glow" as string]: p.glow }} onMouseEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)} aria-label={p.title}><span className={styles.nodeCore}><Image src={p.logo} alt="" width={p.wide ? 36 : 22} height={22} /></span><span className={styles.nodeName}>{p.title}</span></Link>)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
