import type { AppBindings } from "@/lib/types"
import { ListAgentsRoute } from "./routes"
import { RouteHandler } from "@hono/zod-openapi"

export const listAgentsHandler: RouteHandler<
  ListAgentsRoute,
  AppBindings
> = async (c) => {
  return c.json({
    ok: true,
    agents: [],
  })
}
