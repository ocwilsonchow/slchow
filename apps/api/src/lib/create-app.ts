import { createRouter } from "@/lib/create-router"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { requestId } from "hono/request-id"
import { siteHost } from "@repo/infra/domain"
import { Resource } from "sst"
import { HTTPException } from "hono/http-exception"

export async function createApp() {
  const app = createRouter()

  app.use(
    cors({
      origin: [
        "http://localhost:3000", // Mastra Studio
        "http://localhost:3003",
        `https://${siteHost(Resource.App.stage)}`,
      ],
      credentials: true,
    })
  )
  app.use(requestId())
  app.use(logger())
  app.notFound((c) => {
    return c.json(
      {
        ok: false,
        errors: [
          {
            message: "Not Found",
            source: "not_found",
          },
        ],
      },
      404
    )
  })
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json(
        {
          ok: false,
          errors: [{ message: err.message, source: "server" }],
        },
        err.status
      )
    }

    console.error(err)
    return c.json(
      {
        ok: false,
        errors: [{ message: err.message, source: "server" }],
      },
      500
    )
  })

  return app
}
