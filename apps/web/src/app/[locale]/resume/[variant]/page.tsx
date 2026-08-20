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
import { Link } from "@/i18n/navigation"
import { ChevronRightIcon } from "lucide-react"

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

  const otherVariant =
    variant === "frontend"
      ? { href: "/resume/full-stack" as const, label: "Resume - Full Stack" }
      : { href: "/resume/frontend" as const, label: "Resume - Frontend" }

  return (
    <div>
      <RenderMdxBlockByPath
        className="col-span-2 p-5 pb-10"
        category="blocks"
        slug={slug}
        locale={locale}
      />
      <div className="p-4 max-w-prose pb-40">
        <Link href={otherVariant.href}>
          <div className="bg-surface-alpha/75 font-semibold hover:bg-surface-alpha px-4 py-2.5 pr-2.5 rounded-2xl flex items-center gap-2">
            {otherVariant.label}
            <div className="ml-auto inline-block bg-surface-alpha rounded-full p-0.75">
              <ChevronRightIcon size={13} strokeWidth={3} />
            </div>
          </div>
        </Link>
      </div>
    </div>
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
