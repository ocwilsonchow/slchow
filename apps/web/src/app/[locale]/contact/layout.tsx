import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { PropsWithChildren } from "react"

export default async function Layout({
  params,
  children,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params

  setRequestLocale(locale as Locale)

  return <div>{children}</div>
}
