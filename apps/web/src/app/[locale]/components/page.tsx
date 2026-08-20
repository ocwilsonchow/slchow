import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { buildPageMetadata } from "@/lib/metadata"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return buildPageMetadata({
    title: t("components.title"),
    description: t("components.description"),
    locale,
    pathname: "/components",
  })
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "metadata" })
  const tComponents = await getTranslations({ locale, namespace: "components" })

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 space-y-1">
          <h1 className="font-semibold tracking-tight text-content-ink">
            {t("components.title")}
          </h1>
          <p className="text-content-subdued">{tComponents("intro")}</p>
        </Header.Column>
      </Header.Root>
      <div className="p-5">{tComponents("comingSoon")}</div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
