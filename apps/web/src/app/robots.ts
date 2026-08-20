import type { MetadataRoute } from "next"
import {
  publicResumeVariant,
  resumeVariantParams,
} from "@/features/resume/variants"
import { routing } from "@/i18n/routing"
import { getSiteUrl } from "@/lib/metadata"

const hiddenResumePaths = routing.locales.flatMap((locale) =>
  resumeVariantParams
    .filter((variant) => variant !== publicResumeVariant)
    .map((variant) => `/${locale}/resume/${variant}`)
)

export default function robots(): MetadataRoute.Robots {
  if (process.env.SST_STAGE !== "production") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: hiddenResumePaths,
    },
    sitemap: `${getSiteUrl().origin}/sitemap.xml`,
  }
}
