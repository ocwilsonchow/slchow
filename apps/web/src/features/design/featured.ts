import { getDesigns, type DesignImage } from "./get-designs"

export type FeaturedImage = DesignImage & { slug: string }

/** One cover per album: the file whose name starts with `*`. */
export function getFeaturedImages(): FeaturedImage[] {
  return getDesigns().flatMap((design) => {
    const image = design.images.find((item) => item.name.startsWith("*"))
    return image ? [{ ...image, slug: design.slug }] : []
  })
}
