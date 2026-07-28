import type { Locale } from "next-intl"
import { createOgImage, ogContentType, ogSize } from "@/features/og/og-image"
import { getCategoryStaticParams, getMdxContent } from "@/lib/source"

export const alt = "Work"
export const size = ogSize
export const contentType = ogContentType

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function Image({ params }: Props) {
  const { locale, slug } = await params
  const page = getMdxContent("works", slug, locale)

  return createOgImage({
    title: page?.data.title ?? slug,
    description: page?.data.description ?? "Wilson Chow",
  })
}

export function generateStaticParams() {
  return getCategoryStaticParams("works")
}
