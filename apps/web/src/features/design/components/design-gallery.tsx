"use client"

import { motion, type Transition, useReducedMotion } from "motion/react"
import { PHOTO_SIZES, STAGGER_EACH } from "../album"
import type { Design, DesignImage } from "../get-designs"
import { designImageLayoutId } from "../layout-ids"
import { useInView } from "../use-in-view"
import { AlbumPhoto } from "./album-photo"
import { AlbumStack } from "./album-stack"

type DesignGalleryProps = {
  designs: Design[]
  expandedSlug: string | null
  returningSlug: string | null
  openAlbumLabel: (title: string) => string
  shouldReduceMotion: boolean
  layoutTransition: Transition
  onExpand: (slug: string) => void
  registerCard: (slug: string, el: HTMLButtonElement | null) => void
}

export function DesignGallery({
  designs,
  expandedSlug,
  returningSlug,
  openAlbumLabel,
  shouldReduceMotion,
  layoutTransition,
  onExpand,
  registerCard,
}: DesignGalleryProps) {
  return (
    <motion.ul
      transition={{}}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
    >
      {designs.map((design, index) => (
        <AlbumStack
          key={design.slug}
          design={design}
          index={index}
          isExpanded={design.slug === expandedSlug}
          isInactive={expandedSlug != null && design.slug !== expandedSlug}
          isReturning={design.slug === returningSlug}
          isLcp={index === 0}
          openAlbumLabel={openAlbumLabel(design.title)}
          shouldReduceMotion={shouldReduceMotion}
          layoutTransition={layoutTransition}
          onExpand={onExpand}
          registerCard={registerCard}
        />
      ))}
    </motion.ul>
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
      {album.images.map((image, imageIndex) => (
        <AlbumOverlayTile
          key={image.src}
          album={album}
          image={image}
          imageIndex={imageIndex}
          layoutTransition={layoutTransition}
        />
      ))}
    </ul>
  )
}

type AlbumOverlayTileProps = {
  album: Design
  image: DesignImage
  imageIndex: number
  layoutTransition: Transition
}

function AlbumOverlayTile({
  album,
  image,
  imageIndex,
  layoutTransition,
}: AlbumOverlayTileProps) {
  const { ref, inView } = useInView<HTMLLIElement>()
  const shouldReduceMotion = useReducedMotion() ?? false
  const playing = image.kind === "video" && inView && !shouldReduceMotion
  const alt = `${album.title} — ${image.name}`

  return (
    <li ref={ref} className="aspect-square">
      <AlbumPhoto
        layoutId={designImageLayoutId(album.slug, image.name)}
        src={image.src}
        alt={alt}
        sizes={PHOTO_SIZES}
        layoutTransition={{
          ...layoutTransition,
          delay: shouldReduceMotion ? 0 : imageIndex * STAGGER_EACH,
        }}
        kind={image.kind}
        poster={image.poster}
        playing={playing}
        className="bg-surface-card h-full w-full overflow-hidden"
      />
    </li>
  )
}
