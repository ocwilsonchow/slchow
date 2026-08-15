import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DesignPageView } from "@/features/design/components/design-page-view"
import { getDesigns } from "@/features/design/get-designs"
import { BackLink } from "@/features/layout/components/back-link"
import { PageLayout } from "@/features/layout/components/page"
import { buildPageMetadata } from "@/lib/metadata"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return buildPageMetadata({
    title: t("designs.title"),
    description: t("designs.description"),
    locale,
    pathname: "/design",
  })
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "metadata" })
  const tDesigns = await getTranslations({ locale, namespace: "designs" })

  return (
    <PageLayout className="hide-webkit-scrollbar">
      <DesignPageView
        designs={getDesigns()}
        designsTitle={t("designs.title")}
        intro={tDesigns("intro")}
        homeBack={<BackLink href="/" />}
      />
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
