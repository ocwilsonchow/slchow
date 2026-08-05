"use client"

import { Lenis } from "lenis/react"
import { type ReactNode, useEffect, useState } from "react"

/** Mounts Lenis only when the user has not requested reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setEnabled(!mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  if (!enabled) {
    return children
  }

  return <Lenis root>{children}</Lenis>
}
