import { cn, DesignSystemProvider } from "@slchow/ds"
import { FontAero, FontMono, FontSans } from "@slchow/ds/lib/fonts"
import { getLocale } from "next-intl/server"

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
          FontMono.className,
          FontSans.variable
          // FontAero.variable,
          // FontAero.className
        )}
      >
        <DesignSystemProvider>
          <Providers>{children}</Providers>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
