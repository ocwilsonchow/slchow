import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import {
  FeaturedDesigns,
  FeaturedStack,
} from "@/features/design/components/featured-designs"
import { getFeaturedImages } from "@/features/design/featured"
import { getDesigns } from "@/features/design/get-designs"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { RenderMdxBlockByPath } from "@/features/mdx/components/render-mdx-block"
import { ListNotes } from "@/features/notes/components/list-notes"
import { buildPageMetadata } from "@/lib/metadata"
import { ListWorks } from "@/features/works/components/list-works"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })
  const title = t("home.title")
  const description = t("home.description")

  return {
    ...buildPageMetadata({ title, description, locale, pathname: "" }),
    // Skip the "%s · siteName" template on the homepage
    title: { absolute: title },
  }
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const featuredImages = getFeaturedImages()
  const designsCount = getDesigns().reduce(
    (total, design) => total + design.images.length,
    0
  )

  return (
    <PageLayout>
      <FeaturedDesigns images={featuredImages} assetCount={designsCount}>
        <Header.Root className="flex flex-col md:h-screen">
          <Header.Info className="" />
          <Header.Links />
        </Header.Root>
        <div>
          <div className="pt-0 md:pt-5  p-5">
            <section id="introduction" className="">
              <RenderMdxBlockByPath
                category="blocks"
                slug="introduction"
                locale={locale}
              />
            </section>
            <section id="works-and-notes" className="flex flex-col pb-40">
              <ListNotes locale={locale} preview />
              <ListWorks />
              <FeaturedStack />
            </section>
          </div>
        </div>
      </FeaturedDesigns>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
