"use client"

import { useEffect, useRef } from "react"
import { DESIGN_MASTER_WIDTH, designResponsiveSrcSet } from "../asset-urls"
import { cn } from "@repo/ds/lib/utils"

type DesignAssetProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  /** Skip thumbnail srcset and load the 2048 master (lightbox). */
  fullResolution?: boolean
  kind?: "image" | "video"
  poster?: string
  /** Muted looping video when true; otherwise the poster/still. */
  playing?: boolean
}

/**
 * Design stills (sharp WebP + srcset) or muted looping MP4.
 * Native `img`/`video` — no `/_next/image`.
 */
export function DesignAsset({
  src,
  alt,
  sizes,
  className,
  loading = "lazy",
  fetchPriority,
  fullResolution = false,
  kind = "image",
  poster,
  playing = false,
}: DesignAssetProps) {
  const stillSrc = kind === "video" ? poster : src
  const showVideo = kind === "video" && playing

  if (showVideo) {
    return (
      <LoopingVideo
        src={src}
        poster={poster}
        alt={alt}
        className={cn(className, "p-8")}
      />
    )
  }

  if (!stillSrc) {
    return (
      <video
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        draggable={false}
        className={className}
      />
    )
  }

  return (
    // biome-ignore lint/performance/noImgElement: design assets skip the image optimizer
    <img
      src={stillSrc}
      alt={alt}
      width={DESIGN_MASTER_WIDTH}
      height={DESIGN_MASTER_WIDTH}
      sizes={sizes}
      srcSet={
        fullResolution
          ? `${stillSrc} ${DESIGN_MASTER_WIDTH}w`
          : designResponsiveSrcSet(stillSrc)
      }
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}

function LoopingVideo({
  src,
  poster,
  alt,
  className,
}: {
  src: string
  poster?: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    node.muted = true
    void node.play().catch(() => {})
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label={alt}
      draggable={false}
      className={className}
    />
  )
}
