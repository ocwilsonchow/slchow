"use client"

import type { Transition } from "motion/react"
import type { Design } from "../get-designs"
import { designImageLayoutId } from "../layout-ids"
import { AlbumPhoto } from "./album-photo"
import { AlbumStack } from "./album-stack"

/** Matches the expanded album grid: 3 / 4 / 5 / 6 columns. */
const GRID_SIZES =
  "(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 17vw"

type DesignGalleryProps = {
  designs: Design[]
  expandedSlug: string | null
  openAlbumLabel: (title: string) => string
  shouldReduceMotion: boolean
  layoutTransition: Transition
  onExpand: (slug: string) => void
  registerCard: (slug: string, el: HTMLButtonElement | null) => void
}

export function DesignGallery({
  designs,
  expandedSlug,
  openAlbumLabel,
  shouldReduceMotion,
  layoutTransition,
  onExpand,
  registerCard,
}: DesignGalleryProps) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
      {designs.map((design) => (
        <AlbumStack
          key={design.slug}
          design={design}
          isExpanded={design.slug === expandedSlug}
          openAlbumLabel={openAlbumLabel(design.title)}
          shouldReduceMotion={shouldReduceMotion}
          layoutTransition={layoutTransition}
          onExpand={onExpand}
          registerCard={registerCard}
        />
      ))}
    </ul>
  )
}

type AlbumOverlayGridProps = {
  album: Design
  layoutTransition: Transition
}

export function AlbumOverlayGrid({
  album,
  layoutTransition,
}: AlbumOverlayGridProps) {
  return (
    <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {album.images.map((image) => {
        const alt = `${album.title} — ${image.name}`

        return (
          <li key={image.src} className="aspect-square">
            <AlbumPhoto
              layoutId={designImageLayoutId(album.slug, image.name)}
              src={image.src}
              alt={alt}
              sizes={GRID_SIZES}
              layoutTransition={layoutTransition}
              className="bg-surface-alpha h-full w-full overflow-hidden"
            />
          </li>
        )
      })}
    </ul>
  )
}
