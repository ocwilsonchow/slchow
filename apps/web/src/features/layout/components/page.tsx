import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

/** Server-safe page shell. No enter opacity — LCP must paint immediately. */
export const PageLayout = ({ className, ...props }: ComponentProps<"main">) => {
  return <main id="main-content" {...props} className={cn(className)} />
}
