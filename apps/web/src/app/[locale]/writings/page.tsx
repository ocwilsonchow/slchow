import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { ListWritings } from "@/features/writings/components/list-writings"
import { CornerDownLeftIcon } from "lucide-react"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations("navigation")

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">
            <CornerDownLeftIcon size={10} className="inline-block mr-1.5" />
            {t("back")}
          </Link>
        </Header.Column>
        <Header.Column></Header.Column>
      </Header.Root>
      <div className="p-4">
        <ListWritings locale={locale} limit={Infinity} />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
