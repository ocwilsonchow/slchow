import type { Metadata } from "next"
import type { Locale } from "next-intl"

const openGraphLocales = {
  en: "en_US",
  hk: "zh_HK",
  cn: "zh_CN",
} as const satisfies Record<Locale, string>

/** BCP 47 language tags for the document `lang` attribute. */
const htmlLangs = {
  en: "en",
  hk: "zh-HK",
  cn: "zh-CN",
} as const satisfies Record<Locale, string>

export function getOpenGraphLocale(locale: string) {
  return openGraphLocales[locale as Locale] ?? locale
}

export function getHtmlLang(locale: string) {
  return htmlLangs[locale as Locale] ?? locale
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
