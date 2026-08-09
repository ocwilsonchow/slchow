import type { AppOpenAPI } from "@/lib/types"
import { auth } from "@repo/auth/server"
import { Context } from "hono"

/** Better Auth HTTP endpoints (sign-in, callbacks, OpenAPI, etc.). */
export function configureBetterAuth(app: AppOpenAPI) {
  app.on(["POST", "GET"], "/api/auth/*", (c: Context) => {
    return auth.handler(c.req.raw)
  })
}
