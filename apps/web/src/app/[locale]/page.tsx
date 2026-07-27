import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { Header } from "@/features/layout/components/header"
import { ListWorks } from "@/features/works/components/list-works"
import { ListWritings } from "@/features/writings/components/list-writings"
import { Divider } from "@repo/ds/components/ui/divider"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="md:grid md:grid-cols-2 md:space-y-20">
      <Header.Root>
        <Header.Info />
        <Header.Links />
      </Header.Root>
      <div className="p-4 space-y-4">
        <RenderMdxBlockByPath category="blocks" slug="introduction" />
        <Divider />
        <ListWorks locale={locale} />
        <Divider />
        <ListWritings locale={locale} />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
