import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
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
