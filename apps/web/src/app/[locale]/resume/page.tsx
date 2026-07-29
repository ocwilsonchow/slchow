import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { BackLink } from "@/features/layout/components/back-link"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { getMdxContent } from "@/lib/source"
import { Toc } from "@/features/mdx/components/toc"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const page = getMdxContent("blocks", "resume", locale)
  const toc = page?.data.toc ?? []

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start content-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-5">
          <h1 className="font-semibold tracking-tight text-content-ink">Resume</h1>
          <Toc toc={toc} />
        </Header.Column>
      </Header.Root>
      <article className="grid">
        <RenderMdxBlockByPath
          className="col-span-2 p-5 pb-24"
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
