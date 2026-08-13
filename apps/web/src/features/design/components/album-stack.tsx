"use client"

import type { Transition } from "motion/react"
import { FAN_COUNT, PHOTO_SIZES } from "../album"
import type { Design } from "../get-designs"
import { designImageLayoutId } from "../layout-ids"
import { prefetchAlbumThumbs } from "../prefetch"
import { AlbumPhoto } from "./album-photo"
import { DesignAsset } from "./design-asset"

const FAN_ROTATE = [2, -7, 6, -4]
const FAN_OFFSET = [
  { x: 0, y: 0 },
  { x: 12, y: 6 },
  { x: -10, y: 10 },
  { x: 8, y: 14 },
]

type AlbumStackProps = {
  design: Design
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
  isExpanded,
  isLcp,
  openAlbumLabel,
  shouldReduceMotion,
  layoutTransition,
  onExpand,
  registerCard,
}: AlbumStackProps) {
  return (
    <li className="min-w-0">
      <button
        ref={(el) => {
          if (!el) return
          registerCard(design.slug, el)
          return () => registerCard(design.slug, null)
        }}
        type="button"
        aria-label={openAlbumLabel}
        className="flex w-full flex-col gap-3 text-left outline-none focus:outline-none focus-visible:outline-none"
        onClick={() => onExpand(design.slug)}
        onPointerEnter={() => prefetchAlbumThumbs(design.images)}
        onFocus={() => prefetchAlbumThumbs(design.images)}
      >
        <div className="relative aspect-square overflow-visible p-3">
          {isExpanded
            ? null
            : design.images.map((image, index) => {
                const isFan = index < FAN_COUNT
                const isLcpCover = isLcp && index === 0

                if (!isFan) {
                  return (
                    <div
                      key={image.src}
                      aria-hidden
                      className="pointer-events-none absolute inset-10 opacity-0"
                    >
                      <DesignAsset
                        src={image.src}
                        alt=""
                        sizes={PHOTO_SIZES}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )
                }

                const rotate = shouldReduceMotion ? 0 : (FAN_ROTATE[index] ?? 0)
                const offset = shouldReduceMotion
                  ? { x: 0, y: 0 }
                  : (FAN_OFFSET[index] ?? { x: 0, y: 0 })

                return (
                  <div
                    key={image.src}
                    className="absolute inset-10"
                    style={{
                      zIndex: FAN_COUNT - index,
                      transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
                    }}
                  >
                    <AlbumPhoto
                      layoutId={designImageLayoutId(design.slug, image.name)}
                      src={image.src}
                      alt=""
                      sizes={PHOTO_SIZES}
                      layoutTransition={layoutTransition}
                      loading={isLcpCover ? "eager" : "lazy"}
                      fetchPriority={isLcpCover ? "high" : "low"}
                      className="bg-surface-alpha h-full w-full overflow-hidden shadow"
                    />
                  </div>
                )
              })}
        </div>
      </button>
    </li>
  )
}
