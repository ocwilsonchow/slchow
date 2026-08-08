import { Mastra } from "@mastra/core/mastra"
import { MastraAuthBetterAuth } from "@mastra/auth-better-auth"
import { PinoLogger } from "@mastra/loggers"
import { PostgresStore } from "@mastra/pg"
import { DuckDBStore } from "@mastra/duckdb"
import { MastraCompositeStore } from "@mastra/core/storage"
import {
  Observability,
  MastraStorageExporter,
  MastraPlatformExporter,
  SensitiveDataFilter,
} from "@mastra/observability"
import { auth, type Auth } from "@repo/auth/server"
import { weatherWorkflow } from "./workflows/weather-workflow"
import { weatherAgent } from "./agents/weather-agent"
import { withLibpqSslCompat } from "@/utils/with-libpq-ssl-compat"
import { Resource } from "sst"
import { chatRoute } from "@mastra/ai-sdk"

export const mastra = new Mastra({
  server: {
    auth: new MastraAuthBetterAuth({
      // Better Auth's configured Auth<Options> is not assignable to bare Auth
      auth: auth as unknown as Auth,
      // OpenAPI spec route registered by MastraServer (prefix + openapiPath)
      public: ["/api/mastra/openapi.json"],
    }),
    apiRoutes: [
      chatRoute({
        path: "/chat",
        agent: weatherAgent.id,
      }),
    ],
  },
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new MastraCompositeStore({
    id: "composite-storage",
    default: new PostgresStore({
      id: "mastra-storage",
      connectionString: withLibpqSslCompat(Resource.DATABASE_URL.value),
    }),
    domains: {
      observability: await new DuckDBStore().getStore("observability"),
    },
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new MastraStorageExporter(), // Persists observability events to Mastra Storage
          new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
})
