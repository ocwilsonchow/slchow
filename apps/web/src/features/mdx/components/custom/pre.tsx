"use client"

import { cn } from "@repo/ds"
import { useCopyToClipboard } from "@uidotdev/usehooks"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { type ComponentProps, useEffect, useRef, useState } from "react"

export function Pre({ className, children, ...props }: ComponentProps<"pre">) {
  const t = useTranslations("code")
  const preRef = useRef<HTMLPreElement>(null)
  const [, copyToClipboard] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 3000)
    return () => clearTimeout(timeout)
  }, [copied])

  const handleCopy = () => {
    const text = preRef.current?.textContent
    if (!text) return
    copyToClipboard(text)
    setCopied(true)
  }

  return (
    <div className="relative mb-3 w-full min-w-0 max-w-full overflow-hidden rounded-xl">
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
      <div className="shiki min-w-0 max-w-full overflow-x-auto rounded-xl border border-stroke-soft bg-surface-alpha/50 outline-none">
        <pre
          ref={preRef}
          className={cn(
            "min-w-0 px-4 py-3 text-xs leading-tight [counter-reset:line] [&_code]:grid [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-foreground [&_.line]:before:opacity-25 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line]",
            className
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  )
}
