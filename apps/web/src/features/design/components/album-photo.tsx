"use client"

import { cn } from "@repo/ds"
import { motion, type Transition } from "motion/react"
import type { DesignImage } from "../get-designs"
import { DesignAsset } from "./design-asset"

export const ALBUM_PHOTO_RADIUS = 8

type AlbumPhotoProps = {
  src: string
  alt: string
  sizes: string
  layoutTransition: Transition
  className?: string
  layoutId?: string
  /** Interpolated during layout FLIP so hidden stack slots stay hidden. */
  opacity?: number
  x?: number
  y?: number
  rotate?: number
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  decoding?: "async" | "sync" | "auto"
  kind?: DesignImage["kind"]
  poster?: string
  playing?: boolean
}

/** Shared-element photo. Size comes from the parent; the img is in-flow so layout cannot collapse to 0. */
export function AlbumPhoto({
  src,
  alt,
  sizes,
  layoutTransition,
  className,
  layoutId,
  opacity,
  x,
  y,
  rotate,
  loading = "lazy",
  fetchPriority,
  decoding,
  kind,
  poster,
  playing = false,
}: AlbumPhotoProps) {
  const hasOpacity = opacity !== undefined
  const hasPose = x !== undefined || y !== undefined || rotate !== undefined
  const animate =
    hasOpacity || hasPose
      ? {
          ...(hasOpacity ? { opacity } : {}),
          ...(hasPose ? { x: x ?? 0, y: y ?? 0, rotate: rotate ?? 0 } : {}),
        }
      : undefined

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(className, kind === "video" && "bg-[#D0CFCF]")}
      style={{ borderRadius: ALBUM_PHOTO_RADIUS }}
      {...(animate
        ? { initial: false as const, animate }
        : {})}
      transition={layoutTransition}
    >
      <DesignAsset
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        kind={kind}
        poster={poster}
        playing={playing}
        className="h-full w-full object-contain select-none pointer-events-none"
      />
    </motion.div>
  )
}
