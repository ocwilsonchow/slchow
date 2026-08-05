"use client"

import { cn } from "@repo/ds"
import { useLenis } from "lenis/react"
import Image, { type ImageProps } from "next/image"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type MDXImageProps = Omit<ImageProps, "alt"> & {
  alt?: string
}

export function MDXImage({ className, alt = "", ...props }: MDXImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const lenis = useLenis()
  const t = useTranslations("a11y")

  useEffect(() => {
    if (!isOpen) return

    lenis?.stop()

    return () => {
      lenis?.start()
    }
  }, [isOpen, lenis])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const viewLabel = alt ? t("viewImageNamed", { alt }) : t("viewImage")

  return (
    <>
      <button
        type="button"
        aria-label={viewLabel}
        className="block w-full cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <Image
          alt={alt}
          sizes="(max-width: 768px) 100vw, 720px"
          className={cn(
            "h-auto w-full rounded-xl border bg-surface-alpha",
            className
          )}
          {...props}
        />
      </button>

      {isOpen
        ? createPortal(
            <dialog
              ref={dialogRef}
              aria-label={alt || t("fullScreenImage")}
              className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/40 p-4 backdrop:bg-black/50 backdrop-blur-sm"
              onClose={() => setIsOpen(false)}
              onClick={(event) => {
                if (event.target === event.currentTarget) setIsOpen(false)
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false)
              }}
            >
              <button
                type="button"
                aria-label={t("closeFullScreenImage")}
                className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80"
                onClick={() => setIsOpen(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <Image
                alt={alt}
                sizes="100vw"
                className="m-auto h-full max-h-full w-full max-w-full object-contain"
                {...props}
              />
            </dialog>,
            document.body
          )
        : null}
    </>
  )
}
