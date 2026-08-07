import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "./schema/index.ts"
import { Resource } from "sst"
import postgres from "postgres"

const client = postgres(Resource.DATABASE_URL.value, {
  ssl: "require",
})

export const db = drizzle(client, { schema })

export type Database = typeof db

export { and, asc, count, desc, eq } from "drizzle-orm"
