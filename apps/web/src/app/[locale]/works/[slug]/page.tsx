import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { CollapsibleToc } from "@/features/mdx/components/toc"
import { buildPageMetadata } from "@/lib/metadata"
import {
  getCategoryStaticParams,
  getMdxContent,
  getPageLocales,
} from "@/lib/source"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = getMdxContent("works", slug, locale)

  return buildPageMetadata({
    title: page?.data.title ?? slug,
    description: page?.data.description,
    locale,
    pathname: `/works/${slug}`,
    type: "article",
    locales: getPageLocales("works", slug),
  })
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const page = getMdxContent("works", slug, locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/works" />
        </Header.Column>
        <Header.Column className="grid gap-5">
          <div className="mt-5 lg:mt-0 space-y-1">
            <h1 className="font-semibold tracking-tight text-content-ink">
              {page?.data.title}
            </h1>
            {page?.data.description && (
              <p className="text-content-subdued">{page?.data.description}</p>
            )}
          </div>
          <CollapsibleToc toc={toc} />
        </Header.Column>
      </Header.Root>
      <article className="min-w-0 p-5">
        <RenderMdxBlockByPath category="works" slug={slug} locale={locale} />
      </article>
    </PageLayout>
  )
}

export default Page

export function generateStaticParams() {
  return getCategoryStaticParams("works")
}

export const dynamic = "force-static"
export const dynamicParams = false
