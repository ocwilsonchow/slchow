"use client"

import { type Variants, motion, useInView } from "motion/react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"
import type { Design } from "../get-designs"
import { DesignImage } from "./design-image"
import { DesignLightbox } from "./design-lightbox"

type ActiveImage = {
  src: string
  alt: string
}

type DesignGalleryProps = {
  designs: Design[]
}

type DesignGalleryItemProps = {
  src: string
  alt: string
  viewLabel: string
  onOpen: () => void
}

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.25, duration: 0.5 } },
}

function DesignGalleryItem({
  src,
  alt,
  viewLabel,
  onOpen,
}: DesignGalleryItemProps) {
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref)

  return (
    <motion.li
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-surface-alpha overflow-hidden rounded aspect-square relative [content-visibility:auto] [contain-intrinsic-size:auto_180px]"
    >
      <DesignImage src={src} alt={alt} viewLabel={viewLabel} onOpen={onOpen} />
    </motion.li>
  )
}

export function DesignGallery({ designs }: DesignGalleryProps) {
  const t = useTranslations("a11y")
  const [active, setActive] = useState<ActiveImage | null>(null)

  return (
    <>
      <div className="flex flex-col gap-12 pb-50">
        {designs.map((design) => (
          <section key={design.slug} className="flex flex-col gap-3">
            <h2 className="font-semibold tracking-tight text-content-ink">
              {design.title}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {design.images.map((image) => {
                const alt = `${design.title} — ${image.name}`
                return (
                  <DesignGalleryItem
                    key={image.src}
                    src={image.src}
                    alt={alt}
                    viewLabel={t("viewImageNamed", { alt })}
                    onOpen={() => setActive({ src: image.src, alt })}
                  />
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      {active ? (
        <DesignLightbox
          src={active.src}
          alt={active.alt}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  )
}
