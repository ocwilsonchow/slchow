import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getMdxContent, getWritingsStaticParams } from "@/lib/source"
import { CornerDownLeftIcon } from "lucide-react"
import { Toc } from "@/features/mdx/components/toc"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const t = await getTranslations("navigation")

  const page = getMdxContent("writings", slug, locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/writings">
            <CornerDownLeftIcon size={10} className="inline-block mr-1.5" />
            {t("back")}
          </Link>
        </Header.Column>
        <Header.Column>
          <Toc toc={toc} />
        </Header.Column>
      </Header.Root>
      <div className="p-5 pb-40">
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
