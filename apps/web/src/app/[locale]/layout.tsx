import { DesignSystemProvider } from "@repo/ds"
import "lenis/dist/lenis.css"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl"
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server"
import { getDesigns } from "@/features/design/get-designs"
import { SiteNavbar } from "@/features/layout/components/navbar"
import { RootLayout } from "@/features/layout/components/root"
import { SkipLink } from "@/features/layout/components/skip-link"
import { SmoothScroll } from "@/features/layout/components/smooth-scroll"
import { StylesProvider } from "@/features/layout/components/styles"
import { SiteSearchProvider } from "@/features/search/components/search-provider"
import { routing } from "@/i18n/routing"
import { getHtmlLang, getOpenGraphLocale, OG_IMAGE } from "@/lib/metadata"
import { getPostHogProjectToken } from "@/lib/posthog"
import { PostHogProvider } from "@/lib/posthog-provider"
import { getCategoryPages } from "@/lib/source"
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
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: t("siteTitle"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("siteDescription"),
    openGraph: {
      type: "website",
      locale: getOpenGraphLocale(locale),
      siteName: t("siteName"),
      title: t("siteTitle"),
      description: t("siteDescription"),
      images: [{ ...OG_IMAGE, alt: t("siteTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteTitle"),
      description: t("siteDescription"),
      images: [{ ...OG_IMAGE, alt: t("siteTitle") }],
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
  const notesCount = getCategoryPages("notes", locale).length
  const designsCount = getDesigns().reduce(
    (total, design) => total + design.images.length,
    0
  )
  const posthogToken = getPostHogProjectToken()

  return (
    <html lang={getHtmlLang(locale)} suppressHydrationWarning>
      <body>
        <PostHogProvider token={posthogToken}>
          <DesignSystemProvider>
            <StylesProvider>
              <SmoothScroll>
                <TanstackProviders>
                  <NextIntlClientProvider locale={locale} messages={messages}>
                    <SiteSearchProvider>
                      <SkipLink />
                      <SiteNavbar
                        notesCount={notesCount}
                        designsCount={designsCount}
                      />
                      {/* <div className="fixed bottom-0 left-0 right-0 h-24 bg-linear-to-t pointer-events-none from-surface-canvas to-surface-canvas/0" /> */}
                      <RootLayout>{children}</RootLayout>
                    </SiteSearchProvider>
                  </NextIntlClientProvider>
                </TanstackProviders>
              </SmoothScroll>
            </StylesProvider>
          </DesignSystemProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamic = "force-static"
