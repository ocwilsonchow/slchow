"use client"

type DesignAssetProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
}

/**
 * Static design media (already sharp-optimized WebP).
 * Uses native `img` with `sizes` + lazy/decoding hints — no `/_next/image`.
 */
export function DesignAsset({
  src,
  alt,
  sizes,
  className,
  loading = "lazy",
  fetchPriority,
}: DesignAssetProps) {
  return (
    // biome-ignore lint/performance/noImgElement: design assets skip the image optimizer
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      srcSet={`${src} 2048w`}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}
