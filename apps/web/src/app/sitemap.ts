import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { buildAbsoluteLanguageAlternates } from "@/lib/metadata"
import { getCategoryPages } from "@/lib/source"

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) return new URL(siteUrl)

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelUrl) return new URL(`https://${vercelUrl}`)

  return new URL("http://localhost:3003")
}

const staticPaths = [
  "",
  "/resume",
  "/notes",
  "/works",
  "/design",
  "/contact",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl().origin
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${origin}/${locale}${path}`,
        lastModified,
        alternates: {
          languages: buildAbsoluteLanguageAlternates(origin, path),
        },
      })
    }

    for (const category of ["notes", "works"] as const) {
      for (const page of getCategoryPages(category, locale)) {
        const slug = page.slugs.slice(1).join("/")
        const pathname = `/${category}/${slug}`
        entries.push({
          url: `${origin}/${locale}${pathname}`,
          lastModified,
          alternates: {
            languages: buildAbsoluteLanguageAlternates(origin, pathname),
          },
        })
      }
    }
  }

  return entries
}
