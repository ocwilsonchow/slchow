"use client"

/**
 * `/design` grids: collapsed album stacks, and the expanded overlay photo grid.
 * Overlay uses `PHOTO_SIZES` when FLIP-sharing with the stack, else `OVERLAY_PHOTO_SIZES`.
 */
import { motion, type Transition } from "motion/react"
import { OVERLAY_PHOTO_SIZES, PHOTO_SIZES, STAGGER_EACH } from "../album"
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
  sharedLayout: boolean
  layoutTransition: Transition
  onExpand: (slug: string) => void
  registerCard: (slug: string, el: HTMLButtonElement | null) => void
}

/** Collapsed album grid. First card is LCP; `returningSlug` is the album mid-close FLIP. */
export function DesignGallery({
  designs,
  expandedSlug,
  returningSlug,
  openAlbumLabel,
  shouldReduceMotion,
  sharedLayout,
  layoutTransition,
  onExpand,
  registerCard,
}: DesignGalleryProps) {
  return (
    <motion.ul
      // Don't inherit the overlay FLIP tween onto the grid itself.
      transition={{}}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 max-w-[140rem] mx-auto"
    >
      {designs.map((design, index) => (
        <AlbumStack
          key={design.slug}
          design={design}
          index={index}
          isExpanded={design.slug === expandedSlug}
          // Fade other stacks while one album is open.
          isInactive={expandedSlug != null && design.slug !== expandedSlug}
          isReturning={design.slug === returningSlug}
          isLcp={index === 0}
          openAlbumLabel={openAlbumLabel(design.title)}
          shouldReduceMotion={shouldReduceMotion}
          sharedLayout={sharedLayout}
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
  shouldReduceMotion: boolean
  sharedLayout: boolean
}

/** Expanded album photos. Unmounted on FLIP close so tiles morph back into the stack. */
export function AlbumOverlayGrid({
  album,
  layoutTransition,
  shouldReduceMotion,
  sharedLayout,
}: AlbumOverlayGridProps) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
      {album.images.map((image, imageIndex) => (
        <AlbumOverlayTile
          key={image.src}
          album={album}
          image={image}
          imageIndex={imageIndex}
          layoutTransition={layoutTransition}
          shouldReduceMotion={shouldReduceMotion}
          sharedLayout={sharedLayout}
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
  shouldReduceMotion: boolean
  sharedLayout: boolean
}

function AlbumOverlayTile({
  album,
  image,
  imageIndex,
  layoutTransition,
  shouldReduceMotion,
  sharedLayout,
}: AlbumOverlayTileProps) {
  const { ref, inView } = useInView<HTMLLIElement>()
  const playing = image.kind === "video" && inView && !shouldReduceMotion
  const alt = `${album.title} — ${image.name}`
  // First ~two rows of a 2–3 col grid; shared-layout tiles are all eager for FLIP.
  const inFirstRows = imageIndex < 6

  return (
    <li ref={ref} className="aspect-square">
      <AlbumPhoto
        layoutId={
          sharedLayout ? designImageLayoutId(album.slug, image.name) : undefined
        }
        src={image.src}
        alt={alt}
        // Same srcset as the stack during FLIP; denser overlay grid otherwise.
        sizes={sharedLayout ? PHOTO_SIZES : OVERLAY_PHOTO_SIZES}
        layoutTransition={{
          ...layoutTransition,
          delay: shouldReduceMotion ? 0 : imageIndex * STAGGER_EACH,
        }}
        loading={sharedLayout || inFirstRows ? "eager" : "lazy"}
        decoding={sharedLayout ? "sync" : "async"}
        kind={image.kind}
        playing={playing}
        className="bg-surface-card h-full w-full overflow-hidden"
      />
    </li>
  )
}
