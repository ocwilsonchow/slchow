"use client"

import { useSyncExternalStore } from "react"

/** Touch phones/tablets — FLIP layout animations jank on coarse pointers. */
const COARSE_POINTER = "(pointer: coarse)"

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(COARSE_POINTER)
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

/** True on touch. SSR snapshot is `false` so markup assumes fine pointer until hydrate. */
export function useCoarsePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COARSE_POINTER).matches,
    () => false
  )
}
