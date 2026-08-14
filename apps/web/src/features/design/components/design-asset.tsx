"use client"

import { useEffect, useRef } from "react"
import { DESIGN_MASTER_WIDTH, designResponsiveSrcSet, designThumbSrc } from "../asset-urls"
import { cn } from "@repo/ds/lib/utils"

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
  decoding = "async",
  fullResolution = false,
  kind = "image",
  poster,
  playing = false,
}: DesignAssetProps) {
  const stillSrc = kind === "video" ? poster : src

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

  const displaySrc = fullResolution
    ? stillSrc
    : designThumbSrc(stillSrc, 800)
  const displayWidth = fullResolution ? DESIGN_MASTER_WIDTH : 800

  const still = (
    // biome-ignore lint/performance/noImgElement: design assets skip the image optimizer
    <img
      src={displaySrc}
      alt={alt}
      width={displayWidth}
      height={displayWidth}
      sizes={sizes}
      srcSet={
        fullResolution
          ? `${stillSrc} ${DESIGN_MASTER_WIDTH}w`
          : designResponsiveSrcSet(stillSrc)
      }
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      draggable={false}
      className={
        kind === "video"
          ? "h-full w-full object-contain select-none pointer-events-none"
          : className
      }
    />
  )

  if (kind !== "video") {
    return still
  }

  return (
    <div className={cn("relative", className)}>
      {still}
      {playing ? (
        <LoopingVideo
          src={src}
          poster={poster}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain p-2 sm:p-4"
        />
      ) : null}
    </div>
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
