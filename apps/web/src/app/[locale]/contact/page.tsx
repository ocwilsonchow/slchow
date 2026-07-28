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
    <PageLayout className="grid lg:grid-cols-2 items-start">
      <Header.Root>
        <Header.Info />
        <Header.Column>
          <h1>Contact</h1>
        </Header.Column>
      </Header.Root>
      <div className="p-5"></div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
