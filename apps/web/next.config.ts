import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  // PostHog ingest paths must not get a trailing-slash redirect.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/ja", destination: "/en", permanent: true },
      { source: "/ja/:path*", destination: "/en/:path*", permanent: true },
      {
        source: "/:locale/notes/frontend-security-nextjs-react-native",
        destination: "/:locale/notes/security-in-next-js",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  images: {
    // Next.js 16 default is 4h; hashed static imports (e.g. profile-pic.*.webp)
    // change URL on content change, so a long TTL is safe for repeat visits.
    minimumCacheTTL: 31536000, // 1 year
    localPatterns: [
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
}

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX()

export default withNextIntl(withMDX(nextConfig))
