import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getCategoryStaticParams } from "@/lib/source"
import { CornerDownLeftIcon } from "lucide-react"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  const t = await getTranslations("navigation")

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/works">
            <CornerDownLeftIcon size={10} className="inline-block mr-1.5" />
            {t("back")}
          </Link>
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
