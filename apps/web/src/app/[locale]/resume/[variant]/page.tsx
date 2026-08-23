import { ChevronRightIcon, DownloadIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import {
  isResumeVariant,
  publicResumeVariant,
  type ResumeVariant,
  resumeVariantParams,
  resumeVariants,
} from "@/features/resume/variants"
import { Link } from "@/i18n/navigation"
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

const linkClassnames =
  "bg-surface-alpha/75 font-semibold hover:bg-surface-alpha px-4 py-3 pr-3 rounded-full flex items-center gap-2 border"

const Page = async ({ params }: Props) => {
  const { locale, variant } = await params

  setRequestLocale(locale)

  if (!isResumeVariant(variant)) notFound()

  const slug = resumeVariants[variant]
  if (!getMdxContent("blocks", slug, locale)) notFound()

  const t = await getTranslations({ locale, namespace: "resume" })
  const resumePdfHrefs = {
    frontend: "/resume-frontend.pdf",
    "full-stack": "/resume-full-stack.pdf",
    ai: "/resume-ai.pdf",
    mobile: "/resume-mobile.pdf",
  } satisfies Record<ResumeVariant, string>
  const currentPdfHref = resumePdfHrefs[variant]
  const otherVariant =
    variant === "frontend"
      ? { href: "/resume/full-stack" as const, key: "full-stack" as const }
      : { href: "/resume/frontend" as const, key: "frontend" as const }

  return (
    <div>
      <RenderMdxBlockByPath
        className="col-span-2 p-5 pb-10"
        category="blocks"
        slug={slug}
        locale={locale}
      />
      <div className="p-4 max-w-prose pb-40 grid gap-2">
        <a href={currentPdfHref} target="_blank">
          <div className={linkClassnames}>
            {t("downloadPdf", { variant: t(`variants.${variant}`) })}
            <div className="border ml-auto bg-surface-alpha rounded-full p-0.75 size-5.5 grid place-items-center">
              <DownloadIcon size={12} strokeWidth={3} />
            </div>
          </div>
        </a>
        <Link href={otherVariant.href}>
          <div className={linkClassnames}>
            {t("view", { variant: t(`variants.${otherVariant.key}`) })}
            <div className="border ml-auto bg-surface-alpha rounded-full p-0.75 size-5.5 grid place-items-center">
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
