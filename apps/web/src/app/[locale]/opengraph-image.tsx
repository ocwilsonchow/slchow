import { createOgImage, ogContentType, ogSize } from "@/features/og/og-image"

export const alt = "Wilson Chow"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return createOgImage()
}
