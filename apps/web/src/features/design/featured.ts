import { type DesignImage, getDesigns } from "./get-designs"

export type FeaturedImage = DesignImage & { slug: string }

/**
 * Homepage stack: one cover per album. Pin a file by prefixing its name with
 * `*` (stripped for video/poster pairing in `get-designs`).
 */
export function getFeaturedImages(): FeaturedImage[] {
  return getDesigns().flatMap((design) => {
    const image = design.images.find((item) => item.name.startsWith("*"))
    return image ? [{ ...image, slug: design.slug }] : []
  })
}
