import { ChevronRightIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export function ChevronBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex bg-surface-alpha rounded-full text-content-subdued p-0.5 group-hover:translate-x-1 transition-transform duration-200",
        className
      )}
      {...props}
    >
      <ChevronRightIcon size={12} strokeWidth={3} />
    </span>
  )
}
