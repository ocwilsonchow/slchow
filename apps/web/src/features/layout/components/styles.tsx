import { cn } from "@repo/ds"

export const StylesProvider = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("antialiased bg-surface-canvas", "font-sans")}
    />
  )
}
