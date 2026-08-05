"use client"

import { cn } from "@repo/ds"
import Image, { type ImageProps } from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type MDXImageProps = Omit<ImageProps, "alt"> & {
  alt?: string
}

export function MDXImage({ className, alt = "", ...props }: MDXImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        aria-label={alt ? `View ${alt} full screen` : "View image full screen"}
        className="block w-full cursor-zoom-in outline-none focus-visible:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <Image
          alt={alt}
          sizes="(max-width: 768px) 100vw, 720px"
          className={cn("h-auto w-full rounded-xl border", className)}
          {...props}
        />
      </button>

      {isOpen
        ? createPortal(
            <dialog
              ref={dialogRef}
              aria-label={alt || "Full-screen image"}
              className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/90 p-4 backdrop:bg-black/90"
              onClose={() => setIsOpen(false)}
              onClick={(event) => {
                if (event.target === event.currentTarget) setIsOpen(false)
              }}
            >
              <button
                type="button"
                aria-label="Close full-screen image"
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
