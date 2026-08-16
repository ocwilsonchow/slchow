/**
 * Shared album animation + image `sizes` constants.
 *
 * Fine-pointer FLIP morphs stack covers into overlay tiles. Those two trees
 * must request the same srcset candidate, or Motion interpolates between two
 * different decoded bitmaps.
 */

/** Query key for the open album on `/design`. */
export const ALBUM_SEARCH_PARAM = "album"

/** `/design?album={slug}` — overlay open state lives in the URL. */
export function designAlbumHref(slug: string) {
  return `/design?${ALBUM_SEARCH_PARAM}=${encodeURIComponent(slug)}`
}

/** Visible stacked covers that participate in the shared-element FLIP. */
export const FAN_COUNT = 3

/** Per-photo delay (seconds) for staggered layout open/close. */
export const STAGGER_EACH = 0.025

/** Overlay fade when shared-element FLIP is skipped (coarse pointer). */
export const CHEAP_MOTION_DURATION = 0.2

/** Collapsed homepage stack is `w-32` (128px). */
export const FEATURED_STACK_SIZES = "128px"

/**
 * Shared `sizes` for `/design` stack + overlay so FLIP keeps the same srcset
 * candidate. Caps at 5 columns (`AlbumOverlayGrid` is `xl:grid-cols-5`).
 *
 * Formula: `(100vw − page padding − gaps) / columns`
 * - `2.5rem` — page/overlay `p-5` (1.25rem left + 1.25rem right)
 * - `N rem`  — `gap-4` (1rem) × (columns − 1)
 *
 * Breakpoints (Tailwind sm 640 / md 768 / lg 1024):
 *   <640 → 2 cols, 640–767 → 3, 768–1023 → 4, ≥1024 → 5
 */
export const PHOTO_SIZES =
  "(max-width: 639px) calc((100vw - 2.5rem - 1rem) / 2), (max-width: 767px) calc((100vw - 2.5rem - 2rem) / 3), (max-width: 1023px) calc((100vw - 2.5rem - 3rem) / 4), calc((100vw - 2.5rem - 4rem) / 5)"

/**
 * Overlay `sizes` when photos are not FLIP-shared with the stack.
 *
 * Tells the browser the rendered tile width so it picks a srcset candidate
 * instead of assuming ~50vw. Formula:
 *   (100vw − page padding − gaps) / columns
 *
 * - `2.5rem` — overlay container `p-5` (1.25rem left + 1.25rem right)
 * - `N rem`  — `gap-4` (1rem) × (columns − 1)
 *
 * Breakpoints follow Tailwind (sm 640 / md 768 / lg 1024 / xl 1280):
 *   <640 → 2 cols, 640–767 → 3, 768–1023 → 4, 1024–1279 → 5, ≥1280 → 6
 */
export const OVERLAY_PHOTO_SIZES =
  "(max-width: 639px) calc((100vw - 2.5rem - 1rem) / 2), (max-width: 767px) calc((100vw - 2.5rem - 2rem) / 3), (max-width: 1023px) calc((100vw - 2.5rem - 3rem) / 4), (max-width: 1279px) calc((100vw - 2.5rem - 4rem) / 5), calc((100vw - 2.5rem - 5rem) / 6)"
