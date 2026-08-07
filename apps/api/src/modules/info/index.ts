import { healthCheckRoute } from "./routes"
import { healthCheckHandler } from "./handlers"
import { createRouter } from "@/lib/create-router"

const router = createRouter().openapi(healthCheckRoute, healthCheckHandler)

export default router
