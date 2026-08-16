import { DESIGN_THUMB_PREFETCH_WIDTH, designThumbSrc } from "./asset-urls"
import type { DesignImage } from "./get-designs"

/** Session-lifetime URLs already warmed — hover/click/expand share this set. */
const prefetched = new Set<string>()

/** Warm the 800w thumb the overlay may request; smaller srcset picks are already on the stack. */
export function prefetchAlbumThumbs(images: DesignImage[]) {
  for (const image of images) {
    if (image.kind === "video") continue
    const src = image.src
    if (!src) continue
    const thumb = designThumbSrc(src, DESIGN_THUMB_PREFETCH_WIDTH)
    if (prefetched.has(thumb)) continue
    prefetched.add(thumb)
    const img = new Image()
    img.src = thumb
  }
}
