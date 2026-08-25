import { cn } from "@repo/ds"
import type { ComponentProps } from "react"

export function h1({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-semibold tracking-tight text-content-ink text-xl",
        className
      )}
      {...props}
    />
  )
}

export function h2({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-semibold tracking-tight text-content-ink text-lg",
        className
      )}
      {...props}
    />
  )
}

export function h3({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-semibold tracking-tight text-content-ink text-base", className)}
      {...props}
    />
  )
}

export function h4({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn("font-semibold tracking-tight text-content-ink", className)}
      {...props}
    />
  )
}

export function h5({ className, ...props }: ComponentProps<"h5">) {
  return <h5 className={cn("text-content-ink", className)} {...props} />
}

export function h6({ className, ...props }: ComponentProps<"h6">) {
  return <h6 className={cn("text-content-ink", className)} {...props} />
}

export function p({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("", className)} {...props} />
}

export function ul({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "list-disc list-outside ml-3.75 space-y-1 marker:text-content-ink/30",
        className
      )}
      {...props}
    />
  )
}

export function ol({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("list-decimal list-outside ml-3.75 space-y-1", className)}
      {...props}
    />
  )
}

export function li({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />
}

export function strong({ className, ...props }: ComponentProps<"strong">) {
  return (
    <strong
      className={cn("text-content-ink font-semibold", className)}
      {...props}
    />
  )
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
  return (
    <code
      className={cn(
        "text-[13px]",
        "[&:not(pre_code)]:rounded-md",
        "[&:not(pre_code)]:bg-surface-alpha",
        "[&:not(pre_code)]:px-1",
        "[&:not(pre_code)]:py-0.5",
        "[&:not(pre_code)]:text-content-ink",
        "[&:not(pre_code)]:wrap-break-word",
        "[&:not(pre_code)]:wrap-anywhere",
        className
      )}
      {...props}
    />
  )
}

export function table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  )
}

export function thead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("border-b border-stroke-soft", className)}
      {...props}
    />
  )
}

export function tbody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
}

export function tr({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr className={cn("border-b border-stroke-soft", className)} {...props} />
  )
}

export function th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-0 py-2 pr-4 font-semibold leading-snug tracking-tight text-content-ink first:pl-0 last:pr-0",
        className
      )}
      {...props}
    />
  )
}

export function td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-0 py-2 pr-4 leading-snug text-content-body align-top first:pl-0 last:pr-0",
        className
      )}
      {...props}
    />
  )
}
