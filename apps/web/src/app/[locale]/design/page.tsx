import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ListDesigns } from "@/features/design/components/list-designs"
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
    <PageLayout className="">
      <Header.Root className="lg:relative">
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-2">
          <h1 className="font-semibold tracking-tight text-content-ink">
            {t("designs.title")}
          </h1>
          <p className="leading-snug">{tDesigns("intro")}</p>
        </Header.Column>
      </Header.Root>
      <div className="p-5">
        <ListDesigns />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
