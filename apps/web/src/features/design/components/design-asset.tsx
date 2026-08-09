"use client"

type DesignAssetProps = {
  src: string
  alt: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
}

/**
 * Serve design assets as static files (no `/_next/image`).
 * Large gallery PNGs overwhelm the OpenNext image Lambda (500/429).
 */
export function DesignAsset({
  src,
  alt,
  className,
  loading,
  fetchPriority,
}: DesignAssetProps) {
  return (
    // biome-ignore lint/performance/noImgElement: avoid image optimizer for large design assets
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}
