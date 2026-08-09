"use client"

import { useEffect, useRef, useState } from "react"
import { DesignAsset } from "./design-asset"

type DesignImageProps = {
  src: string
  alt: string
  onOpen: () => void
  viewLabel: string
}

/** Lazy thumbnail — defers loading until near the viewport. */
export function DesignImage({ src, alt, onOpen, viewLabel }: DesignImageProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: "400px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      aria-label={viewLabel}
      className="relative h-full w-full cursor-zoom-in"
      onClick={onOpen}
    >
      {shouldLoad ? (
        <DesignAsset
          src={src}
          alt={alt}
          loading="lazy"
          fetchPriority="low"
          className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
        />
      ) : null}
    </button>
  )
}
