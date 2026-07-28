import { cn } from "@repo/ds"
import { FontAero, FontInter, FontMono } from "@repo/ds/lib/fonts"

export const fontPresets = {
  mono: cn(
    FontMono.variable,
    FontMono.className,
    "text-sm font-medium leading-normal"
  ),
  aero: cn(
    FontAero.variable,
    FontAero.className,
    "text-sm font-medium leading-normal"
  ),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("antialiased", fontPresets.aero)} />
}
