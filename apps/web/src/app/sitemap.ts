import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { getSiteUrl } from "@/lib/metadata"
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
      })
    }
  }

  for (const locale of routing.locales) {
    for (const category of contentCategories) {
      for (const page of getNativeCategoryPages(category, locale)) {
        const pathname = `/${category}/${page.slugs.slice(1).join("/")}`
        const lastModified = toLastModified(page.data.date)

        entries.push({
          url: `${origin}/${locale}${pathname}`,
          ...(lastModified ? { lastModified } : {}),
        })
      }
    }
  }

  return entries
}
