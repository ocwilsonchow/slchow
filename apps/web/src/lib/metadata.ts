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
} as const satisfies Record<Locale, string>

/** BCP 47 language tags for the document `lang` attribute and hreflang. */
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

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) return new URL(siteUrl)

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelUrl) return new URL(`https://${vercelUrl}`)

  return new URL("http://localhost:3003")
}

/** Normalize a locale-stripped pathname (`""` or `/notes/...`). */
function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return ""
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function resolveAlternateLocales(locales?: readonly string[]) {
  if (locales && locales.length > 0) return locales
  return routing.locales
}

function resolveCanonicalLocale(locale: string, available: readonly string[]) {
  if (available.includes(locale)) return locale
  if (available.includes(routing.defaultLocale)) return routing.defaultLocale
  return available[0] ?? locale
}

/**
 * BCP 47 hreflang map for a locale-stripped pathname.
 * Keys are valid hreflang tags (`en`, `zh-HK`, `zh-CN`, `x-default`);
 * values are site-relative locale-prefixed paths (`/hk/notes`).
 */
export function buildLanguageAlternates(
  pathname: string,
  locales?: readonly string[]
): Record<string, string> {
  const path = normalizePathname(pathname)
  const available = resolveAlternateLocales(locales)
  const defaultLocale = available.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (available[0] ?? routing.defaultLocale)

  const languages: Record<string, string> = {
    "x-default": `/${defaultLocale}${path}`,
  }

  for (const locale of available) {
    languages[getHtmlLang(locale)] = `/${locale}${path}`
  }

  return languages
}

type BuildPageMetadataOptions = {
  title: string
  description?: string
  locale: string
  /** Locale-stripped path, e.g. `""`, `"/notes"`, `"/notes/to-study"`. */
  pathname: string
  type?: "website" | "article"
  /** Locales that actually have this page. Defaults to every routed locale. */
  locales?: readonly string[]
}

export function buildPageMetadata({
  title,
  description,
  locale,
  pathname,
  type = "website",
  locales,
}: BuildPageMetadataOptions): Metadata {
  const path = normalizePathname(pathname)
  const available = resolveAlternateLocales(locales)
  const canonicalLocale = resolveCanonicalLocale(locale, available)

  return {
    title,
    description,
    alternates: {
      canonical: `/${canonicalLocale}${path}`,
      languages: buildLanguageAlternates(path, available),
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
