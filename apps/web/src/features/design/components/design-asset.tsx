"use client"

import { cn } from "@repo/ds/lib/utils"
import { useEffect, useRef } from "react"
import {
  DESIGN_MASTER_WIDTH,
  DESIGN_THUMB_FALLBACK_WIDTH,
  designResponsiveSrcSet,
  designThumbSrc,
} from "../asset-urls"

type DesignAssetProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  decoding?: "async" | "sync" | "auto"
  /** Skip thumbnail srcset and load the 2048 master (lightbox). */
  fullResolution?: boolean
  kind?: "image" | "video"
  /** Muted looping video when true; otherwise paused. */
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
  decoding = "async",
  fullResolution = false,
  kind = "image",
  playing = false,
}: DesignAssetProps) {
  if (kind === "video") {
    return (
      <LoopingVideo
        src={src}
        alt={alt}
        playing={playing}
        fetchPriority={fetchPriority}
        className={className}
      />
    )
  }

  // Fallback `src` when srcset is ignored; width hints intrinsic ratio (assets are square).
  const displaySrc = fullResolution
    ? src
    : designThumbSrc(src, DESIGN_THUMB_FALLBACK_WIDTH)
  const displayWidth = fullResolution
    ? DESIGN_MASTER_WIDTH
    : DESIGN_THUMB_FALLBACK_WIDTH

  return (
    // biome-ignore lint/performance/noImgElement: design assets skip the image optimizer
    <img
      src={displaySrc}
      alt={alt}
      width={displayWidth}
      height={displayWidth}
      sizes={sizes}
      srcSet={
        fullResolution
          ? `${src} ${DESIGN_MASTER_WIDTH}w`
          : designResponsiveSrcSet(src)
      }
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}

function LoopingVideo({
  src,
  alt,
  playing,
  fetchPriority,
  className,
}: {
  src: string
  alt: string
  playing: boolean
  fetchPriority?: "high" | "low" | "auto"
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // `muted` must be set before play(); autoplay rejection is ignored.
    node.muted = true
    if (playing) void node.play().catch(() => {})
    else node.pause()
  }, [playing])

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay={playing}
      preload={fetchPriority === "high" ? "auto" : "metadata"}
      // @ts-expect-error React types omit fetchPriority on <video>
      fetchPriority={fetchPriority}
      aria-label={alt}
      draggable={false}
      className={cn("h-full w-full object-contain p-2 sm:p-4", className)}
    />
  )
}
