"use client"

/**
 * Homepage featured covers: a small stacked preview that expands into a
 * full-screen overlay of one image per album (files named with a leading `*`).
 *
 * `LayoutGroup id="featured-designs"` keeps these `layoutId`s off `/design`.
 */
import { cn } from "@repo/ds"
import { ChevronBadge } from "@repo/ds/components/ui/chevron-badge"
import { useLenis } from "lenis/react"
import { ArrowRightIcon, CornerDownLeftIcon } from "lucide-react"
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
  type FocusEvent,
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
import {
  CHEAP_MOTION_DURATION,
  designAlbumHref,
  FEATURED_STACK_SIZES,
  OVERLAY_PHOTO_SIZES,
  PHOTO_SIZES,
  STAGGER_EACH,
} from "../album"
import type { DesignImage } from "../get-designs"
import { featuredImageLayoutId } from "../layout-ids"
import { prefetchAlbumThumbs } from "../prefetch"
import { useCoarsePointer } from "../use-coarse-pointer"
import { useInView } from "../use-in-view"
import { AlbumPhoto } from "./album-photo"

type FeaturedImage = DesignImage & { slug: string }

/** Resting fan pose for the collapsed `w-32` stack. */
const REST_ROTATE = [2, -7, 6, -4, 5]
const REST_OFFSET = [
  { x: 0, y: 0 },
  { x: 12, y: 6 },
  { x: -10, y: 10 },
  { x: 8, y: 14 },
  { x: -6, y: 18 },
]

/** Hover/keyboard peek — covers spread farther than rest. */
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
  sharedLayout: boolean
  layoutTransition: Transition
  expand: () => void
  previewRef: RefObject<HTMLButtonElement | null>
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

/** Overlay click-outside close, but photo tiles navigate to `/design?album=`. */
function isFeaturedPhotoEvent(event: { target: EventTarget | null }) {
  return (
    event.target instanceof Element &&
    Boolean(event.target.closest("[data-featured-photo]"))
  )
}

/** Provider + overlay. `children` is the homepage intro; `FeaturedStack` is the peekable pile. */
export function FeaturedDesigns({
  images,
  assetCount,
  children,
}: FeaturedDesignsProps) {
  const t = useTranslations("a11y")
  const tNav = useTranslations("navigation")
  const tDesigns = useTranslations("designs")
  const shouldReduceMotion = useReducedMotion() ?? false
  const coarsePointer = useCoarsePointer()
  // FLIP only when the pointer can hover and motion is allowed.
  const sharedLayout = !shouldReduceMotion && !coarsePointer
  const lenis = useLenis()
  const [isExpanded, setIsExpanded] = useState(false)
  const backRef = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLButtonElement>(null)
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
    setIsExpanded(false)
  }, [])

  const expand = useCallback(() => {
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
        previewRef.current?.focus({ preventScroll: true })
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
      sharedLayout,
      layoutTransition,
      expand,
      previewRef,
    }),
    [
      images,
      assetCount,
      isExpanded,
      shouldReduceMotion,
      sharedLayout,
      layoutTransition,
      expand,
    ]
  )

  return (
    <FeaturedDesignsContext.Provider value={contextValue}>
      <LayoutGroup id="featured-designs">
        {/* Inert so homepage content isn't in the tab order while the dialog is up. */}
        <div
          inert={isExpanded}
          aria-hidden={isExpanded || undefined}
          className={cn(
            "md:grid md:grid-cols-2 items-start",
            // Stay mounted (invisible) so layoutIds and focus restore survive.
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
              // Isolate layout measurements to this overlay so the homepage stack doesn't participate.
              layoutRoot={sharedLayout}
              initial={false}
              exit={{ opacity: sharedLayout ? 1 : 0 }}
              transition={{
                duration: shouldReduceMotion
                  ? 0
                  : sharedLayout
                    ? 0.4
                    : CHEAP_MOTION_DURATION,
              }}
              onClick={(event) => {
                if (isFeaturedPhotoEvent(event)) return
                collapse()
              }}
            >
              <motion.div
                className="bg-surface-canvas absolute inset-0"
                initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: shouldReduceMotion ? 1 : 0,
                  transition: {
                    delay: sharedLayout ? 0.2 : 0,
                    duration: shouldReduceMotion
                      ? 0
                      : sharedLayout
                        ? 0.3
                        : CHEAP_MOTION_DURATION,
                  },
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              />
              <motion.div
                className="relative z-10 h-full overflow-y-auto overscroll-contain"
                layoutScroll={sharedLayout}
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
                    className="group hover:text-content-ink select-none outline-none focus:outline-none focus-visible:outline-none"
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
                    sharedLayout={sharedLayout}
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

/** Collapsed `w-32` pile. Unmounts covers while expanded so overlay tiles own the `layoutId`s. */
export function FeaturedStack() {
  const {
    images,
    assetCount,
    isExpanded,
    shouldReduceMotion,
    sharedLayout,
    layoutTransition,
    expand,
    previewRef,
  } = useFeaturedDesigns()
  const tNav = useTranslations("navigation")
  const tDesigns = useTranslations("designs")
  const [isPeeking, setIsPeeking] = useState(false)
  const peek = isPeeking && !shouldReduceMotion
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>()
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    // Assign layoutIds after first paint so Motion doesn't FLIP from 0×0.
    setLayoutReady(true)
  }, [])

  const peekOn = useCallback(() => {
    prefetchAlbumThumbs(images)
    setIsPeeking(true)
  }, [images])

  const peekOff = useCallback(() => {
    setIsPeeking(false)
  }, [])

  const peekOnKeyboard = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (
        event.target instanceof Element &&
        event.target.matches(":focus-visible")
      ) {
        peekOn()
      }
    },
    [peekOn]
  )

  return (
    <div ref={inViewRef} className="mt-8 space-y-3">
      <Link href="/design" className="block group">
        <h2 className="text-content-ink font-semibold flex items-center gap-2">
          {tNav("designs")}{" "}
          <sup className="text-content-subdued">{assetCount}</sup>
          <ChevronBadge />
        </h2>
      </Link>
      <div className="w-32">
        <Link
          href="/design"
          aria-label={tNav("designs")}
          className="block outline-none focus:outline-none focus-visible:outline-none"
          onPointerEnter={peekOn}
          onPointerLeave={peekOff}
          onFocus={peekOnKeyboard}
          onBlur={peekOff}
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
                        layoutId={
                          layoutReady && sharedLayout
                            ? featuredImageLayoutId(image.slug, image.name)
                            : undefined
                        }
                        src={image.src}
                        alt=""
                        // Collapsed stack is `w-32`; overlay tiles use PHOTO_SIZES / OVERLAY_PHOTO_SIZES.
                        sizes={FEATURED_STACK_SIZES}
                        layoutTransition={{
                          ...layoutTransition,
                          // Back of the stack flies first so the front cover lands last.
                          delay: shouldReduceMotion
                            ? 0
                            : (images.length - 1 - imageIndex) * STAGGER_EACH,
                        }}
                        loading={imageIndex === 0 ? "eager" : "lazy"}
                        fetchPriority={imageIndex === 0 ? "high" : "low"}
                        decoding={sharedLayout ? "sync" : "async"}
                        kind={image.kind}
                        playing={
                          image.kind === "video" &&
                          !shouldReduceMotion &&
                          (imageIndex === 0 || inView)
                        }
                        className="bg-surface-card h-full w-full overflow-hidden shadow"
                      />
                    </motion.div>
                  )
                })}
          </div>
        </Link>
        {/* Hidden expand control — the visible stack is a Link to `/design`. Focus returns here on collapse. */}
        <button
          ref={previewRef}
          type="button"
          hidden
          className="text-content-subdued hover:text-content-ink text-sm outline-none focus:outline-none focus-visible:outline-none"
          onClick={expand}
          onFocus={peekOnKeyboard}
          onBlur={peekOff}
        >
          {tDesigns("preview")}
        </button>
      </div>
    </div>
  )
}

