import { cn } from "@repo/ds"
import type { ComponentProps } from "react"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"

/** Binary/document routes must use a hard navigation — Next soft nav cannot render them. */
const isDocumentHref = (href: string) =>
  href === "/resume/pdf" || href.endsWith(".pdf")

export function MDXLink({ href, className, ...props }: ComponentProps<"a">) {
  const classes = cn("inline-flex font-semibold text-content-ink underline underline-offset-4 decoration-content-ink/25 hover:decoration-content-ink/50", className)

  if (!href) return <a className={classes} {...props} />

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    // href.startsWith("mailto:") ||
    href.startsWith("#")

  if (isExternal) {
    return (
      <a
        {...props}
        className={cn(classes, "")}
        href={href}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {props.children}
        <ArrowUpRight size={12} color="currentColor" />
      </a>
    )
  }

  if (isDocumentHref(href)) {
    return <a {...props} className={classes} href={href} target="_blank" rel="noopener noreferrer" />
  }

  return <Link href={href} {...props} className={cn(classes)} />
}
