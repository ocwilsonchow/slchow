"use client"

import { cn } from "@slchow/ds"
import { type Locale, useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"

const localeOptions = ["en", "zh-hk"] as const satisfies Locale[]

export const LocaleSelect = () => {
  const router = useRouter()
  const currentLocale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("navigation")

  const handleLocaleChange = (locale: Locale) => {
    if (currentLocale === locale) return
    router.replace(pathname, {
      locale,
    })
  }

  return (
    <div className="flex items-center">
      {localeOptions.map((locale) => (
        <button
          type="button"
          key={locale}
          className={cn(
            "w-7 h-7 shrink-0 flex items-center justify-center hover:bg-surface-hover hover:text-content-ink text-content-subdued",
            currentLocale === locale
              ? "bg-brand-surface-alpha text-brand-content-primary hover:text-brand-content-primary"
              : ""
          )}
          onClick={() => handleLocaleChange(locale)}
        >
          {t(`localeShort.${locale}`)}
        </button>
      ))}
    </div>
  )
}
