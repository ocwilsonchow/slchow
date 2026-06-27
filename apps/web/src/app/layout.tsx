import { cn, DesignSystemProvider } from "@slchow/ds"
import { FontMono, FontSans } from "@slchow/ds/lib/fonts"
import { getLocale } from "next-intl/server"
import "lenis/dist/lenis.css"

import { Lenis } from "lenis/react"
import { Providers } from "./providers"
import "./styles.css"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "antialiased",
          FontSans.className,
          FontMono.className
          // FontSans.variable,
          // FontMono.variable
        )}
      >
        <DesignSystemProvider>
          <Lenis root>
            <Providers>{children}</Providers>
          </Lenis>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
