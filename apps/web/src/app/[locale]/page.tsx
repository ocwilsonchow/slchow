import { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

const Page = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <div className="">
      <div></div>
    </div>
  )
}

export default Page
