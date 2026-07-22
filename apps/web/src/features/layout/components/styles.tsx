import { cn } from "@repo/ds"
import {
  FontAero,
  FontGeist,
  FontInter,
  FontMono,
  FontSans,
  FontSerif,
} from "@repo/ds/lib/fonts"

const presets = {
  sans: cn(
    FontSans.variable,
    FontSans.className,
    "font-normal text-sm leading-relaxed"
  ),
  mono: cn(
    FontMono.variable,
    FontMono.className,
    "font-medium text-sm leading-relaxed uppercase"
  ),
  aero: cn(
    FontAero.variable,
    FontAero.className,
    "font-medium leading-relaxed"
  ),
  inter: cn(
    FontInter.variable,
    FontInter.className,
    "font-normal leading-relaxed"
  ),
  geist: cn(
    FontGeist.variable,
    FontGeist.className,
    "font-medium leading-relaxed"
  ),
  serif: cn(
    FontSerif.variable,
    FontSerif.className,
    "font-normal leading-relaxed"
  ),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("antialiased bg-surface-canvas", presets.serif)}
    />
  )
}
