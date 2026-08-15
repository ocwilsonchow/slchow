"use client"

import { Spinner } from "@repo/ds/components/ui/spinner"
import { CornerDownLeftIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-4.5 items-center justify-center rounded-md bg-surface-alpha px-1 py-px">
      {children}
    </kbd>
  )
}

type Props = {
  canGoBack: boolean
  isBusy: boolean
  isLastStep: boolean
  onBack: () => void
}

export function ContactFormActions({
  canGoBack,
  isBusy,
  isLastStep,
  onBack,
}: Props) {
  const t = useTranslations("contact")

  return (
    <div className="flex items-center gap-4">
      {canGoBack ? (
        <button
          type="button"
          className="text-content-subdued transition-colors hover:text-content-ink"
          onClick={onBack}
          disabled={isBusy}
        >
          {t("back")}
        </button>
      ) : null}

      <button
        type="submit"
        className="inline-flex items-center gap-2 text-content-ink disabled:text-content-subdued"
        disabled={isBusy}
      >
        {isBusy ? <Spinner /> : null}
        {isBusy ? t("sending") : isLastStep ? t("send") : t("next")}
      </button>
      {isBusy ? null : (
        <span className="inline-flex items-center gap-1 text-xs text-content-subdued">
          {t.rich(isLastStep ? "enterToSubmit" : "enterToProceed", {
            kbd: (label) => (
              <Kbd>
                <CornerDownLeftIcon size={12} aria-hidden />
                <span className="sr-only">{label}</span>
              </Kbd>
            ),
          })}
        </span>
      )}
    </div>
  )
}
