import type { Locale } from "next-intl"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { Header } from "@/features/layout/components/header"
import { ListWorks } from "@/features/works/components/list-works"
import { ListWritings } from "@/features/writings/components/list-writings"
import { Divider } from "@repo/ds/components/ui/divider"
import { buildPageMetadata } from "@/lib/metadata"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })
  const title = t("home.title")
  const description = t("home.description")

  return {
    ...buildPageMetadata({ title, description, locale }),
    // Skip the "%s · siteName" template on the homepage
    title: { absolute: title },
  }
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
        <div className="p-5">
          <section id="introduction" className="">
            <RenderMdxBlockByPath
              category="blocks"
              slug="introduction"
              locale={locale}
            />
          </section>
          <Divider />
          <section id="works-and-writings" className="flex flex-col">
            {/* <ListWorks locale={locale} />
            <Divider /> */}
            <ListWritings locale={locale} />
            <Divider />
          </section>
        </div>
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
