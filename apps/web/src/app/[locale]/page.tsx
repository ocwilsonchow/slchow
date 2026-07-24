import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { Header } from "@/features/layout/components/header"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="md:grid md:grid-cols-2 space-y-20">
      <Header.Root>
        <Header.Info />
        <Header.Links />
      </Header.Root>
      <div className="">
        <RenderMdxBlockByPath category="blocks" slug="introduction" />
      </div>
    </PageLayout>
  )
}

export default Page
