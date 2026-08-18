"use client"

import { cn } from "@repo/ds"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ds/components/ui/accordion"
import type { TOCItemType } from "fumadocs-core/toc"
import { useTranslations } from "next-intl"
import { type ComponentProps, useEffect, useRef, useState } from "react"

/** Scroll progress (0–1) after which the activation line starts moving toward the viewport bottom. */
const BOTTOM_ZONE = 0.75

/** Ignore tiny scroll deltas when deciding the click-lock has been released. */
const LOCK_SCROLL_TOLERANCE = 16

/** Wait for Lenis / hash scroll to settle before capturing the lock scroll position. */
const CLICK_SETTLE_MS = 500

function getHeadingId(url: string) {
  return url.startsWith("#") ? url.slice(1) : url
}

function getTocItems(toc: TOCItemType[]) {
  // Skip h1 entries from the page title / front matter.
  return toc.filter((item) => item.depth !== 1)
}

/**
 * Y position (from viewport top) that a heading must cross to become active.
 * Near the page bottom the line lowers so late headings can activate without
 * needing extra article padding.
 */
function getActivationOffset() {
  const baseOffset = Math.min(120, window.innerHeight * 0.2)
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight

  // Page fits in the viewport — treat the full height as the activation line.
  if (maxScroll <= 0) return window.innerHeight

  const progress = window.scrollY / maxScroll
  if (progress <= BOTTOM_ZONE) return baseOffset

  // Last 25% of scroll: lerp offset from base → innerHeight.
  const t = (progress - BOTTOM_ZONE) / (1 - BOTTOM_ZONE)
  return baseOffset + t * (window.innerHeight - baseOffset)
}

/** Last heading whose top is at or above the activation offset. */
function getActiveHeadingId(toc: TOCItemType[], offset: number) {
  let activeId = getHeadingId(toc[0]?.url ?? "")

  for (const item of toc) {
    const id = getHeadingId(item.url)
    const el = document.getElementById(id)
    if (!el) continue

    if (el.getBoundingClientRect().top <= offset) {
      activeId = id
    } else {
      // Headings are in document order; once one is below the line, stop.
      break
    }
  }

  return activeId
}

type TocProps = {
  toc: TOCItemType[]
  className?: string
  /** When false, render a plain list (for nesting inside an accordion). */
  labelled?: boolean
}

export const Toc = ({ toc, className, labelled = true }: TocProps) => {
  const t = useTranslations("navigation")
  const items = getTocItems(toc)
  const [activeId, setActiveId] = useState(() =>
    getHeadingId(items[0]?.url ?? "")
  )
  const lockedIdRef = useRef<string | null>(null)
  const lockScrollYRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const filtered = getTocItems(toc)
    if (filtered.length === 0) return

    const update = () => {
      const lockedId = lockedIdRef.current
      if (lockedId) {
        // Still animating to the clicked heading — keep it active.
        if (lockScrollYRef.current === null) {
          setActiveId(lockedId)
          return
        }

        // Keep the click selection until the user scrolls away from the settle position.
        if (
          Math.abs(window.scrollY - lockScrollYRef.current) <
          LOCK_SCROLL_TOLERANCE
        ) {
          setActiveId(lockedId)
          return
        }

        lockedIdRef.current = null
        lockScrollYRef.current = null
      }

      setActiveId(getActiveHeadingId(filtered, getActivationOffset()))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current)
      }
    }
  }, [toc])

  if (items.length === 0) return null

  const list = (
    <ul className="grid gap-0.5 text-xs">
      {items.map((item) => {
        const id = getHeadingId(item.url)
        const active = id === activeId

        return (
          <li
            key={item.url}
            // Indent nested headings (h3+) relative to h2.
            style={{ marginLeft: `${item.depth - 2}rem` }}
          >
            <a
              href={item.url}
              className={cn(
                "block text-content-subdued hover:text-content-ink line-clamp-1 py-px",
                active && "text-content-ink"
              )}
              aria-current={active ? "location" : undefined}
              onClick={() => {
                lockedIdRef.current = id
                lockScrollYRef.current = null
                setActiveId(id)

                if (settleTimerRef.current !== null) {
                  window.clearTimeout(settleTimerRef.current)
                }
                settleTimerRef.current = window.setTimeout(() => {
                  if (lockedIdRef.current === id) {
                    lockScrollYRef.current = window.scrollY
                  }
                }, CLICK_SETTLE_MS)
              }}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )

  if (!labelled) {
    return <div className={className}>{list}</div>
  }

  return (
    <nav
      aria-label={t("tableOfContents")}
      className={cn("mt-5 space-y-2", className)}
    >
      <div className="text-xs text-content-subdued">Table of Contents</div>
      {list}
    </nav>
  )
}

type CollapsibleTocProps = {
  toc: TOCItemType[]
} & Omit<ComponentProps<"div">, "children">

export const CollapsibleToc = ({
  toc,
  className,
  ...props
}: CollapsibleTocProps) => {
  const t = useTranslations("navigation")
  const items = getTocItems(toc)

  if (items.length === 0) return null

  return (
    <div className={cn(className)} {...props}>
      <nav aria-label={t("tableOfContents")} className="lg:hidden max-w-prose">
        <Accordion type="single" collapsible>
          <AccordionItem value="toc" className="border-stroke-soft">
            <AccordionTrigger className="py-2 text-sm font-semibold">
              {t("tableOfContents")}
            </AccordionTrigger>
            <AccordionContent>
              <Toc toc={toc} labelled={false} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>

      <div className="hidden lg:block">
        <Toc toc={toc} />
      </div>
    </div>
  )
}
