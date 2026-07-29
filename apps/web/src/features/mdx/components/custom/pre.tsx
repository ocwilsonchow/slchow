import { cn } from "@repo/ds"
import { ClipboardIcon } from "lucide-react"
import { ComponentProps } from "react"

export function Pre({ className, children, ...props }: ComponentProps<"pre">) {
  return (
    <div className="relative grid">
      <button className="absolute top-3 right-2.5">
        <ClipboardIcon size={14} />
      </button>
      <div className="shiki grid overflow-x-auto border bg-surface-alpha/50 border-stroke-soft rounded-xl outline-none">
        <pre className={cn("px-4 py-3 text-xs leading-tight", className)} {...props}>
          {children}
        </pre>
      </div>
    </div>
  )
}
