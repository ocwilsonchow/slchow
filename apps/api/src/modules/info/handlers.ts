import type { AppBindings } from "@/lib/types"
import { HealthCheckRoute } from "./routes"
import { RouteHandler } from "@hono/zod-openapi"

export const healthCheckHandler: RouteHandler<
  HealthCheckRoute,
  AppBindings
> = async (c) => {
  return c.json({
    ok: true,
  })
}
