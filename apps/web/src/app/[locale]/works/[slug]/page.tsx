import type { Locale } from "next-intl"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { BackLink } from "@/features/layout/components/back-link"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getCategoryStaticParams, getMdxContent } from "@/lib/source"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = getMdxContent("works", slug, locale)
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

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/works" />
        </Header.Column>
        <Header.Column>
          <h1>Works</h1>
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
