import { getTranslations } from "next-intl/server"

export async function SkipLink() {
  const t = await getTranslations("navigation")

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-surface-canvas focus:px-4 focus:py-2 focus:text-content-ink focus:shadow-md"
    >
      {t("skipToContent")}
    </a>
  )
}
