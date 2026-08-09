import { AuthType } from "@repo/auth/server"
import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoBindings, HonoVariables } from "@mastra/hono"

export interface AppBindings {
  Bindings: HonoBindings
  Variables: HonoVariables & {
    requestId: string
    user: AuthType["user"]
    session: AuthType["session"]
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
