import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { PropsWithChildren } from "react"

export default async function Layout({
  params,
  children,
}: PropsWithChildren<{ params: Promise<{ locale: Locale }> }>) {
  const { locale } = await params

  setRequestLocale(locale)

  return <div>{children}</div>
}
