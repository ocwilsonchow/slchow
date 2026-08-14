"use client"

import { useLenis } from "lenis/react"
import { CornerDownLeftIcon } from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react"
import { useTranslations } from "next-intl"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHideNavbarForOverlay } from "@/features/layout/components/navbar"
import { playClickSound } from "@/lib/click-sound"
import type { Design } from "../get-designs"
import { AlbumOverlayGrid, DesignGallery } from "./design-gallery"

type DesignPageViewProps = {
  designs: Design[]
  designsTitle: string
  intro: string
  homeBack: ReactNode
}

export function DesignPageView({
  designs,
  designsTitle,
  intro,
  homeBack,
}: DesignPageViewProps) {
  const t = useTranslations("a11y")
  const tNav = useTranslations("navigation")
  const shouldReduceMotion = useReducedMotion() ?? false
  const lenis = useLenis()
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const cardRefs = useRef(new Map<string, HTMLButtonElement>())
  const previousSlugRef = useRef<string | null>(null)

  const expandedAlbum = designs.find((design) => design.slug === expandedSlug)
  const layoutTransition = useMemo<Transition>(
    () =>
      shouldReduceMotion
        ? { duration: 0 }
        : {
            type: "tween",
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1],
          },
    [shouldReduceMotion]
  )

  const collapse = useCallback(() => {
    playClickSound()
    setExpandedSlug(null)
  }, [])

  const expand = useCallback((slug: string) => {
    playClickSound()
    setExpandedSlug(slug)
  }, [])

  const registerCard = useCallback(
    (slug: string, el: HTMLButtonElement | null) => {
      if (el) cardRefs.current.set(slug, el)
      else cardRefs.current.delete(slug)
    },
    []
  )

  useEffect(() => {
    if (!expandedSlug) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [expandedSlug, collapse])

  useEffect(() => {
    const previousSlug = previousSlugRef.current
    previousSlugRef.current = expandedSlug

    if (expandedSlug) {
      const frame = requestAnimationFrame(() => {
        backRef.current?.focus({ preventScroll: true })
      })
      return () => cancelAnimationFrame(frame)
    }

    if (previousSlug) {
      const card = cardRefs.current.get(previousSlug)
      const frame = requestAnimationFrame(() => {
        card?.focus({ preventScroll: true })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [expandedSlug])

  useEffect(() => {
    if (!expandedAlbum) return

    lenis?.stop()
    return () => {
      lenis?.start()
    }
  }, [expandedAlbum, lenis])

  const isExpanded = Boolean(expandedAlbum)
  useHideNavbarForOverlay(isExpanded)

  return (
    <LayoutGroup>
      <div
        inert={isExpanded}
        aria-hidden={isExpanded || undefined}
        className={isExpanded ? "invisible" : undefined}
      >
        <div className="lg:grid lg:grid-cols-2 sm:space-y-4 lg:relative p-5">
          <div>{homeBack}</div>
          <div className="mt-10 lg:mt-0 grid gap-2">
            <h1 className="font-semibold tracking-tight text-content-ink">
              {designsTitle}
            </h1>
            <p className="leading-snug">{intro}</p>
          </div>
        </div>

        <div className="p-5 pb-50">
          <DesignGallery
            designs={designs}
            expandedSlug={expandedSlug}
            openAlbumLabel={(title) => t("openAlbum", { title })}
            shouldReduceMotion={shouldReduceMotion}
            layoutTransition={layoutTransition}
            onExpand={expand}
            registerCard={registerCard}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedAlbum ? (
          <motion.div
            key={expandedAlbum.slug}
            role="dialog"
            aria-modal="true"
            aria-label={expandedAlbum.title}
            className="fixed inset-0 z-50"
            layoutRoot
            initial={false}
            exit={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            onClick={collapse}
          >
            <motion.div
              className="bg-surface-canvas absolute inset-0"
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: shouldReduceMotion ? 1 : 0,
                transition: { delay: 0.2 },
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            />
            <motion.div
              className="relative z-10 h-full overflow-y-auto overscroll-contain"
              layoutScroll
              data-lenis-prevent
            >
              <motion.div
                className="p-5"
                initial={false}
                exit={{
                  opacity: 0,
                  transition: { duration: shouldReduceMotion ? 0 : 0.15 },
                }}
              >
                <button
                  ref={backRef}
                  type="button"
                  aria-label={t("backToAlbums")}
                  className="group hover:text-content-ink outline-none focus:outline-none focus-visible:outline-none"
                  onClick={(event) => {
                    event.stopPropagation()
                    collapse()
                  }}
                >
                  <CornerDownLeftIcon
                    size={10}
                    className="inline-block mr-1.5 group-hover:-translate-x-0.5"
                  />
                  {tNav("back")}
                </button>
              </motion.div>
              <div className="p-5 pb-50">
                <AlbumOverlayGrid
                  album={expandedAlbum}
                  layoutTransition={layoutTransition}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  )
}
