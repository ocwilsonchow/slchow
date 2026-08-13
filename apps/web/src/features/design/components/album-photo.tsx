"use client"

import { motion, type Transition } from "motion/react"
import { DesignAsset } from "./design-asset"

export const ALBUM_PHOTO_RADIUS = 4

type AlbumPhotoProps = {
  src: string
  alt: string
  sizes: string
  layoutTransition: Transition
  className?: string
  layoutId?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
}

/** Shared-element photo. Size comes from the parent; the img is in-flow so layout cannot collapse to 0. */
export function AlbumPhoto({
  src,
  alt,
  sizes,
  layoutTransition,
  className,
  layoutId,
  loading = "lazy",
  fetchPriority,
}: AlbumPhotoProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      style={{ borderRadius: ALBUM_PHOTO_RADIUS }}
      transition={{ layout: layoutTransition }}
    >
      <DesignAsset
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        className="h-full w-full object-contain select-none pointer-events-none"
      />
    </motion.div>
  )
}
