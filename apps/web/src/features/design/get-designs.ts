import { readdirSync } from "node:fs"
import { extname, join } from "node:path"

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
])

export const designsDir = join(process.cwd(), "../../packages/content/design")

export type DesignImage = {
  name: string
  /** Public URL path under `public/design-assets` (synced from packages/content/design). */
  src: string
  kind: "image" | "video"
  /** WebP poster for videos (`foo.mp4` → `foo.webp`). */
  poster?: string
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

function publicSrc(slug: string, name: string) {
  return `/design-assets/${encodeURIComponent(slug)}/${encodeURIComponent(name)}`
}

function stemOf(name: string) {
  const ext = extname(name)
  return name.slice(0, -ext.length)
}

/** Stem used to pair videos with posters; ignores a leading `*` pin. */
function pairingStem(name: string) {
  const stem = stemOf(name)
  return stem.startsWith("*") ? stem.slice(1) : stem
}

function listImages(slug: string): DesignImage[] {
  const dir = join(designsDir, slug)
  const files = readdirSync(dir)
  const videoStems = new Set(
    files
      .filter((file) => extname(file).toLowerCase() === ".mp4")
      .map((file) => pairingStem(file))
  )

  return files
    .filter((file) => {
      const ext = extname(file).toLowerCase()
      if (ext === ".mp4") return true
      if (!IMAGE_EXTENSIONS.has(ext)) return false
      return !videoStems.has(pairingStem(file))
    })
    .map((name) => {
      const ext = extname(name).toLowerCase()
      if (ext === ".mp4") {
        const posterName = files.find(
          (file) =>
            IMAGE_EXTENSIONS.has(extname(file).toLowerCase()) &&
            pairingStem(file) === pairingStem(name)
        )
        return {
          name,
          src: publicSrc(slug, name),
          kind: "video" as const,
          poster: posterName ? publicSrc(slug, posterName) : undefined,
        }
      }

      return {
        name,
        src: publicSrc(slug, name),
        kind: "image" as const,
      }
    })
    .sort((a, b) => {
      const aPinned = a.name.startsWith("*")
      const bPinned = b.name.startsWith("*")
      if (aPinned !== bPinned) return aPinned ? -1 : 1
      if (a.kind !== b.kind) return a.kind === "video" ? -1 : 1
      return a.name.localeCompare(b.name, undefined, { numeric: true })
    })
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
