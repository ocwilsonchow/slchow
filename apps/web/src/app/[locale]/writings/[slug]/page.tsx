import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

const Page = async ({ params }: Props) => {
  const { locale, slug } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/writings">Back</Link>
        </Header.Column>
        <Header.Column>
          <h1>Writings</h1>
        </Header.Column>
      </Header.Root>
      <div className="p-4 pb-40">
        <RenderMdxBlockByPath category="writings" slug={slug} />
      </div>
    </PageLayout>
  )
}

export default Page
