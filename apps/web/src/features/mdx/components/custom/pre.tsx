"use client"

import { cn } from "@repo/ds"
import { useCopyToClipboard } from "@uidotdev/usehooks"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { type ComponentProps, useEffect, useRef, useState } from "react"

const COLLAPSED_LINE_COUNT = 20

export function Pre({ className, children, ...props }: ComponentProps<"pre">) {
  const t = useTranslations("code")
  const preRef = useRef<HTMLPreElement>(null)
  const [, copyToClipboard] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isCollapsible, setIsCollapsible] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 3000)
    return () => clearTimeout(timeout)
  }, [copied])

  useEffect(() => {
    const lineCount =
      preRef.current?.querySelectorAll<HTMLElement>(".line").length ?? 0

    setIsCollapsible(lineCount > COLLAPSED_LINE_COUNT)
    setExpanded(false)
  }, [children])

  const handleCopy = () => {
    const text = preRef.current?.textContent
    if (!text) return
    copyToClipboard(text)
    setCopied(true)
  }

  const isCollapsed = isCollapsible && !expanded

  return (
    <div className="relative grid rounded-xl overflow-hidden mb-5">
      <button
        type="button"
        className="absolute top-3 right-2.5 z-10 text-content-subdued hover:text-content-ink transition-colors"
        onClick={handleCopy}
        aria-label={copied ? t("copied") : t("copy")}
      >
        <div>
          {copied ? (
            <CheckIcon size={14} className="text-content-accent" />
          ) : (
            <ClipboardIcon size={14} />
          )}
        </div>
      </button>
      <div className="relative grid rounded-xl overflow-hidden">
        <div
          className={cn(
            "shiki grid overflow-x-auto rounded-xl border border-stroke-soft bg-surface-alpha/50 outline-none",
            isCollapsed && "max-h-81 overflow-y-hidden"
          )}
        >
          <pre
            ref={preRef}
            className={cn(
              "px-4 py-3 text-xs leading-tight [counter-reset:line] [&_code]:grid [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-foreground [&_.line]:before:opacity-25 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line]",
              className
            )}
            {...props}
          >
            {children}
          </pre>
        </div>
        {isCollapsed ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-px bottom-px h-16 rounded-b-xl bg-linear-to-t from-surface-canvas via-surface-canvas/50 to-transparent"
          />
        ) : null}
      </div>
      {isCollapsible ? (
        <button
          type="button"
          className="mt-2 justify-self-center text-xs text-content-subdued transition-colors hover:text-content-ink"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      ) : null}
    </div>
  )
}
