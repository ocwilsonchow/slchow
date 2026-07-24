import { cn } from "@repo/ds"
import { ClipboardIcon } from "lucide-react"
import { ComponentProps } from "react"

export function Pre({ className, ...props }: ComponentProps<"pre">) {
  return (
    <div className="grid overflow-x-auto border relative">
      <button className="absolute top-3.5 right-3">
        <ClipboardIcon size={14} />
      </button>
      <pre className={cn("px-4 py-3", className)} {...props}>
        {props.children}
      </pre>
    </div>
  )
}
