import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { CollapsibleToc } from "@/features/mdx/components/toc"
import { NextNoteLink } from "@/features/notes/components/next-note-link"
import { buildPageMetadata } from "@/lib/metadata"
import {
  getMdxContent,
  getNotesStaticParams,
  getPageLocales,
} from "@/lib/source"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = getMdxContent("notes", slug, locale)

  return buildPageMetadata({
    title: page?.data.title ?? slug,
    description: page?.data.description,
    locale,
    pathname: `/notes/${slug}`,
    type: "article",
    locales: getPageLocales("notes", slug),
  })
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const page = getMdxContent("notes", slug, locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/notes" />
        </Header.Column>
        <Header.Column
          className="grid gap-5 max-h-screen overflow-y-auto lg:pb-20"
          data-lenis-prevent
        >
          <div className="mt-8 lg:mt-0 space-y-1">
            <h1 className="text-lg lg:text-sm font-semibold tracking-tight text-content-ink">
              {page?.data.title}
            </h1>
            {page?.data.description && (
              <p className="text-content-subdued leading-snug">
                {page?.data.description}
              </p>
            )}
          </div>
          <CollapsibleToc toc={toc} />
        </Header.Column>
      </Header.Root>
      <article className="p-5">
        <RenderMdxBlockByPath category="notes" slug={slug} locale={locale} />
        <NextNoteLink slug={slug} locale={locale} />
      </article>
    </PageLayout>
  )
}

export default Page

export function generateStaticParams() {
  return getNotesStaticParams()
}

export const dynamic = "force-static"
export const dynamicParams = false
