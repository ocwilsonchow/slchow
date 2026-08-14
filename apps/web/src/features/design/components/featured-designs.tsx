"use client"

import { cn } from "@repo/ds"
import { useLenis } from "lenis/react"
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CornerDownLeftIcon,
} from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react"
import { useTranslations } from "next-intl"
import {
  createContext,
  type ReactNode,
  type RefObject,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHideNavbarForOverlay } from "@/features/layout/components/navbar"
import { Link } from "@/i18n/navigation"
import { playClickSound } from "@/lib/click-sound"
import { designAlbumHref, PHOTO_SIZES, STAGGER_EACH } from "../album"
import type { DesignImage } from "../get-designs"
import { featuredImageLayoutId } from "../layout-ids"
import { prefetchAlbumThumbs } from "../prefetch"
import { useInView } from "../use-in-view"
import { AlbumPhoto } from "./album-photo"

type FeaturedImage = DesignImage & { slug: string }

const REST_ROTATE = [2, -7, 6, -4, 5]
const REST_OFFSET = [
  { x: 0, y: 0 },
  { x: 12, y: 6 },
  { x: -10, y: 10 },
  { x: 8, y: 14 },
  { x: -6, y: 18 },
]

const UNFAN_ROTATE = [1, -16, 14, -12, 12]
const UNFAN_OFFSET = [
  { x: 0, y: 0 },
  { x: 28, y: 12 },
  { x: -24, y: 18 },
  { x: 20, y: 26 },
  { x: -16, y: 32 },
]

const UNFAN_TRANSITION: Transition = {
  type: "tween",
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1],
}

type FeaturedDesignsContextValue = {
  images: FeaturedImage[]
  assetCount: number
  isExpanded: boolean
  shouldReduceMotion: boolean
  layoutTransition: Transition
  expand: () => void
  stackRef: RefObject<HTMLButtonElement | null>
}

const FeaturedDesignsContext =
  createContext<FeaturedDesignsContextValue | null>(null)

function useFeaturedDesigns() {
  const value = use(FeaturedDesignsContext)
  if (!value) {
    throw new Error("FeaturedStack must be used within FeaturedDesigns")
  }
  return value
}

type FeaturedDesignsProps = {
  images: FeaturedImage[]
  assetCount: number
  children: ReactNode
}

