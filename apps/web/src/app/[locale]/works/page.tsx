import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { ListWorks } from "@/features/works/components/list-works"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">Back</Link>
        </Header.Column>
        <Header.Column></Header.Column>
      </Header.Root>
      <div className="p-4">
        <ListWorks locale={locale} />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
