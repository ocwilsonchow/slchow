import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/metadata"

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
    },
    sitemap: `${getSiteUrl().origin}/sitemap.xml`,
  }
}
