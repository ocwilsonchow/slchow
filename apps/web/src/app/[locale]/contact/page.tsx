import type { Locale } from "next-intl"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { buildPageMetadata } from "@/lib/metadata"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return buildPageMetadata({
    title: t("contact.title"),
    description: t("contact.description"),
    locale,
  })
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "metadata" })

  return (
    <PageLayout className="grid lg:grid-cols-2 items-start">
      <Header.Root>
        <Header.Info />
        <Header.Column>
          <h1 className="font-semibold tracking-tight text-content-ink">
            {t("contact.title")}
          </h1>
        </Header.Column>
      </Header.Root>
      <div className="p-5"></div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
