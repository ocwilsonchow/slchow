import { DesignSystemProvider } from "@repo/ds"
import { NotFoundView } from "@/features/layout/components/not-found-view"
import { StylesProvider } from "@/features/layout/components/styles"

import "./styles.css"

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <DesignSystemProvider>
          <StylesProvider>
            <NotFoundView
              title="Oops!"
              description="This page does not exist!"
            />
          </StylesProvider>
        </DesignSystemProvider>
      </body>
    </html>
  )
}
