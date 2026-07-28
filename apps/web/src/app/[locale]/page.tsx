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
    <PageLayout className="md:grid md:grid-cols-2 items-start">
      <Header.Root className="flex flex-col md:h-screen">
        <Header.Info className="" />
        <Header.Links />
      </Header.Root>
      <div>
        <div className="min-h-screen">
          <section id="introduction" className="p-5 min-h-dvh sm:min-h-fit">
            <RenderMdxBlockByPath
              category="blocks"
              slug="introduction"
              locale={locale}
            />
            <Divider />
          </section>
          <section
            id="works-and-writings"
            className="p-5 min-h-dvh sm:min-h-fit"
          >
            <ListWorks locale={locale} />
            <Divider />
            <ListWritings locale={locale} />
          </section>
        </div>
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
