import { FAN_COUNT } from "./album"
import { designThumbSrc } from "./asset-urls"
import type { DesignImage } from "./get-designs"

const prefetched = new Set<string>()

function stillSrc(image: DesignImage) {
  return image.kind === "video" ? image.poster : image.src
}

/** Warm 800w thumbs for stills/posters that are not in the visible fan. */
export function prefetchAlbumThumbs(images: DesignImage[]) {
  for (const image of images.slice(FAN_COUNT)) {
    const src = stillSrc(image)
    if (!src) continue
    const thumb = designThumbSrc(src, 800)
    if (prefetched.has(thumb)) continue
    prefetched.add(thumb)
    const img = new Image()
    img.src = thumb
  }
}
