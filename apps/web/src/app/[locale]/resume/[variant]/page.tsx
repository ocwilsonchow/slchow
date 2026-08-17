import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { Toc } from "@/features/mdx/components/toc"
import {
  isResumeVariant,
  resumeVariantParams,
  resumeVariants,
} from "@/features/resume/variants"
import { routing } from "@/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getMdxContent, getPageLocales, loadMdxCompiled } from "@/lib/source"

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
    robots: { index: false, follow: false },
  }
}

const Page = async ({ params }: Props) => {
  const { locale, variant } = await params

  setRequestLocale(locale)

  if (!isResumeVariant(variant)) notFound()

  const slug = resumeVariants[variant]
  const page = getMdxContent("blocks", slug, locale)
  if (!page) notFound()

  const toc = (await loadMdxCompiled(page)).toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start content-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-5 space-y-1">
          <h1 className="font-semibold tracking-tight text-content-ink">
            {page.data.title}
          </h1>
          <Toc toc={toc} className="hidden lg:block" />
        </Header.Column>
      </Header.Root>
      <article className="grid">
        <RenderMdxBlockByPath
          className="col-span-2 p-5 pb-24"
          category="blocks"
          slug={slug}
          locale={locale}
        />
      </article>
    </PageLayout>
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
