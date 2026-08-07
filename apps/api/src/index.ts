import { serve } from "@hono/node-server"
import { app } from "@/app"

// serve the app locally using bun
serve(
  {
    fetch: app.fetch,
    port: 3004,
  },
  (info) => {
    console.log(`API Server is running on port ${info.port}`)
  }
)
