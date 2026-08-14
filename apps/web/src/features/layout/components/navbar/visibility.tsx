"use client"

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type NavbarVisibilityContextValue = {
  hiddenByOverlay: boolean
  acquireHide: () => void
  releaseHide: () => void
}

const NavbarVisibilityContext =
  createContext<NavbarVisibilityContextValue | null>(null)

export function NavbarVisibilityProvider({
  children,
}: {
  children: ReactNode
}) {
  const [hideCount, setHideCount] = useState(0)
  const acquireHide = useCallback(() => {
    setHideCount((count) => count + 1)
  }, [])
  const releaseHide = useCallback(() => {
    setHideCount((count) => Math.max(0, count - 1))
  }, [])
  const value = useMemo(
    () => ({
      hiddenByOverlay: hideCount > 0,
      acquireHide,
      releaseHide,
    }),
    [hideCount, acquireHide, releaseHide]
  )

  return (
    <NavbarVisibilityContext value={value}>{children}</NavbarVisibilityContext>
  )
}

export function useNavbarVisibility() {
  const context = use(NavbarVisibilityContext)
  if (!context) {
    throw new Error(
      "useNavbarVisibility must be used within NavbarVisibilityProvider"
    )
  }
  return context
}

/** Hide the site navbar while `active` is true; restore on false or unmount. */
export function useHideNavbarForOverlay(active: boolean) {
  const { acquireHide, releaseHide } = useNavbarVisibility()

  useEffect(() => {
    if (!active) return
    acquireHide()
    return () => releaseHide()
  }, [active, acquireHide, releaseHide])
}
