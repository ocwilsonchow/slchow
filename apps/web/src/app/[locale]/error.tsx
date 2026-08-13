"use client"

import { useTranslations } from "next-intl"
import { ErrorView } from "@/features/layout/components/error-view"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("error")

  return (
    <ErrorView
      title={t("title")}
      description={t("description")}
      retryLabel={t("retry")}
      onRetry={reset}
    />
  )
}
