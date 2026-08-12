import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { routing } from "@/i18n/routing"

export const OG_IMAGE = {
  url: "/og-image-02.png",
  width: 2400,
  height: 1260,
} as const

const openGraphLocales = {
  en: "en_US",
  hk: "zh_HK",
  cn: "zh_CN",
  ja: "ja_JP",
} as const satisfies Record<Locale, string>

/** BCP 47 language tags for the document `lang` attribute and hreflang. */
const htmlLangs = {
  en: "en",
  hk: "zh-HK",
  cn: "zh-CN",
  ja: "ja",
} as const satisfies Record<Locale, string>

export function getOpenGraphLocale(locale: string) {
  return openGraphLocales[locale as Locale] ?? locale
}

export function getHtmlLang(locale: string) {
  return htmlLangs[locale as Locale] ?? locale
}

/** Normalize a locale-stripped pathname (`""` or `/notes/...`). */
function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return ""
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

/**
 * BCP 47 hreflang map for a locale-stripped pathname.
 * Keys are valid hreflang tags (`en`, `zh-HK`, `zh-CN`, `ja`, `x-default`);
 * values are site-relative locale-prefixed paths (`/hk/notes`).
 */
export function buildLanguageAlternates(
  pathname: string
): Record<string, string> {
  const path = normalizePathname(pathname)
  const languages: Record<string, string> = {
    "x-default": `/${routing.defaultLocale}${path}`,
  }

  for (const locale of routing.locales) {
    languages[getHtmlLang(locale)] = `/${locale}${path}`
  }

  return languages
}

/**
 * Absolute-URL hreflang map for sitemap entries.
 */
export function buildAbsoluteLanguageAlternates(
  origin: string,
  pathname: string
): Record<string, string> {
  const relative = buildLanguageAlternates(pathname)
  const absolute: Record<string, string> = {}

  for (const [hreflang, path] of Object.entries(relative)) {
    absolute[hreflang] = `${origin}${path}`
  }

  return absolute
}

type BuildPageMetadataOptions = {
  title: string
  description?: string
  locale: string
  /** Locale-stripped path, e.g. `""`, `"/notes"`, `"/notes/to-study"`. */
  pathname: string
  type?: "website" | "article"
}

export function buildPageMetadata({
  title,
  description,
  locale,
  pathname,
  type = "website",
}: BuildPageMetadataOptions): Metadata {
  const path = normalizePathname(pathname)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type,
      title,
      description,
      locale: getOpenGraphLocale(locale),
      images: [{ ...OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ ...OG_IMAGE, alt: title }],
    },
  }
}
