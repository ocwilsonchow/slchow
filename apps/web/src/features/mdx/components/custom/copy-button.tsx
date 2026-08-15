"use client"

import { useCopyToClipboard } from "@uidotdev/usehooks"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { type MouseEvent, useEffect, useState } from "react"

export function CopyButton() {
  const t = useTranslations("code")
  const [, copyToClipboard] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 3000)
    return () => clearTimeout(timeout)
  }, [copied])

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    const pre = event.currentTarget.parentElement?.querySelector("pre")
    const text = pre?.textContent
    if (!text) return
    copyToClipboard(text)
    setCopied(true)
  }

  return (
    <button
      type="button"
      className="absolute top-3 right-2.5 z-10 text-content-subdued transition-colors hover:text-content-ink"
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
  )
}
