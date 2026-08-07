import { Resource } from "sst"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
  },
})
