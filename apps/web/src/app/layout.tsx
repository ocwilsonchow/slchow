import { DesignSystemProvider } from "@repo/ds"
import { getLocale } from "next-intl/server"
import { Lenis } from "lenis/react"
import "lenis/dist/lenis.css"
import { TanstackProviders } from "@/lib/tanstack-providers"

import "./styles.css"
import { StylesProvider } from "@/features/layout/components/styles"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <DesignSystemProvider>
          <StylesProvider>
            <Lenis root>
              <TanstackProviders>{children}</TanstackProviders>
            </Lenis>
          </StylesProvider>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
