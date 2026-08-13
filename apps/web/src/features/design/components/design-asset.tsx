"use client"

import { DESIGN_MASTER_WIDTH, designResponsiveSrcSet } from "../asset-urls"

type DesignAssetProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  /** Skip thumbnail srcset and load the 2048 master (lightbox). */
  fullResolution?: boolean
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
  fullResolution = false,
}: DesignAssetProps) {
  return (
    // biome-ignore lint/performance/noImgElement: design assets skip the image optimizer
    <img
      src={src}
      alt={alt}
      width={DESIGN_MASTER_WIDTH}
      height={DESIGN_MASTER_WIDTH}
      sizes={sizes}
      srcSet={
        fullResolution
          ? `${src} ${DESIGN_MASTER_WIDTH}w`
          : designResponsiveSrcSet(src)
      }
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}
