import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2">
      <Header.Root>
        <Header.Info />
        <Header.Column>
          <h1>Writings</h1>
        </Header.Column>
      </Header.Root>
      <div className=""></div>
    </PageLayout>
  )
}

export default Page
