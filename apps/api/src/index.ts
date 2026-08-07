import { serve } from "@hono/node-server"
import { app } from "@/app"

const port = Number(process.env.PORT) || 4111

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API Server is running on http://localhost:${info.port}`)
  }
)
