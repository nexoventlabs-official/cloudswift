"use client";
import Image from "next/image";
import styles from "./TemplateMedia.module.css";
import { getServiceImageMeta } from "@/lib/serviceImageMeta";
import FluidServiceImage from "@/components/FluidServiceImage";

type Tone = "aurora" | "network" | "secure" | "migrate" | "operate";

/**
 * Media frame for project/offering cards.
 */
export default function TemplateMedia({
  src,
  alt = "",
  tone = "aurora",
  logo,
  title,
  fit = "cover",
  sizes = "50vw",
  priority = false,
  className = "",
}: {
  src?: string | null;
  alt?: string;
  tone?: Tone;
  logo?: string | null;
  title?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const showPhoto = Boolean(src);
  const contain = showPhoto && fit === "contain";
  const meta = getServiceImageMeta(src);
  const accent =
    tone === "secure"
      ? "rgba(232, 117, 74, 0.16)"
      : tone === "migrate"
        ? "rgba(189, 234, 255, 0.12)"
        : tone === "operate"
          ? "rgba(181, 255, 215, 0.1)"
          : tone === "network"
            ? "rgba(203, 208, 255, 0.12)"
            : "rgba(249, 227, 254, 0.1)";

  return (
    <div
      className={`${styles.root} ${contain ? styles.contain : ""} ${className}`}
    >
      {showPhoto && contain && meta && (
        <FluidServiceImage
          src={src!}
          alt={alt}
          priority={priority}
          sizes={sizes}
          className={styles.photoFluid}
        />
      )}

      {showPhoto && contain && !meta && (
        <Image
          src={src!}
          alt={alt}
          width={1600}
          height={1040}
          className={styles.photoFluid}
          sizes={sizes}
          priority={priority}
          style={{ width: "100%", height: "auto" }}
        />
      )}

      {showPhoto && !contain && (
        <Image
          src={src!}
          alt={alt}
          fill
          className={styles.photo}
          sizes={sizes}
          priority={priority}
        />
      )}

      {!contain && !showPhoto && (
        <div
          className={styles.wash}
          style={{
            background: `radial-gradient(ellipse at 70% 18%, ${accent}, transparent 55%)`,
          }}
          aria-hidden
        />
      )}

      {(logo || title) && (
        <div className={styles.mark}>
          {logo ? (
            <Image
              src={logo}
              alt={title || ""}
              width={160}
              height={48}
              className={styles.logo}
            />
          ) : (
            <span className={styles.title}>{title}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function toneForCategory(category = "", title = ""): Tone {
  const t = `${category} ${title}`.toLowerCase();
  if (/(secur|identity|compliance|risk|soc|sentinel)/.test(t)) return "secure";
  if (/(migrat|deploy|build|transform|implement)/.test(t)) return "migrate";
  if (/(ai|agent|mlops|chatgpt|analytic|power bi|monitor)/.test(t))
    return "operate";
  if (/(network|cloud|azure|aws|gcp|virtual|server|storage|oracle)/.test(t))
    return "network";
  return "aurora";
}