type FeaturedOverlayGridProps = {
  images: FeaturedImage[]
  layoutTransition: Transition
  shouldReduceMotion: boolean
  sharedLayout: boolean
}

/** One cover per album; columns match `OVERLAY_PHOTO_SIZES` from md up (3/4/5/6). */
function FeaturedOverlayGrid({
  images,
  layoutTransition,
  shouldReduceMotion,
  sharedLayout,
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
          sharedLayout={sharedLayout}
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
  sharedLayout: boolean
}

function FeaturedOverlayTile({
  image,
  imageIndex,
  layoutTransition,
  shouldReduceMotion,
  sharedLayout,
}: FeaturedOverlayTileProps) {
  const t = useTranslations("a11y")
  const { ref, inView } = useInView<HTMLLIElement>()
  const playing = image.kind === "video" && inView && !shouldReduceMotion
  // First ~two rows of a 3-col grid.
  const inFirstRows = imageIndex < 6

  return (
    // `data-featured-photo` lets overlay click-outside ignore tile clicks.
    <li ref={ref} className="aspect-square" data-featured-photo="">
      <Link
        href={designAlbumHref(image.slug)}
        aria-label={t("openAlbum", { title: image.slug })}
        className="block h-full w-full outline-none focus:outline-none focus-visible:outline-none"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <AlbumPhoto
          layoutId={
            sharedLayout
              ? featuredImageLayoutId(image.slug, image.name)
              : undefined
          }
          src={image.src}
          alt=""
          // PHOTO_SIZES during FLIP so the landed tile isn't stuck on the 128px stack candidate.
          sizes={sharedLayout ? PHOTO_SIZES : OVERLAY_PHOTO_SIZES}
          layoutTransition={{
            ...layoutTransition,
            delay: shouldReduceMotion ? 0 : imageIndex * STAGGER_EACH,
          }}
          loading={inFirstRows ? "eager" : "lazy"}
          decoding={sharedLayout ? "sync" : "async"}
          kind={image.kind}
          playing={playing}
          className="bg-surface-card h-full w-full overflow-hidden"
        />
      </Link>
    </li>
  )
}
