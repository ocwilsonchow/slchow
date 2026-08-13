"use client"

import { DesignSystemProvider } from "@repo/ds"
import { ErrorView } from "@/features/layout/components/error-view"
import { StylesProvider } from "@/features/layout/components/styles"

import "./styles.css"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <title>Oops!</title>
        <DesignSystemProvider>
          <StylesProvider>
            <ErrorView
              title="Oops!"
              description="Something went wrong!"
              retryLabel="Try again"
              onRetry={reset}
            />
          </StylesProvider>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
