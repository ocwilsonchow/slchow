import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import {
  isResumeVariant,
  publicResumeVariant,
  resumeVariantParams,
  resumeVariants,
} from "@/features/resume/variants"
import { routing } from "@/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getMdxContent, getPageLocales } from "@/lib/source"

type Props = {
  params: Promise<{ locale: Locale; variant: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, variant } = await params
  if (!isResumeVariant(variant)) notFound()

  const slug = resumeVariants[variant]
  const page = getMdxContent("blocks", slug, locale)

  return {
    ...buildPageMetadata({
      title: page?.data.title ?? "Resume",
      locale,
      pathname: `/resume/${variant}`,
      locales: getPageLocales("blocks", slug),
    }),
    ...(variant === publicResumeVariant
      ? {}
      : { robots: { index: false, follow: false } }),
  }
}

const Page = async ({ params }: Props) => {
  const { locale, variant } = await params

  setRequestLocale(locale)

  if (!isResumeVariant(variant)) notFound()

  const slug = resumeVariants[variant]
  if (!getMdxContent("blocks", slug, locale)) notFound()

  return (
    <RenderMdxBlockByPath
      className="col-span-2 p-5 pb-24"
      category="blocks"
      slug={slug}
      locale={locale}
    />
  )
}

export default Page

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    resumeVariantParams.map((variant) => ({ locale, variant }))
  )
}

export const dynamic = "force-static"
export const dynamicParams = false
