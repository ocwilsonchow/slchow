"use client"

import Image from "next/image"

type DesignAssetProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
}

/** Design media via `next/image` (`fill` + caller-provided `sizes`). */
export function DesignAsset({
  src,
  alt,
  sizes,
  className,
  loading,
  fetchPriority,
}: DesignAssetProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={loading}
      fetchPriority={fetchPriority}
      draggable={false}
      className={className}
    />
  )
}
