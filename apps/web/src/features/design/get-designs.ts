import { readdirSync } from "node:fs"
import { extname, join } from "node:path"

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
])

export const designsDir = join(process.cwd(), "../../packages/content/design")

export type DesignImage = {
  name: string
  /** Public URL path under `public/design-assets` (synced from packages/content/design). */
  src: string
}

export type Design = {
  slug: string
  title: string
  images: DesignImage[]
}

function titleFromSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function listImages(slug: string): DesignImage[] {
  const dir = join(designsDir, slug)

  return readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({
      name,
      src: `/design-assets/${encodeURIComponent(slug)}/${encodeURIComponent(name)}`,
    }))
}

/** Designs under `packages/content/design`, one entry per non-empty project folder. */
export function getDesigns(): Design[] {
  return readdirSync(designsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const slug = entry.name
      return {
        slug,
        title: titleFromSlug(slug),
        images: listImages(slug),
      }
    })
    .filter((design) => design.images.length > 0)
    .sort((a, b) => a.title.localeCompare(b.title))
}
