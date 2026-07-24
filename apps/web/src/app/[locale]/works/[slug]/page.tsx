import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2">
      <Header.Root>
        <Header.Column>
          <Link href="/works">Back</Link>
        </Header.Column>
        <Header.Column>
          <h1>Works</h1>
        </Header.Column>
      </Header.Root>
    </PageLayout>
  )
}

export default Page
