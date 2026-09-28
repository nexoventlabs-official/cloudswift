import {
  getServiceImageMeta,
  serviceFallbackSrc,
  serviceSrcSet,
} from "@/lib/serviceImageMeta";

const HERO_SIZES = "(max-width: 900px) 100vw, 42vw";
const CARD_SIZES = "(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw";

export default function FluidServiceImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const meta = getServiceImageMeta(src);
  const layoutSizes = sizes ?? (priority ? HERO_SIZES : CARD_SIZES);

  if (!meta) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ width: "100%", height: "auto" }}
      />
    );
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={serviceSrcSet(meta.slug, meta.widths, "avif")}
        sizes={layoutSizes}
      />
      <source
        type="image/webp"
        srcSet={serviceSrcSet(meta.slug, meta.widths, "webp")}
        sizes={layoutSizes}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={serviceFallbackSrc(meta)}
        alt={alt}
        width={meta.width}
        height={meta.height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ width: "100%", height: "auto" }}
      />
    </picture>
  );
}
