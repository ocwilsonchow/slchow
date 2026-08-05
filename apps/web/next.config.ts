import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
    // Next.js 16 default is 4h; hashed static imports (e.g. profile-pic.*.webp)
    // change URL on content change, so a long TTL is safe for repeat visits.
    minimumCacheTTL: 31536000, // 1 year
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
