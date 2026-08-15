/** Query key for the open album on `/design`. */
export const ALBUM_SEARCH_PARAM = "album"

export function designAlbumHref(slug: string) {
  return `/design?${ALBUM_SEARCH_PARAM}=${encodeURIComponent(slug)}`
}

/** Visible stacked covers that participate in the shared-element FLIP. */
export const FAN_COUNT = 3

/** Per-photo delay (seconds) for staggered layout open/close. */
export const STAGGER_EACH = 0.025

/** Overlay fade when shared-element FLIP is skipped (coarse pointer). */
export const CHEAP_MOTION_DURATION = 0.2

/**
 * Shared `sizes` for stack + overlay so the browser keeps the same srcset
 * candidate during the layout animation.
 */
export const PHOTO_SIZES =
  "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"

/** Overlay grid columns — used when photos are not FLIP-shared with the stack. */
export const OVERLAY_PHOTO_SIZES =
  "(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
