import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

const Page = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params

  setRequestLocale(locale)

  return <div className="max-w-screen-2xl mx-auto"></div>
}

export default Page
