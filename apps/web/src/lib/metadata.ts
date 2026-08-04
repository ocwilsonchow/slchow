import type { Metadata } from "next"
import type { Locale } from "next-intl"

const openGraphLocales = {
  en: "en_US",
  hk: "zh_HK",
  cn: "zh_CN",
} as const satisfies Record<Locale, string>

export function getOpenGraphLocale(locale: string) {
  return openGraphLocales[locale as Locale] ?? locale
}

type BuildPageMetadataOptions = {
  title: string
  description?: string
  locale: string
  type?: "website" | "article"
}

export function buildPageMetadata({
  title,
  description,
  locale,
  type = "website",
}: BuildPageMetadataOptions): Metadata {
  return {
    title,
    description,
    openGraph: {
      type,
      title,
      description,
      locale: getOpenGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
