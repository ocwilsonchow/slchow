/** Visible stacked covers that participate in the shared-element FLIP. */
export const FAN_COUNT = 3

/** Per-photo delay (seconds) for staggered layout open/close. */
export const STAGGER_EACH = 0.025

/**
 * Shared `sizes` for stack + overlay so the browser keeps the same srcset
 * candidate during the layout animation.
 */
export const PHOTO_SIZES =
  "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
