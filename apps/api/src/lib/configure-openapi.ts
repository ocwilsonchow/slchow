import { Scalar } from "@scalar/hono-api-reference"

import type { AppOpenAPI } from "@/lib/types"

export function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent("securitySchemes", "cookie", {
    type: "apiKey",
    in: "cookie",
    name: "session",
    description:
      "Better Auth session cookie (sent automatically by the browser)",
  })

  // OpenAPI JSON spec endpoint
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: "API documentation",
    },
  })

  // Scalar API Reference UI
  app.get(
    "/reference",
    Scalar({
      theme: "alternate",
      title: "API Reference",
      defaultOpenFirstTag: false,
      defaultOpenAllTags: false,
      pageTitle: "API Reference",
      persistAuth: true,
      sources: [
        {
          url: "/doc",
          title: "App",
        },
        {
          url: "/api/auth/open-api/generate-schema",
          title: "Auth",
        },
      ],
    })
  )
}
