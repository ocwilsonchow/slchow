export const DESIGN_THUMB_WIDTHS = [400, 800] as const
export const DESIGN_MASTER_WIDTH = 2048

export type DesignThumbWidth = (typeof DESIGN_THUMB_WIDTHS)[number]

/** Inserts `.w{width}` before the extension: `foo.webp` → `foo.w800.webp`. */
export function designThumbSrc(src: string, width: DesignThumbWidth) {
  return src.replace(/(\.[a-z0-9]+)$/i, `.w${width}$1`)
}

/** Gallery/stack/overlay only — no 2048 master, so srcset cannot miss prefetch. */
export function designResponsiveSrcSet(src: string) {
  return `${designThumbSrc(src, 400)} 400w, ${designThumbSrc(src, 800)} 800w`
}
