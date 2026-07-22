"use client"

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes"
import type { ReactElement } from "react"

export const ThemeProvider = ({
  children,
  ...properties
}: ThemeProviderProps): ReactElement => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
    // next-themes injects an inline <script> for FOUC prevention. React 19.2
    // warns about inline <script> tags created during client renders. The
    // script only needs to execute in the server-rendered HTML, so on the
    // client we mark it as a non-executable type to silence that warning.
    scriptProps={
      typeof window === "undefined" ? undefined : { type: "application/json" }
    }
    {...properties}
  >
    {children}
  </NextThemeProvider>
)
