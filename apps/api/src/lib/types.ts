import { AuthType } from "@repo/auth/server"
import { OpenAPIHono } from "@hono/zod-openapi"

export interface AppBindings {
  Variables: {
    requestId: string
    user: AuthType["user"]
    session: AuthType["session"]
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
