"use client"

import { motion, type Transition } from "motion/react"
import { DesignAsset } from "./design-asset"

export const ALBUM_PHOTO_RADIUS = 4

type AlbumPhotoProps = {
  layoutId: string
  src: string
  alt: string
  sizes: string
  layoutTransition: Transition
  className?: string
}

/** Shared-element photo. Size comes from the parent; the img is in-flow so layout cannot collapse to 0. */
export function AlbumPhoto({
  layoutId,
  src,
  alt,
  sizes,
  layoutTransition,
  className,
}: AlbumPhotoProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={false}
      className={className}
      style={{ borderRadius: ALBUM_PHOTO_RADIUS }}
      transition={{ layout: layoutTransition }}
    >
      <DesignAsset
        src={src}
        alt={alt}
        sizes={sizes}
        loading="eager"
        fetchPriority="high"
        className="h-full w-full object-contain select-none pointer-events-none"
      />
    </motion.div>
  )
}
