import { Resource } from "sst"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
  },
  // Mastra's PostgresStore auto-creates its own tables in the same database;
  // exclude them so drizzle-kit doesn't try to drop them on push
  tablesFilter: ["!mastra_*"],
})
