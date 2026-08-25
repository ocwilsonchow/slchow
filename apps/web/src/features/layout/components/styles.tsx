import { cn } from "@repo/ds"
import { FontAero } from "@repo/ds/lib/font-aero"

export const fontPresets = {
  aero: cn(
    FontAero.variable,
    FontAero.className,
    "text-base font-medium leading-normal"
  ),
}

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("antialiased", fontPresets.aero)} />
}
