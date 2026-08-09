import { createRoute, z } from "@hono/zod-openapi"

export const listAgentsRoute = createRoute({
  // tags,
  method: "get",
  path: "/list",
  summary: "List agents",
  description: "List all agents",
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

export type ListAgentsRoute = typeof listAgentsRoute
