import { cn } from "@repo/ds"
import { FontInter, FontMono } from "@repo/ds/lib/fonts"

const presets = {
  mono: cn(FontMono.variable, FontMono.className, "text-sm font-medium"),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("antialiased bg-surface-canvas", presets.mono)}
    />
  )
}
