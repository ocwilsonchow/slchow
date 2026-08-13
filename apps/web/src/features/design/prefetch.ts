import { FAN_COUNT } from "./album"
import { designThumbSrc } from "./asset-urls"
import type { DesignImage } from "./get-designs"

const prefetched = new Set<string>()

/** Warm 800w thumbs for photos that are not in the visible fan. */
export function prefetchAlbumThumbs(images: DesignImage[]) {
  for (const image of images.slice(FAN_COUNT)) {
    const src = designThumbSrc(image.src, 800)
    if (prefetched.has(src)) continue
    prefetched.add(src)
    const img = new Image()
    img.src = src
  }
}
