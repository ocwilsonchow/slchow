import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export function h1({ className, ...props }: ComponentProps<"h1">) {
  return <h1 className={cn("", className)} {...props} />
}

export function h2({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("", className)} {...props} />
}

export function h3({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("", className)} {...props} />
}

export function h4({ className, ...props }: ComponentProps<"h4">) {
  return <h4 className={cn("", className)} {...props} />
}

export function h5({ className, ...props }: ComponentProps<"h5">) {
  return <h5 className={cn("", className)} {...props} />
}

export function h6({ className, ...props }: ComponentProps<"h6">) {
  return <h6 className={cn("", className)} {...props} />
}

export function p({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("", className)} {...props} />
}

export function ul({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("list-disc list-inside", className)} {...props} />
}

export function ol({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("list-decimal", className)} {...props} />
}

export function li({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />
}

export function strong({ className, ...props }: ComponentProps<"strong">) {
  return <strong className={cn("text-content-ink font-medium", className)} {...props} />
}

export function em({ className, ...props }: ComponentProps<"em">) {
  return <em className={cn("italic", className)} {...props} />
}

export function blockquote({
  className,
  ...props
}: ComponentProps<"blockquote">) {
  return <blockquote className={cn("", className)} {...props} />
}

export function hr({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("opacity-0 my-3", className)} {...props} />
}

export function code({ className, ...props }: ComponentProps<"code">) {
  return <code className={cn("", className)} {...props} />
}
