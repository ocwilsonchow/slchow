import type { ComponentProps } from "react"
import { cn } from "../.."

export const Divider = ({ ...props }: ComponentProps<"div">) => {
  return <div {...props} className={cn("h-px my-4", props.className)} />
}
