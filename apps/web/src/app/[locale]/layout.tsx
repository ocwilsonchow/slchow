import { type Locale, NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { RootLayout } from "@/features/layout/components/root"
import { RenderNavbar } from "@/features/layout/components/navbar"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  setRequestLocale(locale as Locale)

  return (
    <NextIntlClientProvider key={locale}>
      <RenderNavbar />
      <RootLayout>{children}</RootLayout>
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
