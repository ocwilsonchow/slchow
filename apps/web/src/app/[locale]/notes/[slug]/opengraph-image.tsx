import type { Locale } from "next-intl"
import { createOgImage, ogContentType, ogSize } from "@/features/og/og-image"
import { getMdxContent, getNotesStaticParams } from "@/lib/source"

export const alt = "Note"
export const size = ogSize
export const contentType = ogContentType

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function Image({ params }: Props) {
  const { locale, slug } = await params
  const page = getMdxContent("notes", slug, locale)

  return createOgImage({
    title: page?.data.title ?? slug,
    description: page?.data.description ?? "Wilson Chow",
  })
}

export function generateStaticParams() {
  return getNotesStaticParams()
}
