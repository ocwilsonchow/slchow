"use client"

import { useLenis } from "lenis/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

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
    >
      <button
        type="button"
        aria-label={t("closeFullScreenImage")}
        className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className="m-auto h-full max-h-full w-full max-w-full object-contain select-none pointer-events-none"
      />
    </dialog>,
    document.body
  )
}
