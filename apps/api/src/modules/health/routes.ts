import { createRoute, z } from "@hono/zod-openapi"

export const healthCheckRoute = createRoute({
  // tags,
  method: "get",
  path: "/check",
  summary: "Check",
  description: "Check if the service is running",
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
          }),
        },
      },
    },
  },
})

export type HealthCheckRoute = typeof healthCheckRoute
