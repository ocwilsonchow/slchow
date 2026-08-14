"use client"

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  use,
  useEffect,
  useMemo,
  useState,
} from "react"

type NavbarVisibilityContextValue = {
  hiddenByOverlay: boolean
  setHiddenByOverlay: Dispatch<SetStateAction<boolean>>
}

const NavbarVisibilityContext =
  createContext<NavbarVisibilityContextValue | null>(null)

export function NavbarVisibilityProvider({
  children,
}: {
  children: ReactNode
}) {
  const [hiddenByOverlay, setHiddenByOverlay] = useState(false)
  const value = useMemo(
    () => ({ hiddenByOverlay, setHiddenByOverlay }),
    [hiddenByOverlay]
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
  const { setHiddenByOverlay } = useNavbarVisibility()

  useEffect(() => {
    setHiddenByOverlay(active)
    return () => setHiddenByOverlay(false)
  }, [active, setHiddenByOverlay])
}
