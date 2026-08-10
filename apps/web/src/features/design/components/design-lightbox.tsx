"use client"

import { useLenis } from "lenis/react"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { DesignAsset } from "./design-asset"

type DesignLightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

/** Single shared lightbox — mounted only while open. */
export function DesignLightbox({ src, alt, onClose }: DesignLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const t = useTranslations("a11y")

  useEffect(() => {
    lenis?.stop()
    return () => {
      lenis?.start()
    }
  }, [lenis])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={alt || t("fullScreenImage")}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/40 p-4 backdrop:bg-black/50 backdrop-blur-sm"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
    >
      <button
        type="button"
        aria-label={t("closeFullScreenImage")}
        className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full outline-none focus:outline-none"
        onClick={onClose}
      >
        <XIcon size={18} strokeWidth={4} />
      </button>
      <DesignAsset
        src={src}
        alt={alt}
        sizes="100vw"
        className="object-contain select-none pointer-events-none"
      />
    </dialog>,
    document.body
  )
}
