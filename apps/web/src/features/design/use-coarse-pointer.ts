"use client"

import { useSyncExternalStore } from "react"

const COARSE_POINTER = "(pointer: coarse)"

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(COARSE_POINTER)
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

/** Touch phones/tablets — skip shared-element layout animations. */
export function useCoarsePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COARSE_POINTER).matches,
    () => false
  )
}
