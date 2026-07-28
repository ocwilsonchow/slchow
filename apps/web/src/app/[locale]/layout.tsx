import { DesignSystemProvider } from "@repo/ds"
import { Lenis } from "lenis/react"
import "lenis/dist/lenis.css"
import {
  hasLocale,
  type Locale,
  NextIntlClientProvider,
} from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
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

function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) return new URL(siteUrl)

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelUrl) return new URL(`https://${vercelUrl}`)

  return new URL("http://localhost:3003")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: "Wilson Chow",
      template: "%s · Wilson Chow",
    },
    description:
      "Software developer — product, design systems, and AI agents.",
    openGraph: {
      type: "website",
      locale,
      siteName: "Wilson Chow",
      title: "Wilson Chow",
      description:
        "Software developer — product, design systems, and AI agents.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Wilson Chow",
      description:
        "Software developer — product, design systems, and AI agents.",
    },
  }
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
