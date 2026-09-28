"use client";

import styles from "./CapabilityFlowchart.module.css";

type CapabilityFlowchartProps = {
  capabilities: string[];
  capabilityIcons?: Record<string, string>;
  ambientIcons?: string[];
  centerLabel: string;
};

export default function CapabilityFlowchart({
  capabilities,
  centerLabel,
}: CapabilityFlowchartProps) {
  const nodes = capabilities.map((label, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(capabilities.length, 1)) * Math.PI * 2;
    const radius = capabilities.length > 4 ? 38 : 36;
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const lineStart = 0.12;

    return {
      label,
      x: 50 + directionX * radius,
      y: 50 + directionY * radius,
      startX: 50 + directionX * radius * lineStart,
      startY: 50 + directionY * radius * lineStart,
    };
  });

  return (
    <div className={styles.flowchart} role="img" aria-label={`${centerLabel} capability network`}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.ambientGlobe} aria-hidden>
        <span className={styles.globeLatitude} />
        <span className={styles.globeLongitude} />
      </div>
      <svg className={styles.wires} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {nodes.map((node, index) => (
          <g key={`${node.label}-${index}`}>
            <line x1={node.startX} y1={node.startY} x2={node.x} y2={node.y} className={styles.wireBase} />
            <line
              x1={node.startX}
              y1={node.startY}
              x2={node.x}
              y2={node.y}
              pathLength="1"
              className={styles.wireSignal}
              style={{ animationDelay: `${index * 0.35}s` }}
            />
            <circle r="0.9" className={styles.signalDot} filter="url(#signal-glow)">
              <animateMotion
                dur="2.8s"
                begin={`${index * 0.35}s`}
                repeatCount="indefinite"
                path={`M ${node.startX} ${node.startY} L ${node.x} ${node.y}`}
              />
            </circle>
          </g>
        ))}
      </svg>

      <div className={styles.center}>
        <span className={styles.centerPulse} />
        <span className={styles.centerLabel}>{centerLabel}</span>
        <span className={styles.centerStatus}>active network</span>
      </div>

      {nodes.map((node, index) => (
        <div
          key={node.label}
          className={styles.node}
          style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${index * 0.25}s`, ["--signal-delay" as string]: `${index * 0.35}s` }}
        >
          <span className={styles.nodeDot} />
          <span className={styles.nodeLabel}>{node.label}</span>
        </div>
      ))}
    </div>
  );
}
