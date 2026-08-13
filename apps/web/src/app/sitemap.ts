import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { buildAbsoluteLanguageAlternates, getSiteUrl } from "@/lib/metadata"
import { getNativeCategoryPages } from "@/lib/source"

const staticPaths = [
  "",
  "/resume",
  "/notes",
  "/works",
  "/design",
  "/contact",
] as const

const contentCategories = ["notes", "works"] as const

function toLastModified(date?: string | Date) {
  if (!date) return undefined
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl().origin
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${origin}/${locale}${path}`,
        alternates: {
          languages: buildAbsoluteLanguageAlternates(origin, path),
        },
      })
    }
  }

  const localesByPathname = new Map<string, string[]>()
  const contentPages: Array<{
    locale: string
    pathname: string
    lastModified?: Date
  }> = []

  for (const locale of routing.locales) {
    for (const category of contentCategories) {
      for (const page of getNativeCategoryPages(category, locale)) {
        const pathname = `/${category}/${page.slugs.slice(1).join("/")}`
        const locales = localesByPathname.get(pathname)
        if (locales) locales.push(locale)
        else localesByPathname.set(pathname, [locale])

        contentPages.push({
          locale,
          pathname,
          lastModified: toLastModified(page.data.date),
        })
      }
    }
  }

  for (const page of contentPages) {
    entries.push({
      url: `${origin}/${page.locale}${page.pathname}`,
      ...(page.lastModified ? { lastModified: page.lastModified } : {}),
      alternates: {
        languages: buildAbsoluteLanguageAlternates(
          origin,
          page.pathname,
          localesByPathname.get(page.pathname)
        ),
      },
    })
  }

  return entries
}
