import { app } from "@/app"

const port = Number(process.env.PORT) || 3004

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`API Server is running on port ${port}`)
