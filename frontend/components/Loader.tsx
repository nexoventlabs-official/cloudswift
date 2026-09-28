import styles from "./Loader.module.css";

/** Animated CloudSwift cloud loader. Centered by default. */
export default function Loader({ center = true }: { center?: boolean }) {
  const loader = (
    <div className={styles.loader}>
      <svg id="cloud" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <filter id="roundness">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
          </filter>
          <mask id="shapes">
            <g fill="white">
              <polygon points="50 37.5 80 75 20 75 50 37.5" />
              <circle cx="20" cy="60" r="15" />
              <circle cx="80" cy="60" r="15" />
              <g>
                <circle cx="20" cy="60" r="15" />
                <circle cx="20" cy="60" r="15" />
                <circle cx="20" cy="60" r="15" />
              </g>
            </g>
          </mask>
          <mask id="clipping" clipPathUnits="userSpaceOnUse">
            <g id="lines" filter="url(#roundness)">
              <g mask="url(#shapes)" stroke="white">
                {Array.from({ length: 21 }, (_, i) => {
                  const y = -40 + i * 9;
                  return <line key={i} x1="-50" y1={y} x2="150" y2={y} />;
                })}
              </g>
            </g>
          </mask>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="0" ry="0" mask="url(#clipping)" />
      </svg>
    </div>
  );
  return center ? <div className={styles.center}>{loader}</div> : loader;
}
