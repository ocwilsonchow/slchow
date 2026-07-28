import { Link } from "@/i18n/navigation"
import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export const Root = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "lg:grid lg:grid-cols-2 sm:space-y-4 lg:sticky lg:top-0 p-5",
        props.className
      )}
    />
  )
}

export const Info = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("text-content-ink", props.className)}>
      <Link href="/">Wilson Chow</Link>
    </div>
  )
}

export const Links = ({ ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} className={cn("hidden md:block", props.className)}>
      <div>
        <Link href="/resume">Resume</Link>
      </div>
      <div>
        <Link
          href="https://github.com/ocwilsonchow"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </div>
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
