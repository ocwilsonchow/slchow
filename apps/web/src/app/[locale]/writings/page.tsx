import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { BackLink } from "@/features/layout/components/back-link"
import { ListWritings } from "@/features/writings/components/list-writings"

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
          <BackLink href="/" />
        </Header.Column>
        <Header.Column className="mt-10 lg:mt-0 grid gap-5">
          <h1 className="font-semibold tracking-tight text-content-ink">
            Writings
          </h1>
        </Header.Column>
      </Header.Root>
      <div className="p-5">
        <ListWritings locale={locale} limit={Infinity} showHeading={false} />
      </div>
    </PageLayout>
  )
}

export default Page

export const dynamic = "force-static"
