import { DesignSystemProvider } from "@repo/ds"
import { Lenis } from "lenis/react"
import "lenis/dist/lenis.css"
import {
  hasLocale,
  type Locale,
  NextIntlClientProvider,
} from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { RenderNavbar } from "@/features/layout/components/navbar"
import { RootLayout } from "@/features/layout/components/root"
import { StylesProvider } from "@/features/layout/components/styles"
import { routing } from "@/i18n/routing"
import { TanstackProviders } from "@/lib/tanstack-providers"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <DesignSystemProvider>
          <StylesProvider>
            <Lenis root>
              <TanstackProviders>
                <NextIntlClientProvider locale={locale} messages={messages}>
                  <RenderNavbar />
                  <RootLayout>{children}</RootLayout>
                </NextIntlClientProvider>
              </TanstackProviders>
            </Lenis>
          </StylesProvider>
        </DesignSystemProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamic = "force-static"
