import type { AppOpenAPI } from "@/lib/types"
import { MastraServer } from "@mastra/hono"
import { mastra } from "@/mastra"

export async function configureMastra(app: AppOpenAPI) {
  const server = new MastraServer({
    app,
    mastra,
    prefix: "/api/mastra",
    openapiPath: "/openapi.json",
  })

  await server.init()
}
