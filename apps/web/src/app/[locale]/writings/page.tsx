import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { getCategoryPages } from "@/lib/source"
import { ListWritings } from "@/features/writings/components/list-writings"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const works = getCategoryPages("works", locale)

  return (
    <PageLayout className="grid lg:grid-cols-2 content-start items-start">
      <Header.Root>
        <Header.Column>
          <Link href="/">Back</Link>
        </Header.Column>
        <Header.Column></Header.Column>
      </Header.Root>
      <div className="p-4">
        <ListWritings locale={locale} />
      </div>
    </PageLayout>
  )
}

export default Page
