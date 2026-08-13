"use client"

import { useEffect, useRef, useState } from "react"
import { DesignAsset } from "./design-asset"

type DesignImageProps = {
  src: string
  alt: string
  sizes: string
  eager?: boolean
}

/** Lazy thumbnail — defers loading until near the viewport unless `eager`. */
export function DesignImage({
  src,
  alt,
  sizes,
  eager = false,
}: DesignImageProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shouldLoad, setShouldLoad] = useState(eager)

  useEffect(() => {
    if (eager) {
      setShouldLoad(true)
      return
    }

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
  }, [eager])

  return (
    <span ref={ref} className="absolute inset-0 block">
      {shouldLoad ? (
        <DesignAsset
          src={src}
          alt={alt}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "low"}
          className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
        />
      ) : null}
    </span>
  )
}
