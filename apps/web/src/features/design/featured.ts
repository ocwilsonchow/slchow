import { getDesigns, type DesignImage } from "./get-designs"

export type FeaturedImage = DesignImage & { slug: string }

export type FeaturedAsset = {
  slug: string
  name: string
}

/** Swap these five `{ slug, name }` picks to change the homepage stack.
 *  Stills (`.webp`) or videos (`.mp4`; poster is the matching `.webp` in the same album).
 */
export const FEATURED_ASSETS: FeaturedAsset[] = [
  { slug: "001", name: "motion.mp4" },
  { slug: "02", name: "3d8c4d09.webp" },
  { slug: "00", name: "66493dbf.webp" },
  { slug: "09", name: "6c997ad9.webp" },
  { slug: "03", name: "e8ec15e5.webp" },
  { slug: "07", name: "1c6d1aed.webp" },
]

export function getFeaturedImages(): FeaturedImage[] {
  const designs = getDesigns()
  const bySlug = new Map(designs.map((design) => [design.slug, design]))

  return FEATURED_ASSETS.map(({ slug, name }) => {
    const image = bySlug.get(slug)?.images.find((item) => item.name === name)
    if (!image) {
      throw new Error(`Featured design missing: ${slug}/${name}`)
    }
    return { ...image, slug }
  })
}
