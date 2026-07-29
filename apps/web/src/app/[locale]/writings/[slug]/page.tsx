import type { Locale } from "next-intl"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { BackLink } from "@/features/layout/components/back-link"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getMdxContent, getWritingsStaticParams } from "@/lib/source"
import { Toc } from "@/features/mdx/components/toc"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = getMdxContent("writings", slug, locale)
  const title = page?.data.title ?? slug
  const description = page?.data.description

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const page = getMdxContent("writings", slug, locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/writings" />
        </Header.Column>
        <Header.Column className="grid gap-5">
          <div className="mt-5 lg:mt-0">
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
      <div className="p-5 pb-24">
        <RenderMdxBlockByPath category="writings" slug={slug} locale={locale} />
      </div>
    </PageLayout>
  )
}

export default Page

export function generateStaticParams() {
  return getWritingsStaticParams()
}

export const dynamic = "force-static"
export const dynamicParams = false
