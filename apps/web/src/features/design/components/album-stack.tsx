"use client"

import type { Transition } from "motion/react"
import type { Design } from "../get-designs"
import { designImageLayoutId } from "../layout-ids"
import { AlbumPhoto } from "./album-photo"

const FAN_COUNT = 4
const FAN_ROTATE = [2, -7, 6, -4]
const FAN_OFFSET = [
  { x: 0, y: 0 },
  { x: 12, y: 6 },
  { x: -10, y: 10 },
  { x: 8, y: 14 },
]

/** Matches the 2 / 3 / 4 stack grid. */
const STACK_SIZES = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"

const TITLE_CLASS = "font-semibold tracking-tight text-content-ink"

type AlbumStackProps = {
  design: Design
  isExpanded: boolean
  openAlbumLabel: string
  shouldReduceMotion: boolean
  layoutTransition: Transition
  onExpand: (slug: string) => void
  registerCard: (slug: string, el: HTMLButtonElement | null) => void
}

export function AlbumStack({
  design,
  isExpanded,
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
      >
        <div className="relative aspect-square overflow-visible p-3">
          {isExpanded
            ? null
            : design.images.map((image, index) => {
                const isFan = index < FAN_COUNT
                const rotate =
                  shouldReduceMotion || !isFan ? 0 : (FAN_ROTATE[index] ?? 0)
                const offset =
                  shouldReduceMotion || !isFan
                    ? { x: 0, y: 0 }
                    : (FAN_OFFSET[index] ?? { x: 0, y: 0 })

                return (
                  <div
                    key={image.src}
                    className="absolute inset-10"
                    style={{
                      zIndex: design.images.length - index,
                      transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
                    }}
                  >
                    <AlbumPhoto
                      layoutId={designImageLayoutId(design.slug, image.name)}
                      src={image.src}
                      alt=""
                      sizes={STACK_SIZES}
                      layoutTransition={layoutTransition}
                      className="bg-surface-alpha h-full w-full overflow-hidden shadow"
                    />
                  </div>
                )
              })}
        </div>
        <span className={TITLE_CLASS}>{design.title}</span>
      </button>
    </li>
  )
}
