import { readFile } from "node:fs/promises"
import { extname, join, resolve, sep } from "node:path"
import { designsDir } from "./get-designs"

const MIME_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
}

function resolveDesignPath(pathSegments: string[]) {
  if (pathSegments.length === 0 || pathSegments.some((segment) => !segment)) {
    return null
  }

  const root = resolve(designsDir)
  const filePath = resolve(join(root, ...pathSegments))
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`

  if (filePath !== root && !filePath.startsWith(prefix)) {
    return null
  }

  return filePath
}

export async function serveDesignImage(pathSegments: string[]) {
  const filePath = resolveDesignPath(pathSegments)
  if (!filePath) {
    return new Response("Not found", { status: 404 })
  }

  const contentType = MIME_TYPES[extname(filePath).toLowerCase()]
  if (!contentType) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const buffer = await readFile(filePath)
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
