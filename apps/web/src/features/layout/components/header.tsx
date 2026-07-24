import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export const Root = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "lg:grid lg:grid-cols-2 space-y-5 lg:sticky lg:top-0",
        props.className
      )}
    />
  )
}

export const Info = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("", props.className)}>
      <Link href="/">Nicolas Reos</Link>
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
