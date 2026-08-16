"use client"

import { Spinner } from "@repo/ds/components/ui/spinner"
import { CornerDownLeftIcon } from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-4.5 items-center justify-center rounded-md bg-surface-alpha px-1 py-px">
      {children}
    </kbd>
  )
}

type Hint = "proceed" | "newline" | "submit"

const HINT_MESSAGE = {
  proceed: "enterToProceed",
  newline: "shiftEnterToNewline",
  submit: "enterToSubmit",
} as const

type Props = {
  canGoBack: boolean
  isBusy: boolean
  isLastStep: boolean
  hint: Hint
  onBack: () => void
  focusSubmit?: (node: HTMLButtonElement | null) => void
}

export function ContactFormActions({
  canGoBack,
  isBusy,
  isLastStep,
  hint,
  onBack,
  focusSubmit,
}: Props) {
  const t = useTranslations("contact")

  return (
    <div className="flex items-center justify-end gap-4">
      {isBusy ? null : (
        <span className="mr-auto inline-flex items-center gap-1 text-xs text-content-subdued">
          {t.rich(HINT_MESSAGE[hint], {
            modifier: (label) => <Kbd>{label}</Kbd>,
            kbd: (label) => (
              <Kbd>
                <CornerDownLeftIcon size={12} aria-hidden />
                <span className="sr-only">{label}</span>
              </Kbd>
            ),
          })}
        </span>
      )}
      <div className="flex items-center gap-2">
        {canGoBack ? (
          <motion.button
            type="button"
            className="text-content-subdued transition-colors hover:text-content-ink font-semibold border px-4 py-2 rounded-xl text-xs hover:bg-surface-alpha/25"
            onClick={onBack}
            disabled={isBusy}
            aria-label={t("back")}
            whileTap={{ scale: 0.9 }}
          >
            {t("back")}
          </motion.button>
        ) : null}

        <motion.button
          ref={isLastStep ? focusSubmit : undefined}
          type="submit"
          className="inline-flex items-center gap-2 text-content-ink disabled:text-content-subdued font-semibold border px-4 py-2 rounded-xl text-xs bg-surface-alpha/50 hover:bg-surface-alpha"
          disabled={isBusy}
          aria-label={
            isBusy ? t("sending") : isLastStep ? t("send") : t("next")
          }
          whileTap={{ scale: 0.9 }}
        >
          {isBusy ? <Spinner /> : null}
          {isBusy ? t("sending") : isLastStep ? t("send") : t("next")}
        </motion.button>
      </div>
    </div>
  )
}
