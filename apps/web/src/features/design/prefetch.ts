import { DESIGN_THUMB_WIDTHS, designThumbSrc } from "./asset-urls"
import type { DesignImage } from "./get-designs"

const prefetched = new Set<string>()

function stillSrc(image: DesignImage) {
  return image.kind === "video" ? image.poster : image.src
}

/** Warm 400/800w thumbs for every still/poster the overlay and stack will request. */
export function prefetchAlbumThumbs(images: DesignImage[]) {
  for (const image of images) {
    const src = stillSrc(image)
    if (!src) continue
    for (const width of DESIGN_THUMB_WIDTHS) {
      const thumb = designThumbSrc(src, width)
      if (prefetched.has(thumb)) continue
      prefetched.add(thumb)
      const img = new Image()
      img.src = thumb
    }
  }
}
