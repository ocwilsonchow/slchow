import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
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
    title: t("contact.title"),
    description: t("contact.description"),
    locale,
    pathname: "/contact",
  })
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "metadata" })
  const tContact = await getTranslations({ locale, namespace: "contact" })

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
      <div className="p-5">
        <p>
          {tContact.rich("body", {
            email: (chunks) => (
              <a
                href="mailto:sinlongchow@gmail.com"
                className="text-content-ink underline underline-offset-4 font-semibold"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
