import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BackLink } from "@/features/layout/components/back-link"
import { Header } from "@/features/layout/components/header"
import { PageLayout } from "@/features/layout/components/page"
import { ListNotes } from "@/features/notes/components/list-notes"
import { buildPageMetadata } from "@/lib/metadata"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return buildPageMetadata({
    title: t("notes.title"),
    description: t("notes.description"),
    locale,
    pathname: "/notes",
  })
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "metadata" })
  const tNotes = await getTranslations({ locale, namespace: "notes" })

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-2">
          <h1 className="font-semibold tracking-tight text-content-ink">
            {t("notes.title")}
          </h1>
          <p className="leading-snug text-content-subdued">{tNotes("intro")}</p>
        </Header.Column>
      </Header.Root>
      <div className="p-5 pb-50">
        <ListNotes locale={locale} variant="tree" showHeading={false} />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
