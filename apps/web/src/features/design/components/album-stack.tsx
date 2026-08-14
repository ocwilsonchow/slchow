"use client"

import { cn } from "@repo/ds"
import { motion, type Transition } from "motion/react"
import { useState } from "react"
import { FAN_COUNT, PHOTO_SIZES, STAGGER_EACH } from "../album"
import type { Design } from "../get-designs"
import { designImageLayoutId } from "../layout-ids"
import { prefetchAlbumThumbs } from "../prefetch"
import { useInView } from "../use-in-view"
import { AlbumPhoto } from "./album-photo"

const FAN_ROTATE = [2, -7, 6, -4]
const FAN_OFFSET = [
  { x: 0, y: 0 },
  { x: 12, y: 6 },
  { x: -10, y: 10 },
  { x: 8, y: 14 },
]

const UNFAN_ROTATE = [1, -16, 14]
const UNFAN_OFFSET = [
  { x: 0, y: 0 },
  { x: 28, y: 12 },
  { x: -24, y: 18 },
]

const UNFAN_TRANSITION: Transition = {
  type: "tween",
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1],
}

const STAGGER_DELAY = 0.5

type AlbumStackProps = {
  design: Design
  index: number
  isExpanded: boolean
  isInactive: boolean
  isReturning: boolean
  isLcp: boolean
  openAlbumLabel: string
  shouldReduceMotion: boolean
  layoutTransition: Transition
  onExpand: (slug: string) => void
  registerCard: (slug: string, el: HTMLButtonElement | null) => void
}

export function AlbumStack({
  design,
  index,
  isExpanded,
  isInactive,
  isReturning,
  isLcp,
  openAlbumLabel,
  shouldReduceMotion,
  layoutTransition,
  onExpand,
  registerCard,
}: AlbumStackProps) {
  const { ref, inView } = useInView<HTMLLIElement>()
  const [isPeeking, setIsPeeking] = useState(false)
  const peek = isPeeking && !shouldReduceMotion

  return (
    <li
      ref={ref}
      className={cn(
        "min-w-0",
        !shouldReduceMotion && "animate-album-stack-enter"
      )}
      style={
        shouldReduceMotion
          ? undefined
          : { animationDelay: `${STAGGER_DELAY + index * STAGGER_EACH}s` }
      }
    >
      <motion.div
        initial={false}
        animate={{ opacity: isInactive ? 0 : 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { ...layoutTransition, delay: 0.2 }
        }
      >
      <button
        ref={(el) => {
          if (!el) return
          registerCard(design.slug, el)
          return () => registerCard(design.slug, null)
        }}
        type="button"
        aria-label={openAlbumLabel}
        className={cn(
          "flex w-full flex-col gap-3 text-left outline-none focus:outline-none focus-visible:outline-none",
          isReturning && "relative z-60"
        )}
        onClick={() => {
          prefetchAlbumThumbs(design.images)
          onExpand(design.slug)
        }}
        onPointerEnter={() => {
          prefetchAlbumThumbs(design.images)
          setIsPeeking(true)
        }}
        onPointerLeave={() => setIsPeeking(false)}
        onFocus={(event) => {
          prefetchAlbumThumbs(design.images)
          if (event.currentTarget.matches(":focus-visible")) {
            setIsPeeking(true)
          }
        }}
        onBlur={() => setIsPeeking(false)}
      >
        <div className="relative aspect-square w-full overflow-visible p-3">
          {isExpanded
            ? null
            : design.images.map((image, imageIndex) => {
                const isFan = imageIndex < FAN_COUNT
                const isLcpCover = isLcp && imageIndex === 0
                const restRotate =
                  FAN_ROTATE[imageIndex % FAN_ROTATE.length] ?? 0
                const restOffset = FAN_OFFSET[imageIndex % FAN_OFFSET.length] ?? {
                  x: 0,
                  y: 0,
                }
                const unfanRotate = UNFAN_ROTATE[imageIndex] ?? restRotate
                const unfanOffset = UNFAN_OFFSET[imageIndex] ?? restOffset
                const pose =
                  shouldReduceMotion || isReturning
                    ? { x: 0, y: 0, rotate: 0 }
                    : peek && isFan
                      ? {
                          x: unfanOffset.x,
                          y: unfanOffset.y,
                          rotate: unfanRotate,
                        }
                      : {
                          x: restOffset.x,
                          y: restOffset.y,
                          rotate: restRotate,
                        }

                return (
                  <div
                    key={image.src}
                    aria-hidden={!isFan || undefined}
                    className="absolute inset-10 lg:inset-14"
                    style={{ zIndex: isFan ? FAN_COUNT - imageIndex : 0 }}
                  >
                    <motion.div
                      className="h-full w-full"
                      initial={false}
                      animate={pose}
                      transition={
                        shouldReduceMotion || isReturning
                          ? { duration: 0 }
                          : UNFAN_TRANSITION
                      }
                    >
                      <AlbumPhoto
                        layoutId={designImageLayoutId(design.slug, image.name)}
                        src={image.src}
                        alt=""
                        sizes={PHOTO_SIZES}
                        layoutTransition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                ...layoutTransition,
                                delay: imageIndex * STAGGER_EACH,
                              }
                        }
                        loading={isFan || isLcpCover ? "eager" : "lazy"}
                        fetchPriority={isLcpCover ? "high" : "low"}
                        decoding={isFan || isLcpCover ? "sync" : "async"}
                        kind={image.kind}
                        poster={image.poster}
                        playing={
                          !isReturning &&
                          imageIndex === 0 &&
                          image.kind === "video" &&
                          inView &&
                          !shouldReduceMotion
                        }
                        opacity={isFan ? undefined : 0}
                        className={
                          isFan
                            ? "bg-surface-card h-full w-full overflow-hidden shadow"
                            : "bg-surface-card pointer-events-none h-full w-full overflow-hidden"
                        }
                      />
                    </motion.div>
                  </div>
                )
              })}
        </div>
      </button>
      </motion.div>
    </li>
  )
}
