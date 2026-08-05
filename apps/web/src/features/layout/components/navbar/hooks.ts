"use client"

import { useLenis } from "lenis/react"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1
  )
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [query])

  return matches
}

export function useNavbarScrollHide(isMobile: boolean, open: boolean) {
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const isScrollingDownRef = useRef(false)

  const setScrollingDown = (next: boolean) => {
    if (isScrollingDownRef.current === next) return
    isScrollingDownRef.current = next
    setIsScrollingDown(next)
  }

  useLenis(
    ({ scroll, velocity }) => {
      if (!isMobile || open || scroll <= 0) {
        setScrollingDown(false)
        return
      }

      if (velocity !== 0) {
        setScrollingDown(velocity > 0)
      }
    },
    [isMobile, open]
  )

  return isScrollingDown
}

export function useOpenOnModK(setOpen: Dispatch<SetStateAction<boolean>>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() !== "k") return
      if (!(event.metaKey || event.ctrlKey)) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      event.preventDefault()
      setOpen(true)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [setOpen])
}

type FocusLockOptions = {
  open: boolean
  navRef: RefObject<HTMLElement | null>
  backdropRef: RefObject<HTMLButtonElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
  panelRef: RefObject<HTMLDivElement | null>
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function useNavbarFocusLock({
  open,
  navRef,
  backdropRef,
  triggerRef,
  panelRef,
  setOpen,
}: FocusLockOptions) {
  const wasOpenRef = useRef(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus()
      }
      wasOpenRef.current = false
      return
    }

    wasOpenRef.current = true
    lenis?.stop()

    const firstLink =
      panelRef.current?.querySelector<HTMLElement>("a[href], button")
    // Defer so the panel is interactive before focusing.
    requestAnimationFrame(() => firstLink?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const containers = [navRef.current, backdropRef.current].filter(
        (node): node is HTMLElement => Boolean(node)
      )
      const focusables = containers.flatMap(getFocusableElements)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (!active || active === first || !focusables.includes(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (!active || active === last || !focusables.includes(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      lenis?.start()
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, lenis, setOpen, navRef, backdropRef, triggerRef, panelRef])
}
