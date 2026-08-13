"use client"

import { cn } from "@repo/ds"
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
  fadeIn?: boolean
  fadeDelay?: number
  shouldReduceMotion?: boolean
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
  fadeIn = false,
  fadeDelay = 0,
  shouldReduceMotion = false,
}: AlbumPhotoProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={
        fadeIn && !shouldReduceMotion ? { opacity: 0, scale: 0.96 } : false
      }
      animate={fadeIn ? { opacity: 1, scale: 1 } : undefined}
      className={cn(className, "transform-gpu")}
      style={{ borderRadius: ALBUM_PHOTO_RADIUS }}
      transition={
        fadeIn
          ? {
              duration: shouldReduceMotion ? 0 : 0.28,
              delay: fadeDelay,
              ease: [0.32, 0.72, 0, 1],
            }
          : { layout: layoutTransition }
      }
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
