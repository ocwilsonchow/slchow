"use client"

import { useLenis } from "lenis/react"
import { CornerDownLeftIcon } from "lucide-react"
import {
  LayoutGroup,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import {
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHideNavbarForOverlay } from "@/features/layout/components/navbar"
import { usePathname, useRouter } from "@/i18n/navigation"
import { playClickSound } from "@/lib/click-sound"
import { ALBUM_SEARCH_PARAM, designAlbumHref } from "../album"
import type { Design } from "../get-designs"
import { AlbumOverlayGrid, DesignGallery } from "./design-gallery"

type DesignPageViewProps = {
  designs: Design[]
  designsTitle: string
  intro: string
  homeBack: ReactNode
}

export function DesignPageView(props: DesignPageViewProps) {
  return (
    <Suspense fallback={<DesignPageInner {...props} albumParam={null} />}>
      <DesignPageFromUrl {...props} />
    </Suspense>
  )
}

function DesignPageFromUrl(props: DesignPageViewProps) {
  const searchParams = useSearchParams()
  return (
    <DesignPageInner
      {...props}
      albumParam={searchParams.get(ALBUM_SEARCH_PARAM)}
    />
  )
}

type DesignPageInnerProps = DesignPageViewProps & {
  albumParam: string | null
}

function DesignPageInner({
  designs,
  designsTitle,
  intro,
  homeBack,
  albumParam,
}: DesignPageInnerProps) {
  const t = useTranslations("a11y")
  const tNav = useTranslations("navigation")
  const shouldReduceMotion = useReducedMotion() ?? false
  const lenis = useLenis()
  const router = useRouter()
  const pathname = usePathname()
  const backRef = useRef<HTMLButtonElement>(null)
  const cardRefs = useRef(new Map<string, HTMLButtonElement>())
  const previousSlugRef = useRef<string | null>(null)

  const albumFromUrl =
    designs.find((design) => design.slug === albumParam)?.slug ?? null
  const [expandedSlug, setExpandedSlug] = useState<string | null>(albumFromUrl)
  const [closingSlug, setClosingSlug] = useState<string | null>(null)
  const expandedSlugRef = useRef(expandedSlug)
  expandedSlugRef.current = expandedSlug
  const expandedAlbum = designs.find((design) => design.slug === expandedSlug)

  useEffect(() => {
    if (!albumFromUrl && expandedSlugRef.current) {
      setClosingSlug(expandedSlugRef.current)
    }
    if (albumFromUrl) setClosingSlug(null)
    setExpandedSlug(albumFromUrl)
  }, [albumFromUrl])

  useEffect(() => {
    if (expandedSlug || !closingSlug) return
    const timeout = window.setTimeout(
      () => setClosingSlug(null),
      shouldReduceMotion ? 0 : 400
    )
    return () => window.clearTimeout(timeout)
  }, [expandedSlug, closingSlug, shouldReduceMotion])

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
    const slug = expandedSlugRef.current
    if (slug) setClosingSlug(slug)
    setExpandedSlug(null)
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  const expand = useCallback(
    (slug: string) => {
      playClickSound()
      setClosingSlug(null)
      setExpandedSlug(slug)
      router.push(designAlbumHref(slug), { scroll: false })
    },
    [router]
  )

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
      const card = cardRefs.current.get(expandedSlug)
      card?.scrollIntoView({ block: "center", behavior: "auto" })
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
    if (!expandedAlbum && !closingSlug) return

    lenis?.stop()
    return () => {
      lenis?.start()
    }
  }, [expandedAlbum, closingSlug, lenis])

  const isExpanded = Boolean(expandedAlbum)
  useHideNavbarForOverlay(isExpanded)

  return (
    <LayoutGroup>
      <div inert={isExpanded} aria-hidden={isExpanded || undefined}>
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 0 : 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { ...layoutTransition, delay: isExpanded ? 0 : 0.1 }
          }
          className="lg:grid lg:grid-cols-2 sm:space-y-4 lg:relative p-5"
        >
          <div>{homeBack}</div>
          <div className="mt-10 lg:mt-0 grid gap-2">
            <h1 className="font-semibold tracking-tight text-content-ink">
              {designsTitle}
            </h1>
            <p className="leading-snug">{intro}</p>
          </div>
        </motion.div>

        <div className="p-5 pb-50">
          <DesignGallery
            designs={designs}
            expandedSlug={expandedSlug}
            returningSlug={closingSlug}
            openAlbumLabel={(title) => t("openAlbum", { title })}
            shouldReduceMotion={shouldReduceMotion}
            layoutTransition={layoutTransition}
            onExpand={expand}
            registerCard={registerCard}
          />
        </div>
      </div>

      {expandedAlbum ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={expandedAlbum.title}
          className="fixed inset-0 z-50"
          onClick={collapse}
        >
          <div
            className="relative z-10 h-full overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <div className="p-5">
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
            </div>
            <div className="p-5 pb-50">
              <AlbumOverlayGrid
                album={expandedAlbum}
                layoutTransition={layoutTransition}
              />
            </div>
          </div>
        </div>
      ) : null}
    </LayoutGroup>
  )
}
