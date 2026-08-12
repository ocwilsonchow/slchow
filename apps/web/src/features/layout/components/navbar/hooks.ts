"use client"

import { useLenis } from "lenis/react"
import { animate } from "motion/react"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useEffectEvent,
  useRef,
  useSyncExternalStore,
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
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener("change", onStoreChange)
      return () => mediaQuery.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

type ScrollHideOptions = {
  isMobile: boolean
  open: boolean
  shouldReduceMotion: boolean
}

/** Drive scroll-hide via Motion animate — no React state on scroll. */
export function useNavbarScrollHide(
  shellRef: RefObject<HTMLElement | null>,
  { isMobile, open, shouldReduceMotion }: ScrollHideOptions
) {
  const hiddenRef = useRef(false)
  const optionsRef = useRef({ isMobile, open, shouldReduceMotion })
  optionsRef.current = { isMobile, open, shouldReduceMotion }

  const setHidden = useEffectEvent((next: boolean) => {
    if (hiddenRef.current === next) return
    hiddenRef.current = next
    const node = shellRef.current
    if (!node) return

    animate(
      node,
      { y: next ? "calc(100% + 1rem)" : "0%" },
      {
        duration: optionsRef.current.shouldReduceMotion ? 0 : 0.3,
        ease: "easeInOut",
      }
    )
  })

  useEffect(() => {
    if (!isMobile || open) {
      setHidden(false)
    }
  }, [isMobile, open])

  useLenis(({ scroll, velocity }) => {
    const { isMobile: mobile, open: isOpen } = optionsRef.current

    if (!mobile || isOpen || scroll <= 0) {
      setHidden(false)
      return
    }

    if (velocity !== 0) {
      setHidden(velocity > 0)
    }
  }, [])
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
