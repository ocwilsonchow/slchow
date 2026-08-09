import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
    // Next.js 16 default is 4h; hashed static imports (e.g. profile-pic.*.webp)
    // change URL on content change, so a long TTL is safe for repeat visits.
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    localPatterns: [
      {
        pathname: "/design-assets/**",
        search: "",
      },
      {
        // Preserve access to files in `public/` (e.g. OG image).
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/design-assets/**": ["../../packages/content/design/**/*"],
  },
}

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX()

export default withNextIntl(withMDX(nextConfig))
