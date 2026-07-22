import { cn } from "@repo/ds"
import {
  FontAero,
  FontGeist,
  FontInter,
  FontSans,
  FontSerif,
  FontMono,
} from "@repo/ds/lib/fonts"

const presets = {
  sans: cn(
    FontSans.variable,
    FontSans.className,
    "font-normal text-sm leading-relaxed"
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
  mono: cn(
    FontMono.variable,
    FontMono.className,
    "font-medium text-sm leading-relaxed"
  ),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("antialiased bg-surface-canvas", presets.mono)}
    />
  )
}