export function FeaturedDesigns({
  images,
  assetCount,
  children,
}: FeaturedDesignsProps) {
  const t = useTranslations("a11y")
  const tNav = useTranslations("navigation")
  const tDesigns = useTranslations("designs")
  const shouldReduceMotion = useReducedMotion() ?? false
  const lenis = useLenis()
  const [isExpanded, setIsExpanded] = useState(false)
  const backRef = useRef<HTMLButtonElement>(null)
  const stackRef = useRef<HTMLButtonElement>(null)
  const wasExpandedRef = useRef(false)
  useHideNavbarForOverlay(isExpanded)

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
    setIsExpanded(false)
  }, [])

  const expand = useCallback(() => {
    playClickSound()
    prefetchAlbumThumbs(images)
    setIsExpanded(true)
  }, [images])

  useEffect(() => {
    if (!isExpanded) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isExpanded, collapse])

  useEffect(() => {
    if (isExpanded) {
      wasExpandedRef.current = true
      const frame = requestAnimationFrame(() => {
        backRef.current?.focus({ preventScroll: true })
      })
      return () => cancelAnimationFrame(frame)
    }

    if (wasExpandedRef.current) {
      const frame = requestAnimationFrame(() => {
        stackRef.current?.focus({ preventScroll: true })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [isExpanded])

  useEffect(() => {
    if (!isExpanded) return

    lenis?.stop()
    return () => {
      lenis?.start()
    }
  }, [isExpanded, lenis])

  const contextValue = useMemo<FeaturedDesignsContextValue>(
    () => ({
      images,
      assetCount,
      isExpanded,
      shouldReduceMotion,
      layoutTransition,
      expand,
      stackRef,
    }),
    [
      images,
      assetCount,
      isExpanded,
      shouldReduceMotion,
      layoutTransition,
      expand,
    ]
  )

  return (
    <FeaturedDesignsContext.Provider value={contextValue}>
      <LayoutGroup>
        <div
          inert={isExpanded}
          aria-hidden={isExpanded || undefined}
          className={cn(
            "md:grid md:grid-cols-2 items-start",
            isExpanded && "invisible"
          )}
        >
          {children}
        </div>

        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="featured-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={t("featuredDesigns")}
              className="fixed inset-0 z-50"
              layoutRoot
              initial={false}
              exit={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("[data-featured-photo]")
                ) {
                  return
                }
                collapse()
              }}
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
                  className="flex items-center justify-between p-5"
                  initial={false}
                  exit={{
                    opacity: 0,
                    transition: { duration: shouldReduceMotion ? 0 : 0.15 },
                  }}
                >
                  <button
                    ref={backRef}
                    type="button"
                    aria-label={t("backToFeatured")}
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
                  <Link
                    href="/design"
                    className="group hover:text-content-ink outline-none focus:outline-none focus-visible:outline-none"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {tDesigns("fullCollection", { count: assetCount })}
                    <ArrowRightIcon
                      size={10}
                      className="inline-block ml-1.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </motion.div>
                <div className="p-5 pb-50">
                  <FeaturedOverlayGrid
                    images={images}
                    layoutTransition={layoutTransition}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </FeaturedDesignsContext.Provider>
  )
}

export function FeaturedStack() {
  const {
    images,
    assetCount,
    isExpanded,
    shouldReduceMotion,
    layoutTransition,
    expand,
    stackRef,
  } = useFeaturedDesigns()
  const t = useTranslations("a11y")
  const tNav = useTranslations("navigation")
  const [isPeeking, setIsPeeking] = useState(false)
  const peek = isPeeking && !shouldReduceMotion
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={inViewRef} className="mt-8 space-y-3">
      <Link href="/design" className="block group">
        <h2 className="text-content-ink font-semibold text-sm flex items-center gap-2">
          {tNav("designs")}{" "}
          <sup className="text-content-subdued">{assetCount}</sup>
          <div className="bg-surface-alpha rounded-full text-content-subdued p-0.5 group-hover:translate-x-1 transition-transform duration-200">
            <ChevronRightIcon size={12} strokeWidth={4} />
          </div>
        </h2>
      </Link>
      <button
        ref={stackRef}
        type="button"
        aria-label={t("openFeatured")}
        className="w-32 text-left outline-none focus:outline-none focus-visible:outline-none"
        onClick={expand}
        onPointerEnter={() => {
          prefetchAlbumThumbs(images)
          setIsPeeking(true)
        }}
        onPointerLeave={() => setIsPeeking(false)}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setIsPeeking(true)
          }
        }}
        onBlur={() => setIsPeeking(false)}
      >
        <div className="relative aspect-square w-full overflow-visible p-2">
          {isExpanded
            ? null
            : images.map((image, imageIndex) => {
                const restRotate = REST_ROTATE[imageIndex] ?? 0
                const restOffset = REST_OFFSET[imageIndex] ?? { x: 0, y: 0 }
                const unfanRotate = UNFAN_ROTATE[imageIndex] ?? restRotate
                const unfanOffset = UNFAN_OFFSET[imageIndex] ?? restOffset

                return (
                  <motion.div
                    key={image.src}
                    className="absolute inset-3"
                    style={{ zIndex: images.length - imageIndex }}
                    initial={false}
                    animate={
                      shouldReduceMotion
                        ? { x: 0, y: 0, rotate: 0 }
                        : peek
                          ? {
                              x: unfanOffset.x,
                              y: unfanOffset.y,
                              rotate: unfanRotate,
                            }
                          : {
                              x: restOffset.x,
                              y: restOffset.y,
                              rotate: restRotate,
                            }
                    }
                    transition={
                      shouldReduceMotion ? { duration: 0 } : UNFAN_TRANSITION
                    }
                  >
                    <AlbumPhoto
                      layoutId={featuredImageLayoutId(image.slug, image.name)}
                      src={image.src}
                      alt=""
                      sizes={PHOTO_SIZES}
                      layoutTransition={{
                        ...layoutTransition,
                        delay: shouldReduceMotion
                          ? 0
                          : (images.length - 1 - imageIndex) * STAGGER_EACH,
                      }}
                      loading="eager"
                      fetchPriority={imageIndex === 0 ? "high" : "low"}
                      decoding="sync"
                      kind={image.kind}
                      poster={image.poster}
                      playing={
                        image.kind === "video" && inView && !shouldReduceMotion
                      }
                      className="bg-surface-card h-full w-full overflow-hidden shadow"
                    />
                  </motion.div>
                )
              })}
        </div>
      </button>
    </div>
  )
}

type FeaturedOverlayGridProps = {
  images: FeaturedImage[]
  layoutTransition: Transition
  shouldReduceMotion: boolean
}

function FeaturedOverlayGrid({
  images,
  layoutTransition,
  shouldReduceMotion,
}: FeaturedOverlayGridProps) {
  return (
    <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {images.map((image, imageIndex) => (
        <FeaturedOverlayTile
          key={image.src}
          image={image}
          imageIndex={imageIndex}
          layoutTransition={layoutTransition}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </ul>
  )
}

type FeaturedOverlayTileProps = {
  image: FeaturedImage
  imageIndex: number
  layoutTransition: Transition
  shouldReduceMotion: boolean
}

function FeaturedOverlayTile({
  image,
  imageIndex,
  layoutTransition,
  shouldReduceMotion,
}: FeaturedOverlayTileProps) {
  const t = useTranslations("a11y")
  const { ref, inView } = useInView<HTMLLIElement>()
  const playing = image.kind === "video" && inView && !shouldReduceMotion

  return (
    <li ref={ref} className="aspect-square" data-featured-photo="">
      <Link
        href={designAlbumHref(image.slug)}
        aria-label={t("openAlbum", { title: image.slug })}
        className="block h-full w-full outline-none focus:outline-none focus-visible:outline-none"
        onClick={(event) => {
          event.stopPropagation()
          playClickSound()
        }}
      >
        <AlbumPhoto
          layoutId={featuredImageLayoutId(image.slug, image.name)}
          src={image.src}
          alt=""
          sizes={PHOTO_SIZES}
          layoutTransition={{
            ...layoutTransition,
            delay: shouldReduceMotion ? 0 : imageIndex * STAGGER_EACH,
          }}
          loading="eager"
          decoding="sync"
          kind={image.kind}
          poster={image.poster}
          playing={playing}
          className="bg-surface-card h-full w-full overflow-hidden"
        />
      </Link>
    </li>
  )
}
