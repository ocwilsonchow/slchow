import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { PageLayout } from "@/features/layout/components/page"
import { Header } from "@/features/layout/components/header"
import { Link } from "@/i18n/navigation"
import { getWritingsPages } from "@/lib/source"

type Props = {
  params: Promise<{ locale: Locale }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params

  setRequestLocale(locale)

  const writings = getWritingsPages(locale)

  return (
    <PageLayout className="grid lg:grid-cols-2">
      <Header.Root>
        <Header.Info />
        <Header.Column>
          <h1>Writings</h1>
        </Header.Column>
      </Header.Root>
      <div className="flex flex-col">
        {writings.map((page) => {
          const slug = page.slugs.slice(1).join("/")
          return (
            <Link key={page.url} href={`/writings/${slug}`}>
              {page.data.title}
            </Link>
          )
        })}
      </div>
    </PageLayout>
  )
}

export default Page
