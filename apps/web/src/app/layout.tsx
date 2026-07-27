import type { ReactNode } from "react"

import "./styles.css"

/**
 * Minimal root layout so `[locale]/layout` can own `<html lang>` without
 * calling `getLocale()` (which reads headers and forces dynamic rendering).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
