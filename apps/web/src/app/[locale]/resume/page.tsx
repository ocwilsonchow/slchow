import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">Back</Link>
        </Header.Column>
        <Header.Column>
          <h1>Resume</h1>
        </Header.Column>
      </Header.Root>
      <div className="p-4">
        <RenderMdxBlockByPath category="blocks" slug="resume" />
      </div>
    </PageLayout>
  )
}

export default Page
