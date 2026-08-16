/**
 * Public URL helpers for synced design assets (`/design-assets/...`).
 * Gallery thumbs are `foo.w{width}.webp` beside the 2048 master `foo.webp`.
 * Widths cover overlay tiles (~160–400px CSS, up to 3x DPR) without pulling
 * the master into `srcset` (that would skip the hover-prefetch warm).
 */
export const DESIGN_THUMB_WIDTHS = [200, 320, 400, 800] as const
/** Lightbox only — not listed in gallery `srcset`. */
export const DESIGN_MASTER_WIDTH = 2048

export type DesignThumbWidth = (typeof DESIGN_THUMB_WIDTHS)[number]

/** Fallback `src` when `srcset` is ignored; also the 2x gallery thumb. */
export const DESIGN_THUMB_FALLBACK_WIDTH = 400 satisfies DesignThumbWidth
/** Overlay / 3x — the only extra URL hover-prefetch should warm. */
export const DESIGN_THUMB_PREFETCH_WIDTH = 800 satisfies DesignThumbWidth

/** Inserts `.w{width}` before the extension: `foo.webp` → `foo.w800.webp`. */
export function designThumbSrc(src: string, width: DesignThumbWidth) {
  return src.replace(/(\.[a-z0-9]+)$/i, `.w${width}$1`)
}

/** Gallery/stack/overlay only — no 2048 master, so srcset cannot miss prefetch. */
export function designResponsiveSrcSet(src: string) {
  return DESIGN_THUMB_WIDTHS.map(
    (width) => `${designThumbSrc(src, width)} ${width}w`
  ).join(", ")
}
