import type { Locale } from "next-intl"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { BackLink } from "@/features/layout/components/back-link"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getCategoryStaticParams, getMdxContent } from "@/lib/source"
import { Toc } from "@/features/mdx/components/toc"
import { buildPageMetadata } from "@/lib/metadata"

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
    type: "article",
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
          <Toc toc={toc} />
        </Header.Column>
      </Header.Root>
      <div className="p-5">
        <RenderMdxBlockByPath category="works" slug={slug} locale={locale} />
      </div>
    </PageLayout>
  )
}

export default Page

export function generateStaticParams() {
  return getCategoryStaticParams("works")
}

export const dynamic = "force-static"
export const dynamicParams = false
