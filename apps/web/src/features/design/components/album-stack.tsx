"use client"

import { cn } from "@repo/ds"
import type { Transition } from "motion/react"
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

const STAGGER_DELAY = 0.5

type AlbumStackProps = {
  design: Design
  index: number
  isExpanded: boolean
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
  isLcp,
  openAlbumLabel,
  shouldReduceMotion,
  layoutTransition,
  onExpand,
  registerCard,
}: AlbumStackProps) {
  const { ref, inView } = useInView<HTMLLIElement>()

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
      <button
        ref={(el) => {
          if (!el) return
          registerCard(design.slug, el)
          return () => registerCard(design.slug, null)
        }}
        type="button"
        aria-label={openAlbumLabel}
        className="flex w-full flex-col gap-3 text-left outline-none focus:outline-none focus-visible:outline-none"
        onClick={() => {
          prefetchAlbumThumbs(design.images)
          onExpand(design.slug)
        }}
        onPointerEnter={() => prefetchAlbumThumbs(design.images)}
        onFocus={() => prefetchAlbumThumbs(design.images)}
      >
        <div className="relative aspect-square overflow-visible p-3">
          {isExpanded
            ? null
            : design.images.map((image, imageIndex) => {
                const isFan = imageIndex < FAN_COUNT
                const isLcpCover = isLcp && imageIndex === 0
                const rotate =
                  shouldReduceMotion || !isFan
                    ? 0
                    : (FAN_ROTATE[imageIndex] ?? 0)
                const offset =
                  shouldReduceMotion || !isFan
                    ? { x: 0, y: 0 }
                    : (FAN_OFFSET[imageIndex] ?? { x: 0, y: 0 })

                return (
                  <div
                    key={image.src}
                    aria-hidden={!isFan || undefined}
                    className="absolute inset-10"
                    style={{
                      zIndex: isFan ? FAN_COUNT - imageIndex : 0,
                      transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
                    }}
                  >
                    <AlbumPhoto
                      layoutId={designImageLayoutId(design.slug, image.name)}
                      src={image.src}
                      alt=""
                      sizes={PHOTO_SIZES}
                      layoutTransition={{
                        ...layoutTransition,
                        delay: shouldReduceMotion
                          ? 0
                          : (design.images.length - 1 - imageIndex) *
                            STAGGER_EACH,
                      }}
                      loading={isLcpCover ? "eager" : "lazy"}
                      fetchPriority={isLcpCover ? "high" : "low"}
                      kind={image.kind}
                      poster={image.poster}
                      playing={
                        imageIndex === 0 &&
                        image.kind === "video" &&
                        inView &&
                        !shouldReduceMotion
                      }
                      className={
                        isFan
                          ? "bg-surface-card h-full w-full overflow-hidden shadow"
                          : "bg-surface-card pointer-events-none h-full w-full overflow-hidden opacity-0"
                      }
                    />
                  </div>
                )
              })}
        </div>
      </button>
    </li>
  )
}
