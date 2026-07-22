import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider } from "./providers/theme"

export { useTheme } from "next-themes"
export { cn } from "./lib/utils"

type DesignSystemProviderProps = ThemeProviderProps

export const DesignSystemProvider = ({
  children,
  ...props
}: DesignSystemProviderProps) => (
  <ThemeProvider {...props}>{children}</ThemeProvider>
)
