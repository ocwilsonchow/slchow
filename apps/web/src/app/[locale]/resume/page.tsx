import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { CornerDownLeftIcon } from "lucide-react"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations("navigation")

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start content-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">
            <CornerDownLeftIcon size={10} className="inline-block mr-1.5" />
            {t("back")}
          </Link>
        </Header.Column>
        <Header.Column>
          <h1>Resume</h1>
        </Header.Column>
      </Header.Root>
      <div className="p-5 pb-40">
        <RenderMdxBlockByPath
          category="blocks"
          slug="resume"
          locale={locale}
        />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
