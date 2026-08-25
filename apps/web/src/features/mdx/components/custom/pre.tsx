import { cn } from "@repo/ds"
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
} from "react"
import { CopyButton } from "./copy-button"

type PreProps = ComponentProps<"pre"> & {
  icon?: string
  "data-language"?: string
  "data-title"?: string
}

function classNameToString(className: unknown) {
  if (typeof className === "string") return className
  if (Array.isArray(className)) return className.filter(Boolean).join(" ")
}

function getLanguageFromChildren(children: ReactNode) {
  const child = Children.toArray(children).find(isValidElement)
  if (!child) return

  const className = classNameToString(
    (child.props as { className?: unknown }).className
  )
  if (!className) return

  const languageClass = className
    .split(/\s+/)
    .find((token) => token.startsWith("language-"))

  return languageClass?.slice("language-".length)
}

export function Pre({
  className,
  children,
  title,
  icon: _icon,
  ...props
}: PreProps) {
  const dataTitle = props["data-title"]
  const dataLanguage = props["data-language"]
  const language = dataLanguage || getLanguageFromChildren(children)
  const label =
    title ||
    dataTitle ||
    (language && language !== "plaintext" ? language : undefined)

  return (
    <div className="mb-3 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-stroke-soft bg-surface-alpha/50">
      {label ? (
        <div className="border-b border-stroke-soft px-4 py-2">
          <span className="block truncate font-mono text-sm text-content-subdued">
            {label}
          </span>
        </div>
      ) : null}
      <div className="relative">
        <CopyButton />
        <div className="shiki min-w-0 max-w-full overflow-x-auto outline-none">
          <pre
            className={cn(
              "min-w-0 px-4 py-3 text-sm leading-tight [counter-reset:line] [&_code]:grid [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-foreground [&_.line]:before:opacity-25 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line]",
              className
            )}
            {...props}
          >
            {children}
          </pre>
        </div>
      </div>
    </div>
  )
}
