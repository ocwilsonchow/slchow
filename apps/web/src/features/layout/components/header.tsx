import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export const Root = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("grid content-between lg:grid-cols-2", props.className)}
    />
  )
}

export const Info = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("", props.className)}>
      <div>Nicolas Reos</div>
      <div>Software Engineer</div>
    </div>
  )
}

export const Links = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("", props.className)}>
      <div>Resume</div>
      <div>GitHub</div>
      <div>LinkedIn</div>
    </div>
  )
}

export const Column = ({ ...props }: ComponentProps<"div">) => {
  return <div {...props} className={cn("", props.className)} />
}

export const Header = {
  Root,
  Info,
  Links,
  Column,
}
