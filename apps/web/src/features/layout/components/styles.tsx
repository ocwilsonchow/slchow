import { cn } from "@repo/ds"
import { FontInter, FontMono } from "@repo/ds/lib/fonts"

export const fontPresets = {
  mono: cn(
    FontMono.variable,
    FontMono.className,
    "text-xs font-medium leading-snug"
  ),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("antialiased", fontPresets.mono)} />
}
