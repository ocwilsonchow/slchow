import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getMdxContent } from "@/lib/source"
import { CornerDownLeftIcon } from "lucide-react"
import { Toc } from "@/features/mdx/components/toc"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations("navigation")
  const page = getMdxContent("blocks", "resume", locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start content-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">
            <CornerDownLeftIcon size={10} className="inline-block mr-1.5" />
            {t("back")}
          </Link>
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-5">
          <h1 className="font-semibold tracking-tight text-content-ink">Resume</h1>
          <Toc toc={toc} />
        </Header.Column>
      </Header.Root>
      <article className="grid">
        <RenderMdxBlockByPath
          className="col-span-2 p-5 pb-40"
          category="blocks"
          slug="resume"
          locale={locale}
        />
      </article>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
